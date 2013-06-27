from django.shortcuts import render_to_response
from django.template.context import RequestContext

from HIF.input.http.wiki import WikiTranslate
from HIF.input.http.google import GoogleImage


def home(request):
    term = request.GET.get('q','queen')
    wiki_translate = WikiTranslate('en','pt')
    wiki_translate.get(term)
    results = {}
    for wt in wiki_translate:
        gi = GoogleImage()
        gi.get(wt.translation)
        results[wt.translation] = gi.results

    template_context = {
        'term': term,
        'results': results
    }

    return render_to_response('double.html',template_context,RequestContext(request))


def image(request):
    gi = GoogleImage()
    term = request.GET.get('q','queen')
    gi.get(term)

    template_context = {
        'term': term,
        'subtemplate': "google-image-list.html",
        'results': gi.results
    }

    return render_to_response('single.html',template_context,RequestContext(request))


def translate(request):
    wt = WikiTranslate('en','pt')
    term = request.GET.get('q','queen')
    wt.get(term)

    template_context = {
        'term': term,
        'subtemplate': "wiki-translate-list.html",
        'results': wt.results
    }

    return render_to_response('single.html',template_context,RequestContext(request))