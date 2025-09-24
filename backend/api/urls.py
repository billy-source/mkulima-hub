from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, FarmerViewSet, ProductViewSet, OrderViewSet, PaymentViewSet, DeliveryViewSet, ReviewViewSet

router = DefaultRouter()
router.register("farmers", FarmerViewSet)
router.register("products", ProductViewSet)
router.register("orders", OrderViewSet)
router.register("payments", PaymentViewSet)
router.register("deliveries", DeliveryViewSet)
router.register("reviews", ReviewViewSet)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("", include(router.urls)),
]
