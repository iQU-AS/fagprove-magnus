from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from lists.models import GroceryList
from products.models import Product


class GroceryItem(models.Model):
    list = models.ForeignKey(
        GroceryList, related_name='items', on_delete=models.SET_NULL, null=True
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    bought = models.BooleanField(default=False)
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    bought_at = models.DateTimeField(null=True, blank=True)
    bought_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='bought_items',
    )

    def save(self, *args, **kwargs):
        if self.bought and self.bought_at is None:
            self.bought_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        product_name = self.product.name if self.product else "Unknown product"
        list_name = self.list.name if self.list else "No list"
        return f'{self.quantity}x {product_name} in {list_name}'
