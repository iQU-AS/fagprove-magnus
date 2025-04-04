# Generated by Django 5.1.7 on 2025-03-27 13:39

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('lists', '0001_initial'),
        ('products', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='GroceryItem',
            fields=[
                (
                    'id',
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID',
                    ),
                ),
                ('quantity', models.IntegerField(default=1)),
                ('bought', models.BooleanField(default=False)),
                (
                    'list',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='items',
                        to='lists.grocerylist',
                    ),
                ),
                (
                    'product',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to='products.product',
                    ),
                ),
                (
                    'requested_by',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
