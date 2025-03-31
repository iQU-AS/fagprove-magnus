from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import GroceryList, GroceryItem
from .serializers import (
    GroceryItemSerializer,
)
from rest_framework.permissions import IsAuthenticated



class GroceryItemAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, list_id):
        items = GroceryItem.objects.filter(list_id=list_id, bought=False)
        serializer = GroceryItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request, list_id):
        grocery_list = GroceryList.objects.get(id=list_id)
        if (
            request.user != grocery_list.owner
            and request.user not in grocery_list.members.all()
        ):
            return Response(status=status.HTTP_403_FORBIDDEN)


        data = request.data.copy()
        data["requested_by_id"] = request.user.id
        serializer = GroceryItemSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, list_id, pk):
        try:
            item = GroceryItem.objects.get(pk=pk, list_id=list_id)
        except GroceryItem.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        data = request.data.copy()
        data["requested_by_id"] = request.user.id
        serializer = GroceryItemSerializer(item, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, list_id, pk):
        try:
            item = GroceryItem.objects.get(pk=pk, list_id=list_id)
        except GroceryItem.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

