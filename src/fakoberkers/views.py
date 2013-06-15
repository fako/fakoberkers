from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template.context import RequestContext

from HIF.input.http.wiki import WikiTranslate


def home(request):
    wt = WikiTranslate('en','pt')
    term = request.GET.get('q','queen')
    wt.get(term)

    template_context = {
        'term': term,
        'results': wt.results
    }

    return render_to_response('home.html',template_context,RequestContext(request))