from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializers import (
    ProductSerializer,
)
from rest_framework.permissions import IsAuthenticated


class ProductAPIView(APIView):
    """
    Henter, oppretter eller sletter produkter i systemet.

    Krever at brukeren er autentisert. Produkter kan filtreres på hvem som har opprettet dem.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Returnerer en liste med produkter.

        Hvis query-parameter `only_mine=true` er satt, returneres kun produkter opprettet av brukeren.
        """
        only_mine = request.query_params.get('only_mine')
        products = Product.objects.all()
        if only_mine in ['true', 'True', '1']:
            products = products.filter(created_by=request.user)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        """
        Oppretter et nytt produkt med innlogget bruker som oppretter.
        """
        data = request.data.copy()
        data['created_by_id'] = request.user.id
        serializer = ProductSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, _, product_id=None):
        """
        Sletter et spesifikt produkt basert på produkt-ID.

        Returnerer 400 hvis ID mangler, eller 404 hvis produktet ikke finnes.
        """
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
