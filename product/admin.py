from django.contrib import admin

# Register your models here.
from .models import Product, Category, Gender

admin.site.register(Product)
admin.site.register(Category)
admin.site.register(Gender)