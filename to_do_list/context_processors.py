from django import forms
from django.forms.widgets import Input, Textarea
from .models import *


class add_post_form(forms.ModelForm):
    def __init__(self,user, *args, **kwargs):
        super(add_post_form, self).__init__(*args, **kwargs)
        
        self.fields['folder'] = forms.ModelChoiceField(
            queryset=Folder.objects.filter(owner=user).all(),
            empty_label=None,
            widget=forms.Select(attrs={'class': 'form-select'})
        )

    class Meta:
        model = Page
        fields = ['folder','title','content',]
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
        'page_form': add_post_form(request.user.pk,request.POST),
        'all_users': User.objects.all()
    }
