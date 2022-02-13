from turtle import ondrag
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.deletion import CASCADE
from encrypted_model_fields.fields import EncryptedTextField,EncryptedCharField

# Create your models here.

class User(AbstractUser):
    first_name = EncryptedCharField(max_length=8, blank=True,null=True)
    middle_name = EncryptedCharField(max_length=50, blank=True,null=True)
    city = EncryptedCharField(max_length=100, blank=True,null=True)
    state = EncryptedCharField(max_length=100, blank=True,null=True)

class Folder(models.Model):
    creator = models.ForeignKey(User,on_delete=CASCADE,default="",related_name='myfolder')
    owner = models.ManyToManyField(User,related_name='folder')
    title = EncryptedCharField(max_length=200,blank=True,null=True)
    def __str__(self):
        return self.title

    def serialize(self):
        return {
            'pk': self.pk,
            'title': self.title
        }

    
class Page(models.Model):
    folder = models.ForeignKey(Folder,default="",on_delete=CASCADE,related_name='pages')
    title = EncryptedCharField(max_length=200,blank=True,null=True)
    content = EncryptedTextField(blank=True,null=True)

    def serialize(self):
        return {
            'title':self.title,
            'content':self.content
        }