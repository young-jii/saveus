from django.http import JsonResponse

def api_intro(request):
    return JsonResponse({"message": "Welcome to the API root"})