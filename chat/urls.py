from django.conf.urls import url
from .views import *


urlpatterns = [
    url(r'^api/$', MessageAPI.as_view(), name='api')
]
