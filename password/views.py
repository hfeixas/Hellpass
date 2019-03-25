from password.models import Password
from password.serializers import PasswordSerializer
from rest_framework.views import APIView, View
from rest_framework.response import Response
from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Q


class PasswordApi(APIView):
    """
    Password API 
    e.x: curl -X GET "http://127.0.0.1:8000" --data-urlencode "url=https://google.com"
    Will retrieve password your for google.com
    """
    # def get(self, request):
    #     url = request.GET.get("url", None)
    #     password = Password.objects.get(url=url)
    #     serializer = PasswordSerializer(password)
    #     return Response(serializer.data)

    def post(self, request):
        data = dict()
        passwords = Password.objects.all()
        search = request.POST.get('search[value]')
        if (search):
            search_query = Q(Q(name__icontains=search)|
                Q(url__icontains=search)|
                Q(username__icontains=search)|
                Q(password__icontains=search))
            passwords = passwords.filter(search_query)
        serialized = PasswordSerializer(passwords, many=True)
        data['data'] = serialized.data
        return Response(data)

class PasswordView(View):
    """
    Password DataTables View
    """

    def get_base_context(self):
        base_context = {
            'passwords': 'test',
        }
        return base_context

    def get(self, *args, **kwargs):
        context = self.get_base_context()
        return render(self.request, 'password.html', context)




class PasswordEdit(View):
    """
    Password Schedule Edit
    """
    def post(self, request):
        data = dict()
        password_pk = request.POST.get('delete_password')
        new_password = request.POST.get('new_password')
        save_form = request.POST.get('save_form')
        if (password_pk):
            Password.objects.get(pk=password_pk).delete()
            data['delete_password'] = True
        elif (new_password):
            print('Creating new password')
            Password.objects.create()
            latest_pk = Password.objects.latest('id')
            print (latest_pk)
            data['new_password'] = True
        elif (save_form):
            passwords = request.POST.getlist('pws')
            for password in passwords:
                print(password)
                password_obj = Password.objects.get(pk=password)
                password_obj.name = request.POST.get('name-' + password)
                password_obj.url = request.POST.get('url-' + password)
                password_obj.username = request.POST.get('username-' + password)
                password_obj.password = request.POST.get('password-' + password)
                expires = request.POST.get('expires-' + password)
                print(expires)
                if (expires) != 'Never':
                    password_obj.expires = expires
                password_obj.save()
            data['saved_form'] = True
        return JsonResponse(data)

    def get(self, request):
        data = dict()
        data['form_is_valid'] = True
        return JsonResponse(data)
