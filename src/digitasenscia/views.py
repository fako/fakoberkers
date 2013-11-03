import math

from django.shortcuts import render_to_response
from django.template.context import RequestContext
from django.conf import settings

#from HIF.input.http.wiki import WikiTranslate
#from HIF.input.http.google import GoogleImage
#
#
#def search_box_response(request):
#    return render_to_response('search.html',{},RequestContext(request))
#
#
#def home(request):
#    # Get term and source language
#    term = request.GET.get('q',False)
#    source_language = request.LANGUAGE_CODE[:2]
#
#    if term:
#        # Get results
#        results = []
#        for target_language in settings.DS_SUPPORTED_LANGUAGES:
#            # Skip results for source language
#            if source_language == target_language: continue
#            # Create translations
#            wiki_translate = WikiTranslate(source_language, target_language)
#            wiki_translate.get(term)
#            if not wiki_translate.results: continue
#            # Get images
#            rsl = {}
#            for wt in wiki_translate:
#                gi = GoogleImage()
#                gi.get(wt["translation"])
#                rsl[wt["translation"]] = gi.results
#            # Calculate span
#            span = int(math.floor(12/len(rsl)))
#            # Save results
#            results.append((target_language, span, rsl))
#
#        # Return results in template.
#        template_context = {
#            'term': term,
#            'results': results
#        }
#        return render_to_response('triple.html',template_context,RequestContext(request))
#    else:
#        return search_box_response(request)
#
#
#def portuguese_images(request):
#    # Get term
#    term = request.GET.get('q',False)
#
#    if term:
#        # Get results
#        wiki_translate = WikiTranslate('en','pt')
#        wiki_translate.get(term)
#        results = {}
#        for wt in wiki_translate:
#            gi = GoogleImage()
#            gi.get(wt["translation"])
#            results[wt["translation"]] = gi.results
#            # Calculate span
#        span = int(math.floor(12/len(results)))
#
#        template_context = {
#            'span': span,
#            'term': term,
#            'results': results
#        }
#        return render_to_response('double.html',template_context,RequestContext(request))
#    else:
#        return search_box_response(request)
#
#
#def image(request):
#    term = request.GET.get('q',False)
#
#    if term:
#        gi = GoogleImage()
#        gi.get(term)
#
#        template_context = {
#            'term': term,
#            'subtemplate': "google-image-list.html",
#            'results': gi.results
#        }
#
#        return render_to_response('single.html',template_context,RequestContext(request))
#    else:
#        return search_box_response(request)
#
#
#def translate(request):
#    term = request.GET.get('q',False)
#
#    if term:
#        wt = WikiTranslate('en','pt')
#        wt.get(term)
#
#        template_context = {
#            'term': term,
#            'subtemplate': "wiki-translate-list.html",
#            'results': wt.results
#        }
#
#        return render_to_response('single.html',template_context,RequestContext(request))
#    else:
#        return search_box_response(request)