;(function() {
  'use strict';

  var DEFAULT_SETTINGS = {
    isSidebarSticky: false,
    isFocusForced: false,
    sources: [{
      name: 'reddit',
      apiUrl: 'http://www.reddit.com/r/',
      isEnabled: true
    }]
  };

  angular.module('orodarius')
    .service('SettingsService', function(localStorageService) {
      var settingsStorageName = 'settings',
          settings = localStorageService.get(settingsStorageName);

      if(settings === null) {
        settings = DEFAULT_SETTINGS;
        updateStorage();
      }

      // users prior to settings.sources implementation will have
      // no such property, thus adding it here to avoid breaking code
      if(_.isUndefined(settings.sources)) {
        settings.sources = DEFAULT_SETTINGS.sources;
        updateStorage();
      }

      function add(name, setting) {
        settings[name] = setting;
        updateStorage();
      }

      function toggle(name) {
        if(typeof settings[name] !== 'undefined') {
          settings[name] = !settings[name];
          updateStorage();
        } else {
          settings[name] = true;
        }
      }

      function updateStorage() {
        localStorageService.set(settingsStorageName, settings);
      }

      return { list: settings, add, toggle };
    });

})();