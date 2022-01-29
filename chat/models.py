from statistics import mode
from django.db import models
from django.db.models.deletion import CASCADE

from to_do_list.models import *

# Create your models here.

class Chat_group(models.Model):
    title = models.CharField(max_length=200,default="")
    administrator = models.ManyToManyField(User,related_name='my_group')
    member = models.ManyToManyField(User,related_name='others_group',blank=True)
    people_read = models.ManyToManyField(User,blank=True)

    creator = models.ForeignKey(User,null=True,on_delete = models.SET_NULL, related_name='group_I_created')
    created_time = models.DateTimeField(null=True,blank=True)

    def already_read(self,user):
        return user in self.people_read.all()

    def get_members(self):
        res = []
        for member in self.member.all():
            res.append(member.username)
        return res

    def get_admin(self):
        res = []
        for admin in self.administrator.all():
            res.append(admin.username)
        return res           

class Chat_message(models.Model):
    chat_group = models.ForeignKey(Chat_group,default="", on_delete=CASCADE,related_name='chat_message')
    sender = models.ForeignKey(User,default="",on_delete=models.SET_NULL,null=True,related_name='chat_message')
    message = models.TextField(default="")

    def serialize(self):
        return{
            'user':self.sender.username,
            'message':self.message,
        }