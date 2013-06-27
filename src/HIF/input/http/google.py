from HIF.models import DataLinkMixin
from HIF.input.http.hif import QueryLink
from HIF.processors.extractors import json_extractor


class GoogleImage(QueryLink, DataLinkMixin):

    _link = 'https://www.googleapis.com/customsearch/v1' # updated at runtime
    _parameters = {
        'searchType':'image',
    }
    _objectives = [{
        "contextLink": None,
        "thumbnailLink": None,
    }]
    _query_parameter = 'q'
    _key = ''
    _cx = ''

    def __init__(self, key='AIzaSyDf2Eop-euHJGF1oOalFz3cYYZtQkquU1o', cx='004613812033868156538:5pcwbuudj1m', *args, **kwargs):
        self._key = key
        self._cx = cx
        super(GoogleImage, self).__init__(*args,**kwargs)

    def enable_auth(self):
        self.auth_link = self.link + ('&key=%s&cx=%s' % (self._key, self._cx))

    # KNOWN LIMITATIONS: This function can't handle multiple objectives that share a key
    def extract_results(self):
        # Extract
        self.results = json_extractor(self.response, self._objectives)

    def handle_error(self):
        pass

    def continue_request(self):
        pass