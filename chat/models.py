from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User


class Messages(models.Model):
    to_user = models.CharField(max_length=255)
    from_user = models.CharField(max_length=255)
    message = models.TextField()
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return str(self.from_user)

