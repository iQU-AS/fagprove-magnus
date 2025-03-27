from django.contrib.auth.models import User
from django.db import models


class GroceryList(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    members = models.ManyToManyField(User, related_name='grocery_lists', blank=True)


class Product(models.Model):
    name = models.CharField(max_length=255, unique=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return self.name


class GroceryItem(models.Model):
    list = models.ForeignKey(
        GroceryList, on_delete=models.CASCADE, related_name='items'
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    bought = models.BooleanField(default=False)
    requested_by = models.ForeignKey(
        User, on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.quantity}x {self.product.name} in {self.list.name}'