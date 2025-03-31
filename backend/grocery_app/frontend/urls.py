from django.urls import re_path
from django.views.generic import TemplateView


frontend_urls = [re_path(r'^.*$', TemplateView.as_view(template_name="index.html")),]