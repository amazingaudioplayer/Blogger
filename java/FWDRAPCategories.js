/* FWDRAPCategories */
(function(){
var FWDRAPCategories = function(data){
		
		var self = this;
		var prototype = FWDRAPCategories.prototype;
		
		this.image_img;
		this.catBk_img = data.catBk_img;
		this.catThumbBk_img = data.catThumbBk_img;
		this.catNextN_img = data.catNextN_img;
		this.catNextS_img = data.catNextS_img;
		this.catNextD_img = data.catNextD_img;
		this.catPrevN_img = data.catPrevN_img;
		this.catPrevS_img = data.catPrevS_img;
		this.catPrevD_img = data.catPrevD_img;
		this.catCloseN_img = data.catCloseN_img;
		this.catCloseS_img = data.catCloseS_img;
		
		this.mainHolder_do = null;
		this.closeButton_do = null;
		this.nextButton_do = null;
		this.prevButton_do = null;
		
		this.thumbs_ar = [];
		this.categories_ar = data.cats_ar;
		
		this.id = 0;
		this.mouseX = 0;
		this.mouseY = 0;
		this.dif = 0;
		this.tempId = self.id;
		this.stageWidth = 0;
		this.stageHeight = 0;
		this.thumbW = 0;
		this.thumbH = 0;
		this.buttonsMargins = data.buttonsMargins;
		this.thumbnailMaxWidth = data.thumbnailMaxWidth;
		this.thumbnailMaxHeight = data.thumbnailMaxHeight;
		this.spacerH = data.horizontalSpaceBetweenThumbnails;
		this.spacerV = data.verticalSpaceBetweenThumbnails;
		this.dl;
		this.howManyThumbsToDisplayH = 0;
		this.howManyThumbsToDisplayV = 0;
		this.categoriesOffsetTotalWidth = self.catNextN_img.width * 2 + 30;
		this.categoriesOffsetTotalHeight = self.catNextN_img.height + 30;
		this.totalThumbnails = self.categories_ar.length;
		this.delayRate = .06;
		this.countLoadedThumbs = 0;
		this.hideCompleteId_to;
		this.showCompleteId_to;
		this.loadThumbnailsId_to;
		
		this.areThumbnailsCreated_bl = false;
		this.areThumbnailsLoaded_bl = false;
		this.isShowed_bl = false;
		this.isOnDOM_bl = false;
		this.isMobile_bl = FWDUtils.isMobile;
		this.hasPointerEvent_bl = FWDUtils.hasPointerEvent;

		//##########################################//
		/* initialize this */
		//##########################################//
		self.init = function(){
			if(self.isMobile_bl && self.hasPointerEvent_bl) self.getStyle().msTouchAction = "none";
			self.getStyle().zIndex = 16777271;
			self.getStyle().msTouchAction = "none";
			self.getStyle().webkitTapHighlightColor = "rgba(0, 0, 0, 0)";
			self.getStyle().width = "100%";
			
			self.mainHolder_do = new FWDDisplayObject("div");
			self.mainHolder_do.getStyle().background = "url('" + self.catBk_img.src + "')";
			self.mainHolder_do.setY(- 3000);
			self.addChild(self.mainHolder_do);
			self.setupButtons();
			self.setupDisable();
			if(self.isMobile_bl)  self.setupMobileMove();
			
			if(!self.isMobile_bl || (self.isMobile_bl && self.hasPointerEvent_bl)) self.setSelectable(false);
			
			if(window.addEventListener){
				self.screen.addEventListener ("mousewheel", self.mouseWheelDumyHandler);
				self.screen.addEventListener('DOMMouseScroll', self.mouseWheelDumyHandler);
			}else if(document.attachEvent){
				self.screen.attachEvent ("onmousewheel", self.mouseWheelDumyHandler);
			}
			
		};
		
		this.mouseWheelDumyHandler = function(e){		
			if(e.preventDefault){
				e.preventDefault();
			}else{
				return false;
			}	
		};
		
		//###########################################//
		// Resize and position ...
		//###########################################//
		self.resizeAndPosition = function(overwrite){
			if(!self.isShowed_bl && !overwrite) return;
			
			var scrollOffsets = FWDUtils.getScrollOffsets();
			var viewportSize = FWDUtils.getViewportSize();
			
			if(self.stageWidth == viewportSize.w && self.stageHeight == viewportSize.h && !overwrite) return;
			self.stageWidth = viewportSize.w;
			self.stageHeight = viewportSize.h;
			
			TweenMax.killTweensOf(self.mainHolder_do);
			self.mainHolder_do.setX(0);
			//self.mainHolder_do.setY(0);
			self.mainHolder_do.setWidth(self.stageWidth);
			self.mainHolder_do.setHeight(self.stageHeight);
			
			self.setX(scrollOffsets.x);
			self.setY(scrollOffsets.y);
			self.setHeight(self.stageHeight);
			if(self.isMobile_bl) self.setWidth(self.stageWidth);
			self.positionButtons();
			self.tempId = self.id;
			self.resizeAndPositionThumbnails();
			self.disableEnableNextAndPrevButtons();
		};
		
		//##########################################//
		/* resize and scroll handler */
		//##########################################//
		self.onScrollHandler = function(){
			var scrollOffsets = FWDUtils.getScrollOffsets();
			self.setX(scrollOffsets.x);
			self.setY(scrollOffsets.y);
		};
		
		//###############################//
		/* setup disable */
		//##############################//
		this.setupDisable = function(){
			self.disable_do = new FWDDisplayObject("div");
			if(FWDUtils.isIE){
				self.disable_do.setBkColor("#FFFFFF");
				self.disable_do.setAlpha(0.01);
			}
			self.addChild(self.disable_do);
		};
		
		this.showDisable = function(){
			if(self.disable_do.w == self.stageWidth) return;
			self.disable_do.setWidth(self.stageWidth);
			self.disable_do.setHeight(self.stageHeight);
		};
		
		this.hideDisable = function(){
			if(self.disable_do.w == 0) return;
			self.disable_do.setWidth(0);
			self.disable_do.setHeight(0);
		};
		
		//############################################//
		/* setup buttons */
		//############################################//
		this.setupButtons = function(){
			FWDRAPSimpleButton.setPrototype();
			self.closeButton_do = new FWDRAPSimpleButton(self.catCloseN_img, self.catCloseS_img);
			self.closeButton_do.addListener(FWDRAPSimpleButton.MOUSE_UP, self.closeButtonOnMouseUpHandler);
			
			FWDRAPSimpleButton.setPrototype();
			self.nextButton_do = new FWDRAPSimpleButton(self.catNextN_img, self.catNextS_img, self.catNextD_img);
			self.nextButton_do.addListener(FWDRAPSimpleButton.MOUSE_UP, self.nextButtonOnMouseUpHandler);
			
			FWDRAPSimpleButton.setPrototype();
			self.prevButton_do = new FWDRAPSimpleButton(self.catPrevN_img, self.catPrevS_img, self.catPrevD_img);
			self.prevButton_do.addListener(FWDRAPSimpleButton.MOUSE_UP, self.prevButtonOnMouseUpHandler);
		};
		
		this.closeButtonOnMouseUpHandler = function(){
			 self.hide();
		};
		
		this.nextButtonOnMouseUpHandler = function(){
			var availableThumbsPerSection = (self.howManyThumbsToDisplayH * self.howManyThumbsToDisplayV);
			self.tempId += availableThumbsPerSection;
			if(self.tempId > self.totalThumbnails - 1) self.tempId = self.totalThumbnails - 1;
			var curSet = Math.floor(self.tempId / availableThumbsPerSection);
			self.tempId = curSet * availableThumbsPerSection;
			self.resizeAndPositionThumbnails(true, "next");
			self.disableEnableNextAndPrevButtons(false, true);
		};
		
		this.prevButtonOnMouseUpHandler = function(){
			var availableThumbsPerSection = (self.howManyThumbsToDisplayH * self.howManyThumbsToDisplayV);
			self.tempId -= availableThumbsPerSection;
			if(self.tempId < 0) self.tempId = 0;
			var curSet = Math.floor(self.tempId / availableThumbsPerSection);
			self.tempId = curSet * availableThumbsPerSection;
			self.resizeAndPositionThumbnails(true, "prev");
			self.disableEnableNextAndPrevButtons(true, false);
		};
		
		this.positionButtons = function(){
			self.closeButton_do.setX(self.stageWidth - self.closeButton_do.w - self.buttonsMargins);
			self.closeButton_do.setY(self.buttonsMargins);
			self.nextButton_do.setX(self.stageWidth - self.nextButton_do.w - self.buttonsMargins);
			self.nextButton_do.setY(parseInt((self.stageHeight - self.nextButton_do.h)/2));
			self.prevButton_do.setX(self.buttonsMargins);
			self.prevButton_do.setY(parseInt((self.stageHeight - self.prevButton_do.h)/2));
		};
		
		this.disableEnableNextAndPrevButtons = function(hitTestLeft, hitTestRight){
			var availableThumbsPerSection = (self.howManyThumbsToDisplayH * self.howManyThumbsToDisplayV);
			var curSet = Math.floor(self.tempId / availableThumbsPerSection);
			var totalSets = Math.ceil(self.totalThumbnails / availableThumbsPerSection) - 1;
			var currentLeftColId = self.howManyThumbsToDisplayH * curSet;
			var maxId = totalSets * self.howManyThumbsToDisplayH;
		
			if(availableThumbsPerSection >= self.totalThumbnails){
				self.nextButton_do.disable();
				self.prevButton_do.disable();
				self.nextButton_do.setDisabledState();
				self.prevButton_do.setDisabledState();
			}else if(curSet == 0){
				self.nextButton_do.enable();
				self.prevButton_do.disable();
				self.nextButton_do.setEnabledState();
				self.prevButton_do.setDisabledState();
			}else if(curSet == totalSets){
				self.nextButton_do.disable();
				self.prevButton_do.enable();
				self.nextButton_do.setDisabledState();
				self.prevButton_do.setEnabledState();
			}else{
				self.nextButton_do.enable();
				self.prevButton_do.enable();
				self.nextButton_do.setEnabledState();
				self.prevButton_do.setEnabledState();
			}
			
			if(!hitTestLeft){
				self.prevButton_do.setNormalState();
			}
			
			if(!hitTestRight){
				self.nextButton_do.setNormalState();
			}
		};
		
		//##########################################//
		/* setup mobile scrollbar */
		//##########################################//
		this.setupMobileMove = function(){	
			if(self.hasPointerEvent_bl){
				self.screen.addEventListener("MSPointerDown", self.mobileDownHandler);
			}else{
				self.screen.addEventListener("touchstart", self.mobileDownHandler);
			}
			//self.screen.addEventListener("mousedown", self.mobileDownHandler);
		};
		
		this.mobileDownHandler = function(e){
			if (e.touches) if(e.touches.length != 1) return;
			var viewportMouseCoordinates = FWDUtils.getViewportMouseCoordinates(e);	
			self.mouseX = viewportMouseCoordinates.screenX;;
			self.mouseY = viewportMouseCoordinates.screenY;
			if(self.hasPointerEvent_bl){
				window.addEventListener("MSPointerUp", self.mobileUpHandler);
				window.addEventListener("MSPointerMove", self.mobileMoveHandler);
			}else{
				window.addEventListener("touchend", self.mobileUpHandler);
				window.addEventListener("touchmove", self.mobileMoveHandler);
			}
			//window.addEventListener("mouseup", self.mobileUpHandler);
			//window.addEventListener("mousemove", self.mobileMoveHandler);
		};
		
		this.mobileMoveHandler = function(e){
			if(e.preventDefault) e.preventDefault();
			if (e.touches) if(e.touches.length != 1) return;
			self.showDisable();
			var viewportMouseCoordinates = FWDUtils.getViewportMouseCoordinates(e);
			self.dif = self.mouseX - viewportMouseCoordinates.screenX;
			self.mouseX = viewportMouseCoordinates.screenX;
			self.mouseY = viewportMouseCoordinates.screenY;
		};
		
		this.mobileUpHandler = function(e){
			self.hideDisable();
			if(self.dif > 10){
				self.nextButtonOnMouseUpHandler();
			}else if(self.dif < -10){
				self.prevButtonOnMouseUpHandler();
			}
			self.dif = 0;
			
			if(self.hasPointerEvent_bl){
				window.removeEventListener("MSPointerUp", self.mobileUpHandler, false);
				window.removeEventListener("MSPointerMove", self.mobileMoveHandler);
			}else{
				window.removeEventListener("touchend", self.mobileUpHandler);
				window.removeEventListener("touchmove", self.mobileMoveHandler);
			}
			//window.removeEventListener("mouseup", self.mobileUpHandler);
			//window.removeEventListener("mousemove", self.mobileMoveHandler);
		};
		
		//######################################//
		/* setup thumbnails */
		//######################################//
		this.setupThumbnails = function(){
			if(self.areThumbnailsCreated_bl) return;
			self.areThumbnailsCreated_bl = true;
			var thumb;
			for(var i=0; i<self.totalThumbnails; i++){
				FWDRAPCategoriesThumb.setPrototype();
				thumb = new FWDRAPCategoriesThumb(self,
						i,
						data.catThumbBk_img,
						data.catThumbTextBk_img,
						data.thumbnailSelectedType_str, 
						self.categories_ar[i].htmlContent);
				thumb.addListener(FWDRAPCategoriesThumb.MOUSE_UP, self.thumbnailOnMouseUpHandler);
				self.thumbs_ar[i] = thumb;
				self.mainHolder_do.addChild(thumb);
			}
			self.mainHolder_do.addChild(self.closeButton_do); 
			self.mainHolder_do.addChild(self.nextButton_do); 
			self.mainHolder_do.addChild(self.prevButton_do);
		};
		
		this.thumbnailOnMouseUpHandler = function(e){
			self.id = e.id;
			self.disableOrEnableThumbnails();
			self.hide();
		};
		
		//#############################################//
		/* set data for resize */
		//#############################################//
		this.resizeAndPositionThumbnails = function(animate, direction){
			if(!self.areThumbnailsCreated_bl) return;
			var thumb;
			var totalWidth;
			var curSet;
			var tempSet;
			var newX;
			var newY;
			var totalWidth;
			var totalHeight;
			var remainWidthSpace;
			var firsId;
			var lastId;
			var addToX;
			var currentLeftColId;
			var availableThumbsPerSection;
			
			this.remainWidthSpace = (this.stageWidth - totalWidth);
			
			var widthToResize = self.stageWidth - self.categoriesOffsetTotalWidth;
			var heightToResize = self.stageHeight - self.categoriesOffsetTotalHeight;
			
			self.howManyThumbsToDisplayH = Math.ceil((widthToResize - self.spacerH)/(self.thumbnailMaxWidth + self.spacerH));
			self.thumbW = Math.floor(((widthToResize - self.spacerH * (self.howManyThumbsToDisplayH - 1)))/self.howManyThumbsToDisplayH);
			if(self.thumbW > self.thumbnailMaxWidth){
				self.howManyThumbsToDisplayH += 1;
				self.thumbW = Math.floor(((widthToResize - self.spacerH * (self.howManyThumbsToDisplayH - 1)))/self.howManyThumbsToDisplayH);
			}
			
			self.thumbH = Math.floor((self.thumbW/self.thumbnailMaxWidth) * self.thumbnailMaxHeight);
			
			self.howManyThumbsToDisplayV = Math.floor(heightToResize/(self.thumbH + self.spacerV));
			if(self.howManyThumbsToDisplayV < 1) self.howManyThumbsToDisplayV = 1;
			
			totalWidth = (Math.min(self.howManyThumbsToDisplayH, self.totalThumbnails) * (self.thumbW + self.spacerH)) - self.spacerH;
			totalHeight = Math.min(Math.ceil(self.totalThumbnails/self.howManyThumbsToDisplayH), self.howManyThumbsToDisplayV) * (self.thumbH + self.spacerV) - self.spacerV;
			
			if(self.howManyThumbsToDisplayH > self.totalThumbnails){
				remainWidthSpace = 0;
			}else{
				remainWidthSpace = (widthToResize - totalWidth);
			}
			
			if(self.howManyThumbsToDisplayH > self.totalThumbnails) self.howManyThumbsToDisplayH = self.totalThumbnails;
			availableThumbsPerSection = (self.howManyThumbsToDisplayH * self.howManyThumbsToDisplayV);
		
			curSet = Math.floor(self.tempId / availableThumbsPerSection);
			currentLeftColId = self.howManyThumbsToDisplayH * curSet;
			
			firstId = curSet * availableThumbsPerSection;
			
			lastId = firstId + availableThumbsPerSection;
			if(lastId > self.totalThumbnails)  lastId = self.totalThumbnails;
			
			for (var i = 0; i<self.totalThumbnails; i++) {
				
				thumb = self.thumbs_ar[i];
				
				thumb.finalW = self.thumbW;
				if(i % self.howManyThumbsToDisplayH == self.howManyThumbsToDisplayH - 1) thumb.finalW += remainWidthSpace;
				thumb.finalH = self.thumbH;
				
				thumb.finalX = (i % self.howManyThumbsToDisplayH) * (self.thumbW + self.spacerH);
				thumb.finalX += Math.floor((i / availableThumbsPerSection)) * self.howManyThumbsToDisplayH * (self.thumbW + self.spacerH);
				thumb.finalX += (self.stageWidth - totalWidth)/2;
				thumb.finalX = Math.floor(thumb.finalX - currentLeftColId * (self.thumbW + self.spacerH));
				
				thumb.finalY = i % availableThumbsPerSection;
				thumb.finalY = Math.floor((thumb.finalY / self.howManyThumbsToDisplayH)) * (self.thumbH + self.spacerV);
				thumb.finalY += (heightToResize - totalHeight)/2;
				thumb.finalY += self.categoriesOffsetTotalHeight/2;
				thumb.finalY = Math.floor(thumb.finalY);
				
				tempSet = Math.floor((i / availableThumbsPerSection));
			
			
				if(tempSet > curSet){
					thumb.finalX += 150;
				}else if(tempSet < curSet){
					thumb.finalX -= 150;
				}
				
				if(animate){
					if ((i >= firstId) && (i < lastId)){
						if(direction == "next"){
							dl = (i % availableThumbsPerSection) * self.delayRate + .1;
						}else{
							dl = (availableThumbsPerSection -  (i % availableThumbsPerSection)) * self.delayRate + .1
						}
						thumb.resizeAndPosition(true, dl);
					}else{
						thumb.resizeAndPosition(true, 0);
					}
					
				}else{
					thumb.resizeAndPosition();
				}	
			}
		};
		
		//#############################################//
		/* load images */
		//#############################################//
		this.loadImages = function(){
			if(self.countLoadedThumbs > self.totalThumbnails-1) return;
			
			if(self.image_img){
				self.image_img.onload = null;
				self.image_img.onerror = null;
			}
			
			self.image_img = new Image();
			self.image_img.onerror = self.onImageLoadError;
			self.image_img.onload = self.onImageLoadComplete;
			
			self.image_img.src = self.categories_ar[self.countLoadedThumbs].thumbnailPath;
		};
		
		this.onImageLoadError = function(e){};
		
		this.onImageLoadComplete = function(e){
			var thumb = self.thumbs_ar[self.countLoadedThumbs];
			thumb.setImage(self.image_img);
			self.countLoadedThumbs++;
			self.loadWithDelayId_to = setTimeout(self.loadImages, 40);	
		};
		
		//###########################################//
		/* disable / enable thumbnails */
		//###########################################//
		this.disableOrEnableThumbnails = function(){
			var thumb;
			for(var i = 0; i<self.totalThumbnails; i++) {
				thumb = self.thumbs_ar[i];	
				if(i == self.id){
					thumb.disable();
				}else{
					thumb.enable();
				}
			}
		};
		
		//###########################################//
		/* show / hide */
		//###########################################//
		this.show = function(id){
			if(self.isShowed_bl) return;
			self.isShowed_bl = true;
			self.isOnDOM_bl = true;
			self.id = id;
			
			if(FWDUtils.isIEAndLessThen9){
				document.getElementsByTagName("body")[0].appendChild(self.screen);
			}else{
				document.documentElement.appendChild(self.screen);
			}
			
			if(window.addEventListener){
				window.addEventListener("scroll", self.onScrollHandler);
			}else if(window.attachEvent){
				window.attachEvent("onscroll", self.onScrollHandler);
			}
			
			self.setupThumbnails();	
			
			self.resizeAndPosition(true);
			self.showDisable();
			self.disableOrEnableThumbnails();
			clearTimeout(self.hideCompleteId_to);
			clearTimeout(self.showCompleteId_to);
			self.mainHolder_do.setY(- self.stageHeight);
			
			if(self.isMobile_bl){
				self.showCompleteId_to = setTimeout(self.showCompleteHandler, 1200);
				TweenMax.to(self.mainHolder_do, .8, {y:0, delay:.4, ease:Expo.easeInOut});
			}else{
				self.showCompleteId_to = setTimeout(self.showCompleteHandler, 800);
				TweenMax.to(self.mainHolder_do, .8, {y:0, ease:Expo.easeInOut});
			}
		};
		
		this.showCompleteHandler = function(){
			self.hideDisable();
			self.resizeAndPosition(true);
			if(!self.areThumbnailsLoaded_bl){
				self.loadImages();
				self.areThumbnailsLoaded_bl = true;
			}
		};
		
		this.hide = function(){
			if(!self.isShowed_bl) return;
			self.isShowed_bl = false;
			
			clearTimeout(self.hideCompleteId_to);
			clearTimeout(self.showCompleteId_to);
			self.showDisable();
			self.hideCompleteId_to = setTimeout(self.hideCompleteHandler, 800);
			TweenMax.killTweensOf(self.mainHolder_do);
			TweenMax.to(self.mainHolder_do, .8, {y:-self.stageHeight, ease:Expo.easeInOut});
			
			if(window.addEventListener){
				window.removeEventListener("scroll", self.onScrollHandler);
			}else if(window.detachEvent){
				window.detachEvent("onscroll", self.onScrollHandler);
			}
			self.resizeAndPosition();
		};
		
		this.hideCompleteHandler = function(){
			if(FWDUtils.isIEAndLessThen9){
				document.getElementsByTagName("body")[0].removeChild(self.screen);
			}else{
				document.documentElement.removeChild(self.screen);
			}
			self.isOnDOM_bl = false;
			self.dispatchEvent(FWDRAPCategories.HIDE_COMPLETE);
		};
	
		this.init();
	};
	
	/* set prototype */
	FWDRAPCategories.setPrototype = function(){
		FWDRAPCategories.prototype = new FWDDisplayObject("div");
	};
	
	FWDRAPCategories.HIDE_COMPLETE = "hideComplete";

	FWDRAPCategories.prototype = null;
	window.FWDRAPCategories = FWDRAPCategories;
	
}());