from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework_simplejwt.views import TokenObtainPairView
from user.serializers import UserSerializer


class CookieLoginView(TokenObtainPairView):
    """
    Logger inn brukeren og returnerer et access token.
    
    Refresh token settes som en HttpOnly-cookie for å hindre XSS-angrep.
    """
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        refresh_token = response.data.get('refresh')
        if refresh_token:
            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=False,
                samesite='Lax',
                path='/api/auth/refresh/',
                max_age=60 * 60 * 24 * 7,  # 7 dager
            )
            del response.data['refresh']

        return response


class CookieRefreshView(APIView):
    """
    Returnerer et nytt access token basert på refresh token lagret i cookie.
    
    Returnerer 401 hvis refresh token mangler eller er ugyldig.
    """
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response(
                {'detail': 'No refresh token in cookie.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            token = RefreshToken(refresh_token)
            access_token = str(token.access_token)
            return Response({'access': access_token})
        except TokenError:
            return Response(
                {'detail': 'Invalid refresh token.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class RegisterView(generics.CreateAPIView):
    """
    Registrerer en ny bruker og returnerer access token.

    Refresh token settes som cookie. Validerer input med serializer.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response = Response({'access': access_token}, status=status.HTTP_201_CREATED)
        response.set_cookie(
            key='refresh_token',
            value=str(refresh_token),
            httponly=True,
            secure=False,
            samesite='Lax',
            path='/api/auth/refresh/',
            max_age=60 * 60 * 24 * 7,  # 7 dager
        )
        return response


class LogoutView(APIView):
    """
    Logger ut brukeren ved å slette refresh token-cookien.
    
    Returnerer en bekreftelse på utlogging.
    """
    def post(self, _):
        response = Response({'detail': 'Logged out successfully.'}, status=status.HTTP_200_OK)
        response.delete_cookie('refresh_token', path='/api/auth/refresh/')
        return response
