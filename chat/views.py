from rest_framework import serializers
from rest_framework import status
from rest_framework.generics import (
    ListAPIView, 
    CreateAPIView, 
    # RetrieveAPIView, 
    UpdateAPIView, 
    ListCreateAPIView
)
import json
from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView
import json
from .models import *
from .serializer import *
from django.contrib import auth
import string
import random
from django.db.models import Q

class MessageAPI(ListCreateAPIView):

    serializer_class = MessageSerializer
    model = Messages

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            msg = serializer.save()
            return JsonResponse({"status": True, "id":msg.id}, status=200)
        else:
            return JsonResponse({"status": False}, status=400)


    def get(self, request):
    	to_user = request.GET.get('to_user',None)
    	from_user = request.GET.get('from_user',None)
    	limit = request.GET.get('limit',5)
    	load_prev = request.GET.get('load_prev',0)
    	crnt_pg = request.GET.get('crnt_pg',None)

    	if to_user and from_user:
    		msg = Messages.objects.filter(Q(to_user=to_user, from_user=from_user)| Q(to_user=from_user, from_user=to_user)).order_by('-created').values('id','to_user','from_user','message','created')
    		total = msg.count()
    		if load_prev and crnt_pg:
    			msg = msg[crnt_pg:load_prev]
    		else:
    			msg = msg[0:limit]
    		total = total - int(load_prev)
    		load_more = total - msg.count()
    		request_more = False
    		if load_more > 0:
    			request_more = True
    		return JsonResponse({
    					"status": True,
    					"message":list(msg[::-1]),
    					"request_more":request_more
    				}, status=200)
    	else:
    		return JsonResponse({
					"status": False,
					"message":"to or from user not provided."
				}, status=400)