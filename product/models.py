from django.db import models
from django.conf import settings
from django.core.files.storage import FileSystemStorage

fs = FileSystemStorage(location=settings.MEDIA_ROOT)

class Category(models.Model):
    category_name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.category_name
    
class Gender(models.Model):
    gender_role = models.CharField(max_length=100)
    
    def __str__(self):
        return self.gender_role
    
class Product(models.Model):
    product_name = models.CharField(max_length=100)
    product_price = models.DecimalField(max_digits=5, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    gender = models.ForeignKey(Gender, on_delete=models.CASCADE)
    product_description = models.CharField(max_length=250)
    product_photo = models.ImageField(upload_to='images',storage=fs)
    
    def __str__(self):
        return self.product_name
    
