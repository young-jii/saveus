from django.urls import path
from .views import api_intro

urlpatterns = [
    path('api/intro/', api_intro, name='api_intro'),
]