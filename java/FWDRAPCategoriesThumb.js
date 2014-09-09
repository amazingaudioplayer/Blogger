/* FWDRAPCategoriesThumb */
(function (window){
	
	var FWDRAPCategoriesThumb = function(
			parent,
			pId, 
			backgroundImage_img,
			catThumbTextBk_img,
			thumbnailSelectedType_str,
			htmlContent
		){
		
		var self = this;
		var prototype = FWDRAPCategoriesThumb.prototype;
	
		this.backgroundImage_img = backgroundImage_img;
		this.catThumbTextBk_img = catThumbTextBk_img;
		this.canvas_el = null;
		this.htmlContent = htmlContent;
	
		this.simpleText_do = null;
		this.effectImage_do = null;
		this.imageHolder_do = null;
		this.normalImage_do = null;
		this.effectImage_do = null;
		this.dumy_do = null;
		
		this.thumbnailSelectedType_str = thumbnailSelectedType_str;
		
		this.id = pId;
		this.imageOriginalW;
		this.imageOriginalH;
		this.finalX;
		this.finalY;
		this.finalW;
		this.finalH;
		this.imageFinalX;
		this.imageFinalY;
		this.imageFinalW;
		this.imageFinalH;
		
		this.dispatchShowWithDelayId_to;
		
		this.isShowed_bl = false;
		this.hasImage_bl = false;
		this.isSelected_bl = false;
		this.isDisabled_bl = false;
		this.hasCanvas_bl = FWDRoyalAudioPlayer.hasCanvas;
		this.isMobile_bl = FWDUtils.isMobile;
		this.hasPointerEvent_bl = FWDUtils.hasPointerEvent;

		this.init = function(){
			self.getStyle().background = "url('" + self.backgroundImage_img.src + "')";
			self.setupMainContainers();
			self.setupDescription();
			self.setupDumy();
		};
		
		//#################################//
		/* set image */
		//#################################//
		this.setupMainContainers = function(){
			self.imageHolder_do = new FWDDisplayObject("div");
			self.addChild(self.imageHolder_do);
		};
		
		//#################################//
		/* setup dumy */
		//#################################//
		this.setupDumy = function(){
			self.dumy_do = new FWDDisplayObject("div");
			if(FWDUtils.isIE){
				self.dumy_do.setBkColor("#FFFFFF");
				self.dumy_do.setAlpha(0);
			}
			self.addChild(self.dumy_do);
		};
		
		//################################################//
		/* Setup title bar */
		//###############################################//
		this.setupDescription = function(){
			self.simpleText_do = new FWDDisplayObject("div");
			self.simpleText_do.getStyle().background = "url('" + self.catThumbTextBk_img.src + "')";
			if(FWDUtils.isFirefox){
				self.simpleText_do.hasTransform3d_bl = false;
				self.simpleText_do.hasTransform2d_bl = false;
			}
			self.simpleText_do.setBackfaceVisibility();
			self.simpleText_do.getStyle().width = "100%";
			self.simpleText_do.getStyle().fontFamily = "Arial";
			self.simpleText_do.getStyle().fontSize= "12px";
			self.simpleText_do.getStyle().textAlign = "left";
			self.simpleText_do.getStyle().color = "#FFFFFF";
			self.simpleText_do.getStyle().fontSmoothing = "antialiased";
			self.simpleText_do.getStyle().webkitFontSmoothing = "antialiased";
			self.simpleText_do.getStyle().textRendering = "optimizeLegibility";		
			self.simpleText_do.setInnerHTML(self.htmlContent);
			self.addChild(self.simpleText_do);
		};
		
		this.positionDescription = function(){
			self.simpleText_do.setY(parseInt(self.finalH - self.simpleText_do.getHeight()));
		};
		
		//#################################//
		/* setup black an white image */
		//#################################//
		this.setupBlackAndWhiteImage = function(image){
			if(!self.hasCanvas_bl || self.thumbnailSelectedType_str == "opacity") return;
			var canvas = document.createElement("canvas");

			var ctx = canvas.getContext("2d");
			
			canvas.width = self.imageOriginalW;
			canvas.height = self.imageOriginalH; 
			ctx.drawImage(image, 0, 0); 
			
			var imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
			
			var d = imgPixels.data;
			
			if(self.thumbnailSelectedType_str == "threshold"){
				//treshhold
				for (var i=0; i<d.length; i+=4) {
				    var r = d[i];
				    var g = d[i+1];
				    var b = d[i+2];
				    var v = (0.2126*r + 0.7152*g + 0.0722*b >= 150) ? 255 : 0;
				    d[i] = d[i+1] = d[i+2] = v;
				}
			}else if(self.thumbnailSelectedType_str == "blackAndWhite"){
				//grayscale
				for (var i=0; i<d.length; i+=4) {
					var r = d[i];
				    var g = d[i+1];
				    var b = d[i+2];
				    // CIE luminance for the RGB
				    // The human eye is bad at seeing red and blue, so we de-emphasize them.
				    var v = 0.2126*r + 0.7152*g + 0.0722*b;
				    d[i] = d[i+1] = d[i+2] = v;
				}
			}
		
			ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
			
			self.effectImage_do = new FWDDisplayObject("canvas");
			self.effectImage_do.screen = canvas;
			self.effectImage_do.setAlpha(.9);
			
			self.effectImage_do.setMainProperties();
		};
	
		//#################################//
		/* set image */
		//#################################//
		this.setImage = function(image){
			self.normalImage_do = new FWDDisplayObject("img");
			self.normalImage_do.setScreen(image);
			
			self.imageOriginalW = self.normalImage_do.w;
			self.imageOriginalH = self.normalImage_do.h;
			
			self.setButtonMode(true);
			self.setupBlackAndWhiteImage(image);
			
			self.resizeImage();
			
			self.imageHolder_do.setX(parseInt(self.finalW/2));
			self.imageHolder_do.setY(parseInt(self.finalH/2));
			self.imageHolder_do.setWidth(0);
			self.imageHolder_do.setHeight(0);
			
			self.normalImage_do.setX(- parseInt(self.normalImage_do.w/2));
			self.normalImage_do.setY(- parseInt(self.normalImage_do.h/2));
			self.normalImage_do.setAlpha(0);
			
			if(self.effectImage_do){
				self.effectImage_do.setX(- parseInt(self.normalImage_do.w/2));
				self.effectImage_do.setY(- parseInt(self.normalImage_do.h/2));
				self.effectImage_do.setAlpha(0.01);
			}
			
			TweenMax.to(self.imageHolder_do, .8, {
				x:0, 
				y:0,
				w:self.finalW,
				h:self.finalH, 
				ease:Expo.easeInOut});
			
			TweenMax.to(self.normalImage_do, .8, {
				alpha:1,
				x:self.imageFinalX, 
				y:self.imageFinalY, 
				ease:Expo.easeInOut});
			
			if(self.effectImage_do){
				TweenMax.to(self.effectImage_do, .8, {
					x:self.imageFinalX, 
					y:self.imageFinalY, 
					ease:Expo.easeInOut});
			}
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.screen.addEventListener("MSPointerUp", self.onMouseUp);
					self.screen.addEventListener("MSPointerOver", self.onMouseOver);
					self.screen.addEventListener("MSPointerOut", self.onMouseOut);
				}else{
					self.screen.addEventListener("mouseup", self.onMouseUp);
				}
			}else if(self.screen.addEventListener){	
				self.screen.addEventListener("mouseover", self.onMouseOver);
				self.screen.addEventListener("mouseout", self.onMouseOut);
				self.screen.addEventListener("mouseup", self.onMouseUp);
			}else if(self.screen.attachEvent){
				self.screen.attachEvent("onmouseover", self.onMouseOver);
				self.screen.attachEvent("onmouseout", self.onMouseOut);
				self.screen.attachEvent("onmouseup", self.onMouseUp);
			}
		
			this.imageHolder_do.addChild(self.normalImage_do);
			if(self.effectImage_do) self.imageHolder_do.addChild(self.effectImage_do);
			
			this.hasImage_bl = true;
			
			if(self.id == parent.id){
				self.disable();
			}
			
		};
		
		self.onMouseOver = function(e, animate){
			if(self.isDisabled_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				self.setSelectedState(true);
			}
		};
			
		self.onMouseOut = function(e){
			if(self.isDisabled_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				self.setNormalState(true);
			}
		};
		
		self.onMouseUp = function(e){
			if(self.isDisabled_bl || e.button == 2) return;
			if(e.preventDefault) e.preventDefault();
			self.dispatchEvent(FWDRAPCategoriesThumb.MOUSE_UP, {id:self.id});
		};
	
		//#################################//
		/* resize thumbnail*/
		//#################################//
		this.resizeAndPosition = function(animate, dl){
			
			TweenMax.killTweensOf(self);
			TweenMax.killTweensOf(self.imageHolder_do);
			
			if(animate){
				TweenMax.to(self, .8, {
					x:self.finalX, 
					y:self.finalY,
					delay:dl,
					ease:Expo.easeInOut});
			}else{
				self.setX(self.finalX);
				self.setY(self.finalY);
			}
			
			self.setWidth(self.finalW);
			self.setHeight(self.finalH);
			self.imageHolder_do.setX(0);
			self.imageHolder_do.setY(0);
			self.imageHolder_do.setWidth(self.finalW);
			self.imageHolder_do.setHeight(self.finalH);
			
			self.dumy_do.setWidth(self.finalW);
			self.dumy_do.setHeight(self.finalH);
			
			self.resizeImage();
			self.positionDescription();
		};
	
		//#################################//
		/* resize image*/
		//#################################//
		this.resizeImage = function(animate){
			
			if(!self.normalImage_do) return;
			TweenMax.killTweensOf(self.normalImage_do);
			var scX = self.finalW/self.imageOriginalW;
			var scY = self.finalH/self.imageOriginalH;
			var ttsc;
			
			if(scX >= scY){
				ttsc = scX;
			}else{
				ttsc = scY;
			}
			
			self.imageFinalW = Math.ceil(ttsc * self.imageOriginalW);
			self.imageFinalH = Math.ceil(ttsc * self.imageOriginalH);
			self.imageFinalX = Math.round((self.finalW - self.imageFinalW)/2);
			self.imageFinalY = Math.round((self.finalH - self.imageFinalH)/2);
			
			if(self.effectImage_do){
				TweenMax.killTweensOf(self.effectImage_do);
				self.effectImage_do.setX(self.imageFinalX);
				self.effectImage_do.setY(self.imageFinalY);
				self.effectImage_do.setWidth(self.imageFinalW);
				self.effectImage_do.setHeight(self.imageFinalH);
				if(self.isDisabled_bl) self.setSelectedState(false, true);
			}
			
			self.normalImage_do.setX(self.imageFinalX);
			self.normalImage_do.setY(self.imageFinalY);
			self.normalImage_do.setWidth(self.imageFinalW);
			self.normalImage_do.setHeight(self.imageFinalH);
			
			if(self.isDisabled_bl){
				self.normalImage_do.setAlpha(.3);
			}else{
				self.normalImage_do.setAlpha(1);
			}
		};
		
		//##############################//
		/* set normal/selected state*/
		//##############################//
		this.setNormalState = function(animate){
			if(!self.isSelected_bl) return;
			self.isSelected_bl = false;
			if(self.thumbnailSelectedType_str == "threshold" || self.thumbnailSelectedType_str == "blackAndWhite"){
				if(animate){
					TweenMax.to(self.effectImage_do, 1, {alpha:.01, ease:Quart.easeOut});
				}else{
					self.effectImage_do.setAlpha(.01);
				}
			}else if(self.thumbnailSelectedType_str == "opacity"){
				if(animate){
					TweenMax.to(self.normalImage_do, 1, {alpha:1, ease:Quart.easeOut});
				}else{
					self.normalImage_do.setAlpha(1);
				}
			}
		};
		
		this.setSelectedState = function(animate, overwrite){
			if(self.isSelected_bl && !overwrite) return;
			self.isSelected_bl = true;
			if(self.thumbnailSelectedType_str == "threshold" || self.thumbnailSelectedType_str == "blackAndWhite"){
				if(animate){
					TweenMax.to(self.effectImage_do, 1, {alpha:1, ease:Expo.easeOut});
				}else{
					self.effectImage_do.setAlpha(1);
				}
			}else if(self.thumbnailSelectedType_str == "opacity"){
				if(animate){
					TweenMax.to(self.normalImage_do, 1, {alpha:.3, ease:Expo.easeOut});
				}else{
					self.normalImage_do.setAlpha(.3);
				}
			}
		};
		
		//###############################//
		/* enable / disable */
		//##############################//
		this.enable = function(){
			if(!self.hasImage_bl) return;
			self.isDisabled_bl = false;
			self.setButtonMode(true);
			self.setNormalState(true);
		};
		
		this.disable = function(){
			if(!self.hasImage_bl) return;
			self.isDisabled_bl = true;
			self.setButtonMode(false);
			self.setSelectedState(true);
		};
	
		this.init();
	};
	
	/* set prototype */
	FWDRAPCategoriesThumb.setPrototype = function(){
		FWDRAPCategoriesThumb.prototype = new FWDDisplayObject("div");
	};
	
	
	FWDRAPCategoriesThumb.MOUSE_UP = "onMouseUp";
	
	FWDRAPCategoriesThumb.prototype = null;
	window.FWDRAPCategoriesThumb = FWDRAPCategoriesThumb;
}(window));