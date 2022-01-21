import imp
from django.shortcuts import render
from django.http import HttpResponseRedirect

# Create your views here.

def chat_view(request):
    if request.user.is_authenticated:
        return render(request,'chat/index.html')
    return HttpResponseRedirect("/login/?url=chat")