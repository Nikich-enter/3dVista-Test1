(function(){
    var script = {
 "scripts": {
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "getKey": function(key){  return window[key]; },
  "unregisterKey": function(key){  delete window[key]; },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "registerKey": function(key, value){  window[key] = value; },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "existsKey": function(key){  return key in window; },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } }
 },
 "start": "this.init(); this.visibleComponentsIfPlayerFlagEnabled([this.IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A], 'gyroscopeAvailable'); this.syncPlaylists([this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist,this.ThumbnailGrid_2F8BA686_0D4F_6B7E_419C_EB65DD1505BB_playlist,this.mainPlayList]); this.playList_2AE77874_30A2_0527_41A0_5FC738D9DEF7.set('selectedIndex', 0); if(!this.get('fullscreenAvailable')) { [this.IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0].forEach(function(component) { component.set('visible', false); }) }",
 "scrollBarMargin": 2,
 "children": [
  "this.MainViewer",
  "this.Container_32CC4EA6_16EF_8891_41B3_C36F5FCE49B7",
  "this.Container_EF8F8BD8_E386_8E03_41E3_4CF7CC1F4D8E",
  "this.Container_0AEF1C12_16A3_8FB1_4188_D5C88CE581C3",
  "this.Container_04FE7C2D_1216_75ED_4197_E539B3CD3A95",
  "this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15",
  "this.Container_1812EA3F_1663_8BEF_41AF_0A4CCC089B5F",
  "this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41",
  "this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E",
  "this.Container_0DEC3FED_12FA_D26D_419F_4067E8C6DA08",
  "this.MapViewer"
 ],
 "id": "rootPlayer",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "absolute",
 "horizontalAlign": "left",
 "overflow": "visible",
 "shadow": false,
 "buttonToggleMute": "this.IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D",
 "mouseWheelEnabled": true,
 "borderRadius": 0,
 "definitions": [{
 "items": [
  {
   "begin": "this.MapViewerMapPlayer.set('movementMode', 'free_drag_and_rotation')",
   "media": "this.map_3C2622C9_2FBE_A7A5_41C3_50C348DFB756",
   "class": "MapPlayListItem",
   "player": "this.MapViewerMapPlayer"
  }
 ],
 "id": "playList_2AE77874_30A2_0527_41A0_5FC738D9DEF7",
 "class": "PlayList"
},
{
 "touchControlMode": "drag_rotation",
 "buttonCardboardView": [
  "this.IconButton_30AC9FB1_16E7_88F3_41B2_18944AAAD6FA",
  "this.IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB"
 ],
 "buttonToggleHotspots": "this.IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96",
 "gyroscopeVerticalDraggingEnabled": true,
 "mouseControlMode": "drag_acceleration",
 "displayPlaybackBar": true,
 "viewerArea": "this.MainViewer",
 "id": "MainViewerPanoramaPlayer",
 "class": "PanoramaPlayer",
 "buttonToggleGyroscope": "this.IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A"
},
{
 "viewerArea": "this.MainViewer",
 "id": "MainViewerVideoPlayer",
 "class": "VideoPlayer",
 "displayPlaybackBar": true
},
{
 "titlePaddingRight": 5,
 "data": {
  "name": "Window11174"
 },
 "shadowSpread": 1,
 "id": "window_266D95A5_3024_FCA7_4181_5FCC7B8F9F6B",
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "width": 400,
 "veilOpacity": 0.4,
 "scrollBarWidth": 10,
 "backgroundOpacity": 1,
 "closeButtonBackgroundColor": [],
 "horizontalAlign": "center",
 "titlePaddingTop": 5,
 "overflow": "scroll",
 "shadow": true,
 "bodyPaddingRight": 5,
 "closeButtonIconColor": "#000000",
 "headerBackgroundColorDirection": "vertical",
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "modal": true,
 "headerBorderColor": "#000000",
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "closeButtonBackgroundColorRatios": [],
 "bodyPaddingLeft": 5,
 "veilColorDirection": "horizontal",
 "backgroundColor": [],
 "closeButtonRollOverIconColor": "#FFFFFF",
 "propagateClick": false,
 "title": "\u0446\u0446\u0446\u0446\u0446\u0446\u0446\u0446\u0446\u0446\u0446",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "titleFontWeight": "normal",
 "scrollBarColor": "#000000",
 "titleFontStyle": "normal",
 "verticalAlign": "middle",
 "bodyBackgroundColorDirection": "vertical",
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "contentOpaque": false,
 "borderSize": 0,
 "height": 600,
 "closeButtonBorderRadius": 11,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "veilShowEffect": {
  "class": "FadeInEffect",
  "easing": "cubic_in_out",
  "duration": 500
 },
 "titleFontSize": "1.29vmin",
 "closeButtonPressedIconColor": "#FFFFFF",
 "showEffect": {
  "class": "FadeInEffect",
  "easing": "cubic_in_out",
  "duration": 500
 },
 "footerHeight": 5,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "veilColorRatios": [
  0,
  1
 ],
 "headerPaddingTop": 10,
 "headerPaddingBottom": 10,
 "titleTextDecoration": "none",
 "bodyPaddingTop": 5,
 "hideEffect": {
  "class": "FadeOutEffect",
  "easing": "cubic_in_out",
  "duration": 500
 },
 "shadowBlurRadius": 6,
 "children": [
  "this.htmlText_266E55A6_3024_FCA5_41B1_2C98C1C86991"
 ],
 "headerPaddingLeft": 10,
 "shadowColor": "#000000",
 "layout": "vertical",
 "headerPaddingRight": 10,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "shadowOpacity": 0.5,
 "borderRadius": 5,
 "closeButtonIconHeight": 12,
 "class": "Window",
 "closeButtonIconLineWidth": 2,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "backgroundColorRatios": [],
 "veilHideEffect": {
  "class": "FadeOutEffect",
  "easing": "cubic_in_out",
  "duration": 500
 },
 "titlePaddingBottom": 5,
 "closeButtonIconWidth": 12,
 "paddingLeft": 0,
 "shadowVerticalLength": 0,
 "footerBackgroundColorDirection": "vertical",
 "headerBackgroundOpacity": 1,
 "titlePaddingLeft": 5,
 "minWidth": 20,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "headerBorderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "bodyPaddingBottom": 5,
 "paddingBottom": 0,
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "shadowHorizontalLength": 3,
 "titleFontColor": "#000000",
 "headerVerticalAlign": "middle",
 "scrollBarMargin": 2,
 "titleFontFamily": "Arial",
 "minHeight": 20
},
{
 "id": "effect_27EA1056_3024_13E4_41C5_DFDF8C96B9DB",
 "class": "FadeInEffect",
 "easing": "linear",
 "duration": 0
},
{
 "thumbnailUrl": "media/video_26C3707B_302C_33AC_41B9_F89CD86FE94E_t.jpg",
 "label": "Untitled 2",
 "class": "Video",
 "width": 3168,
 "loop": false,
 "id": "video_26C3707B_302C_33AC_41B9_F89CD86FE94E",
 "scaleMode": "fit_inside",
 "height": 1584,
 "video": {
  "width": 1358,
  "class": "VideoResource",
  "mp4Url": "media/video_26C3707B_302C_33AC_41B9_F89CD86FE94E.mp4",
  "height": 680
 }
},
{
 "initialPosition": {
  "yaw": -48.38,
  "class": "PanoramaCameraPosition",
  "pitch": -12.54
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_camera"
},
{
 "items": [
  {
   "begin": "this.MapViewerMapPlayer.set('movementMode', 'free_drag_and_rotation')",
   "media": "this.map_3C2622C9_2FBE_A7A5_41C3_50C348DFB756",
   "class": "MapPlayListItem",
   "player": "this.MapViewerMapPlayer"
  }
 ],
 "id": "playList_2AE70874_30A2_0527_41A5_8D97951C1BF1",
 "class": "PlayList"
},
{
 "items": [
  {
   "media": "this.panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_camera"
  },
  {
   "media": "this.panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 1, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_camera"
  }
 ],
 "id": "ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist",
 "class": "PlayList"
},
{
 "initialPosition": {
  "yaw": 1.68,
  "class": "PanoramaCameraPosition",
  "pitch": -2.46
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_camera"
},
{
 "items": [
  {
   "media": "this.video_26C3707B_302C_33AC_41B9_F89CD86FE94E",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_2AE7B874_30A2_0527_41B0_443E498326EA, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_2AE7B874_30A2_0527_41B0_443E498326EA, 0)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer)",
   "player": "this.MainViewerVideoPlayer",
   "class": "VideoPlayListItem"
  }
 ],
 "id": "playList_2AE7B874_30A2_0527_41B0_443E498326EA",
 "class": "PlayList"
},
{
 "items": [
  {
   "media": "this.panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA",
   "begin": "this.setEndToItemIndex(this.ThumbnailGrid_2F8BA686_0D4F_6B7E_419C_EB65DD1505BB_playlist, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_camera"
  },
  {
   "media": "this.panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7",
   "begin": "this.setEndToItemIndex(this.ThumbnailGrid_2F8BA686_0D4F_6B7E_419C_EB65DD1505BB_playlist, 1, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_camera"
  }
 ],
 "id": "ThumbnailGrid_2F8BA686_0D4F_6B7E_419C_EB65DD1505BB_playlist",
 "class": "PlayList"
},
{
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7",
   "class": "AdjacentPanorama"
  }
 ],
 "label": "entry",
 "partial": false,
 "class": "Panorama",
 "thumbnailUrl": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_t.jpg",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/f/0/{row}_{column}.jpg",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "class": "TiledImageResourceLevel",
      "height": 4096
     },
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/f/1/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/u/0/{row}_{column}.jpg",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "class": "TiledImageResourceLevel",
      "height": 4096
     },
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/u/1/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/b/0/{row}_{column}.jpg",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "class": "TiledImageResourceLevel",
      "height": 4096
     },
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/b/1/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/d/0/{row}_{column}.jpg",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "class": "TiledImageResourceLevel",
      "height": 4096
     },
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/d/1/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/l/0/{row}_{column}.jpg",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "class": "TiledImageResourceLevel",
      "height": 4096
     },
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/l/1/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/r/0/{row}_{column}.jpg",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "class": "TiledImageResourceLevel",
      "height": 4096
     },
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/r/1/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "overlays": [
  "this.overlay_3DD6594C_2FEC_15E4_4175_226DC7BCAFED"
 ],
 "id": "panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA",
 "pitch": 0,
 "hfovMax": 130,
 "hfov": 360
},
{
 "vfov": 180,
 "overlays": [
  "this.overlay_277119B7_302C_34A4_41C7_3C8406E2E8F4",
  "this.overlay_25F7D7FF_302C_1CA4_41A7_5B5EE2D6124A",
  "this.overlay_263C8A37_302C_F7A4_41B3_35224E70ECD0",
  "this.overlay_2B2D271E_3064_3D64_41B5_D5BA10918DA5"
 ],
 "label": "vr",
 "partial": false,
 "class": "Panorama",
 "thumbnailUrl": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_t.jpg",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/f/0/{row}_{column}.jpg",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "class": "TiledImageResourceLevel",
      "height": 4096
     },
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/f/1/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/u/0/{row}_{column}.jpg",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "class": "TiledImageResourceLevel",
      "height": 4096
     },
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/u/1/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/b/0/{row}_{column}.jpg",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "class": "TiledImageResourceLevel",
      "height": 4096
     },
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/b/1/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/d/0/{row}_{column}.jpg",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "class": "TiledImageResourceLevel",
      "height": 4096
     },
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/d/1/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/l/0/{row}_{column}.jpg",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "class": "TiledImageResourceLevel",
      "height": 4096
     },
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/l/1/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/r/0/{row}_{column}.jpg",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "class": "TiledImageResourceLevel",
      "height": 4096
     },
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/r/1/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "id": "panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7",
 "pitch": 0,
 "hfovMax": 130,
 "hfov": 360
},
{
 "items": [
  {
   "media": "this.panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_camera"
  },
  {
   "media": "this.panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7",
   "end": "this.trigger('tourEnded')",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_camera"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "movementMode": "constrained",
 "viewerArea": "this.MapViewer",
 "id": "MapViewerMapPlayer",
 "class": "MapPlayer"
},
{
 "fieldOfViewOverlayOutsideColor": "#000000",
 "label": "energy",
 "id": "map_3C2622C9_2FBE_A7A5_41C3_50C348DFB756",
 "minimumZoomFactor": 0.5,
 "width": 12000,
 "image": {
  "levels": [
   {
    "url": "media/map_3C2622C9_2FBE_A7A5_41C3_50C348DFB756.jpeg",
    "width": 3200,
    "class": "ImageResourceLevel",
    "height": 1600
   },
   {
    "url": "media/map_3C2622C9_2FBE_A7A5_41C3_50C348DFB756_lq.jpeg",
    "width": 362,
    "class": "ImageResourceLevel",
    "tags": "preload",
    "height": 181
   }
  ],
  "class": "ImageResource"
 },
 "overlays": [
  "this.overlay_3D61C5A4_2FBF_ADE3_41BD_BCBEA1153AF6"
 ],
 "fieldOfViewOverlayOutsideOpacity": 0,
 "fieldOfViewOverlayInsideOpacity": 0.36,
 "maximumZoomFactor": 1.2,
 "thumbnailUrl": "media/map_3C2622C9_2FBE_A7A5_41C3_50C348DFB756_t.jpg",
 "initialZoomFactor": 1,
 "class": "Map",
 "fieldOfViewOverlayRadiusScale": 0.18,
 "fieldOfViewOverlayInsideColor": "#FFFFFF",
 "scaleMode": "fit_inside",
 "height": 6000
},
{
 "toolTipFontWeight": "normal",
 "playbackBarRight": 0,
 "id": "MainViewer",
 "left": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "progressBarBorderSize": 0,
 "width": "100%",
 "playbackBarProgressBorderSize": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "toolTipShadowOpacity": 0,
 "shadow": false,
 "playbackBarBorderRadius": 0,
 "toolTipFontStyle": "normal",
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderRadius": 0,
 "toolTipFontFamily": "Georgia",
 "playbackBarHeadBorderColor": "#000000",
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "progressLeft": 0,
 "playbackBarBorderSize": 0,
 "paddingRight": 0,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontColor": "#FFFFFF",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "borderSize": 0,
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "toolTipBackgroundColor": "#000000",
 "progressOpacity": 1,
 "transitionDuration": 500,
 "progressBarBackgroundColorDirection": "vertical",
 "firstTransitionDuration": 0,
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "progressBottom": 0,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "height": "100%",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "toolTipPaddingRight": 10,
 "toolTipBorderSize": 1,
 "vrPointerColor": "#FFFFFF",
 "toolTipPaddingLeft": 10,
 "toolTipPaddingTop": 7,
 "progressBarOpacity": 1,
 "toolTipDisplayTime": 600,
 "progressBorderSize": 0,
 "displayTooltipInTouchScreens": true,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "transitionMode": "blending",
 "progressBorderRadius": 0,
 "class": "ViewerArea",
 "top": 0,
 "playbackBarLeft": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "paddingLeft": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBorderColor": "#000000",
 "progressBackgroundColorRatios": [
  0
 ],
 "minWidth": 100,
 "toolTipBorderColor": "#767676",
 "playbackBarBottom": 5,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipShadowSpread": 0,
 "toolTipShadowBlurRadius": 3,
 "progressBorderColor": "#000000",
 "playbackBarHeadOpacity": 1,
 "toolTipTextShadowColor": "#000000",
 "toolTipOpacity": 0.5,
 "progressBackgroundColorDirection": "vertical",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "paddingTop": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipPaddingBottom": 7,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipFontSize": 13,
 "toolTipTextShadowBlurRadius": 3,
 "paddingBottom": 0,
 "playbackBarHeight": 10,
 "toolTipShadowColor": "#333333",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "minHeight": 50,
 "playbackBarHeadWidth": 6,
 "playbackBarBackgroundColorDirection": "vertical",
 "data": {
  "name": "Main Viewer"
 }
},
{
 "backgroundImageUrl": "skin/Container_32CC4EA6_16EF_8891_41B3_C36F5FCE49B7.png",
 "children": [
  "this.Image_9511127C_9B79_D2C1_41D8_D080B87BFD84",
  "this.Container_9A7696F9_9256_4198_41E2_40E7CF09A427",
  "this.IconButton_30AC9FB1_16E7_88F3_41B2_18944AAAD6FA"
 ],
 "id": "Container_32CC4EA6_16EF_8891_41B3_C36F5FCE49B7",
 "left": "0%",
 "scrollBarMargin": 2,
 "layout": "absolute",
 "backgroundOpacity": 0.6,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "right": "0%",
 "shadow": false,
 "borderRadius": 0,
 "overflow": "visible",
 "class": "Container",
 "propagateClick": false,
 "bottom": "0%",
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "height": "12.832%",
 "contentOpaque": false,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "paddingBottom": 0,
 "data": {
  "name": "--- MENU"
 },
 "minHeight": 1
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_EF8F8BD8_E386_8E02_41E5_FC5C5513733A",
  "this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE"
 ],
 "id": "Container_EF8F8BD8_E386_8E03_41E3_4CF7CC1F4D8E",
 "width": 115.05,
 "scrollBarWidth": 10,
 "layout": "absolute",
 "backgroundOpacity": 0,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "right": "0%",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "top": "0%",
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "height": 641,
 "contentOpaque": false,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "paddingBottom": 0,
 "minHeight": 1,
 "data": {
  "name": "-- SETTINGS"
 }
},
{
 "scrollBarMargin": 2,
 "id": "Container_0AEF1C12_16A3_8FB1_4188_D5C88CE581C3",
 "left": 30,
 "width": 573,
 "layout": "absolute",
 "backgroundOpacity": 0,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "shadow": false,
 "borderRadius": 0,
 "overflow": "visible",
 "class": "Container",
 "top": 20,
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "height": 116,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "paddingTop": 0,
 "paddingBottom": 0,
 "minHeight": 1,
 "data": {
  "name": "--STICKER"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_04FF5C2C_1216_7593_41B2_1B5CFADF351D",
  "this.Container_04FF9C2D_1216_75ED_41A8_E3495D8F554E"
 ],
 "id": "Container_04FE7C2D_1216_75ED_4197_E539B3CD3A95",
 "left": "0%",
 "layout": "absolute",
 "backgroundOpacity": 0.6,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "right": "0%",
 "shadow": false,
 "borderRadius": 0,
 "creationPolicy": "inAdvance",
 "overflow": "scroll",
 "class": "Container",
 "top": "0%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "bottom": "0%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#04A3E1",
 "minWidth": 1,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "click": "this.setComponentVisibility(this.Container_04FE7C2D_1216_75ED_4197_E539B3CD3A95, false, 0, null, null, false)",
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "paddingBottom": 0,
 "visible": false,
 "minHeight": 1,
 "data": {
  "name": "--INFO"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_39A197B1_0C06_62AF_419A_D15E4DDD2528"
 ],
 "id": "Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15",
 "left": "0%",
 "layout": "absolute",
 "backgroundOpacity": 0.6,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "right": "0%",
 "shadow": false,
 "borderRadius": 0,
 "creationPolicy": "inAdvance",
 "overflow": "scroll",
 "class": "Container",
 "top": "0%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "bottom": "0%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "click": "this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, false, 0, null, null, false)",
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "paddingBottom": 0,
 "visible": false,
 "minHeight": 1,
 "data": {
  "name": "--PANORAMA LIST"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_1813AA3E_1663_8BF1_41A2_CA5EE3718362",
  "this.Container_1812AA3F_1663_8BEF_41A4_02F566B1BC6D"
 ],
 "id": "Container_1812EA3F_1663_8BEF_41AF_0A4CCC089B5F",
 "left": "0%",
 "layout": "absolute",
 "backgroundOpacity": 0.6,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "right": "0%",
 "shadow": false,
 "borderRadius": 0,
 "creationPolicy": "inAdvance",
 "overflow": "scroll",
 "class": "Container",
 "top": "0%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "bottom": "0%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "click": "this.setComponentVisibility(this.Container_1812EA3F_1663_8BEF_41AF_0A4CCC089B5F, false, 0, null, null, false)",
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "paddingBottom": 0,
 "visible": false,
 "minHeight": 1,
 "data": {
  "name": "--LOCATION"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_2F8A6686_0D4F_6B71_4174_A02FE43588D3"
 ],
 "id": "Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41",
 "left": "0%",
 "layout": "absolute",
 "backgroundOpacity": 0.6,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "right": "0%",
 "shadow": false,
 "borderRadius": 0,
 "creationPolicy": "inAdvance",
 "overflow": "scroll",
 "class": "Container",
 "top": "0%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "bottom": "0%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "click": "this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, false, 0, null, null, false)",
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "paddingBottom": 0,
 "visible": false,
 "minHeight": 1,
 "data": {
  "name": "--FLOORPLAN"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_2A193C4C_0D3B_DFF0_4161_A2CD128EF536"
 ],
 "id": "Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E",
 "left": "0%",
 "layout": "absolute",
 "backgroundOpacity": 0.6,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "right": "0%",
 "shadow": false,
 "borderRadius": 0,
 "creationPolicy": "inAdvance",
 "overflow": "scroll",
 "class": "Container",
 "top": "0%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "bottom": "0%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "click": "this.setComponentVisibility(this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E, false, 0, null, null, false)",
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "paddingBottom": 0,
 "visible": false,
 "minHeight": 1,
 "data": {
  "name": "--PHOTOALBUM"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_0DEF7FEC_12FA_D293_4197_332CA20EDBCF",
  "this.Container_0DEC1FED_12FA_D26D_41AE_8CE7699C44D8"
 ],
 "id": "Container_0DEC3FED_12FA_D26D_419F_4067E8C6DA08",
 "left": "0%",
 "layout": "absolute",
 "backgroundOpacity": 0.6,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "right": "0%",
 "shadow": false,
 "borderRadius": 0,
 "creationPolicy": "inAdvance",
 "overflow": "scroll",
 "class": "Container",
 "top": "0%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "bottom": "0%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "click": "this.setComponentVisibility(this.Container_0DEC3FED_12FA_D26D_419F_4067E8C6DA08, false, 0, null, null, false)",
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "paddingBottom": 0,
 "visible": false,
 "minHeight": 1,
 "data": {
  "name": "--CONTACT"
 }
},
{
 "toolTipFontWeight": "normal",
 "playbackBarRight": 0,
 "id": "MapViewer",
 "left": "2.59%",
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "progressBarBorderSize": 0,
 "width": "12.063%",
 "playbackBarProgressBorderSize": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "toolTipShadowOpacity": 1,
 "shadow": false,
 "playbackBarBorderRadius": 0,
 "toolTipFontStyle": "normal",
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderRadius": 0,
 "toolTipFontFamily": "Arial",
 "toolTipShadowVerticalLength": 0,
 "playbackBarHeadBorderColor": "#000000",
 "toolTipShadowHorizontalLength": 0,
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "progressLeft": 0,
 "playbackBarBorderSize": 0,
 "paddingRight": 0,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontColor": "#606060",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "borderSize": 0,
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressOpacity": 1,
 "transitionDuration": 500,
 "progressBarBackgroundColorDirection": "vertical",
 "firstTransitionDuration": 0,
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "progressBottom": 2,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "height": "21.858%",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "toolTipPaddingRight": 6,
 "toolTipBorderSize": 1,
 "vrPointerColor": "#FFFFFF",
 "toolTipPaddingLeft": 6,
 "toolTipPaddingTop": 4,
 "progressBarOpacity": 1,
 "toolTipDisplayTime": 600,
 "progressBorderSize": 0,
 "displayTooltipInTouchScreens": true,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "transitionMode": "blending",
 "progressBorderRadius": 0,
 "class": "ViewerArea",
 "top": "3.5%",
 "playbackBarLeft": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "paddingLeft": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBorderColor": "#000000",
 "progressBackgroundColorRatios": [
  0
 ],
 "minWidth": 1,
 "toolTipBorderColor": "#767676",
 "playbackBarBottom": 0,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipShadowSpread": 0,
 "toolTipShadowBlurRadius": 3,
 "progressBorderColor": "#000000",
 "playbackBarHeadOpacity": 1,
 "toolTipTextShadowColor": "#000000",
 "toolTipOpacity": 1,
 "progressBackgroundColorDirection": "vertical",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "paddingTop": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipPaddingBottom": 4,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipFontSize": 12,
 "toolTipTextShadowBlurRadius": 3,
 "paddingBottom": 0,
 "playbackBarHeight": 10,
 "toolTipShadowColor": "#333333",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "minHeight": 1,
 "playbackBarHeadWidth": 6,
 "playbackBarBackgroundColorDirection": "vertical",
 "data": {
  "name": "Floor Plan"
 }
},
{
 "id": "IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D",
 "width": 58,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "borderRadius": 0,
 "pressedRollOverIconURL": "skin/IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D_pressed_rollover.png",
 "class": "IconButton",
 "iconURL": "skin/IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D.png",
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "maxWidth": 58,
 "mode": "toggle",
 "minWidth": 1,
 "height": 58,
 "maxHeight": 58,
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D_pressed.png",
 "paddingTop": 0,
 "paddingBottom": 0,
 "minHeight": 1,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton MUTE"
 }
},
{
 "id": "IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0",
 "width": 58,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "borderRadius": 0,
 "pressedRollOverIconURL": "skin/IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0_pressed_rollover.png",
 "class": "IconButton",
 "iconURL": "skin/IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0.png",
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "maxWidth": 58,
 "mode": "toggle",
 "minWidth": 1,
 "height": 58,
 "maxHeight": 58,
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0_pressed.png",
 "paddingTop": 0,
 "paddingBottom": 0,
 "minHeight": 1,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton FULLSCREEN"
 }
},
{
 "id": "IconButton_30AC9FB1_16E7_88F3_41B2_18944AAAD6FA",
 "width": 49,
 "right": 30,
 "horizontalAlign": "center",
 "backgroundOpacity": 0,
 "shadow": false,
 "borderRadius": 0,
 "rollOverIconURL": "skin/IconButton_30AC9FB1_16E7_88F3_41B2_18944AAAD6FA_rollover.png",
 "class": "IconButton",
 "iconURL": "skin/IconButton_30AC9FB1_16E7_88F3_41B2_18944AAAD6FA.png",
 "propagateClick": false,
 "bottom": 8,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "maxWidth": 49,
 "mode": "push",
 "minWidth": 1,
 "height": 37,
 "maxHeight": 37,
 "paddingTop": 0,
 "borderSize": 0,
 "paddingBottom": 0,
 "minHeight": 1,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton VR"
 }
},
{
 "id": "IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB",
 "width": 58,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "borderRadius": 0,
 "rollOverIconURL": "skin/IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB_rollover.png",
 "class": "IconButton",
 "iconURL": "skin/IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB.png",
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "maxWidth": 58,
 "mode": "push",
 "minWidth": 1,
 "height": 58,
 "maxHeight": 58,
 "borderSize": 0,
 "paddingTop": 0,
 "paddingBottom": 0,
 "visible": false,
 "minHeight": 1,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton VR"
 }
},
{
 "id": "IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96",
 "width": 58,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "borderRadius": 0,
 "pressedRollOverIconURL": "skin/IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96_pressed_rollover.png",
 "class": "IconButton",
 "iconURL": "skin/IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96.png",
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "maxWidth": 58,
 "mode": "toggle",
 "minWidth": 1,
 "height": 58,
 "maxHeight": 58,
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96_pressed.png",
 "paddingTop": 0,
 "paddingBottom": 0,
 "minHeight": 1,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton HS "
 }
},
{
 "id": "IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A",
 "width": 58,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "borderRadius": 0,
 "pressedRollOverIconURL": "skin/IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A_pressed_rollover.png",
 "class": "IconButton",
 "iconURL": "skin/IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A.png",
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "maxWidth": 58,
 "mode": "toggle",
 "minWidth": 1,
 "height": 58,
 "maxHeight": 58,
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A_pressed.png",
 "paddingTop": 0,
 "paddingBottom": 0,
 "minHeight": 1,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton GYRO"
 }
},
{
 "id": "htmlText_266E55A6_3024_FCA5_41B1_2C98C1C86991",
 "width": "100%",
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "shadow": false,
 "borderRadius": 0,
 "class": "HTMLText",
 "propagateClick": false,
 "paddingLeft": 10,
 "scrollBarOpacity": 0.5,
 "paddingRight": 10,
 "scrollBarColor": "#000000",
 "minWidth": 0,
 "scrollBarVisible": "rollOver",
 "height": "100%",
 "paddingTop": 10,
 "borderSize": 0,
 "html": "<div style=\"text-align:left; color:#000; \"><p STYLE=\"margin:0; line-height:12px;\"><BR STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"/></p></div>",
 "paddingBottom": 10,
 "scrollBarMargin": 2,
 "data": {
  "name": "HTMLText11175"
 },
 "minHeight": 0
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 1)"
  }
 ],
 "rollOverDisplay": false,
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_2637F477_30A2_0D20_4199_E07D888CC6B6",
   "yaw": -9.67,
   "pitch": -5.97,
   "hfov": 14.99,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_3DD6594C_2FEC_15E4_4175_226DC7BCAFED",
 "maps": [
  {
   "yaw": -9.67,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_1_HS_2_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -5.97,
   "hfov": 14.99
  }
 ],
 "data": {
  "label": "Arrow 05b Right-Up"
 }
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.setComponentVisibility(this.Container_04FE7C2D_1216_75ED_4197_E539B3CD3A95, true, 0, this.effect_27EA1056_3024_13E4_41C5_DFDF8C96B9DB, 'showEffect', false)"
  }
 ],
 "rollOverDisplay": false,
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_1_HS_0_0.png",
      "width": 660,
      "class": "ImageResourceLevel",
      "height": 757
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -13.5,
   "roll": 0,
   "yaw": 103.38,
   "hfov": 19.63
  }
 ],
 "id": "overlay_277119B7_302C_34A4_41C7_3C8406E2E8F4",
 "maps": [
  {
   "yaw": 103.38,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_1_HS_0_1_0_map.gif",
      "width": 174,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -13.5,
   "hfov": 19.63
  }
 ],
 "data": {
  "label": "Polygon"
 }
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showWindow(this.window_266D95A5_3024_FCA7_4181_5FCC7B8F9F6B, null, false)"
  }
 ],
 "rollOverDisplay": false,
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_1_HS_1_0.png",
      "width": 1156,
      "class": "ImageResourceLevel",
      "height": 820
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -1.57,
   "roll": 0,
   "yaw": 19.22,
   "hfov": 33.68
  }
 ],
 "id": "overlay_25F7D7FF_302C_1CA4_41A7_5B5EE2D6124A",
 "maps": [
  {
   "yaw": 19.22,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_1_HS_1_1_0_map.gif",
      "width": 199,
      "class": "ImageResourceLevel",
      "height": 141
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -1.57,
   "hfov": 33.68
  }
 ],
 "data": {
  "label": "Polygon"
 }
},
{
 "data": {
  "label": "Video"
 },
 "blending": 0,
 "id": "overlay_263C8A37_302C_F7A4_41B3_35224E70ECD0",
 "loop": false,
 "image": {
  "levels": [
   {
    "url": "media/overlay_263C8A37_302C_F7A4_41B3_35224E70ECD0_t.jpg",
    "width": 3168,
    "class": "ImageResourceLevel",
    "height": 1584
   }
  ],
  "class": "ImageResource"
 },
 "hfov": 28.36,
 "useHandCursor": true,
 "click": "this.overlay_263C8A37_302C_F7A4_41B3_35224E70ECD0.play()",
 "yaw": 136.71,
 "pitch": 3.63,
 "rotationY": 8.47,
 "rotationX": -11.22,
 "autoplay": false,
 "vfov": 16.05,
 "class": "VideoPanoramaOverlay",
 "videoVisibleOnStop": false,
 "enabledInCardboard": true,
 "distance": 50,
 "roll": -2.7,
 "video": {
  "width": 1358,
  "class": "VideoResource",
  "mp4Url": "media/video_26C3707B_302C_33AC_41B9_F89CD86FE94E.mp4",
  "height": 680
 }
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_1_HS_2_0.png",
      "width": 251,
      "class": "ImageResourceLevel",
      "height": 251
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 6.09,
   "yaw": -10.93,
   "hfov": 7.49
  }
 ],
 "id": "overlay_2B2D271E_3064_3D64_41B5_D5BA10918DA5",
 "maps": [
  {
   "yaw": -10.93,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_248B33B2_2F9E_A5E7_41AC_78BDD9E772D7_1_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 6.09,
   "hfov": 7.49
  }
 ],
 "data": {
  "label": "Image"
 }
},
{
 "map": {
  "width": 738.85,
  "x": 7098.94,
  "offsetY": 0,
  "image": {
   "levels": [
    {
     "url": "media/map_3C2622C9_2FBE_A7A5_41C3_50C348DFB756_HS_0_map.gif",
     "width": 100,
     "class": "ImageResourceLevel",
     "height": 56
    }
   ],
   "class": "ImageResource"
  },
  "y": 2878.56,
  "class": "HotspotMapOverlayMap",
  "height": 416.14,
  "offsetX": 0
 },
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotMapOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "class": "AreaHotspotMapOverlay",
 "data": {
  "label": "Polygon"
 },
 "image": {
  "width": 738.85,
  "x": 7098.94,
  "image": {
   "levels": [
    {
     "url": "media/map_3C2622C9_2FBE_A7A5_41C3_50C348DFB756_HS_0.png",
     "width": 200,
     "class": "ImageResourceLevel",
     "height": 113
    }
   ],
   "class": "ImageResource"
  },
  "y": 2878.56,
  "class": "HotspotMapOverlayImage",
  "height": 416.14
 },
 "useHandCursor": true,
 "id": "overlay_3D61C5A4_2FBF_ADE3_41BD_BCBEA1153AF6"
},
{
 "id": "Image_9511127C_9B79_D2C1_41D8_D080B87BFD84",
 "left": "0%",
 "right": "0%",
 "horizontalAlign": "center",
 "backgroundOpacity": 0,
 "shadow": false,
 "borderRadius": 0,
 "url": "skin/Image_9511127C_9B79_D2C1_41D8_D080B87BFD84.png",
 "class": "Image",
 "propagateClick": false,
 "bottom": 53,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "maxWidth": 3000,
 "minWidth": 1,
 "height": 2,
 "maxHeight": 2,
 "paddingTop": 0,
 "borderSize": 0,
 "scaleMode": "fit_outside",
 "paddingBottom": 0,
 "minHeight": 1,
 "data": {
  "name": "white line"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Button_03D37B27_0C7A_63B3_41A1_89572D8C8762",
  "this.Button_1FDDCF4A_0C0A_23FD_417A_1C14E098FDFD",
  "this.Button_1CA392FC_0C0A_2295_41A3_18DEA65FB6AD",
  "this.Button_1FE4B611_0C0A_256F_418E_EA27E66F8360",
  "this.Button_1EBF3282_0C0A_1D6D_4190_52FC7F8C00A5",
  "this.Button_33E0F47E_11C1_A20D_419F_BB809AD89259"
 ],
 "id": "Container_9A7696F9_9256_4198_41E2_40E7CF09A427",
 "left": "0%",
 "width": 1199,
 "layout": "horizontal",
 "backgroundOpacity": 0,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "shadow": false,
 "borderRadius": 0,
 "overflow": "scroll",
 "class": "Container",
 "propagateClick": false,
 "bottom": "0%",
 "paddingRight": 0,
 "paddingLeft": 30,
 "verticalAlign": "middle",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "height": 51,
 "contentOpaque": false,
 "gap": 3,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "paddingTop": 0,
 "paddingBottom": 0,
 "minHeight": 1,
 "data": {
  "name": "-button set container"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329"
 ],
 "id": "Container_EF8F8BD8_E386_8E02_41E5_FC5C5513733A",
 "width": 110,
 "scrollBarWidth": 10,
 "layout": "horizontal",
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "overflow": "visible",
 "right": "0%",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "top": "0%",
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "height": 110,
 "contentOpaque": false,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "paddingBottom": 0,
 "minHeight": 1,
 "data": {
  "name": "button menu sup"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB",
  "this.IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A",
  "this.IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D",
  "this.IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96",
  "this.IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0",
  "this.IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC",
  "this.IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521"
 ],
 "id": "Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE",
 "width": "91.304%",
 "scrollBarWidth": 10,
 "layout": "vertical",
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "overflow": "scroll",
 "right": "0%",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "propagateClick": false,
 "bottom": "0%",
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "contentOpaque": false,
 "gap": 3,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "paddingBottom": 0,
 "height": "85.959%",
 "visible": false,
 "data": {
  "name": "-button set"
 },
 "minHeight": 1
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_04FF2C2C_1216_7593_4195_88C3C7049763",
  "this.Container_04FF0C2C_1216_7593_419A_8AC354592A51"
 ],
 "shadowSpread": 1,
 "id": "Container_04FF5C2C_1216_7593_41B2_1B5CFADF351D",
 "left": "10%",
 "shadowColor": "#000000",
 "layout": "horizontal",
 "backgroundOpacity": 1,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "right": "10%",
 "shadow": true,
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "class": "Container",
 "overflow": "scroll",
 "top": "5%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "bottom": "5%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "shadowVerticalLength": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "paddingBottom": 0,
 "shadowHorizontalLength": 0,
 "data": {
  "name": "Global"
 },
 "minHeight": 1,
 "shadowBlurRadius": 25
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.IconButton_04FE6C2D_1216_75ED_41A3_C531DD2D317A"
 ],
 "id": "Container_04FF9C2D_1216_75ED_41A8_E3495D8F554E",
 "left": "10%",
 "layout": "vertical",
 "backgroundOpacity": 0,
 "horizontalAlign": "right",
 "scrollBarWidth": 10,
 "right": "10%",
 "shadow": false,
 "borderRadius": 0,
 "overflow": "visible",
 "class": "Container",
 "top": "5%",
 "propagateClick": false,
 "bottom": "84.78%",
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 20,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "contentOpaque": false,
 "gap": 10,
 "paddingTop": 20,
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "paddingBottom": 0,
 "minHeight": 1,
 "data": {
  "name": "Container X global"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_3A67552A_0C3A_67BD_4195_ECE46CCB34EA",
  "this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0"
 ],
 "shadowSpread": 1,
 "id": "Container_39A197B1_0C06_62AF_419A_D15E4DDD2528",
 "left": "15%",
 "shadowColor": "#000000",
 "layout": "vertical",
 "backgroundOpacity": 1,
 "horizontalAlign": "center",
 "scrollBarWidth": 10,
 "right": "15%",
 "shadow": true,
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "class": "Container",
 "overflow": "visible",
 "top": "7%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "bottom": "7%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "shadowVerticalLength": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "paddingBottom": 0,
 "shadowHorizontalLength": 0,
 "data": {
  "name": "Global"
 },
 "minHeight": 1,
 "shadowBlurRadius": 25
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_1813DA3E_1663_8BF1_4193_F28A53801FBC",
  "this.Container_1813FA3E_1663_8BF1_4180_5027A2A87866"
 ],
 "shadowSpread": 1,
 "id": "Container_1813AA3E_1663_8BF1_41A2_CA5EE3718362",
 "left": "10%",
 "shadowColor": "#000000",
 "layout": "horizontal",
 "backgroundOpacity": 1,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "right": "10%",
 "shadow": true,
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "class": "Container",
 "overflow": "scroll",
 "top": "5%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "bottom": "5%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "shadowVerticalLength": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "paddingBottom": 0,
 "shadowHorizontalLength": 0,
 "data": {
  "name": "Global"
 },
 "minHeight": 1,
 "shadowBlurRadius": 25
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.IconButton_1812DA3F_1663_8BEF_41A5_6E0723037CA1"
 ],
 "id": "Container_1812AA3F_1663_8BEF_41A4_02F566B1BC6D",
 "left": "10%",
 "layout": "vertical",
 "backgroundOpacity": 0,
 "horizontalAlign": "right",
 "scrollBarWidth": 10,
 "right": "10%",
 "shadow": false,
 "borderRadius": 0,
 "overflow": "visible",
 "class": "Container",
 "top": "5%",
 "propagateClick": false,
 "bottom": "80%",
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 20,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "contentOpaque": false,
 "gap": 10,
 "paddingTop": 20,
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "paddingBottom": 0,
 "minHeight": 1,
 "data": {
  "name": "Container X global"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_2F8A7686_0D4F_6B71_41A9_1A894413085C",
  "this.ThumbnailGrid_2F8BA686_0D4F_6B7E_419C_EB65DD1505BB"
 ],
 "shadowSpread": 1,
 "id": "Container_2F8A6686_0D4F_6B71_4174_A02FE43588D3",
 "left": "15%",
 "shadowColor": "#000000",
 "layout": "vertical",
 "backgroundOpacity": 1,
 "horizontalAlign": "center",
 "scrollBarWidth": 10,
 "right": "15%",
 "shadow": true,
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "class": "Container",
 "overflow": "visible",
 "top": "7%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "bottom": "7%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "shadowVerticalLength": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "paddingBottom": 0,
 "shadowHorizontalLength": 0,
 "data": {
  "name": "Global"
 },
 "minHeight": 1,
 "shadowBlurRadius": 25
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_2A19EC4C_0D3B_DFF0_414D_37145C22C5BC"
 ],
 "shadowSpread": 1,
 "id": "Container_2A193C4C_0D3B_DFF0_4161_A2CD128EF536",
 "left": "15%",
 "shadowColor": "#000000",
 "layout": "vertical",
 "backgroundOpacity": 1,
 "horizontalAlign": "center",
 "scrollBarWidth": 10,
 "right": "15%",
 "shadow": true,
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "class": "Container",
 "overflow": "visible",
 "top": "7%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "bottom": "7%",
 "paddingRight": 10,
 "paddingLeft": 10,
 "verticalAlign": "top",
 "shadowVerticalLength": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 10,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "paddingBottom": 10,
 "shadowHorizontalLength": 0,
 "data": {
  "name": "Global"
 },
 "minHeight": 1,
 "shadowBlurRadius": 25
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_0DEC9FEC_12FA_D293_41A0_DAD5B350B643",
  "this.Container_0DECBFED_12FA_D26D_41AD_EE1B8CC7BCC8"
 ],
 "shadowSpread": 1,
 "id": "Container_0DEF7FEC_12FA_D293_4197_332CA20EDBCF",
 "left": "10%",
 "shadowColor": "#000000",
 "layout": "horizontal",
 "backgroundOpacity": 1,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "right": "10%",
 "shadow": true,
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "class": "Container",
 "overflow": "scroll",
 "top": "5%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "bottom": "5%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "shadowVerticalLength": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "paddingBottom": 0,
 "shadowHorizontalLength": 0,
 "data": {
  "name": "Global"
 },
 "minHeight": 1,
 "shadowBlurRadius": 25
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.IconButton_0DEC0FED_12FA_D26D_41B1_C01AE2D2C1D4"
 ],
 "id": "Container_0DEC1FED_12FA_D26D_41AE_8CE7699C44D8",
 "left": "10%",
 "layout": "vertical",
 "backgroundOpacity": 0,
 "horizontalAlign": "right",
 "scrollBarWidth": 10,
 "right": "10%",
 "shadow": false,
 "borderRadius": 0,
 "overflow": "visible",
 "class": "Container",
 "top": "5%",
 "propagateClick": false,
 "bottom": "80%",
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 20,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "contentOpaque": false,
 "gap": 10,
 "paddingTop": 20,
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "paddingBottom": 0,
 "minHeight": 1,
 "data": {
  "name": "Container X global"
 }
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_248B34E4_2F9E_A363_41C0_761AAE294CBA_1_HS_2_0.png",
   "width": 560,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_2637F477_30A2_0D20_4199_E07D888CC6B6",
 "colCount": 4
},
{
 "iconWidth": 0,
 "layout": "horizontal",
 "id": "Button_03D37B27_0C7A_63B3_41A1_89572D8C8762",
 "width": 110,
 "pressedBackgroundOpacity": 1,
 "fontFamily": "Montserrat",
 "pressedBackgroundColorRatios": [
  0
 ],
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadowColor": "#000000",
 "shadowSpread": 1,
 "shadow": false,
 "iconHeight": 0,
 "rollOverShadow": false,
 "borderRadius": 0,
 "borderColor": "#000000",
 "class": "Button",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "rollOverBackgroundOpacity": 0.8,
 "rollOverBackgroundColor": [
  "#BBD149"
 ],
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "push",
 "fontSize": 12,
 "minWidth": 1,
 "height": 40,
 "label": "HOUSE INFO",
 "pressedBackgroundColor": [
  "#BBD149"
 ],
 "click": "this.setComponentVisibility(this.Container_04FE7C2D_1216_75ED_4197_E539B3CD3A95, true, 0, null, null, false)",
 "fontStyle": "normal",
 "backgroundColor": [
  "#000000"
 ],
 "gap": 5,
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "borderSize": 0,
 "paddingBottom": 0,
 "textDecoration": "none",
 "iconBeforeLabel": true,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "fontWeight": "bold",
 "minHeight": 1,
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "Button house info"
 },
 "shadowBlurRadius": 15
},
{
 "iconWidth": 32,
 "layout": "horizontal",
 "id": "Button_1FDDCF4A_0C0A_23FD_417A_1C14E098FDFD",
 "width": 130,
 "pressedBackgroundOpacity": 1,
 "fontFamily": "Montserrat",
 "pressedBackgroundColorRatios": [
  0
 ],
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadowColor": "#000000",
 "shadowSpread": 1,
 "shadow": false,
 "iconHeight": 32,
 "borderRadius": 0,
 "borderColor": "#000000",
 "class": "Button",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "rollOverBackgroundOpacity": 0.8,
 "rollOverBackgroundColor": [
  "#BBD149"
 ],
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "push",
 "fontSize": 12,
 "minWidth": 1,
 "height": 40,
 "label": "PANORAMA LIST",
 "pressedBackgroundColor": [
  "#BBD149"
 ],
 "click": "this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, true, 0, null, null, false)",
 "fontStyle": "normal",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 5,
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "borderSize": 0,
 "paddingBottom": 0,
 "textDecoration": "none",
 "iconBeforeLabel": true,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "fontWeight": "bold",
 "minHeight": 1,
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "Button panorama list"
 },
 "shadowBlurRadius": 15
},
{
 "iconWidth": 32,
 "layout": "horizontal",
 "id": "Button_1CA392FC_0C0A_2295_41A3_18DEA65FB6AD",
 "width": 90,
 "pressedBackgroundOpacity": 1,
 "fontFamily": "Montserrat",
 "pressedBackgroundColorRatios": [
  0
 ],
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadowColor": "#000000",
 "shadowSpread": 1,
 "shadow": false,
 "iconHeight": 32,
 "borderRadius": 0,
 "borderColor": "#000000",
 "class": "Button",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "rollOverBackgroundOpacity": 0.8,
 "rollOverBackgroundColor": [
  "#BBD149"
 ],
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "push",
 "fontSize": 12,
 "minWidth": 1,
 "height": 40,
 "label": "LOCATION",
 "pressedBackgroundColor": [
  "#BBD149"
 ],
 "click": "this.setComponentVisibility(this.Container_1812EA3F_1663_8BEF_41AF_0A4CCC089B5F, true, 0, null, null, false)",
 "fontStyle": "normal",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 5,
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "borderSize": 0,
 "paddingBottom": 0,
 "textDecoration": "none",
 "iconBeforeLabel": true,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "fontWeight": "bold",
 "minHeight": 1,
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "Button location"
 },
 "shadowBlurRadius": 15
},
{
 "iconWidth": 32,
 "layout": "horizontal",
 "id": "Button_1FE4B611_0C0A_256F_418E_EA27E66F8360",
 "width": 103,
 "pressedBackgroundOpacity": 1,
 "fontFamily": "Montserrat",
 "pressedBackgroundColorRatios": [
  0
 ],
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadowColor": "#000000",
 "shadowSpread": 1,
 "shadow": false,
 "iconHeight": 32,
 "borderRadius": 0,
 "borderColor": "#000000",
 "class": "Button",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "rollOverBackgroundOpacity": 0.8,
 "rollOverBackgroundColor": [
  "#BBD149"
 ],
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "push",
 "fontSize": 12,
 "minWidth": 1,
 "height": 40,
 "label": "FLOORPLAN",
 "pressedBackgroundColor": [
  "#BBD149"
 ],
 "click": "this.setComponentVisibility(this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41, true, 0, null, null, false)",
 "fontStyle": "normal",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 5,
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "borderSize": 0,
 "paddingBottom": 0,
 "textDecoration": "none",
 "iconBeforeLabel": true,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "fontWeight": "bold",
 "minHeight": 1,
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "Button floorplan"
 },
 "shadowBlurRadius": 15
},
{
 "iconWidth": 32,
 "layout": "horizontal",
 "id": "Button_1EBF3282_0C0A_1D6D_4190_52FC7F8C00A5",
 "width": 112,
 "pressedBackgroundOpacity": 1,
 "fontFamily": "Montserrat",
 "pressedBackgroundColorRatios": [
  0
 ],
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadowColor": "#000000",
 "shadowSpread": 1,
 "shadow": false,
 "iconHeight": 32,
 "borderRadius": 0,
 "borderColor": "#000000",
 "class": "Button",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "rollOverBackgroundOpacity": 0.8,
 "rollOverBackgroundColor": [
  "#BBD149"
 ],
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "push",
 "fontSize": 12,
 "minWidth": 1,
 "height": 40,
 "label": "PHOTOALBUM",
 "pressedBackgroundColor": [
  "#BBD149"
 ],
 "click": "this.setComponentVisibility(this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E, true, 0, null, null, false)",
 "fontStyle": "normal",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 5,
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "borderSize": 0,
 "paddingBottom": 0,
 "textDecoration": "none",
 "iconBeforeLabel": true,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "fontWeight": "bold",
 "minHeight": 1,
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "Button photoalbum"
 },
 "shadowBlurRadius": 15
},
{
 "iconWidth": 32,
 "layout": "horizontal",
 "id": "Button_33E0F47E_11C1_A20D_419F_BB809AD89259",
 "width": 90,
 "pressedBackgroundOpacity": 1,
 "fontFamily": "Montserrat",
 "pressedBackgroundColorRatios": [
  0
 ],
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadowColor": "#000000",
 "shadowSpread": 1,
 "shadow": false,
 "iconHeight": 32,
 "borderRadius": 0,
 "borderColor": "#000000",
 "class": "Button",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "rollOverBackgroundOpacity": 0.8,
 "rollOverBackgroundColor": [
  "#BBD149"
 ],
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "push",
 "fontSize": 12,
 "minWidth": 1,
 "height": 40,
 "label": "CONTACT",
 "pressedBackgroundColor": [
  "#BBD149"
 ],
 "click": "this.setComponentVisibility(this.Container_0DEC3FED_12FA_D26D_419F_4067E8C6DA08, true, 0, null, null, false)",
 "fontStyle": "normal",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 5,
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "borderSize": 0,
 "paddingBottom": 0,
 "textDecoration": "none",
 "iconBeforeLabel": true,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "fontWeight": "bold",
 "minHeight": 1,
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "Button contact"
 },
 "shadowBlurRadius": 15
},
{
 "id": "IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329",
 "width": 60,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "borderRadius": 0,
 "pressedRollOverIconURL": "skin/IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329_pressed_rollover.png",
 "class": "IconButton",
 "iconURL": "skin/IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329.png",
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "maxWidth": 60,
 "mode": "toggle",
 "minWidth": 1,
 "height": 60,
 "click": "if(!this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE.get('visible')){ this.setComponentVisibility(this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE, true, 0, null, null, false) } else { this.setComponentVisibility(this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE, false, 0, null, null, false) }",
 "maxHeight": 60,
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329_pressed.png",
 "paddingTop": 0,
 "paddingBottom": 0,
 "minHeight": 1,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "image button menu"
 }
},
{
 "id": "IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC",
 "width": 58,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "borderRadius": 0,
 "rollOverIconURL": "skin/IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC_rollover.png",
 "class": "IconButton",
 "iconURL": "skin/IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC.png",
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "maxWidth": 58,
 "mode": "push",
 "minWidth": 1,
 "height": 58,
 "click": "this.shareTwitter(window.location.href)",
 "maxHeight": 58,
 "borderSize": 0,
 "paddingTop": 0,
 "paddingBottom": 0,
 "minHeight": 1,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton TWITTER"
 }
},
{
 "id": "IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521",
 "width": 58,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "borderRadius": 0,
 "rollOverIconURL": "skin/IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521_rollover.png",
 "class": "IconButton",
 "iconURL": "skin/IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521.png",
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "maxWidth": 58,
 "mode": "push",
 "minWidth": 1,
 "height": 58,
 "click": "this.shareFacebook(window.location.href)",
 "maxHeight": 58,
 "borderSize": 0,
 "paddingTop": 0,
 "paddingBottom": 0,
 "minHeight": 1,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton FB"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Image_04FF3C2C_1216_7593_41AF_91EA0BBCCE77"
 ],
 "id": "Container_04FF2C2C_1216_7593_4195_88C3C7049763",
 "width": "50%",
 "scrollBarWidth": 10,
 "layout": "absolute",
 "backgroundOpacity": 1,
 "horizontalAlign": "center",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "paddingRight": 10,
 "paddingLeft": 10,
 "verticalAlign": "middle",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "contentOpaque": false,
 "gap": 10,
 "paddingTop": 10,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF"
 ],
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 10,
 "height": "100%",
 "minHeight": 1,
 "data": {
  "name": "-left"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_04FF1C2C_1216_7593_417B_D7E74ABC91E3",
  "this.Container_04FFEC2C_1216_7593_41A4_4CD23AB66B04",
  "this.Container_04FF8C2D_1216_75ED_41A5_B4FCB592F167"
 ],
 "id": "Container_04FF0C2C_1216_7593_419A_8AC354592A51",
 "width": "50%",
 "scrollBarWidth": 10,
 "layout": "vertical",
 "backgroundOpacity": 1,
 "horizontalAlign": "left",
 "overflow": "visible",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "paddingRight": 60,
 "paddingLeft": 60,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.51,
 "scrollBarColor": "#0069A3",
 "minWidth": 400,
 "contentOpaque": false,
 "gap": 0,
 "paddingTop": 20,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 20,
 "height": "100%",
 "minHeight": 1,
 "data": {
  "name": "-right"
 }
},
{
 "id": "IconButton_04FE6C2D_1216_75ED_41A3_C531DD2D317A",
 "width": "25%",
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "borderRadius": 0,
 "pressedRollOverIconURL": "skin/IconButton_04FE6C2D_1216_75ED_41A3_C531DD2D317A_pressed_rollover.jpg",
 "rollOverIconURL": "skin/IconButton_04FE6C2D_1216_75ED_41A3_C531DD2D317A_rollover.jpg",
 "class": "IconButton",
 "iconURL": "skin/IconButton_04FE6C2D_1216_75ED_41A3_C531DD2D317A.jpg",
 "propagateClick": false,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "maxWidth": 60,
 "mode": "push",
 "paddingRight": 0,
 "minWidth": 50,
 "click": "this.setComponentVisibility(this.Container_04FE7C2D_1216_75ED_4197_E539B3CD3A95, false, 0, null, null, false)",
 "maxHeight": 60,
 "borderSize": 0,
 "height": "75%",
 "pressedIconURL": "skin/IconButton_04FE6C2D_1216_75ED_41A3_C531DD2D317A_pressed.jpg",
 "paddingTop": 0,
 "paddingBottom": 0,
 "cursor": "hand",
 "transparencyActive": false,
 "data": {
  "name": "X"
 },
 "minHeight": 50
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.HTMLText_3918BF37_0C06_E393_41A1_17CF0ADBAB12",
  "this.IconButton_38922473_0C06_2593_4199_C585853A1AB3"
 ],
 "id": "Container_3A67552A_0C3A_67BD_4195_ECE46CCB34EA",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "absolute",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "left",
 "overflow": "visible",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "height": 90,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "contentOpaque": false,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 0,
 "minHeight": 1,
 "data": {
  "name": "header"
 }
},
{
 "itemMinHeight": 50,
 "itemLabelPosition": "bottom",
 "rollOverItemThumbnailShadowColor": "#A2B935",
 "itemLabelFontFamily": "Times New Roman",
 "id": "ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0",
 "scrollBarMargin": 2,
 "itemBorderRadius": 0,
 "itemVerticalAlign": "top",
 "scrollBarWidth": 10,
 "rollOverItemLabelFontColor": "#A2B935",
 "backgroundOpacity": 0,
 "width": "100%",
 "horizontalAlign": "center",
 "selectedItemThumbnailShadowBlurRadius": 16,
 "shadow": false,
 "itemPaddingLeft": 3,
 "itemOpacity": 1,
 "itemMinWidth": 50,
 "propagateClick": false,
 "itemThumbnailOpacity": 1,
 "playList": "this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist",
 "verticalAlign": "middle",
 "scrollBarOpacity": 0.5,
 "paddingRight": 70,
 "scrollBarColor": "#BBD149",
 "itemPaddingRight": 3,
 "selectedItemThumbnailShadowVerticalLength": 0,
 "selectedItemLabelFontColor": "#A2B935",
 "height": "100%",
 "itemPaddingTop": 3,
 "itemBackgroundColor": [],
 "itemBackgroundColorRatios": [],
 "itemLabelGap": 7,
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "itemHeight": 156,
 "selectedItemLabelFontWeight": "bold",
 "itemLabelTextDecoration": "none",
 "itemLabelFontWeight": "bold",
 "rollOverItemThumbnailShadowBlurRadius": 0,
 "rollOverItemThumbnailShadow": true,
 "itemLabelFontSize": 14,
 "itemThumbnailShadow": false,
 "itemThumbnailHeight": 125,
 "selectedItemThumbnailShadow": true,
 "borderRadius": 5,
 "itemThumbnailScaleMode": "fit_outside",
 "itemLabelFontColor": "#666666",
 "class": "ThumbnailGrid",
 "itemBackgroundColorDirection": "vertical",
 "selectedItemThumbnailShadowHorizontalLength": 0,
 "paddingLeft": 70,
 "itemHorizontalAlign": "center",
 "itemThumbnailWidth": 220,
 "itemBackgroundOpacity": 0,
 "itemWidth": 220,
 "minWidth": 1,
 "itemMaxWidth": 1000,
 "itemPaddingBottom": 3,
 "gap": 26,
 "itemLabelFontStyle": "normal",
 "itemMaxHeight": 1000,
 "paddingTop": 10,
 "itemLabelHorizontalAlign": "center",
 "rollOverItemThumbnailShadowVerticalLength": 0,
 "paddingBottom": 70,
 "rollOverItemThumbnailShadowHorizontalLength": 8,
 "itemMode": "normal",
 "itemThumbnailBorderRadius": 0,
 "data": {
  "name": "ThumbnailList5161"
 },
 "minHeight": 1
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.WebFrame_198A3B12_1666_89B6_41B5_4C2585EFD00E"
 ],
 "id": "Container_1813DA3E_1663_8BF1_4193_F28A53801FBC",
 "width": "70%",
 "scrollBarWidth": 10,
 "layout": "absolute",
 "backgroundOpacity": 1,
 "horizontalAlign": "center",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "paddingRight": 10,
 "paddingLeft": 10,
 "verticalAlign": "middle",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "contentOpaque": false,
 "gap": 10,
 "paddingTop": 10,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF"
 ],
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 10,
 "height": "100%",
 "minHeight": 1,
 "data": {
  "name": "-left"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_18121A3E_1663_8BF1_41B4_AB4C2B45EFFF",
  "this.Container_18120A3E_1663_8BF1_419D_69232EA5FB3D",
  "this.Container_18128A3F_1663_8BEF_41B6_51D1938FA48A"
 ],
 "id": "Container_1813FA3E_1663_8BF1_4180_5027A2A87866",
 "width": "30%",
 "scrollBarWidth": 10,
 "layout": "vertical",
 "backgroundOpacity": 1,
 "horizontalAlign": "left",
 "overflow": "visible",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "paddingRight": 50,
 "paddingLeft": 40,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.51,
 "scrollBarColor": "#0069A3",
 "minWidth": 350,
 "contentOpaque": false,
 "gap": 0,
 "paddingTop": 20,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 20,
 "height": "100%",
 "minHeight": 1,
 "data": {
  "name": "-right"
 }
},
{
 "id": "IconButton_1812DA3F_1663_8BEF_41A5_6E0723037CA1",
 "width": "25%",
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "borderRadius": 0,
 "pressedRollOverIconURL": "skin/IconButton_1812DA3F_1663_8BEF_41A5_6E0723037CA1_pressed_rollover.jpg",
 "rollOverIconURL": "skin/IconButton_1812DA3F_1663_8BEF_41A5_6E0723037CA1_rollover.jpg",
 "class": "IconButton",
 "iconURL": "skin/IconButton_1812DA3F_1663_8BEF_41A5_6E0723037CA1.jpg",
 "propagateClick": false,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "maxWidth": 60,
 "mode": "push",
 "paddingRight": 0,
 "minWidth": 50,
 "click": "this.setComponentVisibility(this.Container_1812EA3F_1663_8BEF_41AF_0A4CCC089B5F, false, 0, null, null, false)",
 "maxHeight": 60,
 "borderSize": 0,
 "height": "75%",
 "pressedIconURL": "skin/IconButton_1812DA3F_1663_8BEF_41A5_6E0723037CA1_pressed.jpg",
 "paddingTop": 0,
 "paddingBottom": 0,
 "cursor": "hand",
 "transparencyActive": false,
 "data": {
  "name": "X"
 },
 "minHeight": 50
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.HTMLText_2F8A4686_0D4F_6B71_4183_10C1696E2923",
  "this.IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E"
 ],
 "id": "Container_2F8A7686_0D4F_6B71_41A9_1A894413085C",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "absolute",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "left",
 "overflow": "visible",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "height": 90,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "contentOpaque": false,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 0,
 "minHeight": 1,
 "data": {
  "name": "header"
 }
},
{
 "itemMinHeight": 50,
 "itemLabelPosition": "bottom",
 "rollOverItemThumbnailShadowColor": "#04A3E1",
 "itemLabelFontFamily": "Montserrat",
 "id": "ThumbnailGrid_2F8BA686_0D4F_6B7E_419C_EB65DD1505BB",
 "itemBorderRadius": 0,
 "itemVerticalAlign": "top",
 "scrollBarWidth": 10,
 "rollOverItemLabelFontColor": "#04A3E1",
 "backgroundOpacity": 0.05,
 "width": "100%",
 "horizontalAlign": "center",
 "selectedItemThumbnailShadowBlurRadius": 16,
 "shadow": false,
 "itemPaddingLeft": 3,
 "itemOpacity": 1,
 "itemMinWidth": 50,
 "propagateClick": false,
 "itemThumbnailOpacity": 1,
 "paddingRight": 70,
 "playList": "this.ThumbnailGrid_2F8BA686_0D4F_6B7E_419C_EB65DD1505BB_playlist",
 "verticalAlign": "middle",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#04A3E1",
 "itemPaddingRight": 3,
 "selectedItemThumbnailShadowVerticalLength": 0,
 "selectedItemLabelFontColor": "#04A3E1",
 "backgroundColor": [
  "#000000"
 ],
 "itemPaddingTop": 3,
 "itemBackgroundColor": [],
 "itemBackgroundColorRatios": [],
 "itemLabelGap": 7,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "height": "100%",
 "backgroundColorDirection": "vertical",
 "itemHeight": 156,
 "selectedItemLabelFontWeight": "bold",
 "itemLabelTextDecoration": "none",
 "itemLabelFontWeight": "normal",
 "rollOverItemThumbnailShadowBlurRadius": 0,
 "rollOverItemThumbnailShadow": true,
 "itemLabelFontSize": 14,
 "itemThumbnailShadow": false,
 "itemThumbnailHeight": 125,
 "selectedItemThumbnailShadow": true,
 "borderRadius": 5,
 "itemThumbnailScaleMode": "fit_outside",
 "itemLabelFontColor": "#666666",
 "class": "ThumbnailGrid",
 "itemBackgroundColorDirection": "vertical",
 "backgroundColorRatios": [
  0
 ],
 "selectedItemThumbnailShadowHorizontalLength": 0,
 "paddingLeft": 70,
 "itemHorizontalAlign": "center",
 "itemThumbnailWidth": 220,
 "itemBackgroundOpacity": 0,
 "itemWidth": 220,
 "minWidth": 1,
 "itemMaxWidth": 1000,
 "itemPaddingBottom": 3,
 "gap": 26,
 "itemLabelFontStyle": "normal",
 "paddingTop": 10,
 "itemMaxHeight": 1000,
 "itemLabelHorizontalAlign": "center",
 "rollOverItemThumbnailShadowVerticalLength": 0,
 "paddingBottom": 70,
 "rollOverItemThumbnailShadowHorizontalLength": 8,
 "itemMode": "normal",
 "visible": false,
 "minHeight": 1,
 "itemThumbnailBorderRadius": 0,
 "scrollBarMargin": 2,
 "data": {
  "name": "ThumbnailList5161"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.ViewerAreaLabeled_2A198C4C_0D3B_DFF0_419F_C9A785406D9C",
  "this.IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482",
  "this.IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510",
  "this.IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1"
 ],
 "id": "Container_2A19EC4C_0D3B_DFF0_414D_37145C22C5BC",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "absolute",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "left",
 "overflow": "visible",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "contentOpaque": false,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 0,
 "height": "100%",
 "minHeight": 1,
 "data": {
  "name": "Container photo"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Image_0DEC8FEC_12FA_D26C_4162_7A2BAB1DA270"
 ],
 "id": "Container_0DEC9FEC_12FA_D293_41A0_DAD5B350B643",
 "width": "85%",
 "scrollBarWidth": 10,
 "layout": "absolute",
 "backgroundOpacity": 1,
 "horizontalAlign": "center",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "paddingRight": 10,
 "paddingLeft": 10,
 "verticalAlign": "middle",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "contentOpaque": false,
 "gap": 10,
 "paddingTop": 10,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF"
 ],
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 10,
 "height": "100%",
 "minHeight": 1,
 "data": {
  "name": "-left"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_0DECAFED_12FA_D26D_4191_988031ED4C85",
  "this.Container_0DECDFED_12FA_D26D_41A3_11915FF353DB",
  "this.Container_0DECEFED_12FA_D26D_4184_68D80FD2C88F"
 ],
 "id": "Container_0DECBFED_12FA_D26D_41AD_EE1B8CC7BCC8",
 "width": "50%",
 "scrollBarWidth": 10,
 "layout": "vertical",
 "backgroundOpacity": 1,
 "horizontalAlign": "left",
 "overflow": "visible",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "paddingRight": 50,
 "paddingLeft": 50,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.51,
 "scrollBarColor": "#0069A3",
 "minWidth": 460,
 "contentOpaque": false,
 "gap": 0,
 "paddingTop": 20,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 20,
 "height": "100%",
 "minHeight": 1,
 "data": {
  "name": "-right"
 }
},
{
 "id": "IconButton_0DEC0FED_12FA_D26D_41B1_C01AE2D2C1D4",
 "width": "25%",
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "borderRadius": 0,
 "pressedRollOverIconURL": "skin/IconButton_0DEC0FED_12FA_D26D_41B1_C01AE2D2C1D4_pressed_rollover.jpg",
 "rollOverIconURL": "skin/IconButton_0DEC0FED_12FA_D26D_41B1_C01AE2D2C1D4_rollover.jpg",
 "class": "IconButton",
 "iconURL": "skin/IconButton_0DEC0FED_12FA_D26D_41B1_C01AE2D2C1D4.jpg",
 "propagateClick": false,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "maxWidth": 60,
 "mode": "push",
 "paddingRight": 0,
 "minWidth": 50,
 "click": "this.setComponentVisibility(this.Container_0DEC3FED_12FA_D26D_419F_4067E8C6DA08, false, 0, null, null, false)",
 "maxHeight": 60,
 "borderSize": 0,
 "height": "75%",
 "pressedIconURL": "skin/IconButton_0DEC0FED_12FA_D26D_41B1_C01AE2D2C1D4_pressed.jpg",
 "paddingTop": 0,
 "paddingBottom": 0,
 "cursor": "hand",
 "transparencyActive": false,
 "data": {
  "name": "X"
 },
 "minHeight": 50
},
{
 "id": "Image_04FF3C2C_1216_7593_41AF_91EA0BBCCE77",
 "left": "0%",
 "width": "100%",
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "borderRadius": 0,
 "url": "skin/Image_04FF3C2C_1216_7593_41AF_91EA0BBCCE77.jpg",
 "class": "Image",
 "top": "0%",
 "propagateClick": false,
 "paddingLeft": 0,
 "verticalAlign": "bottom",
 "maxWidth": 2000,
 "paddingRight": 0,
 "minWidth": 1,
 "maxHeight": 1000,
 "paddingTop": 0,
 "height": "100%",
 "borderSize": 0,
 "scaleMode": "fit_outside",
 "paddingBottom": 0,
 "data": {
  "name": "Image40635"
 },
 "minHeight": 1
},
{
 "scrollBarMargin": 2,
 "id": "Container_04FF1C2C_1216_7593_417B_D7E74ABC91E3",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "horizontal",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "right",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "height": 60,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "contentOpaque": false,
 "gap": 0,
 "paddingTop": 20,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 0,
 "minHeight": 0,
 "data": {
  "name": "Container space"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.HTMLText_04FFCC2C_1216_7593_41A3_D345BDE131A2",
  "this.Container_0BD17D93_1236_F6B5_4193_247950F46092",
  "this.Container_04FFDC2C_1216_7593_41A7_64E2588509FB"
 ],
 "id": "Container_04FFEC2C_1216_7593_41A4_4CD23AB66B04",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "vertical",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.79,
 "scrollBarColor": "#E73B2C",
 "minWidth": 100,
 "contentOpaque": false,
 "gap": 0,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 0,
 "height": "100%",
 "minHeight": 200,
 "data": {
  "name": "Container text"
 }
},
{
 "scrollBarMargin": 2,
 "id": "Container_04FF8C2D_1216_75ED_41A5_B4FCB592F167",
 "width": 370,
 "scrollBarWidth": 10,
 "layout": "horizontal",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "contentOpaque": false,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "height": 40,
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 0,
 "minHeight": 1,
 "data": {
  "name": "Container space"
 }
},
{
 "scrollBarMargin": 2,
 "id": "HTMLText_3918BF37_0C06_E393_41A1_17CF0ADBAB12",
 "left": "0%",
 "width": "77.115%",
 "backgroundOpacity": 0,
 "scrollBarWidth": 10,
 "shadow": false,
 "borderRadius": 0,
 "class": "HTMLText",
 "top": "0%",
 "propagateClick": false,
 "paddingLeft": 80,
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "height": "100%",
 "paddingTop": 36,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:3.52vh;font-family:'Otama.ep';\"><B>PANORAMA LIST/</B></SPAN></SPAN></DIV></div>",
 "paddingBottom": 0,
 "data": {
  "name": "HTMLText54192"
 },
 "minHeight": 100
},
{
 "id": "IconButton_38922473_0C06_2593_4199_C585853A1AB3",
 "width": "25%",
 "right": 20,
 "horizontalAlign": "right",
 "backgroundOpacity": 0,
 "shadow": false,
 "borderRadius": 0,
 "pressedRollOverIconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3_pressed_rollover.jpg",
 "rollOverIconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3_rollover.jpg",
 "class": "IconButton",
 "top": 20,
 "iconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3.jpg",
 "propagateClick": false,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "maxWidth": 60,
 "mode": "push",
 "paddingRight": 0,
 "minWidth": 50,
 "click": "this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, false, 0, null, null, false)",
 "maxHeight": 60,
 "paddingTop": 0,
 "height": "75%",
 "pressedIconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3_pressed.jpg",
 "borderSize": 0,
 "paddingBottom": 0,
 "cursor": "hand",
 "transparencyActive": false,
 "data": {
  "name": "X"
 },
 "minHeight": 50
},
{
 "id": "WebFrame_198A3B12_1666_89B6_41B5_4C2585EFD00E",
 "left": "0%",
 "backgroundOpacity": 1,
 "insetBorder": false,
 "right": "0%",
 "shadow": false,
 "borderRadius": 0,
 "url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d426958.695011444!2d39.26460682562743!3d-6.1659828881606344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185d29602a2909e5%3A0xa035af4aad9b7d5f!2zWmFuesOtYmFy!5e0!3m2!1ses!2ses!4v1542269644530\" width=\"600\" height=\"450\" frameborder=\"0\" style=\"border:0\" allowfullscreen>",
 "class": "WebFrame",
 "top": "0%",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "bottom": "0%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "minWidth": 1,
 "backgroundColor": [
  "#FFFFFF"
 ],
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundColorDirection": "vertical",
 "paddingBottom": 0,
 "scrollEnabled": true,
 "minHeight": 1,
 "data": {
  "name": "WebFrame5113"
 }
},
{
 "scrollBarMargin": 2,
 "id": "Container_18121A3E_1663_8BF1_41B4_AB4C2B45EFFF",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "horizontal",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "right",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "height": 60,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "contentOpaque": false,
 "gap": 0,
 "paddingTop": 20,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 0,
 "minHeight": 0,
 "data": {
  "name": "Container space"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.HTMLText_18123A3E_1663_8BF1_419F_B7BD72D2053B",
  "this.HTMLText_18125A3F_1663_8BEF_4196_AE566E10BAFC",
  "this.Container_18124A3F_1663_8BEF_4167_4F797ED9B565",
  "this.HTMLText_18127A3F_1663_8BEF_4175_B0DF8CE38BFE",
  "this.Button_18126A3F_1663_8BEF_41A4_B0EDA1A5F4E3"
 ],
 "id": "Container_18120A3E_1663_8BF1_419D_69232EA5FB3D",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "vertical",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.79,
 "scrollBarColor": "#E73B2C",
 "minWidth": 100,
 "contentOpaque": false,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 30,
 "height": "100%",
 "minHeight": 520,
 "data": {
  "name": "Container text"
 }
},
{
 "scrollBarMargin": 2,
 "id": "Container_18128A3F_1663_8BEF_41B6_51D1938FA48A",
 "width": 370,
 "scrollBarWidth": 10,
 "layout": "horizontal",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "contentOpaque": false,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "height": 40,
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 0,
 "minHeight": 1,
 "data": {
  "name": "Container space"
 }
},
{
 "scrollBarMargin": 2,
 "id": "HTMLText_2F8A4686_0D4F_6B71_4183_10C1696E2923",
 "left": "0%",
 "width": "77.115%",
 "backgroundOpacity": 0,
 "scrollBarWidth": 10,
 "shadow": false,
 "borderRadius": 0,
 "class": "HTMLText",
 "top": "0%",
 "propagateClick": false,
 "paddingLeft": 80,
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "height": "100%",
 "paddingTop": 36,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:3.52vh;font-family:'Otama.ep';\"><B>FLOORPLAN</B></SPAN></SPAN></DIV></div>",
 "paddingBottom": 0,
 "data": {
  "name": "HTMLText54192"
 },
 "minHeight": 100
},
{
 "id": "IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E",
 "width": "25%",
 "right": 20,
 "horizontalAlign": "right",
 "backgroundOpacity": 0,
 "shadow": false,
 "borderRadius": 0,
 "pressedRollOverIconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E_pressed_rollover.jpg",
 "rollOverIconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E_rollover.jpg",
 "class": "IconButton",
 "top": 20,
 "iconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E.jpg",
 "propagateClick": false,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "maxWidth": 60,
 "mode": "push",
 "paddingRight": 0,
 "minWidth": 50,
 "click": "this.setComponentVisibility(this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41, false, 0, null, null, false)",
 "maxHeight": 60,
 "paddingTop": 0,
 "height": "75%",
 "pressedIconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E_pressed.jpg",
 "borderSize": 0,
 "paddingBottom": 0,
 "cursor": "hand",
 "transparencyActive": false,
 "data": {
  "name": "IconButton54739"
 },
 "minHeight": 50
},
{
 "toolTipFontWeight": "normal",
 "playbackBarRight": 0,
 "id": "ViewerAreaLabeled_2A198C4C_0D3B_DFF0_419F_C9A785406D9C",
 "left": "0%",
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "progressBarBorderSize": 0,
 "width": "100%",
 "playbackBarProgressBorderSize": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "toolTipShadowOpacity": 1,
 "shadow": false,
 "playbackBarBorderRadius": 0,
 "toolTipFontStyle": "normal",
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderRadius": 0,
 "toolTipFontFamily": "Arial",
 "toolTipShadowVerticalLength": 0,
 "playbackBarHeadBorderColor": "#000000",
 "toolTipShadowHorizontalLength": 0,
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "progressLeft": 0,
 "playbackBarBorderSize": 0,
 "paddingRight": 0,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontColor": "#606060",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "borderSize": 0,
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressOpacity": 1,
 "transitionDuration": 500,
 "progressBarBackgroundColorDirection": "vertical",
 "firstTransitionDuration": 0,
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "progressBottom": 2,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "height": "100%",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "toolTipPaddingRight": 6,
 "toolTipBorderSize": 1,
 "vrPointerColor": "#FFFFFF",
 "toolTipPaddingLeft": 6,
 "toolTipPaddingTop": 4,
 "progressBarOpacity": 1,
 "toolTipDisplayTime": 600,
 "progressBorderSize": 0,
 "displayTooltipInTouchScreens": true,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "transitionMode": "blending",
 "progressBorderRadius": 0,
 "class": "ViewerArea",
 "top": "0%",
 "playbackBarLeft": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "paddingLeft": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBorderColor": "#000000",
 "progressBackgroundColorRatios": [
  0
 ],
 "minWidth": 1,
 "toolTipBorderColor": "#767676",
 "playbackBarBottom": 0,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipShadowSpread": 0,
 "toolTipShadowBlurRadius": 3,
 "progressBorderColor": "#000000",
 "playbackBarHeadOpacity": 1,
 "toolTipTextShadowColor": "#000000",
 "toolTipOpacity": 1,
 "progressBackgroundColorDirection": "vertical",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "paddingTop": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipPaddingBottom": 4,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipFontSize": 12,
 "toolTipTextShadowBlurRadius": 3,
 "paddingBottom": 0,
 "playbackBarHeight": 10,
 "toolTipShadowColor": "#333333",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "minHeight": 1,
 "playbackBarHeadWidth": 6,
 "playbackBarBackgroundColorDirection": "vertical",
 "data": {
  "name": "Viewer photoalbum 1"
 }
},
{
 "id": "IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482",
 "left": 10,
 "width": 165,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "borderRadius": 0,
 "pressedRollOverIconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482_pressed_rollover.png",
 "rollOverIconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482_rollover.png",
 "class": "IconButton",
 "top": "20%",
 "iconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482.png",
 "propagateClick": false,
 "bottom": "20%",
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "maxWidth": 60,
 "mode": "push",
 "paddingRight": 0,
 "minWidth": 50,
 "maxHeight": 60,
 "paddingTop": 0,
 "pressedIconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482_pressed.png",
 "borderSize": 0,
 "paddingBottom": 0,
 "minHeight": 50,
 "cursor": "hand",
 "transparencyActive": false,
 "data": {
  "name": "IconButton27247"
 }
},
{
 "id": "IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510",
 "width": "14%",
 "right": 10,
 "horizontalAlign": "center",
 "backgroundOpacity": 0,
 "shadow": false,
 "borderRadius": 0,
 "pressedRollOverIconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510_pressed_rollover.png",
 "rollOverIconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510_rollover.png",
 "class": "IconButton",
 "top": "20%",
 "iconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510.png",
 "propagateClick": false,
 "bottom": "20%",
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "maxWidth": 60,
 "mode": "push",
 "paddingRight": 0,
 "minWidth": 50,
 "maxHeight": 60,
 "paddingTop": 0,
 "pressedIconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510_pressed.png",
 "borderSize": 0,
 "paddingBottom": 0,
 "minHeight": 50,
 "cursor": "hand",
 "transparencyActive": false,
 "data": {
  "name": "IconButton29918"
 }
},
{
 "id": "IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1",
 "width": "10%",
 "right": 20,
 "horizontalAlign": "right",
 "backgroundOpacity": 0,
 "shadow": false,
 "borderRadius": 0,
 "pressedRollOverIconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1_pressed_rollover.jpg",
 "rollOverIconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1_rollover.jpg",
 "class": "IconButton",
 "top": 20,
 "iconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1.jpg",
 "propagateClick": false,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "maxWidth": 60,
 "mode": "push",
 "paddingRight": 0,
 "minWidth": 50,
 "click": "this.setComponentVisibility(this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E, false, 0, null, null, false)",
 "maxHeight": 60,
 "paddingTop": 0,
 "height": "10%",
 "pressedIconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1_pressed.jpg",
 "borderSize": 0,
 "paddingBottom": 0,
 "cursor": "hand",
 "transparencyActive": false,
 "data": {
  "name": "IconButton54739"
 },
 "minHeight": 50
},
{
 "id": "Image_0DEC8FEC_12FA_D26C_4162_7A2BAB1DA270",
 "left": "0%",
 "width": "100%",
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "borderRadius": 0,
 "url": "skin/Image_0DEC8FEC_12FA_D26C_4162_7A2BAB1DA270.jpg",
 "class": "Image",
 "top": "0%",
 "propagateClick": false,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "maxWidth": 2000,
 "paddingRight": 0,
 "minWidth": 1,
 "maxHeight": 1000,
 "paddingTop": 0,
 "height": "100%",
 "borderSize": 0,
 "scaleMode": "fit_outside",
 "paddingBottom": 0,
 "data": {
  "name": "Image"
 },
 "minHeight": 1
},
{
 "scrollBarMargin": 2,
 "id": "Container_0DECAFED_12FA_D26D_4191_988031ED4C85",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "horizontal",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "right",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "height": 60,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "contentOpaque": false,
 "gap": 0,
 "paddingTop": 20,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 0,
 "minHeight": 0,
 "data": {
  "name": "Container space"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.HTMLText_30F7AFD1_12F6_52B5_41AC_902D90554335",
  "this.Container_30C72FD2_121E_72B7_4185_0FFA7496FDA6",
  "this.HTMLText_0DECCFED_12FA_D26D_418B_9646D02C4859",
  "this.Button_0DECFFED_12FA_D26D_419B_F907711405D7"
 ],
 "id": "Container_0DECDFED_12FA_D26D_41A3_11915FF353DB",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "vertical",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.79,
 "scrollBarColor": "#E73B2C",
 "minWidth": 100,
 "contentOpaque": false,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 30,
 "height": "100%",
 "minHeight": 520,
 "data": {
  "name": "Container text"
 }
},
{
 "scrollBarMargin": 2,
 "id": "Container_0DECEFED_12FA_D26D_4184_68D80FD2C88F",
 "width": 370,
 "scrollBarWidth": 10,
 "layout": "horizontal",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "contentOpaque": false,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "height": 40,
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 0,
 "minHeight": 1,
 "data": {
  "name": "Container space"
 }
},
{
 "id": "HTMLText_04FFCC2C_1216_7593_41A3_D345BDE131A2",
 "width": "100%",
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "shadow": false,
 "borderRadius": 0,
 "class": "HTMLText",
 "propagateClick": false,
 "paddingLeft": 0,
 "scrollBarOpacity": 0,
 "paddingRight": 0,
 "scrollBarColor": "#99BB1B",
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "height": "28%",
 "paddingTop": 0,
 "borderSize": 0,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:5.82vh;font-family:'Otama.ep';\">HOUSE</SPAN><SPAN STYLE=\"font-size:5.82vh;font-family:'Otama.ep';\"><B>/</B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:10.96vh;font-family:'Otama.ep';\"><B>INFO</B></SPAN></SPAN></DIV></div>",
 "paddingBottom": 0,
 "scrollBarMargin": 2,
 "data": {
  "name": "HTMLText18899"
 },
 "minHeight": 1
},
{
 "scrollBarMargin": 2,
 "id": "Container_0BD17D93_1236_F6B5_4193_247950F46092",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "absolute",
 "backgroundOpacity": 1,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "height": 7,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "contentOpaque": false,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#000000"
 ],
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 0,
 "minHeight": 1,
 "data": {
  "name": "line"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.HTMLText_0B1CF751_121B_B3B2_41AA_8DF6E24BB6F1",
  "this.HTMLText_04FFBC2C_1216_7593_41A4_E1B06B145F04"
 ],
 "id": "Container_04FFDC2C_1216_7593_41A7_64E2588509FB",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "horizontal",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "contentOpaque": false,
 "gap": 22,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 0,
 "height": "70%",
 "minHeight": 1,
 "data": {
  "name": "- content"
 }
},
{
 "id": "HTMLText_18123A3E_1663_8BF1_419F_B7BD72D2053B",
 "width": "100%",
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "shadow": false,
 "borderRadius": 0,
 "class": "HTMLText",
 "propagateClick": false,
 "paddingLeft": 0,
 "scrollBarOpacity": 0,
 "paddingRight": 0,
 "scrollBarColor": "#BBD149",
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "height": "13%",
 "paddingTop": 0,
 "borderSize": 0,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:5.82vh;font-family:'Otama.ep';\">HOUSE</SPAN></SPAN></DIV></div>",
 "paddingBottom": 0,
 "scrollBarMargin": 2,
 "data": {
  "name": "HTMLText23803"
 },
 "minHeight": 1
},
{
 "id": "HTMLText_18125A3F_1663_8BEF_4196_AE566E10BAFC",
 "width": "100%",
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "shadow": false,
 "borderRadius": 0,
 "class": "HTMLText",
 "propagateClick": false,
 "paddingLeft": 0,
 "scrollBarOpacity": 0,
 "paddingRight": 0,
 "scrollBarColor": "#BBD149",
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "height": "15%",
 "paddingTop": 0,
 "borderSize": 0,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:6.77vh;font-family:'Otama.ep';\"><B>LOCATION</B></SPAN></SPAN></DIV></div>",
 "paddingBottom": 0,
 "scrollBarMargin": 2,
 "data": {
  "name": "HTMLText24905"
 },
 "minHeight": 1
},
{
 "scrollBarMargin": 2,
 "id": "Container_18124A3F_1663_8BEF_4167_4F797ED9B565",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "absolute",
 "backgroundOpacity": 1,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "height": 7,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "contentOpaque": false,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#000000"
 ],
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 0,
 "minHeight": 1,
 "data": {
  "name": "line"
 }
},
{
 "id": "HTMLText_18127A3F_1663_8BEF_4175_B0DF8CE38BFE",
 "width": "100%",
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "shadow": false,
 "borderRadius": 0,
 "class": "HTMLText",
 "propagateClick": false,
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#B3D237",
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "height": "100%",
 "paddingTop": 0,
 "borderSize": 0,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#99bb1b;font-size:2.3vh;font-family:'Antonio';\"><B>LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. MAECENAS CONGUE EROS MAGNA, ID BIBENDUM EROS MALESUADA VITAE.</B></SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:3.52vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.81vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.62vh;font-family:'Open Sans Semibold';\">Address:</SPAN><SPAN STYLE=\"color:#999999;font-size:1.62vh;font-family:'Open Sans Semibold';\"> line 1</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.62vh;font-family:'Open Sans Semibold';\">Address:</SPAN><SPAN STYLE=\"color:#999999;font-size:1.62vh;font-family:'Open Sans Semibold';\"> line 2</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.62vh;font-family:'Open Sans Semibold';\">Address:</SPAN><SPAN STYLE=\"color:#999999;font-size:1.62vh;font-family:'Open Sans Semibold';\"> line 3</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.62vh;font-family:'Open Sans Semibold';\">GPS:</SPAN><SPAN STYLE=\"color:#999999;font-size:1.62vh;font-family:'Open Sans Semibold';\"> xxxxxxxxxx</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.62vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.81vh;font-family:Arial, Helvetica, sans-serif;\"/></p></div>",
 "paddingBottom": 20,
 "scrollBarMargin": 2,
 "data": {
  "name": "HTMLText"
 },
 "minHeight": 1
},
{
 "fontFamily": "Antonio",
 "layout": "horizontal",
 "id": "Button_18126A3F_1663_8BEF_41A4_B0EDA1A5F4E3",
 "width": 207,
 "pressedBackgroundOpacity": 1,
 "pressedBackgroundColorRatios": [
  0
 ],
 "backgroundOpacity": 0.7,
 "horizontalAlign": "center",
 "shadowColor": "#000000",
 "shadowSpread": 1,
 "shadow": false,
 "iconHeight": 32,
 "borderRadius": 0,
 "borderColor": "#000000",
 "class": "Button",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "rollOverBackgroundOpacity": 1,
 "backgroundColor": [
  "#99BB1B"
 ],
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "push",
 "paddingRight": 0,
 "fontSize": 30,
 "minWidth": 1,
 "label": "BOOK NOW",
 "pressedBackgroundColor": [
  "#000000"
 ],
 "click": "this.openLink('http://www.loremipsum.com', '_blank')",
 "fontStyle": "normal",
 "paddingTop": 0,
 "height": 59,
 "gap": 5,
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 0,
 "textDecoration": "none",
 "iconBeforeLabel": true,
 "visible": false,
 "iconWidth": 32,
 "fontWeight": "bold",
 "minHeight": 1,
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "Button31015"
 },
 "shadowBlurRadius": 6
},
{
 "id": "HTMLText_30F7AFD1_12F6_52B5_41AC_902D90554335",
 "width": "100%",
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "shadow": false,
 "borderRadius": 0,
 "class": "HTMLText",
 "propagateClick": false,
 "paddingLeft": 0,
 "scrollBarOpacity": 0,
 "paddingRight": 0,
 "scrollBarColor": "#BBD149",
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "height": "52%",
 "paddingTop": 0,
 "borderSize": 0,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:5.82vh;font-family:'Otama.ep';\">CONTACT</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:10.96vh;font-family:'Otama.ep';\"><B>INFO</B></SPAN></SPAN></DIV></div>",
 "paddingBottom": 0,
 "scrollBarMargin": 2,
 "data": {
  "name": "HTMLText24905"
 },
 "minHeight": 1
},
{
 "scrollBarMargin": 2,
 "id": "Container_30C72FD2_121E_72B7_4185_0FFA7496FDA6",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "absolute",
 "backgroundOpacity": 1,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "class": "Container",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "height": 7,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "contentOpaque": false,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#000000"
 ],
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 0,
 "minHeight": 1,
 "data": {
  "name": "black line"
 }
},
{
 "id": "HTMLText_0DECCFED_12FA_D26D_418B_9646D02C4859",
 "width": "100%",
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "shadow": false,
 "borderRadius": 0,
 "class": "HTMLText",
 "propagateClick": false,
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#B3D237",
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "height": "100%",
 "paddingTop": 0,
 "borderSize": 0,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#99bb1b;font-size:3.52vh;font-family:'Antonio';\"><B>LOREM IPSUM</B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.62vh;font-family:'Open Sans Semibold';\">Mauris aliquet neque quis libero consequat vestibulum. Donec lacinia consequat dolor viverra sagittis. Praesent consequat porttitor risus, eu condimentum nunc. Proin et velit ac sapien luctus efficitur egestas ac augue. Nunc dictum, augue eget eleifend interdum, quam libero imperdiet lectus, vel scelerisque turpis lectus vel ligula. Duis a porta sem. Maecenas sollicitudin nunc id risus fringilla, a pharetra orci iaculis. Aliquam turpis ligula, tincidunt sit amet consequat ac, imperdiet non dolor.</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#99bb1b;font-size:3.52vh;font-family:'Antonio';\"><B>CONTACT:</B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.62vh;font-family:'Open Sans Semibold';\">E-mail:</SPAN><SPAN STYLE=\"color:#999999;font-size:1.62vh;font-family:'Open Sans Semibold';\"> Info@loremipsum.com </SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.62vh;font-family:'Open Sans Semibold';\">Web: </SPAN><SPAN STYLE=\"color:#999999;font-size:1.62vh;font-family:'Open Sans Semibold';\">www.loremipsum.com</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.62vh;font-family:'Open Sans Semibold';\">Tlf.:</SPAN><SPAN STYLE=\"color:#999999;font-size:1.62vh;font-family:'Open Sans Semibold';\"> +11 111 111 111</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.62vh;font-family:'Open Sans Semibold';\">Address:</SPAN><SPAN STYLE=\"color:#999999;font-size:1.62vh;font-family:'Open Sans Semibold';\"> line 1</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.62vh;font-family:'Open Sans Semibold';\">Address line 2</SPAN></SPAN></DIV></div>",
 "paddingBottom": 20,
 "scrollBarMargin": 2,
 "data": {
  "name": "HTMLText"
 },
 "minHeight": 1
},
{
 "fontFamily": "Antonio",
 "layout": "horizontal",
 "id": "Button_0DECFFED_12FA_D26D_419B_F907711405D7",
 "width": 207,
 "pressedBackgroundOpacity": 1,
 "pressedBackgroundColorRatios": [
  0
 ],
 "backgroundOpacity": 0.7,
 "horizontalAlign": "center",
 "shadowColor": "#000000",
 "shadowSpread": 1,
 "shadow": false,
 "iconHeight": 32,
 "borderRadius": 0,
 "borderColor": "#000000",
 "class": "Button",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "rollOverBackgroundOpacity": 1,
 "backgroundColor": [
  "#99BB1B"
 ],
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "push",
 "paddingRight": 0,
 "fontSize": "3.26vh",
 "minWidth": 1,
 "label": "BOOK NOW",
 "pressedBackgroundColor": [
  "#000000"
 ],
 "click": "this.openLink('http://www.loremipsum.com', '_blank')",
 "fontStyle": "normal",
 "paddingTop": 0,
 "height": 59,
 "gap": 5,
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "paddingBottom": 0,
 "textDecoration": "none",
 "iconBeforeLabel": true,
 "iconWidth": 32,
 "fontWeight": "bold",
 "minHeight": 1,
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "Button book now"
 },
 "shadowBlurRadius": 6
},
{
 "id": "HTMLText_0B1CF751_121B_B3B2_41AA_8DF6E24BB6F1",
 "width": "50%",
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "shadow": false,
 "borderRadius": 0,
 "class": "HTMLText",
 "propagateClick": false,
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#99BB1B",
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "height": "100%",
 "paddingTop": 20,
 "borderSize": 0,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#99bb1b;font-size:2.44vh;font-family:'Antonio';\"><B>LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. MAECENAS CONGHE EROS MAGNA.</B></SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.62vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.81vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.62vh;font-family:'Open Sans Semibold';\">Proin sit amet pharetra magna. Donec varius eu nisi at facilisis. Vivamus nibh magna, fermentum ac nibh sit amet, euismod efficitur sem. Fusce blandit, purus sed gravida vulputate, justo quam laoreet quam, et dictum mauris arcu vitae justo. Vivamus euismod condimentum ligula quis feugiat. Cras imperdiet tortor mi, a posuere velit tempus et. Maecenas et scelerisque turpis. Quisque in gravida leo, sed dapibus nibh. Ut at consequat turpis.</SPAN></SPAN></DIV></div>",
 "paddingBottom": 0,
 "scrollBarMargin": 2,
 "data": {
  "name": "HTMLText12940"
 },
 "minHeight": 1
},
{
 "id": "HTMLText_04FFBC2C_1216_7593_41A4_E1B06B145F04",
 "width": "50%",
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "shadow": false,
 "borderRadius": 0,
 "class": "HTMLText",
 "propagateClick": false,
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#99BB1B",
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "height": "100%",
 "paddingTop": 20,
 "borderSize": 0,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.62vh;font-family:'Open Sans Semibold';\">Mauris aliquet neque quis libero consequat vest</SPAN><SPAN STYLE=\"font-size:1.62vh;font-family:'Open Sans Semibold';\">i</SPAN><SPAN STYLE=\"color:#999999;font-size:1.62vh;font-family:'Open Sans Semibold';\">bulum. Donec lacinia consequat dolor viverra sagittis. Praesent consequat porttitor risus, eu condimentum nunc. Proin et velit ac sapien luctus efficitur egestas ac augue.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.62vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.81vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.62vh;font-family:'Open Sans Semibold';\">Nunc dictum, augue eget eleifend interdum, quam libero imperdiet lectus, vel scelerisque turpis lectus vel ligula. Duis a porta sem. Maecenas sollicitudin nunc id risus fringilla, a pharetra orci iaculis. Aliquam turpis ligula, tincidunt sit amet consequat ac, imperdiet non dolor.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.62vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.81vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.62vh;font-family:'Open Sans Semibold';\">Vivamus vitae iaculis turpis. Aliquam imperdiet, elit sed rutrum mollis, neque lacus aliquam lectus.</SPAN></SPAN></DIV></div>",
 "paddingBottom": 0,
 "scrollBarMargin": 2,
 "data": {
  "name": "HTMLText19460"
 },
 "minHeight": 1
}],
 "backgroundPreloadEnabled": true,
 "class": "Player",
 "desktopMipmappingEnabled": false,
 "mobileMipmappingEnabled": false,
 "propagateClick": false,
 "paddingRight": 0,
 "vrPolyfillScale": 0.5,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "minWidth": 20,
 "contentOpaque": false,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "buttonToggleFullscreen": "this.IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0",
 "paddingBottom": 0,
 "height": "100%",
 "defaultVRPointer": "laser",
 "minHeight": 20,
 "downloadEnabled": false,
 "data": {
  "name": "Player468"
 }
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
