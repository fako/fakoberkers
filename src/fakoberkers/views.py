from django.http import HttpResponse


def home(request):
    # Get term
    return HttpResponse('Hello World!')
