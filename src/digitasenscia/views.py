import math

from django.shortcuts import render_to_response
from django.template.context import RequestContext

from HIF.input.http.wiki import WikiTranslate
from HIF.input.http.google import GoogleImage


def search_box_response(request):
    return render_to_response('base.html',{},RequestContext(request))


def home(request):
    # Get term
    term = request.GET.get('q',False)

    if term:
        # Get results
        wiki_translate = WikiTranslate('en','pt')
        wiki_translate.get(term)
        results = {}
        for wt in wiki_translate:
            gi = GoogleImage()
            gi.get(wt["translation"])
            results[wt["translation"]] = gi.results
            # Calculate span
        span = int(math.floor(12/len(results)))

        template_context = {
            'span': span,
            'term': term,
            'results': results
        }
        return render_to_response('double.html',template_context,RequestContext(request))
    else:
        return search_box_response(request)


def image(request):
    term = request.GET.get('q',False)

    if term:
        gi = GoogleImage()
        gi.get(term)

        template_context = {
            'term': term,
            'subtemplate': "google-image-list.html",
            'results': gi.results
        }

        return render_to_response('single.html',template_context,RequestContext(request))
    else:
        return search_box_response(request)


def translate(request):
    term = request.GET.get('q',False)

    if term:
        wt = WikiTranslate('en','pt')
        wt.get(term)

        template_context = {
            'term': term,
            'subtemplate': "wiki-translate-list.html",
            'results': wt.results
        }

        return render_to_response('single.html',template_context,RequestContext(request))
    else:
        return search_box_response(request)