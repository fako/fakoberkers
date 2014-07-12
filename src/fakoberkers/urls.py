from django.conf.urls import patterns, include, url
from django.conf.urls.i18n import i18n_patterns
from django.conf import settings

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = i18n_patterns('',
    url(r'^$', 'globescope.views.home', name='fakoberkers'),
    url(r'^digita-senscia/', include('digitasenscia.urls')),

    # HIF related (will get moved to own project probably)
    url(r'^hif/', include('HIF.urls')),
    url(r'^question/', 'fakoberkers.views.question', name='question'),

    # Plain sites
    url(r'^dnd/', include('plainsite.urls'), {"site":"dnd"}),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

    url(r'^(?P<partial>.*)$', 'globescope.views.partials', name='partials')
)
