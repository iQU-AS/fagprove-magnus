from django.urls import path
from .views import (
    GroceryListAPIView,
    GroceryItemAPIView,
    LeaveGroceryListAPIView,
    ProductAPIView,
    SingleGroceryListAPIView,
)

grocery_urls = [
    path(
        'api/single-grocery-list/<int:pk>/',
        SingleGroceryListAPIView.as_view(),
        name='single-grocery-list',
    ),
    path('api/grocery-lists/', GroceryListAPIView.as_view(), name='grocery-lists'),
    path(
        'api/grocery-lists/<int:pk>/',
        GroceryListAPIView.as_view(),
        name='grocery-lists',
    ),
    path(
        'api/grocery-lists/<int:pk>/leave/',
        LeaveGroceryListAPIView.as_view(),
        name='grocery-lists',
    ),
    path(
        'api/grocery-items/<int:list_id>/',
        GroceryItemAPIView.as_view(),
        name='grocery-items',
    ),
    path('api/grocery-items/<int:list_id>/<int:pk>/', GroceryItemAPIView.as_view()),
    path('api/products/', ProductAPIView.as_view(), name='products'),
]
