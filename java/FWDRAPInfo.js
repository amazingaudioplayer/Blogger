/* Info screen */
(function (window){
	
	var FWDRAPInfo = function(parent){
		
		var self = this;
		var prototype = FWDRAPInfo.prototype;
		
		/* init */
		this.init = function(){
			self.setResizableSizeAfterParent();
			this.setBkColor("#FF0000");
			this.getStyle().color = "#000000";
			this.getStyle().padding = "2px";
			if(self.screen.addEventListener){
				self.screen.addEventListener("click", self.closeWindow);
			}else if(self.screen.attachEvent){
				self.screen.attachEvent("onclick", self.closeWindow);
			}
		};
		
		this.showText = function(txt){
			this.setInnerHTML(txt  + "<p><font color='#FFFFFF'>Click or tap to close this window.</font></p>");
		};
		
		this.closeWindow = function(){
			try{parent.main_do.removeChild(self);}catch(e){}
		};
		
		this.init();
	};
		
	/* set prototype */
	FWDRAPInfo.setPrototype = function(){
		FWDRAPInfo.prototype = new FWDDisplayObject("div", "relative");
	};
	
	FWDRAPInfo.prototype = null;
	window.FWDRAPInfo = FWDRAPInfo;
}(window));