from django.shortcuts import render
from django.core import serializers
from django.http import HttpResponse
from ..models.user import User

# Create your views here.

def get_user(req, user_id):
    print(req.GET)
    # Get an user from DB with user_id here...
    # user = User.objects.create(user_id = user_id, name = "user{}".format(user_id))
    user = User(user_id = user_id, name = "user{}".format(user_id))
    return HttpResponse(
        serializers.serialize("json", [user]),
        content_type = "application/json")

