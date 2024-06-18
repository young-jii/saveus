import logging
from django.http import JsonResponse, HttpResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods
import json

# 로거 설정
logger = logging.getLogger(__name__)

@ensure_csrf_cookie
@require_GET
def set_csrf_token(request):
    print("set_csrf_token view called")
    try:
        token = get_token(request)
        logger.info(f"map/views.py >> CSRF Token: {token}")
        print(f"map/views.py >> CSRF Token: {token}")
        response = JsonResponse({'detail': 'CSRF cookie set', 'csrfToken': token})
        response["Access-Control-Allow-Origin"] = request.headers.get('Origin') if request.headers.get('Origin') else '*'
        response["Access-Control-Allow-Credentials"] = "true"
        return response
    except Exception as e:
        logger.error(f"map/views.py >> Error setting CSRF token: {e}")
        response = JsonResponse({'error': 'Failed to set CSRF token'}, status=500)
        response["Access-Control-Allow-Origin"] = request.headers.get('Origin') if request.headers.get('Origin') else '*'
        response["Access-Control-Allow-Credentials"] = "true"
        return response

@csrf_exempt
@require_http_methods(["POST"])
def handle_data(request):
    print("handle_data called")
    if request.method == 'POST':
        try:
            print("handle_data POST request received")
            data = json.loads(request.body)
            response_data = {
                'mem_home': data.get('mem_home'),
                'start_point': data.get('start_point'),
                'end_point': data.get('end_point'),
                'mem_young_y': data.get('mem_young_y'),
                'mem_young_n': data.get('mem_young_n'),
                'mem_subsidiary_yn': data.get('mem_subsidiary_yn'),
            }
            return JsonResponse(response_data, status=200)
        except Exception as e:
            logger.error(f"Error processing data: {e}")
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
@require_http_methods(["POST"])
def find_route(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            start_point = data.get('startPoint')
            end_point = data.get('endPoint')

            route_info = {
                'start': start_point,
                'end': end_point,
                'distance': '10 km',
                'duration': '15 mins'
            }
            return JsonResponse(route_info, status=200)
        except Exception as e:
            logger.error(f"Error processing route data: {e}")
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)
