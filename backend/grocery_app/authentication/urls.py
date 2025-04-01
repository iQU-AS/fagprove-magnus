from django.urls import path

from authentication.views import (
    CookieLoginView,
    CookieRefreshView,
    LogoutView,
    RegisterView,
)


authentication_urls = [
    path("api/auth/login/", CookieLoginView.as_view(), name="login"),
    path("api/auth/refresh/", CookieRefreshView.as_view(), name="refresh"),
    path("api/auth/register/", RegisterView.as_view(), name="register"),
    path("api/auth/logout/", LogoutView.as_view(), name="logout"),
]
