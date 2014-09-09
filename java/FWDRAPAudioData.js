/* Data */
(function(window){
	
	var FWDRAPAudioData = function(props, playListElement, parent){
		
		var self = this;
		var prototype = FWDRAPAudioData.prototype;
		
		this.xhr = null;
		this.emailXHR = null;
		this.playlist_ar = null;
		
		this.dlIframe = null;
		
		this.mainPreloader_img = null;
		this.bk_img = null;
		this.thumbnail_img = null;
		this.separator1_img = null;
		this.separator2_img = null;
		this.prevN_img = null;
		this.prevS_img = null;
		this.playN_img = null;
		this.playS_img = null;
		this.pauseN_img = null;
		this.pauseS_img = null;
		this.nextN_img = null;
		this.nextS_img = null;
		
		this.mainScrubberBkLeft_img = null;
		this.mainScrubberBkRight_img = null;
		this.mainScrubberDragLeft_img = null;
		this.mainScrubberLine_img = null;
		this.mainScrubberLeftProgress_img = null;
		this.volumeScrubberBkLeft_img = null;
		this.volumeScrubberBkRight_img = null;
		this.volumeScrubberDragLeft_img = null;
		this.volumeScrubberLine_img = null;
		this.volumeN_img = null;
		this.volumeS_img = null;
		this.volumeD_img = null;
		this.progressLeft_img = null;
		this.titleBarLeft_img = null;
		this.titleBarRigth_img = null;
		
		this.categoriesN_img = null;
		this.categoriesS_img = null;
		this.replayN_img = null;
		this.replayS_img = null;
		this.playlistN_img = null;
		this.playlistS_img = null;
		this.shuffleN_img = null;
		this.shuffleS_img = null;
		this.facebookN_img = null;
		this.facebookS_img = null;
		this.popupN_img = null;
		this.popupS_img = null;
		this.downloaderN_img = null;
		this.downloaderS_img = null;
		
		this.titlebarAnimBkPath_img = null;
		this.titlebarLeftPath_img = null;
		this.titlebarRightPath_img = null;
		this.soundAnimationPath_img = null;
		
		this.playlistItemBk1_img = null;
		this.playlistItemBk2_img = null;
		this.playlistSeparator_img = null;
		this.playlistScrBkTop_img = null;
		this.playlistScrBkMiddle_img = null;
		this.playlistScrBkBottom_img = null;
		this.playlistScrDragTop_img = null;
		this.playlistScrDragMiddle_img = null;
		this.playlistScrDragBottom_img = null;
		this.playlistScrLines_img = null;
		this.playlistScrLinesOver_img = null;
		this.playlistPlayButtonN_img = null;
		this.playlistItemGrad1_img = null;
		this.playlistItemGrad2_img = null;
		this.playlistItemProgress1_img = null;
		this.playlistItemProgress2_img = null;
		this.playlistDownloadButtonN_img = null;
		this.playlistDownloadButtonS_img = null;
		
		this.catBk_img = null;
		this.catThumbBk_img = null;
		this.catThumbTextBk_img = null;
		this.catNextN_img = null;
		this.catNextS_img = null;
		this.catNextD_img = null;
		this.catPrevN_img = null;
		this.catPrevS_img = null;
		this.catPrevD_img = null;
		this.catCloseN_img = null;
		this.catCloseS_img = null;
		
		this.categories_el = null;
		this.scs_el = null;
		this.props_obj = props;
		this.skinPaths_ar = [];
		this.images_ar = [];
		this.cats_ar = [];
	
		this.scClientId_str = "a123083c52a6b06985421d33038e033a";
		this.flashPath_str = null;
		this.mp3DownloaderPath_str = null;
		this.proxyPath_str = null;
		this.proxyFolderPath_str = null;
		this.mailPath_str = null;
		this.skinPath_str = null;
		this.controllerBkPath_str = null;
		this.thumbnailBkPath_str = null;
		this.playlistIdOrPath_str = null;
		this.mainScrubberBkMiddlePath_str = null;
		this.volumeScrubberBkMiddlePath_str = null;
		this.mainScrubberDragMiddlePath_str = null;
		this.volumeScrubberDragMiddlePath_str = null;
		this.timeColor_str = null;
		this.titleColor_str = null;
		this.progressMiddlePath_str = null;
		this.sourceURL_str = null;
		this.titlebarBkMiddlePattern_str = null;
		this.playlistPlayButtonN_str = null;
		this.playlistPlayButtonS_str = null;
		this.playlistPauseButtonN_str = null;
		this.playlistPauseButtonS_str = null;
		this.trackTitleNormalColor_str = null;
		this.trackTitleSelected_str = null;
		this.trackDurationColor_str = null;
		this.categoriesId_str = null;
		this.thumbnailSelectedType_str = null;
		this.facebookAppId_str = null;
		
		this.totalCats = 0;
		this.countLoadedSkinImages = 0;
		this.volume = 1;
		this.startSpaceBetweenButtons = 0;
		this.spaceBetweenButtons = 0;
		this.mainScrubberOffsetTop = 0;
		this.spaceBetweenMainScrubberAndTime = 0;
		this.startTimeSpace = 0;
		this.scrubbersOffsetWidth = 0;
		this.scrubbersOffestTotalWidth = 0;
		this.volumeButtonAndScrubberOffsetTop = 0;
		this.maxPlaylistItems = 0;
		this.separatorOffsetOutSpace = 0;
		this.separatorOffsetInSpace = 0;
		this.lastButtonsOffsetTop = 0;
		this.allButtonsOffsetTopAndBottom = 0;
		this.controllerHeight = 0;
		this.titleBarOffsetTop = 0;
		this.scrubberOffsetBottom = 0;
		this.equlizerOffsetLeft = 0;
		this.nrOfVisiblePlaylistItems = 0;
		this.trackTitleOffsetLeft = 0;
		this.playPauseButtonOffsetLeftAndRight = 0;
		this.durationOffsetRight = 0;
		this.downloadButtonOffsetRight = 0;
		this.scrollbarOffestWidth = 0;
		this.resetLoadIndex = -1;
		this.startAtPlaylist = 0;
		this.startAtTrack = 0;
		this.totalCategories = 0;
		this.thumbnailMaxWidth = 0; 
		this.buttonsMargins = 0;
		this.thumbnailMaxHeight = 0;
		this.horizontalSpaceBetweenThumbnails = 0;
		this.verticalSpaceBetweenThumbnails = 0;
		this.countID3 = 0;
		
		this.JSONPRequestTimeoutId_to;
		this.showLoadPlaylistErrorId_to;
		this.dispatchPlaylistLoadCompleteWidthDelayId_to;
		this.loadImageId_to;
		this.dispatchLoadSkinCompleteWithDelayId_to;
		this.loadPreloaderId_to;
		
		this.isPlaylistDispatchingError_bl = false;
		this.allowToChangeVolume_bl = true;
		this.showContextMenu_bl = false;
		this.autoPlay_bl = false;
		this.loop_bl = false;
		this.shuffle_bl = false;
		this.showLoopButton_bl = false;
		this.showShuffleButton_bl = false;
		this.showDownloadMp3Button_bl = false;
		this.showPlaylistsButtonAndPlaylists_bl = false;
		this.showPlaylistsByDefault_bl = false;
		this.showPlayListButtonAndPlaylist_bl = false;
		this.showFacebookButton_bl = false;
		this.showPopupButton_bl = false;
		this.expandControllerBackground_bl = false;
		this.animateOnIntro_bl = false;
		this.showPlayListByDefault_bl = false;
		this.isDataLoaded_bl = false;
		this.useDeepLinking_bl = false;
		this.showSoundCloudUserNameInTitle_bl = false;
		this.showThumbnail_bl = false;
		this.showSoundAnimation_bl = false;
		this.showPlaylistItemPlayButton_bl = false;
		this.isMobile_bl = FWDUtils.isMobile;
		this.hasPointerEvent_bl = FWDUtils.hasPointerEvent;
	
		//###################################//
		/*init*/
		//###################################//
		self.init = function(){
			self.parseProperties();
		};
		
		//#############################################//
		// parse properties.
		//#############################################//
		self.parseProperties = function(){
			
			self.categoriesId_str = self.props_obj.playlistsId;
			if(!self.categoriesId_str){
				setTimeout(function(){
					if(self == null) return;
					errorMessage_str = "The <font color='#FFFFFF'>playlistsId</font> property is not defined in the constructor function!";
					self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:errorMessage_str});
				}, 50);
				return;
			}
				
			self.mainFolderPath_str = self.props_obj.mainFolderPath;
			if(!self.mainFolderPath_str){
				setTimeout(function(){
					if(self == null) return;
					errorMessage_str = "The <font color='#FFFFFF'>mainFolderPath</font> property is not defined in the constructor function!";
					self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:errorMessage_str});
				}, 50);
				return;
			}
			
			if((self.mainFolderPath_str.lastIndexOf("/") + 1) != self.mainFolderPath_str.length){
				self.mainFolderPath_str += "/";
			}
			
			self.skinPath_str = self.props_obj.skinPath;
			if(!self.skinPath_str){
				setTimeout(function(){
					if(self == null) return;
					errorMessage_str = "The <font color='#FFFFFF'>skinPath</font> property is not defined in the constructor function!";
					self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:errorMessage_str});
				}, 50);
				return;
			}
			
		
			if((self.skinPath_str.lastIndexOf("/") + 1) != self.skinPath_str.length){
				self.skinPath_str += "/";
			}
			
			self.skinPath_str = self.mainFolderPath_str + self.skinPath_str;
			self.flashPath_str = self.mainFolderPath_str + "swf.swf";
			self.proxyPath_str =  self.mainFolderPath_str + "proxy.php";
			self.proxyFolderPath_str = self.mainFolderPath_str  + "proxyFolder.php";
			self.mailPath_str = self.mainFolderPath_str  + "sendMail.php";
			self.mp3DownloaderPath_str = self.mainFolderPath_str  + "downloader.php";
			
			self.categories_el = document.getElementById(self.categoriesId_str);
			var catsChildren_ar = FWDUtils.getChildren(self.categories_el);
			self.totalCats = catsChildren_ar.length;
			
		
			
			
			if(self.totalCats == 0){
				setTimeout(function(){
					if(self == null) return;
					errorMessage_str = "At least one category is required!";
					self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:errorMessage_str});
				}, 50);
				return;
			}
			
			for(var i=0; i<self.totalCats; i++){
				var obj = {};
				child = catsChildren_ar[i];
				
				if(!FWDUtils.hasAttribute(child, "data-source")){
					setTimeout(function(){
						if(self == null) return;
						self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:"Attribute <font color='#FFFFFF'>data-source</font> is required in the categories html element at position <font color='#FFFFFF'>" + (i + 1)});
					}, 50);
					return;
				}
				
				if(!FWDUtils.hasAttribute(child, "data-thumbnail-path")){
					setTimeout(function(){
						if(self == null) return;
						self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:"Attribute <font color='#FFFFFF'>data-thumbnail-path</font> is required in the categories html element at position <font color='#FFFFFF'>" + (i + 1)});
					}, 50);
					return;
				}
				
				obj.source = FWDUtils.getAttributeValue(child, "data-source");
				obj.thumbnailPath = FWDUtils.getAttributeValue(child, "data-thumbnail-path");
				obj.htmlContent = child.innerHTML;
				self.cats_ar[i] = obj;
			}
			
			//try{self.categories_el.parentNode.removeChild(self.categories_el);}catch(e){};
		
			self.facebookAppId_str = self.props_obj.facebookAppId || undefined;
			self.totalCategories = self.cats_ar.length;
			self.playlistIdOrPath_str = self.props_obj.playlistIdOrPath || undefined;
			self.timeColor_str = self.props_obj.timeColor || "#FF0000";
			self.trackTitleNormalColor_str = self.props_obj.trackTitleNormalColor || "#FF0000";
			self.trackTitleSelected_str = self.props_obj.trackTitleSelectedColor || "#FF0000";
			self.trackDurationColor_str = self.props_obj.trackDurationColor || "#FF0000";
			self.titleColor_str = self.props_obj.titleColor || "#FF0000";
			self.thumbnailSelectedType_str = self.props_obj.thumbnailSelectedType || "opacity";
			if(self.thumbnailSelectedType_str != "blackAndWhite"  
				&& self.thumbnailSelectedType_str != "threshold" 
				&& self.thumbnailSelectedType_str != "opacity"){
				self.thumbnailSelectedType_str = "opacity";
			}
			if(self.isMobile_bl || FWDUtils.isIEAndLessThen9)  self.thumbnailSelectedType_str = "opacity";
			if(document.location.protocol == "file:") self.thumbnailSelectedType_str = "opacity";
		
			self.startAtPlaylist = self.props_obj.startAtPlaylist || 0;
			if(isNaN(self.startAtPlaylist)) self.startAtPlaylist = 0;
			//if(self.startAtPlaylist != 0) self.startAtPlaylist -= 1;
			if(self.startAtPlaylist < 0){
				self.startAtPlaylist = 0;
			}else if(self.startAtPlaylist > self.totalCats - 1){
				self.startAtPlaylist = self.totalCats - 1;
			}
			
			self.startAtTrack = self.props_obj.startAtTrack || 0; 
			
			self.volume = self.props_obj.volume;
			if(!self.volume) self.volume = 1;
			if(isNaN(self.volume)) volume = 1;
			if(self.volume > 1 || self.isMobile_bl){
				self.volume = 1;
			}else if(self.volume <0){
				self.volume = 0;
			}
			
			
			self.buttonsMargins = self.props_obj.buttonsMargins || 0; 
			self.thumbnailMaxWidth = self.props_obj.thumbnailMaxWidth || 330; 
			self.thumbnailMaxHeight = self.props_obj.thumbnailMaxHeight || 330;
			self.horizontalSpaceBetweenThumbnails = self.props_obj.horizontalSpaceBetweenThumbnails;
			if(self.horizontalSpaceBetweenThumbnails == undefined)  self.horizontalSpaceBetweenThumbnails = 40;
			self.verticalSpaceBetweenThumbnails = parseInt(self.props_obj.verticalSpaceBetweenThumbnails);
			if(self.verticalSpaceBetweenThumbnails == undefined)  self.verticalSpaceBetweenThumbnails = 40;
			
			self.startSpaceBetweenButtons = self.props_obj.startSpaceBetweenButtons || 0;
			self.spaceBetweenButtons = self.props_obj.spaceBetweenButtons || 0;
			self.mainScrubberOffsetTop = self.props_obj.mainScrubberOffsetTop || 100;
			self.spaceBetweenMainScrubberAndTime = self.props_obj.spaceBetweenMainScrubberAndTime;
			self.startTimeSpace = self.props_obj.startTimeSpace;
			self.scrubbersOffsetWidth  = self.props_obj.scrubbersOffsetWidth || 0;
			self.scrubbersOffestTotalWidth = self.props_obj.scrubbersOffestTotalWidth || 0;
			self.volumeButtonAndScrubberOffsetTop = self.props_obj.volumeButtonAndScrubberOffsetTop || 0;
			self.spaceBetweenVolumeButtonAndScrubber = self.props_obj.spaceBetweenVolumeButtonAndScrubber || 0;
			self.scrubberOffsetBottom = self.props_obj.scrubberOffsetBottom || 0;
			self.equlizerOffsetLeft = self.props_obj.equlizerOffsetLeft || 0;
			self.nrOfVisiblePlaylistItems = self.props_obj.nrOfVisiblePlaylistItems || 0;
			self.trackTitleOffsetLeft = self.props_obj.trackTitleOffsetLeft || 0;
			self.playPauseButtonOffsetLeftAndRight = self.props_obj.playPauseButtonOffsetLeftAndRight || 0;
			self.durationOffsetRight = self.props_obj.durationOffsetRight || 0;
			self.downloadButtonOffsetRight = self.props_obj.downloadButtonOffsetRight || 0;
			self.scrollbarOffestWidth = self.props_obj.scrollbarOffestWidth || 0;
			self.maxPlaylistItems = self.props_obj.maxPlaylistItems || 200;
			self.controllerHeight = self.props_obj.controllerHeight || 200;
			self.titleBarOffsetTop = self.props_obj.titleBarOffsetTop || 0;
			self.separatorOffsetInSpace = self.props_obj.separatorOffsetInSpace || 0;
			self.lastButtonsOffsetTop = self.props_obj.lastButtonsOffsetTop || 0;
			self.allButtonsOffsetTopAndBottom = self.props_obj.allButtonsOffsetTopAndBottom || 0;
			self.separatorOffsetOutSpace = self.props_obj.separatorOffsetOutSpace || 0;
			self.volumeScrubberWidth = self.props_obj.volumeScrubberWidth || 10;
			if(self.volumeScrubberWidth > 200) self.volumeScrubberWidth = 200;
			
			if(self.isMobile_bl) self.allowToChangeVolume_bl = false;
			
			self.showContextMenu_bl = self.props_obj.showContextMenu; 
			self.showContextMenu_bl = self.showContextMenu_bl == "no" ? false : true;
			
			self.autoPlay_bl = self.props_obj.autoPlay; 
			self.autoPlay_bl = self.autoPlay_bl == "yes" ? true : false;
			//if(FWDUtils.isMobile) self.autoPlay_bl = false;
		
			self.loop_bl = self.props_obj.loop; 
			self.loop_bl = self.loop_bl == "yes" ? true : false;
			
			self.shuffle_bl = self.props_obj.shuffle; 
			self.shuffle_bl = self.shuffle_bl == "yes" ? true : false;
			
			
			self.useDeepLinking_bl = self.props_obj.useDeepLinking; 
			self.useDeepLinking_bl = self.useDeepLinking_bl == "yes" ? true : false;
			
			self.showSoundCloudUserNameInTitle_bl = self.props_obj.showSoundCloudUserNameInTitle; 
			self.showSoundCloudUserNameInTitle_bl = self.showSoundCloudUserNameInTitle_bl == "yes" ? true : false;
			
			self.showThumbnail_bl = self.props_obj.showThumbnail; 
			self.showThumbnail_bl = self.showThumbnail_bl == "yes" ? true : false;
			
			self.showLoopButton_bl = self.props_obj.showLoopButton; 
			self.showLoopButton_bl = self.props_obj.showLoopButton == "no" ? false : true;
			
			self.showPlayListButtonAndPlaylist_bl = self.props_obj.showPlayListButtonAndPlaylist; 
			self.showPlayListButtonAndPlaylist_bl = self.showPlayListButtonAndPlaylist_bl == "no" ? false : true;
			
			if(FWDUtils.isAndroid 
			   && self.showPlayListButtonAndPlaylist_bl
			   && self.props_obj.showPlayListOnAndroid == "no"
			   ){
				self.showPlayListButtonAndPlaylist_bl = false;
			}
			
			self.showPlaylistsButtonAndPlaylists_bl = self.props_obj.showPlaylistsButtonAndPlaylists;
			self.showPlaylistsButtonAndPlaylists_bl = self.showPlaylistsButtonAndPlaylists_bl == "no" ? false : true;
			
			self.showPlaylistsByDefault_bl = self.props_obj.showPlaylistsByDefault; 
			self.showPlaylistsByDefault_bl = self.showPlaylistsByDefault_bl == "yes" ? true : false;
		
			self.showShuffleButton_bl = self.props_obj.showShuffleButton; 
			self.showShuffleButton_bl = self.props_obj.showShuffleButton == "no" ? false : true;
			
			self.showDownloadMp3Button_bl = self.props_obj.showDownloadMp3Button; 
			self.showDownloadMp3Button_bl = self.showDownloadMp3Button_bl == "no" ? false : true;
			
			self.showFacebookButton_bl = self.props_obj.showFacebookButton; 
			self.showFacebookButton_bl = self.props_obj.showFacebookButton == "no" ? false : true;
			
			self.showPopupButton_bl = self.props_obj.showPopupButton; 
			self.showPopupButton_bl = self.showPopupButton_bl == "no" ? false : true;
			
			self.expandControllerBackground_bl = self.props_obj.expandBackground; 
			self.expandControllerBackground_bl = self.expandControllerBackground_bl == "yes" ? true : false;
			
			self.showPlaylistItemPlayButton_bl = self.props_obj.showPlaylistItemPlayButton; 
			self.showPlaylistItemPlayButton_bl = self.showPlaylistItemPlayButton_bl == "no" ? false : true;
			
			self.showPlaylistItemDownloadButton_bl = self.props_obj.showPlaylistItemDownloadButton; 
			self.showPlaylistItemDownloadButton_bl = self.showPlaylistItemDownloadButton_bl == "no" ? false : true;
			
			self.forceDisableDownloadButtonForPodcast_bl = self.props_obj.forceDisableDownloadButtonForPodcast; 
			self.forceDisableDownloadButtonForPodcast_bl = self.forceDisableDownloadButtonForPodcast_bl == "yes" ? true : false;
			
			self.forceDisableDownloadButtonForOfficialFM_bl = self.props_obj.forceDisableDownloadButtonForOfficialFM; 
			self.forceDisableDownloadButtonForOfficialFM_bl = self.forceDisableDownloadButtonForOfficialFM_bl == "yes" ? true : false;
			
			self.forceDisableDownloadButtonForFolder_bl = self.props_obj.forceDisableDownloadButtonForFolder; 
			self.forceDisableDownloadButtonForFolder_bl = self.forceDisableDownloadButtonForFolder_bl == "yes" ? true : false;
	
			if(self.showFacebookButton_bl && !self.facebookAppId_str){
				setTimeout(function(){
					if(self == null) return;
					self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:"Parameter <font color='#FFFFFF'>facebookAppId</font> is requiredin the constructor, this represents the facebook app id, for more info read the documetation"});
				}, 50);
				return;
			}
			
			self.animateOnIntro_bl = self.props_obj.animateOnIntro; 
			self.animateOnIntro_bl = self.animateOnIntro_bl == "yes" ? true : false;
			
			self.showPlayListByDefault_bl = self.props_obj.showPlayListByDefault; 
			self.showPlayListByDefault_bl = self.showPlayListByDefault_bl == "no" ? false : true;
			
			self.showSoundAnimation_bl = self.props_obj.showSoundAnimation; 
			self.showSoundAnimation_bl = self.showSoundAnimation_bl == "yes" ? true : false;
			
			self.showPlaylistItemPlayButton_bl = self.props_obj.showPlaylistItemPlayButton; 
			self.showPlaylistItemPlayButton_bl = self.showPlaylistItemPlayButton_bl == "no" ? false : true;
			
			self.addScrollBarMouseWheelSupport_bl = self.props_obj.addScrollBarMouseWheelSupport; 
			self.addScrollBarMouseWheelSupport_bl = self.addScrollBarMouseWheelSupport_bl == "no" ? false : true;
	
			//setup skin paths
			var preloaderPath_str = self.skinPath_str + "preloader.png";
			var separator1Path_str = self.skinPath_str + "separator.png";
			var separator2Path_str = self.skinPath_str + "separator.png";
			var prevNPath_str = self.skinPath_str + "prev-button.png"; 
			var prevSPath_str = self.skinPath_str + "prev-button-over.png"; 
			var playNPath_str = self.skinPath_str + "play-button.png"; 
			var playSPath_str = self.skinPath_str + "play-button-over.png";
			var pauseNPath_str = self.skinPath_str + "pause-button.png"; 
			var pauseSPath_str = self.skinPath_str + "pause-button-over.png";
			var nextNPath_str = self.skinPath_str + "next-button.png"; 
			var nextSPath_str = self.skinPath_str + "next-button-over.png"; 
			
			self.controllerBkPath_str = self.skinPath_str + "controller-background.png";
			self.thumbnailBkPath_str = self.skinPath_str + "thumbnail-background.png";
			
			var mainScrubberBkLeftPath_str = self.skinPath_str + "scrubber-left-background.png"; 
			var mainScrubberBkRightPath_str = self.skinPath_str + "scrubber-right-background.png";
			var mainScrubberDragLeftPath_str = self.skinPath_str + "scrubber-left-drag.png";
			var mainScrubberLinePath_str = self.skinPath_str + "scrubber-line.png";
			var mainScrubberProgressLeftPath_str  = self.skinPath_str + "progress-left.png";
			self.mainScrubberBkMiddlePath_str = self.skinPath_str + "scrubber-middle-background.png";
			self.mainScrubberDragMiddlePath_str = self.skinPath_str + "scrubber-middle-drag.png";
			
			var volumeScrubberBkLeftPath_str = self.skinPath_str + "scrubber-left-background.png"; 
			var volumeScrubberBkRightPath_str = self.skinPath_str + "scrubber-right-background.png";
			var volumeScrubberDragLeftPath_str = self.skinPath_str + "scrubber-left-drag.png";
			var volumeScrubberLinePath_str = self.skinPath_str + "scrubber-line.png";
			self.volumeScrubberBkMiddlePath_str = self.skinPath_str + "scrubber-middle-background.png";
			self.volumeScrubberDragMiddlePath_str = self.skinPath_str + "scrubber-middle-drag.png";	
		
			var volumeNPath_str = self.skinPath_str + "volume-icon.png";	
			var volumeSPath_str = self.skinPath_str + "volume-icon-over.png";
			var volumeDPath_str = self.skinPath_str + "volume-icon-disabled.png";
			var progressLeftPath_str = self.skinPath_str + "progress-left.png";
			self.progressMiddlePath_str = self.skinPath_str + "progress-middle.png";
		
			var categoriesNPath_str = self.skinPath_str + "categories-button.png"; 
			var categoriesSPath_str = self.skinPath_str + "categories-button-over.png"; 
			var replayNPath_str = self.skinPath_str + "replay-button.png"; 
			var replaySPath_str = self.skinPath_str + "replay-button-over.png"; 
			var playlistNPath_str = self.skinPath_str + "playlist-button.png"; 
			var playlistSPath_str = self.skinPath_str + "playlist-button-over.png"; 
			var shuffleNPath_str = self.skinPath_str + "shuffle-button.png"; 
			var shuffleSPath_str = self.skinPath_str + "shuffle-button-over.png"; 
			var facebookNPath_str = self.skinPath_str + "facebook-button.png"; 
			var facebookSPath_str = self.skinPath_str + "facebook-button-over.png"; 
			var popupNPath_str = self.skinPath_str + "popup-button.png"; 
			var popupSPath_str = self.skinPath_str + "popup-button-over.png"; 
			var downloaderNPath_str = self.skinPath_str + "download-button.png"; 
			var downloaderSPath_str = self.skinPath_str + "download-button-over.png"; 
			
			var titlebarAnimBkPath_str = self.skinPath_str + "titlebar-equlizer-background.png"; 
			var titlebarLeftPath_str = self.skinPath_str + "titlebar-grad-left.png"; 
			var titlebarRightPath_str = self.skinPath_str + "titlebar-grad-right.png"; 
			var animationPath_str = self.skinPath_str + "equalizer.png";
			var titleBarLeftPath_str = self.skinPath_str + "titlebar-left-pattern.png";
			var titleBarRigthPath_str = self.skinPath_str + "titlebar-right-pattern.png";
			self.titlebarBkMiddlePattern_str = self.skinPath_str + "titlebar-middle-pattern.png"; 
			
			if(self.showPlayListButtonAndPlaylist_bl){
				var playlistItemBk1Path_str = self.skinPath_str + "playlist-item-background1.png"; 
				var playlistItemBkPath_str = self.skinPath_str + "playlist-item-background2.png"; 
				var playlistSeparatorPath_str = self.skinPath_str + "playlist-separator.png"; 
				var playlistScrBkTopPath_str = self.skinPath_str + "playlist-scrollbar-background-top.png"; 
				var playlistScrBkMiddlePath_str = self.skinPath_str + "playlist-scrollbar-background-middle.png"; 
				var playlistScrBkBottomPath_str = self.skinPath_str + "playlist-scrollbar-background-bottom.png"; 
				var playlistScrDragTopPath_str = self.skinPath_str + "playlist-scrollbar-drag-top.png"; 
				var playlistScrDragMiddlePath_str = self.skinPath_str + "playlist-scrollbar-drag-middle.png"; 
				var playlistScrDragBottomPath_str = self.skinPath_str + "playlist-scrollbar-drag-bottom.png"; 
				var playlistScrLinesPath_str = self.skinPath_str + "playlist-scrollbar-lines.png"; 
				var playlistScrLinesOverPath_str = self.skinPath_str + "playlist-scrollbar-lines-over.png"; 
				var playlistItemGrad_str = self.skinPath_str + "playlist-item-grad1.png"; 
				var playlistItemGrad2_str = self.skinPath_str + "playlist-item-grad2.png"; 
				var playlistItemProgress1_str = self.skinPath_str + "playlist-item-progress1.png"; 
				var playlistItemProgress2_str = self.skinPath_str + "playlist-item-progress2.png"; 
				var playlistDownloadButtonN_str = self.skinPath_str + "playlist-download-button.png"; 
				var playlistDownloadButtonS_str = self.skinPath_str + "playlist-download-button-over.png"; 
				
				
				
				self.playlistPlayButtonN_str = self.skinPath_str + "playlist-play-button.png"; 
				self.playlistPlayButtonS_str = self.skinPath_str + "playlist-play-button-over.png"; 
				self.playlistPauseButtonN_str = self.skinPath_str + "playlist-pause-button.png"; 
				self.playlistPauseButtonS_str = self.skinPath_str + "playlist-pause-button-over.png"; 
			}
			
			if(self.showPlaylistsButtonAndPlaylists_bl){
				var catBkPath_str = self.skinPath_str + "categories-background.png"; 
				var catThumbBkPath_str = self.skinPath_str + "categories-thumbnail-background.png"; 
				var catThumbBkTextPath_str = self.skinPath_str + "categories-thumbnail-text-backgorund.png"; 
				var catNextNPath_str = self.skinPath_str + "categories-next-button.png"; 
				var catNextSPath_str = self.skinPath_str + "categories-next-button-over.png"; 
				var catNextDPath_str = self.skinPath_str + "categories-next-button-disabled.png";
				var catPrevNPath_str = self.skinPath_str + "categories-prev-button.png"; 
				var catPrevSPath_str = self.skinPath_str + "categories-prev-button-over.png"; 
				var catPrevDPath_str = self.skinPath_str + "categories-prev-button-disabled.png"; 
				var catCloseNPath_str = self.skinPath_str + "categories-close-button.png"; 
				var catCloseSPath_str = self.skinPath_str + "categories-close-button-over.png"; 
			}
			
			//set skin graphics paths.
			self.skinPaths_ar.push(preloaderPath_str);
			self.skinPaths_ar.push(separator1Path_str);
			self.skinPaths_ar.push(separator2Path_str);
			self.skinPaths_ar.push(prevNPath_str);
			self.skinPaths_ar.push(prevSPath_str);
			self.skinPaths_ar.push(playNPath_str);
			self.skinPaths_ar.push(playSPath_str);
			self.skinPaths_ar.push(pauseNPath_str);
			self.skinPaths_ar.push(pauseSPath_str);
			self.skinPaths_ar.push(nextNPath_str);
			self.skinPaths_ar.push(nextSPath_str);
			
			self.skinPaths_ar.push(mainScrubberBkLeftPath_str);
			self.skinPaths_ar.push(mainScrubberBkRightPath_str);
			self.skinPaths_ar.push(mainScrubberDragLeftPath_str);
			self.skinPaths_ar.push(mainScrubberLinePath_str);
			self.skinPaths_ar.push(mainScrubberProgressLeftPath_str);
			self.skinPaths_ar.push(volumeScrubberBkLeftPath_str);
			self.skinPaths_ar.push(volumeScrubberBkRightPath_str);
			self.skinPaths_ar.push(volumeScrubberDragLeftPath_str);
			self.skinPaths_ar.push(volumeScrubberLinePath_str);
			self.skinPaths_ar.push(volumeNPath_str);
			self.skinPaths_ar.push(volumeSPath_str);
			self.skinPaths_ar.push(volumeDPath_str);
			self.skinPaths_ar.push(progressLeftPath_str);
	
			self.skinPaths_ar.push(categoriesNPath_str);
			self.skinPaths_ar.push(categoriesSPath_str);
			self.skinPaths_ar.push(replayNPath_str);
			self.skinPaths_ar.push(replaySPath_str);
			self.skinPaths_ar.push(playlistNPath_str);
			self.skinPaths_ar.push(playlistSPath_str);
			self.skinPaths_ar.push(shuffleNPath_str);
			self.skinPaths_ar.push(shuffleSPath_str);
			self.skinPaths_ar.push(facebookNPath_str);
			self.skinPaths_ar.push(facebookSPath_str);
		
			self.skinPaths_ar.push(titlebarAnimBkPath_str);
			self.skinPaths_ar.push(titlebarLeftPath_str);
			self.skinPaths_ar.push(titlebarRightPath_str);
			self.skinPaths_ar.push(animationPath_str);
			self.skinPaths_ar.push(titleBarLeftPath_str);
			self.skinPaths_ar.push(titleBarRigthPath_str);
			self.skinPaths_ar.push(popupNPath_str);
			self.skinPaths_ar.push(popupSPath_str);
			self.skinPaths_ar.push(self.controllerBkPath_str);
			self.skinPaths_ar.push(downloaderNPath_str);
			self.skinPaths_ar.push(downloaderSPath_str);
			
			
			if(self.showPlayListButtonAndPlaylist_bl){
				self.skinPaths_ar.push(playlistItemBk1Path_str);
				self.skinPaths_ar.push(playlistItemBkPath_str);
				self.skinPaths_ar.push(playlistSeparatorPath_str);
				self.skinPaths_ar.push(playlistScrBkTopPath_str);
				self.skinPaths_ar.push(playlistScrBkMiddlePath_str);
				self.skinPaths_ar.push(playlistScrBkBottomPath_str);
				self.skinPaths_ar.push(playlistScrDragTopPath_str);
				self.skinPaths_ar.push(playlistScrDragMiddlePath_str);
				self.skinPaths_ar.push(playlistScrDragBottomPath_str);
				self.skinPaths_ar.push(playlistScrLinesPath_str);
				self.skinPaths_ar.push(playlistScrLinesOverPath_str);
				self.skinPaths_ar.push(self.playlistPlayButtonN_str);
				self.skinPaths_ar.push(playlistItemGrad_str);
				self.skinPaths_ar.push(playlistItemGrad2_str);
				self.skinPaths_ar.push(playlistItemProgress1_str);	
				self.skinPaths_ar.push(playlistItemProgress2_str);	
				self.skinPaths_ar.push(playlistDownloadButtonN_str);	
				self.skinPaths_ar.push(playlistDownloadButtonS_str);
			}
			
			if(self.showPlaylistsButtonAndPlaylists_bl){
				self.skinPaths_ar.push(catBkPath_str);
				self.skinPaths_ar.push(catThumbBkPath_str);
				self.skinPaths_ar.push(catThumbBkTextPath_str);
				self.skinPaths_ar.push(catNextNPath_str);
				self.skinPaths_ar.push(catNextSPath_str);
				self.skinPaths_ar.push(catNextDPath_str);
				self.skinPaths_ar.push(catPrevNPath_str);
				self.skinPaths_ar.push(catPrevSPath_str);
				self.skinPaths_ar.push(catPrevDPath_str);
				self.skinPaths_ar.push(catCloseNPath_str);
				self.skinPaths_ar.push(catCloseSPath_str);
			}
			
			
			
			self.skinPaths_ar.push(self.thumbnailBkPath_str);
			self.skinPaths_ar.push(self.mainScrubberBkMiddlePath_str);
			self.skinPaths_ar.push(self.mainScrubberDragMiddlePath_str);
			self.skinPaths_ar.push(self.volumeScrubberBkMiddlePath_str);
			self.skinPaths_ar.push(self.volumeScrubberDragMiddlePath_str);
			self.skinPaths_ar.push(self.progressMiddlePath_str);
			self.skinPaths_ar.push(self.titlebarBkMiddlePattern_str);
			
			
			if(self.showPlayListButtonAndPlaylist_bl){
				self.skinPaths_ar.push(self.playlistPlayButtonS_str);
				self.skinPaths_ar.push(self.playlistPauseButtonN_str);
				self.skinPaths_ar.push(self.playlistPauseButtonS_str);
			}
			
			self.totalGraphics = self.skinPaths_ar.length;
			
			self.loadSkin();
		};
		
		//####################################//
		/* load buttons graphics */
		//###################################//
		self.loadSkin = function(){
			if(self.image_img){
				self.image_img.onload = null;
				self.image_img.onerror = null;
			}
			
			var imagePath = self.skinPaths_ar[self.countLoadedSkinImages];
		
			self.image_img = new Image();
			self.image_img.onload = self.onSkinLoadHandler;
			self.image_img.onerror = self.onSkinLoadErrorHandler;
			self.image_img.src = imagePath;
		};
		
		self.onSkinLoadHandler = function(e){
			if(self.countLoadedSkinImages == 0){
				self.mainPreloader_img = self.image_img;
				self.loadPreloaderId_to = setTimeout(function(){
					if(self == null) return;
					self.dispatchEvent(FWDRAPAudioData.PRELOADER_LOAD_DONE);
				}, 50);
			}else if(self.countLoadedSkinImages == 1){
				self.separator1_img = self.image_img;
			}else if(self.countLoadedSkinImages == 2){
				self.separator2_img = self.image_img;
			}else if(self.countLoadedSkinImages == 3){
				self.prevN_img = self.image_img;
			}else if(self.countLoadedSkinImages == 4){
				self.prevS_img = self.image_img;
			}else if(self.countLoadedSkinImages == 5){
				self.playN_img = self.image_img;
			}else if(self.countLoadedSkinImages == 6){
				self.playS_img = self.image_img;
			}else if(self.countLoadedSkinImages == 7){
				self.pauseN_img = self.image_img;
			}else if(self.countLoadedSkinImages == 8){
				self.pauseS_img = self.image_img;
			}else if(self.countLoadedSkinImages == 9){
				self.nextN_img = self.image_img;
			}else if(self.countLoadedSkinImages == 10){
				self.nextS_img = self.image_img;
			}else if(self.countLoadedSkinImages == 11){
				self.mainScrubberBkLeft_img = self.image_img;
			}else if(self.countLoadedSkinImages == 12){
				self.mainScrubberBkRight_img = self.image_img;
			}else if(self.countLoadedSkinImages == 13){
				self.mainScrubberDragLeft_img = self.image_img;
			}else if(self.countLoadedSkinImages == 14){
				self.mainScrubberLine_img = self.image_img;
			}else if(self.countLoadedSkinImages == 15){
				self.mainScrubberLeftProgress_img = self.image_img;
			}else if(self.countLoadedSkinImages == 16){
				self.volumeScrubberBkLeft_img = self.image_img;
			}else if(self.countLoadedSkinImages == 17){
				self.volumeScrubberBkRight_img = self.image_img;
			}else if(self.countLoadedSkinImages == 18){
				self.volumeScrubberDragLeft_img = self.image_img;
			}else if(self.countLoadedSkinImages == 19){
				self.volumeScrubberLine_img = self.image_img;
			}else if(self.countLoadedSkinImages == 20){
				self.volumeN_img = self.image_img;
			}else if(self.countLoadedSkinImages == 21){
				self.volumeS_img = self.image_img;
			}else if(self.countLoadedSkinImages == 22){
				self.volumeD_img = self.image_img;
			}else if(self.countLoadedSkinImages == 23){
				self.progressLeft_img = self.image_img;
			}else if(self.countLoadedSkinImages == 24){
				self.categoriesN_img = self.image_img;
			}else if(self.countLoadedSkinImages == 25){
				self.categoriesS_img = self.image_img;
			}else if(self.countLoadedSkinImages == 26){
				self.replayN_img = self.image_img;
			}else if(self.countLoadedSkinImages == 27){
				self.replayS_img = self.image_img;
			}else if(self.countLoadedSkinImages == 28){
				self.playlistN_img = self.image_img;
			}else if(self.countLoadedSkinImages == 29){
				self.playlistS_img = self.image_img;
			}else if(self.countLoadedSkinImages == 30){
				self.shuffleN_img = self.image_img;
			}else if(self.countLoadedSkinImages == 31){
				self.shuffleS_img = self.image_img;
			}else if(self.countLoadedSkinImages == 32){
				self.facebookN_img = self.image_img;
			}else if(self.countLoadedSkinImages == 33){
				self.facebookS_img = self.image_img;
			}else if(self.countLoadedSkinImages == 34){
				self.titlebarAnimBkPath_img = self.image_img;
			}else if(self.countLoadedSkinImages == 35){
				self.titlebarLeftPath_img = self.image_img;
			}else if(self.countLoadedSkinImages == 36){
				self.titlebarRightPath_img = self.image_img;
			}else if(self.countLoadedSkinImages == 37){
				self.soundAnimationPath_img = self.image_img;
			}else if(self.countLoadedSkinImages == 38){
				self.titleBarLeft_img = self.image_img;
			}else if(self.countLoadedSkinImages == 39){
				self.titleBarRigth_img = self.image_img;
			}else if(self.countLoadedSkinImages == 40){
				self.popupN_img = self.image_img;
			}else if(self.countLoadedSkinImages == 41){
				self.popupS_img = self.image_img;
			}else if(self.countLoadedSkinImages == 42){
				self.controllerBk_img = self.image_img;
			}else if(self.countLoadedSkinImages == 43){
				self.downloaderN_img = self.image_img;
			}else if(self.countLoadedSkinImages == 44){
				self.downloaderS_img = self.image_img;
			}else if(self.countLoadedSkinImages == 45){
				if(self.showPlayListButtonAndPlaylist_bl){
					self.resetLoadIndex = 0;
				}else if(self.showPlaylistsButtonAndPlaylists_bl){
					self.resetLoadIndex = 50;
				}
			};
			
			if(self.showPlayListButtonAndPlaylist_bl && self.resetLoadIndex <= 50){
				if(self.resetLoadIndex == 0){
					self.resetLoadIndex ++;
					self.playlistItemBk1_img = self.image_img;
				}else if(self.resetLoadIndex == 1){
					self.resetLoadIndex ++;
					self.playlistItemBk2_img = self.image_img;
				}else if(self.resetLoadIndex == 2){
					self.resetLoadIndex ++;
					self.playlistSeparator_img = self.image_img;
				}else if(self.resetLoadIndex == 3){
					self.resetLoadIndex ++;
					self.playlistScrBkTop_img = self.image_img;
				}else if(self.resetLoadIndex == 4){
					self.resetLoadIndex ++;
					self.playlistScrBkMiddle_img = self.image_img;
				}else if(self.resetLoadIndex == 5){
					self.resetLoadIndex ++;
					self.playlistScrBkBottom_img = self.image_img;
				}else if(self.resetLoadIndex == 6){
					self.resetLoadIndex ++;
					self.playlistScrDragBottom_img = self.image_img;
				}else if(self.resetLoadIndex == 7){
					self.resetLoadIndex ++;
					self.playlistScrDragMiddle_img = self.image_img;
				}else if(self.resetLoadIndex == 8){
					self.resetLoadIndex ++;
					self.playlistScrDragTop_img = self.image_img;
				}else if(self.resetLoadIndex == 9){
					self.resetLoadIndex ++;
					self.playlistScrLines_img = self.image_img;
				}else if(self.resetLoadIndex == 10){
					self.resetLoadIndex ++;
					self.playlistScrLinesOver_img = self.image_img;
				}else if(self.resetLoadIndex == 11){
					self.resetLoadIndex ++;
					self.playlistPlayButtonN_img = self.image_img;
				}else if(self.resetLoadIndex == 12){
					self.resetLoadIndex ++;
					self.playlistItemGrad1_img = self.image_img;
				}else if(self.resetLoadIndex == 13){
					self.resetLoadIndex ++;
					self.playlistItemGrad2_img = self.image_img;
				}else if(self.resetLoadIndex == 14){
					self.resetLoadIndex ++;
					self.playlistItemProgress1_img = self.image_img;
				}else if(self.resetLoadIndex == 15){
					self.resetLoadIndex ++;
					self.playlistItemProgress2_img = self.image_img;
				}else if(self.resetLoadIndex == 16){
					self.resetLoadIndex ++;
					self.playlistDownloadButtonN_img = self.image_img;
				}else if(self.resetLoadIndex == 17){
					self.resetLoadIndex ++;
					self.playlistDownloadButtonS_img = self.image_img;
				}else if(self.resetLoadIndex == 18){
					if(self.showPlaylistsButtonAndPlaylists_bl) self.resetLoadIndex = 50;
				}
			}
			
			if(self.showPlaylistsButtonAndPlaylists_bl && self.resetLoadIndex >= 50){	
				if(self.resetLoadIndex == 50){
					self.resetLoadIndex ++;
					self.catBk_img = self.image_img;		
				}else if(self.resetLoadIndex == 51){
					self.resetLoadIndex ++;
					self.catThumbBk_img = self.image_img;
				}else if(self.resetLoadIndex == 52){
					self.resetLoadIndex ++;
					self.catThumbTextBk_img = self.image_img;
				}else if(self.resetLoadIndex == 53){
					self.resetLoadIndex ++;
					self.catNextN_img = self.image_img;
				}else if(self.resetLoadIndex == 54){
					self.resetLoadIndex ++;
					self.catNextS_img = self.image_img;
				}else if(self.resetLoadIndex == 55){
					self.resetLoadIndex ++;
					self.catNextD_img = self.image_img;
				}else if(self.resetLoadIndex == 56){
					self.resetLoadIndex ++;
					self.catPrevN_img = self.image_img;
				}else if(self.resetLoadIndex == 57){
					self.resetLoadIndex ++;
					self.catPrevS_img = self.image_img;
				}else if(self.resetLoadIndex == 58){
					self.resetLoadIndex ++;
					self.catPrevD_img = self.image_img;
				}else if(self.resetLoadIndex == 59){
					self.resetLoadIndex ++;
					self.catCloseN_img = self.image_img;
				}else if(self.resetLoadIndex == 60){
					self.resetLoadIndex ++;
					self.catCloseS_img = self.image_img;
				}
			}
			
			self.countLoadedSkinImages++;
			if(self.countLoadedSkinImages < self.totalGraphics){
				if(FWDUtils.isIEAndLessThen9){
					self.loadImageId_to = setTimeout(self.loadSkin, 16);
				}else{
					self.loadSkin();
				}
			}else{
				setTimeout(function(){
					if(self == null) return;
					self.dispatchEvent(FWDRAPAudioData.SKIN_LOAD_COMPLETE);
				}, 50);
			}
		};
		
		self.onSkinLoadErrorHandler = function(e){
			var message = "The skin icon with label<font color='#FFFFFF'>" + self.skinPaths_ar[self.countLoadedSkinImages] + "</font> can't be loaded, check path!";
			if(window.console) console.log(e);
			var err = {text:message};
			self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, err);
		};
		
		self.stopToLoad = function(){
			clearTimeout(self.loadImageId_to);
			if(self.image_img){
				self.image_img.onload = null;
				self.image_img.onerror = null;
			}
		};
		
		//####################################//
		/* show error if a required property is not defined */
		//####################################//
		self.showPropertyError = function(error){
			self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:"The property called <font color='#FFFFFF'>" + error + "</font> is not defined."});
		};
		
		//##########################################//
		/* Download mp3 */
		//##########################################//
		this.downloadMp3 = function(sourcePath, pName){
			
			if(document.location.protocol == "file:"){
				self.isPlaylistDispatchingError_bl = true;
				showLoadPlaylistErrorId_to = setTimeout(function(){
					self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:"Downloading mp3 files local is not allowed or possible!. To function properly please test online."});
					self.isPlaylistDispatchingError_bl = false;
				}, 50);
				return;
			}
			
			pName = pName.replace(/[^A-Z0-9\-\_\.]+/ig, "_");
			if(!(/\.(mp3)$/i).test(pName)) pName+='.mp3';
		
			if(sourcePath.indexOf("http:") == -1){
				sourcePath = sourcePath.substr(sourcePath.indexOf("/") + 1);
				//sourcePath = sourcePath.substr(sourcePath.indexOf("/") + 1);
				sourcePath = encodeURIComponent(sourcePath);
			};
			
			var url = self.mp3DownloaderPath_str;
			if(!self.dlIframe){
				self.dlIframe = document.createElement("IFRAME");
				self.dlIframe.style.display = "none";
				document.documentElement.appendChild(self.dlIframe);
			}
			
			if(self.isMobile_bl){
			
				var email = self.getValidEmail();
				if(!email) return;
				
				if(self.emailXHR != null){
					try{self.emailXHR.abort();}catch(e){}
					self.emailXHR.onreadystatechange = null;
					self.emailXHR.onerror = null;
					self.emailXHR = null;
				}
				
				self.emailXHR = new XMLHttpRequest();
				
				self.emailXHR.onreadystatechange = function(e){
					if(self.emailXHR.readyState == 4){
						if(self.emailXHR.status == 200){
							if(self.emailXHR.responseText == "sent"){
								alert("Email sent.");
							}else{
								alert("Error sending email, this is a server side error, the php file can't send the email!");
							}
							
						}else{
							alert("Error sending email: " + self.emailXHR.status + ": " + self.emailXHR.statusText);
						}
					}
				};
				
				self.emailXHR.onerror = function(e){
					try{
						if(window.console) console.log(e);
						if(window.console) console.log(e.message);
					}catch(e){};
					alert("Error sending email: " + e.message);
				};

				self.emailXHR.open("get", self.mailPath_str + "?mail=" + email + "&name=" + pName + "&path=" + sourcePath, true);
				self.emailXHR.send();
				return;
			}
		
			if(sourcePath.indexOf("soundcloud.com") != -1){
				self.dlIframe.src = sourcePath;
			}else{
				self.dlIframe.src = url + "?path="+ sourcePath +"&name=" + pName;
			}
		};
		
		this.getValidEmail = function(){
			var email = prompt("Please enter your email address where the mp3 download link will be sent:");
			var emailRegExp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		
			while(!emailRegExp.test(email) || email == ""){
				if(email === null) return;
				email = prompt("Please enter a valid email address:");
			}
			return email;
		};
		
		
		//####################################//
		/* load playlist */
		//####################################//
		this.loadPlaylist = function(id){
			if(self.isPlaylistDispatchingError_bl) return;
			
			clearTimeout(self.dispatchPlaylistLoadCompleteWidthDelayId_to);
			var domIdOrURL = self.cats_ar[id].source;
		
			if(!domIdOrURL){
				self.isPlaylistDispatchingError_bl = true;
				showLoadPlaylistErrorId_to = setTimeout(function(){
					self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:"<font color='#FFFFFF'>loadPlaylist()</font> - Please specify an html elementid, podcast link, soudcloud link or xml path"});
					self.isPlaylistDispatchingError_bl = false;
				}, 50);
				return;
			}
			
			if(!isNaN(domIdOrURL)){
				self.isPlaylistDispatchingError_bl = true;
				showLoadPlaylistErrorId_to = setTimeout(function(){
					self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:"<font color='#FFFFFF'>loadPlaylist()</font> - The parameter must be of type string!"});
					self.isPlaylistDispatchingError_bl = false;
				}, 50);
				return;
			}
			
			if(domIdOrURL.indexOf("soundcloud.com") != -1){
				self.loadSoundCloudList(domIdOrURL);	
			}else if(domIdOrURL.indexOf("official.fm") != -1){
				self.loadOfficialFmList(domIdOrURL);
			}else if(domIdOrURL.indexOf("folder:") != -1){
				self.loadFolderPlaylist(domIdOrURL);
			}else if(domIdOrURL.indexOf(".xml") != -1
			  || domIdOrURL.indexOf("http:") != -1
			  || domIdOrURL.indexOf("https:") != -1
			  || domIdOrURL.indexOf("www.") != -1
			){
				self.loadXMLPlaylist(domIdOrURL);
			}else{
				self.parseDOMPlaylist(domIdOrURL);	
			}
		};
		
		//##########################################//
		/* load soundcloud list */
		//##########################################//
		this.loadSoundCloudList = function(url){
			if(self.isPlaylistDispatchingError_bl) return;
		
			self.closeXHR();
			
			self.sourceURL_str = url;
			var url = "http://api.soundcloud.com/resolve?format=json&url=" + self.sourceURL_str + "&client_id=" + self.scClientId_str + "&callback=" + parent.instanceName_str + ".data.parseSoundCloud";
			
			if(self.scs_el ==  null){
				try{
					self.scs_el = document.createElement('script');
					self.scs_el.src = url;
					self.scs_el.id = parent.instanceName_str + ".data.parseSoundCloud";
					document.documentElement.appendChild(self.scs_el);
				}catch(e){}
			}
			self.JSONPRequestTimeoutId_to = setTimeout(self.JSONPRequestTimeoutError, 8000);
		};
		
		this.JSONPRequestTimeoutError = function(){
			self.isPlaylistDispatchingError_bl = true;
			showLoadPlaylistErrorId_to = setTimeout(function(){
				self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:"Error loading offical.fm url!<font color='#FFFFFF'>" + self.sourceURL_str + "</font>"});
				self.isPlaylistDispatchingError_bl = false;
			}, 50);
			return;
		};
	
		
		//##########################################//
		/* load official fm list */
		//##########################################//
		this.loadOfficialFmList = function(url){
			if(self.isPlaylistDispatchingError_bl) return;
		
			self.closeXHR();
			
			self.sourceURL_str = url;
			var url = "http://api.official.fm/playlists/" + url.substr(url.indexOf("/") + 1) +  "/tracks?format=jsonp&fields=streaming&api_version=2&callback=" + parent.instanceName_str + ".data.parseOfficialFM";
			if(self.scs_el ==  null){
				try{
					self.scs_el = document.createElement('script');
					self.scs_el.src = url;
					self.scs_el.id = parent.instanceName_str + ".data.parseOfficialFM";
					document.documentElement.appendChild(self.scs_el);
				}catch(e){}
			}
			self.JSONPRequestTimeoutId_to = setTimeout(self.JSONPRequestTimeoutError, 8000);
		};
		
		this.JSONPRequestTimeoutError = function(){
			self.isPlaylistDispatchingError_bl = true;
			showLoadPlaylistErrorId_to = setTimeout(function(){
				self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:"Error loading soundcloud url!<font color='#FFFFFF'>" + self.sourceURL_str + "</font>"});
				self.isPlaylistDispatchingError_bl = false;
			}, 50);
			return;
		};
		
		this.closeJsonPLoader = function(){
			clearTimeout(self.JSONPRequestTimeoutId_to);
		};
		
		//#######################################//
		/* load XML playlist (warning this will will work only online on a web server,
		 *  it is not working local!) */
		//######################################//
		this.loadXMLPlaylist = function(url){
			if(self.isPlaylistDispatchingError_bl) return;
			
			if(document.location.protocol == "file:" && url.indexOf("official.fm") == -1){
				self.isPlaylistDispatchingError_bl = true;
				showLoadPlaylistErrorId_to = setTimeout(function(){
					self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:"Loading XML files local is not allowed or possible!. To function properly please test online."});
					self.isPlaylistDispatchingError_bl = false;
				}, 50);
				return;
			}
			
			self.closeXHR();
			self.loadFromFolder_bl = false;
			self.sourceURL_str = url;
			self.xhr = new XMLHttpRequest();
			self.xhr.onreadystatechange = self.ajaxOnLoadHandler;
			self.xhr.onerror = self.ajaxOnErrorHandler;
			
			try{
				self.xhr.open("get", self.proxyPath_str + "?url=" +  self.sourceURL_str + "&rand=" + parseInt(Math.random() * 99999999), true);
				self.xhr.send();
			}catch(e){
				var message = e;
				if(e){if(e.message)message = e.message;}
				self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:"XML file can't be loaded! <font color='#FFFFFF'>" + self.sourceURL_str + "</font>. " + message });
			}
		};
		
		//#######################################//
		/* load folder1 */
		//######################################//
		this.loadFolderPlaylist = function(url){
			if(self.isPlaylistDispatchingError_bl) return;
			
			if(document.location.protocol == "file:" && url.indexOf("official.fm") == -1){
				self.isPlaylistDispatchingError_bl = true;
				showLoadPlaylistErrorId_to = setTimeout(function(){
					self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:"Creating a mp3 playlist from a folder is not allowed or possible local! To function properly please test online."});
					self.isPlaylistDispatchingError_bl = false;
				}, 50);
				return;
			}	
			
			self.closeXHR();
			self.loadFromFolder_bl = true;
			self.countID3 = 0;
			self.sourceURL_str = url.substr(url.indexOf(":") + 1);
			self.xhr = new XMLHttpRequest();
			self.xhr.onreadystatechange = self.ajaxOnLoadHandler;
			self.xhr.onerror = self.ajaxOnErrorHandler;
			
			try{
				self.xhr.open("get", self.proxyFolderPath_str + "?dir=" +  encodeURIComponent(self.sourceURL_str) + "&rand=" + parseInt(Math.random() * 9999999), true);
				self.xhr.send();
			}catch(e){
				var message = e;
				if(e){if(e.message)message = e.message;}
				self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:"Folder proxy file path is not found: <font color='#FFFFFF'>" + self.proxyFolderPath_str + "</font>"});
			}
		};

		this.ajaxOnLoadHandler = function(e){
			var response;
			var isXML = false;
			
			if(self.xhr.readyState == 4){
				if(self.xhr.status == 404){
					if(self.loadFromFolder_bl){
						self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:"Folder proxy file path is not found: <font color='#FFFFFF'>" + self.proxyFolderPath_str + "</font>"});
					}else{
						self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:"Proxy file path is not found: <font color='#FFFFFF'>" + self.proxyPath_str + "</font>"});
					}
					
				}else if(self.xhr.status == 408){
					self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:"Proxy file request load timeout!"});
				}else if(self.xhr.status == 200){
					//console.log(self.xhr.responseText)
					
					if(self.xhr.responseText.indexOf("<b>Warning</b>:") != -1){
						self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:"Error loading folder: <font color='#FFFFFF'>" + self.sourceURL_str + "</font>. Make sure that the folder path is correct!"});
						return;
					}
					
					if(window.JSON){
						response = JSON.parse(self.xhr.responseText);
					}else{
						response = eval('('+ self.xhr.responseText +')');
					}
					
					if(response.channel){
						self.parsePodcast(response);
					}else if(response.folder){
						self.parseFolderJSON(response);
					}else if(response.li){
						self.parseXML(response);
					}else if(response.error){//this applies only with proxy (xml and poscast)
						self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:"Error loading file: <font color='#FFFFFF'>" + self.sourceURL_str + "</font>. Make sure the file path (xml or podcast) is correct and well formatted!"});
					}
				}
			}
		};
		
		this.ajaxOnErrorHandler = function(e){
			try{
				if(window.console) console.log(e);
				if(window.console) console.log(e.message);
			}catch(e){};
			if(self.loadFromFolder_bl){
				self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:"Error loading file : <font color='#FFFFFF'>" + self.proxyFolderPath_str + "</font>. Make sure the path is correct"});
			}else{
				self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:"Error loading file : <font color='#FFFFFF'>" + self.proxyPath_str + "</font>. Make sure the path is correct"});
			}
		};
		
		//#####################################//
		/* Parse soundcloud JSON */
		//####################################//
		this.parseSoundCloud = function(object){
			self.closeJsonPLoader();
			self.playlist_ar = [];
			var obj;
			var track;
		
			if(object.kind == "playlist"){
				for(var i=0; i<object.tracks.length; i++){
					track = object.tracks[i];
					obj = {};
					obj.source = track["stream_url"] + "?consumer_key=" + self.scClientId_str;
					obj.downloadPath = track["downloadable"] == true ? track["download_url"] + "?consumer_key=" + self.scClientId_str : undefined;
					obj.downloadable = track["downloadable"];
					obj.thumbPath = track["artwork_url"];
					if(self.showSoundCloudUserNameInTitle_bl){
						obj.title = "<span style='font-weight:bold;'>" + track["user"]["username"] + "</span>" + " - " + track["title"];
						obj.titleText = track["user"]["username"] + " - " + track["title"];
					}else{
						obj.title = track["title"];
						obj.titleText = track["title"];
					}
					
					obj.duration = track["duration"];
					if(track["streamable"]) self.playlist_ar.push(obj);
					if(i > self.maxPlaylistItems - 1) break;
				}
			}else if(object.kind == "track"){
				track = object;
				obj = {};
				obj.source = track["stream_url"] + "?consumer_key=" + self.scClientId_str;
				if(obj.source == undefined)  obj.source = track["uri"] + "/stream" + "?consumer_key=" + self.scClientId_str;
				obj.downloadPath = track["downloadable"] == true ? track["download_url"] + "?consumer_key=" + self.scClientId_str : undefined;
				obj.thumbPath = track["artwork_url"];
				if(self.showSoundCloudUserNameInTitle_bl){
					obj.title = "<span style='font-weight:bold;'>" + track["user"]["username"] + "</span>" + " - " + track["title"];
					obj.titleText = track["user"]["username"] + " - " + track["title"];
				}else{
					obj.title = track["title"];
					obj.titleText = track["title"];
				}
				obj.duration = track["duration"];
				self.playlist_ar[0] = obj;
			}else{
				self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:"Please provide a playlist or track URL : <font color='#FFFFFF'>" + self.sourceURL_str + "</font>."});
			}
			
			clearTimeout(self.dispatchPlaylistLoadCompleteWidthDelayId_to);
			self.dispatchPlaylistLoadCompleteWidthDelayId_to = setTimeout(function(){
				self.dispatchEvent(FWDRAPAudioData.PLAYLIST_LOAD_COMPLETE);
			}, 50);
			
			self.isDataLoaded_bl = true;
		};
		
		
		//#####################################//
		/* Parse official FM */
		//#####################################//
		this.parseOfficialFM = function(object){
			self.closeJsonPLoader();
			self.playlist_ar = [];
			var obj;
			var track;
			var obj_ar = object.tracks;
			var thumbPath = undefined;
			
			for(var i=0; i<obj_ar.length; i++){
				track = object.tracks[i].track;
				obj = {};
				obj.source = encodeURI(track.streaming.http);
				obj.downloadPath = obj.source;
				obj.downloadable = self.showDownloadMp3Button_bl;
				if(self.forceDisableDownloadButtonForOfficialFM_bl) obj.downloadable = false; 
				obj.thumbPath = thumbPath;
				obj.title = "<span style='font-weight:bold;'>" + track["artist"] + "</span>" + " - " + track["title"];
				obj.titleText = track["artist"] + " - " + track["title"];
				obj.duration = track.duration * 1000;
				self.playlist_ar[i] = obj;
				if(i > self.maxPlaylistItems - 1) break;
			}
			
			clearTimeout(self.dispatchPlaylistLoadCompleteWidthDelayId_to);
			self.dispatchPlaylistLoadCompleteWidthDelayId_to = setTimeout(function(){
				self.dispatchEvent(FWDRAPAudioData.PLAYLIST_LOAD_COMPLETE);
			}, 50);
		
			self.isDataLoaded_bl = true;	
		};
		
		//####################################//
		/* parse podcast JSON */
		//####################################//
		this.parsePodcast = function(response){
			self.playlist_ar = [];
			var obj;
			var obj_ar = response.channel.item;
			var thumbPath = undefined;
			try{thumbPath = response["channel"]["image"]["url"];}catch(e){}
			
			for(var i=0; i<obj_ar.length; i++){
				obj = {};
				obj.source = encodeURI(obj_ar[i]["enclosure"]["@attributes"]["url"]);
				obj.downloadPath = obj.source;
				obj.downloadable = self.showDownloadMp3Button_bl;
				if(self.forceDisableDownloadButtonForPodcast_bl) obj.downloadable = false;
				obj.thumbPath = thumbPath;
				obj.title = obj_ar[i].title;
				obj.titleText = obj_ar[i].title;
				obj.duration = undefined;
				self.playlist_ar[i] = obj;
				if(i > self.maxPlaylistItems - 1) break;
			}
			
			clearTimeout(self.dispatchPlaylistLoadCompleteWidthDelayId_to);
			self.dispatchPlaylistLoadCompleteWidthDelayId_to = setTimeout(function(){
				self.dispatchEvent(FWDRAPAudioData.PLAYLIST_LOAD_COMPLETE);
			}, 50);
		
			self.isDataLoaded_bl = true;
		};
		
		//####################################//
		/* parse xml JSON */
		//####################################//
		this.parseXML = function(response){
			self.playlist_ar = [];
			var obj;
			var obj_ar = response.li;
			
		
			for(var i=0; i<obj_ar.length; i++){
				obj = {};
				obj.source = encodeURI(obj_ar[i]["@attributes"]["data-path"]);
				obj.downloadPath = obj.source;
				obj.downloadable = obj_ar[i]["@attributes"]["data-downloadable"] == "yes" ? true : false;
				obj.thumbPath = obj_ar[i]["@attributes"]["data-thumbpath"];
				obj.title = obj_ar[i]["@attributes"]["data-title"];
				obj.titleText = obj_ar[i]["@attributes"]["data-title"];
				obj.duration = obj_ar[i]["@attributes"]["data-duration"];
				self.playlist_ar[i] = obj;
				if(i > self.maxPlaylistItems - 1) break;
			}
		
			clearTimeout(self.dispatchPlaylistLoadCompleteWidthDelayId_to);
			self.dispatchPlaylistLoadCompleteWidthDelayId_to = setTimeout(function(){
				self.dispatchEvent(FWDRAPAudioData.PLAYLIST_LOAD_COMPLETE);
			}, 50);
			
			self.isDataLoaded_bl = true;
		};
		
		
		
		//####################################//
		/* parse folder JSON */
		//####################################//
		this.parseFolderJSON = function(response){
			self.playlist_ar = [];
			var obj;
			var obj_ar = response.folder;
			var counter = 0;
		
			for(var i=0; i<obj_ar.length; i++){
				obj = {};
				obj.source = encodeURI(obj_ar[i]["@attributes"]["data-path"]);
				obj.downloadPath = obj.source;
				obj.downloadable = self.showDownloadMp3Button_bl;
				if(self.forceDisableDownloadButtonForFolder_bl) obj.downloadable = false;
				obj.thumbPath = obj_ar[i]["@attributes"]["data-thumbpath"];
				obj.title = obj_ar[i]["@attributes"]["data-title"];
				obj.titleText = obj_ar[i]["@attributes"]["data-title"];
				self.playlist_ar[i] = obj;
				if(i > self.maxPlaylistItems - 1) break;
			}
			
			function loadID3(){	
				
				var url = self.playlist_ar[self.countID3].source + "?rand=" + parseInt(Math.random() * 99999999);
				obj = self.playlist_ar[self.countID3];
				
				ID3.loadTags(url, function() {
					var tags = ID3.getAllTags(url);
					if(tags.artist){
						obj.title = tags.artist + " - " +  tags.title;
						obj.titleText = obj.title;
					}
				    self.countID3 ++;
						
					if(self.countID3 == self.playlist_ar.length){
						done();
					}else if(self.countID3 == 2001){
						return;
					}else{
						loadID3();
					}
				});
			}
			
			if(FWDUtils.isIEAndLessThen10){
				done();
			}else{
				loadID3();
			}
			
			function done(){
				clearTimeout(self.dispatchPlaylistLoadCompleteWidthDelayId_to);
				self.dispatchPlaylistLoadCompleteWidthDelayId_to = setTimeout(function(){
					self.dispatchEvent(FWDRAPAudioData.PLAYLIST_LOAD_COMPLETE);
				}, 50);
				
				self.isDataLoaded_bl = true;
			}
		};
		
		//##########################################//
		/* parse DOM playlist */
		//##########################################//
		this.parseDOMPlaylist = function(idOrObject){
			if(self.isPlaylistDispatchingError_bl) return;
			var root_el;
			
			self.closeXHR();
			
			root_el = document.getElementById(idOrObject);
			if(!root_el){
				self.isPlaylistDispatchingError_bl = true;
				showLoadPlaylistErrorId_to = setTimeout(function(){
					self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:"The playlist with id <font color='#FFFFFF'>" + idOrObject + "</font> is not found in the DOM."});
					self.isPlaylistDispatchingError_bl = false;
				}, 50);
				return;
			}
			
			var children_ar = FWDUtils.getChildren(root_el);
			var totalChildren = children_ar.length;
			var child;
			self.playlist_ar = [];
			
			for(var i=0; i<totalChildren; i++){
				var obj = {};
				child = children_ar[i];
				
				if(!FWDUtils.hasAttribute(child, "data-path")){
					self.isPlaylistDispatchingError_bl = true;
					showLoadPlaylistErrorId_to = setTimeout(function(){
						self.dispatchEvent(FWDRAPAudioData.LOAD_ERROR, {text:"Attribute <font color='#FFFFFF'>data-path</font> is required in the playlist at position <font color='#FFFFFF'>" + (i + 1)});
					}, 50);
					return;
				}
				
				if(i > self.maxPlaylistItems - 1) break;
				
				obj.source = encodeURI(FWDUtils.getAttributeValue(child, "data-path"));
				obj.downloadPath = obj.source;
				
				if(FWDUtils.hasAttribute(child, "data-thumbpath")){
					obj.thumbPath = FWDUtils.getAttributeValue(child, "data-thumbpath");
				}else{
					obj.thumbPath = undefined;
				}
				
				if(FWDUtils.hasAttribute(child, "data-downloadable")){
					obj.downloadable = FWDUtils.getAttributeValue(child, "data-downloadable") == "yes" ? true : false;
				}else{
					obj.downloadable = undefined;
				}
				
				obj.title = "not defined!";
				try{obj.title = FWDUtils.getChildren(child)[0].innerHTML;}catch(e){};
				try{obj.titleText = FWDUtils.getChildren(child)[0].textContent || FWDUtils.getChildren(child)[0].innerText;}catch(e){};
				
				if(FWDUtils.hasAttribute(child, "data-duration")){
					obj.duration = FWDUtils.getAttributeValue(child, "data-duration");
				}else{
					obj.duration = undefined;
				}
				
				self.playlist_ar[i] = obj;
			}
					
			clearTimeout(self.dispatchPlaylistLoadCompleteWidthDelayId_to);
			self.dispatchPlaylistLoadCompleteWidthDelayId_to = setTimeout(function(){
				self.dispatchEvent(FWDRAPAudioData.PLAYLIST_LOAD_COMPLETE);
			}, 50);
	
			self.isDataLoaded_bl = true;
		};
		
		//####################################//
		/* close xhr */
		//####################################//
		this.closeXHR = function(){
			self.closeJsonPLoader();
			try{
				document.documentElement.removeChild(self.scs_el);
				self.scs_el = null;
			}catch(e){}
			
			if(self.xhr != null){
				try{self.xhr.abort();}catch(e){}
				self.xhr.onreadystatechange = null;
				self.xhr.onerror = null;
				self.xhr = null;
			}
			self.countID3 = 2000;
		};
		
		this.closeData = function(){
			self.closeXHR();
			clearTimeout(self.loadImageId_to);
			clearTimeout(self.showLoadPlaylistErrorId_to);
			clearTimeout(self.dispatchPlaylistLoadCompleteWidthDelayId_to);
			clearTimeout(self.loadImageId_to);
			clearTimeout(self.loadPreloaderId_to);
			if(self.image_img){
				self.image_img.onload = null;
				self.image_img.onerror = null;
			}
		};
	
		self.init();
	};
	
	/* set prototype */
	FWDRAPAudioData.setPrototype = function(){
		FWDRAPAudioData.prototype = new FWDEventDispatcher();
	};
	
	FWDRAPAudioData.prototype = null;
	
	FWDRAPAudioData.PRELOADER_LOAD_DONE = "onPreloaderLoadDone";
	FWDRAPAudioData.LOAD_DONE = "onLoadDone";
	FWDRAPAudioData.LOAD_ERROR = "onLoadError";
	FWDRAPAudioData.IMAGE_LOADED = "onImageLoaded";
	FWDRAPAudioData.SKIN_LOAD_COMPLETE = "onSkinLoadComplete";
	FWDRAPAudioData.SKIN_PROGRESS = "onSkinProgress";
	FWDRAPAudioData.IMAGES_PROGRESS = "onImagesPogress";
	FWDRAPAudioData.PLAYLIST_LOAD_COMPLETE = "onPlaylistLoadComplete";
	
	window.FWDRAPAudioData = FWDRAPAudioData;
}(window));