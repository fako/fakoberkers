from django.shortcuts import render_to_response
from django.template.context import RequestContext

from HIF.input.http.wiki import WikiTranslate
from HIF.input.http.google import GoogleImage


def home(request):
    gi = GoogleImage()
    term = request.GET.get('q','queen')
    gi.get(term)

    template_context = {
        'term': term,
        'results': gi.results
    }

    return render_to_response('home.html',template_context,RequestContext(request))


def image(request):
    gi = GoogleImage()
    term = request.GET.get('q','queen')
    gi.get(term)

    template_context = {
        'term': term,
        'results': gi.results
    }

    return render_to_response('home.html',template_context,RequestContext(request))


def translate(request):
    wt = WikiTranslate('en','pt')
    term = request.GET.get('q','queen')
    wt.get(term)

    template_context = {
        'term': term,
        'results': wt.results
    }

    return render_to_response('home.html',template_context,RequestContext(request))