from django.urls import path
from .views import api_intro


urlpatterns = [
    path('intro/', api_intro, name='api_intro'),
]