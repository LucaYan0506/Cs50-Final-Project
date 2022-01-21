import json
import re
from telnetlib import STATUS
from turtle import goto
from django.forms.widgets import Input, Select
from django.http.response import JsonResponse
from django.shortcuts import render,redirect
from django.contrib.auth import login,logout,authenticate
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.urls.base import reverse
from django import forms

from .models import *
from .context_processors import add_post_form
# Create your views here.

#register form{}
class register_form(forms.ModelForm):
    class Meta:
        STATE_CHOICES =(
            ("0","select..."),
            ("1","Afghanistan"),
            ("2","Albania"),
            ("3","Algeria"),
            ("4","American Samoa"),
            ("5","Andorra"),
            ("6","Angola"),
            ("7","Anguilla"),
            ("8","Antarctica"),
            ("9","Antigua and Barbuda"),
            ("10","Argentina"),
            ("11","Armenia"),
            ("12","Aruba"),
            ("13","Australia"),
            ("14","Austria"),
            ("15","Azerbaijan"),
            ("16","Bahamas (the)"),
            ("17","Bahrain"),
            ("18","Bangladesh"),
            ("19","Barbados"),
            ("20","Belarus"),
            ("21","Belgium"),
            ("22","Belize"),
            ("23","Benin"),
            ("24","Bermuda"),
            ("25","Bhutan"),
            ("26","Bolivia (Plurinational State of)"),
            ("27","Bonaire, Sint Eustatius and Saba"),
            ("28","Bosnia and Herzegovina"),
            ("29","Botswana"),
            ("30","Bouvet Island"),
            ("31","Brazil"),
            ("32","British Indian Ocean Territory (the)"),
            ("33","Brunei Darussalam"),
            ("34","Bulgaria"),
            ("35","Burkina Faso"),
            ("36","Burundi"),
            ("37","Cabo Verde"),
            ("38","Cambodia"),
            ("39","Cameroon"),
            ("40","Canada"),
            ("41","Cayman Islands (the)"),
            ("42","Central African Republic (the)"),
            ("43","Chad"),
            ("44","Chile"),
            ("45","China"),
            ("46","Christmas Island"),
            ("47","Cocos (Keeling) Islands (the)"),
            ("48","Colombia"),
            ("49","Comoros (the)"),
            ("50","Congo (the Democratic Republic of the)"),
            ("51","Congo (the)"),
            ("52","Cook Islands (the)"),
            ("53","Costa Rica"),
            ("54","Croatia"),
            ("55","Cuba"),
            ("56","Curaçao"),
            ("57","Cyprus"),
            ("58","Czechia"),
            ("59","Côte d'Ivoire"),
            ("60","Denmark"),
            ("61","Djibouti"),
            ("62","Dominica"),
            ("63","Dominican Republic (the)"),
            ("64","Ecuador"),
            ("65","Egypt"),
            ("66","El Salvador"),
            ("67","Equatorial Guinea"),
            ("68","Eritrea"),
            ("69","Estonia"),
            ("70","Eswatini"),
            ("71","Ethiopia"),
            ("72","Falkland Islands (the) [Malvinas]"),
            ("73","Faroe Islands (the)"),
            ("74","Fiji"),
            ("75","Finland"),
            ("76","France"),
            ("77","French Guiana"),
            ("78","French Polynesia"),
            ("79","French Southern Territories (the)"),
            ("80","Gabon"),
            ("81","Gambia (the)"),
            ("82","Georgia"),
            ("83","Germany"),
            ("84","Ghana"),
            ("85","Gibraltar"),
            ("86","Greece"),
            ("87","Greenland"),
            ("88","Grenada"),
            ("89","Guadeloupe"),
            ("90","Guam"),
            ("91","Guatemala"),
            ("92","Guernsey"),
            ("93","Guinea"),
            ("94","Guinea-Bissau"),
            ("95","Guyana"),
            ("96","Haiti"),
            ("97","Heard Island and McDonald Islands"),
            ("98","Holy See (the)"),
            ("99","Honduras"),
            ("100","Hong Kong"),
            ("101","Hungary"),
            ("102","Iceland"),
            ("103","India"),
            ("104","Indonesia"),
            ("105","Iran (Islamic Republic of)"),
            ("106","Iraq"),
            ("107","Ireland"),
            ("108","Isle of Man"),
            ("109","Israel"),
            ("110","Italy"),
            ("111","Jamaica"),
            ("112","Japan"),
            ("113","Jersey"),
            ("114","Jordan"),
            ("115","Kazakhstan"),
            ("116","Kenya"),
            ("117","Kiribati"),
            ("118","Korea (the Democratic People's Republic of)"),
            ("119","Korea (the Republic of)"),
            ("120","Kuwait"),
            ("121","Kyrgyzstan"),
            ("122","Lao People's Democratic Republic (the)"),
            ("123","Latvia"),
            ("124","Lebanon"),
            ("125","Lesotho"),
            ("126","Liberia"),
            ("127","Libya"),
            ("128","Liechtenstein"),
            ("129","Lithuania"),
            ("130","Luxembourg"),
            ("131","Macao"),
            ("132","Madagascar"),
            ("133","Malawi"),
            ("134","Malaysia"),
            ("135","Maldives"),
            ("136","Mali"),
            ("137","Malta"),
            ("138","Marshall Islands (the)"),
            ("139","Martinique"),
            ("140","Mauritania"),
            ("141","Mauritius"),
            ("142","Mayotte"),
            ("143","Mexico"),
            ("144","Micronesia (Federated States of)"),
            ("145","Moldova (the Republic of)"),
            ("146","Monaco"),
            ("147","Mongolia"),
            ("148","Montenegro"),
            ("149","Montserrat"),
            ("150","Morocco"),
            ("151","Mozambique"),
            ("152","Myanmar"),
            ("153","Namibia"),
            ("154","Nauru"),
            ("155","Nepal"),
            ("156","Netherlands (the)"),
            ("157","New Caledonia"),
            ("158","New Zealand"),
            ("159","Nicaragua"),
            ("160","Niger (the)"),
            ("161","Nigeria"),
            ("162","Niue"),
            ("163","Norfolk Island"),
            ("164","Northern Mariana Islands (the)"),
            ("165","Norway"),
            ("166","Oman"),
            ("167","Pakistan"),
            ("168","Palau"),
            ("169","Palestine, State of"),
            ("170","Panama"),
            ("171","Papua New Guinea"),
            ("172","Paraguay"),
            ("173","Peru"),
            ("174","Philippines (the)"),
            ("175","Pitcairn"),
            ("176","Poland"),
            ("177","Portugal"),
            ("178","Puerto Rico"),
            ("179","Qatar"),
            ("180","Republic of North Macedonia"),
            ("181","Romania"),
            ("182","Russian Federation (the)"),
            ("183","Rwanda"),
            ("184","Réunion"),
            ("185","Saint Barthélemy"),
            ("186","Saint Helena, Ascension and Tristan da Cunha"),
            ("187","Saint Kitts and Nevis"),
            ("188","Saint Lucia"),
            ("189","Saint Martin (French part)"),
            ("190","Saint Pierre and Miquelon"),
            ("191","Saint Vincent and the Grenadines"),
            ("192","Samoa"),
            ("193","San Marino"),
            ("194","Sao Tome and Principe"),
            ("195","Saudi Arabia"),
            ("196","Senegal"),
            ("197","Serbia"),
            ("198","Seychelles"),
            ("199","Sierra Leone"),
            ("200","Singapore"),
            ("201","Sint Maarten (Dutch part)"),
            ("202","Slovakia"),
            ("203","Slovenia"),
            ("204","Solomon Islands"),
            ("205","Somalia"),
            ("206","South Africa"),
            ("207","South Georgia and the South Sandwich Islands"),
            ("208","South Sudan"),
            ("209","Spain"),
            ("210","Sri Lanka"),
            ("211","Sudan (the)"),
            ("212","Suriname"),
            ("213","Svalbard and Jan Mayen"),
            ("214","Sweden"),
            ("215","Switzerland"),
            ("216","Syrian Arab Republic"),
            ("217","Taiwan (Province of China)"),
            ("218","Tajikistan"),
            ("219","Tanzania, United Republic of"),
            ("220","Thailand"),
            ("221","Timor-Leste"),
            ("222","Togo"),
            ("223","Tokelau"),
            ("224","Tonga"),
            ("225","Trinidad and Tobago"),
            ("226","Tunisia"),
            ("227","Turkey"),
            ("228","Turkmenistan"),
            ("229","Turks and Caicos Islands (the)"),
            ("230","Tuvalu"),
            ("231","Uganda"),
            ("232","Ukraine"),
            ("233","United Arab Emirates (the)"),
            ("234","United Kingdom of Great Britain and Northern Ireland (the)"),
            ("235","United States Minor Outlying Islands (the)"),
            ("236","United States of America (the)"),
            ("237","Uruguay"),
            ("238","Uzbekistan"),
            ("239","Vanuatu"),
            ("240","Venezuela (Bolivarian Republic of)"),
            ("241","Viet Nam"),
            ("242","Virgin Islands (British)"),
            ("243","Virgin Islands (U.S.)"),
            ("244","Wallis and Futuna"),
            ("245","Western Sahara"),
            ("246","Yemen"),
            ("247","Zambia"),
            ("248","Zimbabwe"),
            ("249","Åland Islands"),
        )
        model = User
        fields = ['first_name','middle_name','last_name','username','password','city','state']
        widgets = {
            'first_name': Input(attrs={'Class':'form-control','type':'text','Required':''}),
            'middle_name': Input(attrs={'Class':'form-control','type':'text'}),
            'last_name': Input(attrs={'Class':'form-control','type':'text','Required':''}),
            'username': Input(attrs={'Class':'form-control','type':'text','placeholder':'username'}),
            'password': Input(attrs={'Class':'form-control','type':'password','placeholder':'password'}),
            'city': Input(attrs={'Class':'form-control','type':'text'}),
            'state': Select(attrs={'Class':'form-control','type':'text'},choices=STATE_CHOICES)
        }



