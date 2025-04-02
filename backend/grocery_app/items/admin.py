from django.contrib import admin
from .models import GroceryItem

@admin.register(GroceryItem)
class GroceryItemAdmin(admin.ModelAdmin):
    list_display = ('product', 'quantity', 'bought', 'requested_by', 'bought_by', 'created_at', 'bought_at')
    list_filter = ('bought', 'created_at', 'bought_at')
    search_fields = ('product__name', 'list__name', 'requested_by__username', 'bought_by__username')
    autocomplete_fields = ('product', 'list', 'requested_by', 'bought_by')
