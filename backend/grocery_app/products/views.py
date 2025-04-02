from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializers import (
    ProductSerializer,
)
from rest_framework.permissions import IsAuthenticated


class ProductAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        only_mine = request.query_params.get('only_mine')
        products = Product.objects.all()
        if only_mine in ['true', 'True', '1']:
            products = products.filter(created_by=request.user)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        data['created_by_id'] = request.user.id
        serializer = ProductSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, _, product_id=None):
        if product_id is None:
            return Response(
                {'detail': 'Product ID is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            product = Product.objects.get(id=product_id)
            product.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({'detail': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)
