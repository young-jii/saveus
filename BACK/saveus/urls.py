from django.contrib import admin
from django.urls import path, include
from main.views import api_intro
from card.views import set_csrf_token  # Import the CSRF token view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('main/', include('main.urls')),
    path('map/', include('map.urls')),
    path('map/api/', include('map.urls')),
    path('odsay/', include('odsay.urls')),
    path('card/', include('card.urls')),
    path('calculate/', include('calculate.urls')),
    path('api/set-csrf-token/', set_csrf_token, name='set_csrf_token'),  # Directly map the CSRF token view
    path('', api_intro, name='api_intro'),
]