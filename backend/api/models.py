from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from decimal import Decimal

# ==========================
# Custom User Model
# ==========================
class User(AbstractUser):
    ROLE_CHOICES = (
        ("farmer", "Farmer"),
        ("buyer", "Buyer"),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="buyer")
    phone = models.CharField(max_length=15, unique=True)

    groups = models.ManyToManyField(
        "auth.Group", related_name="custom_user_groups", blank=True
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission", related_name="custom_user_permissions", blank=True
    )

    def __str__(self):
        return f"{self.username} ({self.role})"


# ==========================
# Farmer Profile
# ==========================
class Farmer(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True
    )
    farm_name = models.CharField(max_length=100, default="")
    location = models.CharField(max_length=100, default="")
    verified = models.BooleanField(default=False)

    def __str__(self):
        return self.farm_name


# ==========================
# Products
# ==========================
class Product(models.Model):
    CATEGORY_CHOICES = [
        ("fruits", "Fruits"),
        ("vegetables", "Vegetables"),
        ("cereals", "Cereals"),
        ("legumes", "Legumes"),
        ("tubers", "Tubers"),
        ("others", "Others"),
    ]

    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name="products")
    name = models.CharField(max_length=255, default="")
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="others")
    stock = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.farmer.farm_name}"


# ==========================
# Orders & Order Items
# ==========================
class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("cancelled", "Cancelled"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    delivery_address = models.TextField(default="")
    phone_number = models.CharField(max_length=20, default="")
    notes = models.TextField(blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    payment_reference = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.user.username} - {self.status}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"


# ==========================
# Payments
# ==========================
class Payment(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    reference = models.CharField(max_length=100, unique=True, default="")
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    status = models.CharField(max_length=20, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.reference} - {self.status}"


# ==========================
# Delivery
# ==========================
class Delivery(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, default="preparing")
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Delivery for Order {self.order.id} - {self.status}"


# ==========================
# Reviews
# ==========================
class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(default=1)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.buyer.username} - {self.rating}⭐"


# ==========================
# Cart
# ==========================
class Cart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "product")

    def __str__(self):
        return f"{self.user.username} - {self.product.name} x {self.quantity}"
