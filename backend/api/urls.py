from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'farmers', views.FarmerViewSet, basename='farmer')
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'orders', views.OrderViewSet, basename='order')
router.register(r'payments', views.PaymentViewSet, basename='payment')
router.register(r'deliveries', views.DeliveryViewSet, basename='delivery')
router.register(r'reviews', views.ReviewViewSet, basename='review')

urlpatterns = [
    # ====================
    # Auth & User Info
    # ====================
    path('user/register/', views.RegisterView.as_view(), name='register'),
    path('user/info/', views.user_info, name='user_info'),

    # ====================
    # Cart Endpoints
    # ====================
    path('cart/', views.cart_items, name='cart_items'),
    path('cart/add/', views.add_to_cart, name='add_to_cart'),
    path('cart/remove/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),

    # ====================
    # Paystack
    # ====================
    path('orders/create/', views.create_order_paystack, name='create_order_paystack'),
    path('paystack/webhook/', views.paystack_webhook, name='paystack_webhook'),

    # ====================
    # Dashboard
    # ====================
    path('dashboard/farmer/', views.farmer_dashboard_summary, name='farmer_dashboard'),
    path('dashboard/buyer/', views.buyer_dashboard_summary, name='buyer_dashboard'),
    path('dashboard/orders/recent/', views.recent_orders, name='recent_orders'),
    path('dashboard/sales/trend/', views.sales_trend, name='sales_trend'),

    # ====================
    # Router endpoints
    # ====================
    path('', include(router.urls)),
]
