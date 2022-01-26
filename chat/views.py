from django.urls.base import reverse
from django.shortcuts import render
from django.http import HttpResponseRedirect
from itertools import chain 

from to_do_list.models import Chat_group

# Create your views here.

def chat_view(request):
    if request.user.is_authenticated:
        chat_group = list(chain(Chat_group.objects.filter(administrator = request.user) ,Chat_group.objects.filter(member = request.user)))
        return render(request,'chat/index.html',{
            'chat_groups' : chat_group
        })
    return HttpResponseRedirect("/login/?url=chat")

def join_chat(request):
    if request.user.is_authenticated and request.method == 'POST':
        try:
            chat_group = Chat_group.objects.get(pk = request.POST['pk'])
            chat_group.member.add(request.user)
        except:
            chat_groups = list(chain(Chat_group.objects.filter(administrator = request.user) ,Chat_group.objects.filter(member = request.user)))
            return render(request,'chat/index.html',{
                'chat_groups' : chat_groups,
                'error': 'Invalid Id'
            }) 
    return HttpResponseRedirect(reverse('chat'))

def create_chat(request):
    if request.user.is_authenticated and request.method == 'POST':
        members = request.POST.getlist('users')
        chat_group = Chat_group(title = request.POST['title'])
        chat_group.save()
        chat_group.administrator.add(request.user)
        chat_group.member.set(members)
    return HttpResponseRedirect(reverse('chat'))