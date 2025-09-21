from django.shortcuts import render 
from django.contrib.auth.models import User 
from rest_framework import generics 
from .serializers import UserSerializer 
from rest_framework.permissions import IsAuthenticated, AllowAny 
from .models import * 
 
from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User, Farmer, Product, Order, OrderItem, Payment, Delivery, Review
from .serializers import *

# User Registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# CRUD for Farmers
class FarmerViewSet(viewsets.ModelViewSet):
    queryset = Farmer.objects.all()
    serializer_class = FarmerSerializer
    permission_classes = [IsAuthenticated]

# CRUD for Products
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

# CRUD for Orders
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

# CRUD for Payments
class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

# CRUD for Deliveries
class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer
    permission_classes = [IsAuthenticated]

# CRUD for Reviews
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
