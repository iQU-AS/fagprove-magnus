from django.urls import path

from items.views import GroceryItemAPIView

items_urls = [
    path(
        "api/grocery-items/<int:list_id>/",
        GroceryItemAPIView.as_view(),
        name="grocery-items",
    ),
    path("api/grocery-items/<int:list_id>/<int:pk>/", GroceryItemAPIView.as_view()),
]
