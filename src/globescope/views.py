from django.shortcuts import render_to_response, RequestContext

def home(request):
    return render_to_response('globescope/globe-scope.html', {}, RequestContext(request))

def partials(request, partial):
    return render_to_response('globescope/'+partial, {}, RequestContext(request))
