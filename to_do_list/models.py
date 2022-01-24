from operator import truediv
from turtle import ondrag
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.deletion import CASCADE
# Create your models here.

class User(AbstractUser):
    first_name = models.CharField(max_length=8, blank=True,null=True)
    middle_name = models.CharField(max_length=50, blank=True,null=True)
    city = models.CharField(max_length=100, blank=True,null=True)
    state = models.CharField(max_length=100, blank=True,null=True)

class Folder(models.Model):
    owner = models.ForeignKey(User,default="",on_delete=CASCADE,related_name='folder')
    pk_folder = models.CharField(max_length=400,blank=True,null=True,unique=True)
    title = models.CharField(max_length=200,blank=True,null=True)
    def __str__(self):
        return self.title
    
class Page(models.Model):
    folder = models.ForeignKey(Folder,default="",on_delete=CASCADE,related_name='pages')
    title = models.CharField(max_length=200,blank=True,null=True)
    content = models.TextField(blank=True,null=True)
        
    def serialize(self):
        return {
            'title':self.title,
            'content':self.content
        }

class Chat_group(models.Model):
    title = models.CharField(max_length=200,default="")
    administrator = models.ManyToManyField(User,related_name='my_group')
    member = models.ManyToManyField(User,related_name='others_group')
    

class Chat_message(models.Model):
    chat_group = models.ForeignKey(Chat_group,default="", on_delete=CASCADE,related_name='chat_message')
    sender = models.ForeignKey(User,default="",on_delete=models.SET_NULL,null=True,related_name='chat_message')
    message = models.TextField(default="")