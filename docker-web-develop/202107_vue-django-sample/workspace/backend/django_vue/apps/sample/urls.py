from django.urls import path
from .views.user import get_user

urlpatterns = [
    path("user/<int:user_id>", get_user)
]