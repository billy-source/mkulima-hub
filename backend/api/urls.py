from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

# ====================
# Router endpoints
# ====================
router = DefaultRouter()
router.register(r'farmers', views.FarmerViewSet, basename='farmer')
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'orders', views.OrderViewSet, basename='order')
# ====================
# URL patterns
# ====================
urlpatterns = [
    # --------------------
    # Auth & User Info
    # --------------------
    path("api/user/register/", views.RegisterView.as_view(), name="register"),
    path("user/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("user/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("user/info/", views.user_info, name="user_info"),
    path("api/user/info/", views.user_info, name="user_info"),
    # ... rest of endpoints
              
    # --------------------
    # Cart Endpoints (Buyers only)
    # --------------------
    path("cart/", views.cart_items, name="cart_items"),
    path("cart/add/", views.add_to_cart, name="add_to_cart"),
    path("cart/remove/<int:item_id>/", views.remove_from_cart, name="remove_from_cart"),
    path("cart/update/<int:item_id>/", views.update_cart_item, name="update-cart-item"),

    # --------------------
    # Paystack
    # --------------------
    path("orders/create/", views.create_order_paystack, name="create_order_paystack"),
   

   
   
    # Dashboard
    # --------------------
    path("dashboard/farmer/", views.farmer_dashboard_summary, name="farmer_dashboard"),
    path("dashboard/buyer/", views.buyer_dashboard_summary, name="buyer_dashboard"),
    path("dashboard/orders/recent/", views.recent_orders, name="recent_orders"),
    path("dashboard/sales/trend/", views.sales_trend, name="sales_trend"),

    # --------------------
    # Include router endpoints
    # --------------------
    path("", include(router.urls)),
]
