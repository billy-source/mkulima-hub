from rest_framework import generics, viewsets, filters, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import BasePermission, AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from django.db.models import Sum
from datetime import datetime, timedelta
from .models import Farmer, Product, Order, OrderItem, Payment, Delivery, Review, Cart
from .serializers import (
    UserSerializer, FarmerSerializer, ProductSerializer,
    OrderSerializer, PaymentSerializer, DeliverySerializer,
    ReviewSerializer, CartSerializer
)
import requests
from django.conf import settings
import json, hmac, hashlib

User = get_user_model()

# ==========================
# Authentication & User Info
# ==========================

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_info(request):
    """Fetch logged-in user details"""
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role": user.role
    })

# ==========================
# Permissions
# ==========================

class IsFarmer(BasePermission):
    """Allow access only to users with a farmer profile."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, "farmer")

# ==========================
# CRUD ViewSets
# ==========================

class FarmerViewSet(viewsets.ModelViewSet):
    queryset = Farmer.objects.all()
    serializer_class = FarmerSerializer
    permission_classes = [IsAuthenticated]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]  # Must be a list
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "description", "category"]
    ordering_fields = ["name", "price", "created_at"]
    ordering = ["name"]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, "farmer"):
            return Product.objects.filter(farmer=user.farmer)
        return Product.objects.all()

    def perform_create(self, serializer):
        if hasattr(self.request.user, "farmer"):
            serializer.save(farmer=self.request.user.farmer)
        else:
            raise PermissionDenied("Only farmers can add products")

    def perform_update(self, serializer):
        if serializer.instance.farmer != self.request.user.farmer:
            raise PermissionDenied("You can only edit your own products")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.farmer != self.request.user.farmer:
            raise PermissionDenied("You can only delete your own products")
        instance.delete()


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, "farmer"):
            return Order.objects.filter(items__product__farmer=user.farmer).distinct()
        return Order.objects.filter(user=user)


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]


class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer
    permission_classes = [IsAuthenticated]


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

# ==========================
# Cart Endpoints
# ==========================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def cart_items(request):
    items = Cart.objects.filter(user=request.user)
    serializer = CartSerializer(items, many=True)
    total = sum(item.product.price * item.quantity for item in items)
    return Response({"items": serializer.data, "total": total})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get("product_id")
    quantity = int(request.data.get("quantity", 1))
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

    cart_item, created = Cart.objects.get_or_create(
        user=request.user, product=product, defaults={"quantity": quantity}
    )
    if not created:
        cart_item.quantity = quantity
        cart_item.save()

    items = Cart.objects.filter(user=request.user)
    serializer = CartSerializer(items, many=True)
    total = sum(item.product.price * item.quantity for item in items)
    return Response({"items": serializer.data, "total": total})

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, item_id):
    try:
        item = Cart.objects.get(id=item_id, user=request.user)
        item.delete()
    except Cart.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)

    items = Cart.objects.filter(user=request.user)
    serializer = CartSerializer(items, many=True)
    total = sum(item.product.price * item.quantity for item in items)
    return Response({"items": serializer.data, "total": total})

# ==========================
# Paystack Payment
# ==========================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order_paystack(request):
    user = request.user
    items = Cart.objects.filter(user=user)
    if not items.exists():
        return Response({"error": "Cart is empty"}, status=400)

    delivery_address = request.data.get("delivery_address")
    phone_number = request.data.get("phone_number")
    notes = request.data.get("notes", "")

    total_amount = sum(item.product.price * item.quantity for item in items)
    total_kobo = int(total_amount * 100)

    order = Order.objects.create(
        user=user,
        delivery_address=delivery_address,
        phone_number=phone_number,
        notes=notes,
        total_amount=total_amount,
        status="pending"
    )

    for item in items:
        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price
        )

    items.delete()

    headers = {
        "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "amount": total_kobo,
        "email": user.email,
        "callback_url": f"{settings.FRONTEND_URL}/payment-callback/",
        "reference": f"ORDER-{order.id}-{int(datetime.now().timestamp())}"
    }

    response = requests.post(
        "https://api.paystack.co/transaction/initialize",
        json=payload,
        headers=headers
    )
    paystack_data = response.json()

    if not paystack_data.get("status"):
        return Response({"error": "Payment initialization failed"}, status=400)

    Payment.objects.create(
        order=order,
        reference=paystack_data["data"]["reference"],
        amount=total_amount,
        status="pending"
    )

    return Response({
        "message": "Order created, proceed to STK payment",
        "order_id": order.id,
        "authorization_url": paystack_data["data"]["authorization_url"],
        "payment_reference": paystack_data["data"]["reference"]
    }, status=201)

@api_view(["POST"])
@permission_classes([AllowAny])
def paystack_webhook(request):
    secret = settings.PAYSTACK_SECRET_KEY
    hash_header = request.META.get("HTTP_X_PAYSTACK_SIGNATURE", "")
    payload = request.body

    if not hmac.compare_digest(hmac.new(secret.encode(), payload, hashlib.sha512).hexdigest(), hash_header):
        return Response(status=400)

    event = json.loads(payload)
    if event["event"] == "charge.success":
        reference = event["data"]["reference"]
        try:
            payment = Payment.objects.get(reference=reference)
            payment.status = "paid"
            payment.save()
            order = payment.order
            order.status = "paid"
            order.save()
        except Payment.DoesNotExist:
            pass

    return Response(status=200)

# ==========================
# Dashboard Endpoints
# ==========================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def recent_orders(request):
    user = request.user
    if hasattr(user, "farmer"):
        orders = Order.objects.filter(items__product__farmer=user.farmer).distinct().order_by("-created_at")[:5]
    else:
        orders = Order.objects.filter(user=user).order_by("-created_at")[:5]

    data = [
        {
            "id": o.id,
            "buyer": o.user.username if o.user else "N/A",
            "total": o.total_amount,
            "status": o.status,
            "date": o.created_at.strftime("%Y-%m-%d"),
        }
        for o in orders
    ]
    return Response(data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def sales_trend(request):
    user = request.user
    if not hasattr(user, "farmer"):
        return Response([])

    today = datetime.now()
    data = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        total = Order.objects.filter(
            items__product__farmer=user.farmer,
            created_at__date=day.date()
        ).aggregate(total=Sum("total_amount"))["total"] or 0
        data.append({"date": day.strftime("%b %d"), "sales": total})

    return Response(data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def farmer_dashboard_summary(request):
    user = request.user
    if not hasattr(user, "farmer"):
        return Response({"error": "Not a farmer"}, status=403)

    farmer = user.farmer
    return Response({
        "products": Product.objects.filter(farmer=farmer).count(),
        "orders": Order.objects.filter(items__product__farmer=farmer).count(),
        "sales": Order.objects.filter(items__product__farmer=farmer).aggregate(total=Sum("total_amount"))["total"] or 0
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def buyer_dashboard_summary(request):
    user = request.user
    if hasattr(user, "farmer"):
        return Response({"error": "Farmers not allowed"}, status=403)

    return Response({
        "orders": Order.objects.filter(user=user).count(),
        "spent": Order.objects.filter(user=user).aggregate(total=Sum("total_amount"))["total"] or 0
    })
