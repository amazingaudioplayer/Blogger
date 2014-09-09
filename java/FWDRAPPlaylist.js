/* FWDRAPPlaylist */
(function(){
	var FWDRAPPlaylist = function(
			data,
			parent
		){
		
		var self = this;
		var prototype = FWDRAPPlaylist.prototype;
		
		this.playlist_ar = null;
		this.items_ar = null;
		
		this.playlistItemBk1_img = data.playlistItemBk1_img;
		this.playlistItemBk2_img = data.playlistItemBk2_img;
		this.playlistSeparator_img = data.playlistSeparator_img;
		this.playlistScrBkTop_img = data.playlistScrBkTop_img;
		this.playlistScrBkMiddle_img = data.playlistScrBkMiddle_img;
		this.playlistScrBkBottom_img = data.playlistScrBkBottom_img;
		this.playlistScrDragTop_img = data.playlistScrDragTop_img;
		this.playlistScrDragMiddle_img = data.playlistScrDragMiddle_img;
		this.playlistScrDragBottom_img = data.playlistScrDragBottom_img;
		this.playlistPlayButtonN_img = data.playlistPlayButtonN_img;
		this.playlistScrLines_img = data.playlistScrLines_img;
		this.playlistScrLinesOver_img = data.playlistScrLinesOver_img;
		
		this.disable_do = null;
		this.separator_do = null;
		this.itemsHolder_do = null;
		this.curItem_do = null;
		this.scrMainHolder_do = null;
		this.scrTrack_do = null;
		this.scrTrackTop_do = null;
		this.scrTrackMiddle_do = null;
		this.scrTrackBottom_do = null;
		this.scrHandler_do = null;
		this.scrHandlerTop_do = null;
		this.scrHandlerMiddle_do = null;
		this.scrHandlerBottom_do = null;
		this.scrHandlerLines_do = null;
		this.scrHandlerLinesN_do = null;
		this.scrHandlerLinesS_do = null;
		
		this.playlistPlayButtonN_str = data.playlistPlayButtonN_str;
		this.playlistPlayButtonS_str = data.playlistPlayButtonS_str;
		this.playlistPauseButtonN_str = data.playlistPauseButtonN_str;
		this.playlistPauseButtonS_str = data.playlistPauseButtonS_str;
		
		this.id = 0;
		this.stageWidth = 0;
		this.stageHeight = 0;
		this.itemsTotalHeight = 0;
		this.scrollbarOffestWidth = data.scrollbarOffestWidth;
		this.scrWidth = self.playlistScrBkTop_img.width;
		this.trackTitleOffsetLeft = data.trackTitleOffsetLeft;
		this.downloadButtonOffsetRight = data.downloadButtonOffsetRight;
		this.itemHeight = self.playlistItemBk1_img.height;
		this.playPuaseIconWidth = self.playlistPlayButtonN_img.width;
		this.playPuaseIconHeight = self.playlistPlayButtonN_img.height;
		this.nrOfVisiblePlaylistItems = data.nrOfVisiblePlaylistItems;
		this.durationOffsetRight = data.durationOffsetRight;
		this.totalPlayListItems = 0;
		this.visibleNrOfItems = 0;
		this.yPositionOnPress = 0;
		this.lastPresedY = 0;
		this.lastListY = 0;
		this.playListFinalY = 0;
		this.scrollBarHandlerFinalY = 0;
		this.scrollBarHandlerFinalY = 0;
		this.vy = 0;
		this.vy2 = 0;
		this.friction = .9;
		
		this.updateMobileScrollBarId_int;
		this.updateMoveMobileScrollbarId_int;
		this.disableOnMoveId_to;
		this.updateMobileScrollbarOnPlaylistLoadId_to;
	
		this.addScrollBarMouseWheelSupport_bl = data.addScrollBarMouseWheelSupport_bl;
		this.showPlaylistItemDownloadButton_bl = data.showPlaylistItemDownloadButton_bl;
		this.allowToScrollAndScrollBarIsActive_bl = false;
		this.isDragging_bl = false;
		this.showPlaylistItemPlayButton_bl = data.showPlaylistItemPlayButton_bl;
		this.isShowed_bl = data.showPlayListByDefault_bl;
		this.isShowedFirstTime_bl = false;
		this.animateOnIntro_bl = data.animateOnIntro_bl;
		this.isListCreated_bl = false;
		this.isMobile_bl = FWDUtils.isMobile;
		this.hasPointerEvent_bl = FWDUtils.hasPointerEvent;

		//##########################################//
		/* initialize this */
		//##########################################//
		self.init = function(){
			//self.setOverflow("visible");
		
			self.mainHolder_do = new FWDDisplayObject("div");
			//self.mainHolder_do.setOverflow("visible");
		
			self.itemsHolder_do = new FWDDisplayObject("div");
			self.itemsHolder_do.setOverflow("visible");
			self.itemsHolder_do.setY(0);
			
			self.setupSeparator();
			self.mainHolder_do.addChild(self.itemsHolder_do);
		
			self.addChild(self.mainHolder_do);
			
			if(self.isMobile_bl){
				self.setupMobileScrollbar();
				if(self.hasPointerEvent_bl) self.setupDisable();
			}else{
				self.setupDisable();
				self.setupScrollbar();
				if(self.addScrollBarMouseWheelSupport_bl) self.addMouseWheelSupport();
			}
			self.addChild(self.separator_do);
		};
		
		//###########################################//
		// Resize and position self...
		//###########################################//
		self.resizeAndPosition = function(){
			if(parent.stageWidth == self.stageWidth && parent.stageHeight == self.stageHeight) return;
			if(!self.isListCreated_bl) return;
			self.stageWidth = parent.stageWidth;
			self.stageWidth = parent.stageWidth;
			
			self.positionList();
			if(self.scrMainHolder_do && self.allowToScrollAndScrollBarIsActive_bl) self.scrMainHolder_do.setX(self.stageWidth -  self.scrWidth);
		};
		
		
		//##############################//
		/* position list */
		//##############################//
		self.positionList = function(){
			if(!self.isListCreated_bl) return;
			
			var item;
			var totalItems = self.items_ar.length;
			
			if(self.items_ar){
				for(var i=0; i<totalItems; i++){
					item = self.items_ar[i];
					item.setY(self.itemHeight * i);
					if(self.allowToScrollAndScrollBarIsActive_bl && self.scrMainHolder_do){
						item.resize(self.stageWidth - self.scrollbarOffestWidth, self.itemHeight);
					}else{
						item.resize(self.stageWidth, self.itemHeight);
					}
				}
			}
		
			self.separator_do.setWidth(self.stageWidth);
			if(self.allowToScrollAndScrollBarIsActive_bl && self.scrMainHolder_do){
				self.itemsHolder_do.setWidth(self.stageWidth - self.scrollbarOffestWidth);
			}else{
				self.itemsHolder_do.setWidth(self.stageWidth);
			}
			
			self.mainHolder_do.setWidth(self.stageWidth);
			self.mainHolder_do.setHeight(self.stageHeight);
			self.setWidth(self.stageWidth);
			self.setHeight(self.stageHeight);
		};
		
		//################################//
		/* update playlist */
		//###############################//
		this.updatePlaylist = function(playlist){
			if(self.isListCreated_bl) return;
			
			
			self.playlist_ar = playlist;		
			var showDelay = self.isShowedFirstTime_bl ? 100 : 800;
			self.isShowedFirstTime_bl = true;
			self.stageHeight = 0;
			self.isListCreated_bl = true;
			self.allowToScrollAndScrollBarIsActive_bl = false;
			
			self.visibleNrOfItems = self.nrOfVisiblePlaylistItems;
			self.totalPlayListItems = self.playlist_ar.length;
			if(self.nrOfVisiblePlaylistItems > self.totalPlayListItems){
				self.visibleNrOfItems = self.totalPlayListItems;
			}
			
			self.stageHeight = (self.visibleNrOfItems * self.itemHeight) + self.separator_do.h;
			self.itemsTotalHeight = (self.totalPlayListItems * self.itemHeight);
			self.mainHolder_do.setY(-self.stageHeight);
			self.itemsHolder_do.setY(0);
			
			self.createPlayList();
			var totalItems = self.items_ar.length;
			clearTimeout(self.updateMobileScrollbarOnPlaylistLoadId_to);
			self.updateMobileScrollbarOnPlaylistLoadId_to = setTimeout(self.updateScrollBarHandlerAndContent, 900);
			
			clearTimeout(self.showAnimationIntroId_to);
			self.showAnimationIntroId_to = setTimeout(function(){
				var item;
				for(var i=0; i<totalItems; i++){
					item = self.items_ar[i];
					item.setTextSizes();
				};
				self.isListCreated_bl = true;
				if(self.visibleNrOfItems >= self.totalPlayListItems){
					self.allowToScrollAndScrollBarIsActive_bl = false;
				}else{
					self.allowToScrollAndScrollBarIsActive_bl = true;
				}
				
				if(self.scrHandler_do) self.updateScrollBarSizeActiveAndDeactivate();
				
				self.positionList();
				parent.resizeHandler();
				
				if(self.animateOnIntro_bl){
					if(self.isShowed_bl) self.show(true, true);
				}else{
					if(self.isShowed_bl) self.show(false, true);
				}
			},showDelay);
		};
		
		//######################################//
		/* Destroy current playlist */
		//######################################//
		this.destroyPlaylist = function(){
			if(!self.isListCreated_bl) return;
		
			var item;
			var totalItems = self.items_ar.length;
			self.isListCreated_bl = false;
			clearTimeout(self.showAnimationIntroId_to);
			for(var i=0; i<totalItems; i++){
				item = self.items_ar[i];
				self.itemsHolder_do.removeChild(item);
				item.destroy();
			};
			self.items_ar = null;
			self.stageHeight = 0;
			TweenMax.killTweensOf(self.separator_do);
			TweenMax.killTweensOf(self.mainHolder_do);
			TweenMax.killTweensOf(parent.main_do);
			TweenMax.killTweensOf(parent.stageContainer);
			self.separator_do.setY(-self.separator_do.h);
			self.mainHolder_do.setY(-self.h);
			parent.main_do.setHeight(parent.controller_do.h);
			parent.stageContainer.style.height = parent.controller_do.h + "px";
		};
		
		//#######################################//
		/* Create playlist */
		//#######################################//
		this.createPlayList = function(){
			var item;
			var duration;
			var playlistItemProgress_img;
			var playlistItemGrad_img;
		
			self.itemsHolder_do.setHeight(self.totalPlayListItems * self.itemHeight);
			//if(FWDUtils.isChrome && !self.isMobile_bl){
				self.itemsHolder_do.getStyle().background = "url('" + data.playlistItemProgress1_img.src  + "')";
			//}
			
			
			self.items_ar = [];
			
			for(var i=0; i<self.totalPlayListItems; i++){
				duration = self.playlist_ar[i].duration == undefined ? undefined : FWDRoyalAudioPlayer.formatTotalTime(self.playlist_ar[i].duration);
				if(i%2 == 0){
					playlistItemProgress_img = data.playlistItemProgress1_img;
					playlistItemGrad_img = data.playlistItemGrad1_img;
				}else{
					playlistItemProgress_img = data.playlistItemProgress2_img;
					playlistItemGrad_img = data.playlistItemGrad2_img;
				}
				
				var showDownloadButton_bl = self.playlist_ar[i].downloadable;
				if(!self.showPlaylistItemDownloadButton_bl) showDownloadButton_bl = false;
				
				FWDRAPPlaylistItem.setPrototype();
				item = new FWDRAPPlaylistItem(
					self.playlist_ar[i].title,
					data.playlistDownloadButtonN_img,
					data.playlistDownloadButtonS_img,
					playlistItemGrad_img,
					playlistItemProgress_img,
					data.playlistPlayButtonN_img,
					data.playlistItemBk1_img.src,
					data.playlistItemBk2_img.src,
					self.playlistPlayButtonN_str,
					self.playlistPlayButtonS_str,
					self.playlistPauseButtonN_str,
					self.playlistPauseButtonS_str,
					data.trackTitleNormalColor_str,
					data.trackTitleSelected_str,
					data.trackDurationColor_str,
					i,
					data.playPauseButtonOffsetLeftAndRight,
					self.trackTitleOffsetLeft,
					self.durationOffsetRight,
					self.downloadButtonOffsetRight,
					self.showPlaylistItemPlayButton_bl,
					showDownloadButton_bl,
					duration
				);
				
				item.addListener(FWDRAPPlaylistItem.MOUSE_UP, self.itemOnUpHandler);
				item.addListener(FWDRAPPlaylistItem.DOWNLOAD, self.downloadHandler);
				
				self.items_ar[i] = item;
				self.itemsHolder_do.addChild(item);
			};
		};
		
		this.itemOnUpHandler = function(e){
			self.dispatchEvent(FWDRAPPlaylistItem.MOUSE_UP, {id:e.id});
		};
		
		this.downloadHandler = function(e){
			self.dispatchEvent(FWDRAPPlaylistItem.DOWNLOAD, {id:e.id});
		};
		
		//##############################//
		/* activate items */
		//##############################//
		this.activateItems = function(id, itemClicked){
			var item;
			self.id = id;
			if(! self.items_ar) return;
			self.curItem_do = self.items_ar[id];
			for(var i=0; i<self.totalPlayListItems; i++){
				item = self.items_ar[i];
				if(i == id){
					item.setActive();
				}else{
					item.setInActive();
				}
			}
			if(!itemClicked) self.updateScrollBarHandlerAndContent(true);
		};
		
		//#############################//
		/* set cur item play/pause */
		//#############################//
		this.setCurItemPlayState = function(){
			if(!self.curItem_do) return;
			self.curItem_do.showPlayButton();
		};
		
		this.setCurItemPauseState = function(){
			if(!self.curItem_do) return;
			self.curItem_do.showPauseButton();
		};
		
		
		this.updateCurItemProgress = function(percent){
			if(!self.curItem_do) return;
			self.curItem_do.updateProgressPercent(percent);
		};
		
		//###############################//
		/* setup disable */
		//##############################//
		this.setupDisable = function(){
			self.disable_do = new FWDDisplayObject("div");
			if(FWDUtils.isIE){
				self.disable_do.setBkColor("#FFFFFF");
				self.disable_do.setAlpha(0);
			}
			self.addChild(self.disable_do);
		};
		
		this.showDisable = function(){
			if(!self.disable_do || self.disable_do.w != 0) return;
			if(self.scrMainHolder_do){
				self.disable_do.setWidth(self.stageWidth - self.scrollbarOffestWidth);
				self.disable_do.setHeight(self.stageHeight);
			}else{
				self.disable_do.setWidth(self.stageWidth);
				self.disable_do.setHeight(self.stageHeight);
			}
			
		};
		
		this.hideDisable = function(){
			if(!self.disable_do || self.disable_do.w == 0) return;
			self.disable_do.setWidth(0);
			self.disable_do.setHeight(0);
		};
		
		//###############################//
		/* setup separator */
		//###############################//
		this.setupSeparator = function(){
			self.separator_do = new FWDDisplayObject("div");
			self.separator_do.setBackfaceVisibility();
			self.separator_do.hasTransform3d_bl = false;
			self.separator_do.hasTransform2d_bl = false;
			self.separator_do.getStyle().background = "url('" + self.playlistSeparator_img.src + "')";
			self.separator_do.setHeight(self.playlistSeparator_img.height);
			self.separator_do.setY(-self.separator_do.h);
		};
		
		//#################################//
		/* setup mouse scrollbar */
		//#################################//
		this.setupScrollbar = function(){
			self.scrMainHolder_do = new FWDDisplayObject("div");
			self.scrMainHolder_do.setWidth(self.scrWidth);
			
			self.scrTrack_do = new FWDDisplayObject("div");
			self.scrTrack_do.setWidth(self.scrWidth);
			self.scrTrackTop_do = new FWDDisplayObject("img");
			self.scrTrackTop_do.setScreen(self.playlistScrBkTop_img);
			self.scrTrackMiddle_do = new FWDDisplayObject("div");
			self.scrTrackMiddle_do.getStyle().background = "url('" + self.playlistScrBkMiddle_img.src + "')";
			self.scrTrackMiddle_do.setWidth(self.scrWidth);
			self.scrTrackMiddle_do.setY(self.scrTrackTop_do.h);
			self.scrTrackBottom_do = new FWDDisplayObject("img");
			self.scrTrackBottom_do.setScreen(self.playlistScrBkBottom_img);
			
			self.scrHandler_do = new FWDDisplayObject("div");
			self.scrHandler_do.setWidth(self.scrWidth);
			self.scrHandlerTop_do = new FWDDisplayObject("img");
			self.scrHandlerTop_do.setScreen(self.playlistScrDragTop_img);
			
			self.scrHandlerMiddle_do = new FWDDisplayObject("div");
			self.scrHandlerMiddle_do.getStyle().background = "url('" + self.playlistScrDragMiddle_img.src + "')";
			self.scrHandlerMiddle_do.setWidth(self.scrWidth);
			self.scrHandlerMiddle_do.setY(self.scrHandlerTop_do.h);
			self.scrHandlerBottom_do = new FWDDisplayObject("img");
			self.scrHandlerBottom_do.setScreen(self.playlistScrDragBottom_img);
			self.scrHandler_do.setButtonMode(true);
			
			self.scrHandlerLinesN_do = new FWDDisplayObject("img");
			self.scrHandlerLinesN_do.setScreen(self.playlistScrLines_img);
			self.scrHandlerLinesS_do = new FWDDisplayObject("img");
			self.scrHandlerLinesS_do.setScreen(self.playlistScrLinesOver_img);
			self.scrHandlerLinesS_do.setAlpha(0);
			self.scrHandlerLines_do = new FWDDisplayObject("div");
			self.scrHandlerLines_do.setWidth(self.scrHandlerLinesN_do.w);
			self.scrHandlerLines_do.setHeight(self.scrHandlerLinesN_do.h);
			self.scrHandlerLines_do.setButtonMode(true);
				
			self.scrTrack_do.addChild(self.scrTrackTop_do);
			self.scrTrack_do.addChild(self.scrTrackMiddle_do);
			self.scrTrack_do.addChild(self.scrTrackBottom_do);
			self.scrHandler_do.addChild(self.scrHandlerTop_do);
			self.scrHandler_do.addChild(self.scrHandlerMiddle_do);
			self.scrHandler_do.addChild(self.scrHandlerBottom_do);
			self.scrHandlerLines_do.addChild(self.scrHandlerLinesN_do);
			self.scrHandlerLines_do.addChild(self.scrHandlerLinesS_do);
			self.scrMainHolder_do.addChild(self.scrTrack_do);
			self.scrMainHolder_do.addChild(self.scrHandler_do);
			self.scrMainHolder_do.addChild(self.scrHandlerLines_do);
			self.mainHolder_do.addChild(self.scrMainHolder_do);
			
			if(self.scrHandler_do.screen.addEventListener){
				self.scrHandler_do.screen.addEventListener("mouseover", self.scrollBarHandlerOnMouseOver);
				self.scrHandler_do.screen.addEventListener("mouseout", self.scrollBarHandlerOnMouseOut);
				self.scrHandler_do.screen.addEventListener("mousedown", self.scrollBarHandlerOnMouseDown);
				self.scrHandlerLines_do.screen.addEventListener("mouseover", self.scrollBarHandlerOnMouseOver);
				self.scrHandlerLines_do.screen.addEventListener("mouseout", self.scrollBarHandlerOnMouseOut);
				self.scrHandlerLines_do.screen.addEventListener("mousedown", self.scrollBarHandlerOnMouseDown);
				
				
			}else if(self.scrHandler_do.screen.attachEvent){
				self.scrHandler_do.screen.attachEvent("onmouseover", self.scrollBarHandlerOnMouseOver);
				self.scrHandler_do.screen.attachEvent("onmouseout", self.scrollBarHandlerOnMouseOut);
				self.scrHandler_do.screen.attachEvent("onmousedown", self.scrollBarHandlerOnMouseDown);
				self.scrHandlerLines_do.screen.attachEvent("onmouseover", self.scrollBarHandlerOnMouseOver);
				self.scrHandlerLines_do.screen.attachEvent("onmouseout", self.scrollBarHandlerOnMouseOut);
				self.scrHandlerLines_do.screen.attachEvent("onmousedown", self.scrollBarHandlerOnMouseDown);
			}
		};
		
		this.scrollBarHandlerOnMouseOver = function(e){
			TweenMax.to(self.scrHandlerLinesS_do, .8, {alpha:1, ease:Expo.easeOut});
		};
		
		this.scrollBarHandlerOnMouseOut = function(e){
			if(self.isDragging_bl) return;
			TweenMax.to(self.scrHandlerLinesS_do, .8, {alpha:0, ease:Expo.easeOut});
		};
		
		this.scrollBarHandlerOnMouseDown = function(e){
			if(!self.allowToScrollAndScrollBarIsActive_bl) return;
			var viewportMouseCoordinates = FWDUtils.getViewportMouseCoordinates(e);		
			self.isDragging_bl = true;
			self.yPositionOnPress = self.scrHandler_do.y;
			self.lastPresedY = viewportMouseCoordinates.screenY;
			TweenMax.killTweensOf(self.scrHandler_do);
			self.showDisable();
			
			if(window.addEventListener){
				window.addEventListener("mousemove", self.scrollBarHandlerMoveHandler);
				window.addEventListener("mouseup", self.scrollBarHandlerEndHandler);	
			}else if(document.attachEvent){
				document.attachEvent("onmousemove", self.scrollBarHandlerMoveHandler);
				document.attachEvent("onmouseup", self.scrollBarHandlerEndHandler);
			}
		};
		
		this.scrollBarHandlerMoveHandler = function(e){
			if(e.preventDefault) e.preventDefault();
			var viewportMouseCoordinates = FWDUtils.getViewportMouseCoordinates(e);	
	
			self.scrollBarHandlerFinalY = Math.round(self.yPositionOnPress + viewportMouseCoordinates.screenY - self.lastPresedY);
			if(self.scrollBarHandlerFinalY >= self.scrTrack_do.h - self.scrHandler_do.h - 1){
				self.scrollBarHandlerFinalY = self.scrTrack_do.h -  self.scrHandler_do.h - 1;
			}else if(self.scrollBarHandlerFinalY <= 0){
				self.scrollBarHandlerFinalY = 0;
			}
			
			self.scrHandler_do.setY(self.scrollBarHandlerFinalY);
			TweenMax.to(self.scrHandlerLines_do, .8, {y:self.scrollBarHandlerFinalY + parseInt((self.scrHandler_do.h - self.scrHandlerLines_do.h)/2), ease:Quart.easeOut});
			self.updateScrollBarHandlerAndContent(true);
		};
		
		self.scrollBarHandlerEndHandler = function(e){
			var viewportMouseCoordinates = FWDUtils.getViewportMouseCoordinates(e);	
			self.isDragging_bl = false;
			
			if(!FWDUtils.hitTest(self.scrHandler_do.screen, viewportMouseCoordinates.screenX, viewportMouseCoordinates.screenY)){
				TweenMax.to(self.scrHandlerLinesS_do, .8, {alpha:0, ease:Expo.easeOut});
			}
			
			self.scrollBarHandlerFinalY = parseInt((self.scrTrack_do.h - self.scrHandler_do.h) * (self.playListFinalY/((self.totalPlayListItems - self.nrOfVisiblePlaylistItems) * self.itemHeight))) * -1;
			
			if(self.scrollBarHandlerFinalY.y < 0){
				self.scrollBarHandlerFinalY = 0;
			}else if(self.scrollBarHandlerFinalY > self.scrTrack_do.h - self.scrHandler_do.h - 1){
				self.scrollBarHandlerFinalY = self.scrTrack_do.h - self.scrHandler_do.h - 1;
			}
			
			self.hideDisable();
			TweenMax.killTweensOf(self.scrHandler_do);
			TweenMax.to(self.scrHandler_do, .5, {y:self.scrollBarHandlerFinalY, ease:Quart.easeOut});
			
			if(window.removeEventListener){
				window.removeEventListener("mousemove", self.scrollBarHandlerMoveHandler);
				window.removeEventListener("mouseup", self.scrollBarHandlerEndHandler);	
			}else if(document.detachEvent){
				document.detachEvent("onmousemove", self.scrollBarHandlerMoveHandler);
				document.detachEvent("onmouseup", self.scrollBarHandlerEndHandler);
			}
		};
		
		this.updateScrollBarSizeActiveAndDeactivate = function(){
			if(self.allowToScrollAndScrollBarIsActive_bl){
				self.allowToScrollAndScrollBarIsActive_bl = true;
				self.scrMainHolder_do.setHeight(self.stageHeight - self.separator_do.h);
				self.scrTrack_do.setHeight(self.stageHeight - self.separator_do.h);
				self.scrTrackMiddle_do.setHeight(self.scrTrack_do.h - (self.scrTrackTop_do.h * 2));
				self.scrTrackBottom_do.setY(self.scrTrackMiddle_do.y + self.scrTrackMiddle_do.h);
				
				self.scrHandler_do.setHeight(Math.min(self.stageHeight, Math.round((self.stageHeight/self.itemsTotalHeight) * self.stageHeight)));
				self.scrHandlerMiddle_do.setHeight(self.scrHandler_do.h - (self.scrHandlerTop_do.h * 2));
				self.scrHandlerTop_do.setY(self.scrHandlerMiddle_do.y + self.scrHandlerMiddle_do.h);
				//self.scrHandlerLines_do.setY(self.scrollBarHandlerFinalY + parseInt((self.scrHandler_do.h - self.scrHandlerLines_do.h)/2));
				self.updateScrollBarHandlerAndContent();
			}else{
				self.allowToScrollAndScrollBarIsActive_bl = false;
				self.scrMainHolder_do.setX(-500);
				self.scrHandler_do.setY(0);
			}
		};
		
		this.updateScrollBarHandlerAndContent = function(animate){
			if(!self.allowToScrollAndScrollBarIsActive_bl) return;
			var percentScrolled = 0;
			var leftId = 0;
			
			if(self.isDragging_bl && !self.isMobile_bl){
				percentScrolled = (self.scrHandler_do.y/(self.scrMainHolder_do.h - self.scrHandler_do.h));
				if(percentScrolled == "Infinity"){
					percentScrolled = 0;
				}else if(percentScrolled >= 1){
					scrollPercent = 1;
				}
				self.playListFinalY = Math.round(percentScrolled * (self.totalPlayListItems - self.nrOfVisiblePlaylistItems)) * self.itemHeight * - 1;
				
			}else{
				leftId = parseInt(self.id/self.nrOfVisiblePlaylistItems) * self.nrOfVisiblePlaylistItems;
				
				if(leftId + self.nrOfVisiblePlaylistItems >= self.totalPlayListItems){
					leftId = self.totalPlayListItems - self.nrOfVisiblePlaylistItems;
				}
				
				self.playListFinalY = leftId * self.itemHeight * -1;
				if(self.scrMainHolder_do){
					self.scrollBarHandlerFinalY = Math.round((self.scrMainHolder_do.h - self.scrHandler_do.h) * (self.playListFinalY/((self.totalPlayListItems - self.nrOfVisiblePlaylistItems) * self.itemHeight))) * -1;
					
					if(self.scrollBarHandlerFinalY < 0){
						self.scrollBarHandlerFinalY = 0;
					}else if(self.scrollBarHandlerFinalY > self.scrMainHolder_do.h - self.scrHandler_do.h - 1){
						self.scrollBarHandlerFinalY = self.scrMainHolder_do.h - self.scrHandler_do.h - 1;
					}
					
					TweenMax.killTweensOf(self.scrHandler_do);
					TweenMax.killTweensOf(self.scrHandlerLines_do);
					if(animate){
						TweenMax.to(self.scrHandler_do, .5, {y:self.scrollBarHandlerFinalY, ease:Quart.easeOut});
						TweenMax.to(self.scrHandlerLines_do, .8, {y:self.scrollBarHandlerFinalY + parseInt((self.scrHandler_do.h - self.scrHandlerLinesN_do.h)/2), ease:Quart.easeOut});
					}else{
						self.scrHandler_do.setY(self.scrollBarHandlerFinalY);
						self.scrHandlerLines_do.setY(self.scrollBarHandlerFinalY + parseInt((self.scrHandler_do.h - self.scrHandlerLinesN_do.h)/2));
					}
				}
			}
			
			if(self.lastListY != self.playListFinalY){
				TweenMax.killTweensOf(self.itemsHolder_do);
				if(animate){
					TweenMax.to(self.itemsHolder_do, .5, {y:self.playListFinalY, ease:Quart.easeOut});
				}else{
					self.itemsHolder_do.setY(self.playListFinalY);
				}
			}
			self.lastListY = self.playListFinalY;
		};
		
		//###############################################//
		/* Add mouse wheel support */
		//##############################################//
		this.addMouseWheelSupport = function(){
			if(window.addEventListener){
				self.screen.addEventListener ("mousewheel", self.mouseWheelHandler);
				self.screen.addEventListener('DOMMouseScroll', self.mouseWheelHandler);
			}else if(document.attachEvent){
				self.screen.attachEvent ("onmousewheel", self.mouseWheelHandler);
			}
		};
		
		this.mouseWheelHandler = function(e){
			if(!self.allowToScrollAndScrollBarIsActive_bl || self.isDragging_bl) return;
			
			var dir = e.detail || e.wheelDelta;	
			if(e.wheelDelta) dir *= -1;
			if(FWDUtils.isOpera) dir *= -1;
		
			if(dir > 0){
				self.playListFinalY -= self.itemHeight;
			}else{
				self.playListFinalY += self.itemHeight;
			}
			
			leftId = parseInt(self.playListFinalY/self.itemHeight);
			
			if(leftId >= 0){
				leftId = 0;
			}else if(Math.abs(leftId) + self.nrOfVisiblePlaylistItems >= self.totalPlayListItems){
				leftId = (self.totalPlayListItems - self.nrOfVisiblePlaylistItems) * -1;
			}
		
			self.playListFinalY = leftId * self.itemHeight;
			
			if(self.lastListY == self.playListFinalY) return;
			
			self.scrollBarHandlerFinalY = Math.round((self.scrMainHolder_do.h - self.scrHandler_do.h) * (self.playListFinalY/((self.totalPlayListItems - self.nrOfVisiblePlaylistItems) * self.itemHeight))) * -1;
			
			if(self.scrollBarHandlerFinalY < 0){
				self.scrollBarHandlerFinalY = 0;
			}else if(self.scrollBarHandlerFinalY > self.scrMainHolder_do.h - self.scrHandler_do.h - 1){
				self.scrollBarHandlerFinalY = self.scrMainHolder_do.h - self.scrHandler_do.h - 1;
			}
			
			TweenMax.killTweensOf(self.itemsHolder_do);
			TweenMax.to(self.itemsHolder_do, .5, {y:self.playListFinalY, ease:Expo.easeOut});
			
			TweenMax.killTweensOf(self.scrHandler_do);
			TweenMax.to(self.scrHandler_do, .5, {y:self.scrollBarHandlerFinalY, ease:Expo.easeOut});
			TweenMax.to(self.scrHandlerLines_do, .8, {y:self.scrollBarHandlerFinalY + parseInt((self.scrHandler_do.h - self.scrHandlerLinesN_do.h)/2), ease:Quart.easeOut});
			self.lastListY = self.playListFinalY;
			
			if(e.preventDefault){
				e.preventDefault();
			}else{
				return false;
			}	
			return;
		};
		
		//##########################################//
		/* setup mobile scrollbar */
		//##########################################//
		self.setupMobileScrollbar = function(){
			if(self.hasPointerEvent_bl){
				self.screen.addEventListener("MSPointerDown", self.scrollBarTouchStartHandler);
			}else{
				self.screen.addEventListener("touchstart", self.scrollBarTouchStartHandler);
			}
			self.updateMobileScrollBarId_int = setInterval(self.updateMobileScrollBar, 16);
		};
		
		self.scrollBarTouchStartHandler = function(e){
			//if(e.preventDefault) e.preventDefault();
			TweenMax.killTweensOf(self.itemsHolder_do);
			var viewportMouseCoordinates = FWDUtils.getViewportMouseCoordinates(e);		
			self.isDragging_bl = true;
			self.lastPresedY = viewportMouseCoordinates.screenY;
	
			if(self.hasPointerEvent_bl){
				window.addEventListener("MSPointerUp", self.scrollBarTouchEndHandler);
				window.addEventListener("MSPointerMove", self.scrollBarTouchMoveHandler);
			}else{
				window.addEventListener("touchend", self.scrollBarTouchEndHandler);
				window.addEventListener("touchmove", self.scrollBarTouchMoveHandler);
			}
			clearInterval(self.updateMoveMobileScrollbarId_int);
			self.updateMoveMobileScrollbarId_int = setInterval(self.updateMoveMobileScrollbar, 20);
		};
		
		self.scrollBarTouchMoveHandler = function(e){
			if(e.preventDefault) e.preventDefault();
			
			self.showDisable();
			
			var viewportMouseCoordinates = FWDUtils.getViewportMouseCoordinates(e);	
			var toAdd = viewportMouseCoordinates.screenY - self.lastPresedY;
		
			self.playListFinalY += toAdd;
			self.playListFinalY = Math.round(self.playListFinalY);
			
			
			self.lastPresedY = viewportMouseCoordinates.screenY;
			self.vy = toAdd  * 2;
		};
		
		self.scrollBarTouchEndHandler = function(e){
			self.isDragging_bl = false;
			clearInterval(self.updateMoveMobileScrollbarId_int);
			clearTimeout(self.disableOnMoveId_to);
			self.disableOnMoveId_to = setTimeout(function(){
				self.hideDisable();
			},50);
			if(self.hasPointerEvent_bl){
				window.removeEventListener("MSPointerUp", self.scrollBarTouchEndHandler);
				window.removeEventListener("MSPointerMove", self.scrollBarTouchMoveHandler);
			}else{
				window.removeEventListener("touchend", self.scrollBarTouchEndHandler);
				window.removeEventListener("touchmove", self.scrollBarTouchMoveHandler);
			}
		};
		
		self.updateMoveMobileScrollbar = function(){
			self.itemsHolder_do.setY(self.playListFinalY);
		};
		
		self.updateMobileScrollBar = function(animate){
			if(!self.isDragging_bl && !TweenMax.isTweening(self.itemsHolder_do)){
				self.vy *= self.friction;
				self.playListFinalY += self.vy;	
			
				if(self.playListFinalY > 0){
					self.vy2 = (0 - self.playListFinalY) * .3;
					self.vy *= self.friction;
					self.playListFinalY += self.vy2;
				}else if(self.playListFinalY < self.stageHeight - self.separator_do.h - self.itemsTotalHeight){
					self.vy2 = (self.stageHeight - self.separator_do.h - self.itemsTotalHeight - self.playListFinalY) * .3;
					self.vy *= self.friction;
					self.playListFinalY += self.vy2;
				}
				self.itemsHolder_do.setY(Math.round(self.playListFinalY));
			}
		};
	
		//##############################//
		/* hide / show */
		//##############################//
		this.hide = function(animate, overwrite){
			if(!self.isShowed_bl && !overwrite || parent.openInPopup_bl) return;
		
			self.isShowed_bl = false;
			if(animate){
				TweenMax.to(self.separator_do, .8, {y:-self.separator_do.h, ease:Expo.easeInOut});
				TweenMax.to(self.mainHolder_do, .8, {y:-self.h, ease:Expo.easeInOut});
				TweenMax.to(parent.main_do, .8, {height:parent.controller_do.h, ease:Expo.easeInOut});
				TweenMax.to(parent.stageContainer, .8, {css:{height:parent.controller_do.h}, ease:Expo.easeInOut});
			}else{
				TweenMax.killTweensOf(self.separator_do);
				TweenMax.killTweensOf(self.mainHolder_do);
				TweenMax.killTweensOf(parent.main_do);
				TweenMax.killTweensOf(parent.stageContainer);
				self.separator_do.setY(-self.separator_do.h);
				self.mainHolder_do.setY(-self.h);
				parent.main_do.setHeight(parent.controller_do.h);
				parent.stageContainer.style.height = parent.controller_do.h + "px";
			}
		};
		
		this.show = function(animate, overwrite){
			if(self.isShowed_bl && !overwrite) return;
			self.isShowed_bl = true;
			
			if(animate){
				TweenMax.to(self.separator_do, .8, {y:0, ease:Expo.easeInOut});
				TweenMax.to(self.mainHolder_do, .8, {y:self.separator_do.h, ease:Expo.easeInOut});
				if(!parent.openInPopup_bl) TweenMax.to(parent.main_do, .8, {h:parent.controller_do.h + self.stageHeight, ease:Expo.easeInOut});
				TweenMax.to(parent.stageContainer, .8, {css:{height:parent.controller_do.h + self.stageHeight}, ease:Expo.easeInOut});
			}else{
				TweenMax.killTweensOf(self.separator_do);
				TweenMax.killTweensOf(self.mainHolder_do);
				TweenMax.killTweensOf(parent.main_do);
				TweenMax.killTweensOf(parent.stageContainer);
				self.separator_do.setY(0);
				self.mainHolder_do.setY(self.separator_do.h);
				if(!parent.openInPopup_bl) parent.main_do.setHeight(parent.controller_do.h + self.stageHeight);
				parent.stageContainer.style.height = (parent.controller_do.h + self.stageHeight) + "px";
			}
			
		};
	
	
		this.init();
	};
	
	/* set prototype */
	FWDRAPPlaylist.setPrototype = function(){
		FWDRAPPlaylist.prototype = new FWDDisplayObject("div");
	};
	
	FWDRAPPlaylist.PLAY = "play";
	FWDRAPPlaylist.PAUSE = "pause";

	
	FWDRAPPlaylist.prototype = null;
	window.FWDRAPPlaylist = FWDRAPPlaylist;
	
}());