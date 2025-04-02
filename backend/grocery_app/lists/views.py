from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from items.models import GroceryItem
from items.serializers import GroceryItemSerializer
from .models import GroceryList
from .serializers import (
    GroceryListSerializer,
)
from .models import GroceryListInviteToken
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from django.db import transaction


class SingleGroceryListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            grocery_list = (
                GroceryList.objects.filter(pk=pk)
                .filter(Q(owner=request.user) | Q(members=request.user))
                .get()
            )
        except GroceryList.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = GroceryListSerializer(grocery_list)
        return Response(serializer.data)


class GroceryListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        lists = GroceryList.objects.filter(
            Q(owner=request.user) | Q(members=request.user)
        ).distinct()
        serializer = GroceryListSerializer(lists, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        data['owner_id'] = request.user.id
        serializer = GroceryListSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                GroceryListSerializer(serializer.instance).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, _, pk):
        try:
            grocery_list = GroceryList.objects.get(pk=pk)
        except GroceryList.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        grocery_list.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class LeaveGroceryListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            grocery_list = GroceryList.objects.get(pk=pk)
        except GroceryList.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if request.user == grocery_list.owner:
            return Response(
                {'detail': 'Owner cannot leave the list. Transfer ownership or delete the list.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        grocery_list.members.remove(request.user)
        return Response({'detail': 'Left the list successfully.'}, status=status.HTTP_200_OK)


class CreateInviteLinkView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, list_id):
        grocery_list = get_object_or_404(GroceryList, id=list_id)

        if request.user != grocery_list.owner:
            return Response({'detail': 'Only the owner can generate invite links.'}, status=403)

        token = GroceryListInviteToken.objects.create(grocery_list=grocery_list)
        return Response({'invite_token': token.token}, status=201)


class JoinListWithTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, token):
        invite = get_object_or_404(GroceryListInviteToken, token=token)

        if not invite.is_valid():
            return Response({'detail': 'Invalid or expired invite link.'}, status=400)

        grocery_list = invite.grocery_list
        user = request.user

        if user == grocery_list.owner or user in grocery_list.members.all():
            return Response({'detail': 'Already a member.'}, status=200)

        grocery_list.members.add(user)
        invite.save()

        return Response({'detail': 'Successfully joined the grocery list.'}, status=200)


class FinishShopping(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, list_id):
        item_ids = request.data.get('item_ids', [])
        if not isinstance(item_ids, list):
            return Response({'detail': 'item_ids must be a list.'}, status=400)

        items_to_update = GroceryItem.objects.select_for_update().filter(
            id__in=item_ids, list_id=list_id
        )

        for item in items_to_update:
            item.bought = True
            item.bought_by = request.user
            item.save()

        updated_items = GroceryItem.objects.filter(list_id=list_id)
        serializer = GroceryItemSerializer(updated_items, many=True)

        return Response(serializer.data, status=200)
