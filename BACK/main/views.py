from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.
def api_intro(request):
    data = {"message" : "Hello from the API"}
    return JsonResponse(data)

