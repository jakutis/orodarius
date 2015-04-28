'use strict';

describe('Controller: sidebarCtrl', function() {
  var ctrl, scope, PlaylistService, PlayerService, $httpBackend, $q, deferred;

  beforeEach(module('orodarius'));

  beforeEach(inject(function(_$rootScope_, _$controller_, _PlaylistService_, _PlayerService_, _$httpBackend_, _$q_) {
    $q = _$q_;
    scope = _$rootScope_.$new();
    ctrl = _$controller_('sidebarCtrl', { $scope: scope, PlaylistService: _PlaylistService_, PlayerService: _PlayerService_ });

    PlaylistService = _PlaylistService_;
    PlayerService = _PlayerService_;
    $httpBackend = _$httpBackend_;

    spyOn(PlayerService, 'playVideo');

    PlaylistService.add(mockVideoItem);
    PlaylistService.add(mockVideoItem);
  }));

  it('should get sidebarService.isOpen flag as false', function() {
    expect(scope.sidebarService.isOpen).toBe(true);
  });

  it('toggleSidebar should toggle isOpen flag', function() {
    ctrl.toggleSidebar();
    expect(scope.sidebarService.isOpen).toBe(false);

    ctrl.toggleSidebar();
    expect(scope.sidebarService.isOpen).toBe(true);
  });

  it('playlistService should contain items from PlaylistService.playlist', function() {
    expect(scope.playlistService.playlist).toEqual([mockVideoItem, mockVideoItem]);
  });

  it('playVideo method should tell PlayerService to play video', function() {
    ctrl.playVideo(mockVideoItem);
    expect(PlayerService.playVideo).toHaveBeenCalledWith(mockVideoItem);
  });

  it('isOpen should be false after playVideo has been invoked', function() {
    scope.sidebarService.isOpen = true;
    ctrl.playVideo(mockVideoItem);
    expect(scope.sidebarService.isOpen).toBe(false);
  });

  it('isOpen should be true after playVideo has been invoked when isSidebarSticky is true', function() {
    scope.sidebarService.isOpen = true;
    scope.isSidebarSticky = true;
    ctrl.playVideo(mockVideoItem);
    expect(scope.sidebarService.isOpen).toBe(true);
  });

  it('fillPlaylistWith should fill sidebar.list with fetched items from reddit', function() {
    spyOn(PlaylistService, 'fetchSubreddit').and.returnValue({then: angular.noop});
    ctrl.fillPlaylistWith('artisanvideos');
    expect(PlaylistService.fetchSubreddit).toHaveBeenCalledWith('artisanvideos');
  });

  it('fillPlaylistWith should clear playlist', function() {
    spyOn(PlaylistService, 'clear');
    ctrl.fillPlaylistWith('videos');
    expect(PlaylistService.clear).toHaveBeenCalled();
  });

  it('should contain currentSubreddit property on scope', function() {
    expect(typeof scope.currentSubreddit).toBe('string');
  });

  it('should keep isSidebarSticky value on scope and be set to false initially', function() {
    expect(scope.isSidebarSticky).toBe(false);
  });

  describe('suggested subreddits', function() {
    it('should be exposed', function() {
      expect(ctrl.suggestedSubreddits).toBeDefined();
    });

    it('should contain at least 4 items of certain structure', function() {
      expect(ctrl.suggestedSubreddits.length).toBeGreaterThan(3);
      expect(ctrl.suggestedSubreddits[0]).toEqual(jasmine.objectContaining({
        name: 'videos'
      }));
    });
  });
});
