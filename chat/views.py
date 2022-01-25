from django.urls.base import reverse
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.db.models import Q

from to_do_list.models import Chat_group

# Create your views here.

def chat_view(request):
    if request.user.is_authenticated:
        chat_group = Chat_group.objects.filter(Q(administrator = request.user) | Q(member = request.user))
        return render(request,'chat/index.html',{
            'chat_groups' : chat_group
        })
    return HttpResponseRedirect("/login/?url=chat")

def join_chat(request):
    if request.user.is_authenticated and request.method == 'POST':
        chat_group = Chat_group.objects.get(pk = request.POST['pk'])
        chat_group.member.add(request.user)
    return HttpResponseRedirect(reverse('chat'))

def create_chat(request):
    if request.user.is_authenticated and request.method == 'POST':
        print(request.POST.getlist('users'))
        #chat_group = Chat_group(title = request.POST['title'], administrator = request.user)
    return HttpResponseRedirect(reverse('chat'))