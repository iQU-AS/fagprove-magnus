from django.contrib import admin
from .models import GroceryList, GroceryListInviteToken

@admin.register(GroceryList)
class GroceryListAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner')
    search_fields = ('name', 'owner__username')
    filter_horizontal = ('members',)
    autocomplete_fields = ('owner',)

@admin.register(GroceryListInviteToken)
class GroceryListInviteTokenAdmin(admin.ModelAdmin):
    list_display = ('grocery_list', 'token', 'created_at', 'expires_at', 'is_valid_display')
    search_fields = ('grocery_list__name', 'token')
    autocomplete_fields = ('grocery_list',)

    def is_valid_display(self, obj):
        return obj.is_valid()
    is_valid_display.boolean = True
    is_valid_display.short_description = 'Is Valid'
