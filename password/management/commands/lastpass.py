from django.core.management.base import BaseCommand, CommandError
from django.core import management
from password.models import Password
import csv

class Command(BaseCommand):
    help = 'Loads LastPass export to Django database'

    # Command functions
    def add_arguments(self, parser):
        parser.add_argument(
            '--file', dest='file', required=False, type=str,
            help='The full path for lastpass csv export',
        )

    def handle(self, *args, **options):
        file = options['file']
        f = open(file)
        csv_f = csv.reader(f)
        for row in csv_f:
            url = row[0]
            username = row[1]
            password = row[2]
            name = row[4]
            Password.objects.create(name=name, url=url, username=username, password=password)
