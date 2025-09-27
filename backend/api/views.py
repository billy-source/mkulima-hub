from rest_framework import generics, viewsets, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import BasePermission, AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from django.db.models import Sum
from datetime import datetime, timedelta
from django.conf import settings
import requests

from .models import Farmer, Product, Order, OrderItem, Payment, Cart
from .serializers import (
    UserSerializer, FarmerSerializer, ProductSerializer,
    OrderSerializer, PaymentSerializer, CartSerializer
)

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
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, "farmer")


def is_buyer(user):
    return getattr(user, "role", None) == "buyer"


# ==========================
# Helper Functions
# ==========================

def calculate_cart_total(user):
    items = Cart.objects.filter(user=user)
    total = sum(item.product.price * item.quantity for item in items)
    return items, total


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
    permission_classes = [AllowAny]
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


# ==========================
# Orders
# ==========================

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, "farmer"):
            return Order.objects.filter(items_product_farmer=user.farmer).distinct()
        return Order.objects.filter(user=user)


@api_view(["POST"])
@permission_classes([AllowAny])
def create_order_paystack(request):
    if not is_buyer(request.user):
        return Response({"error": "Only buyers can create orders"}, status=403)

    user = request.user
    items, total_amount = calculate_cart_total(user)
    if not items.exists():
        return Response({"error": "Cart is empty"}, status=400)

    delivery_address = request.data.get("delivery_address")
    phone_number = request.data.get("phone_number")
    notes = request.data.get("notes", "")

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

    payload = {
        "amount": int(total_amount * 100),
        "email": user.email,
        "callback_url": f"{settings.FRONTEND_URL}/payment-callback/",
        "reference": f"ORDER-{order.id}-{int(datetime.now().timestamp())}"
    }
    headers = {
        "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
        "Content-Type": "application/json"
    }
    response = requests.post("https://api.paystack.co/transaction/initialize", json=payload, headers=headers)
    data = response.json()

    if not data.get("status"):
        return Response({"error": "Payment initialization failed"}, status=400)

    Payment.objects.create(order=order, reference=data["data"]["reference"], amount=total_amount, status="pending")

    return Response({
        "message": "Order created, proceed to STK payment",
        "order_id": order.id,
        "authorization_url": data["data"]["authorization_url"],
        "payment_reference": data["data"]["reference"]
    }, status=201)


# ==========================
# Cart
# ==========================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def cart_items(request):
    if not is_buyer(request.user):
        return Response({"error": "Only buyers can access the cart"}, status=403)
    items, total = calculate_cart_total(request.user)
    return Response({"items": CartSerializer(items, many=True).data, "total": total})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    if not is_buyer(request.user):
        return Response({"error": "Only buyers can add items to the cart"}, status=403)

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

    items, total = calculate_cart_total(request.user)
    return Response({"items": CartSerializer(items, many=True).data, "total": total})


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, item_id):
    if not is_buyer(request.user):
        return Response({"error": "Only buyers can remove items"}, status=403)

    try:
        Cart.objects.get(id=item_id, user=request.user).delete()
    except Cart.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)

    items, total = calculate_cart_total(request.user)
    return Response({"items": CartSerializer(items, many=True).data, "total": total})


# ==========================
# Dashboard / Analytics
# ==========================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def recent_orders(request):
    user = request.user
    if hasattr(user, "farmer"):
        orders = Order.objects.filter(items_product_farmer=user.farmer).distinct().order_by("-created_at")[:5]
    else:
        orders = Order.objects.filter(user=user).order_by("-created_at")[:5]

    return Response([
        {
            "id": o.id,
            "buyer": o.user.username if o.user else "N/A",
            "total": o.total_amount,
            "status": o.status,
            "date": o.created_at.strftime("%Y-%m-%d"),
        } for o in orders
    ])


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def sales_trend(request):
    if not hasattr(request.user, "farmer"):
        return Response([])

    today = datetime.now()
    data = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        total = Order.objects.filter(
            items_product_farmer=request.user.farmer,
            created_at__date=day.date()
        ).aggregate(total=Sum("total_amount"))["total"] or 0
        data.append({"date": day.strftime("%b %d"), "sales": total})
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def farmer_dashboard_summary(request):
    if not hasattr(request.user, "farmer"):
        return Response({"error": "Not a farmer"}, status=403)

    farmer = request.user.farmer
    return Response({
        "products": Product.objects.filter(farmer=farmer).count(),
        "orders": Order.objects.filter(items_product_farmer=farmer).count(),
        "sales": Order.objects.filter(items_product_farmer=farmer).aggregate(total=Sum("total_amount"))["total"] or 0
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def buyer_dashboard_summary(request):
    if hasattr(request.user, "farmer"):
        return Response({"error": "Farmers not allowed"}, status=403)

    return Response({
        "orders": Order.objects.filter(user=request.user).count(),
        "spent": Order.objects.filter(user=request.user).aggregate(total=Sum("total_amount"))["total"] or 0
    })
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_cart_item(request, item_id):
    if not is_buyer(request.user):
        return Response({"error": "Only buyers can update the cart"}, status=403)

    try:
        item = Cart.objects.get(id=item_id, user=request.user)
    except Cart.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)

    quantity = request.data.get("quantity")
    if quantity is None or int(quantity) <= 0:
        return Response({"error": "Quantity must be greater than zero"}, status=400)

    item.quantity = int(quantity)
    item.save()

    items = Cart.objects.filter(user=request.user)
    serializer = CartSerializer(items, many=True)
    total = sum(i.product.price * i.quantity for i in items)

    return Response({"items": serializer.data, "total": total})
