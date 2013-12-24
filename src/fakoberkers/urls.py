from django.conf.urls import patterns, include, url
from django.conf.urls.i18n import i18n_patterns
from django.conf import settings

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = i18n_patterns('fakoberkers.views',
    url(r'^$', 'home', name='fakoberkers'),
    url(r'^kiosk/$', 'kiosk', name='kiosk'),
    url(r'^digita-senscia/', include('digitasenscia.urls')),

    url(r'^hif/', include('HIF.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
