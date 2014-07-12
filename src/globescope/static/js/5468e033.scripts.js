'use strict';
angular.module('globeScopeApp', [
  'ngSanitize',
  'ngCookies',
  'ui.router'
]).config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('main', {
      url: '/',
      onEnter: [
        '$rootScope',
        function ($rootScope) {
          $rootScope.loadClass = [];
        }
      ],
      views: {
        main: {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
        },
        load: { template: '' }
      }
    }).state('translate', {
      url: '/result?q',
      onEnter: [
        '$rootScope',
        function ($rootScope) {
          $rootScope.loadClass = ['loading'];
        }
      ],
      views: {
        main: {
          templateUrl: 'views/result.html',
          controller: 'ResultCtrl'
        },
        load: {
          templateUrl: 'views/waiting.html',
          controller: 'WaitingCtrl'
        }
      }
    }).state('resize', {
      params: [
        'referralState',
        'referralQ'
      ],
      onEnter: [
        '$rootScope',
        function ($rootScope) {
          $rootScope.loadClass = [];
        }
      ],
      views: {
        main: {
          templateUrl: 'views/resize.html',
          controller: 'ResizeCtrl'
        },
        load: { template: '' }
      }
    }).state('error', {
      onEnter: [
        '$rootScope',
        function ($rootScope) {
          $rootScope.loadClass = [];
        }
      ],
      url: '/error',
      views: {
        main: {
          templateUrl: 'views/error.html',
          controller: 'ErrorCtrl'
        },
        load: { template: '' }
      }
    });
    $urlRouterProvider.otherwise('/');
  }
]).run([
  '$rootScope',
  '$state',
  '$location',
  '$http',
  '$cookies',
  function ($rootScope, $state, $location, $http, $cookies) {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;  //$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  }
]);
Array.prototype.randomize = function () {
  /**
    * Randomize array element order in-place.
    * Using Fisher-Yates shuffle algorithm.
    *
    *  http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    */
  for (var i = this.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }
};
Array.prototype.pad = function (limit) {
  /**
	* Adds elements to the array until length of Array is equal to limit
	* It deep copies elements from the beginning of the Array to pad the end.
	* It repeats the same elements when needed padding is longer than Array.length
	*/
  for (var i = 0, length = this.length; this.length < limit; ++i) {
    this.push($.extend(true, {}, this[i % length]));  // pushing a deep copy
  }
};
'use strict';
/* globals HIF, $ */
angular.module('globeScopeApp').factory('imageService', [
  '$q',
  '$timeout',
  function ($q, $timeout) {
    function GSImage(data, propertySeed) {
      this.propertySeed = propertySeed;
      // an integer used to determine CSS property
      this.width = data.width;
      this.height = data.height;
      this.link = data.link;
      this.timeoutPromise = null;
      // TODO: make timeout separate event
      this.deferred = $q.defer();
      var that = this;
      this.deferred['finally'] = function () {
        that.timeoutPromise.cancel();
      };
      this.yproperties = [
        'top',
        'bottom'
      ];
      this.noAnimationTreshold = 57;
      this.viewPort = false;
    }
    GSImage.prototype.setViewport = function () {
      // TODO: remove global dependencies
      // TODO: duplicates code in ResultCtrl, move to separate service
      // TODO: inject instead of ask for dependencies
      // Some vars
      var rs = HIF.resultSettings;
      var windowWidth = $(window).width();
      var imageWidth = Math.floor(windowWidth / 4);
      // TODO: remove hard code
      var imageHeight = imageWidth / rs.ratioWidth * rs.ratioHeight;
      imageHeight = Math.round(imageHeight);
      rs.imageWidth = imageWidth;
      rs.imageHeight = imageHeight;
      this.viewPort = {
        width: rs.imageWidth,
        height: rs.imageHeight
      };
    };
    GSImage.prototype.load = function (sources) {
      if (!this.viewPort) {
        this.setViewport();
      }
      if (typeof sources != 'undefined') {
        if (this.link in sources) {
          if (sources[this.link]) {
            return this;  // is already loaded we return this (which shall be wrapped in when())
          } else {
            return $q.reject(this);
          }
        }
      }
      // TODO: have a look at images that would be too small with width 100%
      if (this.getActualHeightWhenFullWidth(this.viewPort) < this.viewPort.height || this.width < this.viewPort.width) {
        return $q.reject(this);
      }
      var that = this;
      this.timeoutPromise = $timeout(function () {
        // cancelled in finally clause of image promise
        that.deferred.reject(that);
      }, 1000);
      var img = new Image();
      $(img).load(function (event) {
        if (this.height < that.height || this.width < that.width) {
          that.deferred.reject(that);
          return;
        }
        that.width = this.width;
        that.height = this.height;
        that.deferred.resolve(that);
      }).error(function (event) {
        that.deferred.reject(that);
      }).prop('src', this.link);
      if (img.complete) {
        this.width = img.width;
        this.height = img.height;
        $timeout.cancel(this.timeoutPromise);
      }
      return img.complete ? this : this.deferred.promise;
    };
    GSImage.prototype.getOffsetProperty = function () {
      return this.yproperties[this.propertySeed % 2];
    };
    GSImage.prototype.getActualHeightWhenFullWidth = function (viewportDimensions) {
      // We calculate the actual image size based on the assumptions:
      // That width is as large as viewport width
      // And that we keep the ratio
      var widthRatio = this.width / viewportDimensions.width;
      var actualImageHeight = this.height / widthRatio;
      return Math.round(actualImageHeight);
    };
    GSImage.prototype.getOverflowPercentage = function (viewportDimensions) {
      var overflowSize = this.getActualHeightWhenFullWidth(viewportDimensions) - viewportDimensions['height'];
      return Math.ceil(overflowSize / viewportDimensions['height'] * 100);
    };
    GSImage.prototype.style = function () {
      if (!this.viewPort) {
        this.setViewport();
      }
      // Initial styling
      var animationInterval = HIF.resultSettings.animationInterval;
      // TODO: remove external dependency
      var styles = {
          width: '100%',
          transition: 'top ' + animationInterval + 's linear, bottom ' + animationInterval + 's linear'
        };
      // Styling based on overflow
      var overflowPercentage = this.getOverflowPercentage(this.viewPort);
      var hasSignificantOverflow = overflowPercentage > this.noAnimationTreshold;
      if (hasSignificantOverflow) {
        styles[this.getOffsetProperty()] = -1 * overflowPercentage + '%';
      } else {
        styles[this.getOffsetProperty()] = -1 * (overflowPercentage / 2) + '%';
      }
      return styles;
    };
    GSImage.prototype.cssClass = function () {
      if (!this.viewPort) {
        this.setViewport();
      }
      var hasSignificantOverflow = this.getOverflowPercentage(this.viewPort) > this.noAnimationTreshold;
      return hasSignificantOverflow ? this.getOffsetProperty() + '-overflow' : '';
    };
    return GSImage;
  }
]);
'use strict';
angular.module('globeScopeApp').factory('visualTranslationService', [
  '$http',
  '$q',
  'imageService',
  function ($http, $q, $Image) {
    var visualTranslationService = {
        url: HIF.translationEndpoint,
        languages: [],
        query: '',
        deferred: false,
        promise: false,
        standby: true,
        readyVisuals: 0,
        reset: function () {
          console.log('Resetting $Translation');
          // TODO: Create map function for visuals
          // A change to release what needs to be released
          for (var i = 0; i < this.languages.length; ++i) {
            for (var j = 0; j < this.languages[i].translations.length; ++j) {
              for (var k = 0; k < this.languages[i].translations[j].visuals.length; ++k) {
                delete this.languages[i].translations[j].visuals[k];
              }
            }
          }
          // Resetting the vars
          this.languages = [];
          this.readyVisuals = 0;
          this.query = '';
          this.deferred = false;
          this.imagesDeferred = false;
          // Prepare defer
          this.deferred = $q.defer();
          this.imagesDeferred = $q.defer();
          // When we're done we're on standby
          var that = this;
          this.deferred.promise['finally'](function () {
            that.standby = true;
          });
        },
        forceResult: function () {
        },
        getExpectedImageCount: function () {
          return this.languages.length * 12;
        },
        ready: function () {
          // TODO: Ready per language
          if (this.getExpectedImageCount() === this.readyVisuals) {
            console.log('ready');
            this.imagesDeferred.resolve();
          }
          return this.imagesDeferred.promise;
        },
        getResourceUrl: function () {
          return this.url + '?format=json&q=' + this.query;
        },
        get: function (query) {
          // Make service available to callbacks through that var
          var that = this;
          if (!this.standby) {
            if (query && query != this.query) {
              // The query is different than before
              // So we reset and continue normal execution
              this.reset();
              this.query = query;
              this.standby = false;
            }
          } else {
            // We reset if service is standing by
            // And claim it as
            this.reset();
            this.query = query;
            this.standby = false;
          }
          $http({
            method: 'GET',
            url: this.getResourceUrl()
          }).success(function (data, status, headers, config) {
            if (status == 200) {
              that.process(data);
              that.deferred.resolve(status);
            } else {
              that.deferred.notify(status);  // 202, request accepted
            }
          }).error(function (data, status, headers, config) {
            that.deferred.reject(status);
          });
          return this.deferred.promise;
        },
        process: function (data) {
          this.languages = data;
          data.randomize();
          for (var i = 0; i < data.length; ++i) {
            this.processLanguage(data[i]);
          }
        },
        processLanguage: function (data) {
          data.translations.randomize();
          data.translations.pad(12);
          // ensures length==12
          data.translations.randomize();
          for (var i = 0; i < data.translations.length; ++i) {
            this.processWord(data.translations[i]);
          }
        },
        processWord: function (data) {
          var that = this;
          data.visuals = [];
          data.sources = {};
          function getImage(index) {
            if (index >= data.images.length) {
              data.rejected = true;
              return;
            }
            var candidate = data.images[index];
            if (candidate.link in data.sources && !data.sources[candidate.link]) {
              getImage(index + 1);
            }
            var image = new $Image(data.images[index], that.readyVisuals);
            $q.when(image.load(data.sources)).then(function resolve(image) {
              data.visuals.push(image);
              data.sources[image.link] = true;
              ++that.readyVisuals;
              that.imagesDeferred.notify(that.readyVisuals);
              that.ready();
            }, function reject(image) {
              data.sources[image.link] = false;
              getImage(index + 1);
            });
          }
          if (data.hasOwnProperty('videos') && data.videos) {
            data.videos.randomize();
          }
          if (data.hasOwnProperty('images') && data.images) {
            data.images.randomize();
            getImage(0);
          }
        }
      };
    return visualTranslationService;
  }
]);
'use strict';
angular.module('globeScopeApp').factory('kioskService', function () {
  var kioskService = {
      containerWidth: 0,
      containerHeight: 0,
      setKioskSettings: function (kioskSettings) {
        // Gateway
        var ks = kioskSettings;
        if (this.containerWidth == ks.containerWidth && this.containerHeight == ks.containerHeight) {
          return;
        }  // Some code to monitor quality
        else if (ks.containerWidth < ks.minimalWidth || ks.containerHeight < ks.minimalHeight) {
          this.kioskStatus = 'no-fit';
          return;
        } else {
          this.containerWidth = ks.containerWidth;
          this.containerHeight = ks.containerHeight;
        }
        // Default values
        this.kioskWidth = ks.containerWidth;
        this.kioskHeight = ks.containerHeight;
        this.kioskTop = 0;
        this.kioskLeft = 0;
        this.kioskStatus = 'fit';
        // Calculate ratios
        var idealRatio = ks.ratioWidth / ks.ratioHeight;
        var realRatio = ks.containerWidth / ks.containerHeight;
        // height of viewport to large
        // we need to restrict the height
        // we get whitespace above and below kiosk
        if (realRatio < idealRatio) {
          var allowedHeight = ks.containerWidth / ks.ratioWidth * ks.ratioHeight;
          allowedHeight = Math.round(allowedHeight);
          var whiteSpace = Math.round((ks.containerHeight - allowedHeight) / 2);
          this.kioskHeight = allowedHeight;
          this.kioskTop = whiteSpace;
          this.kioskStatus = 'mis-fit';  // width of viewport to large
                                         // we need to restrict the width
                                         // we get whitespace left and right of kiosk
        } else if (realRatio > idealRatio) {
          var allowedWidth = ks.containerHeight / ks.ratioHeight * ks.ratioWidth;
          allowedWidth = Math.round(allowedWidth);
          var whiteSpace = Math.round((ks.containerWidth - allowedWidth) / 2);
          this.kioskWidth = allowedWidth;
          this.kioskLeft = whiteSpace;
          this.kioskStatus = 'mis-fit';
        }
      },
      style: function (kioskSettings) {
        this.setKioskSettings(kioskSettings);
        this.kioskStyle = {
          'width': this.kioskWidth,
          'height': this.kioskHeight,
          'top': this.kioskTop,
          'left': this.kioskLeft
        };
        return this.kioskStyle;
      },
      css_class: function (kioskSettings) {
        this.setKioskSettings(kioskSettings);
        this.kioskClass = this.kioskStatus;
        return this.kioskClass;
      }
    };
  return kioskService;
});
'use strict';
angular.module('globeScopeApp').controller('MainCtrl', [
  '$scope',
  function ($scope) {
  }
]);
'use strict';
angular.module('globeScopeApp').controller('SearchCtrl', [
  '$scope',
  '$state',
  function ($scope, $state) {
    $scope.translateToVisuals = function (query) {
      $state.go('translate', { q: query });
    };
  }
]);
'use strict';
/*global HIF, $ */
angular.module('globeScopeApp').controller('ResultCtrl', [
  '$scope',
  '$rootScope',
  '$state',
  '$location',
  '$timeout',
  '$anchorScroll',
  'visualTranslationService',
  function ($scope, $rootScope, $state, $location, $timeout, $anchorScroll, $Translation) {
    var $window = $(window);
    var currentState = $state.current.name, currentQ = $location.search().q;
    // Ensure minimal width and height when loading ...
    if ($window.width() < HIF.resultSettings.minimalWidth || $window.height() < HIF.resultSettings.minimalHeight) {
      $state.go('resize', {
        referralState: currentState,
        referralQ: currentQ
      }, { location: 'replace' });
      return;
    }
    var rs = HIF.resultSettings;
    var windowWidth = $window.width();
    var imageWidth = Math.floor(windowWidth / 4);
    // TODO: remove hard code
    var imageHeight = imageWidth / rs.ratioWidth * rs.ratioHeight;
    imageHeight = Math.round(imageHeight);
    rs.imageWidth = imageWidth;
    rs.imageHeight = imageHeight;
    $scope.languageContentStyle = { height: 3 * imageHeight };
    $scope.footerWhitespaceStyle = { height: $window.height() - 3 * imageHeight - 2 * 65 };
    $scope.goTo = function (anchor) {
      $location.hash(anchor).replace();
      $anchorScroll();
    };
    // TODO: move to kiosk service or resize service
    $window.resize(function () {
      $state.go('resize', {
        referralState: currentState,
        referralQ: currentQ
      }, { location: 'replace' });
    });
    var active = false;
    var animatePromise;
    function animate() {
      active = !active;
      $scope.animationClass = { active: active };
      animatePromise = $timeout(animate, HIF.resultSettings.animationInterval * 1000);
    }
    var resultsReceived = $scope.$on('results-received', function (event) {
        $scope.images = { needed: $Translation.getExpectedImageCount() };
        $Translation.ready().then(function resolve() {
          $scope.languages = $Translation.languages;
          $timeout(animate, 100);
        }, function reject() {
        }, function notify(images) {
          $scope.images.loaded = images;
        });
      });
    $scope.$on('$destroy', function () {
      $(window).unbind('resize');
      // don't use $window it's slower
      resultsReceived();
      // TODO: necessary or automatic?
      $timeout.cancel(animatePromise);
    });
  }
]).filter('word_video', [
  '$sce',
  function ($sce) {
    // TODO: move to translation service
    return function (language, index) {
      var url = 'http://www.youtube.com/embed/';
      var videos = language.translations[index].videos;
      var startVid = videos[0].vid;
      var vids = '';
      for (var i = 1; i < videos.length; ++i) {
        vids += videos[i].vid + ',';
      }
      var params = '?' + 'autoplay=0&controls=0&showinfo=0&playlist=' + vids;
      return $sce.trustAsResourceUrl(url + startVid + params);
    };
  }
]);
'use strict';
angular.module('globeScopeApp').controller('ResizeCtrl', [
  '$scope',
  '$timeout',
  '$state',
  '$stateParams',
  'kioskService',
  function ($scope, $timeout, $state, $stateParams, kiosk) {
    var kioskSettings = HIF.resultSettings;
    function relocate() {
      $scope.relocatePromise = $timeout(function () {
        $state.go($stateParams.referralState, { q: $stateParams.referralQ }, { location: 'replace' });
      }, 1000);
    }
    relocate();
    $scope.$on('resize', function (event) {
      $timeout.cancel($scope.relocatePromise);
      relocate();
      var $window = $(window);
      // do not make global, this is faster
      event.currentScope.width = kioskSettings.containerWidth = $window.width();
      event.currentScope.height = kioskSettings.containerHeight = $window.height();
      event.currentScope.minimalWidth = kioskSettings.minimalWidth;
      event.currentScope.minimalHeight = kioskSettings.minimalHeight;
      // TODO: refactor the kiosk code
      event.currentScope.sizeClass = kiosk.css_class(kioskSettings);
      if (kiosk.kioskStatus == 'no-fit') {
        $timeout.cancel($scope.relocatePromise);
      }
    });
    // Initial values
    $scope.$emit('resize');
    // Act on browser resize
    $(window).resize(function () {
      $scope.$apply(function () {
        $scope.$emit('resize');
      });
    });
    $scope.$on('$destroy', function () {
      $(window).unbind('resize');
      $timeout.cancel($scope.relocatePromise);
    });
  }
]);
'use strict';
angular.module('globeScopeApp').controller('WaitingCtrl', [
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$timeout',
  'visualTranslationService',
  function ($scope, $rootScope, $state, $stateParams, $timeout, $Translation) {
    if (!$stateParams.q) {
      $state.go('main');
    }
    // Preparation
    var ws = HIF.waitingSettings;
    $scope.max_progress = ws.max_progress;
    $scope.progress = 0;
    // Refresh logic
    var expected_attempts = Math.ceil(ws.expected_duration / ws.retry_speed);
    var progress_per_attempt = Math.ceil(ws.max_progress / expected_attempts);
    var progress_per_refresh = Math.floor(progress_per_attempt * ws.refresh_rate);
    var refreshPromise;
    function refresh() {
      $scope.progress += progress_per_refresh;
      if ($scope.progress >= $scope.max_progress) {
        $scope.progress = $scope.max_progress - 3;
        return;
      }
      refreshPromise = $timeout(refresh, ws.refresh_speed);
    }
    // Retrieve logic
    var retryPromise;
    function retrieve() {
      $Translation.get($stateParams.q).then(function resolve(status) {
        $rootScope.$broadcast('results-received');
        $rootScope.loadClass = ['done'];
      }, function reject(status) {
        if (status === 400) {
          alert(data.detail);
        } else {
          console.log('going to error state');
          $state.go('error', {}, { reload: true });
        }
      }, function notify(status) {
        retryPromise = $timeout(retrieve, ws.retry_speed);
      });
    }
    // Fire off
    retrieve();
    refresh();
    // Deconstructor
    $scope.$on('$destroy', function () {
      $timeout.cancel(refreshPromise);
      $timeout.cancel(retryPromise);
    });
  }
]);
'use strict';
angular.module('globeScopeApp').controller('ErrorCtrl', [
  '$scope',
  function ($scope) {
  }
]);
'use strict';
angular.module('globeScopeApp').controller('QuestionCtrl', [
  '$scope',
  '$http',
  '$location',
  function ($scope, $http, $location) {
    function addContext(form) {
      form['question'] = $scope.question;
      form['userAgent'] = navigator.userAgent;
      form['screen'] = $location.absUrl();
      form['referral'] = document.referrer;
      form['time'] = new Date().toISOString();
      return form;
    }
    $scope.send = function () {
      var data = addContext($scope.questionForm);
      $http.post(HIF.questionEndpoint, data).then(function resolve(response) {
        alert('Thank you for your feedback');
      }, function reject(error) {
        alert('I\'m sorry, something went wrong with sending your feedback. Please try again.');
      });
    };
  }
]);