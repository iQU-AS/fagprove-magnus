from rest_framework import serializers
from django.contrib.auth.models import User
from products.models import Product


class ProductSerializer(serializers.ModelSerializer):
    # Write-only inputs using IDs
    created_by_id = serializers.PrimaryKeyRelatedField(
        source="created_by", queryset=User.objects.all(), write_only=True
    )

    class Meta:
        model = Product
        fields = "__all__"
