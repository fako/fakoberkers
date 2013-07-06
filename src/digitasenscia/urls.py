from django.conf.urls import patterns, url

urlpatterns = patterns('digitasenscia.views',
    url(r'^$', 'home', name='digitasenscia'),
    url(r'^translate/?$', 'translate', name='translate'),
    url(r'^image/?$', 'image', name='image'),
)