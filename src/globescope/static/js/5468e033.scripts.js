"use strict";angular.module("globeScopeApp",["ngSanitize","ngCookies","ui.router"]).config(["$stateProvider","$urlRouterProvider",function(a,b){a.state("main",{url:"/",onEnter:["$rootScope",function(a){a.loadClass=[]}],views:{main:{templateUrl:"views/main.html",controller:"MainCtrl"},load:{template:""}}}).state("translate",{url:"/result?q",onEnter:["$rootScope",function(a){a.loadClass=["loading"]}],views:{main:{templateUrl:"views/result.html",controller:"ResultCtrl"},load:{templateUrl:"views/waiting.html",controller:"WaitingCtrl"}}}).state("resize",{params:["referralState","referralQ"],onEnter:["$rootScope",function(a){a.loadClass=[]}],views:{main:{templateUrl:"views/resize.html",controller:"ResizeCtrl"},load:{template:""}}}).state("error",{onEnter:["$rootScope",function(a){a.loadClass=[]}],url:"/error",views:{main:{templateUrl:"views/error.html",controller:"ErrorCtrl"},load:{template:""}}}),b.otherwise("/")}]).run(["$rootScope","$state","$location","$http","$cookies",function(a,b,c,d,e){d.defaults.headers.post["X-CSRFToken"]=e.csrftoken}]),Array.prototype.randomize=function(){for(var a=this.length-1;a>0;a--){var b=Math.floor(Math.random()*(a+1)),c=this[a];this[a]=this[b],this[b]=c}},Array.prototype.pad=function(a){for(var b=0,c=this.length;this.length<a;++b)this.push($.extend(!0,{},this[b%c]))},angular.module("globeScopeApp").factory("imageService",["$q","$timeout",function(a,b){function c(b,c){this.propertySeed=c,this.width=b.width,this.height=b.height,this.link=b.link,this.timeoutPromise=null,this.deferred=a.defer();var d=this;this.deferred["finally"]=function(){d.timeoutPromise.cancel()},this.yproperties=["top","bottom"],this.noAnimationTreshold=57,this.viewPort=!1}return c.prototype.setViewport=function(){var a=HIF.resultSettings,b=$(window).width(),c=Math.floor(b/4),d=c/a.ratioWidth*a.ratioHeight;d=Math.round(d),a.imageWidth=c,a.imageHeight=d,this.viewPort={width:a.imageWidth,height:a.imageHeight}},c.prototype.load=function(c){if(this.viewPort||this.setViewport(),"undefined"!=typeof c&&this.link in c)return c[this.link]?this:a.reject(this);if(this.getActualHeightWhenFullWidth(this.viewPort)<this.viewPort.height||this.width<this.viewPort.width)return a.reject(this);var d=this;this.timeoutPromise=b(function(){d.deferred.reject(d)},1e3);var e=new Image;return $(e).load(function(){return this.height<d.height||this.width<d.width?void d.deferred.reject(d):(d.width=this.width,d.height=this.height,void d.deferred.resolve(d))}).error(function(){d.deferred.reject(d)}).prop("src",this.link),e.complete&&(this.width=e.width,this.height=e.height,b.cancel(this.timeoutPromise)),e.complete?this:this.deferred.promise},c.prototype.getOffsetProperty=function(){return this.yproperties[this.propertySeed%2]},c.prototype.getActualHeightWhenFullWidth=function(a){var b=this.width/a.width,c=this.height/b;return Math.round(c)},c.prototype.getOverflowPercentage=function(a){var b=this.getActualHeightWhenFullWidth(a)-a.height;return Math.ceil(b/a.height*100)},c.prototype.style=function(){this.viewPort||this.setViewport();var a=HIF.resultSettings.animationInterval,b={width:"100%",transition:"top "+a+"s linear, bottom "+a+"s linear"},c=this.getOverflowPercentage(this.viewPort),d=c>this.noAnimationTreshold;return b[this.getOffsetProperty()]=d?-1*c+"%":-1*(c/2)+"%",b},c.prototype.cssClass=function(){this.viewPort||this.setViewport();var a=this.getOverflowPercentage(this.viewPort)>this.noAnimationTreshold;return a?this.getOffsetProperty()+"-overflow":""},c}]),angular.module("globeScopeApp").factory("visualTranslationService",["$http","$q","imageService",function(a,b,c){var d={url:HIF.translationEndpoint,languages:[],query:"",deferred:!1,promise:!1,standby:!0,readyVisuals:0,reset:function(){console.log("Resetting $Translation");for(var a=0;a<this.languages.length;++a)for(var c=0;c<this.languages[a].translations.length;++c)for(var d=0;d<this.languages[a].translations[c].visuals.length;++d)delete this.languages[a].translations[c].visuals[d];this.languages=[],this.readyVisuals=0,this.query="",this.deferred=!1,this.imagesDeferred=!1,this.deferred=b.defer(),this.imagesDeferred=b.defer();var e=this;this.deferred.promise["finally"](function(){e.standby=!0})},forceResult:function(){},getExpectedImageCount:function(){return 12*this.languages.length},ready:function(){return this.getExpectedImageCount()===this.readyVisuals&&(console.log("ready"),this.imagesDeferred.resolve()),this.imagesDeferred.promise},getResourceUrl:function(){return this.url+"?format=json&q="+this.query},get:function(b){var c=this;return this.standby?(this.reset(),this.query=b,this.standby=!1):b&&b!=this.query&&(this.reset(),this.query=b,this.standby=!1),a({method:"GET",url:this.getResourceUrl()}).success(function(a,b){200==b?(c.process(a),c.deferred.resolve(b)):c.deferred.notify(b)}).error(function(a,b){c.deferred.reject(b)}),this.deferred.promise},process:function(a){this.languages=a,a.randomize();for(var b=0;b<a.length;++b)this.processLanguage(a[b])},processLanguage:function(a){a.translations.randomize(),a.translations.pad(12),a.translations.randomize();for(var b=0;b<a.translations.length;++b)this.processWord(a.translations[b])},processWord:function(a){function d(f){if(f>=a.images.length)return void(a.rejected=!0);var g=a.images[f];g.link in a.sources&&!a.sources[g.link]&&d(f+1);var h=new c(a.images[f],e.readyVisuals);b.when(h.load(a.sources)).then(function(b){a.visuals.push(b),a.sources[b.link]=!0,++e.readyVisuals,e.imagesDeferred.notify(e.readyVisuals),e.ready()},function(b){a.sources[b.link]=!1,d(f+1)})}var e=this;a.visuals=[],a.sources={},a.hasOwnProperty("videos")&&a.videos&&a.videos.randomize(),a.hasOwnProperty("images")&&a.images&&(a.images.randomize(),d(0))}};return d}]),angular.module("globeScopeApp").factory("kioskService",function(){var a={containerWidth:0,containerHeight:0,setKioskSettings:function(a){var b=a;if(this.containerWidth!=b.containerWidth||this.containerHeight!=b.containerHeight){if(b.containerWidth<b.minimalWidth||b.containerHeight<b.minimalHeight)return void(this.kioskStatus="no-fit");this.containerWidth=b.containerWidth,this.containerHeight=b.containerHeight,this.kioskWidth=b.containerWidth,this.kioskHeight=b.containerHeight,this.kioskTop=0,this.kioskLeft=0,this.kioskStatus="fit";var c=b.ratioWidth/b.ratioHeight,d=b.containerWidth/b.containerHeight;if(c>d){var e=b.containerWidth/b.ratioWidth*b.ratioHeight;e=Math.round(e);var f=Math.round((b.containerHeight-e)/2);this.kioskHeight=e,this.kioskTop=f,this.kioskStatus="mis-fit"}else if(d>c){var g=b.containerHeight/b.ratioHeight*b.ratioWidth;g=Math.round(g);var f=Math.round((b.containerWidth-g)/2);this.kioskWidth=g,this.kioskLeft=f,this.kioskStatus="mis-fit"}}},style:function(a){return this.setKioskSettings(a),this.kioskStyle={width:this.kioskWidth,height:this.kioskHeight,top:this.kioskTop,left:this.kioskLeft},this.kioskStyle},css_class:function(a){return this.setKioskSettings(a),this.kioskClass=this.kioskStatus,this.kioskClass}};return a}),angular.module("globeScopeApp").controller("MainCtrl",["$scope",function(){}]),angular.module("globeScopeApp").controller("SearchCtrl",["$scope","$state",function(a,b){a.translateToVisuals=function(a){b.go("translate",{q:a})}}]),angular.module("globeScopeApp").controller("ResultCtrl",["$scope","$rootScope","$state","$location","$timeout","$anchorScroll","visualTranslationService",function(a,b,c,d,e,f,g){function h(){q=!q,a.animationClass={active:q},p=e(h,1e3*HIF.resultSettings.animationInterval)}var i=$(window),j=c.current.name,k=d.search().q;if(i.width()<HIF.resultSettings.minimalWidth||i.height()<HIF.resultSettings.minimalHeight)return void c.go("resize",{referralState:j,referralQ:k},{location:"replace"});var l=HIF.resultSettings,m=i.width(),n=Math.floor(m/4),o=n/l.ratioWidth*l.ratioHeight;o=Math.round(o),l.imageWidth=n,l.imageHeight=o,a.languageContentStyle={height:3*o},a.footerWhitespaceStyle={height:i.height()-3*o-130},a.goTo=function(a){d.hash(a).replace(),f()},i.resize(function(){c.go("resize",{referralState:j,referralQ:k},{location:"replace"})});var p,q=!1,r=a.$on("results-received",function(){a.images={needed:g.getExpectedImageCount()},g.ready().then(function(){a.languages=g.languages,e(h,100)},function(){},function(b){a.images.loaded=b})});a.$on("$destroy",function(){$(window).unbind("resize"),r(),e.cancel(p)})}]).filter("word_video",["$sce",function(a){return function(b,c){for(var d="http://www.youtube.com/embed/",e=b.translations[c].videos,f=e[0].vid,g="",h=1;h<e.length;++h)g+=e[h].vid+",";var i="?autoplay=0&controls=0&showinfo=0&playlist="+g;return a.trustAsResourceUrl(d+f+i)}}]),angular.module("globeScopeApp").controller("ResizeCtrl",["$scope","$timeout","$state","$stateParams","kioskService",function(a,b,c,d,e){function f(){a.relocatePromise=b(function(){c.go(d.referralState,{q:d.referralQ},{location:"replace"})},1e3)}var g=HIF.resultSettings;f(),a.$on("resize",function(c){b.cancel(a.relocatePromise),f();var d=$(window);c.currentScope.width=g.containerWidth=d.width(),c.currentScope.height=g.containerHeight=d.height(),c.currentScope.minimalWidth=g.minimalWidth,c.currentScope.minimalHeight=g.minimalHeight,c.currentScope.sizeClass=e.css_class(g),"no-fit"==e.kioskStatus&&b.cancel(a.relocatePromise)}),a.$emit("resize"),$(window).resize(function(){a.$apply(function(){a.$emit("resize")})}),a.$on("$destroy",function(){$(window).unbind("resize"),b.cancel(a.relocatePromise)})}]),angular.module("globeScopeApp").controller("WaitingCtrl",["$scope","$rootScope","$state","$stateParams","$timeout","visualTranslationService",function(a,b,c,d,e,f){function g(){return a.progress+=n,a.progress>=a.max_progress?void(a.progress=a.max_progress-3):void(j=e(g,i.refresh_speed))}function h(){f.get(d.q).then(function(){b.$broadcast("results-received"),b.loadClass=["done"]},function(a){400===a?alert(data.detail):(console.log("going to error state"),c.go("error",{},{reload:!0}))},function(){k=e(h,i.retry_speed)})}d.q||c.go("main");var i=HIF.waitingSettings;a.max_progress=i.max_progress,a.progress=0;var j,k,l=Math.ceil(i.expected_duration/i.retry_speed),m=Math.ceil(i.max_progress/l),n=Math.floor(m*i.refresh_rate);h(),g(),a.$on("$destroy",function(){e.cancel(j),e.cancel(k)})}]),angular.module("globeScopeApp").controller("ErrorCtrl",["$scope",function(){}]),angular.module("globeScopeApp").controller("QuestionCtrl",["$scope","$http","$location",function(a,b,c){function d(b){return b.question=a.question,b.userAgent=navigator.userAgent,b.screen=c.absUrl(),b.referral=document.referrer,b.time=(new Date).toISOString(),b}a.send=function(){var c=d(a.questionForm);b.post(HIF.questionEndpoint,c).then(function(){alert("Thank you for your feedback")},function(){alert("I'm sorry, something went wrong with sending your feedback. Please try again.")})}}]);