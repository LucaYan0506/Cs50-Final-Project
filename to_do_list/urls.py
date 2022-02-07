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
    path('add_folder/',views.add_folder,name="add_folder"),
    path('delete_note/',views.delete_note,name="delete_note"),
    path('delete_folder/',views.delete_folder,name="delete_folder"),
    path('rename_folder/',views.rename_folder,name="rename_folder"),
    path('share_folder/',views.share_folder,name="share_folder"),
    path('search_user/',views.search_user,name="search_user"),
]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
