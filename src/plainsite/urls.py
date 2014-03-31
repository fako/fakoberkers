from django.conf.urls import patterns, url

urlpatterns = patterns('plainsite.views',
    url(r'^(?P<path>[\-\/\w\d]+)\.(?P<ext>\w{1,4})$', 'page'),
    url(r'^(?P<path>[\-\/\w\d]*)$', 'index')
)