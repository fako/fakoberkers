from django.conf.urls import patterns, url

urlpatterns = patterns('digitasenscia.views',
    url(r'^$', 'home', name='digitasenscia'),
)