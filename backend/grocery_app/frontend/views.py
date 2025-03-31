import os
from django.http import HttpResponse
from grocery_app import settings
from rest_framework.views import APIView


class FrontendAppView(APIView):
    def get(self, request):
        try:
            with open(os.path.join(settings.BASE_DIR, "static", "index.html")) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            return HttpResponse("index.html not found", status=501)
