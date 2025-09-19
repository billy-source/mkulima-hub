from django.urls import path
from .views import RegisterView, ProductListAPIView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('products/', ProductListAPIView.as_view(), name='product-list'),
]