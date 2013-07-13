import json

from django.conf import settings
from django.db import models

from .exceptions import DbResponse, WaitingForAPIResponse, WarningImproperlyUsageLinkPool

# Create your models here.
class DataLink(models.Model):

    # Django fields
    link = models.URLField()
    link_type = models.CharField(max_length=256)
    response = models.TextField()
    hibernation = models.BooleanField(default=False)

    # Public attributes
    auth_link = ''
    cache = False
    results = []

    # HIF interface attributes
    _link_type = 'DataLink'
    _link = ''
    _objective = {}
    _translations = {}

    def __unicode__(self):
        # return "repr string"
        return self.link #+ ' | ' + self.link_type

    def __init__(self, *args, **kwargs):
        super(DataLink, self).__init__(*args, **kwargs)
        # Always cache in debug mode
        if settings.DEBUG:
            self.cache = True
        # Set dynamic values
        self.link_type = self._link_type # how to do this with current class instance?

    def __iter__(self):
        return iter(self.results)

    # Abstract interface

    # Main function.
    # Returns an iterator with results coming from DataLink
    def get(self, refresh=False):

        try:
            # Early exit if results are already there.
            if self.results and not refresh:
                return iter(self.results)

            # Get recipe
            self.prepare_link()
            self.enable_auth()
            self.send_request()
            self.handle_error()
            self.continue_request()
            self.store_response()

            self.extract_results()
            self.translate_results()
            filter(self.cleaner,self.results)

        except DbResponse:
            self.extract_results()
            self.translate_results()
            filter(self.cleaner,self.results)

            return iter(self.results)

        return iter(self.results)

    def prepare_link(self):
        pass

    def enable_auth(self):
        self.auth_link = self.link

    def send_request(self):
        try:
            data_link = DataLink.objects.get(link=self.link)
            self.response = data_link.response
            print "DataLink: Response found in db."
            raise DbResponse
        except DataLink.DoesNotExist:
            print "DataLink: No db response found."

        return True

    def handle_error(self):
        pass

    def continue_request(self):
        pass

    def store_response(self):
        if self.cache and self.response:
            self.save()

    def extract_results(self):
        pass

    def translate_results(self):
        if self._translations:
            for r in self.results:
                for k,v in self._translations.iteritems():
                    if k in r: # if a key that needs translation is found
                        r[v] = r[k] # make a new pair in result with the translated key as key
                        del(r[k]) # delete the old key/value pair

    def hibernate(self):
        if self.results:
            self.hibernation = True
            self.save()

    def cleaner(self,rsl):
        return True


class DataLinkMixin(object):
    class Meta:
        proxy = True


#class DataProcess(models.Model):
#
#    args = models.CharField(max_length=256)
#    kwargs = models.CharField(max_length=256)
#    initial_storage = models.TextField()
#    results = models.TextField(null=True,default='')
#    ready = models.BooleanField(default=False)
#
#    link_pool = []
#    initial = None
#
#    def hibernate(self):
#        if settings.DEBUG and not self.link_pool:
#            raise WarningImproperlyUsageLinkPool
#
#        for link in self.link_pool:
#            link.hibernate()
#
#    def wakeup(self):
#        pass
#
#    def process(self, *args, **kwargs):
#        pass
#
#    def execute(self, *args, **kwargs):
#        # Set arguments in model
#        self.args = json.dumps(*args)
#        self.kwargs = json.dumps(**kwargs)
#        self.wakeup(*args, **kwargs) # checks whether this process was hybernated and should awake
#        try:
#            self.process(*args, **kwargs)
#        except WaitingForAPIResponse:
#            self.hibernate()