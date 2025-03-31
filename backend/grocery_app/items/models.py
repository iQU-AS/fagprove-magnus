from django.contrib.auth.models import User
from django.db import models

from lists.models import GroceryList
from products.models import Product



class GroceryItem(models.Model):
    list = models.ForeignKey(
        GroceryList, on_delete=models.CASCADE, related_name="items"
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    bought = models.BooleanField(default=False)
    requested_by = models.ForeignKey(
        User, on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.quantity}x {self.product.name} in {self.list.name}"

