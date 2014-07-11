from django.shortcuts import render_to_response, RequestContext

def home(request):
    return render_to_response('globe-scope.html', {}, RequestContext(request))

def partials(request, partial):
    return render_to_response(partial, {}, RequestContext(request))
