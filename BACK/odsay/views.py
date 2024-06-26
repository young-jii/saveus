import logging
import requests
import json

from django.conf import settings
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie

# 로거 설정
logger = logging.getLogger(__name__)

@csrf_exempt
def odsay_proxy(request):
    odsay_api_key = settings.ODSAY_API_KEY
    params = request.GET.dict()
    params['apiKey'] = odsay_api_key
    
    odsay_url = 'https://api.odsay.com/v1/api/searchPubTransPathT'
    response = requests.get(odsay_url, params=params)
    
    return JsonResponse(response.json())

@csrf_exempt
def set_csrf_token(request):
    print("odsay/views.py >> set_csrf_token called")
    try:
        csrf_token = get_token(request)
        logger.info(f"odsay/views.py >> CSRF Token: {csrf_token}")
        print(f"odsay/views.py >> CSRF Token: {csrf_token}")
        response = JsonResponse({'csrfToken': csrf_token})
        response["Access-Control-Allow-Origin"] = request.headers.get('Origin') if request.headers.get('Origin') else '*'
        response["Access-Control-Allow-Credentials"] = "true"
        return response
    except Exception as e:
        logger.error(f"odsay/views.py >> Error setting CSRF token: {e}")
        print(f"odsay/views.py >> Error setting CSRF token: {e}")
        return JsonResponse({'error': 'Failed to set CSRF token'}, status=500)

@csrf_exempt
def geocode(request):
    print("odsay/views.py >> geocode called")
    logger.info("odsay/views.py >> geocode called")
    if request.method == 'GET' or request.method == 'POST':
        try:
            address = request.GET.get('address') if request.method == 'GET' else json.loads(request.body).get('address')
            logger.info(f"odsay/views.py >> Received address: {address}")
            print(f"odsay/views.py >> Received address: {address}")
            if not address:
                logger.error("odsay/views.py >> Address is required")
                print("odsay/views.py >> Address is required")
                return JsonResponse({'error': 'Address is required'}, status=400)
            coords = naver_geocode_address(address)
            if 'addresses' not in coords or not coords['addresses']:
                logger.error(f"odsay/views.py >> Invalid address response for: {address} - {coords}")
                print(f"odsay/views.py >> Invalid address response for: {address} - {coords}")
                return JsonResponse({'error': 'Invalid address'}, status=400)
            x, y = coords['addresses'][0]['x'], coords['addresses'][0]['y']
            logger.info(f"odsay/views.py >> Coordinates for {address}: ({x}, {y})")
            print(f"odsay/views.py >> Coordinates for {address}: ({x}, {y})")
            return JsonResponse({'x': x, 'y': y})
        except json.JSONDecodeError as e:
            logger.error(f"odsay/views.py >> JSON decode error: {e}")
            print(f"odsay/views.py >> JSON decode error: {e}")
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            logger.error(f"odsay/views.py >> Error: {e}")
            print(f"odsay/views.py >> Error: {e}")
            return JsonResponse({'error': str(e)}, status=500)
    else:
        logger.error("odsay/views.py >> Invalid request method")
        print("odsay/views.py >> Invalid request method")
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def naver_geocode_address(address):
    headers = {
        'X-NCP-APIGW-API-KEY-ID': settings.NAVER_MAP_API_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': settings.NAVER_MAP_API_CLIENT_PW
    }
    url = f'https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query={address}'
    response = requests.get(url, headers=headers)
    return response.json()

def get_coordinates(address):
    print(f'Fetching coordinates for address: {address}')
    coords = naver_geocode_address(address)
    if 'addresses' not in coords or not coords['addresses']:
        print(f'Invalid address response for: {address} - {coords}')
        return None, None
    x, y = coords['addresses'][0]['x'], coords['addresses'][0]['y']
    print(f'Coordinates for {address}: ({x}, {y})')
    return x, y

def get_route_info(sx, sy, ex, ey):
    print(f'Fetching route from ({sx}, {sy}) to ({ex}, {ey})')
    
    # 인코딩된 API 키
    encoded_api_key = settings.ODSAY_API_KEY
    url = f'https://api.odsay.com/v1/api/searchPubTransPathT?SX={sx}&SY={sy}&EX={ex}&EY={ey}&apiKey={encoded_api_key}'
    
    response = requests.get(url)
    
    print(f'get_route_info >> Request URL: {url}')
    print(f'get_route_info >> Response status code: {response.status_code}')
    print(f'get_route_info >> Response text: {response.text}')
    
    if response.status_code == 200:
        print('get_route_info >> Route info fetched successfully')
        return response.json()
    else:
        print(f'Failed to fetch route info: {response.status_code} - {response.text}')
        return None

@csrf_exempt
def find_route(request):
    print("odsay/views.py >> find_route called")
    if request.method == 'POST':
        try:
            print("odsay/views.py >> find_route POST request received")
            data = json.loads(request.body)
            print(f'find_route >> Received data: {data}')
            start_address = data.get('startPoint')
            end_address = data.get('endPoint')

            if not start_address or not end_address:
                print('find_route >> Missing startPoint or endPoint')
                return JsonResponse({'error': 'Missing startPoint or endPoint'}, status=400)

            sx, sy = get_coordinates(start_address)
            ex, ey = get_coordinates(end_address)

            if not sx or not sy:
                print('find_route >> Invalid start address')
                return JsonResponse({'error': 'Invalid start address'}, status=400)
            if not ex or not ey:
                print('find_route >> Invalid end address')
                return JsonResponse({'error': 'Invalid end address'}, status=400)

            route_info = get_route_info(sx, sy, ex, ey)
            
            if route_info:
                print('find_route >> Route information fetched successfully')
                return JsonResponse(route_info)
            else:
                print('Failed to fetch route information from ODSAY')
                return JsonResponse({'error': 'Failed to fetch route information from ODSAY'}, status=500)
        except json.JSONDecodeError:
            print('Invalid JSON')
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        print('Invalid request method')
        return JsonResponse({'error': 'Invalid request method'}, status=405)