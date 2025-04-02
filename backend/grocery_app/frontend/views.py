import os
from django.http import HttpResponse
from grocery_app import settings
from rest_framework.views import APIView


class FrontendAppView(APIView):
    """
    Returnerer hovedsiden til frontend-applikasjonen (index.html).
    
    Brukes for å serve React-appen ved direkte URL-tilgang (f.eks. ved refresh).
    Returnerer 501 hvis index.html ikke finnes.
    """
    def get(self):
        try:
            with open(os.path.join(settings.BASE_DIR, 'static', 'index.html')) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            return HttpResponse('index.html not found', status=501)
