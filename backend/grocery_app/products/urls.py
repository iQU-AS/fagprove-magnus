from django.urls import path
from .views import (
    ProductAPIView,
)

products_urls = [
    path('api/products/', ProductAPIView.as_view(), name='products'),
    path('api/products/<int:product_id>/', ProductAPIView.as_view(), name='products'),
]
