import httplib2

from HIF.models import DataLink


class HTTPLink(DataLink):

    _parameters = {}

    # Adding parameters on prepare link
    def prepare_link(self):
        self.link = self._link
        if self._parameters:
            self.link += '?'
            for k,v in self._parameters.iteritems():
                if callable(v):
                    v = v()
                self.link += k + '=' + str(v) + '&'
            self.link = self.link[:-1] # strips '&' from the end

    # Make connection and do request
    def send_request(self):
        super(HTTPLink, self).send_request() # may fetch cache result by throwing CacheResult

    #        self.response = '{"query":{"pages":{"9292":{"pageid":9292,"ns":0,"title":"Einstein"}}}}'
        print "HTTPLink.send_request is being executed."
        print "With: %s" % self.link
        connection = httplib2.Http()
        meta, content = connection.request(self.link)
        print meta
        print content
        self.response = content

    class Meta:
        proxy = True









class QueryLink(HTTPLink):

    _query_parameter = ''
    _query = ''

    def get(self, refresh=False):



        return iter(self.results)

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
        if self.cache:
            try:
                cache_result = DataLink.objects.get(link=self._link)
                self.response = cache_result.response
                print "DataLink: Response taken from cache."
                raise CacheResult
            except DataLink.DoesNotExist:
                print "DataLink: No cache response found."
                return False
        else:
            return True

            #        self.response = '{"query":{"pages":{"9292":{"pageid":9292,"ns":0,"title":"Einstein"}}}}'

            #        connection = httplib2.Http()
            #        meta, content = connection.request(self._link)
            #        self.response = content

    def handle_error(self):
        pass

    def continue_request(self):
        pass
