from lists.models import GroceryList
from user.serializers import UserMiniSerializer
from rest_framework import serializers
from django.contrib.auth.models import User


class GroceryListSerializer(serializers.ModelSerializer):
    # Read-only nested output
    owner = UserMiniSerializer(read_only=True)
    members = UserMiniSerializer(read_only=True, many=True)

    # Write-only inputs using IDs
    owner_id = serializers.PrimaryKeyRelatedField(
        source="owner", queryset=User.objects.all(), write_only=True
    )
    member_ids = serializers.PrimaryKeyRelatedField(
        source="members",
        queryset=User.objects.all(),
        many=True,
        write_only=True,
        required=False,
    )

    class Meta:
        model = GroceryList
        fields = "__all__"
