from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db.models import Sum
from datetime import datetime, timedelta
from .models import Farmer, Product, Order, OrderItem, Payment, Delivery, Review
from .serializers import (
    UserSerializer, FarmerSerializer, ProductSerializer,
    OrderSerializer, PaymentSerializer, DeliverySerializer, ReviewSerializer
)

User = get_user_model()

# ==========================
# Authentication & User Info
# ==========================

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# Fetch Logged-in User Info
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
        "role": "farmer" if hasattr(user, "farmer") else "buyer"
    })


# ==========================
# CRUD Endpoints
# ==========================

class FarmerViewSet(viewsets.ModelViewSet):
    queryset = Farmer.objects.all()
    serializer_class = FarmerSerializer
    permission_classes = [IsAuthenticated]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

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
# Dashboard Endpoints
# ==========================

# 1. Recent Orders
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def recent_orders(request):
    user = request.user
    if hasattr(user, "farmer"):
        orders = Order.objects.filter(products__farmer=user.farmer).distinct().order_by("-created_at")[:5]
    else:
        orders = Order.objects.filter(buyer=user).order_by("-created_at")[:5]

    data = [
        {
            "id": o.id,
            "buyer": o.buyer.username if o.buyer else "N/A",
            "total": o.total_price,
            "status": o.status,
            "date": o.created_at.strftime("%Y-%m-%d"),
        }
        for o in orders
    ]
    return Response(data)


# 2. Sales Trend (7 Days) for Farmers
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def sales_trend(request):
    user = request.user
    if not hasattr(user, "farmer"):
        return Response([])

    today = datetime.now()
    data = []
    for i in range(6, -1, -1):  # last 7 days
        day = today - timedelta(days=i)
        total = Order.objects.filter(
            products__farmer=user.farmer,
            created_at__date=day.date()
        ).aggregate(total=Sum("total_price"))["total"] or 0
        data.append({"date": day.strftime("%b %d"), "sales": total})

    return Response(data)


# 3. Farmer Dashboard Summary
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def farmer_dashboard_summary(request):
    user = request.user
    if not hasattr(user, "farmer"):
        return Response({"error": "Not a farmer"}, status=403)

    farmer = user.farmer
    products_count = Product.objects.filter(farmer=farmer).count()
    orders_count = Order.objects.filter(products__farmer=farmer).count()
    total_sales = Order.objects.filter(products__farmer=farmer).aggregate(total=Sum("total_price"))["total"] or 0

    return Response({
        "products": products_count,
        "orders": orders_count,
        "sales": total_sales
    })


# 4. Buyer Dashboard Summary
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def buyer_dashboard_summary(request):
    user = request.user
    if hasattr(user, "farmer"):
        return Response({"error": "Farmers not allowed"}, status=403)

    orders_count = Order.objects.filter(buyer=user).count()
    total_spent = Order.objects.filter(buyer=user).aggregate(total=Sum("total_price"))["total"] or 0

    return Response({
        "orders": orders_count,
        "spent": total_spent
    })
