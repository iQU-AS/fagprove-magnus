from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'created_by')
    search_fields = ('name',)
    autocomplete_fields = ('created_by',)
