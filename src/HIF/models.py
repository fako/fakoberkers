from django.conf import settings
from django.db import models

from .exceptions import CacheResult

# Create your models here.
class DataLink(models.Model):

    # Django fields
    link = models.URLField()
    processor = models.CharField(max_length=256)
    response = models.TextField()

    # Public attributes
    cache = False
    results = []

    # HIF interface attributes
    _link = ''
    _objectives = []

    def __unicode__(self):
        return self.link + ' | ' + self.processor

    def __init__(self, *args, **kwargs):
        super(DataLink, self).__init__(*args, **kwargs)
        # Always cache in debug mode
        if settings.DEBUG:
            self.cache = True
        # Set dynamic values
        self.processor = self.__class__.__name__ #TODO: make this behave with inheritance

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
            self.send_request()
            self.handle_error()
            self.continue_request()
            self.store_response()
            self.extract_results()

        except CacheResult:
            self.extract_results()
            return iter(self.results)

        return iter(self.results)

    def prepare_link(self):
        pass

    def send_request(self):
        if self.cache:
            try:
                cache_result = DataLink.objects.get(link=self.link)
                self.response = cache_result.response
                print "DataLink: Response taken from cache."
                raise CacheResult
            except DataLink.DoesNotExist:
                print "DataLink: No cache response found."
                return False
        else:
            return True

    def handle_error(self):
        pass

    def continue_request(self):
        pass

    def store_response(self):
        if self.cache:
            self.save()

    def extract_results(self):
        pass

class DataLinkMixin(object):
    class Meta:
        proxy = True