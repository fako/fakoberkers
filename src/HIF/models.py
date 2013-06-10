from django.db import models

# Create your models here.
class DataLink(models.Model):
    link = models.URLField()
    processor = models.CharField(max_length=256)
    result = models.TextField()

    _raw_link = ''
    _link = ''
    _parameters = {}
    _objectives = []
    _results = []

    def __unicode__(self):
        return self.processor

    def __init__(self,link):
        self._raw_link = link


    # Abstract interface

    def get(self):
        self.prepare_link()
        self.send_request()
        self.handle_error()
        self.continue_request()
        self.extract_results()
        self.store_results()
        return self._results

    def prepare_link(self):
        self._link = self._raw_link
        if self._parameters:
            self._link += '?'
            for k,v in self._parameters.iteritems():
                if callable(v):
                    v = v()
                self._link += k + '=' + v
