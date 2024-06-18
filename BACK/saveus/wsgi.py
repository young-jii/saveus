import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'saveus.settings')

try:
    application = get_wsgi_application()
except Exception as e:
    print("WSGI application loading error: ", e)
    raise