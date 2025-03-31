from django.utils import timezone
from django.contrib.auth.models import User
from django.db import models
import uuid
from datetime import timedelta


class GroceryList(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    members = models.ManyToManyField(User, related_name="grocery_lists", blank=True)


class GroceryListInviteToken(models.Model):
    grocery_list = models.ForeignKey(
        GroceryList, on_delete=models.CASCADE, related_name="invite_tokens"
    )
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=24)
        super().save(*args, **kwargs)

    def is_valid(self):
        return not self.expires_at or timezone.now() <= self.expires_at
