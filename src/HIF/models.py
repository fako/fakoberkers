import httplib2

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

    def __init__(self,link, *args, **kwargs):
        super(DataLink, self).__init__(*args, **kwargs)
        self._raw_link = link


    # Abstract interface

    def get(self):
        self.prepare_link()
        self.send_request()
        self.handle_error()
        self.continue_request()
        self.store_response()
        self.extract_results()
        return self._results

    def prepare_link(self):
        self._link = self._raw_link
        if self._parameters:
            self._link += '?'
            for k,v in self._parameters.iteritems():
                if callable(v):
                    v = v()
                self._link += k + '=' + v + '&'
            self._link = self._link[:-1] # strips '&' from the end

    def send_request(self):
        self._results = '{"query":{"pages":{"9292":{"pageid":9292,"ns":0,"title":"Einstein"}}}}'
        return True

#        connection = httplib2.Http()
#        response, content = connection.request(self._link)
#        self._results = content

    def handle_error(self):
        pass

    def continue_request(self):
        pass

    def store_response(self):
        pass
    
    def extract_results(self):
        pass


