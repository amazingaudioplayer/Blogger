/* FWDRAPSimpleButton */
(function (window){
var FWDRAPSimpleButton = function(nImg, sImg, dImg){
		
		var self = this;
		var prototype = FWDRAPSimpleButton.prototype;
		
		this.nImg = nImg;
		this.sImg = sImg;
		this.dImg = dImg;
		
		this.n_sdo;
		this.s_sdo;
		this.d_sdo;
		
		this.toolTipLabel_str;
		
		this.totalWidth = this.nImg.width;
		this.totalHeight = this.nImg.height;
		
		this.isSetToDisabledState_bl = false;
		this.isDisabled_bl = false;
		this.isDisabledForGood_bl = false;
		this.isSelectedFinal_bl = false;
		this.isActive_bl = false;
		this.isMobile_bl = FWDUtils.isMobile;
		this.hasPointerEvent_bl = FWDUtils.hasPointerEvent;
	
		//##########################################//
		/* initialize self */
		//##########################################//
		self.init = function(){
			self.setupMainContainers();
		};
		
		//##########################################//
		/* setup main containers */
		//##########################################//
		self.setupMainContainers = function(){
			self.n_sdo = new FWDDisplayObject("img");	
			self.n_sdo.setScreen(self.nImg);
			self.s_sdo = new FWDDisplayObject("img");
			self.s_sdo.setScreen(self.sImg);
			
			self.s_sdo.setAlpha(0);
			self.addChild(self.n_sdo);
			self.addChild(self.s_sdo);
			//self.setBkColor("#FF0000")
			
			if(self.dImg){
				self.d_sdo = new FWDDisplayObject("img");	
				self.d_sdo.setScreen(self.dImg);
				if(self.isMobile_bl){
					self.d_sdo.setX(-100);
				}else{
					self.d_sdo.setAlpha(0);
				}
				self.addChild(self.d_sdo);
			};
			
			
			self.setWidth(self.nImg.width);
			self.setHeight(self.nImg.height);
			self.setButtonMode(true);
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.screen.addEventListener("MSPointerDown", self.onMouseUp);
					self.screen.addEventListener("MSPointerOver", self.onMouseOver);
					self.screen.addEventListener("MSPointerOut", self.onMouseOut);
				}else{
					self.screen.addEventListener("touchend", self.onMouseUp);
				}
			}else if(self.screen.addEventListener){	
				self.screen.addEventListener("mouseover", self.onMouseOver);
				self.screen.addEventListener("mouseout", self.onMouseOut);
				self.screen.addEventListener("mousedown", self.onMouseUp);
			}else if(self.screen.attachEvent){
				self.screen.attachEvent("onmouseover", self.onMouseOver);
				self.screen.attachEvent("onmouseout", self.onMouseOut);
				self.screen.attachEvent("onmousedown", self.onMouseUp);
			}
		};
		
		self.onMouseOver = function(e){
			if(self.isDisabledForGood_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				if(self.isDisabled_bl || self.isSelectedFinal_bl) return;
				self.dispatchEvent(FWDRAPSimpleButton.MOUSE_OVER, {e:e});
				self.setSelectedState();
			}
		};
			
		self.onMouseOut = function(e){
			if(self.isDisabledForGood_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				if(self.isDisabled_bl || self.isSelectedFinal_bl) return;
				self.dispatchEvent(FWDRAPSimpleButton.MOUSE_OUT, {e:e});
				self.setNormalState();
			}
		};
		
		self.onMouseUp = function(e){
			if(self.isDisabledForGood_bl) return;
			if(e.preventDefault) e.preventDefault();
			if(self.isDisabled_bl || e.button == 2) return;
			self.dispatchEvent(FWDRAPSimpleButton.MOUSE_UP, {e:e});
		};
		
		//##############################//
		// set select / deselect final.
		//##############################//
		self.setSelected = function(){
			self.isSelectedFinal_bl = true;
			TweenMax.killTweensOf(self.s_sdo);
			TweenMax.to(self.s_sdo, .8, {alpha:1, ease:Expo.easeOut});
		};
		
		self.setUnselected = function(){
			self.isSelectedFinal_bl = false;
			TweenMax.to(self.s_sdo, .8, {alpha:0, delay:.1, ease:Expo.easeOut});
		};
		
		//####################################//
		/* Set normal / selected state */
		//####################################//
		this.setNormalState = function(){
			TweenMax.killTweensOf(self.s_sdo);
			TweenMax.to(self.s_sdo, .5, {alpha:0, ease:Expo.easeOut});	
		};
		
		this.setSelectedState = function(){
			TweenMax.killTweensOf(self.s_sdo);
			TweenMax.to(self.s_sdo, .5, {alpha:1, delay:.1, ease:Expo.easeOut});
		};
		
		//####################################//
		/* Disable / enable */
		//####################################//
		this.setDisabledState = function(){
			if(self.isSetToDisabledState_bl) return;
			self.isSetToDisabledState_bl = true;
			if(self.isMobile_bl){
				self.d_sdo.setX(0);
			}else{
				TweenMax.killTweensOf(self.d_sdo);
				TweenMax.to(self.d_sdo, .8, {alpha:1, ease:Expo.easeOut});
			}
		};
		
		this.setEnabledState = function(){
			if(!self.isSetToDisabledState_bl) return;
			self.isSetToDisabledState_bl = false;
			if(self.isMobile_bl){
				self.d_sdo.setX(-100);
			}else{
				TweenMax.killTweensOf(self.d_sdo);
				TweenMax.to(self.d_sdo, .8, {alpha:0, delay:.1, ease:Expo.easeOut});
			}
		};
		
		this.disable = function(){
			if(self.isDisabledForGood_bl) return;
			self.isDisabled_bl = true;
			self.setButtonMode(false);
		};
		
		this.enable = function(){
			if(self.isDisabledForGood_bl) return;
			self.isDisabled_bl = false;
			self.setButtonMode(true);
		};
		
		this.disableForGood = function(){
			self.isDisabledForGood_bl = true;
			self.setButtonMode(false);
		};
		
		self.init();
	};
	
	/* set prototype */
	FWDRAPSimpleButton.setPrototype = function(){
		FWDRAPSimpleButton.prototype = null;
		FWDRAPSimpleButton.prototype = new FWDDisplayObject("div");
	};
	
	FWDRAPSimpleButton.CLICK = "onClick";
	FWDRAPSimpleButton.MOUSE_OVER = "onMouseOver";
	FWDRAPSimpleButton.MOUSE_OUT = "onMouseOut";
	FWDRAPSimpleButton.MOUSE_UP = "onMouseDown";
	
	FWDRAPSimpleButton.prototype = null;
	window.FWDRAPSimpleButton = FWDRAPSimpleButton;
}(window));