from django.http import HttpResponse

from HIF.models import DataLink


def home(request):
    dl = DataLink('...')
    response = ''
    for r in dl:
        response += r['title']
    return HttpResponse(response)