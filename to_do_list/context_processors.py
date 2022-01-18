from django import forms
from django.forms.widgets import Input, Textarea
from .models import *

class add_post_form(forms.ModelForm):
    class Meta:
        model = Page
        fields = ['title','content']
        labels = {
            "title": "",
            'content': ''
        }
        widgets = {
            'title': Input(attrs={'placeholder':'Untitled'}),
            'content': Textarea(attrs={'placeholder':'Add notes'})
        }

def add_form_to_context(request):
    return {
        'page_form': add_post_form()
    }
