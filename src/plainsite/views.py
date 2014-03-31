import os

from django.conf import settings
from django.shortcuts import render_to_response, RequestContext, Http404
from django.template import TemplateDoesNotExist

def page(request, site, path, ext):
    template = "{}/concrete/{}.{}".format(site, path, ext)
    try:
        return render_to_response(template, {"css": "css/{}.css".format(site)}, RequestContext(request))
    except TemplateDoesNotExist as exc:
        if "concrete" in str(exc):
            raise Http404("Does the template {} exist?".format(template))
        else:
            raise exc


def index(request, site, path):
    directory = '{}src/templatefiles/templates/{}/concrete/{}'.format(settings.PATH_TO_PROJECT, site, path)
    listdir = [elem if not os.path.isdir(directory+'/'+elem) else elem + "/" for elem in os.listdir(directory)]
    return render_to_response("{}/index.html".format(site),{"listdir": listdir}, RequestContext(request))