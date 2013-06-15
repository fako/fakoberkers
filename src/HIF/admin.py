from django.contrib import admin

from HIF.models import DataLink


class DataLinkAdmin(admin.ModelAdmin):
    list_display = ['__unicode__','response']

admin.site.register(DataLink, DataLinkAdmin)