import imp
from django.urls import re_path

import to_do_list.consumer
from . import consumer

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$',consumer.ChatRoomConsumer.as_asgi()),
    re_path(r'ws/note/(?P<room_name>\w+)/$',to_do_list.consumer.NoteRoomConsumer.as_asgi()),
]