# Generated by Django 2.1.4 on 2018-12-27 15:14

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Password',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=100, null=True)),
                ('url', models.CharField(default='', max_length=100, null=True)),
                ('username', models.CharField(default='', max_length=100, null=True)),
                ('password', models.CharField(default='', max_length=100, null=True)),
                ('expires', models.DateField(blank=True, null=True)),
            ],
        ),
    ]
