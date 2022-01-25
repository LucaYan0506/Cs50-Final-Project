from django.urls import path

from . import views

urlpatterns = [
    path('',views.chat_view,name="chat"),
    path('join_chat/',views.join_chat,name="join_chat"),
    path('create_chat/',views.create_chat,name="create_chat"),
]
