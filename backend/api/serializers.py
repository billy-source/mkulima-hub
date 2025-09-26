from rest_framework import serializers
from .models import User, Farmer, Product, Order, OrderItem, Payment, Delivery, Review, Cart

# =======================
# User Serializer
# =======================
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "phone", "role", "password"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

# =======================
# Farmer Serializer
# =======================
class FarmerSerializer(serializers.ModelSerializer):
    user_detail = UserSerializer(source="user", read_only=True)

    class Meta:
        model = Farmer
        fields = ["user", "user_detail", "farm_name", "location", "verified"]

# =======================
# Product Serializer
# =======================
class ProductSerializer(serializers.ModelSerializer):
    # Display the farmer's name (read-only)
    farmer_name = serializers.CharField(source="farmer.farm_name", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "farmer",
            "farmer_name",
            "name",
            "description",
            "price",
            "category",
            "created_at"
        ]
        read_only_fields = ["farmer", "farmer_name", "created_at"]

# =======================
# Order and OrderItem Serializers
# =======================
class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_price = serializers.DecimalField(source="product.price", max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "order", "product", "product_name", "product_price", "quantity"]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, source="orderitem_set", read_only=True)

    class Meta:
        model = Order
        fields = ["id", "buyer", "products", "total", "status", "created_at", "items"]
        read_only_fields = ["buyer", "created_at", "items"]

# =======================
# Payment Serializer
# =======================
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", "order", "checkout_id", "status"]

# =======================
# Delivery Serializer
# =======================
class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = ["id", "order", "status"]

# =======================
# Review Serializer
# =======================
class ReviewSerializer(serializers.ModelSerializer):
    buyer_username = serializers.CharField(source="buyer.username", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = Review
        fields = ["id", "product", "product_name", "buyer", "buyer_username", "rating", "comment"]

# =======================
# Cart Serializer
# =======================
class CartSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_price = serializers.DecimalField(source="product.price", max_digits=10, decimal_places=2, read_only=True)
    farmer_name = serializers.CharField(source="product.farmer.farm_name", read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "user", "product", "product_name", "product_price", "farmer_name", "quantity", "added_at"]
        read_only_fields = ["user", "product_name", "product_price", "farmer_name", "added_at"]
