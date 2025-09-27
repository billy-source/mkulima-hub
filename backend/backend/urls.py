from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api import views
urlpatterns = [
    path("admin/", admin.site.urls),

    # ====================
    # Auth & JWT
    # ====================  
     path("api/user/register/", views.RegisterView.as_view(), name="register"),  
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),



    path("api/", include("api.urls")),
    
]
