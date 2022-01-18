from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.deletion import CASCADE
# Create your models here.

class User(AbstractUser):
    first_name = models.CharField(max_length=8, blank=True,null=True)
    middle_name = models.CharField(max_length=50, blank=True,null=True)
    city = models.CharField(max_length=100, blank=True,null=True)
    state = models.CharField(max_length=100, blank=True,null=True)

class Page(models.Model):
    poster = models.ForeignKey(User,default="",on_delete=CASCADE,related_name='page')
    title = models.CharField(max_length=200,blank=True,null=True)
    content = models.TextField(blank=True,null=True)

    def serialize(self):
        return {
            'title':self.title,
            'content':self.content
        }

class SubPage(models.Model):
    parent_page = models.ForeignKey(Page,default="",on_delete=CASCADE,related_name='child')
    title = models.CharField(max_length=200,default='')
    content = models.TextField()