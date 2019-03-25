from django import forms
from .models import Password
class PasswordForm(forms.ModelForm):
    class Meta:
        model = Password
        fields = ['name', 'url', 'username', 'password']
