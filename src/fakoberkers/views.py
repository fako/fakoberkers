from django.shortcuts import render_to_response
from django.template.context import RequestContext

def home(request):
    # Get term
    return render_to_response('projects.html', {}, RequestContext(request))

def kiosk(request):
    return render_to_response('kiosk.html', {}, RequestContext(request))