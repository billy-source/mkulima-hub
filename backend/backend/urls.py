from django.contrib import admin
from django.urls import path, include
from api import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/user/register/", views.RegisterView.as_view(), name="register"),

    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),

   
    path("dashboard/orders/recent/", views.recent_orders),
    path("dashboard/sales/trend/", views.sales_trend),

   
    path("user/info/", views.user_info, name="user_info"),
]