def index(request,go_last_page = False):
    if request.user.is_authenticated:
        go_last_page = None
        if (request.session.get('go_last_page')):
            go_last_page = request.session['go_last_page']
        return render(request,'to_do_list/index.html',{
            'notes':request.user.page.all(),
            'go_last_page':go_last_page
        })
    return HttpResponseRedirect(reverse('login'))

def login_view(request):
    if request.method == 'POST':
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            url = request.POST['url'] or 'index'
            return HttpResponseRedirect(reverse(url))
        else:
            return render(request, "to_do_list/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "to_do_list/login.html",{
            'url':request.GET.get('url') or 'index'
        })

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('login'))

def register_view(request):
    if request.method == 'POST':
        data = register_form(request.POST)
        password = request.POST['password']
        confirmation = request.POST['confirmation']
        if (password != confirmation):
            print(password)
            print(confirmation)
            return render(request,'to_do_list/register.html',{
                'form':register_form(request.POST),
                'error':'Passwords must match.',
            })

        try:
            user = data.save(commit=False)

            # Cleaned(normalized) data
            username = data.cleaned_data['username']
            password = data.cleaned_data['password']

            #  Use set_password here
            user.set_password(password)
            user.save()
        except:
            return render(request, "to_do_list/register.html", {
                "error": "Username already taken.",
                'form':register_form(request.POST)
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))

    return render(request,'to_do_list/register.html',{
        'form':register_form()
    })

@login_required
def add_note(request):
    if request.method == 'POST':
        data = add_post_form(request.POST).save(commit=False)
        data.poster = request.user
        data.save()
        request.session['go_last_page'] = True
        return redirect('index',)

def get_note(request):
    note = Page.objects.get(pk=request.GET.get('pk'))
    if note.poster.pk is not request.user.pk:
        return JsonResponse({
            'error':"You don't have the permission.",
        },status=403,safe=False)
    return JsonResponse(note.serialize(),status=200,safe=False)
    
def update_note(request):
    data = json.loads(request.body)
    page = Page.objects.get(pk = data['pk'])
    page.title = data['title'].replace('<br>', '')
    page.content = data['content']
    page.save()
    return JsonResponse({
        'message':page.title
    },status=202)