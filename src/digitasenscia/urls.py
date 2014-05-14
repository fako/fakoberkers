from django.conf.urls import patterns, url

urlpatterns = patterns('digitasenscia.views',
    url(r'^$', 'home', name='digitasenscia'),
    url(r'^(?P<partial>.*)$', 'partials', name='partials')
)