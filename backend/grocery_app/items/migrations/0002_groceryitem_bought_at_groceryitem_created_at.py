# Generated by Django 5.1.7 on 2025-03-28 06:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='groceryitem',
            name='bought_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='groceryitem',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
