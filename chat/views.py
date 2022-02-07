from itertools import chain
import json
from xml.etree.ElementTree import tostring
from django.urls.base import reverse
from django.shortcuts import render
from django.http import HttpResponseRedirect,HttpResponse,JsonResponse
import datetime

from to_do_list.models import User 

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
        chat_group = Chat_group(title = request.POST['title'],creator=request.user,created_time=datetime.datetime.now())
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
              'Im_admin' : request.user in group_detail.administrator.all()
            },safe=False,status=200)
        return JsonResponse({
            'error':'You are not allowed',
        },safe=False,status=403)
    return JsonResponse({
        'error':'Login required'
    },safe=False,status=404)


def admin(request):
    #make sure that group_uk is called
    if (request.GET.get('group_pk')):
        chat_group = Chat_group.objects.get(pk = request.GET.get('group_pk'))
        #make sure the he is an admin or he want leave the group
        if (request.user in chat_group.administrator.all() or request.user.username == request.GET.get('member')):
            #make sure that action is called
            if request.GET.get('action'):
                action = request.GET.get('action')
                #if action is "rename", rename chat_group
                if action == 'rename':
                    if request.method == 'POST':
                        chat_group.title = json.loads(request.body)['newTitle']
                        chat_group.save()
                    return JsonResponse({
                        'error':'POST method required'
                    },safe=False)
                #make sure that member is called
                if request.GET.get('member'):
                    member = User.objects.get(username = request.GET.get('member'))
                    #promote member to admin
                    if action == 'promote':
                        chat_group.administrator.add(member)
                        chat_group.member.remove(member)
                    #kick the member
                    elif action == 'kick':
                        if len(chat_group.administrator.all()) == 1 and request.user in chat_group.administrator.all():
                            return JsonResponse({
                                'message':"You can't leave the group because you are the only admin in this group",
                                'action':action,
                                'member': member.username,
                            },safe=False,status=404)
                        chat_group.administrator.remove(member)
                        chat_group.member.remove(member)
                    # action is unknown
                    else:
                        action = 'unknown'
                    return JsonResponse({
                        'message':'Success',
                        'action':action,
                        'member': member.username,
                    },safe=False,status=200)

                return JsonResponse({
                    'error':'member missed',
                },safe=False,status=404)
            return JsonResponse({
                'error':'action missed'
            },safe=False,status=404)
        return JsonResponse({
            'error':'You are not allowed',
        },safe=False,status=403)
    return JsonResponse({
        'error':'group_pk missed'
    },safe=False,status=404)    