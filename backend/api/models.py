

from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal

class Profile(models.Model):
    ROLE_CHOICES = (("farmer", "Farmer"), ("buyer", "Buyer"))
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    phone = models.CharField(max_length=30, blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="buyer")
    verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} ({self.role})"


class Product(models.Model):
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="products")
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)  # in KES
    stock = models.PositiveIntegerField(default=0)
    image = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} — {self.farmer.username}"


class Order(models.Model):
    STATUS = (
        ("pending", "Pending Payment"),
        ("paid", "Paid"),
        ("processing", "Processing"),
        ("shipped", "Shipped"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    )
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    shipping_address = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    mpesa_transaction_id = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f"Order {self.id} — {self.buyer.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)

    def line_total(self):
        return self.unit_price * self.quantity

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"


class Payment(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="payment")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    mpesa_checkout_request_id = models.CharField(max_length=200, blank=True, null=True)
    mpesa_response = models.JSONField(blank=True, null=True)
    paid = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for Order {self.order.id} - {'PAID' if self.paid else 'PENDING'}"

