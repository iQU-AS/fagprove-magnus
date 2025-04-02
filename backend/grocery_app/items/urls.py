from django.urls import path

from items.views import BoughtItemsAPIView, GroceryItemAPIView

items_urls = [
    path(
        'api/grocery-items/<int:list_id>/',
        GroceryItemAPIView.as_view(),
        name='grocery-items',
    ),
    path('api/grocery-items/<int:list_id>/<int:pk>/', GroceryItemAPIView.as_view()),
    path('api/bought-items/', BoughtItemsAPIView.as_view(), name='bought-items'),
]
