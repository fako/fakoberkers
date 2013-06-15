from HIF.models import DataLinkMixin
from HIF.input.http.hif import HTTPLink
from HIF.processors.extractors import json_extractor

class WikiTranslate(HTTPLink, DataLinkMixin):

    _link = 'http://%s.wiktionary.org/w/api.php' # updated at runtime
    _parameters = {
        'format':'json',
        'action':'query',
        'prop':'iwlinks',
        'iwurl':1,
        'iwprefix': None, # set at runtime
        'titles':'queen',
    }
    _objectives = [{
        "url": None,
        "*": None,
    }]

    def __init__(self, source, destination, *args, **kwargs):
        super(WikiTranslate, self).__init__(*args,**kwargs)
        self._link = self._link % source
        self._parameters['iwprefix'] = destination

    # KNOWN LIMITATIONS: This function can't handle multiple objectives that share a key
    def extract_results(self):
        # Extract
        self.results = json_extractor(self.response, self._objectives)
        # Replace * for translation for usability of the results
        for r in self.results:
            r["translation"] = r["*"]
            del(r["*"])
