from django.db import models

# Create your models here.

class User(models.Model):
    user_id = models.IntegerField(max_length = 5)
    name = models.CharField(max_length = 100)