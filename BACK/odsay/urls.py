from django.urls import path
from .views import find_route, set_csrf_token, geocode

urlpatterns = [
    path('find-route/', find_route, name='find-route'),
    path('set-csrf-token/', set_csrf_token, name='set-csrf-token'),
    path('geocode/', geocode, name='geocode'),  # Geocoding 엔드포인트 추가
]
