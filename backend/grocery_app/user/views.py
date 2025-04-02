from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


class UserDetailView(APIView):
    """
    Returnerer informasjon om innlogget bruker.
    
    Krever at brukeren er autentisert.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Returnerer brukerdata som navn, e-post og ID.
        """
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
