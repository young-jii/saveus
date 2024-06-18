from django.urls import re_path
from saveus import consumers

websocket_urlpatterns = [
    re_path(r'ws/some_path/$', consumers.YourConsumer.as_asgi()),
]