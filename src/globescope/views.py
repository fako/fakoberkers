from django.shortcuts import render_to_response, RequestContext, Http404
from django.template import TemplateDoesNotExist


def home(request):

    context = """
        $window = $(window);
        window.HIF = {
            resultSettings: {
                ratioWidth: 16,
                ratioHeight: 9,
                containerWidth: $window.width(),
                containerHeight: $window.height(),
                minimalWidth: 800,
                minimalHeight: 450,
                animationInterval: 10,
                animationDelay: 1000
            },
            waitingSettings: {
                retrySpeed: 1000,
                refreshSpeed: 250,
                refreshRate: 0.25,
                expectedDuration: 5000,
                maxProgress: 100
            },
            translationEndpoint: "http://{host}/en/hif/image-translations/",
            questionEndpoint: "http://{host}/en/question/"
        };
    """.replace('{host}', request.get_host())

    return render_to_response('globescope/globe-scope.html', {'HIF_FRONTEND_SETTINGS': context}, RequestContext(request))


# TODO: this is now catch all, should be a little less generic perhaps
def partials(request, partial):
    try:
        return render_to_response('globescope/'+partial, {}, RequestContext(request))
    except TemplateDoesNotExist:
        raise Http404

