from django.contrib import admin
from django.urls import path
from user.urls import user_urls
from items.urls import items_urls
from products.urls import products_urls
from lists.urls import lists_urls
from frontend.urls import frontend_urls
from authentication.urls import authentication_urls


urlpatterns = (
    [
        path("admin/", admin.site.urls),
    ]
    + user_urls
    + items_urls
    + products_urls
    + lists_urls
    + authentication_urls
    + frontend_urls
)
