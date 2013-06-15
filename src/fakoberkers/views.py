from django.http import HttpResponse

from HIF.models import DataLink


def home(request):
    dl = DataLink('...')
    response = ''
    for r in dl.get():
        response += r['title']
    dl.get()
    return HttpResponse(dl.processor())