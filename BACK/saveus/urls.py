from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('main/', include('main.urls')),
    path('map/api/', include('map.urls')),
    path('odsay/', include('odsay.urls')),
    path('card/', include('card.urls')),
    path('calculate/', include('calculate.urls')),
    path('api/set-csrf-token/', include('card.urls')),  # CSRF 토큰 엔드포인트 추가
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]