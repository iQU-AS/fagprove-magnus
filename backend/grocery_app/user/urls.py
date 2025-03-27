from django.urls import path
from user.views import UserDetailView, RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


user_urls = [
    path("api/auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/register/", RegisterView.as_view(), name="register"),
    path("api/user/", UserDetailView.as_view(), name="user_detail"),
]
