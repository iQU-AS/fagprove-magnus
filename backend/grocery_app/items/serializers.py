from rest_framework import serializers
from items.models import GroceryItem
from user.serializers import UserMiniSerializer
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
