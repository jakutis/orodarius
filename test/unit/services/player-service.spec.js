'use strict';

describe('Service: PlayerService', function() {
  var service, player, PlaylistService, $q;

  beforeEach(module('orodarius'));

  beforeEach(inject(function(_PlayerService_, _PlaylistService_, _$q_) {
    service = _PlayerService_;
    PlaylistService = _PlaylistService_;
    $q = _$q_;

    player = service.createNewPlayer('main-video-player');

    spyOn(player, 'loadVideoById');
  }));

  it('createNewPlayer method should create new player instance', function() {
    expect(player).toBeTruthy();
    expect(service.player).toBeTruthy();
    expect(player).toEqual(service.player);
  });

  it('playVideo should start playing a new video', function() {
    service.playVideo(mockVideoItem);
    expect(player.loadVideoById).toHaveBeenCalled();
  });

  it('playVideo should start playing a new video at certain time if one has been passed', function() {
    service.playVideo(mockVideoItem);

    expect(player.loadVideoById)
      .toHaveBeenCalledWith({
        videoId: mockVideoItem.videoId,
        startSeconds: mockVideoItem.starttime,
        suggestedQuality: 'default'
      });
  });

  it('playNext should call playVideo with next videoId in row', function() {
    PlaylistService.playlist = [
      { videoId: 'currentId' },
      { videoId: 'nextId' }
    ];

    service.currentVideoItem.videoId = PlaylistService.playlist[0].videoId;

    service.playNext();
    expect(service.currentVideoItem.videoId).toBe('nextId');
  });

  it('playNext method should call PlaylistService.fetchSubreddit when last item reached', function() {
    PlaylistService.playlist = [
      { videoId: 'currentId' }
    ];
    spyOn(PlaylistService, 'fetchSubreddit').and.returnValue({ then: angular.noop });
    service.currentVideoItem.videoId = PlaylistService.playlist[0].videoId;
    service.playNext();
    expect(PlaylistService.fetchSubreddit).toHaveBeenCalled();
  });

  it('playNext method should determine next video by videoId, name and created properties', function() {
    PlaylistService.playlist = [
      { videoId: 'currentId', name: 'WHAAT', created: 1 },
      { videoId: 'currentId', name: 'WHAAT', created: 2 }
    ];

    service.currentVideoItem = PlaylistService.playlist[0];
    service.playNext();
    expect(service.currentVideoItem).toEqual(PlaylistService.playlist[1]);
  });

  it('playPrevious should play previous video in row', function() {
    PlaylistService.playlist = [
      { videoId: 'previousId' },
      { videoId: 'currentId' }
    ];

    service.currentVideoItem.videoId = PlaylistService.playlist[1].videoId;

    service.playPrevious();
    expect(service.currentVideoItem.videoId).toBe('previousId');
  });

  it('playOrPauseVideo method should do what it says', function() {
    service.isPlaying = false;
    spyOn(player, 'playVideo');
    spyOn(player, 'pauseVideo');

    service.playOrPause();
    expect(service.isPlaying).toBe(true);

    service.playOrPause();
    expect(service.isPlaying).toBe(false);

    expect(player.playVideo).toHaveBeenCalled();
    expect(player.pauseVideo).toHaveBeenCalled();
  });

  it("should expose resetCurrentVideoItem method", function() {
    expect(service.resetCurrentVideoItem).toBeDefined();
  });

  it("resetCurrentVideoItem should reset currentVideoItem to undefined", function() {
    service.resetCurrentVideoItem();
    expect(service.currentVideoItem).toBeUndefined();
  });
});
