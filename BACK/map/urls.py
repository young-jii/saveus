# map/urls.py

from django.urls import path
from .views import handle_data, set_csrf_token, find_route

urlpatterns = [
    path('set-csrf-token/', set_csrf_token, name='set_csrf_token'),
    path('find-route/', find_route, name='find_route'),
    path('data/', handle_data, name='handle_data'),
]
