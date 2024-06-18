# saveus/calculate/views.py
from django.http import JsonResponse
from django.views import View

class CalculateCostView(View):
    def get(self, request, *args, **kwargs):
        payment = int(request.GET.get('payment', 0))
        print(f"Received payment: {payment}")  # 터미널에 출력
        min_value = payment * 40
        max_value = payment * 50
        print(f"Calculated min value: {min_value}, max value: {max_value}")  # 터미널에 출력
        return JsonResponse({'minValue': min_value, 'maxValue': max_value})
