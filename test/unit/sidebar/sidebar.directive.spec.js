'use strict';

describe('Directive: sidebar', function() {
  var compile;

  beforeEach(module('orodarius.templates'));
  beforeEach(
    module('orodarius', $provide => {
      $provide.factory('sidebarFootDirective', () => {
        return {};
      });
    })
  );

  beforeEach(inject(function(
    $compile,
    $rootScope,
    $httpBackend,
    PlaylistService
  ) {
    compile = createCompiler('<sidebar />', $rootScope, $compile);

    PlaylistService.add(mockVideoItem);
    PlaylistService.add(mockVideoItem);
  }));

  it('should compile successfully', function() {
    compile(function(scope, element) {
      expect(element.find('.container-sidebar').length).toBe(1);
    });
  });

  describe('isLoading', function() {
    it('should be exposed as controller variable and set to false', function() {
      compile(function(scope) {
        expect(scope.$ctrl.isLoading).toBe(false);
      });
    });
  });

  describe('expandPlaylist()', function() {
    it('should set isLoading to true and back to false when PlaylistService.expandPlaylist resolves', inject((
      PlaylistService,
      $q
    ) => {
      let promise = $q.defer();
      spyOn(PlaylistService, 'expandPlaylist').and.callFake(() => {
        return promise.promise;
      });

      compile(function(scope) {
        scope.$ctrl.expandPlaylist();
        expect(scope.$ctrl.isLoading).toBe(true);
        promise.resolve();
        scope.$digest();
        expect(PlaylistService.expandPlaylist).toHaveBeenCalled();
        expect(scope.$ctrl.isLoading).toBe(false);
      });
    }));
  });

  describe('$ctrl.getIsOpen()', () => {
    it('should return SidebarService.isOpen', inject(SidebarService => {
      SidebarService.isOpen = false;
      compile(scope => {
        expect(scope.$ctrl.getIsOpen()).toBe(SidebarService.isOpen);
      });
    }));

    it('should be used in view correctly', inject(SidebarService => {
      SidebarService.isOpen = false;
      compile((scope, element) => {
        expect(
          element.find('.container-sidebar').hasClass('container-sidebar--open')
        ).toBe(false);
        expect(element.find('.glyphicon-circle-arrow-left').length).toBe(1);

        SidebarService.isOpen = true;
        scope.$digest();

        expect(
          element.find('.container-sidebar').hasClass('container-sidebar--open')
        ).toBe(true);
        expect(element.find('.glyphicon-circle-arrow-right').length).toBe(1);
      });
    }));
  });

  describe('$ctrl.toggle()', () => {
    it('should call SidebarService.toggle()', inject(SidebarService => {
      spyOn(SidebarService, 'toggle');

      compile(scope => {
        scope.$ctrl.toggle();
        expect(SidebarService.toggle).toHaveBeenCalled();
      });
    }));

    it('should be called from expected click in view', inject(SidebarService => {
      spyOn(SidebarService, 'toggle');

      compile((scope, element) => {
        element.find('.sidebar-toggle').click();
        expect(SidebarService.toggle).toHaveBeenCalled();
      });
    }));
  });

  it('playlistService should contain items from PlaylistService.playlist', function() {
    compile(function(scope) {
      expect(scope.$ctrl.playlist).toEqual([mockVideoItem, mockVideoItem]);
    });
  });

  describe('$ctrl.playVideo()', () => {
    it('should call PlayerService.playVideo passing video item', inject(PlayerService => {
      spyOn(PlayerService, 'playVideo');

      compile(scope => {
        scope.$ctrl.playVideo(mockVideoItem);
        expect(PlayerService.playVideo).toHaveBeenCalledWith(mockVideoItem);
      });
    }));

    describe('when SettingsService.isSidebarSticky is false', () => {
      it('should call SidebarService.toggle()', inject((
        SidebarService,
        SettingsService
      ) => {
        SettingsService.list.isSidebarSticky = false;
        SidebarService.isOpen = true;

        compile(scope => {
          scope.$ctrl.playVideo(mockVideoItem);
          expect(scope.$ctrl.getIsOpen()).toBe(false);
        });
      }));
    });
  });

  describe('fillPlaylistWith()', function() {
    it('should set isLoading to true and back to false after resolve', inject($httpBackend => {
      compile(scope => {
        $httpBackend.whenGET(/whatever/).respond(200, REDDIT);
        expect(scope.$ctrl.isLoading).toBe(false);

        scope.$ctrl.fillPlaylistWith('whatever');
        expect(scope.$ctrl.isLoading).toBe(true);

        $httpBackend.flush();
        expect(scope.$ctrl.isLoading).toBe(false);
      });
    }));

    it('should fill sidebar.list with fetched items from reddit', inject(PlaylistService => {
      compile(scope => {
        spyOn(PlaylistService, 'fetchSubreddit').and.returnValue({
          then: angular.noop
        });
        scope.$ctrl.fillPlaylistWith('artisanvideos');
        expect(PlaylistService.fetchSubreddit).toHaveBeenCalledWith(
          'artisanvideos'
        );
      });
    }));

    it('should clear playlist', inject(PlaylistService => {
      compile(scope => {
        spyOn(PlaylistService, 'clear');
        scope.$ctrl.fillPlaylistWith('videos');
        expect(PlaylistService.clear).toHaveBeenCalled();
      });
    }));

    describe('when no argument passed', () => {
      it('should clear ctrl.currentSubreddit', () => {
        compile(scope => {
          scope.$ctrl.fillPlaylistWith();
          expect(scope.$ctrl.currentSubreddit).toBe('');
        });
      });

      it('should not call PlaylistService.fetchSubreddit', inject(PlaylistService => {
        compile(scope => {
          spyOn(PlaylistService, 'fetchSubreddit');
          scope.$ctrl.fillPlaylistWith();
          expect(PlaylistService.fetchSubreddit).not.toHaveBeenCalled();
        });
      }));
    });

    describe('while $ctrl.isLoading is true', () => {
      it('should not call PlaylistService.fetchSubreddit', inject(PlaylistService => {
        spyOn(PlaylistService, 'fetchSubreddit').and.callThrough();
        compile(scope => {
          scope.$ctrl.isLoading = true;
          scope.$ctrl.fillPlaylistWith('youtubeiku');
          expect(PlaylistService.fetchSubreddit).not.toHaveBeenCalled();
        });
      }));
    });
  });

  it('should contain currentSubreddit property on controller', () => {
    compile(scope => {
      expect(scope.$ctrl.currentSubreddit).toBe('');
    });
  });

  describe('$ctrl.currentState', () => {
    it('should equal to SidebarService.state.get()', inject(SidebarService => {
      SidebarService.state.set('orly?');
      compile(scope => {
        expect(scope.$ctrl.currentState).toBe('orly?');
      });
    }));

    describe('when its `main`', () => {
      it('should show sidebar-empty', () => {
        compile(function(scope, element) {
          scope.$ctrl.currentState = 'main';
          expect(element.find('sidebar-empty').length).toBe(1);
        });
      });
    });
  });

  describe('SidebarService.state.subscribe listener', () => {
    it('should update $ctrl.currentState when it changes', inject(SidebarService => {
      compile(scope => {
        SidebarService.state.set('hello');
        expect(scope.$ctrl.currentState).toBe('hello');
      });
    }));

    describe('when state changes to `main`', function() {
      it('should broadcast orodariusScrollIntoView event on $rootScope', inject((
        SidebarService,
        $rootScope
      ) => {
        spyOn($rootScope, '$broadcast');
        compile(scope => {
          SidebarService.state.set('main');
          expect($rootScope.$broadcast).toHaveBeenCalledWith(
            'orodariusScrollIntoView'
          );

          SidebarService.state.set('something else');
          expect($rootScope.$broadcast.calls.count()).toBe(2);
          // 2 because localStorage module calls it once somewhere
          // i know i know
        });
      }));
    });
  });

  describe('$ctrl.toggleSettingsState', () => {
    describe('when SidebarService.state.get() === `main`', () => {
      it('should calls SidebarService.state.set(`settings`)', inject(SidebarService => {
        spyOn(SidebarService.state, 'get').and.callFake(() => 'main');
        spyOn(SidebarService.state, 'set');
        compile(scope => {
          scope.$ctrl.toggleSettingsState();
          expect(SidebarService.state.set).toHaveBeenCalledWith('settings');
        });
      }));
    });
  });
});
