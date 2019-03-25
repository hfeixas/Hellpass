from django.conf.urls import url, include
from django.contrib.auth import views as auth_views
from password.views import PasswordApi, PasswordView, PasswordEdit
from django.urls import path
from django.views.generic import TemplateView


urlpatterns = [
    url(r'^$', auth_views.LoginView.as_view(), name='login-view'),
    url(r'^api$', PasswordApi.as_view(), name="password-api"),
    url(r'^home$', PasswordView.as_view(), name="password-view"),
    url(r'^api/edit$', PasswordEdit.as_view(), name="password-api"),
    url(r'^login/$', auth_views.LoginView.as_view(), name='login-view'),
    path('index', TemplateView.as_view(template_name='index.html'))
]