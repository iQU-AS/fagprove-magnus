from django.urls import path
from user.views import UserDetailView


user_urls = [
    path("api/user/", UserDetailView.as_view(), name="user_detail"),
]
