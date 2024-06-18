from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('main/', include('main.urls')),
    path('map/api/', include('map.urls')),
    path('odsay/', include('odsay.urls')),
    path('card/', include('card.urls')),
    path('calculate/', include('calculate.urls')),  # 이 부분을 수정했습니다.
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]