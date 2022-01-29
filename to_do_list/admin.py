from django.contrib import admin

from chat.views import chat_view

from to_do_list.models import *
from chat.models import *
# Register your models here.

admin.site.register(User)
admin.site.register(Page)
admin.site.register(Folder)
admin.site.register(Chat_group)
admin.site.register(Chat_message)
