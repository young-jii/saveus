# saveus/calculate/urls.py
from django.urls import path
from .views import CalculateCostView

urlpatterns = [
    path('calculate-cost/', CalculateCostView.as_view(), name='calculate-cost'),
]
