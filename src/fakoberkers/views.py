import json
from pprint import pformat

from django.shortcuts import render_to_response, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.template.context import RequestContext
from django.core.mail import mail_managers


def home(request):
    # Get term
    return render_to_response('projects.html', {}, RequestContext(request))


def kiosk(request):
    return render_to_response('kiosk.html', {}, RequestContext(request))


@csrf_exempt  # TODO: patch this leak
def question(request):
    if request.method == 'POST':  # TODO: wtf, ugly as hell
        data = json.loads(request.body)
        text = pformat(data, indent=4)
        mail_managers(data['question'], text)
        return HttpResponse('send')
    return HttpResponse('options')


def robots(request):
    return HttpResponse('User-agent: * \nDisallow: /')