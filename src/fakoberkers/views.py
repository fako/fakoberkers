from django.http import HttpResponse

from HIF.models import DataLink


def home(request):
    dl = DataLink('...')
    dl.get()
    return HttpResponse('success')