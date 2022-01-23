import imp
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    path('',views.index,name='index'),
    path('login/',views.login_view,name='login'),
    path('register/',views.register_view,name='register'),
    path('logout/',views.logout_view,name='logout'),
    path('add_note/',views.add_note,name='add_note'),
    path('get_note/',views.get_note,name='get_note'),
    path('update_note/',views.update_note,name="update_note"),
    path('add_folder/',views.add_folder,name="add_folder")
]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
