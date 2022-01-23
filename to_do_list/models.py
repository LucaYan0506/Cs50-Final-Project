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