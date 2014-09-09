/* FWDRAPPlaylistItem */
(function(){
var FWDRAPPlaylistItem = function(
			title_str,
			playlistDownloadButtonN_img,
			playlistDownloadButtonS_img,
			playlistItemGrad1_img,
			playlistItemProgress_img,
			playlistPlayButtonN_img,
			playlistItemBk1Path_str,
			playlistItemBk2Path_str,
			playlistPlayButtonN_str,
			playlistPlayButtonS_str,
			playlistPauseButtonN_str,
			playlistPauseButtonS_str,
			titleNormalColor_str,
			trackTitleSelected_str,
			durationColor_str,
			id,
			playPauseButtonOffsetLeftAndRight,
			trackTitleOffsetLeft,
			durationOffsetRight,
			downloadButtonOffsetRight,
			showPlayPauseButton,
			showDownloadButton,
			showDuration
		){
		
		var self = this;
		var prototype = FWDRAPPlaylistItem.prototype;
		
		this.playlistItemGrad1_img = playlistItemGrad1_img;
		this.playlistItemProgress_img = playlistItemProgress_img;
		this.playlistPlayButtonN_img = playlistPlayButtonN_img;
		this.playlistDownloadButtonN_img = playlistDownloadButtonN_img;
		this.playlistDownloadButtonS_img = playlistDownloadButtonS_img;
		
		this.progress_do = null;
		this.playPause_do = null;
		this.playN_do = null;
		this.playS_do = null;
		this.pauseN_do = null;
		this.pauseS_do = null;
		this.titleText_do = null;
		this.grad_do = null;
		this.durationText_do = null;
		this.dumy_do = null;
		
		this.title_str = title_str;
		this.playlistItemBk1Path_str = playlistItemBk1Path_str;
		this.playlistItemBk2Path_str = playlistItemBk2Path_str;
		this.playlistPlayButtonN_str = playlistPlayButtonN_str;
		this.playlistPlayButtonS_str = playlistPlayButtonS_str;
		this.playlistPauseButtonN_str = playlistPauseButtonN_str;
		this.playlistPauseButtonS_str = playlistPauseButtonS_str;
		this.titleNormalColor_str = titleNormalColor_str;
		this.trackTitleSelected_str = trackTitleSelected_str;
		this.durationColor_str = durationColor_str;
	
		this.itemHeight = self.playlistItemGrad1_img.height;
		this.id = id;
		this.playPauseButtonOffsetLeftAndRight = playPauseButtonOffsetLeftAndRight;
		this.trackTitleOffsetLeft = trackTitleOffsetLeft;
		this.duration = showDuration;
		this.durationOffsetRight = durationOffsetRight;
		this.textHeight;
		this.durationWidth = 0;
		this.titleWidth = 0;
		this.playPauseButtonWidth = self.playlistPlayButtonN_img.width;
		this.playPauseButtonHeight = self.playlistPlayButtonN_img.height;
		this.progressPercent = 0;
		this.stageWidth = 0;
		this.downloadButtonOffsetRight = downloadButtonOffsetRight;
	
		this.setTextsSizeId_to;
		
		this.showDownloadButton_bl = showDownloadButton;
		this.showPlayPauseButton_bl = showPlayPauseButton;
		this.showDuration_bl = showDuration;
		this.isActive_bl = false;
		this.isSelected_bl = false;
		this.isMobile_bl = FWDUtils.isMobile;
		this.hasPointerEvent_bl = FWDUtils.hasPointerEvent;

		//##########################################//
		/* initialize this */
		//##########################################//
		self.init = function(){
			
			if(self.id % 2 == 0){
				self.getStyle().background = "url('" + self.playlistItemBk1Path_str + "')";
			}else{
				self.getStyle().background = "url('" + self.playlistItemBk2Path_str + "')";
			}
			
			self.setupProgress();
			
			self.setupTitle();
			if(self.showPlayPauseButton_bl) self.setupPlayPauseButton();
			self.setupGrad();
			if(self.showDuration_bl) self.setupDuration();
			self.setNormalState(false, true);
			self.setupDumy();
			if(self.showDownloadButton_bl) self.setupDownloadButton();
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.dumy_do.screen.addEventListener("MSPointerUp", self.onMouseUp);
					self.dumy_do.screen.addEventListener("MSPointerOver", self.onMouseOver);
					self.dumy_do.screen.addEventListener("MSPointerOut", self.onMouseOut);
				}else{
					self.dumy_do.screen.addEventListener("mouseup", self.onMouseUp);
				}
			}else if(self.dumy_do.screen.addEventListener){	
				self.dumy_do.screen.addEventListener("mouseover", self.onMouseOver);
				self.dumy_do.screen.addEventListener("mouseout", self.onMouseOut);
				self.dumy_do.screen.addEventListener("mouseup", self.onMouseUp);
			}else if(self.screen.attachEvent){
				self.dumy_do.screen.attachEvent("onmouseover", self.onMouseOver);
				self.dumy_do.screen.attachEvent("onmouseout", self.onMouseOut);
				self.dumy_do.screen.attachEvent("onmouseup", self.onMouseUp);
			}
		};
		
		self.onMouseOver = function(e, animate){
			if(self.isActive_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				self.setSelectedState(true);
			}
		};
			
		self.onMouseOut = function(e){
			if(self.isActive_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				self.setNormalState(true);
			}
		};
		
		self.onMouseUp = function(e){
			if(e.button == 2) return;
			if(e.preventDefault) e.preventDefault();
			self.dispatchEvent(FWDRAPPlaylistItem.MOUSE_UP, {id:self.id});
		};
		
		//###########################################//
		// Resize and position self...
		//###########################################//
		self.resize = function(width, height){
			if(FWDUtils.isIEAndLessThen9 && !self.textHeight) return;
			self.stageWidth = width;
			
			var yPos = parseInt((height - self.textHeight)/2) + 1;
			
			if(self.playPause_do){
				self.titleText_do.setX(self.playPauseButtonOffsetLeftAndRight * 2 + self.playPause_do.w + self.trackTitleOffsetLeft);
				self.playPause_do.setY(parseInt((height - self.playPause_do.h)/2));
			}else{
				self.titleText_do.setX(self.trackTitleOffsetLeft);
			}
			
			self.titleText_do.setY(yPos);
			
			if(self.durationText_do && self.downloadButton_do){
				
				self.durationText_do.setX(width - self.durationWidth - self.durationOffsetRight + 1);
				self.durationText_do.setY(yPos);
				
				self.downloadButton_do.setX(self.durationText_do.x - self.downloadButton_do.w - self.downloadButtonOffsetRight + 2);
				self.downloadButton_do.setY(parseInt((height - self.downloadButton_do.h)/2));
			
				if(self.titleText_do.x + self.titleWidth + self.downloadButton_do.w + self.downloadButtonOffsetRight > self.durationText_do.x){
					self.grad_do.setX(self.downloadButton_do.x - self.downloadButtonOffsetRight + 2);
				}else{
					self.grad_do.setX(-300);
				}
			}else if(self.durationText_do){
				self.durationText_do.setX(width - self.durationWidth - self.durationOffsetRight + 1);
				self.durationText_do.setY(yPos);
				if(self.titleText_do.x + self.titleWidth > self.durationText_do.x){
					self.grad_do.setX(self.durationText_do.x - self.durationOffsetRight + 2);
				}else{
					self.grad_do.setX(-300);
				}
			}else if(self.downloadButton_do){
				self.downloadButton_do.setX(width - self.downloadButton_do.w - self.downloadButtonOffsetRight + 2);
				if(self.titleText_do.x + self.titleWidth > self.downloadButton_do.x){
					self.grad_do.setX(self.downloadButton_do.x - self.downloadButtonOffsetRight + 2);
				}else{
					self.grad_do.setX(-300);
				}
				self.downloadButton_do.setY(parseInt((height - self.downloadButton_do.h)/2));
			}else{
				if(self.titleText_do.x + self.titleWidth >  width - 10){
					self.grad_do.setX(width - 10);
				}else{
					self.grad_do.setX(-300);
				}
				
			}
			
			self.dumy_do.setWidth(width);
			self.dumy_do.setHeight(height);
			self.setWidth(width);
			self.setHeight(height);
		};
		
		//###########################################//
		/* setup download button */
		//###########################################//
		this.setupDownloadButton = function(){
			FWDRAPSimpleSizeButton.setPrototype();
			self.downloadButton_do = new FWDRAPSimpleSizeButton(
					self.playlistDownloadButtonN_img.src,
					self.playlistDownloadButtonS_img.src,
					self.playlistDownloadButtonN_img.width,
					self.playlistDownloadButtonS_img.height
				);
			
			self.downloadButton_do.addListener(FWDRAPSimpleSizeButton.CLICK, self.dwButtonClickHandler);
			self.addChild(self.downloadButton_do);
		};
		
		this.dwButtonClickHandler = function(){
			self.dispatchEvent(FWDRAPPlaylistItem.DOWNLOAD, {id:self.id});
		};
		
		//###########################################//
		/* setup progress */
		//###########################################//
		this.setupProgress = function(){
			self.progress_do = new FWDDisplayObject("div");
			self.progress_do.setBackfaceVisibility();
			self.progress_do.getStyle().background = "url('" + self.playlistItemProgress_img.src + "')";
			self.progress_do.setHeight(playlistItemProgress_img.height);
			self.addChild(self.progress_do);
		};
		
		this.updateProgressPercent = function(percent){
			if(self == null) return;
			if(self.progressPercent == percent) return;
			self.progressPercent = percent;
			self.progress_do.setWidth(parseInt(self.stageWidth * percent));	
		};
		
		//###########################################//
		/* setup play/pause button */
		//###########################################//
		this.setupPlayPauseButton = function(){
			self.playPause_do = new FWDDisplayObject("div");
			self.playPause_do.setWidth(self.playPauseButtonWidth);
			self.playPause_do.setHeight(self.playPauseButtonHeight);
			
			self.playN_do = new FWDDisplayObject("div");	
			self.playN_do.getStyle().background = "url('" + self.playlistPlayButtonN_str + "') no-repeat";
			self.playN_do.setWidth(self.playPauseButtonWidth);
			self.playN_do.setHeight(self.playPauseButtonHeight);
			
			self.playS_do = new FWDDisplayObject("div");	
			self.playS_do.getStyle().background = "url('" + self.playlistPlayButtonS_str + "') no-repeat";
			self.playS_do.setWidth(self.playPauseButtonWidth);
			self.playS_do.setHeight(self.playPauseButtonHeight);
			self.playS_do.setAlpha(0);
			
			self.pauseN_do = new FWDDisplayObject("div");	
			self.pauseN_do.getStyle().background = "url('" + self.playlistPauseButtonN_str + "') no-repeat";
			self.pauseN_do.setWidth(self.playPauseButtonWidth);
			self.pauseN_do.setHeight(self.playPauseButtonHeight);
			self.pauseN_do.setX(-300);
			
			self.pauseS_do = new FWDDisplayObject("div");	
			self.pauseS_do.getStyle().background = "url('" + self.playlistPauseButtonS_str + "') no-repeat";
			self.pauseS_do.setWidth(self.playPauseButtonWidth);
			self.pauseS_do.setHeight(self.playPauseButtonHeight);
			self.pauseS_do.setX(-300);
			self.pauseS_do.setAlpha(0);
			
			self.playPause_do.setX(self.playPauseButtonOffsetLeftAndRight);
			
			self.playPause_do.addChild(self.playN_do);
			self.playPause_do.addChild(self.playS_do);
			self.playPause_do.addChild(self.pauseN_do);
			self.playPause_do.addChild(self.pauseS_do);
			self.addChild(self.playPause_do);
		};
		
		//###########################################//
		/* setup title */
		//###########################################//
		this.setupTitle = function(){
			self.titleText_do = new FWDDisplayObject("div");
			if(FWDUtils.isApple){
				self.titleText_do.hasTransform3d_bl = false;
				self.titleText_do.hasTransform2d_bl = false;
			}
			self.titleText_do.setOverflow("visible");
			self.titleText_do.setBackfaceVisibility();
			
			self.titleText_do.getStyle().fontFamily = "Arial";
			self.titleText_do.getStyle().fontSize= "12px";
			self.titleText_do.getStyle().whiteSpace= "nowrap";
			self.titleText_do.getStyle().textAlign = "left";
			self.titleText_do.getStyle().fontSmoothing = "antialiased";
			self.titleText_do.getStyle().webkitFontSmoothing = "antialiased";
			self.titleText_do.getStyle().textRendering = "optimizeLegibility";
			self.titleText_do.setInnerHTML(self.title_str);
			self.addChild(self.titleText_do);
		};
		
		this.setTextSizes = function(){
			if(self.textHeight) return;
			
			self.titleWidth = self.titleText_do.screen.offsetWidth;
			self.textHeight = self.titleText_do.screen.offsetHeight;
			if(self.durationText_do){
				self.durationWidth = self.durationText_do.screen.offsetWidth;
			}
			self.grad_do.setWidth(150);
		};
		

		//##########################################//
		/* Setup grad */
		//##########################################//
		this.setupGrad = function(){
			self.grad_do = new FWDDisplayObject("div");
			self.grad_do.setOverflow("visible");
			if(FWDUtils.isApple){
				self.grad_do.hasTransform3d_bl = false;
				self.grad_do.hasTransform2d_bl = false;
			}
			self.grad_do.setBackfaceVisibility();
			self.grad_do.getStyle().background = "url('" + self.playlistItemGrad1_img.src + "')";
			self.grad_do.setHeight(self.itemHeight);
			self.addChild(self.grad_do);
		};
		
		//###########################################//
		/* setup duration */
		//###########################################//
		this.setupDuration = function(){
			self.durationText_do = new FWDDisplayObject("div");
			if(FWDUtils.isApple){
				self.durationText_do.hasTransform3d_bl = false;
				self.durationText_do.hasTransform2d_bl = false;
			}
			self.durationText_do.setOverflow("visible");
			self.durationText_do.setBackfaceVisibility();
			self.durationText_do.getStyle().fontFamily = "Arial";
			self.durationText_do.getStyle().fontSize= "12px";
			self.durationText_do.getStyle().whiteSpace= "nowrap";
			self.durationText_do.getStyle().textAlign = "left";
			self.durationText_do.getStyle().color = self.titleColor_str;
			self.durationText_do.getStyle().fontSmoothing = "antialiased";
			self.durationText_do.getStyle().webkitFontSmoothing = "antialiased";
			self.durationText_do.getStyle().textRendering = "optimizeLegibility";
			self.durationText_do.getStyle().color = self.durationColor_str;
			self.durationText_do.setInnerHTML(self.duration);
			self.addChild(self.durationText_do);
		};
		
		//###########################################//
		/* setup dummy */
		//###########################################//
		this.setupDumy = function(){
			self.dumy_do = new FWDDisplayObject("div");
			self.dumy_do.setButtonMode(true);
			if(FWDUtils.isIE){
				self.dumy_do.setBkColor("#FFFFFF");
				self.dumy_do.setAlpha(.001);
			}
			self.addChild(self.dumy_do);
		};
		
		//##############################//
		/* set normal/selected state*/
		//##############################//
		this.setNormalState = function(animate, overwrite){
			if(!self.isSelected_bl && !overwrite) return;
			self.isSelected_bl = false;
			if(animate){
				TweenMax.to(self.titleText_do.screen, .8, {css:{color:self.titleNormalColor_str}, ease:Expo.easeOut});
				if(self.durationText_do){
					TweenMax.to(self.durationText_do.screen, .8, {css:{color:self.durationColor_str}, ease:Expo.easeOut});
				}
				if(self.playPause_do){
					TweenMax.to(self.pauseS_do, .8, {alpha:0, ease:Expo.easeOut});
					TweenMax.to(self.playS_do, .8, {alpha:0, ease:Expo.easeOut});
				}
			}else{
				TweenMax.killTweensOf(self.titleText_do);
				self.titleText_do.getStyle().color = self.titleNormalColor_str;
				if(self.durationText_do) self.durationText_do.getStyle().color = self.durationColor_str;
				if(self.playPause_do){
					TweenMax.killTweensOf(self.pauseS_do);
					TweenMax.killTweensOf(self.playS_do);
					self.pauseS_do.setAlpha(0);
					self.playS_do.setAlpha(0);
				}
			}
		};
		
		this.setSelectedState = function(animate){
			if(self.isSelected_bl) return;
			self.isSelected_bl = true;
			
			if(animate){
				TweenMax.to(self.titleText_do.screen, .8, {css:{color:self.trackTitleSelected_str}, ease:Expo.easeOut});
				if(self.durationText_do){
					TweenMax.to(self.durationText_do.screen, .8, {css:{color:self.trackTitleSelected_str}, ease:Expo.easeOut});
				}
				if(self.playPause_do){
					TweenMax.to(self.pauseS_do, .8, {alpha:1, ease:Expo.easeOut});
					TweenMax.to(self.playS_do, .8, {alpha:1, ease:Expo.easeOut});
				}
			}else{
				TweenMax.killTweensOf(self.titleText_do);
				if(self.durationText_do) self.durationText_do.getStyle().color = self.trackTitleSelected_str;
				self.titleText_do.getStyle().color = self.trackTitleSelected_str;
				if(self.playPause_do){
					TweenMax.killTweensOf(self.pauseS_do);
					TweenMax.killTweensOf(self.playS_do);
					self.pauseS_do.setAlpha(1);
					self.playS_do.setAlpha(1);
				}
			}
		};
		
		//##############################//
		/* set active/deactive states */
		//##############################//
		this.setActive = function(){
			if(self.isActive_bl) return;
			self.isActive_bl = true;
			self.setSelectedState(true);
		};
		
		this.setInActive = function(){
			if(!self.isActive_bl) return;
			self.isActive_bl = false;
			self.setNormalState(true);
			self.updateProgressPercent(0);
			self.showPlayButton();
		};
		
		//##############################//
		/* show pause / play button */
		//##############################//
		this.showPlayButton = function(){
			if(!self.playN_do) return;
			self.playN_do.setX(0);
			self.playS_do.setX(0);
			self.pauseN_do.setX(-300);
			self.pauseS_do.setX(-300);
		};
		
		this.showPauseButton = function(){
			if(!self.playN_do) return;
			self.playN_do.setX(-300);
			self.playS_do.setX(-300);
			self.pauseN_do.setX(0);
			self.pauseS_do.setX(0);
		};
	
		this.init();
	};
	
	/* set prototype */
	FWDRAPPlaylistItem.setPrototype = function(){
		FWDRAPPlaylistItem.prototype = new FWDDisplayObject("div");
	};
	
	FWDRAPPlaylistItem.PLAY = "play";
	FWDRAPPlaylistItem.PAUSE = "pause";
	FWDRAPPlaylistItem.MOUSE_UP = "mouseUp";
	FWDRAPPlaylistItem.DOWNLOAD = "download";

	
	FWDRAPPlaylistItem.prototype = null;
	window.FWDRAPPlaylistItem = FWDRAPPlaylistItem;
	
}());