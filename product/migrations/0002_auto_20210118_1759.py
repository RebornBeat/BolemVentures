# Generated by Django 3.1.5 on 2021-01-18 21:59

import django.core.files.storage
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='product_photo',
            field=models.ImageField(storage=django.core.files.storage.FileSystemStorage(location=''), upload_to='images'),
        ),
    ]