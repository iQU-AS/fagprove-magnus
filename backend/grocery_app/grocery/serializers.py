from rest_framework import serializers

from user.serializers import UserMiniSerializer
from .models import GroceryList, GroceryItem, Product
from django.contrib.auth.models import User


class GroceryItemSerializer(serializers.ModelSerializer):
    # Read-only nested output
    requested_by = UserMiniSerializer(read_only=True)

    # Write-only inputs using IDs
    requested_by_id = serializers.PrimaryKeyRelatedField(
        source="requested_by",
        queryset=User.objects.all(),
        write_only=True
    )

    class Meta:
        model = GroceryItem
        fields = "__all__"


class GroceryListSerializer(serializers.ModelSerializer):
    # Read-only nested output
    owner = UserMiniSerializer(read_only=True)
    members = UserMiniSerializer(read_only=True, many=True)

    # Write-only inputs using IDs
    owner_id = serializers.PrimaryKeyRelatedField(
        source="owner",
        queryset=User.objects.all(),
        write_only=True
    )
    member_ids = serializers.PrimaryKeyRelatedField(
        source="members",
        queryset=User.objects.all(),
        many=True,
        write_only=True,
        required=False
    )

    class Meta:
        model = GroceryList
        fields = "__all__"



class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"
