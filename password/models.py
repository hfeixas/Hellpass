from django.db import models

class Password(models.Model):
    name = models.CharField(max_length = 100, default = '', blank = False, null=True)
    url = models.CharField(max_length = 100, default = '', blank = False, null=True)
    username = models.CharField(max_length = 100, default = '', blank = False, null=True)
    password = models.CharField(max_length = 100, default = '', blank = False, null=True)
    expires = models.DateField(blank=True, null=True)