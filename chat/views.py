import imp
from django.shortcuts import render
from django.http import HttpResponseRedirect

from to_do_list.models import Chat_group

# Create your views here.

def chat_view(request):
    if request.user.is_authenticated:
        return render(request,'chat/index.html',{
            'chat_groups' : Chat_group.objects.filter(administrator = request.user)
        })
    return HttpResponseRedirect("/login/?url=chat")