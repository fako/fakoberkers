import httplib2, json

from django.db import models

# Create your models here.
class DataLink(models.Model):
    link = models.URLField()
    processor = models.CharField(max_length=256)
    response = models.TextField()

    cache = False
    _link = ''
    _parameters = {}
    _objectives = [{'pageid':None,'title':None}]
    _results = []

    def __unicode__(self):
        return self.processor

    def __init__(self,link, *args, **kwargs):
        super(DataLink, self).__init__(*args, **kwargs)
        self._link = link


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
        self.link = self._link
        if self._parameters:
            self.link += '?'
            for k,v in self._parameters.iteritems():
                if callable(v):
                    v = v()
                self.link += k + '=' + v + '&'
            self.link = self.link[:-1] # strips '&' from the end

    def send_request(self):
        self.response = '{"query":{"pages":{"9292":{"pageid":9292,"ns":0,"title":"Einstein"}}}}'
        return True

#        connection = httplib2.Http()
#        meta, content = connection.request(self._link)
#        self.response = content

    def handle_error(self):
        pass

    def continue_request(self):
        pass

    def store_response(self):
        if self.cache:
            self.save()

    # KNOWN LIMITATIONS: This function can't handle multiple objectives that share a key
    def extract_results(self):

        # Extract objective keys into one dict for easy lookup.
        objective_keys = {}
        for i in range(0, len(self._objectives)):
            for k in self._objectives[i].iterkeys():
                objective_keys[k] = i

        # Recursive function to iterate over response and extract results from there.
        def extract(target):
            # Recursively use this function when confronted with list
            if isinstance(target,list):
                for i in target:
                    extract(i)
            # Extract data when confronted with dict
            elif isinstance(target, dict):
                result = {}
                for k in target.iterkeys():
                    # When a key in target is an objective and there is no result yet, create default result from objective and override found key
                    if k in objective_keys and not result:
                        result = dict(self._objectives[objective_keys[k]])
                        result[k] = target[k]
                    # When a key in target is an objective and there already is result, just override default result values.
                    elif k in objective_keys:
                        result[k] = target[k]
                    # Recursively use self when confronted with something else then an objective
                    else:
                        extract(target[k])
                if result:
                    self._results.append(result)
            # Only return the value when not dealing with lists or dicts.
            else:
                return target

        # Turn response into usable objects and extract
        json_response = json.loads(self.response)
        extract(json_response)

        return self
