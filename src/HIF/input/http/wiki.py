from HIF.models import DataLinkMixin
from HIF.input.http.hif import QueryLink
from HIF.processors.extractors import json_extractor

class WikiLink(QueryLink, DataLinkMixin):

    # KNOWN LIMITATIONS: This function can't handle multiple objectives that share a key
    def extract_results(self):
        self.results = json_extractor(self.response, self._objectives)

    def handle_error(self):
        pass

    def continue_request(self):
        pass


class WikiTranslate(WikiLink, DataLinkMixin):

    _link = 'http://%s.wiktionary.org/w/api.php' # updated at runtime
    _parameters = {
        'format':'json',
        'action':'query',
        'prop':'iwlinks',
        'iwurl':1,
        'iwprefix': None, # set at runtime
    }
    _objectives = [{
        "url": None,
        "*": None,
    }]
    _query_parameter = 'titles'

    def __init__(self, source, destination, *args, **kwargs):
        super(WikiTranslate, self).__init__(*args,**kwargs)
        self._link = self._link % source
        self._parameters['iwprefix'] = destination

    def extract_results(self, *args, **kwargs):
        # Standard wiki extract
        super(WikiTranslate, self).extract_results(*args,**kwargs)
        # Replace * for translation for usability of the results
        for r in self.results:
            r["translation"] = r["*"]
            del(r["*"])
