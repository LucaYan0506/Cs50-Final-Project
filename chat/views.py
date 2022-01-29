import json
from django.urls.base import reverse
from django.shortcuts import render
from django.http import HttpResponseRedirect,HttpResponse,JsonResponse
from itertools import chain 

from .models import Chat_group,Chat_message

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

def send_message(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        chat_group = Chat_group.objects.get(pk = data['pk'])
        chat_group.people_read.clear()
        chat_message = Chat_message(chat_group=chat_group,sender=request.user,message=data['message'])
        chat_message.save()
        return JsonResponse({
            'message':'success'
        },safe=False)
    return HttpResponse('Post method required',status=404)
    
def get_message(request,chat_group_pk):
    if request.user.is_authenticated:
        if request.user.my_group.filter(pk = chat_group_pk).exists() or request.user.others_group.filter(pk = chat_group_pk).exists():
            messages = Chat_message.objects.filter(chat_group=Chat_group.objects.get(pk = chat_group_pk))
            return JsonResponse({
                'body':[message.serialize() for message in messages],
                'read':Chat_group.objects.get(pk = chat_group_pk).already_read(request.user)
            },safe=False,status=200)
        return JsonResponse({
            'error':'You are not allowed',
        },safe=False,status=403)
    return JsonResponse({
        'error':'Login required'
    },safe=False,status=404)

def read_message(request):
    if request.method == 'PUT':
        data = json.loads(request.body)
        chat_group = Chat_group.objects.get(pk = data['pk'])
        chat_group.people_read.add(request.user)
        return JsonResponse({
            'message':'success'
        },safe=False,status=200)
    return JsonResponse({
        'error' : 'PUT method required'
    },safe=False,status=404)

def get_group_detail(request):
    if request.user.is_authenticated:
        chat_group_pk = request.GET.get('pk')
        if request.user.my_group.filter(pk = chat_group_pk).exists() or request.user.others_group.filter(pk = chat_group_pk).exists():
            group_detail = Chat_group.objects.get(pk = chat_group_pk)
            return JsonResponse({
              'name' : group_detail.title,
              'admins': group_detail.get_admin(),
              'members': group_detail.get_members(),
              'creator':group_detail.creator.username,
              'created_time' : group_detail.created_time,
            },safe=False,status=200)
        return JsonResponse({
            'error':'You are not allowed',
        },safe=False,status=403)
    return JsonResponse({
        'error':'Login required'
    },safe=False,status=404)