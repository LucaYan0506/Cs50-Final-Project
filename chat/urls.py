from django.urls import path

from . import views

urlpatterns = [
    path('',views.chat_view,name="chat"),
    path('join_chat/',views.join_chat,name="join_chat"),
    path('create_chat/',views.create_chat,name="create_chat"),
    path('send_message/',views.send_message,name="send_message"),
    path('get_message/<int:chat_group_pk>/',views.get_message,name="get_message"),
    path('read_message/',views.read_message,name="read_message"),
]
