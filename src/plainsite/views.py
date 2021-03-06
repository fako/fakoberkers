import os

from django.conf import settings
from django.shortcuts import render_to_response, RequestContext, Http404
from django.template import TemplateDoesNotExist

def page(request, site, path, ext):

    # Storing GET parameters in session, which updates template context
    # TODO: patch
    request.session.update(request.GET.dict())
    context = {
        "css": "css/{}.css".format(site),
        "chapter": ""
    }
    context.update(request.session)

    # Render template and raise 404 if appropriate
    template = "{}/concrete/{}.{}".format(site, path, ext)
    try:
        return render_to_response(template, context, RequestContext(request))
    except TemplateDoesNotExist as exc:
        if "concrete" in str(exc):
            raise Http404("Does the template {} exist?".format(template))
        else:
            raise exc


def index(request, site, path):

    # TODO: write logic that searches for the target directory in all template directories
    directory = '{}src/templatefiles/templates/{}/concrete/{}'.format(settings.PATH_TO_PROJECT, site, path)

    listdir = []
    for elem in os.listdir(directory):
        if not elem == "index.html":
            listdir.append(elem if not os.path.isdir(directory+'/'+elem) else elem + "/")
        else:
            return render_to_response("{}/concrete/{}/index.html".format(site, path), {}, RequestContext(request))
    return render_to_response("{}/index.html".format(site),{"listdir": listdir}, RequestContext(request))