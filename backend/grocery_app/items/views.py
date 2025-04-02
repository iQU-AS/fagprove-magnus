from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import GroceryList, GroceryItem
from .serializers import (
    GroceryItemSerializer,
)
from rest_framework.permissions import IsAuthenticated
from datetime import timedelta
from django.utils import timezone
from django.http import JsonResponse


class GroceryItemAPIView(APIView):
    """
    API-endepunkt for å hente, legge til, oppdatere og slette dagligvarer i en spesifikk handleliste.
    
    Krever at brukeren er autentisert. Brukeren må være eier eller medlem av listen for å legge til varer.
    """
    permission_classes = [IsAuthenticated]

    def get(self, _, list_id):
        """
        Returnerer alle varer i en gitt handleliste som ikke er markert som kjøpt.
        """
        items = GroceryItem.objects.filter(list_id=list_id, bought=False)
        serializer = GroceryItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request, list_id):
        """
        Legger til en ny vare i en gitt handleliste.
        Krever at brukeren er eier eller medlem av listen.
        """
        grocery_list = GroceryList.objects.get(id=list_id)
        if request.user != grocery_list.owner and request.user not in grocery_list.members.all():
            return Response(status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        data['requested_by_id'] = request.user.id
        serializer = GroceryItemSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, list_id, pk):
        """
        Oppdaterer en eksisterende vare i en handleliste basert på vare-ID (pk).
        """
        try:
            item = GroceryItem.objects.get(pk=pk, list_id=list_id)
        except GroceryItem.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        data['requested_by_id'] = request.user.id
        data['bought'] = False
        serializer = GroceryItemSerializer(item, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, _, list_id, pk):
        """
        Sletter en vare fra handlelisten basert på vare-ID (pk).
        """
        try:
            item = GroceryItem.objects.get(pk=pk, list_id=list_id)
        except GroceryItem.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class BoughtItemsAPIView(APIView):
    """
    Returnerer en oversikt over kjøpte varer basert på valgt tidsintervall.
    
    Støttede intervaller: 'today', 'this_week', 'last_month'.
    Krever at brukeren er autentisert.
    """
    def get(self, request):
        """
        Henter kjøpte varer for brukeren basert på query-parametret 'range'.
        """
        range_param = request.GET.get('range', 'today')
        now = timezone.now()

        if range_param == 'today':
            start = now.replace(hour=0, minute=0, second=0, microsecond=0)
            items = GroceryItem.objects.filter(
                bought=True, bought_at__gte=start, bought_by=request.user
            )

        elif range_param == 'this_week':
            start = (now - timedelta(days=now.weekday())).replace(
                hour=0, minute=0, second=0, microsecond=0
            )
            items = GroceryItem.objects.filter(
                bought=True, bought_at__gte=start, bought_by=request.user
            )

        elif range_param == 'last_month':
            first_of_this_month = now.replace(day=1)
            last_month_end = first_of_this_month - timedelta(days=1)
            start = last_month_end.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            end = last_month_end.replace(hour=23, minute=59, second=59, microsecond=999999)
            items = GroceryItem.objects.filter(
                bought=True, bought_at__range=(start, end), bought_by=request.user
            )

        else:
            return JsonResponse({'error': 'Invalid range'}, status=400)

        data = [
            {
                'product': item.product.name,
                'price': item.product.price,
                'quantity': item.quantity,
                'bought_at': item.bought_at.isoformat(),
            }
            for item in items
        ]

        return JsonResponse(data, safe=False)
