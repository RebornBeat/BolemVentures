from django.shortcuts import render
from django.http import JsonResponse
from .models import Product, Category
from paypalcheckoutsdk.core import PayPalHttpClient, SandboxEnvironment
from paypalcheckoutsdk.orders import OrdersCreateRequest, OrdersCaptureRequest
from paypalhttp import HttpError
import logging
import json

environment = SandboxEnvironment(client_id="AWICJkCziuVDPqcSxbVk7_9NXUmFc4RPH0AcgnB0VWFvZSiOY9cj90T5xuDvDwejPtnCuJ8i8X-4o8ld", client_secret="EDWJnrn2BwvBV9Ip2DOAetAQfpBFunRZtRpdhTDGhKW22fOryAbUy0i1DpTyOOFVqwAkQA_py0M_RSiL")
client = PayPalHttpClient(environment)

def index(request):
    context = {}
    categories = Category.objects.all()
    for i in categories:
        Prod = Product.objects.filter(category=i)
        context[i.category_name] = Prod  
    return render(request, 'product/index.html', {'context': context})

def create(request):
    if request.method =="POST":
        logger = logging.getLogger(__name__)
        request = json.loads(request.body.decode('utf-8'))
        total_cost = 0
        json_items = {"intent": "CAPTURE", "application_context": {"brand_name": "Bolem Venture", "landing_page": "BILLING"}, "purchase_units": [], "items": []}
        for key, value in request.items():
            item_price = float(Product.objects.get(product_name=key).product_price)
            item_value = round((float(value) * float(item_price)), 2)
            total_cost += item_value
            json_items["items"].append({"name": key, "unit_amount": {"currency_code": "USD", "value": item_price}, "quantity": int(value)}) 
        total_cost = round(total_cost, 2)
        json_items["purchase_units"].append({"amount": { "currency_code": "USD", "value": total_cost, "breakdown": { "item_total": { "currency_code": "USD", "value": total_cost}}}})
        create_order = OrdersCreateRequest()
        create_order.prefer('return=representation')
        create_order.request_body(json_items)
        response = client.execute(create_order)
        data = response.result.__dict__['_dict']
        return JsonResponse(data)
    else:
        return JsonResponse({'details': "invalide request"})
    
def capture(request):
    if request.method =="POST":
        request = json.loads(request.body.decode('utf-8'))
        capture_order = OrdersCaptureRequest(request["id"])
        response = client.execute(capture_order)
        data = response.result.__dict__['_dict']

        return JsonResponse(data)
    else:
        return JsonResponse({'details': "invalide request"})