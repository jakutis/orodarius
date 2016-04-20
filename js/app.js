"use strict";!function(){angular.module("orodarius",["LocalStorageModule","ngAnimate"]),angular.module("orodarius").config(["localStorageServiceProvider",function(t){t.setPrefix("orodarius")}]),angular.module("orodarius").run(["$window",function(t){$(t).on("resize",_.throttle(function(){$("#main-video-player").attr("width",t.innerWidth).attr("height",t.innerHeight)},400))}])}(),function(){angular.module("orodarius").directive("ngBindKeys",["$document",function(t){return{restrict:"A",scope:{ngBindKeysOptions:"=ngBindKeys"},link:function(e,i,n){_(e.ngBindKeysOptions).map(function(t,e){return e}).value();t.on("keydown",function(t){if("INPUT"!==t.target.nodeName){var i=t.which||t.keyCode;e.ngBindKeysOptions[i]&&(t.preventDefault(),e.ngBindKeysOptions[i].call({},t))}})}}}])}(),function(){angular.module("orodarius").directive("ngEnter",function(){return{restrict:"A",replace:!1,scope:{ngEnter:"&",ngEnterOptions:"="},link:function(t,e,i){e.on("keypress",function(i){(13===i.which||13===i.keyCode)&&(t.ngEnter.call(),t.ngEnterOptions.blurOnEnter&&$(e).blur(),t.$apply())})}}})}(),function(){angular.module("orodarius").directive("ngInputChange",function(){return{restrict:"A",scope:{ngInputChange:"&"},replace:!1,link:function(t,e,i){$(e).on("change input",function(){t.ngInputChange.call(null)}),t.$on("$destroy",function(){$(e).off("change input")})}}})}(),function(){angular.module("orodarius").directive("ngScrollTo",["$rootScope","$timeout",function(t,e){return{restrict:"A",scope:{ngScrollTo:"=",offsetTop:"@"},link:function(i,n){var r=$(n);t.$on("orodariusScrollIntoView",function(){e(function(){var t=$(n).find(i.ngScrollTo);t.length&&(r.get(0).scrollTop=0,r.get(0).scrollTop=t.position().top-(parseInt(r.css("padding-top"),10)||0)-parseInt(i.offsetTop,10))},100)})}}}])}(),function(){angular.module("orodarius").directive("youtubePlayer",["$window","PlayerService",function(t,e){return{restrict:"A",replace:!1,link:function(i,n,r){if(!i.isDisabled){var o=$("<script>").attr({src:"https://www.youtube.com/iframe_api",async:!0});$("script").eq(0).before(o)}t.onYouTubeIframeAPIReady=function(){e.createNewPlayer(r.youtubePlayer||"main-video-player")}}}}])}(),function(){angular.module("orodarius").factory("youtubeUrlParser",function(){function t(t){var n=e.exec(t);if(n||(n=i.exec(t)),n){var r=/t=(.*?)&|t=(.*?)$/i,o=0,a=r.exec(t);if(null!==a){var s={h:3600,m:60,s:1},u=/[0-9]+[h|m|s]/gi,l=a[0].match(u);l?l.forEach(function(t){var e=s[t.charAt(t.length-1)],i=parseInt(t.slice(0,-1),10);o+=e*i}):(o=parseInt(a[0].replace("t=",""),10),isNaN(o)&&(o=0))}return{id:n[1],starttime:o}}return""}var e=/^(?:https?:)?(?:\/\/)?(?:www\.|m\.)?youtube\.com\/watch\?.*v=([\w\-]+)/i,i=/^https?:\/\/(?:www\.)?youtu\.be\/([\w\-]+)/i;return t})}(),function(){angular.module("orodarius").filter("thumbnailUrlFilter",function(){return function(t){switch(t){case"nsfw":return"images/nsfw-thumbnail.jpg";case"default":return"images/default-thumbnail.png"}return t}})}(),function(){function t(){return{bindings:{},templateUrl:"views/player-overlay.html",controller:["PlayerService",function(t){this.getCurrentVideoItem=function(){return t.currentVideoItem}}]}}angular.module("orodarius").component("playerOverlay",t())}(),function(){angular.module("orodarius").component("player",{bindings:{},templateUrl:"views/player.html",controller:function(){}})}(),function(){angular.module("orodarius").component("root",{bindings:{},templateUrl:"views/root.html",controller:["$scope","PlayerService","PlaylistService","SidebarService",function(t,e,i,n){function r(){i.playlist.length&&(e.playPrevious(),t.$apply())}function o(){i.playlist.length&&(e.playNext(),t.$apply())}this.keyboardEventsOptions={38:function(){r()},37:function(){r()},39:function(){o()},40:function(){o()},32:function(){e.playOrPause()},16:function(e){n.toggle(),t.$apply()},27:function(e){"settings"===n.state.get()?n.state.set("main"):n.close(),t.$apply()},83:function(e){"settings"!==n.state.get()&&(n.state.set("settings"),t.$apply())}}}]})}(),function(){angular.module("orodarius").service("LastSubredditsService",["localStorageService",function(t){function e(t){i(t)||(s.unshift(t),s=s.slice(0,a),n())}function i(t){return-1!==_.findIndex(s,function(e){return t.name===e.name})}function n(){t.set("lastSubreddits",s)}function r(){return s}var o="lastSubreddits",a=10,s=t.get(o);return angular.isArray(s)||(s=[]),{getList:r,add:e}}])}(),function(){angular.module("orodarius").service("PlayerService",["$window","$timeout","PlaylistService","SettingsService","$rootScope",function(t,e,i,n,r){function o(){}function a(t){-1!=[2,5,100,101,150].indexOf(t.data)&&(this.markCurrentVideoItemWithError(t.data),this.playNext())}function s(t){return t.ownId===this.currentVideoItem.ownId}function u(t){switch(t){case 2:return"can't parse video ID";case 5:return"problem with HTML5 Youtube player";case 100:return"video is private or removed";case 101:case 150:return"uploader does not allow embedded playback"}}this.youtubePlayer=null,this.isPlaying=!1,this.currentVideoItem={},this.markCurrentVideoItemWithError=function(t){var e=this,n=_.findIndex(i.playlist,function(t){return t.ownId===e.currentVideoItem.ownId});i.playlist[n].error={code:t,message:u(t)}},this.createNewPlayer=function(e,i){var n={width:t.innerWidth,height:t.innerHeight,videoId:"DT2oAtQtFrg",playerVars:{autohide:1,autoplay:0,controls:1,disablekb:1,enablejsapi:1}};return angular.extend(n,i),this.youtubePlayer=new YT.Player(e||"main-video-player",n),this.youtubePlayer.addEventListener("onReady",o.bind(this)),this.youtubePlayer.addEventListener("onError",a.bind(this)),this.youtubePlayer.addEventListener("onStateChange",this.onPlayerStateChange.bind(this)),this.youtubePlayer},this.playVideo=function(t){if(this.youtubePlayer&&this.youtubePlayer.loadVideoById&&t){if(t.url===!1)return void this.playNext();this.youtubePlayer.loadVideoById({videoId:t.videoId,startSeconds:t.starttime||0,suggestedQuality:"default"}),this.currentVideoItem=t,this.isPlaying=!0,n.set("watchCount",n.list.watchCount+1)}e()},this.playNext=function(){var t=this,e=_.findIndex(i.playlist,s.bind(this))+1;e===i.playlist.length?i.expandPlaylist().then(function(n){t.playVideo(i.playlist[e]),r.$emit("orodariusScrollIntoView")}):(this.playVideo(i.playlist[e]),r.$emit("orodariusScrollIntoView"))},this.playPrevious=function(){var t=_.findIndex(i.playlist,s.bind(this))-1;this.playVideo(i.playlist[0>t?0:t],"previous"),r.$emit("orodariusScrollIntoView")},this.playOrPause=function(){this.isPlaying?(this.youtubePlayer.pauseVideo(),this.isPlaying=!1):(this.youtubePlayer.playVideo(),this.isPlaying=!0)},this.resetCurrentVideoItem=function(){this.currentVideoItem=void 0},this.onPlayerStateChange=function(t){var i=this;n.list.isFocusForced&&document.activeElement.blur(),n.list.isFlashModeEnabled&&1===t.data&&e(function(){i.playNext()},5e3),0===t.data&&this.playNext()}}])}(),function(){angular.module("orodarius").service("PlaylistService",["RedditService",function(t){function e(t){return this.playlist.push(t),a(),this.playlist}function i(){var e=this,i=arguments.length<=0||void 0===arguments[0]?"":arguments[0];return this.isLoading=!0,t.fetch(i).then(function(t){return t?(e.playlist=e.playlist.concat(t),a(),t):void 0},angular.noop)["finally"](function(){return e.isLoading=!1})}function n(){var e=this;return this.isLoading=!0,t.getNext().then(function(t){t&&(e.playlist=e.playlist.concat(t),a())},angular.noop)["finally"](function(){return e.isLoading=!1})}function r(){this.playlist=[],a()}function o(t){s.push(t)}function a(){s.map(function(t){return t()})}var s=[];this.playlist=[],this.isLoading=!1,this.add=e,this.clear=r,this.fetchSubreddit=i,this.expandPlaylist=n,this.subscribePlaylist=o}])}(),function(){function t(t,e,i,n,r,o){function a(){function i(t,e,i,n){var d=this,y=t.data;h++,p=y.after,m=!1;var v=s(u(y.children));if(v.length&&r.add({name:o}),0===v.length&&g>=h)a.call(this,o,p,f);else{var b=(l(v),_.filter(v,function(t){return c.call(d,t)}));this.items=this.items.concat(b),h=0,f.resolve(b)}}function n(t,e,i,n){m=!1,f.reject(t)}var o=arguments.length<=0||void 0===arguments[0]?"":arguments[0],d=arguments.length<=1||void 0===arguments[1]?"":arguments[1],f=e.defer(),b=""+v+o+"/hot.json?limit=50"+(d?"&after="+d:"");return p=d,y=o,m=!0,_.isEmpty(o)?f.reject():t.get(b).success(i.bind(this)).error(n.bind(this)),f.promise}function s(t){var e=_(t).map(function(t){return JSON.stringify(t)}).value();return _(_.uniq(e)).map(function(t){return JSON.parse(t)}).value()}function u(t){return _(t).filter(function(t){return"t3"===t.kind&&"youtube.com"===t.data.domain}).map(function(t){var e=i(t.data.url);return{title:t.data.title,url:t.data.url,videoId:e.id,starttime:e.starttime,thumbnailUrl:n("thumbnailUrlFilter")(t.data.thumbnail),created:t.data.created,redditUrl:"http://reddit.com"+t.data.permalink,redditScore:t.data.score,subreddit:t.data.subreddit,error:null}}).value()}function l(t){var e={"&amp;":"&","&copy;":"©","&reg;":"®"};return _(t).map(function(t){return t.title=t.title.replace(/(&amp;|&copy;|&reg;)/g,function(t){return e[t]}),t.ownId=_.uniqueId("orodarius_video-item_"),t}).value()}function c(t){var e=_(this.items).filter(function(e){return e.videoId===t.videoId}).value().length;return e>0?!1:!0}function d(){var t=e.defer();return m||(p?this.fetch(y,p).then(function(e){return t.resolve(e)},function(){return t.reject()}):(o.warn("cant expand playlist, no afterTag found!"),t.reject())),t.promise}function f(){this.items=[]}var h=0,g=3,p="",m=!1,y="";this.fetch=a,this.items=[],this.getNext=d,this.clearCache=f;var v="http://www.reddit.com/r/"}angular.module("orodarius").service("RedditService",["$http","$q","youtubeUrlParser","$filter","LastSubredditsService","$log",t])}(),function(){var t={watchCount:0,isSidebarSticky:!1,isFocusForced:!1,sources:[{name:"reddit",apiUrl:"http://www.reddit.com/r/",isEnabled:!0}]};angular.module("orodarius").service("SettingsService",["localStorageService",function(e){function i(t,e){s[t]=e,o()}function n(t){"undefined"!=typeof s[t]?(s[t]=!s[t],o()):s[t]=!0}function r(t,e){s[t]=e,o()}function o(){e.set(a,s)}var a="settings",s=e.get(a);return null===s&&(s=t,o()),_.defaultsDeep(s,t),o(),{list:s,add:i,toggle:n,set:r}}])}(),function(){angular.module("orodarius").service("SidebarService",function(){this.state=new function(){var t="main",e=[],i=function(e){return t=e},n=function(){return t},r=function(){return _.each(e,function(e){return e(t)})},o=function(t){return e=[t].concat(e),t},a=function(t){return e=_.without(e,t)},s=function(t){return function(){return a(t)}};return{get:n,set:_.flow(i,r),subscribe:_.flow(o,s)}},this.isOpen=!0,this.toggle=function(t){this.isOpen=t||!this.isOpen},this.close=function(){this.isOpen=!1}})}(),function(){angular.module("orodarius").component("settingsPanel",{bindings:{},templateUrl:"views/sidebar/settings-panel.html",controller:["SettingsService","$window","$timeout",function(t,e,i){function n(){t.toggle("isSidebarSticky")}function r(){t.toggle("isFlashModeEnabled")}function o(){t.toggle("isFocusForced"),e[(t.list.isFocusForced?"add":"remove")+"EventListener"]("blur",a)}function a(){i(function(){return e.focus()},100)}this.settings=t.list,this.toggleStickySidebar=n,this.toggleFlashMode=r,this.toggleFocusForced=o,t.list.isFocusForced&&e.addEventListener("blur",a)}]})}(),function(){angular.module("orodarius").component("sidebarEmpty",{bindings:{onSubredditClick:"&"},templateUrl:"views/sidebar/sidebar-empty.html",controller:["LastSubredditsService",function(t){this.lastSubreddits=t.getList(),this.suggestedSubreddits=[{name:"videos"},{name:"youtubehaiku"},{name:"artisanvideos"},{name:"listentothis"},{name:"gamephysics"},{name:"music"},{name:"videos+youtubehaiku"}]}]})}(),function(){angular.module("orodarius").component("sidebarFoot",{bindings:{},templateUrl:"views/sidebar/sidebar-foot.html",controller:["$http",function(t){this.lastUpdatedData={},this.getLastUpdated=function(){var e=this;t.get("https://api.github.com/repos/argshook/orodarius/commits/gh-pages").then(function(t){return e.lastUpdatedData={url:t.data.html_url,date:t.data.commit.author.date,message:t.data.commit.message}})},this.getLastUpdated()}]})}(),function(){angular.module("orodarius").component("sidebarHead",{bindings:{isLoading:"=",currentSubreddit:"=",currentState:"=",onSearchStart:"&",onSettingsClick:"&"},templateUrl:"views/sidebar/sidebar-head.html"})}(),function(){angular.module("orodarius").component("sidebarList",{bindings:{list:"=",currentSubreddit:"=",isLoading:"=",onItemClick:"&",onExpandClick:"&"},templateUrl:"views/sidebar/sidebar-list.html"})}(),function(){angular.module("orodarius").component("sidebar",{bindings:{},templateUrl:"views/sidebar/sidebar.html",controller:["PlaylistService","PlayerService","SidebarService","SettingsService","$rootScope",function(t,e,i,n,r){function o(t){e.playVideo(t),n.list.isSidebarSticky||i.toggle()}function a(){var e=this;this.isLoading=!0,t.expandPlaylist().then(function(){return e.isLoading=!1})}function s(i){var n=this;t.clear(),i&&!this.isLoading&&(this.currentSubreddit=i,this.isLoading=!0,t.fetchSubreddit(i).then(function(i){n.isLoading=!1,n.playlist=i,e.playVideo(t.playlist[0])})),i||(this.isLoading=!1)}function u(){return i.isOpen}function l(){i.toggle()}function c(t){var e=i.state.get();i.state.set("main"===e?"settings":"main")}var d=this;this.currentSubreddit="",this.isLoading=!1,this.playlist=t.playlist,this.currentState=i.state.get(),this.getIsOpen=u,this.toggle=l,this.playVideo=o,this.expandPlaylist=a,this.fillPlaylistWith=s,this.toggleSettingsState=c,t.subscribePlaylist(function(){d.playlist=t.playlist}),i.state.subscribe(function(t){d.currentState=t,"main"===t&&r.$broadcast("orodariusScrollIntoView")})}]})}(),function(){angular.module("orodarius").component("videoItem",{bindings:{item:"=videoItem",currentSubreddit:"=currentSubreddit",index:"="},templateUrl:"views/video-item.html",controller:["PlayerService",function(t){function e(){var e=arguments.length<=0||void 0===arguments[0]?"":arguments[0];return e===t.currentVideoItem.ownId}this.playerService=t,this.getIsIdCurrent=e}]})}();