/* Thumb */
(function (window){
	
	var FWDConsole = function(){
		
		var self  = this;
		var prototype = FWDConsole.prototype;
		
		this.main_do = null;
	
		this.init = function(){
			this.setupScreen();
			window.onerror = this.showError;
			this.screen.style.zIndex = 99999999999;
			setTimeout(this.addConsoleToDom, 100);
			setInterval(this.position, 100);
		};
		
		this.position = function(){
			var scrollOffsets = FWDUtils.getScrollOffsets();
			self.setX(scrollOffsets.x );
			self.setY(scrollOffsets.y);
		};
		
		this.addConsoleToDom  = function(){
			if(navigator.userAgent.toLowerCase().indexOf("msie 7") != -1){
				document.getElementsByTagName("body")[0].appendChild(self.screen);
			}else{
				document.documentElement.appendChild(self.screen);
			}
		};
		
		/* setup screens */
		this.setupScreen = function(){
			this.main_do = new FWDDisplayObject("div", "absolute");
			this.main_do.setOverflow("auto");
			this.main_do.setWidth(200);
			this.main_do.setHeight(300);
			this.setWidth(200);
			this.setHeight(300);
			this.main_do.setBkColor("#FFFFFF");
			this.addChild(this.main_do);
		};
		
		this.showError = function(message, url, linenumber) {
			var currentInnerHTML = self.main_do.getInnerHTML() + "<br>" + "JavaScript error: " + message + " on line " + linenumber + " for " + url;
			self.main_do.setInnerHTML(currentInnerHTML);
			self.main_do.screen.scrollTop = self.main_do.screen.scrollHeight;
		};
		
		this.log = function(message){
			var currentInnerHTML = self.main_do.getInnerHTML() + "<br>" + message;
			self.main_do.setInnerHTML(currentInnerHTML);  
			self.main_do.getScreen().scrollTop = 10000;
		};
		
		this.init();
	};
	
	/* set prototype */
    FWDConsole.setPrototype = function(){
    	FWDConsole.prototype = new FWDDisplayObject("div", "absolute");
    };
    
    FWDConsole.prototype = null;
	window.FWDConsole = FWDConsole;
}(window));/* Display object */
(function (window){
	/*
	 * @ type values: div, img.
	 * @ positon values: relative, absolute.
	 * @ positon values: hidden.
	 * @ display values: block, inline-block, self applies only if the position is relative.
	 */
	var FWDDisplayObject = function(type, position, overflow, display){
		
		var self = this;
		self.listeners = {events_ar:[]};
		
		if(type == "div" || type == "img" || type == "canvas"){
			self.type = type;	
		}else{
			throw Error("Type is not valid! " + type);
		}
	
		this.children_ar = [];
		this.style;
		this.screen;
		this.transform;
		this.position = position || "absolute";
		this.overflow = overflow || "hidden";
		this.display = display || "inline-block";
		this.visible = true;
		this.buttonMode;
		this.x = 0;
		this.y = 0;
		this.w = 0;
		this.h = 0;
		this.rect;
		this.alpha = 1;
		this.innerHTML = "";
		this.opacityType = "";
		this.isHtml5_bl = false;
		
		this.hasTransform3d_bl =  FWDUtils.hasTransform3d;
		this.hasTransform2d_bl =  FWDUtils.hasTransform2d;
		if(FWDUtils.isIE || (FWDUtils.isIE11 && !FWDUtils.isMobile)){
			self.hasTransform3d_bl = false;
			self.hasTransform2d_bl = false;
		} 

		this.hasBeenSetSelectable_bl = false;
		
		//##############################//
		/* init */
		//#############################//
		self.init = function(){
			self.setScreen();
		};	
		
		//######################################//
		/* check if it supports transforms. */
		//######################################//
		self.getTransform = function() {
		    var properties = ['transform', 'msTransform', 'WebkitTransform', 'MozTransform', 'OTransform'];
		    var p;
		    while (p = properties.shift()) {
		       if (typeof self.screen.style[p] !== 'undefined') {
		            return p;
		       }
		    }
		    return false;
		};
		
		//######################################//
		/* set opacity type */
		//######################################//
		self.getOpacityType = function(){
			var opacityType;
			if (typeof self.screen.style.opacity != "undefined") {//ie9+ 
				opacityType = "opacity";
			}else{ //ie8
				opacityType = "filter";
			}
			return opacityType;
		};
		
		//######################################//
		/* setup main screen */
		//######################################//
		self.setScreen = function(element){
			if(self.type == "img" && element){
				self.screen = element;
				self.setMainProperties();
			}else{
				self.screen = document.createElement(self.type);
				self.setMainProperties();
			}
		};
		
		//########################################//
		/* set main properties */
		//########################################//
		self.setMainProperties = function(){
			
			self.transform = self.getTransform();
			self.setPosition(self.position);
			self.setOverflow(self.overflow);
			self.opacityType = self.getOpacityType();
			
			if(self.opacityType == "opacity") self.isHtml5_bl = true;
			
			if(self.opacityType == "filter") self.screen.style.filter = "inherit";
			self.screen.style.left = "0px";
			self.screen.style.top = "0px";
			self.screen.style.margin = "0px";
			self.screen.style.padding = "0px";
			self.screen.style.maxWidth = "none";
			self.screen.style.maxHeight = "none";
			self.screen.style.border = "none";
			self.screen.style.lineHeight = "1";
			self.screen.style.backgroundColor = "transparent";
			self.screen.style.backfaceVisibility = "hidden";
			self.screen.style.webkitBackfaceVisibility = "hidden";
			self.screen.style.MozBackfaceVisibility = "hidden";	
			self.screen.style.MozImageRendering = "optimizeSpeed";	
			self.screen.style.WebkitImageRendering = "optimizeSpeed";
			
			if(type == "img"){
				self.setWidth(self.screen.width);
				self.setHeight(self.screen.height);
			}
		};
			
		self.setBackfaceVisibility =  function(){
			self.screen.style.backfaceVisibility = "visible";
			self.screen.style.webkitBackfaceVisibility = "visible";
			self.screen.style.MozBackfaceVisibility = "visible";		
		};
		
		//###################################################//
		/* set / get various peoperties.*/
		//###################################################//
		self.setSelectable = function(val){
			if(!val){
				self.screen.style.userSelect = "none";
				self.screen.style.MozUserSelect = "none";
				self.screen.style.webkitUserSelect = "none";
				self.screen.style.khtmlUserSelect = "none";
				self.screen.style.oUserSelect = "none";
				self.screen.style.msUserSelect = "none";
				self.screen.msUserSelect = "none";
				self.screen.ondragstart = function(e){return false;};
				self.screen.onselectstart = function(){return false;};
				self.screen.ontouchstart = function(){return false;};
				self.screen.style.webkitTouchCallout='none';
				self.hasBeenSetSelectable_bl = true;
			}
		};
		
		self.getScreen = function(){
			return self.screen;
		};
		
		self.setVisible = function(val){
			self.visible = val;
			if(self.visible == true){
				self.screen.style.visibility = "visible";
			}else{
				self.screen.style.visibility = "hidden";
			}
		};
		
		self.getVisible = function(){
			return self.visible;
		};
			
		self.setResizableSizeAfterParent = function(){
			self.screen.style.width = "100%";
			self.screen.style.height = "100%";
		};
		
		self.getStyle = function(){
			return self.screen.style;
		};
		
		self.setOverflow = function(val){
			self.overflow = val;
			self.screen.style.overflow = self.overflow;
		};
		
		self.setPosition = function(val){
			self.position = val;
			self.screen.style.position = self.position;
		};
		
		self.setDisplay = function(val){
			self.display = val;
			self.screen.style.display = self.display;
		};
		
		self.setButtonMode = function(val){
			self.buttonMode = val;
			if(self.buttonMode ==  true){
				self.screen.style.cursor = "pointer";
			}else{
				self.screen.style.cursor = "default";
			}
		};
		
		self.setBkColor = function(val){
			self.screen.style.backgroundColor = val;
		};
		
		self.setInnerHTML = function(val){
			self.innerHTML = val;
			self.screen.innerHTML = self.innerHTML;
		};
		
		self.getInnerHTML = function(){
			return self.innerHTML;
		};
		
		self.getRect = function(){
			return self.screen.getBoundingClientRect();
		};
		
		self.setAlpha = function(val){
			self.alpha = val;
			if(self.opacityType == "opacity"){
				self.screen.style.opacity = self.alpha;
			}else if(self.opacityType == "filter"){
				self.screen.style.filter = "alpha(opacity=" + self.alpha * 100 + ")";
				self.screen.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + Math.round(self.alpha * 100) + ")";
			}
		};
		
		self.getAlpha = function(){
			return self.alpha;
		};
		
		self.getRect = function(){
			return self.screen.getBoundingClientRect();
		};
		
		self.getGlobalX = function(){
			return self.getRect().left;
		};
		
		self.getGlobalY = function(){
			return self.getRect().top;
		};
		
		self.setX = function(val){
			self.x = val;
			if(self.hasTransform3d_bl){
				self.screen.style[self.transform] = 'translate3d(' + self.x + 'px,' + self.y + 'px,0)';
			}else if(self.hasTransform2d_bl){
				self.screen.style[self.transform] = 'translate(' + self.x + 'px,' + self.y + 'px)';
			}else{
				self.screen.style.left = self.x + "px";
			}
		};
		
		self.getX = function(){
			return  self.x;
		};
		
		self.setY = function(val){
			self.y = val;
			if(self.hasTransform3d_bl){
				self.screen.style[self.transform] = 'translate3d(' + self.x + 'px,' + self.y + 'px,0)';	
			}else if(self.hasTransform2d_bl){
				self.screen.style[self.transform] = 'translate(' + self.x + 'px,' + self.y + 'px)';
			}else{
				//if(isNaN(self.y)) console.log(arguments.callee.caller.toString())
				self.screen.style.top = self.y + "px";
			}
		};
		
		self.getY = function(){
			return  self.y;
		};
		
		self.setWidth = function(val){
			self.w = val;
			if(self.type == "img"){
				self.screen.width = self.w;
			}else{
				self.screen.style.width = self.w + "px";
			}
		
		};
		
		self.getWidth = function(){
			if(self.type == "div"){
				if(self.screen.offsetWidth != 0) return  self.screen.offsetWidth;
				return self.w;
			}else if(self.type == "img"){
				if(self.screen.offsetWidth != 0) return  self.screen.offsetWidth;
				if(self.screen.width != 0) return  self.screen.width;
				return self._w;
			}else if( self.type == "canvas"){
				if(self.screen.offsetWidth != 0) return  self.screen.offsetWidth;
				return self.w;
			}
		};
		
		self.setHeight = function(val){
			self.h = val;
			if(self.type == "img"){
				self.screen.height = self.h;
			}else{
				self.screen.style.height = self.h + "px";
			}
		};
		
		self.getHeight = function(){
			if(self.type == "div"){
				if(self.screen.offsetHeight != 0) return  self.screen.offsetHeight;
				return self.h;
			}else if(self.type == "img"){
				if(self.screen.offsetHeight != 0) return  self.screen.offsetHeight;
				if(self.screen.height != 0) return  self.screen.height;
				return self.h;
			}else if(self.type == "canvas"){
				if(self.screen.offsetHeight != 0) return  self.screen.offsetHeight;
				return self.h;
			}
		};
		
		//#####################################//
		/* DOM list */
		//#####################################//
		self.addChild = function(e){
			if(self.contains(e)){	
				self.children_ar.splice(FWDUtils.indexOfArray(self.children_ar, e), 1);
				self.children_ar.push(e);
				self.screen.appendChild(e.screen);
			}else{
				self.children_ar.push(e);
				self.screen.appendChild(e.screen);
			}
		};
		
		self.removeChild = function(e){
			if(self.contains(e)){
				self.children_ar.splice(FWDUtils.indexOfArray(self.children_ar, e), 1);
				self.screen.removeChild(e.screen);
			}else{
				//console.log(arguments.callee.caller.toString())
				throw Error("##removeChild()## Child dose't exist, it can't be removed!");
			};
		};
		
		self.contains = function(e){
			if(FWDUtils.indexOfArray(self.children_ar, e) == -1){
				return false;
			}else{
				return true;
			}
		};
		
		self.addChildAt = function(e, index){
			if(self.getNumChildren() == 0){
				self.children_ar.push(e);
				self.screen.appendChild(e.screen);
			}else if(index == 1){
				self.screen.insertBefore(e.screen, self.children_ar[0].screen);
				self.screen.insertBefore(self.children_ar[0].screen, e.screen);	
				if(self.contains(e)){
					self.children_ar.splice(FWDUtils.indexOfArray(self.children_ar, e), 1, e);
				}else{
					self.children_ar.splice(FWDUtils.indexOfArray(self.children_ar, e), 0, e);
				}
			}else{
				if(index < 0  || index > self.getNumChildren() -1) throw Error("##getChildAt()## Index out of bounds!");
				
				self.screen.insertBefore(e.screen, self.children_ar[index].screen);
				if(self.contains(e)){
					self.children_ar.splice(FWDUtils.indexOfArray(self.children_ar, e), 1, e);
				}else{
					self.children_ar.splice(FWDUtils.indexOfArray(self.children_ar, e), 0, e);
				}
			}
		};
		
		self.getChildAt = function(index){
			if(index < 0  || index > self.getNumChildren() -1) throw Error("##getChildAt()## Index out of bounds!");
			if(self.getNumChildren() == 0) throw Errror("##getChildAt## Child dose not exist!");
			return self.children_ar[index];
		};
		
		self.removeChildAtZero = function(){
			self.screen.removeChild(self.children_ar[0].screen);
			self.children_ar.shift();
		};
		
		self.getNumChildren = function(){
			return self.children_ar.length;
		};
		
		
		//################################//
		/* event dispatcher */
		//#################################//
		self.addListener = function (type, listener){
	    	
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	if(typeof listener != "function") throw Error("listener must be of type Function.");
	    	
	    	
	        var event = {};
	        event.type = type;
	        event.listener = listener;
	        event.target = this;
	        this.listeners.events_ar.push(event);
	    };
	    
	    self.dispatchEvent = function(type, props){
	    	if(this.listeners == null) return;
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	
	        for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
	        	if(this.listeners.events_ar[i].target === this && this.listeners.events_ar[i].type === type){		
	    	        if(props){
	    	        	for(var prop in props){
	    	        		this.listeners.events_ar[i][prop] = props[prop];
	    	        	}
	    	        }
	        		this.listeners.events_ar[i].listener.call(this, this.listeners.events_ar[i]);
	        	}
	        }
	    };
	    
	    self.removeListener = function(type, listener){
	    	
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	if(typeof listener != "function") throw Error("listener must be of type Function." + type);
	    	
	        for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
	        	if(this.listeners.events_ar[i].target === this 
	        			&& this.listeners.events_ar[i].type === type
	        			&& this.listeners.events_ar[i].listener ===  listener
	        	){
	        		this.listeners.events_ar.splice(i,1);
	        		break;
	        	}
	        }  
	    };
	    
	    //###########################################//
	    /* destroy methods*/
	    //###########################################//
		self.disposeImage = function(){
			if(self.type == "img") self.screen.src = null;
		};
		
		
		self.destroy = function(){
			
			//try{self.screen.parentNode.removeChild(self.screen);}catch(e){};
			
			if(self.hasBeenSetSelectable_bl){
				self.screen.ondragstart = null;
				self.screen.onselectstart = null;
				self.screen.ontouchstart = null;
			};
			
			self.screen.removeAttribute("style");
			
			//destroy properties
			self.listeners = [];
			self.listeners = null;
			self.children_ar = [];
			self.children_ar = null;
			self.style = null;
			self.screen = null;
			self.transform = null;
			self.position = null;
			self.overflow = null;
			self.display = null;
			self.visible = null;
			self.buttonMode = null;
			self.x = null;
			self.y = null;
			self.w = null;
			self.h = null;
			self.rect = null;
			self.alpha = null;
			self.innerHTML = null;
			self.opacityType = null;
			self.isHtml5_bl = null;
		
			self.hasTransform3d_bl = null;
			self.hasTransform2d_bl = null;
			self = null;
		};
		
	    /* init */
		self.init();
	};
	
	window.FWDDisplayObject = FWDDisplayObject;
}(window));if(typeof asual=="undefined"){var asual={}}if(typeof asual.util=="undefined"){asual.util={}}asual.util.Browser=new function(){var b=navigator.userAgent.toLowerCase(),a=/webkit/.test(b),e=/opera/.test(b),c=/msie/.test(b)&&!/opera/.test(b),d=/mozilla/.test(b)&&!/(compatible|webkit)/.test(b),f=parseFloat(c?b.substr(b.indexOf("msie")+4):(b.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[0,"0"])[1]);this.toString=function(){return"[class Browser]"};this.getVersion=function(){return f};this.isMSIE=function(){return c};this.isSafari=function(){return a};this.isOpera=function(){return e};this.isMozilla=function(){return d}};asual.util.Events=new function(){var c="DOMContentLoaded",j="onstop",k=window,h=document,b=[],a=asual.util,e=a.Browser,d=e.isMSIE(),g=e.isSafari();this.toString=function(){return"[class Events]"};this.addListener=function(n,l,m){b.push({o:n,t:l,l:m});if(!(l==c&&(d||g))){if(n.addEventListener){n.addEventListener(l,m,false)}else{if(n.attachEvent){n.attachEvent("on"+l,m)}}}};this.removeListener=function(p,m,n){for(var l=0,o;o=b[l];l++){if(o.o==p&&o.t==m&&o.l==n){b.splice(l,1);break}}if(!(m==c&&(d||g))){if(p.removeEventListener){p.removeEventListener(m,n,false)}else{if(p.detachEvent){p.detachEvent("on"+m,n)}}}};var i=function(){for(var m=0,l;l=b[m];m++){if(l.t!=c){a.Events.removeListener(l.o,l.t,l.l)}}};var f=function(){if(h.readyState=="interactive"){function l(){h.detachEvent(j,l);i()}h.attachEvent(j,l);k.setTimeout(function(){h.detachEvent(j,l)},0)}};if(d||g){(function(){try{if((d&&h.body)||!/loaded|complete/.test(h.readyState)){h.documentElement.doScroll("left")}}catch(m){return setTimeout(arguments.callee,0)}for(var l=0,m;m=b[l];l++){if(m.t==c){m.l.call(null)}}})()}if(d){k.attachEvent("onbeforeunload",f)}this.addListener(k,"unload",i)};asual.util.Functions=new function(){this.toString=function(){return"[class Functions]"};this.bind=function(f,b,e){for(var c=2,d,a=[];d=arguments[c];c++){a.push(d)}return function(){return f.apply(b,a)}}};var FWDAddressEvent=function(d){this.toString=function(){return"[object FWDAddressEvent]"};this.type=d;this.target=[FWDAddress][0];this.value=FWDAddress.getValue();this.path=FWDAddress.getPath();this.pathNames=FWDAddress.getPathNames();this.parameters={};var c=FWDAddress.getParameterNames();for(var b=0,a=c.length;b<a;b++){this.parameters[c[b]]=FWDAddress.getParameter(c[b])}this.parameterNames=c};FWDAddressEvent.INIT="init";FWDAddressEvent.CHANGE="change";FWDAddressEvent.INTERNAL_CHANGE="internalChange";FWDAddressEvent.EXTERNAL_CHANGE="externalChange";var FWDAddress=new function(){var _getHash=function(){var index=_l.href.indexOf("#");return index!=-1?_ec(_dc(_l.href.substr(index+1))):""};var _getWindow=function(){try{top.document;return top}catch(e){return window}};var _strictCheck=function(value,force){if(_opts.strict){value=force?(value.substr(0,1)!="/"?"/"+value:value):(value==""?"/":value)}return value};var _ieLocal=function(value,direction){return(_msie&&_l.protocol=="file:")?(direction?_value.replace(/\?/,"%3F"):_value.replace(/%253F/,"?")):value};var _searchScript=function(el){if(el.childNodes){for(var i=0,l=el.childNodes.length,s;i<l;i++){if(el.childNodes[i].src){_url=String(el.childNodes[i].src)}if(s=_searchScript(el.childNodes[i])){return s}}}};var _titleCheck=function(){if(_d.title!=_title&&_d.title.indexOf("#")!=-1){_d.title=_title}};var _listen=function(){if(!_silent){var hash=_getHash();var diff=!(_value==hash);if(_safari&&_version<523){if(_length!=_h.length){_length=_h.length;if(typeof _stack[_length-1]!=UNDEFINED){_value=_stack[_length-1]}_update.call(this,false)}}else{if(_msie&&diff){if(_version<7){_l.reload()}else{this.setValue(hash)}}else{if(diff){_value=hash;_update.call(this,false)}}}if(_msie){_titleCheck.call(this)}}};var _bodyClick=function(e){if(_popup.length>0){var popup=window.open(_popup[0],_popup[1],eval(_popup[2]));if(typeof _popup[3]!=UNDEFINED){eval(_popup[3])}}_popup=[]};var _swfChange=function(){for(var i=0,id,obj,value=FWDAddress.getValue(),setter="setFWDAddressValue";id=_ids[i];i++){obj=document.getElementById(id);if(obj){if(obj.parentNode&&typeof obj.parentNode.so!=UNDEFINED){obj.parentNode.so.call(setter,value)}else{if(!(obj&&typeof obj[setter]!=UNDEFINED)){var objects=obj.getElementsByTagName("object");var embeds=obj.getElementsByTagName("embed");obj=((objects[0]&&typeof objects[0][setter]!=UNDEFINED)?objects[0]:((embeds[0]&&typeof embeds[0][setter]!=UNDEFINED)?embeds[0]:null))}if(obj){obj[setter](value)}}}else{if(obj=document[id]){if(typeof obj[setter]!=UNDEFINED){obj[setter](value)}}}}};var _jsDispatch=function(type){this.dispatchEvent(new FWDAddressEvent(type));type=type.substr(0,1).toUpperCase()+type.substr(1);if(typeof this["on"+type]==FUNCTION){this["on"+type]()}};var _jsInit=function(){if(_util.Browser.isSafari()){_d.body.addEventListener("click",_bodyClick)}_jsDispatch.call(this,"init")};var _jsChange=function(){_swfChange();_jsDispatch.call(this,"change")};var _update=function(internal){_jsChange.call(this);if(internal){_jsDispatch.call(this,"internalChange")}else{_jsDispatch.call(this,"externalChange")}_st(_functions.bind(_track,this),10)};var _track=function(){var value=(_l.pathname+(/\/$/.test(_l.pathname)?"":"/")+this.getValue()).replace(/\/\//,"/").replace(/^\/$/,"");var fn=_t[_opts.tracker];if(typeof fn==FUNCTION){fn(value)}else{if(typeof _t.pageTracker!=UNDEFINED&&typeof _t.pageTracker._trackPageview==FUNCTION){_t.pageTracker._trackPageview(value)}else{if(typeof _t.urchinTracker==FUNCTION){_t.urchinTracker(value)}}}};var _htmlWrite=function(){var doc=_frame.contentWindow.document;doc.open();doc.write("<html><head><title>"+_d.title+"</title><script>var "+ID+' = "'+_getHash()+'";<\/script></head></html>');doc.close()};var _htmlLoad=function(){var win=_frame.contentWindow;var src=win.location.href;_value=(typeof win[ID]!=UNDEFINED?win[ID]:"");if(_value!=_getHash()){_update.call(FWDAddress,false);_l.hash=_ieLocal(_value,TRUE)}};var _load=function(){if(!_loaded){_loaded=TRUE;if(_msie&&_version<8){var frameset=_d.getElementsByTagName("frameset")[0];_frame=_d.createElement((frameset?"":"i")+"frame");if(frameset){frameset.insertAdjacentElement("beforeEnd",_frame);frameset[frameset.cols?"cols":"rows"]+=",0";_frame.src="javascript:false";_frame.noResize=true;_frame.frameBorder=_frame.frameSpacing=0}else{_frame.src="javascript:false";_frame.style.display="none";_d.body.insertAdjacentElement("afterBegin",_frame)}_st(function(){_events.addListener(_frame,"load",_htmlLoad);if(typeof _frame.contentWindow[ID]==UNDEFINED){_htmlWrite()}},50)}else{if(_safari){if(_version<418){_d.body.innerHTML+='<form id="'+ID+'" style="position:absolute;top:-9999px;" method="get"></form>';_form=_d.getElementById(ID)}if(typeof _l[ID]==UNDEFINED){_l[ID]={}}if(typeof _l[ID][_l.pathname]!=UNDEFINED){_stack=_l[ID][_l.pathname].split(",")}}}_st(_functions.bind(function(){_jsInit.call(this);_jsChange.call(this);_track.call(this)},this),1);if(_msie&&_version>=8){_d.body.onhashchange=_functions.bind(_listen,this);_si(_functions.bind(_titleCheck,this),50)}else{_si(_functions.bind(_listen,this),50)}}};var ID="swfaddress",FUNCTION="function",UNDEFINED="undefined",TRUE=true,FALSE=false,_util=asual.util,_browser=_util.Browser,_events=_util.Events,_functions=_util.Functions,_version=_browser.getVersion(),_msie=_browser.isMSIE(),_mozilla=_browser.isMozilla(),_opera=_browser.isOpera(),_safari=_browser.isSafari(),_supported=FALSE,_t=_getWindow(),_d=_t.document,_h=_t.history,_l=_t.location,_si=setInterval,_st=setTimeout,_dc=decodeURI,_ec=encodeURI,_frame,_form,_url,_title=_d.title,_length=_h.length,_silent=FALSE,_loaded=FALSE,_justset=TRUE,_juststart=TRUE,_ref=this,_stack=[],_ids=[],_popup=[],_listeners={},_value=_getHash(),_opts={history:TRUE,strict:TRUE};if(_msie&&_d.documentMode&&_d.documentMode!=_version){_version=_d.documentMode!=8?7:8}_supported=(_mozilla&&_version>=1)||(_msie&&_version>=6)||(_opera&&_version>=9.5)||(_safari&&_version>=312);if(_supported){if(_opera){history.navigationMode="compatible"}for(var i=1;i<_length;i++){_stack.push("")}_stack.push(_getHash());if(_msie&&_l.hash!=_getHash()){_l.hash="#"+_ieLocal(_getHash(),TRUE)}_searchScript(document);var _qi=_url?_url.indexOf("?"):-1;if(_qi!=-1){var param,params=_url.substr(_qi+1).split("&");for(var i=0,p;p=params[i];i++){param=p.split("=");if(/^(history|strict)$/.test(param[0])){_opts[param[0]]=(isNaN(param[1])?/^(true|yes)$/i.test(param[1]):(parseInt(param[1])!=0))}if(/^tracker$/.test(param[0])){_opts[param[0]]=param[1]}}}if(_msie){_titleCheck.call(this)}if(window==_t){_events.addListener(document,"DOMContentLoaded",_functions.bind(_load,this))}_events.addListener(_t,"load",_functions.bind(_load,this))}else{if((!_supported&&_l.href.indexOf("#")!=-1)||(_safari&&_version<418&&_l.href.indexOf("#")!=-1&&_l.search!="")){_d.open();_d.write('<html><head><meta http-equiv="refresh" content="0;url='+_l.href.substr(0,_l.href.indexOf("#"))+'" /></head></html>');_d.close()}else{_track()}}this.toString=function(){return"[class FWDAddress]"};this.back=function(){_h.back()};this.forward=function(){_h.forward()};this.up=function(){var path=this.getPath();this.setValue(path.substr(0,path.lastIndexOf("/",path.length-2)+(path.substr(path.length-1)=="/"?1:0)))};this.go=function(delta){_h.go(delta)};this.href=function(url,target){target=typeof target!=UNDEFINED?target:"_self";if(target=="_self"){self.location.href=url}else{if(target=="_top"){_l.href=url}else{if(target=="_blank"){window.open(url)}else{_t.frames[target].location.href=url}}}};this.popup=function(url,name,options,handler){try{var popup=window.open(url,name,eval(options));if(typeof handler!=UNDEFINED){eval(handler)}}catch(ex){}_popup=arguments};this.getIds=function(){return _ids};this.getId=function(index){return _ids[0]};this.setId=function(id){_ids[0]=id};this.addId=function(id){this.removeId(id);_ids.push(id)};this.removeId=function(id){for(var i=0;i<_ids.length;i++){if(id==_ids[i]){_ids.splice(i,1);break}}};this.addEventListener=function(type,listener){if(typeof _listeners[type]==UNDEFINED){_listeners[type]=[]}_listeners[type].push(listener)};this.removeEventListener=function(type,listener){if(typeof _listeners[type]!=UNDEFINED){for(var i=0,l;l=_listeners[type][i];i++){if(l==listener){break}}_listeners[type].splice(i,1)}};this.dispatchEvent=function(event){if(this.hasEventListener(event.type)){event.target=this;for(var i=0,l;l=_listeners[event.type][i];i++){l(event)}return TRUE}return FALSE};this.hasEventListener=function(type){return(typeof _listeners[type]!=UNDEFINED&&_listeners[type].length>0)};this.getBaseURL=function(){var url=_l.href;if(url.indexOf("#")!=-1){url=url.substr(0,url.indexOf("#"))}if(url.substr(url.length-1)=="/"){url=url.substr(0,url.length-1)}return url};this.getStrict=function(){return _opts.strict};this.setStrict=function(strict){_opts.strict=strict};this.getHistory=function(){return _opts.history};this.setHistory=function(history){_opts.history=history};this.getTracker=function(){return _opts.tracker};this.setTracker=function(tracker){_opts.tracker=tracker};this.getTitle=function(){return _d.title};this.setTitle=function(title){if(!_supported){return null}if(typeof title==UNDEFINED){return}if(title=="null"){title=""}title=_dc(title);_st(function(){_title=_d.title=title;if(_juststart&&_frame&&_frame.contentWindow&&_frame.contentWindow.document){_frame.contentWindow.document.title=title;_juststart=FALSE}if(!_justset&&_mozilla){_l.replace(_l.href.indexOf("#")!=-1?_l.href:_l.href+"#")}_justset=FALSE},10)};this.getStatus=function(){return _t.status};this.setStatus=function(status){if(!_supported){return null}if(typeof status==UNDEFINED){return}if(status=="null"){status=""}status=_dc(status);if(!_safari){status=_strictCheck((status!="null")?status:"",TRUE);if(status=="/"){status=""}if(!(/http(s)?:\/\//.test(status))){var index=_l.href.indexOf("#");status=(index==-1?_l.href:_l.href.substr(0,index))+"#"+status}_t.status=status}};this.resetStatus=function(){_t.status=""};this.getValue=function(){if(!_supported){return null}return _dc(_strictCheck(_ieLocal(_value,FALSE),FALSE))};this.setValue=function(value){if(!_supported){return null}if(typeof value==UNDEFINED){return}if(value=="null"){value=""}value=_ec(_dc(_strictCheck(value,TRUE)));if(value=="/"){value=""}if(_value==value){return}_justset=TRUE;_value=value;_silent=TRUE;_update.call(FWDAddress,true);_stack[_h.length]=_value;if(_safari){if(_opts.history){_l[ID][_l.pathname]=_stack.toString();_length=_h.length+1;if(_version<418){if(_l.search==""){_form.action="#"+_value;_form.submit()}}else{if(_version<523||_value==""){var evt=_d.createEvent("MouseEvents");evt.initEvent("click",TRUE,TRUE);var anchor=_d.createElement("a");anchor.href="#"+_value;anchor.dispatchEvent(evt)}else{_l.hash="#"+_value}}}else{_l.replace("#"+_value)}}else{if(_value!=_getHash()){if(_opts.history){_l.hash="#"+_dc(_ieLocal(_value,TRUE))}else{_l.replace("#"+_dc(_value))}}}if((_msie&&_version<8)&&_opts.history){_st(_htmlWrite,50)}if(_safari){_st(function(){_silent=FALSE},1)}else{_silent=FALSE}};this.getPath=function(){var value=this.getValue();if(value.indexOf("?")!=-1){return value.split("?")[0]}else{if(value.indexOf("#")!=-1){return value.split("#")[0]}else{return value}}};this.getPathNames=function(){var path=this.getPath(),names=path.split("/");if(path.substr(0,1)=="/"||path.length==0){names.splice(0,1)}if(path.substr(path.length-1,1)=="/"){names.splice(names.length-1,1)}return names};this.getQueryString=function(){var value=this.getValue(),index=value.indexOf("?");if(index!=-1&&index<value.length){return value.substr(index+1)}};this.getParameter=function(param){var value=this.getValue();var index=value.indexOf("?");if(index!=-1){value=value.substr(index+1);var p,params=value.split("&"),i=params.length,r=[];while(i--){p=params[i].split("=");if(p[0]==param){r.push(p[1])}}if(r.length!=0){return r.length!=1?r:r[0]}}};this.getParameterNames=function(){var value=this.getValue();var index=value.indexOf("?");var names=[];if(index!=-1){value=value.substr(index+1);if(value!=""&&value.indexOf("=")!=-1){var params=value.split("&"),i=0;while(i<params.length){names.push(params[i].split("=")[0]);i++}}}return names};this.onInit=null;this.onChange=null;this.onInternalChange=null;this.onExternalChange=null;(function(){var _args;if(typeof FlashObject!=UNDEFINED){SWFObject=FlashObject}if(typeof SWFObject!=UNDEFINED&&SWFObject.prototype&&SWFObject.prototype.write){var _s1=SWFObject.prototype.write;SWFObject.prototype.write=function(){_args=arguments;if(this.getAttribute("version").major<8){this.addVariable("$swfaddress",FWDAddress.getValue());((typeof _args[0]=="string")?document.getElementById(_args[0]):_args[0]).so=this}var success;if(success=_s1.apply(this,_args)){_ref.addId(this.getAttribute("id"))}return success}}if(typeof swfobject!=UNDEFINED){var _s2r=swfobject.registerObject;swfobject.registerObject=function(){_args=arguments;_s2r.apply(this,_args);_ref.addId(_args[0])};var _s2c=swfobject.createSWF;swfobject.createSWF=function(){_args=arguments;var swf=_s2c.apply(this,_args);if(swf){_ref.addId(_args[0].id)}return swf};var _s2e=swfobject.embedSWF;swfobject.embedSWF=function(){_args=arguments;if(typeof _args[8]==UNDEFINED){_args[8]={}}if(typeof _args[8].id==UNDEFINED){_args[8].id=_args[1]}_s2e.apply(this,_args);_ref.addId(_args[8].id)}}if(typeof UFO!=UNDEFINED){var _u=UFO.create;UFO.create=function(){_args=arguments;_u.apply(this,_args);_ref.addId(_args[0].id)}}if(typeof AC_FL_RunContent!=UNDEFINED){var _a=AC_FL_RunContent;AC_FL_RunContent=function(){_args=arguments;_a.apply(this,_args);for(var i=0,l=_args.length;i<l;i++){if(_args[i]=="id"){_ref.addId(_args[i+1])}}}}})()};(function (){
	
	var FWDEventDispatcher = function (){
		
	    this.listeners = {events_ar:[]};
	     
	    this.addListener = function (type, listener){
	    	
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	if(typeof listener != "function") throw Error("listener must be of type Function.");
	    	
	    	
	        var event = {};
	        event.type = type;
	        event.listener = listener;
	        event.target = this;
	        this.listeners.events_ar.push(event);
	    };
	    
	    this.dispatchEvent = function(type, props){
	    	if(this.listeners == null) return;
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	
	        for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
	        	if(this.listeners.events_ar[i].target === this && this.listeners.events_ar[i].type === type){		
	    	        if(props){
	    	        	for(var prop in props){
	    	        		this.listeners.events_ar[i][prop] = props[prop];
	    	        	}
	    	        }
	        		this.listeners.events_ar[i].listener.call(this, this.listeners.events_ar[i]);
	        	}
	        }
	    };
	    
	   this.removeListener = function(type, listener){
	    	
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	if(typeof listener != "function") throw Error("listener must be of type Function." + type);
	    	
	        for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
	        	if(this.listeners.events_ar[i].target === this 
	        			&& this.listeners.events_ar[i].type === type
	        			&& this.listeners.events_ar[i].listener ===  listener
	        	){
	        		this.listeners.events_ar.splice(i,1);
	        		break;
	        	}
	        }  
	    };
	    
	    /* destroy */
	    this.destroy = function(){
	    	this.listeners = null;
	    	
	    	this.addListener = null;
		    this.dispatchEvent = null;
		    this.removeListener = null;
	    };
	    
	};	
	
	window.FWDEventDispatcher = FWDEventDispatcher;
}(window));/* Data */
(function(window){
	
	var FWDFacebookShare = function(appId){
		
		var self = this;
		var prototype = FWDFacebookShare.prototype;
		
		this.appId = parseInt(appId);
	
		var hasStartedToConnect_bl = false;
	
		//###################################//
		/*init*/
		//###################################//
		self.init = function(){
			self.checkFBRoot();
			if(!window.fbAsyncInit) self.connect();
		};
		
		//#############################################//
		/* Checking fb_root div */
		//#############################################//
		this.checkFBRoot = function(){
			var fbRoot_el = Boolean(document.getElementById("fb-root"));
			if(!fbRoot_el){
				fbRoot_el = document.createElement("div");
				fbRoot_el.id = "fb-root";
				document.getElementsByTagName("body")[0].appendChild(fbRoot_el);
			}
		};
		
		//#############################################//
		/* Setup facebook */
		//#############################################//
		this.connect = function(){
			if(self.hasStartedToConnect_bl) return;
			self.hasStartedToConnect_bl = true;
		
			
			window.fbAsyncInit = function() {
				FB.init({
					appId: self.appId,
					status: true,
					cookie: true,
					xfbml: true,
					oauth: true
			});
				
			// Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
			// for any authentication related change, such as login, logout or session refresh. This means that
			// whenever someone who was previously logged out tries to log in again, the correct case below 
			// will be handled. 
			FB.Event.subscribe('auth.authResponseChange', function(response) {
				// Here we specify what we do with the response anytime this event occurs. 
				if (response.status === 'connected') {
					// The response object is returned with a status field that lets the app know the current
					// login status of the person. In this case, we're handling the situation where they 
					// have logged in to the app.
				}else{
					// In this case, the person is not logged into Facebook, so we call the login() 
					// function to prompt them to do so. Note that at this stage there is no indication
					// of whether they are logged into the app. If they aren't then they'll see the Login
					// dialog right after they log in to Facebook. 
					// The same caveats as above apply to the FB.login() call here.
				    FB.login();
				}
			});
		};
		  		
		(function(d) {
			var js, id = 'facebook-jssdk';
			if (d.getElementById(id)) {
				return;
			}
			js = d.createElement('script');
			js.id = id;
			js.async = true;
			js.src = "//connect.facebook.net/en_US/all.js";
			d.getElementsByTagName('body')[0].appendChild(js);
			}(document));
		};
		
		this.share = function(link, caption, picture){
			FB.ui({
				  method: 'feed',
				  link: link,
				  caption: caption,
				  picture:picture
			}, function(response){});
		};
		
	
		self.init();
	};
	
	/* set prototype */
	FWDFacebookShare.setPrototype = function(){
		FWDFacebookShare.prototype = new FWDEventDispatcher();
	};
	
	FWDFacebookShare.prototype = null;
	
	window.FWDFacebookShare = FWDFacebookShare;
}(window));var FWDFlashTest = function() {
	
	var UNDEF = "undefined",
		OBJECT = "object",
		SHOCKWAVE_FLASH = "Shockwave Flash",
		SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
		FLASH_MIME_TYPE = "application/x-shockwave-flash",
		
		win = window,
		doc = document,
		nav = navigator,
		
		plugin = false,

		regObjArr = [],

	
	/* Centralized function for browser feature detection
		- User agent string detection is only used when no good alternative is possible
		- Is executed directly for optimal performance
	*/	
	ua = function() {
		var w3cdom = typeof doc.getElementById != UNDEF && typeof doc.getElementsByTagName != UNDEF && typeof doc.createElement != UNDEF,
			u = nav.userAgent.toLowerCase(),
			p = nav.platform.toLowerCase(),
			windows = p ? /win/.test(p) : /win/.test(u),
			mac = p ? /mac/.test(p) : /mac/.test(u),
			webkit = /webkit/.test(u) ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, // returns either the webkit version or false if not webkit
			ie = !+"\v1", // feature detection based on Andrea Giammarchi's solution: http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
			playerVersion = [0,0,0],
			d = null;
		if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
			d = nav.plugins[SHOCKWAVE_FLASH].description;
			if (d && !(typeof nav.mimeTypes != UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) { // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
				plugin = true;
				ie = false; // cascaded feature detection for Internet Explorer
				d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
				playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
				playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
				playerVersion[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
			}
		}
		else if (typeof win.ActiveXObject != UNDEF) {
			try {
				var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
				if (a) { // a will return null when ActiveX is disabled
					d = a.GetVariable("$version");
					if (d) {
						ie = true; // cascaded feature detection for Internet Explorer
						d = d.split(" ")[1].split(",");
						playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
					}
				}
			}
			catch(e) {}
		}
		return { w3:w3cdom, pv:playerVersion, wk:webkit, ie:ie, win:windows, mac:mac };
	}();
	
	
	/* Detect the Flash Player version for non-Internet Explorer browsers
		- Detecting the plug-in version via the object element is more precise than using the plugins collection item's description:
		  a. Both release and build numbers can be detected
		  b. Avoid wrong descriptions by corrupt installers provided by Adobe
		  c. Avoid wrong descriptions by multiple Flash Player entries in the plugin Array, caused by incorrect browser imports
		- Disadvantage of this method is that it depends on the availability of the DOM, while the plugins collection is immediately available
	*/
	function testPlayerVersion() {
		var b = doc.getElementsByTagName("body")[0];
		var o = createElement(OBJECT);
		o.setAttribute("type", FLASH_MIME_TYPE);
		var t = b.appendChild(o);
		if (t) {
			var counter = 0;
			(function(){
				if (typeof t.GetVariable != UNDEF) {
					var d = t.GetVariable("$version");
					if (d) {
						d = d.split(" ")[1].split(",");
						ua.pv = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
					}
				}
				else if (counter < 10) {
					counter++;
					setTimeout(arguments.callee, 10);
					return;
				}
				b.removeChild(o);
				t = null;
				matchVersions();
			})();
		}
		else {
			matchVersions();
		}
	}
	
	/* Perform Flash Player and SWF version matching; static publishing only
	*/
	function matchVersions() {
		var rl = regObjArr.length;
		if (rl > 0) {
			for (var i = 0; i < rl; i++) { // for each registered object element
				var id = regObjArr[i].id;
				var cb = regObjArr[i].callbackFn;
				var cbObj = {success:false, id:id};
				if (ua.pv[0] > 0) {
					var obj = getElementById(id);
					if (obj) {
						if (hasPlayerVersion(regObjArr[i].swfVersion) && !(ua.wk && ua.wk < 312)) { // Flash Player version >= published SWF version: Houston, we have a match!
							setVisibility(id, true);
							if (cb) {
								cbObj.success = true;
								cbObj.ref = getObjectById(id);
								cb(cbObj);
							}
						}
						else if (regObjArr[i].expressInstall && canExpressInstall()) { // show the Adobe Express Install dialog if set by the web page author and if supported
							var att = {};
							att.data = regObjArr[i].expressInstall;
							att.width = obj.getAttribute("width") || "0";
							att.height = obj.getAttribute("height") || "0";
							if (obj.getAttribute("class")) { att.styleclass = obj.getAttribute("class"); }
							if (obj.getAttribute("align")) { att.align = obj.getAttribute("align"); }
							// parse HTML object param element's name-value pairs
							var par = {};
							var p = obj.getElementsByTagName("param");
							var pl = p.length;
							for (var j = 0; j < pl; j++) {
								if (p[j].getAttribute("name").toLowerCase() != "movie") {
									par[p[j].getAttribute("name")] = p[j].getAttribute("value");
								}
							}
							showExpressInstall(att, par, id, cb);
						}
						else { // Flash Player and SWF version mismatch or an older Webkit engine that ignores the HTML object element's nested param elements: display alternative content instead of SWF
							displayAltContent(obj);
							if (cb) { cb(cbObj); }
						}
					}
				}
				else {	// if no Flash Player is installed or the fp version cannot be detected we let the HTML object element do its job (either show a SWF or alternative content)
					setVisibility(id, true);
					if (cb) {
						var o = getObjectById(id); // test whether there is an HTML object element or not
						if (o && typeof o.SetVariable != UNDEF) { 
							cbObj.success = true;
							cbObj.ref = o;
						}
						cb(cbObj);
					}
				}
			}
		}
	}
	
	/* Flash Player and SWF content version matching
	*/
	function hasPlayerVersion(rv) {
		var pv = ua.pv, v = rv.split(".");
		v[0] = parseInt(v[0], 10);
		v[1] = parseInt(v[1], 10) || 0; // supports short notation, e.g. "9" instead of "9.0.0"
		v[2] = parseInt(v[2], 10) || 0;
		return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
	}

	/* Filter to avoid XSS attacks
	*/
	function urlEncodeIfNecessary(s) {
		var regex = /[\\\"<>\.;]/;
		var hasBadChars = regex.exec(s) != null;
		return hasBadChars && typeof encodeURIComponent != UNDEF ? encodeURIComponent(s) : s;
	}
	
	return {
		hasFlashPlayerVersion: hasPlayerVersion
	};
}();
function A(h,g,b){var e=g||0,c=0;"string"==typeof h?(c=b||h.length,this.a=function(a){return h.charCodeAt(a+e)&255}):"unknown"==typeof h&&(c=b||IEBinary_getLength(h),this.a=function(a){return IEBinary_getByteAt(h,a+e)});this.l=function(a,f){for(var v=Array(f),b=0;b<f;b++)v[b]=this.a(a+b);return v};this.h=function(){return c};this.d=function(a,f){return 0!=(this.a(a)&1<<f)};this.w=function(a){a=(this.a(a+1)<<8)+this.a(a);0>a&&(a+=65536);return a};this.i=function(a){var f=this.a(a),b=this.a(a+1),c=
this.a(a+2);a=this.a(a+3);f=(((f<<8)+b<<8)+c<<8)+a;0>f&&(f+=4294967296);return f};this.o=function(a){var f=this.a(a),b=this.a(a+1);a=this.a(a+2);f=((f<<8)+b<<8)+a;0>f&&(f+=16777216);return f};this.c=function(a,f){for(var b=[],c=a,d=0;c<a+f;c++,d++)b[d]=String.fromCharCode(this.a(c));return b.join("")};this.e=function(a,b,c){a=this.l(a,b);switch(c.toLowerCase()){case "utf-16":case "utf-16le":case "utf-16be":b=c;var k,d=0,e=1;c=0;k=Math.min(k||a.length,a.length);254==a[0]&&255==a[1]?(b=!0,d=2):255==
a[0]&&254==a[1]&&(b=!1,d=2);b&&(e=0,c=1);b=[];for(var m=0;d<k;m++){var g=a[d+e],l=(g<<8)+a[d+c],d=d+2;if(0==l)break;else 216>g||224<=g?b[m]=String.fromCharCode(l):(g=(a[d+e]<<8)+a[d+c],d+=2,b[m]=String.fromCharCode(l,g))}a=new String(b.join(""));a.g=d;break;case "utf-8":k=0;d=Math.min(d||a.length,a.length);239==a[0]&&187==a[1]&&191==a[2]&&(k=3);e=[];for(c=0;k<d&&(b=a[k++],0!=b);c++)128>b?e[c]=String.fromCharCode(b):194<=b&&224>b?(m=a[k++],e[c]=String.fromCharCode(((b&31)<<6)+(m&63))):224<=b&&240>
b?(m=a[k++],l=a[k++],e[c]=String.fromCharCode(((b&255)<<12)+((m&63)<<6)+(l&63))):240<=b&&245>b&&(m=a[k++],l=a[k++],g=a[k++],b=((b&7)<<18)+((m&63)<<12)+((l&63)<<6)+(g&63)-65536,e[c]=String.fromCharCode((b>>10)+55296,(b&1023)+56320));a=new String(e.join(""));a.g=k;break;default:d=[];e=e||a.length;for(k=0;k<e;){c=a[k++];if(0==c)break;d[k-1]=String.fromCharCode(c)}a=new String(d.join(""));a.g=k}return a};this.f=function(a,b){b()}}document.write("<script type='text/vbscript'>\r\nFunction IEBinary_getByteAt(strBinary, iOffset)\r\n\tIEBinary_getByteAt = AscB(MidB(strBinary,iOffset+1,1))\r\nEnd Function\r\nFunction IEBinary_getLength(strBinary)\r\n\tIEBinary_getLength = LenB(strBinary)\r\nEnd Function\r\n\x3c/script>\r\n");function B(h,g,b){function e(a,b,d,e,f,g){var l=c();l?("undefined"===typeof g&&(g=!0),b&&("undefined"!=typeof l.onload?l.onload=function(){"200"==l.status||"206"==l.status?(l.fileSize=f||l.getResponseHeader("Content-Length"),b(l)):d&&d();l=null}:l.onreadystatechange=function(){4==l.readyState&&("200"==l.status||"206"==l.status?(l.fileSize=f||l.getResponseHeader("Content-Length"),b(l)):d&&d(),l=null)}),l.open("GET",a,g),l.overrideMimeType&&l.overrideMimeType("text/plain; charset=x-user-defined"),e&&
l.setRequestHeader("Range","bytes="+e[0]+"-"+e[1]),l.setRequestHeader("If-Modified-Since","Sat, 1 Jan 1970 00:00:00 GMT"),l.send(null)):d&&d()}function c(){var a=null;window.XMLHttpRequest?a=new XMLHttpRequest:window.ActiveXObject&&(a=new ActiveXObject("Microsoft.XMLHTTP"));return a}function a(a,b){var d=c();d&&(b&&("undefined"!=typeof d.onload?d.onload=function(){"200"==d.status&&b(this);d=null}:d.onreadystatechange=function(){4==d.readyState&&("200"==d.status&&b(this),d=null)}),d.open("HEAD",a,
!0),d.send(null))}function f(a,c){var d,f;function g(a){var b=~~(a[0]/d)-f;a=~~(a[1]/d)+1+f;0>b&&(b=0);a>=blockTotal&&(a=blockTotal-1);return[b,a]}function h(f,g){for(;n[f[0]];)if(f[0]++,f[0]>f[1]){g&&g();return}for(;n[f[1]];)if(f[1]--,f[0]>f[1]){g&&g();return}var m=[f[0]*d,(f[1]+1)*d-1];e(a,function(a){parseInt(a.getResponseHeader("Content-Length"),10)==c&&(f[0]=0,f[1]=blockTotal-1,m[0]=0,m[1]=c-1);a={data:a.N||a.responseText,offset:m[0]};for(var b=f[0];b<=f[1];b++)n[b]=a;g&&g()},b,m,l,!!g)}var l,
r=new A("",0,c),n=[];d=d||2048;f="undefined"===typeof f?0:f;blockTotal=~~((c-1)/d)+1;for(var q in r)r.hasOwnProperty(q)&&"function"===typeof r[q]&&(this[q]=r[q]);this.a=function(a){var b;h(g([a,a]));b=n[~~(a/d)];if("string"==typeof b.data)return b.data.charCodeAt(a-b.offset)&255;if("unknown"==typeof b.data)return IEBinary_getByteAt(b.data,a-b.offset)};this.f=function(a,b){h(g(a),b)}}(function(){a(h,function(a){a=parseInt(a.getResponseHeader("Content-Length"),10)||-1;g(new f(h,a))})})()};(function(h){h.FileAPIReader=function(g,b){return function(e,c){var a=b||new FileReader;a.onload=function(a){c(new A(a.target.result))};a.readAsBinaryString(g)}}})(this);(function(h){var g=h.p={},b={},e=[0,7];g.t=function(c){delete b[c]};g.s=function(){b={}};g.B=function(c,a,f){f=f||{};(f.dataReader||B)(c,function(g){g.f(e,function(){var e="ftypM4A"==g.c(4,7)?ID4:"ID3"==g.c(0,3)?ID3v2:ID3v1;e.m(g,function(){var d=f.tags,h=e.n(g,d),d=b[c]||{},m;for(m in h)h.hasOwnProperty(m)&&(d[m]=h[m]);b[c]=d;a&&a()})})})};g.v=function(c){if(!b[c])return null;var a={},f;for(f in b[c])b[c].hasOwnProperty(f)&&(a[f]=b[c][f]);return a};g.A=function(c,a){return b[c]?b[c][a]:null};h.ID3=
h.p;g.loadTags=g.B;g.getAllTags=g.v;g.getTag=g.A;g.clearTags=g.t;g.clearAll=g.s})(this);(function(h){var g=h.q={},b="Blues;Classic Rock;Country;Dance;Disco;Funk;Grunge;Hip-Hop;Jazz;Metal;New Age;Oldies;Other;Pop;R&B;Rap;Reggae;Rock;Techno;Industrial;Alternative;Ska;Death Metal;Pranks;Soundtrack;Euro-Techno;Ambient;Trip-Hop;Vocal;Jazz+Funk;Fusion;Trance;Classical;Instrumental;Acid;House;Game;Sound Clip;Gospel;Noise;AlternRock;Bass;Soul;Punk;Space;Meditative;Instrumental Pop;Instrumental Rock;Ethnic;Gothic;Darkwave;Techno-Industrial;Electronic;Pop-Folk;Eurodance;Dream;Southern Rock;Comedy;Cult;Gangsta;Top 40;Christian Rap;Pop/Funk;Jungle;Native American;Cabaret;New Wave;Psychadelic;Rave;Showtunes;Trailer;Lo-Fi;Tribal;Acid Punk;Acid Jazz;Polka;Retro;Musical;Rock & Roll;Hard Rock;Folk;Folk-Rock;National Folk;Swing;Fast Fusion;Bebob;Latin;Revival;Celtic;Bluegrass;Avantgarde;Gothic Rock;Progressive Rock;Psychedelic Rock;Symphonic Rock;Slow Rock;Big Band;Chorus;Easy Listening;Acoustic;Humour;Speech;Chanson;Opera;Chamber Music;Sonata;Symphony;Booty Bass;Primus;Porn Groove;Satire;Slow Jam;Club;Tango;Samba;Folklore;Ballad;Power Ballad;Rhythmic Soul;Freestyle;Duet;Punk Rock;Drum Solo;Acapella;Euro-House;Dance Hall".split(";");
g.m=function(b,c){var a=b.h();b.f([a-128-1,a],c)};g.n=function(e){var c=e.h()-128;if("TAG"==e.c(c,3)){var a=e.c(c+3,30).replace(/\0/g,""),f=e.c(c+33,30).replace(/\0/g,""),g=e.c(c+63,30).replace(/\0/g,""),k=e.c(c+93,4).replace(/\0/g,"");if(0==e.a(c+97+28))var d=e.c(c+97,28).replace(/\0/g,""),h=e.a(c+97+29);else d="",h=0;e=e.a(c+97+30);return{version:"1.1",title:a,artist:f,album:g,year:k,comment:d,track:h,genre:255>e?b[e]:""}}return{}};h.ID3v1=h.q})(this);(function(h){function g(a,b){var c=b.a(a),e=b.a(a+1),d=b.a(a+2);return b.a(a+3)&127|(d&127)<<7|(e&127)<<14|(c&127)<<21}var b=h.D={};b.b={};b.frames={BUF:"Recommended buffer size",CNT:"Play counter",COM:"Comments",CRA:"Audio encryption",CRM:"Encrypted meta frame",ETC:"Event timing codes",EQU:"Equalization",GEO:"General encapsulated object",IPL:"Involved people list",LNK:"Linked information",MCI:"Music CD Identifier",MLL:"MPEG location lookup table",PIC:"Attached picture",POP:"Popularimeter",REV:"Reverb",
RVA:"Relative volume adjustment",SLT:"Synchronized lyric/text",STC:"Synced tempo codes",TAL:"Album/Movie/Show title",TBP:"BPM (Beats Per Minute)",TCM:"Composer",TCO:"Content type",TCR:"Copyright message",TDA:"Date",TDY:"Playlist delay",TEN:"Encoded by",TFT:"File type",TIM:"Time",TKE:"Initial key",TLA:"Language(s)",TLE:"Length",TMT:"Media type",TOA:"Original artist(s)/performer(s)",TOF:"Original filename",TOL:"Original Lyricist(s)/text writer(s)",TOR:"Original release year",TOT:"Original album/Movie/Show title",
TP1:"Lead artist(s)/Lead performer(s)/Soloist(s)/Performing group",TP2:"Band/Orchestra/Accompaniment",TP3:"Conductor/Performer refinement",TP4:"Interpreted, remixed, or otherwise modified by",TPA:"Part of a set",TPB:"Publisher",TRC:"ISRC (International Standard Recording Code)",TRD:"Recording dates",TRK:"Track number/Position in set",TSI:"Size",TSS:"Software/hardware and settings used for encoding",TT1:"Content group description",TT2:"Title/Songname/Content description",TT3:"Subtitle/Description refinement",
TXT:"Lyricist/text writer",TXX:"User defined text information frame",TYE:"Year",UFI:"Unique file identifier",ULT:"Unsychronized lyric/text transcription",WAF:"Official audio file webpage",WAR:"Official artist/performer webpage",WAS:"Official audio source webpage",WCM:"Commercial information",WCP:"Copyright/Legal information",WPB:"Publishers official webpage",WXX:"User defined URL link frame",AENC:"Audio encryption",APIC:"Attached picture",COMM:"Comments",COMR:"Commercial frame",ENCR:"Encryption method registration",
EQUA:"Equalization",ETCO:"Event timing codes",GEOB:"General encapsulated object",GRID:"Group identification registration",IPLS:"Involved people list",LINK:"Linked information",MCDI:"Music CD identifier",MLLT:"MPEG location lookup table",OWNE:"Ownership frame",PRIV:"Private frame",PCNT:"Play counter",POPM:"Popularimeter",POSS:"Position synchronisation frame",RBUF:"Recommended buffer size",RVAD:"Relative volume adjustment",RVRB:"Reverb",SYLT:"Synchronized lyric/text",SYTC:"Synchronized tempo codes",
TALB:"Album/Movie/Show title",TBPM:"BPM (beats per minute)",TCOM:"Composer",TCON:"Content type",TCOP:"Copyright message",TDAT:"Date",TDLY:"Playlist delay",TENC:"Encoded by",TEXT:"Lyricist/Text writer",TFLT:"File type",TIME:"Time",TIT1:"Content group description",TIT2:"Title/songname/content description",TIT3:"Subtitle/Description refinement",TKEY:"Initial key",TLAN:"Language(s)",TLEN:"Length",TMED:"Media type",TOAL:"Original album/movie/show title",TOFN:"Original filename",TOLY:"Original lyricist(s)/text writer(s)",
TOPE:"Original artist(s)/performer(s)",TORY:"Original release year",TOWN:"File owner/licensee",TPE1:"Lead performer(s)/Soloist(s)",TPE2:"Band/orchestra/accompaniment",TPE3:"Conductor/performer refinement",TPE4:"Interpreted, remixed, or otherwise modified by",TPOS:"Part of a set",TPUB:"Publisher",TRCK:"Track number/Position in set",TRDA:"Recording dates",TRSN:"Internet radio station name",TRSO:"Internet radio station owner",TSIZ:"Size",TSRC:"ISRC (international standard recording code)",TSSE:"Software/Hardware and settings used for encoding",
TYER:"Year",TXXX:"User defined text information frame",UFID:"Unique file identifier",USER:"Terms of use",USLT:"Unsychronized lyric/text transcription",WCOM:"Commercial information",WCOP:"Copyright/Legal information",WOAF:"Official audio file webpage",WOAR:"Official artist/performer webpage",WOAS:"Official audio source webpage",WORS:"Official internet radio station homepage",WPAY:"Payment",WPUB:"Publishers official webpage",WXXX:"User defined URL link frame"};var e={title:["TIT2","TT2"],artist:["TPE1",
"TP1"],album:["TALB","TAL"],year:["TYER","TYE"],comment:["COMM","COM"],track:["TRCK","TRK"],genre:["TCON","TCO"],picture:["APIC","PIC"],lyrics:["USLT","ULT"]},c=["title","artist","album","track"];b.m=function(a,b){a.f([0,g(6,a)],b)};b.n=function(a,f){var h=0,k=a.a(h+3);if(4<k)return{version:">2.4"};var d=a.a(h+4),t=a.d(h+5,7),m=a.d(h+5,6),u=a.d(h+5,5),l=g(h+6,a),h=h+10;if(m)var r=a.i(h),h=h+(r+4);var k={version:"2."+k+"."+d,major:k,revision:d,flags:{unsynchronisation:t,extended_header:m,experimental_indicator:u},
size:l},n;if(t)n={};else{for(var l=l-10,t=a,d=f,m={},u=k.major,r=[],q=0,p;p=(d||c)[q];q++)r=r.concat(e[p]||[p]);for(d=r;h<l;){r=null;q=t;p=h;var x=null;switch(u){case 2:n=q.c(p,3);var s=q.o(p+3),w=6;break;case 3:n=q.c(p,4);s=q.i(p+4);w=10;break;case 4:n=q.c(p,4),s=g(p+4,q),w=10}if(""==n)break;h+=w+s;0>d.indexOf(n)||(2<u&&(x={message:{P:q.d(p+8,6),I:q.d(p+8,5),M:q.d(p+8,4)},k:{K:q.d(p+8+1,7),F:q.d(p+8+1,3),H:q.d(p+8+1,2),C:q.d(p+8+1,1),u:q.d(p+8+1,0)}}),p+=w,x&&x.k.u&&(g(p,q),p+=4,s-=4),x&&x.k.C||
(n in b.b?r=b.b[n]:"T"==n[0]&&(r=b.b["T*"]),r=r?r(p,s,q,x):void 0,r={id:n,size:s,description:n in b.frames?b.frames[n]:"Unknown",data:r},n in m?(m[n].id&&(m[n]=[m[n]]),m[n].push(r)):m[n]=r))}n=m}for(var y in e)if(e.hasOwnProperty(y)){a:{s=e[y];"string"==typeof s&&(s=[s]);w=0;for(h=void 0;h=s[w];w++)if(h in n){a=n[h].data;break a}a=void 0}a&&(k[y]=a)}for(var z in n)n.hasOwnProperty(z)&&(k[z]=n[z]);return k};h.ID3v2=b})(this);(function(){function h(b){var e;switch(b){case 0:e="iso-8859-1";break;case 1:e="utf-16";break;case 2:e="utf-16be";break;case 3:e="utf-8"}return e}var g="32x32 pixels 'file icon' (PNG only);Other file icon;Cover (front);Cover (back);Leaflet page;Media (e.g. lable side of CD);Lead artist/lead performer/soloist;Artist/performer;Conductor;Band/Orchestra;Composer;Lyricist/text writer;Recording Location;During recording;During performance;Movie/video screen capture;A bright coloured fish;Illustration;Band/artist logotype;Publisher/Studio logotype".split(";");
ID3v2.b.APIC=function(b,e,c,a,f){f=f||"3";a=b;var v=h(c.a(b));switch(f){case "2":var k=c.c(b+1,3);b+=4;break;case "3":case "4":k=c.e(b+1,e-(b-a),v),b+=1+k.g}f=c.a(b,1);f=g[f];v=c.e(b+1,e-(b-a),v);b+=1+v.g;return{format:k.toString(),type:f,description:v.toString(),data:c.l(b,a+e-b)}};ID3v2.b.COMM=function(b,e,c){var a=b,f=h(c.a(b)),g=c.c(b+1,3),k=c.e(b+4,e-4,f);b+=4+k.g;b=c.e(b,a+e-b,f);return{language:g,O:k.toString(),text:b.toString()}};ID3v2.b.COM=ID3v2.b.COMM;ID3v2.b.PIC=function(b,e,c,a){return ID3v2.b.APIC(b,
e,c,a,"2")};ID3v2.b.PCNT=function(b,e,c){return c.J(b)};ID3v2.b.CNT=ID3v2.b.PCNT;ID3v2.b["T*"]=function(b,e,c){var a=h(c.a(b));return c.e(b+1,e-1,a).toString()};ID3v2.b.TCON=function(b,e,c){return ID3v2.b["T*"].apply(this,arguments).replace(/^\(\d+\)/,"")};ID3v2.b.TCO=ID3v2.b.TCON;ID3v2.b.USLT=function(b,e,c){var a=b,f=h(c.a(b)),g=c.c(b+1,3),k=c.e(b+4,e-4,f);b+=4+k.g;b=c.e(b,a+e-b,f);return{language:g,G:k.toString(),L:b.toString()}};ID3v2.b.ULT=ID3v2.b.USLT})();(function(h){function g(b,a,f,h){var k=b.i(a);if(0==k)h();else{var d=b.c(a+4,4);-1<["moov","udta","meta","ilst"].indexOf(d)?("meta"==d&&(a+=4),b.f([a+8,a+8+8],function(){g(b,a+8,k-8,h)})):b.f([a+(d in e.j?0:k),a+k+8],function(){g(b,a+k,f,h)})}}function b(c,a,f,g,h){h=void 0===h?"":h+"  ";for(var d=f;d<f+g;){var t=a.i(d);if(0==t)break;var m=a.c(d+4,4);if(-1<["moov","udta","meta","ilst"].indexOf(m)){"meta"==m&&(d+=4);b(c,a,d+8,t-8,h);break}if(e.j[m]){var u=a.o(d+16+1),l=e.j[m],u=e.types[u];if("trkn"==
m)c[l[0]]=a.a(d+16+11),c.count=a.a(d+16+13);else{var m=d+16+4+4,r=t-16-4-4,n;switch(u){case "text":n=a.e(m,r,"UTF-8");break;case "uint8":n=a.w(m);break;case "jpeg":case "png":n={k:"image/"+u,data:a.l(m,r)}}c[l[0]]="comment"===l[0]?{text:n}:n}}d+=t}}var e=h.r={};e.types={0:"uint8",1:"text",13:"jpeg",14:"png",21:"uint8"};e.j={"\u00a9alb":["album"],"\u00a9art":["artist"],"\u00a9ART":["artist"],aART:["artist"],"\u00a9day":["year"],"\u00a9nam":["title"],"\u00a9gen":["genre"],trkn:["track"],"\u00a9wrt":["composer"],
"\u00a9too":["encoder"],cprt:["copyright"],covr:["picture"],"\u00a9grp":["grouping"],keyw:["keyword"],"\u00a9lyr":["lyrics"],"\u00a9cmt":["comment"],tmpo:["tempo"],cpil:["compilation"],disk:["disc"]};e.m=function(b,a){b.f([0,7],function(){g(b,0,b.h(),a)})};e.n=function(c){var a={};b(a,c,0,c.h());return a};h.ID4=h.r})(this);
(function (window) {

        // This library re-implements setTimeout, setInterval, clearTimeout, clearInterval for iOS6.
        // iOS6 suffers from a bug that kills timers that are created while a page is scrolling.
        // This library fixes that problem by recreating timers after scrolling finishes (with interval correction).
		// This code is free to use by anyone (MIT, blabla).
		// Author: rkorving@wizcorp.jp
	
		var platform = navigator.platform;
		var isIpadOrIphone = false;
		if(platform == 'iPad' ||  platform == 'iPhone') isIpadOrIphone = true;
		if(!isIpadOrIphone) return;
		
		var userAgent = navigator.userAgent;
		var isIosVersionGreaterThen6 = false;
		if(userAgent.indexOf("6") != -1 || userAgent.indexOf("7") != -1) isIosVersionGreaterThen6 = true;
		if(!isIosVersionGreaterThen6) return;
		
        var timeouts = {};
        var intervals = {};
        var orgSetTimeout = window.setTimeout;
        var orgSetInterval = window.setInterval;
        var orgClearTimeout = window.clearTimeout;
        var orgClearInterval = window.clearInterval;


        function createTimer(set, map, args) {
                var id, cb = args[0], repeat = (set === orgSetInterval);

                function callback() {
                        if (cb) {
                                cb.apply(window, arguments);

                                if (!repeat) {
                                        delete map[id];
                                        cb = null;
                                }
                        }
                }

                args[0] = callback;

                id = set.apply(window, args);

                map[id] = { args: args, created: Date.now(), cb: cb, id: id };

                return id;
        }


        function resetTimer(set, clear, map, virtualId, correctInterval) {
                var timer = map[virtualId];

                if (!timer) {
                        return;
                }

                var repeat = (set === orgSetInterval);

                // cleanup

                clear(timer.id);

                // reduce the interval (arg 1 in the args array)

                if (!repeat) {
                        var interval = timer.args[1];

                        var reduction = Date.now() - timer.created;
                        if (reduction < 0) {
                                reduction = 0;
                        }

                        interval -= reduction;
                        if (interval < 0) {
                                interval = 0;
                        }

                        timer.args[1] = interval;
                }

                // recreate

                function callback() {
                        if (timer.cb) {
                                timer.cb.apply(window, arguments);
                                if (!repeat) {
                                        delete map[virtualId];
                                        timer.cb = null;
                                }
                        }
                }

                timer.args[0] = callback;
                timer.created = Date.now();
                timer.id = set.apply(window, timer.args);
        }


        window.setTimeout = function () {
                return createTimer(orgSetTimeout, timeouts, arguments);
        };


        window.setInterval = function () {
                return createTimer(orgSetInterval, intervals, arguments);
        };

        window.clearTimeout = function (id) {
                var timer = timeouts[id];

                if (timer) {
                        delete timeouts[id];
                        orgClearTimeout(timer.id);
                }
        };

        window.clearInterval = function (id) {
                var timer = intervals[id];

                if (timer) {
                        delete intervals[id];
                        orgClearInterval(timer.id);
                }
        };

        window.addEventListener('scroll', function () {
                // recreate the timers using adjusted intervals
                // we cannot know how long the scroll-freeze lasted, so we cannot take that into account
                var virtualId;
             
                for (virtualId in timeouts) {
                        resetTimer(orgSetTimeout, orgClearTimeout, timeouts, virtualId);
                }

                for (virtualId in intervals) {
                        resetTimer(orgSetInterval, orgClearInterval, intervals, virtualId);
                }
        });

}(window));/*!
 * VERSION: beta 1.9.7
 * DATE: 2013-05-16
 * UPDATES AND DOCS AT: http://www.greensock.com
 * 
 * Includes all of the following: TweenLite, TweenMax, TimelineLite, TimelineMax, EasePack, CSSPlugin, RoundPropsPlugin, BezierPlugin, AttrPlugin, DirectionalRotationPlugin
 *
 * @license Copyright (c) 2008-2013, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/

(window._gsQueue || (window._gsQueue = [])).push( function() {

	"use strict";

	window._gsDefine("TweenMax", ["core.Animation","core.SimpleTimeline","TweenLite"], function(Animation, SimpleTimeline, TweenLite) {
		
		var _slice = [].slice,
			TweenMax = function(target, duration, vars) {
				TweenLite.call(this, target, duration, vars);
				this._cycle = 0;
				this._yoyo = (this.vars.yoyo === true);
				this._repeat = this.vars.repeat || 0;
				this._repeatDelay = this.vars.repeatDelay || 0;
				this._dirty = true; //ensures that if there is any repeat, the totalDuration will get recalculated to accurately report it.
			},
			_isSelector = function(v) {
				return (v.jquery || (v.length && v[0] && v[0].nodeType && v[0].style));
			},
			p = TweenMax.prototype = TweenLite.to({}, 0.1, {}),
			_blankArray = [];

		TweenMax.version = "1.9.7";
		p.constructor = TweenMax;
		p.kill()._gc = false;
		TweenMax.killTweensOf = TweenMax.killDelayedCallsTo = TweenLite.killTweensOf;
		TweenMax.getTweensOf = TweenLite.getTweensOf;
		TweenMax.ticker = TweenLite.ticker;
	
		p.invalidate = function() {
			this._yoyo = (this.vars.yoyo === true);
			this._repeat = this.vars.repeat || 0;
			this._repeatDelay = this.vars.repeatDelay || 0;
			this._uncache(true);
			return TweenLite.prototype.invalidate.call(this);
		};
		
		p.updateTo = function(vars, resetDuration) {
			var curRatio = this.ratio, p;
			if (resetDuration && this.timeline && this._startTime < this._timeline._time) {
				this._startTime = this._timeline._time;
				this._uncache(false);
				if (this._gc) {
					this._enabled(true, false);
				} else {
					this._timeline.insert(this, this._startTime - this._delay); //ensures that any necessary re-sequencing of Animations in the timeline occurs to make sure the rendering order is correct.
				}
			}
			for (p in vars) {
				this.vars[p] = vars[p];
			}
			if (this._initted) {
				if (resetDuration) {
					this._initted = false;
				} else {
					if (this._notifyPluginsOfEnabled && this._firstPT) {
						TweenLite._onPluginEvent("_onDisable", this); //in case a plugin like MotionBlur must perform some cleanup tasks
					}
					if (this._time / this._duration > 0.998) { //if the tween has finished (or come extremely close to finishing), we just need to rewind it to 0 and then render it again at the end which forces it to re-initialize (parsing the new vars). We allow tweens that are close to finishing (but haven't quite finished) to work this way too because otherwise, the values are so small when determining where to project the starting values that binary math issues creep in and can make the tween appear to render incorrectly when run backwards. 
						var prevTime = this._time;
						this.render(0, true, false);
						this._initted = false;
						this.render(prevTime, true, false);
					} else if (this._time > 0) {
						this._initted = false;
						this._init();
						var inv = 1 / (1 - curRatio),
							pt = this._firstPT, endValue;
						while (pt) {
							endValue = pt.s + pt.c; 
							pt.c *= inv;
							pt.s = endValue - pt.c;
							pt = pt._next;
						}
					}
				}
			}
			return this;
		};
				
		p.render = function(time, suppressEvents, force) {
			var totalDur = (!this._dirty) ? this._totalDuration : this.totalDuration(), 
				prevTime = this._time,
				prevTotalTime = this._totalTime, 
				prevCycle = this._cycle, 
				isComplete, callback, pt, cycleDuration, r, type, pow;
			if (time >= totalDur) {
				this._totalTime = totalDur;
				this._cycle = this._repeat;
				if (this._yoyo && (this._cycle & 1) !== 0) {
					this._time = 0;
					this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
				} else {
					this._time = this._duration;
					this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1;
				}
				if (!this._reversed) {
					isComplete = true;
					callback = "onComplete";
				}
				if (this._duration === 0) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
					if (time === 0 || this._rawPrevTime < 0) if (this._rawPrevTime !== time) {
						force = true;
						if (this._rawPrevTime > 0) {
							callback = "onReverseComplete";
							if (suppressEvents) {
								time = -1; //when a callback is placed at the VERY beginning of a timeline and it repeats (or if timeline.seek(0) is called), events are normally suppressed during those behaviors (repeat or seek()) and without adjusting the _rawPrevTime back slightly, the onComplete wouldn't get called on the next render. This only applies to zero-duration tweens/callbacks of course.
							}
						}
					}
					this._rawPrevTime = time;
				}
				
			} else if (time < 0.0000001) { //to work around occasional floating point math artifacts, round super small values to 0.
				this._totalTime = this._time = this._cycle = 0;
				this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
				if (prevTotalTime !== 0 || (this._duration === 0 && this._rawPrevTime > 0)) {
					callback = "onReverseComplete";
					isComplete = this._reversed;
				}
				if (time < 0) {
					this._active = false;
					if (this._duration === 0) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
						if (this._rawPrevTime >= 0) {
							force = true;
						}
						this._rawPrevTime = time;
					}
				} else if (!this._initted) { //if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
					force = true;
				}
			} else {
				this._totalTime = this._time = time;
				
				if (this._repeat !== 0) {
					cycleDuration = this._duration + this._repeatDelay;
					this._cycle = (this._totalTime / cycleDuration) >> 0; //originally _totalTime % cycleDuration but floating point errors caused problems, so I normalized it. (4 % 0.8 should be 0 but Flash reports it as 0.79999999!)
					if (this._cycle !== 0) if (this._cycle === this._totalTime / cycleDuration) {
						this._cycle--; //otherwise when rendered exactly at the end time, it will act as though it is repeating (at the beginning)
					}
					this._time = this._totalTime - (this._cycle * cycleDuration);
					if (this._yoyo) if ((this._cycle & 1) !== 0) {
						this._time = this._duration - this._time;
					}
					if (this._time > this._duration) {
						this._time = this._duration;
					} else if (this._time < 0) {
						this._time = 0;
					}
				}
				
				if (this._easeType) {
					r = this._time / this._duration;
					type = this._easeType;
					pow = this._easePower;
					if (type === 1 || (type === 3 && r >= 0.5)) {
						r = 1 - r;
					}
					if (type === 3) {
						r *= 2;
					}
					if (pow === 1) {
						r *= r;
					} else if (pow === 2) {
						r *= r * r;
					} else if (pow === 3) {
						r *= r * r * r;
					} else if (pow === 4) {
						r *= r * r * r * r;
					}
					
					if (type === 1) {
						this.ratio = 1 - r;
					} else if (type === 2) {
						this.ratio = r;
					} else if (this._time / this._duration < 0.5) {
						this.ratio = r / 2;
					} else {
						this.ratio = 1 - (r / 2);
					}
					
				} else {
					this.ratio = this._ease.getRatio(this._time / this._duration);
				}
				
			}
				
			if (prevTime === this._time && !force) {
				if (prevTotalTime !== this._totalTime) if (this._onUpdate) if (!suppressEvents) { //so that onUpdate fires even during the repeatDelay - as long as the totalTime changed, we should trigger onUpdate.
					this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || _blankArray);
				}
				return;
			} else if (!this._initted) {
				this._init();
				if (!this._initted) { //immediateRender tweens typically won't initialize until the playhead advances (_time is greater than 0) in order to ensure that overwriting occurs properly.
					return;
				}
				//_ease is initially set to defaultEase, so now that init() has run, _ease is set properly and we need to recalculate the ratio. Overall this is faster than using conditional logic earlier in the method to avoid having to set ratio twice because we only init() once but renderTime() gets called VERY frequently.
				if (this._time && !isComplete) {
					this.ratio = this._ease.getRatio(this._time / this._duration);
				} else if (isComplete && this._ease._calcEnd) {
					this.ratio = this._ease.getRatio((this._time === 0) ? 0 : 1);
				}
			}
			
			if (!this._active) if (!this._paused) {
				this._active = true; //so that if the user renders a tween (as opposed to the timeline rendering it), the timeline is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the tween already finished but the user manually re-renders it as halfway done.
			}
			if (prevTotalTime === 0) {
				if (this._startAt) {
					if (time >= 0) {
						this._startAt.render(time, suppressEvents, force);
					} else if (!callback) {
						callback = "_dummyGS"; //if no callback is defined, use a dummy value just so that the condition at the end evaluates as true because _startAt should render AFTER the normal render loop when the time is negative. We could handle this in a more intuitive way, of course, but the render loop is the MOST important thing to optimize, so this technique allows us to avoid adding extra conditional logic in a high-frequency area.
					}
				}
				if (this.vars.onStart) if (this._totalTime !== 0 || this._duration === 0) if (!suppressEvents) {
					this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || _blankArray);
				}
			}
			
			pt = this._firstPT;
			
			while (pt) 
			{
				if (pt.f) 
				{
					pt.t[pt.p](pt.c * this.ratio + pt.s);
				} 
				else 
				{
					var newVal = pt.c * this.ratio + pt.s;
				
					if (pt.p == "x")
					{
						pt.t.setX(newVal);
					}
					else if (pt.p == "y")
					{
						pt.t.setY(newVal);
					}
					else if (pt.p == "z")
					{
						pt.t.setZ(newVal);
					}
					else if (pt.p == "w")
					{
						pt.t.setWidth(newVal);
					}
					else if (pt.p == "h")
					{
						pt.t.setHeight(newVal);
					}
					else if (pt.p == "alpha")
					{
						pt.t.setAlpha(newVal);
					}
					else if (pt.p == "scale")
					{
						pt.t.setScale(newVal);
					}
					else
					{
						pt.t[pt.p] = newVal;
					}
				}
				
				pt = pt._next;
			}
			
			if (this._onUpdate) {
				if (time < 0) if (this._startAt) {
					this._startAt.render(time, suppressEvents, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.
				}
				if (!suppressEvents) {
					this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || _blankArray);
				}
			}
			if (this._cycle !== prevCycle) if (!suppressEvents) if (!this._gc) if (this.vars.onRepeat) {
				this.vars.onRepeat.apply(this.vars.onRepeatScope || this, this.vars.onRepeatParams || _blankArray);
			}
			if (callback) if (!this._gc) { //check gc because there's a chance that kill() could be called in an onUpdate
				if (time < 0 && this._startAt && !this._onUpdate) {
					this._startAt.render(time, suppressEvents, force);
				}
				if (isComplete) {
					if (this._timeline.autoRemoveChildren) {
						this._enabled(false, false);
					}
					this._active = false;
				}
				if (!suppressEvents && this.vars[callback]) {
					this.vars[callback].apply(this.vars[callback + "Scope"] || this, this.vars[callback + "Params"] || _blankArray);
				}
			}
		};
		
//---- STATIC FUNCTIONS -----------------------------------------------------------------------------------------------------------
		
		TweenMax.to = function(target, duration, vars) {
			return new TweenMax(target, duration, vars);
		};
		
		TweenMax.from = function(target, duration, vars) {
			vars.runBackwards = true;
			vars.immediateRender = (vars.immediateRender != false);
			return new TweenMax(target, duration, vars);
		};
		
		TweenMax.fromTo = function(target, duration, fromVars, toVars) {
			toVars.startAt = fromVars;
			toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
			return new TweenMax(target, duration, toVars);
		};
		
		TweenMax.staggerTo = TweenMax.allTo = function(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			stagger = stagger || 0;
			var delay = vars.delay || 0,
				a = [],
				finalComplete = function() {
					if (vars.onComplete) {
						vars.onComplete.apply(vars.onCompleteScope || this, vars.onCompleteParams || _blankArray);
					}
					onCompleteAll.apply(onCompleteAllScope || this, onCompleteAllParams || _blankArray);
				},
				l, copy, i, p;
			if (!(targets instanceof Array)) {
				if (typeof(targets) === "string") {
					targets = TweenLite.selector(targets) || targets;
				}
				if (_isSelector(targets)) {
					targets = _slice.call(targets, 0);
				}
			}
			l = targets.length;
			for (i = 0; i < l; i++) {
				copy = {};
				for (p in vars) {
					copy[p] = vars[p];
				}
				copy.delay = delay;
				if (i === l - 1 && onCompleteAll) {
					copy.onComplete = finalComplete;
				}
				a[i] = new TweenMax(targets[i], duration, copy);
				delay += stagger;
			}
			return a;
		};
		
		TweenMax.staggerFrom = TweenMax.allFrom = function(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			vars.runBackwards = true;
			vars.immediateRender = (vars.immediateRender != false);
			return TweenMax.staggerTo(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
		};
		
		TweenMax.staggerFromTo = TweenMax.allFromTo = function(targets, duration, fromVars, toVars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			toVars.startAt = fromVars;
			toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
			return TweenMax.staggerTo(targets, duration, toVars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
		};
				
		TweenMax.delayedCall = function(delay, callback, params, scope, useFrames) {
			return new TweenMax(callback, 0, {delay:delay, onComplete:callback, onCompleteParams:params, onCompleteScope:scope, onReverseComplete:callback, onReverseCompleteParams:params, onReverseCompleteScope:scope, immediateRender:false, useFrames:useFrames, overwrite:0});
		};
		
		TweenMax.set = function(target, vars) {
			return new TweenMax(target, 0, vars);
		};
		
		TweenMax.isTweening = function(target) {
			var a = TweenLite.getTweensOf(target),
				i = a.length,
				tween;
			while (--i > -1) {
				tween = a[i];
				if (tween._active || (tween._startTime === tween._timeline._time && tween._timeline._active)) {
					return true;
				}
			}
			return false;
		};
		
		var _getChildrenOf = function(timeline, includeTimelines) {
				var a = [],
					cnt = 0,
					tween = timeline._first;
				while (tween) {
					if (tween instanceof TweenLite) {
						a[cnt++] = tween;
					} else {
						if (includeTimelines) {
							a[cnt++] = tween;
						}
						a = a.concat(_getChildrenOf(tween, includeTimelines));
						cnt = a.length;
					}
					tween = tween._next;
				}
				return a;
			}, 
			getAllTweens = TweenMax.getAllTweens = function(includeTimelines) {
				return _getChildrenOf(Animation._rootTimeline, includeTimelines).concat( _getChildrenOf(Animation._rootFramesTimeline, includeTimelines) );
			};
		
		TweenMax.killAll = function(complete, tweens, delayedCalls, timelines) {
			if (tweens == null) {
				tweens = true;
			}
			if (delayedCalls == null) {
				delayedCalls = true;
			}
			var a = getAllTweens((timelines != false)),
				l = a.length,
				allTrue = (tweens && delayedCalls && timelines),
				isDC, tween, i;
			for (i = 0; i < l; i++) {
				tween = a[i];
				if (allTrue || (tween instanceof SimpleTimeline) || ((isDC = (tween.target === tween.vars.onComplete)) && delayedCalls) || (tweens && !isDC)) {
					if (complete) {
						tween.totalTime(tween.totalDuration());
					} else {
						tween._enabled(false, false);
					}
				}
			}
		};
		
		TweenMax.killChildTweensOf = function(parent, complete) {
			if (parent == null) {
				return;
			}
			var tl = TweenLite._tweenLookup,
				a, curParent, p, i, l;
			if (typeof(parent) === "string") {
				parent = TweenLite.selector(parent) || parent;
			}
			if (_isSelector(parent)) {
				parent = _slice(parent, 0);
			}
			if (parent instanceof Array) {
				i = parent.length;
				while (--i > -1) {
					TweenMax.killChildTweensOf(parent[i], complete);
				}
				return;
			}
			a = [];
			for (p in tl) {
				curParent = tl[p].target.parentNode;
				while (curParent) {
					if (curParent === parent) {
						a = a.concat(tl[p].tweens);
					}
					curParent = curParent.parentNode;
				}
			}
			l = a.length;
			for (i = 0; i < l; i++) {
				if (complete) {
					a[i].totalTime(a[i].totalDuration());
				}
				a[i]._enabled(false, false);
			}
		};

		var _changePause = function(pause, tweens, delayedCalls, timelines) {
			if (tweens === undefined) {
				tweens = true;
			}
			if (delayedCalls === undefined) {
				delayedCalls = true;
			}
			var a = getAllTweens(timelines),
				allTrue = (tweens && delayedCalls && timelines),
				i = a.length,
				isDC, tween;
			while (--i > -1) {
				tween = a[i];
				if (allTrue || (tween instanceof SimpleTimeline) || ((isDC = (tween.target === tween.vars.onComplete)) && delayedCalls) || (tweens && !isDC)) {
					tween.paused(pause);
				}
			}
		};
		
		TweenMax.pauseAll = function(tweens, delayedCalls, timelines) {
			_changePause(true, tweens, delayedCalls, timelines);
		};
		
		TweenMax.resumeAll = function(tweens, delayedCalls, timelines) {
			_changePause(false, tweens, delayedCalls, timelines);
		};
		
	
//---- GETTERS / SETTERS ----------------------------------------------------------------------------------------------------------
		
		p.progress = function(value) {
			return (!arguments.length) ? this._time / this.duration() : this.totalTime( this.duration() * ((this._yoyo && (this._cycle & 1) !== 0) ? 1 - value : value) + (this._cycle * (this._duration + this._repeatDelay)), false);
		};
		
		p.totalProgress = function(value) {
			return (!arguments.length) ? this._totalTime / this.totalDuration() : this.totalTime( this.totalDuration() * value, false);
		};
		
		p.time = function(value, suppressEvents) {
			if (!arguments.length) {
				return this._time;
			}
			if (this._dirty) {
				this.totalDuration();
			}
			if (value > this._duration) {
				value = this._duration;
			}
			if (this._yoyo && (this._cycle & 1) !== 0) {
				value = (this._duration - value) + (this._cycle * (this._duration + this._repeatDelay));
			} else if (this._repeat !== 0) {
				value += this._cycle * (this._duration + this._repeatDelay);
			}
			return this.totalTime(value, suppressEvents);
		};

		p.duration = function(value) {
			if (!arguments.length) {
				return this._duration; //don't set _dirty = false because there could be repeats that haven't been factored into the _totalDuration yet. Otherwise, if you create a repeated TweenMax and then immediately check its duration(), it would cache the value and the totalDuration would not be correct, thus repeats wouldn't take effect.
			}
			return Animation.prototype.duration.call(this, value);
		};

		p.totalDuration = function(value) {
			if (!arguments.length) {
				if (this._dirty) {
					//instead of Infinity, we use 999999999999 so that we can accommodate reverses
					this._totalDuration = (this._repeat === -1) ? 999999999999 : this._duration * (this._repeat + 1) + (this._repeatDelay * this._repeat);
					this._dirty = false;
				}
				return this._totalDuration;
			}
			return (this._repeat === -1) ? this : this.duration( (value - (this._repeat * this._repeatDelay)) / (this._repeat + 1) );
		};
		
		p.repeat = function(value) {
			if (!arguments.length) {
				return this._repeat;
			}
			this._repeat = value;
			return this._uncache(true);
		};
		
		p.repeatDelay = function(value) {
			if (!arguments.length) {
				return this._repeatDelay;
			}
			this._repeatDelay = value;
			return this._uncache(true);
		};
		
		p.yoyo = function(value) {
			if (!arguments.length) {
				return this._yoyo;
			}
			this._yoyo = value;
			return this;
		};
		
		
		return TweenMax;
		
	}, true);








/*
 * ----------------------------------------------------------------
 * TimelineLite
 * ----------------------------------------------------------------
 */
	window._gsDefine("TimelineLite", ["core.Animation","core.SimpleTimeline","TweenLite"], function(Animation, SimpleTimeline, TweenLite) {

		var TimelineLite = function(vars) {
				SimpleTimeline.call(this, vars);
				this._labels = {};
				this.autoRemoveChildren = (this.vars.autoRemoveChildren === true);
				this.smoothChildTiming = (this.vars.smoothChildTiming === true);
				this._sortChildren = true;
				this._onUpdate = this.vars.onUpdate;
				var v = this.vars,
					i = _paramProps.length,
					j, a;
				while (--i > -1) {
					a = v[_paramProps[i]];
					if (a) {
						j = a.length;
						while (--j > -1) {
							if (a[j] === "{self}") {
								a = v[_paramProps[i]] = a.concat(); //copy the array in case the user referenced the same array in multiple timelines/tweens (each {self} should be unique)
								a[j] = this;
							}
						}
					}
				}
				if (v.tweens instanceof Array) {
					this.add(v.tweens, 0, v.align, v.stagger);
				}
			},
			_paramProps = ["onStartParams","onUpdateParams","onCompleteParams","onReverseCompleteParams","onRepeatParams"],
			_blankArray = [],
			_copy = function(vars) {
				var copy = {}, p;
				for (p in vars) {
					copy[p] = vars[p];
				}
				return copy;
			},
			_slice = _blankArray.slice,
			p = TimelineLite.prototype = new SimpleTimeline();

		TimelineLite.version = "1.9.7";
		p.constructor = TimelineLite;
		p.kill()._gc = false;

		p.to = function(target, duration, vars, position) {
			return duration ? this.add( new TweenLite(target, duration, vars), position) : this.set(target, vars, position);
		};

		p.from = function(target, duration, vars, position) {
			return this.add( TweenLite.from(target, duration, vars), position);
		};

		p.fromTo = function(target, duration, fromVars, toVars, position) {
			return duration ? this.add( TweenLite.fromTo(target, duration, fromVars, toVars), position) : this.set(target, toVars, position);
		};

		p.staggerTo = function(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			var tl = new TimelineLite({onComplete:onCompleteAll, onCompleteParams:onCompleteAllParams, onCompleteScope:onCompleteAllScope}),
				i;
			if (typeof(targets) === "string") {
				targets = TweenLite.selector(targets) || targets;
			}
			if (!(targets instanceof Array) && targets.length && targets[0] && targets[0].nodeType && targets[0].style) { //senses if the targets object is a selector. If it is, we should translate it into an array.
				targets = _slice.call(targets, 0);
			}
			stagger = stagger || 0;
			for (i = 0; i < targets.length; i++) {
				if (vars.startAt) {
					vars.startAt = _copy(vars.startAt);
				}
				tl.to(targets[i], duration, _copy(vars), i * stagger);
			}
			return this.add(tl, position);
		};

		p.staggerFrom = function(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			vars.immediateRender = (vars.immediateRender != false);
			vars.runBackwards = true;
			return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
		};

		p.staggerFromTo = function(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			toVars.startAt = fromVars;
			toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
			return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
		};

		p.call = function(callback, params, scope, position) {
			return this.add( TweenLite.delayedCall(0, callback, params, scope), position);
		};

		p.set = function(target, vars, position) {
			position = this._parseTimeOrLabel(position, 0, true);
			if (vars.immediateRender == null) {
				vars.immediateRender = (position === this._time && !this._paused);
			}
			return this.add( new TweenLite(target, 0, vars), position);
		};

		TimelineLite.exportRoot = function(vars, ignoreDelayedCalls) {
			vars = vars || {};
			if (vars.smoothChildTiming == null) {
				vars.smoothChildTiming = true;
			}
			var tl = new TimelineLite(vars),
				root = tl._timeline,
				tween, next;
			if (ignoreDelayedCalls == null) {
				ignoreDelayedCalls = true;
			}
			root._remove(tl, true);
			tl._startTime = 0;
			tl._rawPrevTime = tl._time = tl._totalTime = root._time;
			tween = root._first;
			while (tween) {
				next = tween._next;
				if (!ignoreDelayedCalls || !(tween instanceof TweenLite && tween.target === tween.vars.onComplete)) {
					tl.add(tween, tween._startTime - tween._delay);
				}
				tween = next;
			}
			root.add(tl, 0);
			return tl;
		};

		p.add = function(value, position, align, stagger) {
			var curTime, l, i, child, tl;
			if (typeof(position) !== "number") {
				position = this._parseTimeOrLabel(position, 0, true, value);
			}
			if (!(value instanceof Animation)) {
				if (value instanceof Array) {
					align = align || "normal";
					stagger = stagger || 0;
					curTime = position;
					l = value.length;
					for (i = 0; i < l; i++) {
						if ((child = value[i]) instanceof Array) {
							child = new TimelineLite({tweens:child});
						}
						this.add(child, curTime);
						if (typeof(child) !== "string" && typeof(child) !== "function") {
							if (align === "sequence") {
								curTime = child._startTime + (child.totalDuration() / child._timeScale);
							} else if (align === "start") {
								child._startTime -= child.delay();
							}
						}
						curTime += stagger;
					}
					return this._uncache(true);
				} else if (typeof(value) === "string") {
					return this.addLabel(value, position);
				} else if (typeof(value) === "function") {
					value = TweenLite.delayedCall(0, value);
				} else {
					throw("Cannot add " + value + " into the timeline; it is neither a tween, timeline, function, nor a string.");
				}
			}

			SimpleTimeline.prototype.add.call(this, value, position);

			//if the timeline has already ended but the inserted tween/timeline extends the duration, we should enable this timeline again so that it renders properly.
			if (this._gc) if (!this._paused) if (this._time === this._duration) if (this._time < this.duration()) {
				//in case any of the anscestors had completed but should now be enabled...
				tl = this;
				while (tl._gc && tl._timeline) {
					if (tl._timeline.smoothChildTiming) {
						tl.totalTime(tl._totalTime, true); //also enables them
					} else {
						tl._enabled(true, false);
					}
					tl = tl._timeline;
				}
			}

			return this;
		};

		p.remove = function(value) {
			if (value instanceof Animation) {
				return this._remove(value, false);
			} else if (value instanceof Array) {
				var i = value.length;
				while (--i > -1) {
					this.remove(value[i]);
				}
				return this;
			} else if (typeof(value) === "string") {
				return this.removeLabel(value);
			}
			return this.kill(null, value);
		};

		p.append = function(value, offsetOrLabel) {
			return this.add(value, this._parseTimeOrLabel(null, offsetOrLabel, true, value));
		};

		p.insert = p.insertMultiple = function(value, position, align, stagger) {
			return this.add(value, position || 0, align, stagger);
		};

		p.appendMultiple = function(tweens, offsetOrLabel, align, stagger) {
			return this.add(tweens, this._parseTimeOrLabel(null, offsetOrLabel, true, tweens), align, stagger);
		};

		p.addLabel = function(label, position) {
			this._labels[label] = this._parseTimeOrLabel(position);
			return this;
		};

		p.removeLabel = function(label) {
			delete this._labels[label];
			return this;
		};

		p.getLabelTime = function(label) {
			return (this._labels[label] != null) ? this._labels[label] : -1;
		};

		p._parseTimeOrLabel = function(timeOrLabel, offsetOrLabel, appendIfAbsent, ignore) {
			var i;
			//if we're about to add a tween/timeline (or an array of them) that's already a child of this timeline, we should remove it first so that it doesn't contaminate the duration().
			if (ignore instanceof Animation && ignore.timeline === this) {
				this.remove(ignore);
			} else if (ignore instanceof Array) {
				i = ignore.length;
				while (--i > -1) {
					if (ignore[i] instanceof Animation && ignore[i].timeline === this) {
						this.remove(ignore[i]);
					}
				}
			}
			if (typeof(offsetOrLabel) === "string") {
				return this._parseTimeOrLabel(offsetOrLabel, (appendIfAbsent && typeof(timeOrLabel) === "number" && this._labels[offsetOrLabel] == null) ? timeOrLabel - this.duration() : 0, appendIfAbsent);
			}
			offsetOrLabel = offsetOrLabel || 0;
			if (typeof(timeOrLabel) === "string" && (isNaN(timeOrLabel) || this._labels[timeOrLabel] != null)) { //if the string is a number like "1", check to see if there's a label with that name, otherwise interpret it as a number (absolute value).
				i = timeOrLabel.indexOf("=");
				if (i === -1) {
					if (this._labels[timeOrLabel] == null) {
						return appendIfAbsent ? (this._labels[timeOrLabel] = this.duration() + offsetOrLabel) : offsetOrLabel;
					}
					return this._labels[timeOrLabel] + offsetOrLabel;
				}
				offsetOrLabel = parseInt(timeOrLabel.charAt(i-1) + "1", 10) * Number(timeOrLabel.substr(i+1));
				timeOrLabel = (i > 1) ? this._parseTimeOrLabel(timeOrLabel.substr(0, i-1), 0, appendIfAbsent) : this.duration();
			} else if (timeOrLabel == null) {
				timeOrLabel = this.duration();
			}
			return Number(timeOrLabel) + offsetOrLabel;
		};

		p.seek = function(position, suppressEvents) {
			return this.totalTime((typeof(position) === "number") ? position : this._parseTimeOrLabel(position), (suppressEvents !== false));
		};

		p.stop = function() {
			return this.paused(true);
		};

		p.gotoAndPlay = function(position, suppressEvents) {
			return this.play(position, suppressEvents);
		};

		p.gotoAndStop = function(position, suppressEvents) {
			return this.pause(position, suppressEvents);
		};

		p.render = function(time, suppressEvents, force) {
			if (this._gc) {
				this._enabled(true, false);
			}
			this._active = !this._paused;
			var totalDur = (!this._dirty) ? this._totalDuration : this.totalDuration(),
				prevTime = this._time,
				prevStart = this._startTime,
				prevTimeScale = this._timeScale,
				prevPaused = this._paused,
				tween, isComplete, next, callback, internalForce;
			if (time >= totalDur) {
				this._totalTime = this._time = totalDur;
				if (!this._reversed) if (!this._hasPausedChild()) {
					isComplete = true;
					callback = "onComplete";
					if (this._duration === 0) if (time === 0 || this._rawPrevTime < 0) if (this._rawPrevTime !== time && this._first) { //In order to accommodate zero-duration timelines, we must discern the momentum/direction of time in order to render values properly when the "playhead" goes past 0 in the forward direction or lands directly on it, and also when it moves past it in the backward direction (from a postitive time to a negative time).
						internalForce = true;
						if (this._rawPrevTime > 0) {
							callback = "onReverseComplete";
						}
					}
				}
				this._rawPrevTime = time;
				time = totalDur + 0.000001; //to avoid occasional floating point rounding errors - sometimes child tweens/timelines were not being fully completed (their progress might be 0.999999999999998 instead of 1 because when _time - tween._startTime is performed, floating point errors would return a value that was SLIGHTLY off)

			} else if (time < 0.0000001) { //to work around occasional floating point math artifacts, round super small values to 0.
				this._totalTime = this._time = 0;
				if (prevTime !== 0 || (this._duration === 0 && this._rawPrevTime > 0)) {
					callback = "onReverseComplete";
					isComplete = this._reversed;
				}
				if (time < 0) {
					this._active = false;
					if (this._duration === 0) if (this._rawPrevTime >= 0 && this._first) { //zero-duration timelines are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
						internalForce = true;
					}
				} else if (!this._initted) {
					internalForce = true;
				}
				this._rawPrevTime = time;
				time = 0; //to avoid occasional floating point rounding errors (could cause problems especially with zero-duration tweens at the very beginning of the timeline)

			} else {
				this._totalTime = this._time = this._rawPrevTime = time;
			}
			if ((this._time === prevTime || !this._first) && !force && !internalForce) {
				return;
			} else if (!this._initted) {
				this._initted = true;
			}
			if (prevTime === 0) if (this.vars.onStart) if (this._time !== 0) if (!suppressEvents) {
				this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || _blankArray);
			}

			if (this._time >= prevTime) {
				tween = this._first;
				while (tween) {
					next = tween._next; //record it here because the value could change after rendering...
					if (this._paused && !prevPaused) { //in case a tween pauses the timeline when rendering
						break;
					} else if (tween._active || (tween._startTime <= this._time && !tween._paused && !tween._gc)) {

						if (!tween._reversed) {
							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
						} else {
							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
						}

					}
					tween = next;
				}
			} else {
				tween = this._last;
				while (tween) {
					next = tween._prev; //record it here because the value could change after rendering...
					if (this._paused && !prevPaused) { //in case a tween pauses the timeline when rendering
						break;
					} else if (tween._active || (tween._startTime <= prevTime && !tween._paused && !tween._gc)) {

						if (!tween._reversed) {
							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
						} else {
							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
						}

					}
					tween = next;
				}
			}

			if (this._onUpdate) if (!suppressEvents) {
				this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || _blankArray);
			}

			if (callback) if (!this._gc) if (prevStart === this._startTime || prevTimeScale !== this._timeScale) if (this._time === 0 || totalDur >= this.totalDuration()) { //if one of the tweens that was rendered altered this timeline's startTime (like if an onComplete reversed the timeline), it probably isn't complete. If it is, don't worry, because whatever call altered the startTime would complete if it was necessary at the new time. The only exception is the timeScale property. Also check _gc because there's a chance that kill() could be called in an onUpdate
				if (isComplete) {
					if (this._timeline.autoRemoveChildren) {
						this._enabled(false, false);
					}
					this._active = false;
				}
				if (!suppressEvents && this.vars[callback]) {
					this.vars[callback].apply(this.vars[callback + "Scope"] || this, this.vars[callback + "Params"] || _blankArray);
				}
			}
		};

		p._hasPausedChild = function() {
			var tween = this._first;
			while (tween) {
				if (tween._paused || ((tween instanceof TimelineLite) && tween._hasPausedChild())) {
					return true;
				}
				tween = tween._next;
			}
			return false;
		};

		p.getChildren = function(nested, tweens, timelines, ignoreBeforeTime) {
			ignoreBeforeTime = ignoreBeforeTime || -9999999999;
			var a = [],
				tween = this._first,
				cnt = 0;
			while (tween) {
				if (tween._startTime < ignoreBeforeTime) {
					//do nothing
				} else if (tween instanceof TweenLite) {
					if (tweens !== false) {
						a[cnt++] = tween;
					}
				} else {
					if (timelines !== false) {
						a[cnt++] = tween;
					}
					if (nested !== false) {
						a = a.concat(tween.getChildren(true, tweens, timelines));
						cnt = a.length;
					}
				}
				tween = tween._next;
			}
			return a;
		};

		p.getTweensOf = function(target, nested) {
			var tweens = TweenLite.getTweensOf(target),
				i = tweens.length,
				a = [],
				cnt = 0;
			while (--i > -1) {
				if (tweens[i].timeline === this || (nested && this._contains(tweens[i]))) {
					a[cnt++] = tweens[i];
				}
			}
			return a;
		};

		p._contains = function(tween) {
			var tl = tween.timeline;
			while (tl) {
				if (tl === this) {
					return true;
				}
				tl = tl.timeline;
			}
			return false;
		};

		p.shiftChildren = function(amount, adjustLabels, ignoreBeforeTime) {
			ignoreBeforeTime = ignoreBeforeTime || 0;
			var tween = this._first,
				labels = this._labels,
				p;
			while (tween) {
				if (tween._startTime >= ignoreBeforeTime) {
					tween._startTime += amount;
				}
				tween = tween._next;
			}
			if (adjustLabels) {
				for (p in labels) {
					if (labels[p] >= ignoreBeforeTime) {
						labels[p] += amount;
					}
				}
			}
			return this._uncache(true);
		};

		p._kill = function(vars, target) {
			if (!vars && !target) {
				return this._enabled(false, false);
			}
			var tweens = (!target) ? this.getChildren(true, true, false) : this.getTweensOf(target),
				i = tweens.length,
				changed = false;
			while (--i > -1) {
				if (tweens[i]._kill(vars, target)) {
					changed = true;
				}
			}
			return changed;
		};

		p.clear = function(labels) {
			var tweens = this.getChildren(false, true, true),
				i = tweens.length;
			this._time = this._totalTime = 0;
			while (--i > -1) {
				tweens[i]._enabled(false, false);
			}
			if (labels !== false) {
				this._labels = {};
			}
			return this._uncache(true);
		};

		p.invalidate = function() {
			var tween = this._first;
			while (tween) {
				tween.invalidate();
				tween = tween._next;
			}
			return this;
		};

		p._enabled = function(enabled, ignoreTimeline) {
			if (enabled === this._gc) {
				var tween = this._first;
				while (tween) {
					tween._enabled(enabled, true);
					tween = tween._next;
				}
			}
			return SimpleTimeline.prototype._enabled.call(this, enabled, ignoreTimeline);
		};

		p.progress = function(value) {
			return (!arguments.length) ? this._time / this.duration() : this.totalTime(this.duration() * value, false);
		};

		p.duration = function(value) {
			if (!arguments.length) {
				if (this._dirty) {
					this.totalDuration(); //just triggers recalculation
				}
				return this._duration;
			}
			if (this.duration() !== 0 && value !== 0) {
				this.timeScale(this._duration / value);
			}
			return this;
		};

		p.totalDuration = function(value) {
			if (!arguments.length) {
				if (this._dirty) {
					var max = 0,
						tween = this._last,
						prevStart = 999999999999,
						prev, end;
					while (tween) {
						prev = tween._prev; //record it here in case the tween changes position in the sequence...
						if (tween._dirty) {
							tween.totalDuration(); //could change the tween._startTime, so make sure the tween's cache is clean before analyzing it.
						}
						if (tween._startTime > prevStart && this._sortChildren && !tween._paused) { //in case one of the tweens shifted out of order, it needs to be re-inserted into the correct position in the sequence
							this.add(tween, tween._startTime - tween._delay);
						} else {
							prevStart = tween._startTime;
						}
						if (tween._startTime < 0 && !tween._paused) { //children aren't allowed to have negative startTimes unless smoothChildTiming is true, so adjust here if one is found.
							max -= tween._startTime;
							if (this._timeline.smoothChildTiming) {
								this._startTime += tween._startTime / this._timeScale;
							}
							this.shiftChildren(-tween._startTime, false, -9999999999);
							prevStart = 0;
						}
						end = tween._startTime + (tween._totalDuration / tween._timeScale);
						if (end > max) {
							max = end;
						}
						tween = prev;
					}
					this._duration = this._totalDuration = max;
					this._dirty = false;
				}
				return this._totalDuration;
			}
			if (this.totalDuration() !== 0) if (value !== 0) {
				this.timeScale(this._totalDuration / value);
			}
			return this;
		};

		p.usesFrames = function() {
			var tl = this._timeline;
			while (tl._timeline) {
				tl = tl._timeline;
			}
			return (tl === Animation._rootFramesTimeline);
		};

		p.rawTime = function() {
			return (this._paused || (this._totalTime !== 0 && this._totalTime !== this._totalDuration)) ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale;
		};

		return TimelineLite;

	}, true);
	







	
	
	
	
	
/*
 * ----------------------------------------------------------------
 * TimelineMax
 * ----------------------------------------------------------------
 */
	window._gsDefine("TimelineMax", ["TimelineLite","TweenLite","easing.Ease"], function(TimelineLite, TweenLite, Ease) {

		var TimelineMax = function(vars) {
				TimelineLite.call(this, vars);
				this._repeat = this.vars.repeat || 0;
				this._repeatDelay = this.vars.repeatDelay || 0;
				this._cycle = 0;
				this._yoyo = (this.vars.yoyo === true);
				this._dirty = true;
			},
			_blankArray = [],
			_easeNone = new Ease(null, null, 1, 0),
			_getGlobalPaused = function(tween) {
				while (tween) {
					if (tween._paused) {
						return true;
					}
					tween = tween._timeline;
				}
				return false;
			},
			p = TimelineMax.prototype = new TimelineLite();

		p.constructor = TimelineMax;
		p.kill()._gc = false;
		TimelineMax.version = "1.9.7";

		p.invalidate = function() {
			this._yoyo = (this.vars.yoyo === true);
			this._repeat = this.vars.repeat || 0;
			this._repeatDelay = this.vars.repeatDelay || 0;
			this._uncache(true);
			return TimelineLite.prototype.invalidate.call(this);
		};

		p.addCallback = function(callback, position, params, scope) {
			return this.add( TweenLite.delayedCall(0, callback, params, scope), position);
		};

		p.removeCallback = function(callback, position) {
			if (position == null) {
				this._kill(null, callback);
			} else {
				var a = this.getTweensOf(callback, false),
					i = a.length,
					time = this._parseTimeOrLabel(position);
				while (--i > -1) {
					if (a[i]._startTime === time) {
						a[i]._enabled(false, false);
					}
				}
			}
			return this;
		};

		p.tweenTo = function(position, vars) {
			vars = vars || {};
			var copy = {ease:_easeNone, overwrite:2, useFrames:this.usesFrames(), immediateRender:false}, p, t;
			for (p in vars) {
				copy[p] = vars[p];
			}
			copy.time = this._parseTimeOrLabel(position);
			t = new TweenLite(this, (Math.abs(Number(copy.time) - this._time) / this._timeScale) || 0.001, copy);
			copy.onStart = function() {
				t.target.paused(true);
				if (t.vars.time !== t.target.time()) { //don't make the duration zero - if it's supposed to be zero, don't worry because it's already initting the tween and will complete immediately, effectively making the duration zero anyway. If we make duration zero, the tween won't run at all.
					t.duration( Math.abs( t.vars.time - t.target.time()) / t.target._timeScale );
				}
				if (vars.onStart) { //in case the user had an onStart in the vars - we don't want to overwrite it.
					vars.onStart.apply(vars.onStartScope || t, vars.onStartParams || _blankArray);
				}
			};
			return t;
		};

		p.tweenFromTo = function(fromPosition, toPosition, vars) {
			vars = vars || {};
			fromPosition = this._parseTimeOrLabel(fromPosition);
			vars.startAt = {onComplete:this.seek, onCompleteParams:[fromPosition], onCompleteScope:this};
			vars.immediateRender = (vars.immediateRender !== false);
			var t = this.tweenTo(toPosition, vars);
			return t.duration((Math.abs( t.vars.time - fromPosition) / this._timeScale) || 0.001);
		};

		p.render = function(time, suppressEvents, force) {
			if (this._gc) {
				this._enabled(true, false);
			}
			this._active = !this._paused;
			var totalDur = (!this._dirty) ? this._totalDuration : this.totalDuration(),
				dur = this._duration,
				prevTime = this._time,
				prevTotalTime = this._totalTime,
				prevStart = this._startTime,
				prevTimeScale = this._timeScale,
				prevRawPrevTime = this._rawPrevTime,
				prevPaused = this._paused,
				prevCycle = this._cycle,
				tween, isComplete, next, callback, internalForce, cycleDuration;
			if (time >= totalDur) {
				if (!this._locked) {
					this._totalTime = totalDur;
					this._cycle = this._repeat;
				}
				if (!this._reversed) if (!this._hasPausedChild()) {
					isComplete = true;
					callback = "onComplete";
					if (dur === 0) if (time === 0 || this._rawPrevTime < 0) if (this._rawPrevTime !== time && this._first) { //In order to accommodate zero-duration timelines, we must discern the momentum/direction of time in order to render values properly when the "playhead" goes past 0 in the forward direction or lands directly on it, and also when it moves past it in the backward direction (from a postitive time to a negative time).
						internalForce = true;
						if (this._rawPrevTime > 0) {
							callback = "onReverseComplete";
						}
					}
				}
				this._rawPrevTime = time;
				if (this._yoyo && (this._cycle & 1) !== 0) {
					this._time = time = 0;
				} else {
					this._time = dur;
					time = dur + 0.000001; //to avoid occasional floating point rounding errors
				}

			} else if (time < 0.0000001) { //to work around occasional floating point math artifacts, round super small values to 0.
				if (!this._locked) {
					this._totalTime = this._cycle = 0;
				}
				this._time = 0;
				if (prevTime !== 0 || (dur === 0 && this._rawPrevTime > 0 && !this._locked)) {
					callback = "onReverseComplete";
					isComplete = this._reversed;
				}
				if (time < 0) {
					this._active = false;
					if (dur === 0) if (this._rawPrevTime >= 0 && this._first) { //zero-duration timelines are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
						internalForce = true;
					}
				} else if (!this._initted) {
					internalForce = true;
				}
				this._rawPrevTime = time;
				time = 0;  //to avoid occasional floating point rounding errors (could cause problems especially with zero-duration tweens at the very beginning of the timeline)

			} else {
				this._time = this._rawPrevTime = time;
				if (!this._locked) {
					this._totalTime = time;
					if (this._repeat !== 0) {
						cycleDuration = dur + this._repeatDelay;
						this._cycle = (this._totalTime / cycleDuration) >> 0; //originally _totalTime % cycleDuration but floating point errors caused problems, so I normalized it. (4 % 0.8 should be 0 but it gets reported as 0.79999999!)
						if (this._cycle !== 0) if (this._cycle === this._totalTime / cycleDuration) {
							this._cycle--; //otherwise when rendered exactly at the end time, it will act as though it is repeating (at the beginning)
						}
						this._time = this._totalTime - (this._cycle * cycleDuration);
						if (this._yoyo) if ((this._cycle & 1) !== 0) {
							this._time = dur - this._time;
						}
						if (this._time > dur) {
							this._time = dur;
							time = dur + 0.000001; //to avoid occasional floating point rounding error
						} else if (this._time < 0) {
							this._time = time = 0;
						} else {
							time = this._time;
						}
					}
				}
			}

			if (this._cycle !== prevCycle) if (!this._locked) {
				/*
				make sure children at the end/beginning of the timeline are rendered properly. If, for example,
				a 3-second long timeline rendered at 2.9 seconds previously, and now renders at 3.2 seconds (which
				would get transated to 2.8 seconds if the timeline yoyos or 0.2 seconds if it just repeats), there
				could be a callback or a short tween that's at 2.95 or 3 seconds in which wouldn't render. So
				we need to push the timeline to the end (and/or beginning depending on its yoyo value). Also we must
				ensure that zero-duration tweens at the very beginning or end of the TimelineMax work.
				*/
				var backwards = (this._yoyo && (prevCycle & 1) !== 0),
					wrap = (backwards === (this._yoyo && (this._cycle & 1) !== 0)),
					recTotalTime = this._totalTime,
					recCycle = this._cycle,
					recRawPrevTime = this._rawPrevTime,
					recTime = this._time;

				this._totalTime = prevCycle * dur;
				if (this._cycle < prevCycle) {
					backwards = !backwards;
				} else {
					this._totalTime += dur;
				}
				this._time = prevTime; //temporarily revert _time so that render() renders the children in the correct order. Without this, tweens won't rewind correctly. We could arhictect things in a "cleaner" way by splitting out the rendering queue into a separate method but for performance reasons, we kept it all inside this method.

				this._rawPrevTime = (dur === 0) ? prevRawPrevTime - 0.00001 : prevRawPrevTime;
				this._cycle = prevCycle;
				this._locked = true; //prevents changes to totalTime and skips repeat/yoyo behavior when we recursively call render()
				prevTime = (backwards) ? 0 : dur;
				this.render(prevTime, suppressEvents, (dur === 0));
				if (!suppressEvents) if (!this._gc) {
					if (this.vars.onRepeat) {
						this.vars.onRepeat.apply(this.vars.onRepeatScope || this, this.vars.onRepeatParams || _blankArray);
					}
				}
				if (wrap) {
					prevTime = (backwards) ? dur + 0.000001 : -0.000001;
					this.render(prevTime, true, false);
				}
				this._time = recTime;
				this._totalTime = recTotalTime;
				this._cycle = recCycle;
				this._rawPrevTime = recRawPrevTime;
				this._locked = false;
			}

			if ((this._time === prevTime || !this._first) && !force && !internalForce) {
				if (prevTotalTime !== this._totalTime) if (this._onUpdate) if (!suppressEvents) { //so that onUpdate fires even during the repeatDelay - as long as the totalTime changed, we should trigger onUpdate.
					this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || _blankArray);
				}
				return;
			} else if (!this._initted) {
				this._initted = true;
			}

			if (prevTotalTime === 0) if (this.vars.onStart) if (this._totalTime !== 0) if (!suppressEvents) {
				this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || _blankArray);
			}

			if (this._time >= prevTime) {
				tween = this._first;
				while (tween) {
					next = tween._next; //record it here because the value could change after rendering...
					if (this._paused && !prevPaused) { //in case a tween pauses the timeline when rendering
						break;
					} else if (tween._active || (tween._startTime <= this._time && !tween._paused && !tween._gc)) {
						if (!tween._reversed) {
							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
						} else {
							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
						}

					}
					tween = next;
				}
			} else {
				tween = this._last;
				while (tween) {
					next = tween._prev; //record it here because the value could change after rendering...
					if (this._paused && !prevPaused) { //in case a tween pauses the timeline when rendering
						break;
					} else if (tween._active || (tween._startTime <= prevTime && !tween._paused && !tween._gc)) {
						if (!tween._reversed) {
							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
						} else {
							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
						}

					}
					tween = next;
				}
			}

			if (this._onUpdate) if (!suppressEvents) {
				this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || _blankArray);
			}
			if (callback) if (!this._locked) if (!this._gc) if (prevStart === this._startTime || prevTimeScale !== this._timeScale) if (this._time === 0 || totalDur >= this.totalDuration()) { //if one of the tweens that was rendered altered this timeline's startTime (like if an onComplete reversed the timeline), it probably isn't complete. If it is, don't worry, because whatever call altered the startTime would complete if it was necessary at the new time. The only exception is the timeScale property. Also check _gc because there's a chance that kill() could be called in an onUpdate
				if (isComplete) {
					if (this._timeline.autoRemoveChildren) {
						this._enabled(false, false);
					}
					this._active = false;
				}
				if (!suppressEvents && this.vars[callback]) {
					this.vars[callback].apply(this.vars[callback + "Scope"] || this, this.vars[callback + "Params"] || _blankArray);
				}
			}
		};

		p.getActive = function(nested, tweens, timelines) {
			if (nested == null) {
				nested = true;
			}
			if (tweens == null) {
				tweens = true;
			}
			if (timelines == null) {
				timelines = false;
			}
			var a = [],
				all = this.getChildren(nested, tweens, timelines),
				cnt = 0,
				l = all.length,
				i, tween;
			for (i = 0; i < l; i++) {
				tween = all[i];
				//note: we cannot just check tween.active because timelines that contain paused children will continue to have "active" set to true even after the playhead passes their end point (technically a timeline can only be considered complete after all of its children have completed too, but paused tweens are...well...just waiting and until they're unpaused we don't know where their end point will be).
				if (!tween._paused) if (tween._timeline._time >= tween._startTime) if (tween._timeline._time < tween._startTime + tween._totalDuration / tween._timeScale) if (!_getGlobalPaused(tween._timeline)) {
					a[cnt++] = tween;
				}
			}
			return a;
		};


		p.getLabelAfter = function(time) {
			if (!time) if (time !== 0) { //faster than isNan()
				time = this._time;
			}
			var labels = this.getLabelsArray(),
				l = labels.length,
				i;
			for (i = 0; i < l; i++) {
				if (labels[i].time > time) {
					return labels[i].name;
				}
			}
			return null;
		};

		p.getLabelBefore = function(time) {
			if (time == null) {
				time = this._time;
			}
			var labels = this.getLabelsArray(),
				i = labels.length;
			while (--i > -1) {
				if (labels[i].time < time) {
					return labels[i].name;
				}
			}
			return null;
		};

		p.getLabelsArray = function() {
			var a = [],
				cnt = 0,
				p;
			for (p in this._labels) {
				a[cnt++] = {time:this._labels[p], name:p};
			}
			a.sort(function(a,b) {
				return a.time - b.time;
			});
			return a;
		};


//---- GETTERS / SETTERS -------------------------------------------------------------------------------------------------------

		p.progress = function(value) {
			return (!arguments.length) ? this._time / this.duration() : this.totalTime( this.duration() * ((this._yoyo && (this._cycle & 1) !== 0) ? 1 - value : value) + (this._cycle * (this._duration + this._repeatDelay)), false);
		};

		p.totalProgress = function(value) {
			return (!arguments.length) ? this._totalTime / this.totalDuration() : this.totalTime( this.totalDuration() * value, false);
		};

		p.totalDuration = function(value) {
			if (!arguments.length) {
				if (this._dirty) {
					TimelineLite.prototype.totalDuration.call(this); //just forces refresh
					//Instead of Infinity, we use 999999999999 so that we can accommodate reverses.
					this._totalDuration = (this._repeat === -1) ? 999999999999 : this._duration * (this._repeat + 1) + (this._repeatDelay * this._repeat);
				}
				return this._totalDuration;
			}
			return (this._repeat === -1) ? this : this.duration( (value - (this._repeat * this._repeatDelay)) / (this._repeat + 1) );
		};

		p.time = function(value, suppressEvents) {
			if (!arguments.length) {
				return this._time;
			}
			if (this._dirty) {
				this.totalDuration();
			}
			if (value > this._duration) {
				value = this._duration;
			}
			if (this._yoyo && (this._cycle & 1) !== 0) {
				value = (this._duration - value) + (this._cycle * (this._duration + this._repeatDelay));
			} else if (this._repeat !== 0) {
				value += this._cycle * (this._duration + this._repeatDelay);
			}
			return this.totalTime(value, suppressEvents);
		};

		p.repeat = function(value) {
			if (!arguments.length) {
				return this._repeat;
			}
			this._repeat = value;
			return this._uncache(true);
		};

		p.repeatDelay = function(value) {
			if (!arguments.length) {
				return this._repeatDelay;
			}
			this._repeatDelay = value;
			return this._uncache(true);
		};

		p.yoyo = function(value) {
			if (!arguments.length) {
				return this._yoyo;
			}
			this._yoyo = value;
			return this;
		};

		p.currentLabel = function(value) {
			if (!arguments.length) {
				return this.getLabelBefore(this._time + 0.00000001);
			}
			return this.seek(value, true);
		};

		return TimelineMax;

	}, true);
	




	
	
	
	
	
	
	
/*
 * ----------------------------------------------------------------
 * BezierPlugin
 * ----------------------------------------------------------------
 */
	(function() {

		var _RAD2DEG = 180 / Math.PI,
			_DEG2RAD = Math.PI / 180,
			_r1 = [],
			_r2 = [],
			_r3 = [],
			_corProps = {},
			Segment = function(a, b, c, d) {
				this.a = a;
				this.b = b;
				this.c = c;
				this.d = d;
				this.da = d - a;
				this.ca = c - a;
				this.ba = b - a;
			},
			_correlate = ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,",
			cubicToQuadratic = function(a, b, c, d) {
				var q1 = {a:a},
					q2 = {},
					q3 = {},
					q4 = {c:d},
					mab = (a + b) / 2,
					mbc = (b + c) / 2,
					mcd = (c + d) / 2,
					mabc = (mab + mbc) / 2,
					mbcd = (mbc + mcd) / 2,
					m8 = (mbcd - mabc) / 8;
				q1.b = mab + (a - mab) / 4;
				q2.b = mabc + m8;
				q1.c = q2.a = (q1.b + q2.b) / 2;
				q2.c = q3.a = (mabc + mbcd) / 2;
				q3.b = mbcd - m8;
				q4.b = mcd + (d - mcd) / 4;
				q3.c = q4.a = (q3.b + q4.b) / 2;
				return [q1, q2, q3, q4];
			},
			_calculateControlPoints = function(a, curviness, quad, basic, correlate) {
				var l = a.length - 1,
					ii = 0,
					cp1 = a[0].a,
					i, p1, p2, p3, seg, m1, m2, mm, cp2, qb, r1, r2, tl;
				for (i = 0; i < l; i++) {
					seg = a[ii];
					p1 = seg.a;
					p2 = seg.d;
					p3 = a[ii+1].d;

					if (correlate) {
						r1 = _r1[i];
						r2 = _r2[i];
						tl = ((r2 + r1) * curviness * 0.25) / (basic ? 0.5 : _r3[i] || 0.5);
						m1 = p2 - (p2 - p1) * (basic ? curviness * 0.5 : (r1 !== 0 ? tl / r1 : 0));
						m2 = p2 + (p3 - p2) * (basic ? curviness * 0.5 : (r2 !== 0 ? tl / r2 : 0));
						mm = p2 - (m1 + (((m2 - m1) * ((r1 * 3 / (r1 + r2)) + 0.5) / 4) || 0));
					} else {
						m1 = p2 - (p2 - p1) * curviness * 0.5;
						m2 = p2 + (p3 - p2) * curviness * 0.5;
						mm = p2 - (m1 + m2) / 2;
					}
					m1 += mm;
					m2 += mm;

					seg.c = cp2 = m1;
					if (i !== 0) {
						seg.b = cp1;
					} else {
						seg.b = cp1 = seg.a + (seg.c - seg.a) * 0.6; //instead of placing b on a exactly, we move it inline with c so that if the user specifies an ease like Back.easeIn or Elastic.easeIn which goes BEYOND the beginning, it will do so smoothly.
					}

					seg.da = p2 - p1;
					seg.ca = cp2 - p1;
					seg.ba = cp1 - p1;

					if (quad) {
						qb = cubicToQuadratic(p1, cp1, cp2, p2);
						a.splice(ii, 1, qb[0], qb[1], qb[2], qb[3]);
						ii += 4;
					} else {
						ii++;
					}

					cp1 = m2;
				}
				seg = a[ii];
				seg.b = cp1;
				seg.c = cp1 + (seg.d - cp1) * 0.4; //instead of placing c on d exactly, we move it inline with b so that if the user specifies an ease like Back.easeOut or Elastic.easeOut which goes BEYOND the end, it will do so smoothly.
				seg.da = seg.d - seg.a;
				seg.ca = seg.c - seg.a;
				seg.ba = cp1 - seg.a;
				if (quad) {
					qb = cubicToQuadratic(seg.a, cp1, seg.c, seg.d);
					a.splice(ii, 1, qb[0], qb[1], qb[2], qb[3]);
				}
			},
			_parseAnchors = function(values, p, correlate, prepend) {
				var a = [],
					l, i, p1, p2, p3, tmp;
				if (prepend) {
					values = [prepend].concat(values);
					i = values.length;
					while (--i > -1) {
						if (typeof( (tmp = values[i][p]) ) === "string") if (tmp.charAt(1) === "=") {
							values[i][p] = prepend[p] + Number(tmp.charAt(0) + tmp.substr(2)); //accommodate relative values. Do it inline instead of breaking it out into a function for speed reasons
						}
					}
				}
				l = values.length - 2;
				if (l < 0) {
					a[0] = new Segment(values[0][p], 0, 0, values[(l < -1) ? 0 : 1][p]);
					return a;
				}
				for (i = 0; i < l; i++) {
					p1 = values[i][p];
					p2 = values[i+1][p];
					a[i] = new Segment(p1, 0, 0, p2);
					if (correlate) {
						p3 = values[i+2][p];
						_r1[i] = (_r1[i] || 0) + (p2 - p1) * (p2 - p1);
						_r2[i] = (_r2[i] || 0) + (p3 - p2) * (p3 - p2);
					}
				}
				a[i] = new Segment(values[i][p], 0, 0, values[i+1][p]);
				return a;
			},
			bezierThrough = function(values, curviness, quadratic, basic, correlate, prepend) {
				var obj = {},
					props = [],
					first = prepend || values[0],
					i, p, a, j, r, l, seamless, last;
				correlate = (typeof(correlate) === "string") ? ","+correlate+"," : _correlate;
				if (curviness == null) {
					curviness = 1;
				}
				for (p in values[0]) {
					props.push(p);
				}
				//check to see if the last and first values are identical (well, within 0.05). If so, make seamless by appending the second element to the very end of the values array and the 2nd-to-last element to the very beginning (we'll remove those segments later)
				if (values.length > 1) {
					last = values[values.length - 1];
					seamless = true;
					i = props.length;
					while (--i > -1) {
						p = props[i];
						if (Math.abs(first[p] - last[p]) > 0.05) { //build in a tolerance of +/-0.05 to accommodate rounding errors. For example, if you set an object's position to 4.945, Flash will make it 4.9
							seamless = false;
							break;
						}
					}
					if (seamless) {
						values = values.concat(); //duplicate the array to avoid contaminating the original which the user may be reusing for other tweens
						if (prepend) {
							values.unshift(prepend);
						}
						values.push(values[1]);
						prepend = values[values.length - 3];
					}
				}
				_r1.length = _r2.length = _r3.length = 0;
				i = props.length;
				while (--i > -1) {
					p = props[i];
					_corProps[p] = (correlate.indexOf(","+p+",") !== -1);
					obj[p] = _parseAnchors(values, p, _corProps[p], prepend);
				}
				i = _r1.length;
				while (--i > -1) {
					_r1[i] = Math.sqrt(_r1[i]);
					_r2[i] = Math.sqrt(_r2[i]);
				}
				if (!basic) {
					i = props.length;
					while (--i > -1) {
						if (_corProps[p]) {
							a = obj[props[i]];
							l = a.length - 1;
							for (j = 0; j < l; j++) {
								r = a[j+1].da / _r2[j] + a[j].da / _r1[j];
								_r3[j] = (_r3[j] || 0) + r * r;
							}
						}
					}
					i = _r3.length;
					while (--i > -1) {
						_r3[i] = Math.sqrt(_r3[i]);
					}
				}
				i = props.length;
				j = quadratic ? 4 : 1;
				while (--i > -1) {
					p = props[i];
					a = obj[p];
					_calculateControlPoints(a, curviness, quadratic, basic, _corProps[p]); //this method requires that _parseAnchors() and _setSegmentRatios() ran first so that _r1, _r2, and _r3 values are populated for all properties
					if (seamless) {
						a.splice(0, j);
						a.splice(a.length - j, j);
					}
				}
				return obj;
			},
			_parseBezierData = function(values, type, prepend) {
				type = type || "soft";
				var obj = {},
					inc = (type === "cubic") ? 3 : 2,
					soft = (type === "soft"),
					props = [],
					a, b, c, d, cur, i, j, l, p, cnt, tmp;
				if (soft && prepend) {
					values = [prepend].concat(values);
				}
				if (values == null || values.length < inc + 1) { throw "invalid Bezier data"; }
				for (p in values[0]) {
					props.push(p);
				}
				i = props.length;
				while (--i > -1) {
					p = props[i];
					obj[p] = cur = [];
					cnt = 0;
					l = values.length;
					for (j = 0; j < l; j++) {
						a = (prepend == null) ? values[j][p] : (typeof( (tmp = values[j][p]) ) === "string" && tmp.charAt(1) === "=") ? prepend[p] + Number(tmp.charAt(0) + tmp.substr(2)) : Number(tmp);
						if (soft) if (j > 1) if (j < l - 1) {
							cur[cnt++] = (a + cur[cnt-2]) / 2;
						}
						cur[cnt++] = a;
					}
					l = cnt - inc + 1;
					cnt = 0;
					for (j = 0; j < l; j += inc) {
						a = cur[j];
						b = cur[j+1];
						c = cur[j+2];
						d = (inc === 2) ? 0 : cur[j+3];
						cur[cnt++] = tmp = (inc === 3) ? new Segment(a, b, c, d) : new Segment(a, (2 * b + a) / 3, (2 * b + c) / 3, c);
					}
					cur.length = cnt;
				}
				return obj;
			},
			_addCubicLengths = function(a, steps, resolution) {
				var inc = 1 / resolution,
					j = a.length,
					d, d1, s, da, ca, ba, p, i, inv, bez, index;
				while (--j > -1) {
					bez = a[j];
					s = bez.a;
					da = bez.d - s;
					ca = bez.c - s;
					ba = bez.b - s;
					d = d1 = 0;
					for (i = 1; i <= resolution; i++) {
						p = inc * i;
						inv = 1 - p;
						d = d1 - (d1 = (p * p * da + 3 * inv * (p * ca + inv * ba)) * p);
						index = j * resolution + i - 1;
						steps[index] = (steps[index] || 0) + d * d;
					}
				}
			},
			_parseLengthData = function(obj, resolution) {
				resolution = resolution >> 0 || 6;
				var a = [],
					lengths = [],
					d = 0,
					total = 0,
					threshold = resolution - 1,
					segments = [],
					curLS = [], //current length segments array
					p, i, l, index;
				for (p in obj) {
					_addCubicLengths(obj[p], a, resolution);
				}
				l = a.length;
				for (i = 0; i < l; i++) {
					d += Math.sqrt(a[i]);
					index = i % resolution;
					curLS[index] = d;
					if (index === threshold) {
						total += d;
						index = (i / resolution) >> 0;
						segments[index] = curLS;
						lengths[index] = total;
						d = 0;
						curLS = [];
					}
				}
				return {length:total, lengths:lengths, segments:segments};
			},



			BezierPlugin = window._gsDefine.plugin({
					propName: "bezier",
					priority: -1,
					API: 2,
					global:true,

					//gets called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
					init: function(target, vars, tween) {
						this._target = target;
						if (vars instanceof Array) {
							vars = {values:vars};
						}
						this._func = {};
						this._round = {};
						this._props = [];
						this._timeRes = (vars.timeResolution == null) ? 6 : parseInt(vars.timeResolution, 10);
						var values = vars.values || [],
							first = {},
							second = values[0],
							autoRotate = vars.autoRotate || tween.vars.orientToBezier,
							p, isFunc, i, j, prepend;

						this._autoRotate = autoRotate ? (autoRotate instanceof Array) ? autoRotate : [["x","y","rotation",((autoRotate === true) ? 0 : Number(autoRotate) || 0)]] : null;
						for (p in second) {
							this._props.push(p);
						}

						i = this._props.length;
						while (--i > -1) {
							p = this._props[i];

							this._overwriteProps.push(p);
							isFunc = this._func[p] = (typeof(target[p]) === "function");
							first[p] = (!isFunc) ? parseFloat(target[p]) : target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ]();
							if (!prepend) if (first[p] !== values[0][p]) {
								prepend = first;
							}
						}
						this._beziers = (vars.type !== "cubic" && vars.type !== "quadratic" && vars.type !== "soft") ? bezierThrough(values, isNaN(vars.curviness) ? 1 : vars.curviness, false, (vars.type === "thruBasic"), vars.correlate, prepend) : _parseBezierData(values, vars.type, first);
						this._segCount = this._beziers[p].length;

						if (this._timeRes) {
							var ld = _parseLengthData(this._beziers, this._timeRes);
							this._length = ld.length;
							this._lengths = ld.lengths;
							this._segments = ld.segments;
							this._l1 = this._li = this._s1 = this._si = 0;
							this._l2 = this._lengths[0];
							this._curSeg = this._segments[0];
							this._s2 = this._curSeg[0];
							this._prec = 1 / this._curSeg.length;
						}

						if ((autoRotate = this._autoRotate)) {
							if (!(autoRotate[0] instanceof Array)) {
								this._autoRotate = autoRotate = [autoRotate];
							}
							i = autoRotate.length;
							while (--i > -1) {
								for (j = 0; j < 3; j++) {
									p = autoRotate[i][j];
									this._func[p] = (typeof(target[p]) === "function") ? target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ] : false;
								}
							}
						}
						return true;
					},

					//called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
					set: function(v) {
						var segments = this._segCount,
							func = this._func,
							target = this._target,
							curIndex, inv, i, p, b, t, val, l, lengths, curSeg;
						if (!this._timeRes) {
							curIndex = (v < 0) ? 0 : (v >= 1) ? segments - 1 : (segments * v) >> 0;
							t = (v - (curIndex * (1 / segments))) * segments;
						} else {
							lengths = this._lengths;
							curSeg = this._curSeg;
							v *= this._length;
							i = this._li;
							//find the appropriate segment (if the currently cached one isn't correct)
							if (v > this._l2 && i < segments - 1) {
								l = segments - 1;
								while (i < l && (this._l2 = lengths[++i]) <= v) {	}
								this._l1 = lengths[i-1];
								this._li = i;
								this._curSeg = curSeg = this._segments[i];
								this._s2 = curSeg[(this._s1 = this._si = 0)];
							} else if (v < this._l1 && i > 0) {
								while (i > 0 && (this._l1 = lengths[--i]) >= v) { }
								if (i === 0 && v < this._l1) {
									this._l1 = 0;
								} else {
									i++;
								}
								this._l2 = lengths[i];
								this._li = i;
								this._curSeg = curSeg = this._segments[i];
								this._s1 = curSeg[(this._si = curSeg.length - 1) - 1] || 0;
								this._s2 = curSeg[this._si];
							}
							curIndex = i;
							//now find the appropriate sub-segment (we split it into the number of pieces that was defined by "precision" and measured each one)
							v -= this._l1;
							i = this._si;
							if (v > this._s2 && i < curSeg.length - 1) {
								l = curSeg.length - 1;
								while (i < l && (this._s2 = curSeg[++i]) <= v) {	}
								this._s1 = curSeg[i-1];
								this._si = i;
							} else if (v < this._s1 && i > 0) {
								while (i > 0 && (this._s1 = curSeg[--i]) >= v) {	}
								if (i === 0 && v < this._s1) {
									this._s1 = 0;
								} else {
									i++;
								}
								this._s2 = curSeg[i];
								this._si = i;
							}
							t = (i + (v - this._s1) / (this._s2 - this._s1)) * this._prec;
						}
						inv = 1 - t;

						i = this._props.length;
						while (--i > -1) {
							p = this._props[i];
							b = this._beziers[p][curIndex];
							val = (t * t * b.da + 3 * inv * (t * b.ca + inv * b.ba)) * t + b.a;
							if (this._round[p]) {
								val = (val + ((val > 0) ? 0.5 : -0.5)) >> 0;
							}
							if (func[p]) {
								target[p](val);
							} else {
								if (p == "x")
								{
									target.setX(val);
								}
								else if (p == "y")
								{
									target.setY(val);
								}
								else if (p == "z")
								{
									target.setZ(val);
								}
								else if (p == "angleX")
								{
									target.setAngleX(val);
								}
								else if (p == "angleY")
								{
									target.setAngleY(val);
								}
								else if (p == "angleZ")
								{
									target.setAngleZ(val);
								}
								else if (p == "w")
								{
									target.setWidth(val);
								}
								else if (p == "h")
								{
									target.setHeight(val);
								}
								else if (p == "alpha")
								{
									target.setAlpha(val);
								}
								else if (p == "scale")
								{
									target.setScale2(val);
								}
								else
								{
									target[p] = val;
								}
							}
						}

						if (this._autoRotate) {
							var ar = this._autoRotate,
								b2, x1, y1, x2, y2, add, conv;
							i = ar.length;
							while (--i > -1) {
								p = ar[i][2];
								add = ar[i][3] || 0;
								conv = (ar[i][4] === true) ? 1 : _RAD2DEG;
								b = this._beziers[ar[i][0]];
								b2 = this._beziers[ar[i][1]];

								if (b && b2) { //in case one of the properties got overwritten.
									b = b[curIndex];
									b2 = b2[curIndex];

									x1 = b.a + (b.b - b.a) * t;
									x2 = b.b + (b.c - b.b) * t;
									x1 += (x2 - x1) * t;
									x2 += ((b.c + (b.d - b.c) * t) - x2) * t;

									y1 = b2.a + (b2.b - b2.a) * t;
									y2 = b2.b + (b2.c - b2.b) * t;
									y1 += (y2 - y1) * t;
									y2 += ((b2.c + (b2.d - b2.c) * t) - y2) * t;

									val = Math.atan2(y2 - y1, x2 - x1) * conv + add;

									if (func[p]) {
										target[p](val);
									} else {
										target[p] = val;
									}
								}
							}
						}
					}
			}),
			p = BezierPlugin.prototype;


		BezierPlugin.bezierThrough = bezierThrough;
		BezierPlugin.cubicToQuadratic = cubicToQuadratic;
		BezierPlugin._autoCSS = true; //indicates that this plugin can be inserted into the "css" object using the autoCSS feature of TweenLite
		BezierPlugin.quadraticToCubic = function(a, b, c) {
			return new Segment(a, (2 * b + a) / 3, (2 * b + c) / 3, c);
		};

		BezierPlugin._cssRegister = function() {
			var CSSPlugin = window._gsDefine.globals.CSSPlugin;
			if (!CSSPlugin) {
				return;
			}
			var _internals = CSSPlugin._internals,
				_parseToProxy = _internals._parseToProxy,
				_setPluginRatio = _internals._setPluginRatio,
				CSSPropTween = _internals.CSSPropTween;
			_internals._registerComplexSpecialProp("bezier", {parser:function(t, e, prop, cssp, pt, plugin) {
				if (e instanceof Array) {
					e = {values:e};
				}
				plugin = new BezierPlugin();
				var values = e.values,
					l = values.length - 1,
					pluginValues = [],
					v = {},
					i, p, data;
				if (l < 0) {
					return pt;
				}
				for (i = 0; i <= l; i++) {
					data = _parseToProxy(t, values[i], cssp, pt, plugin, (l !== i));
					pluginValues[i] = data.end;
				}
				for (p in e) {
					v[p] = e[p]; //duplicate the vars object because we need to alter some things which would cause problems if the user plans to reuse the same vars object for another tween.
				}
				v.values = pluginValues;
				pt = new CSSPropTween(t, "bezier", 0, 0, data.pt, 2);
				pt.data = data;
				pt.plugin = plugin;
				pt.setRatio = _setPluginRatio;
				if (v.autoRotate === 0) {
					v.autoRotate = true;
				}
				if (v.autoRotate && !(v.autoRotate instanceof Array)) {
					i = (v.autoRotate === true) ? 0 : Number(v.autoRotate) * _DEG2RAD;
					v.autoRotate = (data.end.left != null) ? [["left","top","rotation",i,true]] : (data.end.x != null) ? [["x","y","rotation",i,true]] : false;
				}
				if (v.autoRotate) {
					if (!cssp._transform) {
						cssp._enableTransforms(false);
					}
					data.autoRotate = cssp._target._gsTransform;
				}
				plugin._onInitTween(data.proxy, v, cssp._tween);
				return pt;
			}});
		};

		p._roundProps = function(lookup, value) {
			var op = this._overwriteProps,
				i = op.length;
			while (--i > -1) {
				if (lookup[op[i]] || lookup.bezier || lookup.bezierThrough) {
					this._round[op[i]] = value;
				}
			}
		};

		p._kill = function(lookup) {
			var a = this._props,
				p, i;
			for (p in this._beziers) {
				if (p in lookup) {
					delete this._beziers[p];
					delete this._func[p];
					i = a.length;
					while (--i > -1) {
						if (a[i] === p) {
							a.splice(i, 1);
						}
					}
				}
			}
			return this._super._kill.call(this, lookup);
		};

	}());






	
	
	
	
	
	
	
	
/*
 * ----------------------------------------------------------------
 * CSSPlugin
 * ----------------------------------------------------------------
 */
	window._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin","TweenLite"], function(TweenPlugin, TweenLite) {

		/** @constructor **/
		var CSSPlugin = function() {
				TweenPlugin.call(this, "css");
				this._overwriteProps.length = 0;
			},
			_hasPriority, //turns true whenever a CSSPropTween instance is created that has a priority other than 0. This helps us discern whether or not we should spend the time organizing the linked list or not after a CSSPlugin's _onInitTween() method is called.
			_suffixMap, //we set this in _onInitTween() each time as a way to have a persistent variable we can use in other methods like _parse() without having to pass it around as a parameter and we keep _parse() decoupled from a particular CSSPlugin instance
			_cs, //computed style (we store this in a shared variable to conserve memory and make minification tighter
			_overwriteProps, //alias to the currently instantiating CSSPlugin's _overwriteProps array. We use this closure in order to avoid having to pass a reference around from method to method and aid in minification.
			_specialProps = {},
			p = CSSPlugin.prototype = new TweenPlugin("css");

		p.constructor = CSSPlugin;
		CSSPlugin.version = "1.9.7";
		CSSPlugin.API = 2;
		CSSPlugin.defaultTransformPerspective = 0;
		p = "px"; //we'll reuse the "p" variable to keep file size down
		CSSPlugin.suffixMap = {top:p, right:p, bottom:p, left:p, width:p, height:p, fontSize:p, padding:p, margin:p, perspective:p};


		var _numExp = /(?:\d|\-\d|\.\d|\-\.\d)+/g,
			_relNumExp = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
			_valuesExp = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi, //finds all the values that begin with numbers or += or -= and then a number. Includes suffixes. We use this to split complex values apart like "1px 5px 20px rgb(255,102,51)"
			//_clrNumExp = /(?:\b(?:(?:rgb|rgba|hsl|hsla)\(.+?\))|\B#.+?\b)/, //only finds rgb(), rgba(), hsl(), hsla() and # (hexadecimal) values but NOT color names like red, blue, etc.
			//_tinyNumExp = /\b\d+?e\-\d+?\b/g, //finds super small numbers in a string like 1e-20. could be used in matrix3d() to fish out invalid numbers and replace them with 0. After performing speed tests, however, we discovered it was slightly faster to just cut the numbers at 5 decimal places with a particular algorithm.
			_NaNExp = /[^\d\-\.]/g,
			_suffixExp = /(?:\d|\-|\+|=|#|\.)*/g,
			_opacityExp = /opacity *= *([^)]*)/,
			_opacityValExp = /opacity:([^;]*)/,
			_alphaFilterExp = /alpha\(opacity *=.+?\)/i,
			_rgbhslExp = /^(rgb|hsl)/,
			_capsExp = /([A-Z])/g,
			_camelExp = /-([a-z])/gi,
			_urlExp = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi, //for pulling out urls from url(...) or url("...") strings (some browsers wrap urls in quotes, some don't when reporting things like backgroundImage)
			_camelFunc = function(s, g) { return g.toUpperCase(); },
			_horizExp = /(?:Left|Right|Width)/i,
			_ieGetMatrixExp = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
			_ieSetMatrixExp = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
			_commasOutsideParenExp = /,(?=[^\)]*(?:\(|$))/gi, //finds any commas that are not within parenthesis
			_DEG2RAD = Math.PI / 180,
			_RAD2DEG = 180 / Math.PI,
			_forcePT = {},
			_doc = document,
			_tempDiv = _doc.createElement("div"),
			_tempImg = _doc.createElement("img"),
			_internals = CSSPlugin._internals = {_specialProps:_specialProps}, //provides a hook to a few internal methods that we need to access from inside other plugins
			_agent = navigator.userAgent,
			_autoRound,
			_reqSafariFix, //we won't apply the Safari transform fix until we actually come across a tween that affects a transform property (to maintain best performance).

			_isSafari,
			_isFirefox, //Firefox has a bug that causes 3D transformed elements to randomly disappear unless a repaint is forced after each update on each element.
			_isSafariLT6, //Safari (and Android 4 which uses a flavor of Safari) has a bug that prevents changes to "top" and "left" properties from rendering properly if changed on the same frame as a transform UNLESS we set the element's WebkitBackfaceVisibility to hidden (weird, I know). Doing this for Android 3 and earlier seems to actually cause other problems, though (fun!)
			_ieVers,
			_supportsOpacity = (function() { //we set _isSafari, _ieVers, _isFirefox, and _supportsOpacity all in one function here to reduce file size slightly, especially in the minified version.
				var i = _agent.indexOf("Android"),
					d = _doc.createElement("div"), a;

				_isSafari = (_agent.indexOf("Safari") !== -1 && _agent.indexOf("Chrome") === -1 && (i === -1 || Number(_agent.substr(i+8, 1)) > 3));
				_isSafariLT6 = (_isSafari && (Number(_agent.substr(_agent.indexOf("Version/")+8, 1)) < 6));
				_isFirefox = (_agent.indexOf("Firefox") !== -1);

				(/MSIE ([0-9]{1,}[\.0-9]{0,})/).exec(_agent);
				_ieVers = parseFloat( RegExp.$1 );

				d.innerHTML = "<a style='top:1px;opacity:.55;'>a</a>";
				a = d.getElementsByTagName("a")[0];
				return a ? /^0.55/.test(a.style.opacity) : false;
			}()),
			_getIEOpacity = function(v) {
				return (_opacityExp.test( ((typeof(v) === "string") ? v : (v.currentStyle ? v.currentStyle.filter : v.style.filter) || "") ) ? ( parseFloat( RegExp.$1 ) / 100 ) : 1);
			},
			_log = function(s) {//for logging messages, but in a way that won't throw errors in old versions of IE.
				if (window.console) {
					console.log(s);
				}
			},
			_prefixCSS = "", //the non-camelCase vendor prefix like "-o-", "-moz-", "-ms-", or "-webkit-"
			_prefix = "", //camelCase vendor prefix like "O", "ms", "Webkit", or "Moz".

			//@private feed in a camelCase property name like "transform" and it will check to see if it is valid as-is or if it needs a vendor prefix. It returns the corrected camelCase property name (i.e. "WebkitTransform" or "MozTransform" or "transform" or null if no such property is found, like if the browser is IE8 or before, "transform" won't be found at all)
			_checkPropPrefix = function(p, e) {
				e = e || _tempDiv;
				var s = e.style,
					a, i;
				if (s[p] !== undefined) {
					return p;
				}
				p = p.charAt(0).toUpperCase() + p.substr(1);
				a = ["O","Moz","ms","Ms","Webkit"];
				i = 5;
				while (--i > -1 && s[a[i]+p] === undefined) { }
				if (i >= 0) {
					_prefix = (i === 3) ? "ms" : a[i];
					_prefixCSS = "-" + _prefix.toLowerCase() + "-";
					return _prefix + p;
				}
				return null;
			},

			_getComputedStyle = _doc.defaultView ? _doc.defaultView.getComputedStyle : function() {},

			/**
			 * @private Returns the css style for a particular property of an element. For example, to get whatever the current "left" css value for an element with an ID of "myElement", you could do:
			 * var currentLeft = CSSPlugin.getStyle( document.getElementById("myElement"), "left");
			 *
			 * @param {!Object} t Target element whose style property you want to query
			 * @param {!string} p Property name (like "left" or "top" or "marginTop", etc.)
			 * @param {Object=} cs Computed style object. This just provides a way to speed processing if you're going to get several properties on the same element in quick succession - you can reuse the result of the getComputedStyle() call.
			 * @param {boolean=} calc If true, the value will not be read directly from the element's "style" property (if it exists there), but instead the getComputedStyle() result will be used. This can be useful when you want to ensure that the browser itself is interpreting the value.
			 * @param {string=} dflt Default value that should be returned in the place of null, "none", "auto" or "auto auto".
			 * @return {?string} The current property value
			 */
			_getStyle = CSSPlugin.getStyle = function(t, p, cs, calc, dflt) {
				var rv;
				if (!_supportsOpacity) if (p === "opacity") { //several versions of IE don't use the standard "opacity" property - they use things like filter:alpha(opacity=50), so we parse that here.
					return _getIEOpacity(t);
				}
				if (!calc && t.style[p]) {
					rv = t.style[p];
				} else if ((cs = cs || _getComputedStyle(t, null))) {
					t = cs.getPropertyValue(p.replace(_capsExp, "-$1").toLowerCase());
					rv = (t || cs.length) ? t : cs[p]; //Opera behaves VERY strangely - length is usually 0 and cs[p] is the only way to get accurate results EXCEPT when checking for -o-transform which only works with cs.getPropertyValue()!
				} else if (t.currentStyle) {
					cs = t.currentStyle;
					rv = cs[p];
				}
				return (dflt != null && (!rv || rv === "none" || rv === "auto" || rv === "auto auto")) ? dflt : rv;
			},

			/**
			 * @private Pass the target element, the property name, the numeric value, and the suffix (like "%", "em", "px", etc.) and it will spit back the equivalent pixel number.
			 * @param {!Object} t Target element
			 * @param {!string} p Property name (like "left", "top", "marginLeft", etc.)
			 * @param {!number} v Value
			 * @param {string=} sfx Suffix (like "px" or "%" or "em")
			 * @param {boolean=} recurse If true, the call is a recursive one. In some browsers (like IE7/8), occasionally the value isn't accurately reported initially, but if we run the function again it will take effect.
			 * @return {number} value in pixels
			 */
			_convertToPixels = function(t, p, v, sfx, recurse) {
				if (sfx === "px" || !sfx) { return v; }
				if (sfx === "auto" || !v) { return 0; }
				var horiz = _horizExp.test(p),
					node = t,
					style = _tempDiv.style,
					neg = (v < 0),
					pix;
				if (neg) {
					v = -v;
				}
				if (sfx === "%" && p.indexOf("border") !== -1) {
					pix = (v / 100) * (horiz ? t.clientWidth : t.clientHeight);
				} else {
					style.cssText = "border-style:solid; border-width:0; position:absolute; line-height:0;";
					if (sfx === "%" || !node.appendChild) {
						node = t.parentNode || _doc.body;
						style[(horiz ? "width" : "height")] = v + sfx;
					} else {
						style[(horiz ? "borderLeftWidth" : "borderTopWidth")] = v + sfx;
					}
					node.appendChild(_tempDiv);
					pix = parseFloat(_tempDiv[(horiz ? "offsetWidth" : "offsetHeight")]);
					node.removeChild(_tempDiv);
					if (pix === 0 && !recurse) {
						pix = _convertToPixels(t, p, v, sfx, true);
					}
				}
				return neg ? -pix : pix;
			},
			_calculateOffset = function(t, p, cs) { //for figuring out "top" or "left" in px when it's "auto". We need to factor in margin with the offsetLeft/offsetTop
				if (_getStyle(t, "position", cs) !== "absolute") { return 0; }
				var dim = ((p === "left") ? "Left" : "Top"),
					v = _getStyle(t, "margin" + dim, cs);
				return t["offset" + dim] - (_convertToPixels(t, p, parseFloat(v), v.replace(_suffixExp, "")) || 0);
			},

			//@private returns at object containing ALL of the style properties in camelCase and their associated values.
			_getAllStyles = function(t, cs) {
				var s = {},
					i, tr;
				if ((cs = cs || _getComputedStyle(t, null))) {
					if ((i = cs.length)) {
						while (--i > -1) {
							s[cs[i].replace(_camelExp, _camelFunc)] = cs.getPropertyValue(cs[i]);
						}
					} else { //Opera behaves differently - cs.length is always 0, so we must do a for...in loop.
						for (i in cs) {
							s[i] = cs[i];
						}
					}
				} else if ((cs = t.currentStyle || t.style)) {
					for (i in cs) {
						s[i.replace(_camelExp, _camelFunc)] = cs[i];
					}
				}
				if (!_supportsOpacity) {
					s.opacity = _getIEOpacity(t);
				}
				tr = _getTransform(t, cs, false);
				s.rotation = tr.rotation * _RAD2DEG;
				s.skewX = tr.skewX * _RAD2DEG;
				s.scaleX = tr.scaleX;
				s.scaleY = tr.scaleY;
				s.x = tr.x;
				s.y = tr.y;
				if (_supports3D) {
					s.z = tr.z;
					s.rotationX = tr.rotationX * _RAD2DEG;
					s.rotationY = tr.rotationY * _RAD2DEG;
					s.scaleZ = tr.scaleZ;
				}
				if (s.filters) {
					delete s.filters;
				}
				return s;
			},

			//@private analyzes two style objects (as returned by _getAllStyles()) and only looks for differences between them that contain tweenable values (like a number or color). It returns an object with a "difs" property which refers to an object containing only those isolated properties and values for tweening, and a "firstMPT" property which refers to the first MiniPropTween instance in a linked list that recorded all the starting values of the different properties so that we can revert to them at the end or beginning of the tween - we don't want the cascading to get messed up. The forceLookup parameter is an optional generic object with properties that should be forced into the results - this is necessary for className tweens that are overwriting others because imagine a scenario where a rollover/rollout adds/removes a class and the user swipes the mouse over the target SUPER fast, thus nothing actually changed yet and the subsequent comparison of the properties would indicate they match (especially when px rounding is taken into consideration), thus no tweening is necessary even though it SHOULD tween and remove those properties after the tween (otherwise the inline styles will contaminate things). See the className SpecialProp code for details.
			_cssDif = function(t, s1, s2, vars, forceLookup) {
				var difs = {},
					style = t.style,
					val, p, mpt;
				for (p in s2) {
					if (p !== "cssText") if (p !== "length") if (isNaN(p)) if (s1[p] !== (val = s2[p]) || (forceLookup && forceLookup[p])) if (p.indexOf("Origin") === -1) if (typeof(val) === "number" || typeof(val) === "string") {
						difs[p] = (val === "auto" && (p === "left" || p === "top")) ? _calculateOffset(t, p) : ((val === "" || val === "auto" || val === "none") && typeof(s1[p]) === "string" && s1[p].replace(_NaNExp, "") !== "") ? 0 : val; //if the ending value is defaulting ("" or "auto"), we check the starting value and if it can be parsed into a number (a string which could have a suffix too, like 700px), then we swap in 0 for "" or "auto" so that things actually tween.
						if (style[p] !== undefined) { //for className tweens, we must remember which properties already existed inline - the ones that didn't should be removed when the tween isn't in progress because they were only introduced to facilitate the transition between classes.
							mpt = new MiniPropTween(style, p, style[p], mpt);
						}
					}
				}
				if (vars) {
					for (p in vars) { //copy properties (except className)
						if (p !== "className") {
							difs[p] = vars[p];
						}
					}
				}
				return {difs:difs, firstMPT:mpt};
			},
			_dimensions = {width:["Left","Right"], height:["Top","Bottom"]},
			_margins = ["marginLeft","marginRight","marginTop","marginBottom"],

			/**
			 * @private Gets the width or height of an element
			 * @param {!Object} t Target element
			 * @param {!string} p Property name ("width" or "height")
			 * @param {Object=} cs Computed style object (if one exists). Just a speed optimization.
			 * @return {number} Dimension (in pixels)
			 */
			_getDimension = function(t, p, cs) {
				var v = parseFloat((p === "width") ? t.offsetWidth : t.offsetHeight),
					a = _dimensions[p],
					i = a.length;
				cs = cs || _getComputedStyle(t, null);
				while (--i > -1) {
					v -= parseFloat( _getStyle(t, "padding" + a[i], cs, true) ) || 0;
					v -= parseFloat( _getStyle(t, "border" + a[i] + "Width", cs, true) ) || 0;
				}
				return v;
			},

			//@private Parses position-related complex strings like "top left" or "50px 10px" or "70% 20%", etc. which are used for things like transformOrigin or backgroundPosition. Optionally decorates a supplied object (recObj) with the following properties: "ox" (offsetX), "oy" (offsetY), "oxp" (if true, "ox" is a percentage not a pixel value), and "oxy" (if true, "oy" is a percentage not a pixel value)
			_parsePosition = function(v, recObj) {
				if (v == null || v === "" || v === "auto" || v === "auto auto") { //note: Firefox uses "auto auto" as default whereas Chrome uses "auto".
					v = "0 0";
				}
				var a = v.split(" "),
					x = (v.indexOf("left") !== -1) ? "0%" : (v.indexOf("right") !== -1) ? "100%" : a[0],
					y = (v.indexOf("top") !== -1) ? "0%" : (v.indexOf("bottom") !== -1) ? "100%" : a[1];
				if (y == null) {
					y = "0";
				} else if (y === "center") {
					y = "50%";
				}
				if (x === "center" || isNaN(parseFloat(x))) { //remember, the user could flip-flop the values and say "bottom center" or "center bottom", etc. "center" is ambiguous because it could be used to describe horizontal or vertical, hence the isNaN().
					x = "50%";
				}
				if (recObj) {
					recObj.oxp = (x.indexOf("%") !== -1);
					recObj.oyp = (y.indexOf("%") !== -1);
					recObj.oxr = (x.charAt(1) === "=");
					recObj.oyr = (y.charAt(1) === "=");
					recObj.ox = parseFloat(x.replace(_NaNExp, ""));
					recObj.oy = parseFloat(y.replace(_NaNExp, ""));
				}
				return x + " " + y + ((a.length > 2) ? " " + a[2] : "");
			},

			/**
			 * @private Takes an ending value (typically a string, but can be a number) and a starting value and returns the change between the two, looking for relative value indicators like += and -= and it also ignores suffixes (but make sure the ending value starts with a number or +=/-= and that the starting value is a NUMBER!)
			 * @param {(number|string)} e End value which is typically a string, but could be a number
			 * @param {(number|string)} b Beginning value which is typically a string but could be a number
			 * @return {number} Amount of change between the beginning and ending values (relative values that have a "+=" or "-=" are recognized)
			 */
			_parseChange = function(e, b) {
				return (typeof(e) === "string" && e.charAt(1) === "=") ? parseInt(e.charAt(0) + "1", 10) * parseFloat(e.substr(2)) : parseFloat(e) - parseFloat(b);
			},

			/**
			 * @private Takes a value and a default number, checks if the value is relative, null, or numeric and spits back a normalized number accordingly. Primarily used in the _parseTransform() function.
			 * @param {Object} v Value to be parsed
			 * @param {!number} d Default value (which is also used for relative calculations if "+=" or "-=" is found in the first parameter)
			 * @return {number} Parsed value
			 */
			_parseVal = function(v, d) {
				return (v == null) ? d : (typeof(v) === "string" && v.charAt(1) === "=") ? parseInt(v.charAt(0) + "1", 10) * Number(v.substr(2)) + d : parseFloat(v);
			},

			/**
			 * @private Translates strings like "40deg" or "40" or 40rad" or "+=40deg" or "270_short" or "-90_cw" or "+=45_ccw" to a numeric radian angle. Of course a starting/default value must be fed in too so that relative values can be calculated properly.
			 * @param {Object} v Value to be parsed
			 * @param {!number} d Default value (which is also used for relative calculations if "+=" or "-=" is found in the first parameter)
			 * @param {string=} p property name for directionalEnd (optional - only used when the parsed value is directional ("_short", "_cw", or "_ccw" suffix). We need a way to store the uncompensated value so that at the end of the tween, we set it to exactly what was requested with no directional compensation). Property name would be "rotation", "rotationX", or "rotationY"
			 * @param {Object=} directionalEnd An object that will store the raw end values for directional angles ("_short", "_cw", or "_ccw" suffix). We need a way to store the uncompensated value so that at the end of the tween, we set it to exactly what was requested with no directional compensation.
			 * @return {number} parsed angle in radians
			 */
			_parseAngle = function(v, d, p, directionalEnd) {
				var min = 0.000001,
					cap, split, dif, result;
				if (v == null) {
					result = d;
				} else if (typeof(v) === "number") {
					result = v * _DEG2RAD;
				} else {
					cap = Math.PI * 2;
					split = v.split("_");
					dif = Number(split[0].replace(_NaNExp, "")) * ((v.indexOf("rad") === -1) ? _DEG2RAD : 1) - ((v.charAt(1) === "=") ? 0 : d);
					if (split.length) {
						if (directionalEnd) {
							directionalEnd[p] = d + dif;
						}
						if (v.indexOf("short") !== -1) {
							dif = dif % cap;
							if (dif !== dif % (cap / 2)) {
								dif = (dif < 0) ? dif + cap : dif - cap;
							}
						}
						if (v.indexOf("_cw") !== -1 && dif < 0) {
							dif = ((dif + cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
						} else if (v.indexOf("ccw") !== -1 && dif > 0) {
							dif = ((dif - cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
						}
					}
					result = d + dif;
				}
				if (result < min && result > -min) {
					result = 0;
				}
				return result;
			},

			_colorLookup = {aqua:[0,255,255],
				lime:[0,255,0],
				silver:[192,192,192],
				black:[0,0,0],
				maroon:[128,0,0],
				teal:[0,128,128],
				blue:[0,0,255],
				navy:[0,0,128],
				white:[255,255,255],
				fuchsia:[255,0,255],
				olive:[128,128,0],
				yellow:[255,255,0],
				orange:[255,165,0],
				gray:[128,128,128],
				purple:[128,0,128],
				green:[0,128,0],
				red:[255,0,0],
				pink:[255,192,203],
				cyan:[0,255,255],
				transparent:[255,255,255,0]},

			_hue = function(h, m1, m2) {
				h = (h < 0) ? h + 1 : (h > 1) ? h - 1 : h;
				return ((((h * 6 < 1) ? m1 + (m2 - m1) * h * 6 : (h < 0.5) ? m2 : (h * 3 < 2) ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * 255) + 0.5) | 0;
			},

			/**
			 * @private Parses a color (like #9F0, #FF9900, or rgb(255,51,153)) into an array with 3 elements for red, green, and blue. Also handles rgba() values (splits into array of 4 elements of course)
			 * @param {(string|number)} v The value the should be parsed which could be a string like #9F0 or rgb(255,102,51) or rgba(255,0,0,0.5) or it could be a number like 0xFF00CC or even a named color like red, blue, purple, etc.
			 * @return {Array.<number>} An array containing red, green, and blue (and optionally alpha) in that order.
			 */
			_parseColor = function(v) {
				var c1, c2, c3, h, s, l;
				if (!v || v === "") {
					return _colorLookup.black;
				}
				if (typeof(v) === "number") {
					return [v >> 16, (v >> 8) & 255, v & 255];
				}
				if (v.charAt(v.length - 1) === ",") { //sometimes a trailing commma is included and we should chop it off (typically from a comma-delimited list of values like a textShadow:"2px 2px 2px blue, 5px 5px 5px rgb(255,0,0)" - in this example "blue," has a trailing comma. We could strip it out inside parseComplex() but we'd need to do it to the beginning and ending values plus it wouldn't provide protection from other potential scenarios like if the user passes in a similar value.
					v = v.substr(0, v.length - 1);
				}
				if (_colorLookup[v]) {
					return _colorLookup[v];
				}
				if (v.charAt(0) === "#") {
					if (v.length === 4) { //for shorthand like #9F0
						c1 = v.charAt(1),
						c2 = v.charAt(2),
						c3 = v.charAt(3);
						v = "#" + c1 + c1 + c2 + c2 + c3 + c3;
					}
					v = parseInt(v.substr(1), 16);
					return [v >> 16, (v >> 8) & 255, v & 255];
				}
				if (v.substr(0, 3) === "hsl") {
					v = v.match(_numExp);
					h = (Number(v[0]) % 360) / 360;
					s = Number(v[1]) / 100;
					l = Number(v[2]) / 100;
					c2 = (l <= 0.5) ? l * (s + 1) : l + s - l * s;
					c1 = l * 2 - c2;
					if (v.length > 3) {
						v[3] = Number(v[3]);
					}
					v[0] = _hue(h + 1 / 3, c1, c2);
					v[1] = _hue(h, c1, c2);
					v[2] = _hue(h - 1 / 3, c1, c2);
					return v;
				}
				v = v.match(_numExp) || _colorLookup.transparent;
				v[0] = Number(v[0]);
				v[1] = Number(v[1]);
				v[2] = Number(v[2]);
				if (v.length > 3) {
					v[3] = Number(v[3]);
				}
				return v;
			},
			_colorExp = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#.+?\\b"; //we'll dynamically build this Regular Expression to conserve file size. After building it, it will be able to find rgb(), rgba(), # (hexadecimal), and named color values like red, blue, purple, etc.

		for (p in _colorLookup) {
			_colorExp += "|" + p + "\\b";
		}
		_colorExp = new RegExp(_colorExp+")", "gi");

		/**
		 * @private Returns a formatter function that handles taking a string (or number in some cases) and returning a consistently formatted one in terms of delimiters, quantity of values, etc. For example, we may get boxShadow values defined as "0px red" or "0px 0px 10px rgb(255,0,0)" or "0px 0px 20px 20px #F00" and we need to ensure that what we get back is described with 4 numbers and a color. This allows us to feed it into the _parseComplex() method and split the values up appropriately. The neat thing about this _getFormatter() function is that the dflt defines a pattern as well as a default, so for example, _getFormatter("0px 0px 0px 0px #777", true) not only sets the default as 0px for all distances and #777 for the color, but also sets the pattern such that 4 numbers and a color will always get returned.
		 * @param {!string} dflt The default value and pattern to follow. So "0px 0px 0px 0px #777" will ensure that 4 numbers and a color will always get returned.
		 * @param {boolean=} clr If true, the values should be searched for color-related data. For example, boxShadow values typically contain a color whereas borderRadius don't.
		 * @param {boolean=} collapsible If true, the value is a top/left/right/bottom style one that acts like margin or padding, where if only one value is received, it's used for all 4; if 2 are received, the first is duplicated for 3rd (bottom) and the 2nd is duplicated for the 4th spot (left), etc.
		 * @return {Function} formatter function
		 */
		var _getFormatter = function(dflt, clr, collapsible, multi) {
				if (dflt == null) {
					return function(v) {return v;};
				}
				var dColor = clr ? (dflt.match(_colorExp) || [""])[0] : "",
					dVals = dflt.split(dColor).join("").match(_valuesExp) || [],
					pfx = dflt.substr(0, dflt.indexOf(dVals[0])),
					sfx = (dflt.charAt(dflt.length - 1) === ")") ? ")" : "",
					delim = (dflt.indexOf(" ") !== -1) ? " " : ",",
					numVals = dVals.length,
					dSfx = (numVals > 0) ? dVals[0].replace(_numExp, "") : "",
					formatter;
				if (!numVals) {
					return function(v) {return v;};
				}
				if (clr) {
					formatter = function(v) {
						var color, vals, i, a;
						if (typeof(v) === "number") {
							v += dSfx;
						} else if (multi && _commasOutsideParenExp.test(v)) {
							a = v.replace(_commasOutsideParenExp, "|").split("|");
							for (i = 0; i < a.length; i++) {
								a[i] = formatter(a[i]);
							}
							return a.join(",");
						}
						color = (v.match(_colorExp) || [dColor])[0];
						vals = v.split(color).join("").match(_valuesExp) || [];
						i = vals.length;
						if (numVals > i--) {
							while (++i < numVals) {
								vals[i] = collapsible ? vals[(((i - 1) / 2) | 0)] : dVals[i];
							}
						}
						return pfx + vals.join(delim) + delim + color + sfx + (v.indexOf("inset") !== -1 ? " inset" : "");
					};
					return formatter;

				}
				formatter = function(v) {
					var vals, a, i;
					if (typeof(v) === "number") {
						v += dSfx;
					} else if (multi && _commasOutsideParenExp.test(v)) {
						a = v.replace(_commasOutsideParenExp, "|").split("|");
						for (i = 0; i < a.length; i++) {
							a[i] = formatter(a[i]);
						}
						return a.join(",");
					}
					vals = v.match(_valuesExp) || [];
					i = vals.length;
					if (numVals > i--) {
						while (++i < numVals) {
							vals[i] = collapsible ? vals[(((i - 1) / 2) | 0)] : dVals[i];
						}
					}
					return pfx + vals.join(delim) + sfx;
				};
				return formatter;
			},

			/**
			 * @private returns a formatter function that's used for edge-related values like marginTop, marginLeft, paddingBottom, paddingRight, etc. Just pass a comma-delimited list of property names related to the edges.
			 * @param {!string} props a comma-delimited list of property names in order from top to left, like "marginTop,marginRight,marginBottom,marginLeft"
			 * @return {Function} a formatter function
			 */
			_getEdgeParser = function(props) {
				props = props.split(",");
				return function(t, e, p, cssp, pt, plugin, vars) {
					var a = (e + "").split(" "),
						i;
					vars = {};
					for (i = 0; i < 4; i++) {
						vars[props[i]] = a[i] = a[i] || a[(((i - 1) / 2) >> 0)];
					}
					return cssp.parse(t, vars, pt, plugin);
				};
			},

			//@private used when other plugins must tween values first, like BezierPlugin or ThrowPropsPlugin, etc. That plugin's setRatio() gets called first so that the values are updated, and then we loop through the MiniPropTweens  which handle copying the values into their appropriate slots so that they can then be applied correctly in the main CSSPlugin setRatio() method. Remember, we typically create a proxy object that has a bunch of uniquely-named properties that we feed to the sub-plugin and it does its magic normally, and then we must interpret those values and apply them to the css because often numbers must get combined/concatenated, suffixes added, etc. to work with css, like boxShadow could have 4 values plus a color.
			_setPluginRatio = _internals._setPluginRatio = function(v) {
				this.plugin.setRatio(v);
				var d = this.data,
					proxy = d.proxy,
					mpt = d.firstMPT,
					min = 0.000001,
					val, pt, i, str;
				while (mpt) {
					val = proxy[mpt.v];
					if (mpt.r) {
						val = (val > 0) ? (val + 0.5) | 0 : (val - 0.5) | 0;
					} else if (val < min && val > -min) {
						val = 0;
					}
					mpt.t[mpt.p] = val;
					mpt = mpt._next;
				}
				if (d.autoRotate) {
					d.autoRotate.rotation = proxy.rotation;
				}
				//at the end, we must set the CSSPropTween's "e" (end) value dynamically here because that's what is used in the final setRatio() method.
				if (v === 1) {
					mpt = d.firstMPT;
					while (mpt) {
						pt = mpt.t;
						if (!pt.type) {
							pt.e = pt.s + pt.xs0;
						} else if (pt.type === 1) {
							str = pt.xs0 + pt.s + pt.xs1;
							for (i = 1; i < pt.l; i++) {
								str += pt["xn"+i] + pt["xs"+(i+1)];
							}
							pt.e = str;
						}
						mpt = mpt._next;
					}
				}
			},

			/**
			 * @private @constructor Used by a few SpecialProps to hold important values for proxies. For example, _parseToProxy() creates a MiniPropTween instance for each property that must get tweened on the proxy, and we record the original property name as well as the unique one we create for the proxy, plus whether or not the value needs to be rounded plus the original value.
			 * @param {!Object} t target object whose property we're tweening (often a CSSPropTween)
			 * @param {!string} p property name
			 * @param {(number|string|object)} v value
			 * @param {MiniPropTween=} next next MiniPropTween in the linked list
			 * @param {boolean=} r if true, the tweened value should be rounded to the nearest integer
			 */
			MiniPropTween = function(t, p, v, next, r) {
				this.t = t;
				this.p = p;
				this.v = v;
				this.r = r;
				if (next) {
					next._prev = this;
					this._next = next;
				}
			},

			/**
			 * @private Most other plugins (like BezierPlugin and ThrowPropsPlugin and others) can only tween numeric values, but CSSPlugin must accommodate special values that have a bunch of extra data (like a suffix or strings between numeric values, etc.). For example, boxShadow has values like "10px 10px 20px 30px rgb(255,0,0)" which would utterly confuse other plugins. This method allows us to split that data apart and grab only the numeric data and attach it to uniquely-named properties of a generic proxy object ({}) so that we can feed that to virtually any plugin to have the numbers tweened. However, we must also keep track of which properties from the proxy go with which CSSPropTween values and instances. So we create a linked list of MiniPropTweens. Each one records a target (the original CSSPropTween), property (like "s" or "xn1" or "xn2") that we're tweening and the unique property name that was used for the proxy (like "boxShadow_xn1" and "boxShadow_xn2") and whether or not they need to be rounded. That way, in the _setPluginRatio() method we can simply copy the values over from the proxy to the CSSPropTween instance(s). Then, when the main CSSPlugin setRatio() method runs and applies the CSSPropTween values accordingly, they're updated nicely. So the external plugin tweens the numbers, _setPluginRatio() copies them over, and setRatio() acts normally, applying css-specific values to the element.
			 * This method returns an object that has the following properties:
			 *  - proxy: a generic object containing the starting values for all the properties that will be tweened by the external plugin.  This is what we feed to the external _onInitTween() as the target
			 *  - end: a generic object containing the ending values for all the properties that will be tweened by the external plugin. This is what we feed to the external plugin's _onInitTween() as the destination values
			 *  - firstMPT: the first MiniPropTween in the linked list
			 *  - pt: the first CSSPropTween in the linked list that was created when parsing. If shallow is true, this linked list will NOT attach to the one passed into the _parseToProxy() as the "pt" (4th) parameter.
			 * @param {!Object} t target object to be tweened
			 * @param {!(Object|string)} vars the object containing the information about the tweening values (typically the end/destination values) that should be parsed
			 * @param {!CSSPlugin} cssp The CSSPlugin instance
			 * @param {CSSPropTween=} pt the next CSSPropTween in the linked list
			 * @param {TweenPlugin=} plugin the external TweenPlugin instance that will be handling tweening the numeric values
			 * @param {boolean=} shallow if true, the resulting linked list from the parse will NOT be attached to the CSSPropTween that was passed in as the "pt" (4th) parameter.
			 * @return An object containing the following properties: proxy, end, firstMPT, and pt (see above for descriptions)
			 */
			_parseToProxy = _internals._parseToProxy = function(t, vars, cssp, pt, plugin, shallow) {
				var bpt = pt,
					start = {},
					end = {},
					transform = cssp._transform,
					oldForce = _forcePT,
					i, p, xp, mpt, firstPT;
				cssp._transform = null;
				_forcePT = vars;
				pt = firstPT = cssp.parse(t, vars, pt, plugin);
				_forcePT = oldForce;
				//break off from the linked list so the new ones are isolated.
				if (shallow) {
					cssp._transform = transform;
					if (bpt) {
						bpt._prev = null;
						if (bpt._prev) {
							bpt._prev._next = null;
						}
					}
				}
				while (pt && pt !== bpt) {
					if (pt.type <= 1) {
						p = pt.p;
						end[p] = pt.s + pt.c;
						start[p] = pt.s;
						if (!shallow) {
							mpt = new MiniPropTween(pt, "s", p, mpt, pt.r);
							pt.c = 0;
						}
						if (pt.type === 1) {
							i = pt.l;
							while (--i > 0) {
								xp = "xn" + i;
								p = pt.p + "_" + xp;
								end[p] = pt.data[xp];
								start[p] = pt[xp];
								if (!shallow) {
									mpt = new MiniPropTween(pt, xp, p, mpt, pt.rxp[xp]);
								}
							}
						}
					}
					pt = pt._next;
				}
				return {proxy:start, end:end, firstMPT:mpt, pt:firstPT};
			},



			/**
			 * @constructor Each property that is tweened has at least one CSSPropTween associated with it. These instances store important information like the target, property, starting value, amount of change, etc. They can also optionally have a number of "extra" strings and numeric values named xs1, xn1, xs2, xn2, xs3, xn3, etc. where "s" indicates string and "n" indicates number. These can be pieced together in a complex-value tween (type:1) that has alternating types of data like a string, number, string, number, etc. For example, boxShadow could be "5px 5px 8px rgb(102, 102, 51)". In that value, there are 6 numbers that may need to tween and then pieced back together into a string again with spaces, suffixes, etc. xs0 is special in that it stores the suffix for standard (type:0) tweens, -OR- the first string (prefix) in a complex-value (type:1) CSSPropTween -OR- it can be the non-tweening value in a type:-1 CSSPropTween. We do this to conserve memory.
			 * CSSPropTweens have the following optional properties as well (not defined through the constructor):
			 *  - l: Length in terms of the number of extra properties that the CSSPropTween has (default: 0). For example, for a boxShadow we may need to tween 5 numbers in which case l would be 5; Keep in mind that the start/end values for the first number that's tweened are always stored in the s and c properties to conserve memory. All additional values thereafter are stored in xn1, xn2, etc.
			 *  - xfirst: The first instance of any sub-CSSPropTweens that are tweening properties of this instance. For example, we may split up a boxShadow tween so that there's a main CSSPropTween of type:1 that has various xs* and xn* values associated with the h-shadow, v-shadow, blur, color, etc. Then we spawn a CSSPropTween for each of those that has a higher priority and runs BEFORE the main CSSPropTween so that the values are all set by the time it needs to re-assemble them. The xfirst gives us an easy way to identify the first one in that chain which typically ends at the main one (because they're all prepende to the linked list)
			 *  - plugin: The TweenPlugin instance that will handle the tweening of any complex values. For example, sometimes we don't want to use normal subtweens (like xfirst refers to) to tween the values - we might want ThrowPropsPlugin or BezierPlugin some other plugin to do the actual tweening, so we create a plugin instance and store a reference here. We need this reference so that if we get a request to round values or disable a tween, we can pass along that request.
			 *  - data: Arbitrary data that needs to be stored with the CSSPropTween. Typically if we're going to have a plugin handle the tweening of a complex-value tween, we create a generic object that stores the END values that we're tweening to and the CSSPropTween's xs1, xs2, etc. have the starting values. We store that object as data. That way, we can simply pass that object to the plugin and use the CSSPropTween as the target.
			 *  - setRatio: Only used for type:2 tweens that require custom functionality. In this case, we call the CSSPropTween's setRatio() method and pass the ratio each time the tween updates. This isn't quite as efficient as doing things directly in the CSSPlugin's setRatio() method, but it's very convenient and flexible.
			 * @param {!Object} t Target object whose property will be tweened. Often a DOM element, but not always. It could be anything.
			 * @param {string} p Property to tween (name). For example, to tween element.width, p would be "width".
			 * @param {number} s Starting numeric value
			 * @param {number} c Change in numeric value over the course of the entire tween. For example, if element.width starts at 5 and should end at 100, c would be 95.
			 * @param {CSSPropTween=} next The next CSSPropTween in the linked list. If one is defined, we will define its _prev as the new instance, and the new instance's _next will be pointed at it.
			 * @param {number=} type The type of CSSPropTween where -1 = a non-tweening value, 0 = a standard simple tween, 1 = a complex value (like one that has multiple numbers in a comma- or space-delimited string like border:"1px solid red"), and 2 = one that uses a custom setRatio function that does all of the work of applying the values on each update.
			 * @param {string=} n Name of the property that should be used for overwriting purposes which is typically the same as p but not always. For example, we may need to create a subtween for the 2nd part of a "clip:rect(...)" tween in which case "p" might be xs1 but "n" is still "clip"
			 * @param {boolean=} r If true, the value(s) should be rounded
			 * @param {number=} pr Priority in the linked list order. Higher priority CSSPropTweens will be updated before lower priority ones. The default priority is 0.
			 * @param {string=} b Beginning value. We store this to ensure that it is EXACTLY what it was when the tween began without any risk of interpretation issues.
			 * @param {string=} e Ending value. We store this to ensure that it is EXACTLY what the user defined at the end of the tween without any risk of interpretation issues.
			 */
			CSSPropTween = _internals.CSSPropTween = function(t, p, s, c, next, type, n, r, pr, b, e) {
				this.t = t; //target
				this.p = p; //property
				this.s = s; //starting value
				this.c = c; //change value
				this.n = n || "css_" + p; //name that this CSSPropTween should be associated to (usually the same as p, but not always - n is what overwriting looks at)
				if (!(t instanceof CSSPropTween)) {
					_overwriteProps.push(this.n);
				}
				this.r = r; //round (boolean)
				this.type = type || 0; //0 = normal tween, -1 = non-tweening (in which case xs0 will be applied to the target's property, like tp.t[tp.p] = tp.xs0), 1 = complex-value SpecialProp, 2 = custom setRatio() that does all the work
				if (pr) {
					this.pr = pr;
					_hasPriority = true;
				}
				this.b = (b === undefined) ? s : b;
				this.e = (e === undefined) ? s + c : e;
				if (next) {
					this._next = next;
					next._prev = this;
				}
			},

			/**
			 * Takes a target, the beginning value and ending value (as strings) and parses them into a CSSPropTween (possibly with child CSSPropTweens) that accommodates multiple numbers, colors, comma-delimited values, etc. For example:
			 * sp.parseComplex(element, "boxShadow", "5px 10px 20px rgb(255,102,51)", "0px 0px 0px red", true, "0px 0px 0px rgb(0,0,0,0)", pt);
			 * It will walk through the beginning and ending values (which should be in the same format with the same number and type of values) and figure out which parts are numbers, what strings separate the numeric/tweenable values, and then create the CSSPropTweens accordingly. If a plugin is defined, no child CSSPropTweens will be created. Instead, the ending values will be stored in the "data" property of the returned CSSPropTween like: {s:-5, xn1:-10, xn2:-20, xn3:255, xn4:0, xn5:0} so that it can be fed to any other plugin and it'll be plain numeric tweens but the recomposition of the complex value will be handled inside CSSPlugin's setRatio().
			 * If a setRatio is defined, the type of the CSSPropTween will be set to 2 and recomposition of the values will be the responsibility of that method.
			 *
			 * @param {!Object} t Target whose property will be tweened
			 * @param {!string} p Property that will be tweened (its name, like "left" or "backgroundColor" or "boxShadow")
			 * @param {string} b Beginning value
			 * @param {string} e Ending value
			 * @param {boolean} clrs If true, the value could contain a color value like "rgb(255,0,0)" or "#F00" or "red". The default is false, so no colors will be recognized (a performance optimization)
			 * @param {(string|number|Object)} dflt The default beginning value that should be used if no valid beginning value is defined or if the number of values inside the complex beginning and ending values don't match
			 * @param {?CSSPropTween} pt CSSPropTween instance that is the current head of the linked list (we'll prepend to this).
			 * @param {number=} pr Priority in the linked list order. Higher priority properties will be updated before lower priority ones. The default priority is 0.
			 * @param {TweenPlugin=} plugin If a plugin should handle the tweening of extra properties, pass the plugin instance here. If one is defined, then NO subtweens will be created for any extra properties (the properties will be created - just not additional CSSPropTween instances to tween them) because the plugin is expected to do so. However, the end values WILL be populated in the "data" property, like {s:100, xn1:50, xn2:300}
			 * @param {function(number)=} setRatio If values should be set in a custom function instead of being pieced together in a type:1 (complex-value) CSSPropTween, define that custom function here.
			 * @return {CSSPropTween} The first CSSPropTween in the linked list which includes the new one(s) added by the parseComplex() call.
			 */
			_parseComplex = CSSPlugin.parseComplex = function(t, p, b, e, clrs, dflt, pt, pr, plugin, setRatio) {
				//DEBUG: _log("parseComplex: "+p+", b: "+b+", e: "+e);
				b = b || dflt || "";
				pt = new CSSPropTween(t, p, 0, 0, pt, (setRatio ? 2 : 1), null, false, pr, b, e);
				e += ""; //ensures it's a string
				var ba = b.split(", ").join(",").split(" "), //beginning array
					ea = e.split(", ").join(",").split(" "), //ending array
					l = ba.length,
					autoRound = (_autoRound !== false),
					i, xi, ni, bv, ev, bnums, enums, bn, rgba, temp, cv, str;
				if (e.indexOf(",") !== -1 || b.indexOf(",") !== -1) {
					ba = ba.join(" ").replace(_commasOutsideParenExp, ", ").split(" ");
					ea = ea.join(" ").replace(_commasOutsideParenExp, ", ").split(" ");
					l = ba.length;
				}
				if (l !== ea.length) {
					//DEBUG: _log("mismatched formatting detected on " + p + " (" + b + " vs " + e + ")");
					ba = (dflt || "").split(" ");
					l = ba.length;
				}
				pt.plugin = plugin;
				pt.setRatio = setRatio;
				for (i = 0; i < l; i++) {
					bv = ba[i];
					ev = ea[i];
					bn = parseFloat(bv);

					//if the value begins with a number (most common). It's fine if it has a suffix like px
					if (bn || bn === 0) {
						pt.appendXtra("", bn, _parseChange(ev, bn), ev.replace(_relNumExp, ""), (autoRound && ev.indexOf("px") !== -1), true);

					//if the value is a color
					} else if (clrs && (bv.charAt(0) === "#" || _colorLookup[bv] || _rgbhslExp.test(bv))) {
						str = ev.charAt(ev.length - 1) === "," ? ")," : ")"; //if there's a comma at the end, retain it.
						bv = _parseColor(bv);
						ev = _parseColor(ev);
						rgba = (bv.length + ev.length > 6);
						if (rgba && !_supportsOpacity && ev[3] === 0) { //older versions of IE don't support rgba(), so if the destination alpha is 0, just use "transparent" for the end color
							pt["xs" + pt.l] += pt.l ? " transparent" : "transparent";
							pt.e = pt.e.split(ea[i]).join("transparent");
						} else {
							if (!_supportsOpacity) { //old versions of IE don't support rgba().
								rgba = false;
							}
							pt.appendXtra((rgba ? "rgba(" : "rgb("), bv[0], ev[0] - bv[0], ",", true, true)
								.appendXtra("", bv[1], ev[1] - bv[1], ",", true)
								.appendXtra("", bv[2], ev[2] - bv[2], (rgba ? "," : str), true);
							if (rgba) {
								bv = (bv.length < 4) ? 1 : bv[3];
								pt.appendXtra("", bv, ((ev.length < 4) ? 1 : ev[3]) - bv, str, false);
							}
						}

					} else {
						bnums = bv.match(_numExp); //gets each group of numbers in the beginning value string and drops them into an array

						//if no number is found, treat it as a non-tweening value and just append the string to the current xs.
						if (!bnums) {
							pt["xs" + pt.l] += pt.l ? " " + bv : bv;

						//loop through all the numbers that are found and construct the extra values on the pt.
						} else {
							enums = ev.match(_relNumExp); //get each group of numbers in the end value string and drop them into an array. We allow relative values too, like +=50 or -=.5
							if (!enums || enums.length !== bnums.length) {
								//DEBUG: _log("mismatched formatting detected on " + p + " (" + b + " vs " + e + ")");
								return pt;
							}
							ni = 0;
							for (xi = 0; xi < bnums.length; xi++) {
								cv = bnums[xi];
								temp = bv.indexOf(cv, ni);
								pt.appendXtra(bv.substr(ni, temp - ni), Number(cv), _parseChange(enums[xi], cv), "", (autoRound && bv.substr(temp + cv.length, 2) === "px"), (xi === 0));
								ni = temp + cv.length;
							}
							pt["xs" + pt.l] += bv.substr(ni);
						}
					}
				}
				//if there are relative values ("+=" or "-=" prefix), we need to adjust the ending value to eliminate the prefixes and combine the values properly.
				if (e.indexOf("=") !== -1) if (pt.data) {
					str = pt.xs0 + pt.data.s;
					for (i = 1; i < pt.l; i++) {
						str += pt["xs" + i] + pt.data["xn" + i];
					}
					pt.e = str + pt["xs" + i];
				}
				if (!pt.l) {
					pt.type = -1;
					pt.xs0 = pt.e;
				}
				return pt.xfirst || pt;
			},
			i = 9;


		p = CSSPropTween.prototype;
		p.l = p.pr = 0; //length (number of extra properties like xn1, xn2, xn3, etc.
		while (--i > 0) {
			p["xn" + i] = 0;
			p["xs" + i] = "";
		}
		p.xs0 = "";
		p._next = p._prev = p.xfirst = p.data = p.plugin = p.setRatio = p.rxp = null;


		/**
		 * Appends and extra tweening value to a CSSPropTween and automatically manages any prefix and suffix strings. The first extra value is stored in the s and c of the main CSSPropTween instance, but thereafter any extras are stored in the xn1, xn2, xn3, etc. The prefixes and suffixes are stored in the xs0, xs1, xs2, etc. properties. For example, if I walk through a clip value like "rect(10px, 5px, 0px, 20px)", the values would be stored like this:
		 * xs0:"rect(", s:10, xs1:"px, ", xn1:5, xs2:"px, ", xn2:0, xs3:"px, ", xn3:20, xn4:"px)"
		 * And they'd all get joined together when the CSSPlugin renders (in the setRatio() method).
		 * @param {string=} pfx Prefix (if any)
		 * @param {!number} s Starting value
		 * @param {!number} c Change in numeric value over the course of the entire tween. For example, if the start is 5 and the end is 100, the change would be 95.
		 * @param {string=} sfx Suffix (if any)
		 * @param {boolean=} r Round (if true).
		 * @param {boolean=} pad If true, this extra value should be separated by the previous one by a space. If there is no previous extra and pad is true, it will automatically drop the space.
		 * @return {CSSPropTween} returns itself so that multiple methods can be chained together.
		 */
		p.appendXtra = function(pfx, s, c, sfx, r, pad) {
			var pt = this,
				l = pt.l;
			pt["xs" + l] += (pad && l) ? " " + pfx : pfx || "";
			if (!c) if (l !== 0 && !pt.plugin) { //typically we'll combine non-changing values right into the xs to optimize performance, but we don't combine them when there's a plugin that will be tweening the values because it may depend on the values being split apart, like for a bezier, if a value doesn't change between the first and second iteration but then it does on the 3rd, we'll run into trouble because there's no xn slot for that value!
				pt["xs" + l] += s + (sfx || "");
				return pt;
			}
			pt.l++;
			pt.type = pt.setRatio ? 2 : 1;
			pt["xs" + pt.l] = sfx || "";
			if (l > 0) {
				pt.data["xn" + l] = s + c;
				pt.rxp["xn" + l] = r; //round extra property (we need to tap into this in the _parseToProxy() method)
				pt["xn" + l] = s;
				if (!pt.plugin) {
					pt.xfirst = new CSSPropTween(pt, "xn" + l, s, c, pt.xfirst || pt, 0, pt.n, r, pt.pr);
					pt.xfirst.xs0 = 0; //just to ensure that the property stays numeric which helps modern browsers speed up processing. Remember, in the setRatio() method, we do pt.t[pt.p] = val + pt.xs0 so if pt.xs0 is "" (the default), it'll cast the end value as a string. When a property is a number sometimes and a string sometimes, it prevents the compiler from locking in the data type, slowing things down slightly.
				}
				return pt;
			}
			pt.data = {s:s + c};
			pt.rxp = {};
			pt.s = s;
			pt.c = c;
			pt.r = r;
			return pt;
		};

		/**
		 * @constructor A SpecialProp is basically a css property that needs to be treated in a non-standard way, like if it may contain a complex value like boxShadow:"5px 10px 15px rgb(255, 102, 51)" or if it is associated with another plugin like ThrowPropsPlugin or BezierPlugin. Every SpecialProp is associated with a particular property name like "boxShadow" or "throwProps" or "bezier" and it will intercept those values in the vars object that's passed to the CSSPlugin and handle them accordingly.
		 * @param {!string} p Property name (like "boxShadow" or "throwProps")
		 * @param {Object=} options An object containing any of the following configuration options:
		 *                      - defaultValue: the default value
		 *                      - parser: A function that should be called when the associated property name is found in the vars. This function should return a CSSPropTween instance and it should ensure that it is properly inserted into the linked list. It will receive 4 paramters: 1) The target, 2) The value defined in the vars, 3) The CSSPlugin instance (whose _firstPT should be used for the linked list), and 4) A computed style object if one was calculated (this is a speed optimization that allows retrieval of starting values quicker)
		 *                      - formatter: a function that formats any value received for this special property (for example, boxShadow could take "5px 5px red" and format it to "5px 5px 0px 0px red" so that both the beginning and ending values have a common order and quantity of values.)
		 *                      - prefix: if true, we'll determine whether or not this property requires a vendor prefix (like Webkit or Moz or ms or O)
		 *                      - color: set this to true if the value for this SpecialProp may contain color-related values like rgb(), rgba(), etc.
		 *                      - priority: priority in the linked list order. Higher priority SpecialProps will be updated before lower priority ones. The default priority is 0.
		 *                      - multi: if true, the formatter should accommodate a comma-delimited list of values, like boxShadow could have multiple boxShadows listed out.
		 *                      - collapsible: if true, the formatter should treat the value like it's a top/right/bottom/left value that could be collapsed, like "5px" would apply to all, "5px, 10px" would use 5px for top/bottom and 10px for right/left, etc.
		 *                      - keyword: a special keyword that can [optionally] be found inside the value (like "inset" for boxShadow). This allows us to validate beginning/ending values to make sure they match (if the keyword is found in one, it'll be added to the other for consistency by default).
		 */
		var SpecialProp = function(p, options) {
				options = options || {};
				this.p = options.prefix ? _checkPropPrefix(p) || p : p;
				_specialProps[p] = _specialProps[this.p] = this;
				this.format = options.formatter || _getFormatter(options.defaultValue, options.color, options.collapsible, options.multi);
				if (options.parser) {
					this.parse = options.parser;
				}
				this.clrs = options.color;
				this.multi = options.multi;
				this.keyword = options.keyword;
				this.dflt = options.defaultValue;
				this.pr = options.priority || 0;
			},

			//shortcut for creating a new SpecialProp that can accept multiple properties as a comma-delimited list (helps minification). dflt can be an array for multiple values (we don't do a comma-delimited list because the default value may contain commas, like rect(0px,0px,0px,0px)). We attach this method to the SpecialProp class/object instead of using a private _createSpecialProp() method so that we can tap into it externally if necessary, like from another plugin.
			_registerComplexSpecialProp = _internals._registerComplexSpecialProp = function(p, options, defaults) {
				if (typeof(options) !== "object") {
					options = {parser:defaults}; //to make backwards compatible with older versions of BezierPlugin and ThrowPropsPlugin
				}
				var a = p.split(","),
					d = options.defaultValue,
					i, temp;
				defaults = defaults || [d];
				for (i = 0; i < a.length; i++) {
					options.prefix = (i === 0 && options.prefix);
					options.defaultValue = defaults[i] || d;
					temp = new SpecialProp(a[i], options);
				}
			},

			//creates a placeholder special prop for a plugin so that the property gets caught the first time a tween of it is attempted, and at that time it makes the plugin register itself, thus taking over for all future tweens of that property. This allows us to not mandate that things load in a particular order and it also allows us to log() an error that informs the user when they attempt to tween an external plugin-related property without loading its .js file.
			_registerPluginProp = function(p) {
				if (!_specialProps[p]) {
					var pluginName = p.charAt(0).toUpperCase() + p.substr(1) + "Plugin";
					_registerComplexSpecialProp(p, {parser:function(t, e, p, cssp, pt, plugin, vars) {
						var pluginClass = (window.GreenSockGlobals || window).com.greensock.plugins[pluginName];
						if (!pluginClass) {
							_log("Error: " + pluginName + " js file not loaded.");
							return pt;
						}
						pluginClass._cssRegister();
						return _specialProps[p].parse(t, e, p, cssp, pt, plugin, vars);
					}});
				}
			};


		p = SpecialProp.prototype;

		/**
		 * Alias for _parseComplex() that automatically plugs in certain values for this SpecialProp, like its property name, whether or not colors should be sensed, the default value, and priority. It also looks for any keyword that the SpecialProp defines (like "inset" for boxShadow) and ensures that the beginning and ending values have the same number of values for SpecialProps where multi is true (like boxShadow and textShadow can have a comma-delimited list)
		 * @param {!Object} t target element
		 * @param {(string|number|object)} b beginning value
		 * @param {(string|number|object)} e ending (destination) value
		 * @param {CSSPropTween=} pt next CSSPropTween in the linked list
		 * @param {TweenPlugin=} plugin If another plugin will be tweening the complex value, that TweenPlugin instance goes here.
		 * @param {function=} setRatio If a custom setRatio() method should be used to handle this complex value, that goes here.
		 * @return {CSSPropTween=} First CSSPropTween in the linked list
		 */
		p.parseComplex = function(t, b, e, pt, plugin, setRatio) {
			var kwd = this.keyword,
				i, ba, ea, l, bi, ei;
			//if this SpecialProp's value can contain a comma-delimited list of values (like boxShadow or textShadow), we must parse them in a special way, and look for a keyword (like "inset" for boxShadow) and ensure that the beginning and ending BOTH have it if the end defines it as such. We also must ensure that there are an equal number of values specified (we can't tween 1 boxShadow to 3 for example)
			if (this.multi) if (_commasOutsideParenExp.test(e) || _commasOutsideParenExp.test(b)) {
				ba = b.replace(_commasOutsideParenExp, "|").split("|");
				ea = e.replace(_commasOutsideParenExp, "|").split("|");
			} else if (kwd) {
				ba = [b];
				ea = [e];
			}
			if (ea) {
				l = (ea.length > ba.length) ? ea.length : ba.length;
				for (i = 0; i < l; i++) {
					b = ba[i] = ba[i] || this.dflt;
					e = ea[i] = ea[i] || this.dflt;
					if (kwd) {
						bi = b.indexOf(kwd);
						ei = e.indexOf(kwd);
						if (bi !== ei) {
							e = (ei === -1) ? ea : ba;
							e[i] += " " + kwd;
						}
					}
				}
				b = ba.join(", ");
				e = ea.join(", ");
			}
			return _parseComplex(t, this.p, b, e, this.clrs, this.dflt, pt, this.pr, plugin, setRatio);
		};

		/**
		 * Accepts a target and end value and spits back a CSSPropTween that has been inserted into the CSSPlugin's linked list and conforms with all the conventions we use internally, like type:-1, 0, 1, or 2, setting up any extra property tweens, priority, etc. For example, if we have a boxShadow SpecialProp and call:
		 * this._firstPT = sp.parse(element, "5px 10px 20px rgb(2550,102,51)", "boxShadow", this);
		 * It should figure out the starting value of the element's boxShadow, compare it to the provided end value and create all the necessary CSSPropTweens of the appropriate types to tween the boxShadow. The CSSPropTween that gets spit back should already be inserted into the linked list (the 4th parameter is the current head, so prepend to that).
		 * @param {!Object) t Target object whose property is being tweened
		 * @param {Object} e End value as provided in the vars object (typically a string, but not always - like a throwProps would be an object).
		 * @param {!string} p Property name
		 * @param {!CSSPlugin} cssp The CSSPlugin instance that should be associated with this tween.
		 * @param {?CSSPropTween} pt The CSSPropTween that is the current head of the linked list (we'll prepend to it)
		 * @param {TweenPlugin=} plugin If a plugin will be used to tween the parsed value, this is the plugin instance.
		 * @param {Object=} vars Original vars object that contains the data for parsing.
		 * @return {CSSPropTween} The first CSSPropTween in the linked list which includes the new one(s) added by the parse() call.
		 */
		p.parse = function(t, e, p, cssp, pt, plugin, vars) {
			return this.parseComplex(t.style, this.format(_getStyle(t, this.p, _cs, false, this.dflt)), this.format(e), pt, plugin);
		};

		/**
		 * Registers a special property that should be intercepted from any "css" objects defined in tweens. This allows you to handle them however you want without CSSPlugin doing it for you. The 2nd parameter should be a function that accepts 3 parameters:
		 *  1) Target object whose property should be tweened (typically a DOM element)
		 *  2) The end/destination value (could be a string, number, object, or whatever you want)
		 *  3) The tween instance (you probably don't need to worry about this, but it can be useful for looking up information like the duration)
		 *
		 * Then, your function should return a function which will be called each time the tween gets rendered, passing a numeric "ratio" parameter to your function that indicates the change factor (usually between 0 and 1). For example:
		 *
		 * CSSPlugin.registerSpecialProp("myCustomProp", function(target, value, tween) {
		 *      var start = target.style.width;
		 *      return function(ratio) {
		 *              target.style.width = (start + value * ratio) + "px";
		 *              console.log("set width to " + target.style.width);
		 *          }
		 * }, 0);
		 *
		 * Then, when I do this tween, it will trigger my special property:
		 *
		 * TweenLite.to(element, 1, {css:{myCustomProp:100}});
		 *
		 * In the example, of course, we're just changing the width, but you can do anything you want.
		 *
		 * @param {!string} name Property name (or comma-delimited list of property names) that should be intercepted and handled by your function. For example, if I define "myCustomProp", then it would handle that portion of the following tween: TweenLite.to(element, 1, {css:{myCustomProp:100}})
		 * @param {!function(Object, Object, Object, string):function(number)} onInitTween The function that will be called when a tween of this special property is performed. The function will receive 4 parameters: 1) Target object that should be tweened, 2) Value that was passed to the tween, 3) The tween instance itself (rarely used), and 4) The property name that's being tweened. Your function should return a function that should be called on every update of the tween. That function will receive a single parameter that is a "change factor" value (typically between 0 and 1) indicating the amount of change as a ratio. You can use this to determine how to set the values appropriately in your function.
		 * @param {number=} priority Priority that helps the engine determine the order in which to set the properties (default: 0). Higher priority properties will be updated before lower priority ones.
		 */
		CSSPlugin.registerSpecialProp = function(name, onInitTween, priority) {
			_registerComplexSpecialProp(name, {parser:function(t, e, p, cssp, pt, plugin, vars) {
				var rv = new CSSPropTween(t, p, 0, 0, pt, 2, p, false, priority);
				rv.plugin = plugin;
				rv.setRatio = onInitTween(t, e, cssp._tween, p);
				return rv;
			}, priority:priority});
		};








		//transform-related methods and properties
		var _transformProps = ("scaleX,scaleY,scaleZ,x,y,z,skewX,rotation,rotationX,rotationY,perspective").split(","),
			_transformProp = _checkPropPrefix("transform"), //the Javascript (camelCase) transform property, like msTransform, WebkitTransform, MozTransform, or OTransform.
			_transformPropCSS = _prefixCSS + "transform",
			_transformOriginProp = _checkPropPrefix("transformOrigin"),
			_supports3D = (_checkPropPrefix("perspective") !== null),

			/**
			 * Parses the transform values for an element, returning an object with x, y, z, scaleX, scaleY, scaleZ, rotation, rotationX, rotationY, skewX, and skewY properties. Note: by default (for performance reasons), all skewing is combined into skewX and rotation but skewY still has a place in the transform object so that we can record how much of the skew is attributed to skewX vs skewY. Remember, a skewY of 10 looks the same as a rotation of 10 and skewX of -10.
			 * @param {!Object} t target element
			 * @param {Object=} cs computed style object (optional)
			 * @param {boolean=} rec if true, the transform values will be recorded to the target element's _gsTransform object, like target._gsTransform = {x:0, y:0, z:0, scaleX:1...}
			 * @return {object} object containing all of the transform properties/values like {x:0, y:0, z:0, scaleX:1...}
			 */
			_getTransform = function(t, cs, rec) {
				var tm = rec ? t._gsTransform || {skewY:0} : {skewY:0},
					invX = (tm.scaleX < 0), //in order to interpret things properly, we need to know if the user applied a negative scaleX previously so that we can adjust the rotation and skewX accordingly. Otherwise, if we always interpret a flipped matrix as affecting scaleY and the user only wants to tween the scaleX on multiple sequential tweens, it would keep the negative scaleY without that being the user's intent.
					min = 0.00002,
					rnd = 100000,
					minPI = -Math.PI + 0.0001,
					maxPI = Math.PI - 0.0001,
					zOrigin = _supports3D ? parseFloat(_getStyle(t, _transformOriginProp, cs, false, "0 0 0").split(" ")[2]) || tm.zOrigin  || 0 : 0,
					s, m, i, n, dec, scaleX, scaleY, rotation, skewX, difX, difY, difR, difS;
				if (_transformProp) {
					s = _getStyle(t, _transformPropCSS, cs, true);
				} else if (t.currentStyle) {
					//for older versions of IE, we need to interpret the filter portion that is in the format: progid:DXImageTransform.Microsoft.Matrix(M11=6.123233995736766e-17, M12=-1, M21=1, M22=6.123233995736766e-17, sizingMethod='auto expand') Notice that we need to swap b and c compared to a normal matrix.
					s = t.currentStyle.filter.match(_ieGetMatrixExp);
					if (s && s.length === 4) {
						s = [s[0].substr(4), Number(s[2].substr(4)), Number(s[1].substr(4)), s[3].substr(4), (tm.x || 0), (tm.y || 0)].join(",");
					} else if (tm.x != null) { //if the element already has a _gsTransform, use that.
						return tm;
					} else {
						s = "";
					}
				}
				//split the matrix values out into an array (m for matrix)
				m = (s || "").match(/(?:\-|\b)[\d\-\.e]+\b/gi) || [];
				i = m.length;
				while (--i > -1) {
					n = Number(m[i]);
					m[i] = (dec = n - (n |= 0)) ? ((dec * rnd + (dec < 0 ? -0.5 : 0.5)) | 0) / rnd + n : n; //convert strings to Numbers and round to 5 decimal places to avoid issues with tiny numbers. Roughly 20x faster than Number.toFixed(). We also must make sure to round before dividing so that values like 0.9999999999 become 1 to avoid glitches in browser rendering and interpretation of flipped/rotated 3D matrices. And don't just multiply the number by rnd, floor it, and then divide by rnd because the bitwise operations max out at a 32-bit signed integer, thus it could get clipped at a relatively low value (like 22,000.00000 for example).
				}
				if (m.length === 16) {

					//we'll only look at these position-related 6 variables first because if x/y/z all match, it's relatively safe to assume we don't need to re-parse everything which risks losing important rotational information (like rotationX:180 plus rotationY:180 would look the same as rotation:180 - there's no way to know for sure which direction was taken based solely on the matrix3d() values)
					var a13 = m[8], a23 = m[9], a33 = m[10],
						a14 = m[12], a24 = m[13], a34 = m[14];

					//we manually compensate for non-zero z component of transformOrigin to work around bugs in Safari
					if (tm.zOrigin) {
						a34 = -tm.zOrigin;
						a14 = a13*a34-m[12];
						a24 = a23*a34-m[13];
						a34 = a33*a34+tm.zOrigin-m[14];
					}

					//only parse from the matrix if we MUST because not only is it usually unnecessary due to the fact that we store the values in the _gsTransform object, but also because it's impossible to accurately interpret rotationX, rotationY, and rotationZ if all are applied, so it's much better to rely on what we store. However, we must parse the first time that an object is tweened. We also assume that if the position has changed, the user must have done some styling changes outside of CSSPlugin, thus we force a parse in that scenario.
					if (!rec || tm.rotationX == null) {
						var a11 = m[0], a21 = m[1], a31 = m[2], a41 = m[3],
							a12 = m[4], a22 = m[5], a32 = m[6], a42 = m[7],
							a43 = m[11],
							angle = tm.rotationX = Math.atan2(a32, a33),
							xFlip = (angle < minPI || angle > maxPI),
							t1, t2, t3, cos, sin, yFlip, zFlip;
						//rotationX
						if (angle) {
							cos = Math.cos(-angle);
							sin = Math.sin(-angle);
							t1 = a12*cos+a13*sin;
							t2 = a22*cos+a23*sin;
							t3 = a32*cos+a33*sin;
							//t4 = a42*cos+a43*sin;
							a13 = a12*-sin+a13*cos;
							a23 = a22*-sin+a23*cos;
							a33 = a32*-sin+a33*cos;
							a43 = a42*-sin+a43*cos;
							a12 = t1;
							a22 = t2;
							a32 = t3;
							//a42 = t4;
						}
						//rotationY
						angle = tm.rotationY = Math.atan2(a13, a11);
						if (angle) {
							yFlip = (angle < minPI || angle > maxPI);
							cos = Math.cos(-angle);
							sin = Math.sin(-angle);
							t1 = a11*cos-a13*sin;
							t2 = a21*cos-a23*sin;
							t3 = a31*cos-a33*sin;
							//t4 = a41*cos-a43*sin;
							//a13 = a11*sin+a13*cos;
							a23 = a21*sin+a23*cos;
							a33 = a31*sin+a33*cos;
							a43 = a41*sin+a43*cos;
							a11 = t1;
							a21 = t2;
							a31 = t3;
							//a41 = t4;
						}
						//rotationZ
						angle = tm.rotation = Math.atan2(a21, a22);
						if (angle) {
							zFlip = (angle < minPI || angle > maxPI);
							cos = Math.cos(-angle);
							sin = Math.sin(-angle);
							a11 = a11*cos+a12*sin;
							t2 = a21*cos+a22*sin;
							a22 = a21*-sin+a22*cos;
							a32 = a31*-sin+a32*cos;
							a21 = t2;
						}

						if (zFlip && xFlip) {
							tm.rotation = tm.rotationX = 0;
						} else if (zFlip && yFlip) {
							tm.rotation = tm.rotationY = 0;
						} else if (yFlip && xFlip) {
							tm.rotationY = tm.rotationX = 0;
						}

						tm.scaleX = ((Math.sqrt(a11 * a11 + a21 * a21) * rnd + 0.5) | 0) / rnd;
						tm.scaleY = ((Math.sqrt(a22 * a22 + a23 * a23) * rnd + 0.5) | 0) / rnd;
						tm.scaleZ = ((Math.sqrt(a32 * a32 + a33 * a33) * rnd + 0.5) | 0) / rnd;
						tm.skewX = 0;
						tm.perspective = a43 ? 1 / ((a43 < 0) ? -a43 : a43) : 0;
						tm.x = a14;
						tm.y = a24;
						tm.z = a34;
					}

				} else if ((!_supports3D || m.length === 0 || tm.x !== m[4] || tm.y !== m[5] || (!tm.rotationX && !tm.rotationY)) && !(tm.x !== undefined && _getStyle(t, "display", cs) === "none")) { //sometimes a 6-element matrix is returned even when we performed 3D transforms, like if rotationX and rotationY are 180. In cases like this, we still need to honor the 3D transforms. If we just rely on the 2D info, it could affect how the data is interpreted, like scaleY might get set to -1 or rotation could get offset by 180 degrees. For example, do a TweenLite.to(element, 1, {css:{rotationX:180, rotationY:180}}) and then later, TweenLite.to(element, 1, {css:{rotationX:0}}) and without this conditional logic in place, it'd jump to a state of being unrotated when the 2nd tween starts. Then again, we need to honor the fact that the user COULD alter the transforms outside of CSSPlugin, like by manually applying new css, so we try to sense that by looking at x and y because if those changed, we know the changes were made outside CSSPlugin and we force a reinterpretation of the matrix values. Also, in Webkit browsers, if the element's "display" is "none", its calculated style value will always return empty, so if we've already recorded the values in the _gsTransform object, we'll just rely on those.
					var k = (m.length >= 6),
						a = k ? m[0] : 1,
						b = m[1] || 0,
						c = m[2] || 0,
						d = k ? m[3] : 1;

					tm.x = m[4] || 0;
					tm.y = m[5] || 0;
					scaleX = Math.sqrt(a * a + b * b);
					scaleY = Math.sqrt(d * d + c * c);
					rotation = (a || b) ? Math.atan2(b, a) : tm.rotation || 0; //note: if scaleX is 0, we cannot accurately measure rotation. Same for skewX with a scaleY of 0. Therefore, we default to the previously recorded value (or zero if that doesn't exist).
					skewX = (c || d) ? Math.atan2(c, d) + rotation : tm.skewX || 0;
					difX = scaleX - Math.abs(tm.scaleX || 0);
					difY = scaleY - Math.abs(tm.scaleY || 0);
					if (Math.abs(skewX) > Math.PI / 2 && Math.abs(skewX) < Math.PI * 1.5) {
						if (invX) {
							scaleX *= -1;
							skewX += (rotation <= 0) ? Math.PI : -Math.PI;
							rotation += (rotation <= 0) ? Math.PI : -Math.PI;
						} else {
							scaleY *= -1;
							skewX += (skewX <= 0) ? Math.PI : -Math.PI;
						}
					}
					difR = (rotation - tm.rotation) % Math.PI; //note: matching ranges would be very small (+/-0.0001) or very close to Math.PI (+/-3.1415).
					difS = (skewX - tm.skewX) % Math.PI;
					//if there's already a recorded _gsTransform in place for the target, we should leave those values in place unless we know things changed for sure (beyond a super small amount). This gets around ambiguous interpretations, like if scaleX and scaleY are both -1, the matrix would be the same as if the rotation was 180 with normal scaleX/scaleY. If the user tweened to particular values, those must be prioritized to ensure animation is consistent.
					if (tm.skewX === undefined || difX > min || difX < -min || difY > min || difY < -min || (difR > minPI && difR < maxPI && (difR * rnd) | 0 !== 0) || (difS > minPI && difS < maxPI && (difS * rnd) | 0 !== 0)) {
						tm.scaleX = scaleX;
						tm.scaleY = scaleY;
						tm.rotation = rotation;
						tm.skewX = skewX;
					}
					if (_supports3D) {
						tm.rotationX = tm.rotationY = tm.z = 0;
						tm.perspective = parseFloat(CSSPlugin.defaultTransformPerspective) || 0;
						tm.scaleZ = 1;
					}
				}
				tm.zOrigin = zOrigin;

				//some browsers have a hard time with very small values like 2.4492935982947064e-16 (notice the "e-" towards the end) and would render the object slightly off. So we round to 0 in these cases. The conditional logic here is faster than calling Math.abs(). Also, browsers tend to render a SLIGHTLY rotated object in a fuzzy way, so we need to snap to exactly 0 when appropriate.
				for (i in tm) {
					if (tm[i] < min) if (tm[i] > -min) {
						tm[i] = 0;
					}
				}
				//DEBUG: _log("parsed rotation: "+(tm.rotationX*_RAD2DEG)+", "+(tm.rotationY*_RAD2DEG)+", "+(tm.rotation*_RAD2DEG)+", scale: "+tm.scaleX+", "+tm.scaleY+", "+tm.scaleZ+", position: "+tm.x+", "+tm.y+", "+tm.z+", perspective: "+tm.perspective);
				if (rec) {
					t._gsTransform = tm; //record to the object's _gsTransform which we use so that tweens can control individual properties independently (we need all the properties to accurately recompose the matrix in the setRatio() method)
				}
				return tm;
			},
			//for setting 2D transforms in IE6, IE7, and IE8 (must use a "filter" to emulate the behavior of modern day browser transforms)
			_setIETransformRatio = function(v) {
				var t = this.data, //refers to the element's _gsTransform object
					ang = -t.rotation,
					skew = ang + t.skewX,
					rnd = 100000,
					a = ((Math.cos(ang) * t.scaleX * rnd) | 0) / rnd,
					b = ((Math.sin(ang) * t.scaleX * rnd) | 0) / rnd,
					c = ((Math.sin(skew) * -t.scaleY * rnd) | 0) / rnd,
					d = ((Math.cos(skew) * t.scaleY * rnd) | 0) / rnd,
					style = this.t.style,
					cs = this.t.currentStyle,
					filters, val;
				if (!cs) {
					return;
				}
				val = b; //just for swapping the variables an inverting them (reused "val" to avoid creating another variable in memory). IE's filter matrix uses a non-standard matrix configuration (angle goes the opposite way, and b and c are reversed and inverted)
				b = -c;
				c = -val;
				filters = cs.filter;
				style.filter = ""; //remove filters so that we can accurately measure offsetWidth/offsetHeight
				var w = this.t.offsetWidth,
					h = this.t.offsetHeight,
					clip = (cs.position !== "absolute"),
					m = "progid:DXImageTransform.Microsoft.Matrix(M11=" + a + ", M12=" + b + ", M21=" + c + ", M22=" + d,
					ox = t.x,
					oy = t.y,
					dx, dy;

				//if transformOrigin is being used, adjust the offset x and y
				if (t.ox != null) {
					dx = ((t.oxp) ? w * t.ox * 0.01 : t.ox) - w / 2;
					dy = ((t.oyp) ? h * t.oy * 0.01 : t.oy) - h / 2;
					ox += dx - (dx * a + dy * b);
					oy += dy - (dx * c + dy * d);
				}

				if (!clip) {
					var mult = (_ieVers < 8) ? 1 : -1, //in Internet Explorer 7 and before, the box model is broken, causing the browser to treat the width/height of the actual rotated filtered image as the width/height of the box itself, but Microsoft corrected that in IE8. We must use a negative offset in IE8 on the right/bottom
						marg, prop, dif;
					dx = t.ieOffsetX || 0;
					dy = t.ieOffsetY || 0;
					t.ieOffsetX = Math.round((w - ((a < 0 ? -a : a) * w + (b < 0 ? -b : b) * h)) / 2 + ox);
					t.ieOffsetY = Math.round((h - ((d < 0 ? -d : d) * h + (c < 0 ? -c : c) * w)) / 2 + oy);
					for (i = 0; i < 4; i++) {
						prop = _margins[i];
						marg = cs[prop];
						//we need to get the current margin in case it is being tweened separately (we want to respect that tween's changes)
						val = (marg.indexOf("px") !== -1) ? parseFloat(marg) : _convertToPixels(this.t, prop, parseFloat(marg), marg.replace(_suffixExp, "")) || 0;
						if (val !== t[prop]) {
							dif = (i < 2) ? -t.ieOffsetX : -t.ieOffsetY; //if another tween is controlling a margin, we cannot only apply the difference in the ieOffsets, so we essentially zero-out the dx and dy here in that case. We record the margin(s) later so that we can keep comparing them, making this code very flexible.
						} else {
							dif = (i < 2) ? dx - t.ieOffsetX : dy - t.ieOffsetY;
						}
						style[prop] = (t[prop] = Math.round( val - dif * ((i === 0 || i === 2) ? 1 : mult) )) + "px";
					}
					m += ", sizingMethod='auto expand')";
				} else {
					dx = (w / 2);
					dy = (h / 2);
					//translate to ensure that transformations occur around the correct origin (default is center).
					m += ", Dx=" + (dx - (dx * a + dy * b) + ox) + ", Dy=" + (dy - (dx * c + dy * d) + oy) + ")";
				}
				if (filters.indexOf("DXImageTransform.Microsoft.Matrix(") !== -1) {
					style.filter = filters.replace(_ieSetMatrixExp, m);
				} else {
					style.filter = m + " " + filters; //we must always put the transform/matrix FIRST (before alpha(opacity=xx)) to avoid an IE bug that slices part of the object when rotation is applied with alpha.
				}

				//at the end or beginning of the tween, if the matrix is normal (1, 0, 0, 1) and opacity is 100 (or doesn't exist), remove the filter to improve browser performance.
				if (v === 0 || v === 1) if (a === 1) if (b === 0) if (c === 0) if (d === 1) if (!clip || m.indexOf("Dx=0, Dy=0") !== -1) if (!_opacityExp.test(filters) || parseFloat(RegExp.$1) === 100) if (filters.indexOf("gradient(") === -1) {
					style.removeAttribute("filter");
				}
			},
			_set3DTransformRatio = function(v) {
				var t = this.data, //refers to the element's _gsTransform object
					style = this.t.style,
					perspective = t.perspective,
					a11 = t.scaleX, a12 = 0, a13 = 0, a14 = 0,
					a21 = 0, a22 = t.scaleY, a23 = 0, a24 = 0,
					a31 = 0, a32 = 0, a33 = t.scaleZ, a34 = 0,
					a41 = 0, a42 = 0, a43 = (perspective) ? -1 / perspective : 0,
					angle = t.rotation,
					zOrigin = t.zOrigin,
					rnd = 100000,
					cos, sin, t1, t2, t3, t4, ffProp, n, sfx;

				if (_isFirefox) { //Firefox has a bug that causes 3D elements to randomly disappear during animation unless a repaint is forced. One way to do this is change "top" or "bottom" by 0.05 which is imperceptible, so we go back and forth. Another way is to change the display to "none", read the clientTop, and then revert the display but that is much slower.
					ffProp = style.top ? "top" : style.bottom ? "bottom" : parseFloat(_getStyle(this.t, "top", null, false)) ? "bottom" : "top";
					t1 = _getStyle(this.t, ffProp, null, false);
					n = parseFloat(t1) || 0;
					sfx = t1.substr((n + "").length) || "px";
					t._ffFix = !t._ffFix;
					style[ffProp] = (t._ffFix ? n + 0.05 : n - 0.05) + sfx;
				}

				if (angle || t.skewX) {
					t1 = a11*Math.cos(angle);
					t2 = a22*Math.sin(angle);
					angle -= t.skewX;
					a12 = a11*-Math.sin(angle);
					a22 = a22*Math.cos(angle);
					a11 = t1;
					a21 = t2;
				}
				angle = t.rotationY;
				if (angle) {
					cos = Math.cos(angle);
					sin = Math.sin(angle);
					t1 = a11*cos;
					t2 = a21*cos;
					t3 = a33*-sin;
					t4 = a43*-sin;
					a13 = a11*sin;
					a23 = a21*sin;
					a33 = a33*cos;
					a43 *= cos;
					a11 = t1;
					a21 = t2;
					a31 = t3;
					a41 = t4;
				}
				angle = t.rotationX;
				if (angle) {
					cos = Math.cos(angle);
					sin = Math.sin(angle);
					t1 = a12*cos+a13*sin;
					t2 = a22*cos+a23*sin;
					t3 = a32*cos+a33*sin;
					t4 = a42*cos+a43*sin;
					a13 = a12*-sin+a13*cos;
					a23 = a22*-sin+a23*cos;
					a33 = a32*-sin+a33*cos;
					a43 = a42*-sin+a43*cos;
					a12 = t1;
					a22 = t2;
					a32 = t3;
					a42 = t4;
				}
				if (zOrigin) {
					a34 -= zOrigin;
					a14 = a13*a34;
					a24 = a23*a34;
					a34 = a33*a34+zOrigin;
				}
				//we round the x, y, and z slightly differently to allow even larger values.
				a14 = (t1 = (a14 += t.x) - (a14 |= 0)) ? ((t1 * rnd + (t1 < 0 ? -0.5 : 0.5)) | 0) / rnd + a14 : a14;
				a24 = (t1 = (a24 += t.y) - (a24 |= 0)) ? ((t1 * rnd + (t1 < 0 ? -0.5 : 0.5)) | 0) / rnd + a24 : a24;
				a34 = (t1 = (a34 += t.z) - (a34 |= 0)) ? ((t1 * rnd + (t1 < 0 ? -0.5 : 0.5)) | 0) / rnd + a34 : a34;
				style[_transformProp] = "matrix3d(" + [ (((a11 * rnd) | 0) / rnd), (((a21 * rnd) | 0) / rnd), (((a31 * rnd) | 0) / rnd), (((a41 * rnd) | 0) / rnd), (((a12 * rnd) | 0) / rnd), (((a22 * rnd) | 0) / rnd), (((a32 * rnd) | 0) / rnd), (((a42 * rnd) | 0) / rnd), (((a13 * rnd) | 0) / rnd), (((a23 * rnd) | 0) / rnd), (((a33 * rnd) | 0) / rnd), (((a43 * rnd) | 0) / rnd), a14, a24, a34, (perspective ? (1 + (-a34 / perspective)) : 1) ].join(",") + ")";
			},
			_set2DTransformRatio = function(v) {
				var t = this.data, //refers to the element's _gsTransform object
					targ = this.t,
					style = targ.style,
					ffProp, t1, n, sfx, ang, skew, rnd, sx, sy;
				if (_isFirefox) { //Firefox has a bug that causes elements to randomly disappear during animation unless a repaint is forced. One way to do this is change "top" or "bottom" by 0.05 which is imperceptible, so we go back and forth. Another way is to change the display to "none", read the clientTop, and then revert the display but that is much slower.
					ffProp = style.top ? "top" : style.bottom ? "bottom" : parseFloat(_getStyle(targ, "top", null, false)) ? "bottom" : "top";
					t1 = _getStyle(targ, ffProp, null, false);
					n = parseFloat(t1) || 0;
					sfx = t1.substr((n + "").length) || "px";
					t._ffFix = !t._ffFix;
					style[ffProp] = (t._ffFix ? n + 0.05 : n - 0.05) + sfx;
				}
				if (!t.rotation && !t.skewX) {
					style[_transformProp] = "matrix(" + t.scaleX + ",0,0," + t.scaleY + "," + t.x + "," + t.y + ")";
				} else {
					ang = t.rotation;
					skew = ang - t.skewX;
					rnd = 100000;
					sx = t.scaleX * rnd;
					sy = t.scaleY * rnd;
					//some browsers have a hard time with very small values like 2.4492935982947064e-16 (notice the "e-" towards the end) and would render the object slightly off. So we round to 5 decimal places.
					style[_transformProp] = "matrix(" + (((Math.cos(ang) * sx) | 0) / rnd) + "," + (((Math.sin(ang) * sx) | 0) / rnd) + "," + (((Math.sin(skew) * -sy) | 0) / rnd) + "," + (((Math.cos(skew) * sy) | 0) / rnd) + "," + t.x + "," + t.y + ")";
				}
			};

		_registerComplexSpecialProp("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,transformPerspective,directionalRotation", {parser:function(t, e, p, cssp, pt, plugin, vars) {
			if (cssp._transform) { return pt; } //only need to parse the transform once, and only if the browser supports it.
			var m1 = cssp._transform = _getTransform(t, _cs, true),
				style = t.style,
				min = 0.000001,
				i = _transformProps.length,
				v = vars,
				endRotations = {},
				m2, skewY, copy, orig, has3D, hasChange, dr;

			if (typeof(v.transform) === "string" && _transformProp) { //for values like transform:"rotate(60deg) scale(0.5, 0.8)"
				copy = style.cssText;
				style[_transformProp] = v.transform;
				style.display = "block"; //if display is "none", the browser often refuses to report the transform properties correctly.
				m2 = _getTransform(t, null, false);
				style.cssText = copy;
			} else if (typeof(v) === "object") { //for values like scaleX, scaleY, rotation, x, y, skewX, and skewY or transform:{...} (object)
				m2 = {scaleX:_parseVal((v.scaleX != null) ? v.scaleX : v.scale, m1.scaleX),
					scaleY:_parseVal((v.scaleY != null) ? v.scaleY : v.scale, m1.scaleY),
					scaleZ:_parseVal((v.scaleZ != null) ? v.scaleZ : v.scale, m1.scaleZ),
					x:_parseVal(v.x, m1.x),
					y:_parseVal(v.y, m1.y),
					z:_parseVal(v.z, m1.z),
					perspective:_parseVal(v.transformPerspective, m1.perspective)};
				dr = v.directionalRotation;
				if (dr != null) {
					if (typeof(dr) === "object") {
						for (copy in dr) {
							v[copy] = dr[copy];
						}
					} else {
						v.rotation = dr;
					}
				}
				m2.rotation = _parseAngle(("rotation" in v) ? v.rotation : ("shortRotation" in v) ? v.shortRotation + "_short" : ("rotationZ" in v) ? v.rotationZ : (m1.rotation * _RAD2DEG), m1.rotation, "rotation", endRotations);
				if (_supports3D) {
					m2.rotationX = _parseAngle(("rotationX" in v) ? v.rotationX : ("shortRotationX" in v) ? v.shortRotationX + "_short" : (m1.rotationX * _RAD2DEG) || 0, m1.rotationX, "rotationX", endRotations);
					m2.rotationY = _parseAngle(("rotationY" in v) ? v.rotationY : ("shortRotationY" in v) ? v.shortRotationY + "_short" : (m1.rotationY * _RAD2DEG) || 0, m1.rotationY, "rotationY", endRotations);
				}
				m2.skewX = (v.skewX == null) ? m1.skewX : _parseAngle(v.skewX, m1.skewX);

				//note: for performance reasons, we combine all skewing into the skewX and rotation values, ignoring skewY but we must still record it so that we can discern how much of the overall skew is attributed to skewX vs. skewY. Otherwise, if the skewY would always act relative (tween skewY to 10deg, for example, multiple times and if we always combine things into skewX, we can't remember that skewY was 10 from last time). Remember, a skewY of 10 degrees looks the same as a rotation of 10 degrees plus a skewX of -10 degrees.
				m2.skewY = (v.skewY == null) ? m1.skewY : _parseAngle(v.skewY, m1.skewY);
				if ((skewY = m2.skewY - m1.skewY)) {
					m2.skewX += skewY;
					m2.rotation += skewY;
				}
			}

			has3D = (m1.z || m1.rotationX || m1.rotationY || m2.z || m2.rotationX || m2.rotationY || m2.perspective);
			if (!has3D && v.scale != null) {
				m2.scaleZ = 1; //no need to tween scaleZ.
			}

			while (--i > -1) {
				p = _transformProps[i];
				orig = m2[p] - m1[p];
				if (orig > min || orig < -min || _forcePT[p] != null) {
					hasChange = true;
					pt = new CSSPropTween(m1, p, m1[p], orig, pt);
					if (p in endRotations) {
						pt.e = endRotations[p]; //directional rotations typically have compensated values during the tween, but we need to make sure they end at exactly what the user requested
					}
					pt.xs0 = 0; //ensures the value stays numeric in setRatio()
					pt.plugin = plugin;
					cssp._overwriteProps.push(pt.n);
				}
			}

			orig = v.transformOrigin;
			if (orig || (_supports3D && has3D && m1.zOrigin)) { //if anything 3D is happening and there's a transformOrigin with a z component that's non-zero, we must ensure that the transformOrigin's z-component is set to 0 so that we can manually do those calculations to get around Safari bugs. Even if the user didn't specifically define a "transformOrigin" in this particular tween (maybe they did it via css directly).
				if (_transformProp) {
					hasChange = true;
					orig = (orig || _getStyle(t, p, _cs, false, "50% 50%")) + ""; //cast as string to avoid errors
					p = _transformOriginProp;
					pt = new CSSPropTween(style, p, 0, 0, pt, -1, "css_transformOrigin");
					pt.b = style[p];
					pt.plugin = plugin;
					if (_supports3D) {
						copy = m1.zOrigin;
						orig = orig.split(" ");
						m1.zOrigin = ((orig.length > 2) ? parseFloat(orig[2]) : copy) || 0; //Safari doesn't handle the z part of transformOrigin correctly, so we'll manually handle it in the _set3DTransformRatio() method.
						pt.xs0 = pt.e = style[p] = orig[0] + " " + (orig[1] || "50%") + " 0px"; //we must define a z value of 0px specifically otherwise iOS 5 Safari will stick with the old one (if one was defined)!
						pt = new CSSPropTween(m1, "zOrigin", 0, 0, pt, -1, pt.n); //we must create a CSSPropTween for the _gsTransform.zOrigin so that it gets reset properly at the beginning if the tween runs backward (as opposed to just setting m1.zOrigin here)
						pt.b = copy;
						pt.xs0 = pt.e = m1.zOrigin;
					} else {
						pt.xs0 = pt.e = style[p] = orig;
					}

				//for older versions of IE (6-8), we need to manually calculate things inside the setRatio() function. We record origin x and y (ox and oy) and whether or not the values are percentages (oxp and oyp).
				} else {
					_parsePosition(orig + "", m1);
				}
			}

			if (hasChange) {
				cssp._transformType = (has3D || this._transformType === 3) ? 3 : 2; //quicker than calling cssp._enableTransforms();
			}
			return pt;
		}, prefix:true});

		_registerComplexSpecialProp("boxShadow", {defaultValue:"0px 0px 0px 0px #999", prefix:true, color:true, multi:true, keyword:"inset"});

		_registerComplexSpecialProp("borderRadius", {defaultValue:"0px", parser:function(t, e, p, cssp, pt, plugin) {
			e = this.format(e);
			var props = ["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"],
				style = t.style,
				ea1, i, es2, bs2, bs, es, bn, en, w, h, esfx, bsfx, rel, hn, vn, em;
			w = parseFloat(t.offsetWidth);
			h = parseFloat(t.offsetHeight);
			ea1 = e.split(" ");
			for (i = 0; i < props.length; i++) { //if we're dealing with percentages, we must convert things separately for the horizontal and vertical axis!
				if (this.p.indexOf("border")) { //older browsers used a prefix
					props[i] = _checkPropPrefix(props[i]);
				}
				bs = bs2 = _getStyle(t, props[i], _cs, false, "0px");
				if (bs.indexOf(" ") !== -1) {
					bs2 = bs.split(" ");
					bs = bs2[0];
					bs2 = bs2[1];
				}
				es = es2 = ea1[i];
				bn = parseFloat(bs);
				bsfx = bs.substr((bn + "").length);
				rel = (es.charAt(1) === "=");
				if (rel) {
					en = parseInt(es.charAt(0)+"1", 10);
					es = es.substr(2);
					en *= parseFloat(es);
					esfx = es.substr((en + "").length - (en < 0 ? 1 : 0)) || "";
				} else {
					en = parseFloat(es);
					esfx = es.substr((en + "").length);
				}
				if (esfx === "") {
					esfx = _suffixMap[p] || bsfx;
				}
				if (esfx !== bsfx) {
					hn = _convertToPixels(t, "borderLeft", bn, bsfx); //horizontal number (we use a bogus "borderLeft" property just because the _convertToPixels() method searches for the keywords "Left", "Right", "Top", and "Bottom" to determine of it's a horizontal or vertical property, and we need "border" in the name so that it knows it should measure relative to the element itself, not its parent.
					vn = _convertToPixels(t, "borderTop", bn, bsfx); //vertical number
					if (esfx === "%") {
						bs = (hn / w * 100) + "%";
						bs2 = (vn / h * 100) + "%";
					} else if (esfx === "em") {
						em = _convertToPixels(t, "borderLeft", 1, "em");
						bs = (hn / em) + "em";
						bs2 = (vn / em) + "em";
					} else {
						bs = hn + "px";
						bs2 = vn + "px";
					}
					if (rel) {
						es = (parseFloat(bs) + en) + esfx;
						es2 = (parseFloat(bs2) + en) + esfx;
					}
				}
				pt = _parseComplex(style, props[i], bs + " " + bs2, es + " " + es2, false, "0px", pt);
			}
			return pt;
		}, prefix:true, formatter:_getFormatter("0px 0px 0px 0px", false, true)});
		_registerComplexSpecialProp("backgroundPosition", {defaultValue:"0 0", parser:function(t, e, p, cssp, pt, plugin) {
			var bp = "background-position",
				cs = (_cs || _getComputedStyle(t, null)),
				bs = this.format( ((cs) ? _ieVers ? cs.getPropertyValue(bp + "-x") + " " + cs.getPropertyValue(bp + "-y") : cs.getPropertyValue(bp) : t.currentStyle.backgroundPositionX + " " + t.currentStyle.backgroundPositionY) || "0 0"), //Internet Explorer doesn't report background-position correctly - we must query background-position-x and background-position-y and combine them (even in IE10). Before IE9, we must do the same with the currentStyle object and use camelCase
				es = this.format(e),
				ba, ea, i, pct, overlap, src;
			if ((bs.indexOf("%") !== -1) !== (es.indexOf("%") !== -1)) {
				src = _getStyle(t, "backgroundImage").replace(_urlExp, "");
				if (src && src !== "none") {
					ba = bs.split(" ");
					ea = es.split(" ");
					_tempImg.setAttribute("src", src); //set the temp <img>'s src to the background-image so that we can measure its width/height
					i = 2;
					while (--i > -1) {
						bs = ba[i];
						pct = (bs.indexOf("%") !== -1);
						if (pct !== (ea[i].indexOf("%") !== -1)) {
							overlap = (i === 0) ? t.offsetWidth - _tempImg.width : t.offsetHeight - _tempImg.height;
							ba[i] = pct ? (parseFloat(bs) / 100 * overlap) + "px" : (parseFloat(bs) / overlap * 100) + "%";
						}
					}
					bs = ba.join(" ");
				}
			}
			return this.parseComplex(t.style, bs, es, pt, plugin);
		}, formatter:_parsePosition}); //note: backgroundPosition doesn't support interpreting between px and % (start and end values should use the same units) because doing so would require determining the size of the image itself and that can't be done quickly.
		_registerComplexSpecialProp("backgroundSize", {defaultValue:"0 0", formatter:_parsePosition});
		_registerComplexSpecialProp("perspective", {defaultValue:"0px", prefix:true});
		_registerComplexSpecialProp("perspectiveOrigin", {defaultValue:"50% 50%", prefix:true});
		_registerComplexSpecialProp("transformStyle", {prefix:true});
		_registerComplexSpecialProp("backfaceVisibility", {prefix:true});
		_registerComplexSpecialProp("margin", {parser:_getEdgeParser("marginTop,marginRight,marginBottom,marginLeft")});
		_registerComplexSpecialProp("padding", {parser:_getEdgeParser("paddingTop,paddingRight,paddingBottom,paddingLeft")});
		_registerComplexSpecialProp("clip", {defaultValue:"rect(0px,0px,0px,0px)", parser:function(t, e, p, cssp, pt, plugin){
			var b, cs, delim;
			if (_ieVers < 9) { //IE8 and earlier don't report a "clip" value in the currentStyle - instead, the values are split apart into clipTop, clipRight, clipBottom, and clipLeft. Also, in IE7 and earlier, the values inside rect() are space-delimited, not comma-delimited.
				cs = t.currentStyle;
				delim = _ieVers < 8 ? " " : ",";
				b = "rect(" + cs.clipTop + delim + cs.clipRight + delim + cs.clipBottom + delim + cs.clipLeft + ")";
				e = this.format(e).split(",").join(delim);
			} else {
				b = this.format(_getStyle(t, this.p, _cs, false, this.dflt));
				e = this.format(e);
			}
			return this.parseComplex(t.style, b, e, pt, plugin);
		}});
		_registerComplexSpecialProp("textShadow", {defaultValue:"0px 0px 0px #999", color:true, multi:true});
		_registerComplexSpecialProp("autoRound,strictUnits", {parser:function(t, e, p, cssp, pt) {return pt;}}); //just so that we can ignore these properties (not tween them)
		_registerComplexSpecialProp("border", {defaultValue:"0px solid #000", parser:function(t, e, p, cssp, pt, plugin) {
				return this.parseComplex(t.style, this.format(_getStyle(t, "borderTopWidth", _cs, false, "0px") + " " + _getStyle(t, "borderTopStyle", _cs, false, "solid") + " " + _getStyle(t, "borderTopColor", _cs, false, "#000")), this.format(e), pt, plugin);
			}, color:true, formatter:function(v) {
				var a = v.split(" ");
				return a[0] + " " + (a[1] || "solid") + " " + (v.match(_colorExp) || ["#000"])[0];
			}});
		_registerComplexSpecialProp("float,cssFloat,styleFloat", {parser:function(t, e, p, cssp, pt, plugin) {
			var s = t.style,
				prop = ("cssFloat" in s) ? "cssFloat" : "styleFloat";
			return new CSSPropTween(s, prop, 0, 0, pt, -1, p, false, 0, s[prop], e);
		}});

		//opacity-related
		var _setIEOpacityRatio = function(v) {
				var t = this.t, //refers to the element's style property
					filters = t.filter,
					val = (this.s + this.c * v) | 0,
					skip;
				if (val === 100) { //for older versions of IE that need to use a filter to apply opacity, we should remove the filter if opacity hits 1 in order to improve performance, but make sure there isn't a transform (matrix) or gradient in the filters.
					if (filters.indexOf("atrix(") === -1 && filters.indexOf("radient(") === -1) {
						t.removeAttribute("filter");
						skip = (!_getStyle(this.data, "filter")); //if a class is applied that has an alpha filter, it will take effect (we don't want that), so re-apply our alpha filter in that case. We must first remove it and then check.
					} else {
						t.filter = filters.replace(_alphaFilterExp, "");
						skip = true;
					}
				}
				if (!skip) {
					if (this.xn1) {
						t.filter = filters = filters || "alpha(opacity=100)"; //works around bug in IE7/8 that prevents changes to "visibility" from being applied properly if the filter is changed to a different alpha on the same frame.
					}
					if (filters.indexOf("opacity") === -1) { //only used if browser doesn't support the standard opacity style property (IE 7 and 8)
						t.filter += " alpha(opacity=" + val + ")"; //we round the value because otherwise, bugs in IE7/8 can prevent "visibility" changes from being applied properly.
					} else {
						t.filter = filters.replace(_opacityExp, "opacity=" + val);
					}
				}
			};
		_registerComplexSpecialProp("opacity,alpha,autoAlpha", {defaultValue:"1", parser:function(t, e, p, cssp, pt, plugin) {
			var b = parseFloat(_getStyle(t, "opacity", _cs, false, "1")),
				style = t.style,
				vb;
			e = parseFloat(e);
			if (p === "autoAlpha") {
				vb = _getStyle(t, "visibility", _cs);
				if (b === 1 && vb === "hidden" && e !== 0) { //if visibility is initially set to "hidden", we should interpret that as intent to make opacity 0 (a convenience)
					b = 0;
				}
				pt = new CSSPropTween(style, "visibility", 0, 0, pt, -1, null, false, 0, ((b !== 0) ? "visible" : "hidden"), ((e === 0) ? "hidden" : "visible"));
				pt.xs0 = "visible";
				cssp._overwriteProps.push(pt.n);
			}
			if (_supportsOpacity) {
				pt = new CSSPropTween(style, "opacity", b, e - b, pt);
			} else {
				pt = new CSSPropTween(style, "opacity", b * 100, (e - b) * 100, pt);
				pt.xn1 = (p === "autoAlpha") ? 1 : 0; //we need to record whether or not this is an autoAlpha so that in the setRatio(), we know to duplicate the setting of the alpha in order to work around a bug in IE7 and IE8 that prevents changes to "visibility" from taking effect if the filter is changed to a different alpha(opacity) at the same time. Setting it to the SAME value first, then the new value works around the IE7/8 bug.
				style.zoom = 1; //helps correct an IE issue.
				pt.type = 2;
				pt.b = "alpha(opacity=" + pt.s + ")";
				pt.e = "alpha(opacity=" + (pt.s + pt.c) + ")";
				pt.data = t;
				pt.plugin = plugin;
				pt.setRatio = _setIEOpacityRatio;
			}
			return pt;
		}});


		var _removeProp = function(s, p) {
				if (p) {
					if (s.removeProperty) {
						s.removeProperty(p.replace(_capsExp, "-$1").toLowerCase());
					} else { //note: old versions of IE use "removeAttribute()" instead of "removeProperty()"
						s.removeAttribute(p);
					}
				}
			},
			_setClassNameRatio = function(v) {
				this.t._gsClassPT = this;
				if (v === 1 || v === 0) {
					this.t.className = (v === 0) ? this.b : this.e;
					var mpt = this.data, //first MiniPropTween
						s = this.t.style;
					while (mpt) {
						if (!mpt.v) {
							_removeProp(s, mpt.p);
						} else {
							s[mpt.p] = mpt.v;
						}
						mpt = mpt._next;
					}
					if (v === 1 && this.t._gsClassPT === this) {
						this.t._gsClassPT = null;
					}
				} else if (this.t.className !== this.e) {
					this.t.className = this.e;
				}
			};
		_registerComplexSpecialProp("className", {parser:function(t, e, p, cssp, pt, plugin, vars) {
			var b = t.className,
				cssText = t.style.cssText,
				difData, bs, cnpt, cnptLookup, mpt;
			pt = cssp._classNamePT = new CSSPropTween(t, p, 0, 0, pt, 2);
			pt.setRatio = _setClassNameRatio;
			pt.pr = -11;
			_hasPriority = true;
			pt.b = b;
			bs = _getAllStyles(t, _cs);
			//if there's a className tween already operating on the target, force it to its end so that the necessary inline styles are removed and the class name is applied before we determine the end state (we don't want inline styles interfering that were there just for class-specific values)
			cnpt = t._gsClassPT;
			if (cnpt) {
				cnptLookup = {};
				mpt = cnpt.data; //first MiniPropTween which stores the inline styles - we need to force these so that the inline styles don't contaminate things. Otherwise, there's a small chance that a tween could start and the inline values match the destination values and they never get cleaned.
				while (mpt) {
					cnptLookup[mpt.p] = 1;
					mpt = mpt._next;
				}
				cnpt.setRatio(1);
			}
			t._gsClassPT = pt;
			pt.e = (e.charAt(1) !== "=") ? e : b.replace(new RegExp("\\s*\\b" + e.substr(2) + "\\b"), "") + ((e.charAt(0) === "+") ? " " + e.substr(2) : "");
			if (cssp._tween._duration) { //if it's a zero-duration tween, there's no need to tween anything or parse the data. In fact, if we switch classes temporarily (which we must do for proper parsing) and the class has a transition applied, it could cause a quick flash to the end state and back again initially in some browsers.
				t.className = pt.e;
				difData = _cssDif(t, bs, _getAllStyles(t), vars, cnptLookup);
				t.className = b;
				pt.data = difData.firstMPT;
				t.style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
				pt = pt.xfirst = cssp.parse(t, difData.difs, pt, plugin); //we record the CSSPropTween as the xfirst so that we can handle overwriting propertly (if "className" gets overwritten, we must kill all the properties associated with the className part of the tween, so we can loop through from xfirst to the pt itself)
			}
			return pt;
		}});


		var _setClearPropsRatio = function(v) {
			if (v === 1 || v === 0) if (this.data._totalTime === this.data._totalDuration) { //this.data refers to the tween. Only clear at the END of the tween (remember, from() tweens make the ratio go from 1 to 0, so we can't just check that).
				var all = (this.e === "all"),
					s = this.t.style,
					a = all ? s.cssText.split(";") : this.e.split(","),
					i = a.length,
					transformParse = _specialProps.transform.parse,
					p;
				while (--i > -1) {
					p = a[i];
					if (all) {
						p = p.substr(0, p.indexOf(":")).split(" ").join("");
					}
					if (_specialProps[p]) {
						p = (_specialProps[p].parse === transformParse) ? _transformProp : _specialProps[p].p; //ensures that special properties use the proper browser-specific property name, like "scaleX" might be "-webkit-transform" or "boxShadow" might be "-moz-box-shadow"
					}
					_removeProp(s, p);
				}
			}
		};
		_registerComplexSpecialProp("clearProps", {parser:function(t, e, p, cssp, pt) {
			pt = new CSSPropTween(t, p, 0, 0, pt, 2);
			pt.setRatio = _setClearPropsRatio;
			pt.e = e;
			pt.pr = -10;
			pt.data = cssp._tween;
			_hasPriority = true;
			return pt;
		}});

		p = "bezier,throwProps,physicsProps,physics2D".split(",");
		i = p.length;
		while (i--) {
			_registerPluginProp(p[i]);
		}








		p = CSSPlugin.prototype;
		p._firstPT = null;

		//gets called when the tween renders for the first time. This kicks everything off, recording start/end values, etc.
		p._onInitTween = function(target, vars, tween) {
			if (!target.nodeType) { //css is only for dom elements
				return false;
			}
			this._target = target;
			this._tween = tween;
			this._vars = vars;
			_autoRound = vars.autoRound;
			_hasPriority = false;
			_suffixMap = vars.suffixMap || CSSPlugin.suffixMap;
			_cs = _getComputedStyle(target, "");
			_overwriteProps = this._overwriteProps;
			var style = target.style,
				v, pt, pt2, first, last, next, zIndex, tpt, threeD;

			if (_reqSafariFix) if (style.zIndex === "") {
				v = _getStyle(target, "zIndex", _cs);
				if (v === "auto" || v === "") {
					//corrects a bug in [non-Android] Safari that prevents it from repainting elements in their new positions if they don't have a zIndex set. We also can't just apply this inside _parseTransform() because anything that's moved in any way (like using "left" or "top" instead of transforms like "x" and "y") can be affected, so it is best to ensure that anything that's tweening has a z-index. Setting "WebkitPerspective" to a non-zero value worked too except that on iOS Safari things would flicker randomly. Plus zIndex is less memory-intensive.
					style.zIndex = 0;
				}
			}

			if (typeof(vars) === "string") {
				first = style.cssText;
				v = _getAllStyles(target, _cs);
				style.cssText = first + ";" + vars;
				v = _cssDif(target, v, _getAllStyles(target)).difs;
				if (!_supportsOpacity && _opacityValExp.test(vars)) {
					v.opacity = parseFloat( RegExp.$1 );
				}
				vars = v;
				style.cssText = first;
			}
			this._firstPT = pt = this.parse(target, vars, null);

			if (this._transformType) {
				threeD = (this._transformType === 3);
				if (!_transformProp) {
					style.zoom = 1; //helps correct an IE issue.
				} else if (_isSafari) {
					_reqSafariFix = true;
					//if zIndex isn't set, iOS Safari doesn't repaint things correctly sometimes (seemingly at random).
					if (style.zIndex === "") {
						zIndex = _getStyle(target, "zIndex", _cs);
						if (zIndex === "auto" || zIndex === "") {
							style.zIndex = 0;
						}
					}
					//Setting WebkitBackfaceVisibility corrects 3 bugs:
					// 1) [non-Android] Safari skips rendering changes to "top" and "left" that are made on the same frame/render as a transform update.
					// 2) iOS Safari sometimes neglects to repaint elements in their new positions. Setting "WebkitPerspective" to a non-zero value worked too except that on iOS Safari things would flicker randomly.
					// 3) Safari sometimes displayed odd artifacts when tweening the transform (or WebkitTransform) property, like ghosts of the edges of the element remained. Definitely a browser bug.
					//Note: we allow the user to override the auto-setting by defining WebkitBackfaceVisibility in the vars of the tween.
					if (_isSafariLT6) {
						style.WebkitBackfaceVisibility = this._vars.WebkitBackfaceVisibility || (threeD ? "visible" : "hidden");
					}
				}
				pt2 = pt;
				while (pt2 && pt2._next) {
					pt2 = pt2._next;
				}
				tpt = new CSSPropTween(target, "transform", 0, 0, null, 2);
				this._linkCSSP(tpt, null, pt2);
				tpt.setRatio = (threeD && _supports3D) ? _set3DTransformRatio : _transformProp ? _set2DTransformRatio : _setIETransformRatio;
				tpt.data = this._transform || _getTransform(target, _cs, true);
				_overwriteProps.pop(); //we don't want to force the overwrite of all "transform" tweens of the target - we only care about individual transform properties like scaleX, rotation, etc. The CSSPropTween constructor automatically adds the property to _overwriteProps which is why we need to pop() here.
			}

			if (_hasPriority) {
				//reorders the linked list in order of pr (priority)
				while (pt) {
					next = pt._next;
					pt2 = first;
					while (pt2 && pt2.pr > pt.pr) {
						pt2 = pt2._next;
					}
					if ((pt._prev = pt2 ? pt2._prev : last)) {
						pt._prev._next = pt;
					} else {
						first = pt;
					}
					if ((pt._next = pt2)) {
						pt2._prev = pt;
					} else {
						last = pt;
					}
					pt = next;
				}
				this._firstPT = first;
			}
			return true;
		};


		p.parse = function(target, vars, pt, plugin) {
			var style = target.style,
				p, sp, bn, en, bs, es, bsfx, esfx, isStr, rel;
			for (p in vars) {
				es = vars[p]; //ending value string
				sp = _specialProps[p]; //SpecialProp lookup.
				if (sp) {
					pt = sp.parse(target, es, p, this, pt, plugin, vars);

				} else {
					bs = _getStyle(target, p, _cs) + "";
					isStr = (typeof(es) === "string");
					if (p === "color" || p === "fill" || p === "stroke" || p.indexOf("Color") !== -1 || (isStr && _rgbhslExp.test(es))) { //Opera uses background: to define color sometimes in addition to backgroundColor:
						if (!isStr) {
							es = _parseColor(es);
							es = ((es.length > 3) ? "rgba(" : "rgb(") + es.join(",") + ")";
						}
						pt = _parseComplex(style, p, bs, es, true, "transparent", pt, 0, plugin);

					} else if (isStr && (es.indexOf(" ") !== -1 || es.indexOf(",") !== -1)) {
						pt = _parseComplex(style, p, bs, es, true, null, pt, 0, plugin);

					} else {
						bn = parseFloat(bs);
						bsfx = (bn || bn === 0) ? bs.substr((bn + "").length) : ""; //remember, bs could be non-numeric like "normal" for fontWeight, so we should default to a blank suffix in that case.

						if (bs === "" || bs === "auto") {
							if (p === "width" || p === "height") {
								bn = _getDimension(target, p, _cs);
								bsfx = "px";
							} else if (p === "left" || p === "top") {
								bn = _calculateOffset(target, p, _cs);
								bsfx = "px";
							} else {
								bn = (p !== "opacity") ? 0 : 1;
								bsfx = "";
							}
						}

						rel = (isStr && es.charAt(1) === "=");
						if (rel) {
							en = parseInt(es.charAt(0) + "1", 10);
							es = es.substr(2);
							en *= parseFloat(es);
							esfx = es.replace(_suffixExp, "");
						} else {
							en = parseFloat(es);
							esfx = isStr ? es.substr((en + "").length) || "" : "";
						}

						if (esfx === "") {
							esfx = _suffixMap[p] || bsfx; //populate the end suffix, prioritizing the map, then if none is found, use the beginning suffix.
						}

						es = (en || en === 0) ? (rel ? en + bn : en) + esfx : vars[p]; //ensures that any += or -= prefixes are taken care of. Record the end value before normalizing the suffix because we always want to end the tween on exactly what they intended even if it doesn't match the beginning value's suffix.

						//if the beginning/ending suffixes don't match, normalize them...
						if (bsfx !== esfx) if (esfx !== "") if (en || en === 0) if (bn || bn === 0) {
							bn = _convertToPixels(target, p, bn, bsfx);
							if (esfx === "%") {
								bn /= _convertToPixels(target, p, 100, "%") / 100;
								if (bn > 100) { //extremely rare
									bn = 100;
								}
								if (vars.strictUnits !== true) { //some browsers report only "px" values instead of allowing "%" with getComputedStyle(), so we assume that if we're tweening to a %, we should start there too unless strictUnits:true is defined. This approach is particularly useful for responsive designs that use from() tweens.
									bs = bn + "%";
								}

							} else if (esfx === "em") {
								bn /= _convertToPixels(target, p, 1, "em");

							//otherwise convert to pixels.
							} else {
								en = _convertToPixels(target, p, en, esfx);
								esfx = "px"; //we don't use bsfx after this, so we don't need to set it to px too.
							}
							if (rel) if (en || en === 0) {
								es = (en + bn) + esfx; //the changes we made affect relative calculations, so adjust the end value here.
							}
						}

						if (rel) {
							en += bn;
						}

						if ((bn || bn === 0) && (en || en === 0)) { //faster than isNaN(). Also, previously we required en !== bn but that doesn't really gain much performance and it prevents _parseToProxy() from working properly if beginning and ending values match but need to get tweened by an external plugin anyway. For example, a bezier tween where the target starts at left:0 and has these points: [{left:50},{left:0}] wouldn't work properly because when parsing the last point, it'd match the first (current) one and a non-tweening CSSPropTween would be recorded when we actually need a normal tween (type:0) so that things get updated during the tween properly.
							pt = new CSSPropTween(style, p, bn, en - bn, pt, 0, "css_" + p, (_autoRound !== false && (esfx === "px" || p === "zIndex")), 0, bs, es);
							pt.xs0 = esfx;
							//DEBUG: _log("tween "+p+" from "+pt.b+" ("+bn+esfx+") to "+pt.e+" with suffix: "+pt.xs0);
						} else if (style[p] === undefined || !es && (es + "" === "NaN" || es == null)) {
							_log("invalid " + p + " tween value: " + vars[p]);
						} else {
							pt = new CSSPropTween(style, p, en || bn || 0, 0, pt, -1, "css_" + p, false, 0, bs, es);
							pt.xs0 = (es === "none" && (p === "display" || p.indexOf("Style") !== -1)) ? bs : es; //intermediate value should typically be set immediately (end value) except for "display" or things like borderTopStyle, borderBottomStyle, etc. which should use the beginning value during the tween.
							//DEBUG: _log("non-tweening value "+p+": "+pt.xs0);
						}
					}
				}
				if (plugin) if (pt && !pt.plugin) {
					pt.plugin = plugin;
				}
			}
			return pt;
		};


		//gets called every time the tween updates, passing the new ratio (typically a value between 0 and 1, but not always (for example, if an Elastic.easeOut is used, the value can jump above 1 mid-tween). It will always start and 0 and end at 1.
		p.setRatio = function(v) {
			var pt = this._firstPT,
				min = 0.000001,
				val, str, i;

			//at the end of the tween, we set the values to exactly what we received in order to make sure non-tweening values (like "position" or "float" or whatever) are set and so that if the beginning/ending suffixes (units) didn't match and we normalized to px, the value that the user passed in is used here. We check to see if the tween is at its beginning in case it's a from() tween in which case the ratio will actually go from 1 to 0 over the course of the tween (backwards).
			if (v === 1 && (this._tween._time === this._tween._duration || this._tween._time === 0)) {
				while (pt) {
					if (pt.type !== 2) {
						pt.t[pt.p] = pt.e;
					} else {
						pt.setRatio(v);
					}
					pt = pt._next;
				}

			} else if (v || !(this._tween._time === this._tween._duration || this._tween._time === 0) || this._tween._rawPrevTime === -0.000001) {
				while (pt) {
					val = pt.c * v + pt.s;
					if (pt.r) {
						val = (val > 0) ? (val + 0.5) | 0 : (val - 0.5) | 0;
					} else if (val < min) if (val > -min) {
						val = 0;
					}
					if (!pt.type) {
						pt.t[pt.p] = val + pt.xs0;
					} else if (pt.type === 1) { //complex value (one that typically has multiple numbers inside a string, like "rect(5px,10px,20px,25px)"
						i = pt.l;
						if (i === 2) {
							pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2;
						} else if (i === 3) {
							pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3;
						} else if (i === 4) {
							pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3 + pt.xn3 + pt.xs4;
						} else if (i === 5) {
							pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3 + pt.xn3 + pt.xs4 + pt.xn4 + pt.xs5;
						} else {
							str = pt.xs0 + val + pt.xs1;
							for (i = 1; i < pt.l; i++) {
								str += pt["xn"+i] + pt["xs"+(i+1)];
							}
							pt.t[pt.p] = str;
						}

					} else if (pt.type === -1) { //non-tweening value
						pt.t[pt.p] = pt.xs0;

					} else if (pt.setRatio) { //custom setRatio() for things like SpecialProps, external plugins, etc.
						pt.setRatio(v);
					}
					pt = pt._next;
				}

			//if the tween is reversed all the way back to the beginning, we need to restore the original values which may have different units (like % instead of px or em or whatever).
			} else {
				while (pt) {
					if (pt.type !== 2) {
						pt.t[pt.p] = pt.b;
					} else {
						pt.setRatio(v);
					}
					pt = pt._next;
				}
			}
		};

		/**
		 * @private
		 * Forces rendering of the target's transforms (rotation, scale, etc.) whenever the CSSPlugin's setRatio() is called.
		 * Basically, this tells the CSSPlugin to create a CSSPropTween (type 2) after instantiation that runs last in the linked
		 * list and calls the appropriate (3D or 2D) rendering function. We separate this into its own method so that we can call
		 * it from other plugins like BezierPlugin if, for example, it needs to apply an autoRotation and this CSSPlugin
		 * doesn't have any transform-related properties of its own. You can call this method as many times as you
		 * want and it won't create duplicate CSSPropTweens.
		 *
		 * @param {boolean} threeD if true, it should apply 3D tweens (otherwise, just 2D ones are fine and typically faster)
		 */
		p._enableTransforms = function(threeD) {
			this._transformType = (threeD || this._transformType === 3) ? 3 : 2;
		};

		/** @private **/
		p._linkCSSP = function(pt, next, prev, remove) {
			if (pt) {
				if (next) {
					next._prev = pt;
				}
				if (pt._next) {
					pt._next._prev = pt._prev;
				}
				if (prev) {
					prev._next = pt;
				} else if (!remove && this._firstPT === null) {
					this._firstPT = pt;
				}
				if (pt._prev) {
					pt._prev._next = pt._next;
				} else if (this._firstPT === pt) {
					this._firstPT = pt._next;
				}
				pt._next = next;
				pt._prev = prev;
			}
			return pt;
		};

		//we need to make sure that if alpha or autoAlpha is killed, opacity is too. And autoAlpha affects the "visibility" property.
		p._kill = function(lookup) {
			var copy = lookup,
				pt, p, xfirst;
			if (lookup.css_autoAlpha || lookup.css_alpha) {
				copy = {};
				for (p in lookup) { //copy the lookup so that we're not changing the original which may be passed elsewhere.
					copy[p] = lookup[p];
				}
				copy.css_opacity = 1;
				if (copy.css_autoAlpha) {
					copy.css_visibility = 1;
				}
			}
			if (lookup.css_className && (pt = this._classNamePT)) { //for className tweens, we need to kill any associated CSSPropTweens too; a linked list starts at the className's "xfirst".
				xfirst = pt.xfirst;
				if (xfirst && xfirst._prev) {
					this._linkCSSP(xfirst._prev, pt._next, xfirst._prev._prev); //break off the prev
				} else if (xfirst === this._firstPT) {
					this._firstPT = pt._next;
				}
				if (pt._next) {
					this._linkCSSP(pt._next, pt._next._next, xfirst._prev);
				}
				this._classNamePT = null;
			}
			return TweenPlugin.prototype._kill.call(this, copy);
		};




		//used by cascadeTo() for gathering all the style properties of each child element into an array for comparison.
		var _getChildStyles = function(e, props, targets) {
				var children, i, child, type;
				if (e.slice) {
					i = e.length;
					while (--i > -1) {
						_getChildStyles(e[i], props, targets);
					}
					return;
				}
				children = e.childNodes;
				i = children.length;
				while (--i > -1) {
					child = children[i];
					type = child.type;
					if (child.style) {
						props.push(_getAllStyles(child));
						if (targets) {
							targets.push(child);
						}
					}
					if ((type === 1 || type === 9 || type === 11) && child.childNodes.length) {
						_getChildStyles(child, props, targets);
					}
				}
			};

		/**
		 * Typically only useful for className tweens that may affect child elements, this method creates a TweenLite
		 * and then compares the style properties of all the target's child elements at the tween's start and end, and
		 * if any are different, it also creates tweens for those and returns an array containing ALL of the resulting
		 * tweens (so that you can easily add() them to a TimelineLite, for example). The reason this functionality is
		 * wrapped into a separate static method of CSSPlugin instead of being integrated into all regular className tweens
		 * is because it creates entirely new tweens that may have completely different targets than the original tween,
		 * so if they were all lumped into the original tween instance, it would be inconsistent with the rest of the API
		 * and it would create other problems. For example:
		 *  - If I create a tween of elementA, that tween instance may suddenly change its target to include 50 other elements (unintuitive if I specifically defined the target I wanted)
		 *  - We can't just create new independent tweens because otherwise, what happens if the original/parent tween is reversed or pause or dropped into a TimelineLite for tight control? You'd expect that tween's behavior to affect all the others.
		 *  - Analyzing every style property of every child before and after the tween is an expensive operation when there are many children, so this behavior shouldn't be imposed on all className tweens by default, especially since it's probably rare that this extra functionality is needed.
		 *
		 * @param {Object} target object to be tweened
		 * @param {number} Duration in seconds (or frames for frames-based tweens)
		 * @param {Object} Object containing the end values, like {className:"newClass", ease:Linear.easeNone}
		 * @return {Array} An array of TweenLite instances
		 */
		CSSPlugin.cascadeTo = function(target, duration, vars) {
			var tween = TweenLite.to(target, duration, vars),
				results = [tween],
				b = [],
				e = [],
				targets = [],
				_reservedProps = TweenLite._internals.reservedProps,
				i, difs, p;
			target = tween._targets || tween.target;
			_getChildStyles(target, b, targets);
			tween.render(duration, true);
			_getChildStyles(target, e);
			tween.render(0, true);
			tween._enabled(true);
			i = targets.length;
			while (--i > -1) {
				difs = _cssDif(targets[i], b[i], e[i]);
				if (difs.firstMPT) {
					difs = difs.difs;
					for (p in vars) {
						if (_reservedProps[p]) {
							difs[p] = vars[p];
						}
					}
					results.push( TweenLite.to(targets[i], duration, difs) );
				}
			}
			return results;
		};


		TweenPlugin.activate([CSSPlugin]);
		return CSSPlugin;

	}, true);

	
	
	
	
	
	
	
	
	
	
/*
 * ----------------------------------------------------------------
 * RoundPropsPlugin
 * ----------------------------------------------------------------
 */
	(function() {

		var RoundPropsPlugin = window._gsDefine.plugin({
				propName: "roundProps",
				priority: -1,
				API: 2,

				//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
				init: function(target, value, tween) {
					this._tween = tween;
					return true;
				}

			}),
			p = RoundPropsPlugin.prototype;

		p._onInitAllProps = function() {
			var tween = this._tween,
				rp = (tween.vars.roundProps instanceof Array) ? tween.vars.roundProps : tween.vars.roundProps.split(","),
				i = rp.length,
				lookup = {},
				rpt = tween._propLookup.roundProps,
				prop, pt, next;
			while (--i > -1) {
				lookup[rp[i]] = 1;
			}
			i = rp.length;
			while (--i > -1) {
				prop = rp[i];
				pt = tween._firstPT;
				while (pt) {
					next = pt._next; //record here, because it may get removed
					if (pt.pg) {
						pt.t._roundProps(lookup, true);
					} else if (pt.n === prop) {
						this._add(pt.t, prop, pt.s, pt.c);
						//remove from linked list
						if (next) {
							next._prev = pt._prev;
						}
						if (pt._prev) {
							pt._prev._next = next;
						} else if (tween._firstPT === pt) {
							tween._firstPT = next;
						}
						pt._next = pt._prev = null;
						tween._propLookup[prop] = rpt;
					}
					pt = next;
				}
			}
			return false;
		};

		p._add = function(target, p, s, c) {
			this._addTween(target, p, s, s + c, p, true);
			this._overwriteProps.push(p);
		};

	}());










/*
 * ----------------------------------------------------------------
 * AttrPlugin
 * ----------------------------------------------------------------
 */
	window._gsDefine.plugin({
		propName: "attr",
		API: 2,

		//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
		init: function(target, value, tween) {
			var p;
			if (typeof(target.setAttribute) !== "function") {
				return false;
			}
			this._target = target;
			this._proxy = {};
			for (p in value) {
				this._addTween(this._proxy, p, parseFloat(target.getAttribute(p)), value[p], p);
				this._overwriteProps.push(p);
			}
			return true;
		},

		//called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
		set: function(ratio) {
			this._super.setRatio.call(this, ratio);
			var props = this._overwriteProps,
				i = props.length,
				p;
			while (--i > -1) {
				p = props[i];
				this._target.setAttribute(p, this._proxy[p] + "");
			}
		}

	});










/*
 * ----------------------------------------------------------------
 * DirectionalRotationPlugin
 * ----------------------------------------------------------------
 */
	window._gsDefine.plugin({
		propName: "directionalRotation",
		API: 2,

		//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
		init: function(target, value, tween) {
			if (typeof(value) !== "object") {
				value = {rotation:value};
			}
			this.finals = {};
			var cap = (value.useRadians === true) ? Math.PI * 2 : 360,
				min = 0.000001,
				p, v, start, end, dif, split;
			for (p in value) {
				if (p !== "useRadians") {
					split = (value[p] + "").split("_");
					v = split[0];
					start = parseFloat( (typeof(target[p]) !== "function") ? target[p] : target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ]() );
					end = this.finals[p] = (typeof(v) === "string" && v.charAt(1) === "=") ? start + parseInt(v.charAt(0) + "1", 10) * Number(v.substr(2)) : Number(v) || 0;
					dif = end - start;
					if (split.length) {
						v = split.join("_");
						if (v.indexOf("short") !== -1) {
							dif = dif % cap;
							if (dif !== dif % (cap / 2)) {
								dif = (dif < 0) ? dif + cap : dif - cap;
							}
						}
						if (v.indexOf("_cw") !== -1 && dif < 0) {
							dif = ((dif + cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
						} else if (v.indexOf("ccw") !== -1 && dif > 0) {
							dif = ((dif - cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
						}
					}
					if (dif > min || dif < -min) {
						this._addTween(target, p, start, start + dif, p);
						this._overwriteProps.push(p);
					}
				}
			}
			return true;
		},

		//called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
		set: function(ratio) {
			var pt;
			if (ratio !== 1) {
				this._super.setRatio.call(this, ratio);
			} else {
				pt = this._firstPT;
				while (pt) {
					if (pt.f) {
						pt.t[pt.p](this.finals[pt.p]);
					} else {
						pt.t[pt.p] = this.finals[pt.p];
					}
					pt = pt._next;
				}
			}
		}

	})._autoCSS = true;







	
	
	
	
/*
 * ----------------------------------------------------------------
 * EasePack
 * ----------------------------------------------------------------
 */
	window._gsDefine("easing.Back", ["easing.Ease"], function(Ease) {
		
		var w = (window.GreenSockGlobals || window),
			gs = w.com.greensock,
			_2PI = Math.PI * 2,
			_HALF_PI = Math.PI / 2,
			_class = gs._class,
			_create = function(n, f) {
				var C = _class("easing." + n, function(){}, true),
					p = C.prototype = new Ease();
				p.constructor = C;
				p.getRatio = f;
				return C;
			},
			_easeReg = Ease.register || function(){}, //put an empty function in place just as a safety measure in case someone loads an OLD version of TweenLite.js where Ease.register doesn't exist.
			_wrap = function(name, EaseOut, EaseIn, EaseInOut, aliases) {
				var C = _class("easing."+name, {
					easeOut:new EaseOut(),
					easeIn:new EaseIn(),
					easeInOut:new EaseInOut()
				}, true);
				_easeReg(C, name);
				return C;
			},
			EasePoint = function(time, value, next) {
				this.t = time;
				this.v = value;
				if (next) {
					this.next = next;
					next.prev = this;
					this.c = next.v - value;
					this.gap = next.t - time;
				}
			},

			//Back
			_createBack = function(n, f) {
				var C = _class("easing." + n, function(overshoot) {
						this._p1 = (overshoot || overshoot === 0) ? overshoot : 1.70158;
						this._p2 = this._p1 * 1.525;
					}, true),
					p = C.prototype = new Ease();
				p.constructor = C;
				p.getRatio = f;
				p.config = function(overshoot) {
					return new C(overshoot);
				};
				return C;
			},

			Back = _wrap("Back",
				_createBack("BackOut", function(p) {
					return ((p = p - 1) * p * ((this._p1 + 1) * p + this._p1) + 1);
				}),
				_createBack("BackIn", function(p) {
					return p * p * ((this._p1 + 1) * p - this._p1);
				}),
				_createBack("BackInOut", function(p) {
					return ((p *= 2) < 1) ? 0.5 * p * p * ((this._p2 + 1) * p - this._p2) : 0.5 * ((p -= 2) * p * ((this._p2 + 1) * p + this._p2) + 2);
				})
			),


			//SlowMo
			SlowMo = _class("easing.SlowMo", function(linearRatio, power, yoyoMode) {
				power = (power || power === 0) ? power : 0.7;
				if (linearRatio == null) {
					linearRatio = 0.7;
				} else if (linearRatio > 1) {
					linearRatio = 1;
				}
				this._p = (linearRatio !== 1) ? power : 0;
				this._p1 = (1 - linearRatio) / 2;
				this._p2 = linearRatio;
				this._p3 = this._p1 + this._p2;
				this._calcEnd = (yoyoMode === true);
			}, true),
			p = SlowMo.prototype = new Ease(),
			SteppedEase, RoughEase, _createElastic;

		p.constructor = SlowMo;
		p.getRatio = function(p) {
			var r = p + (0.5 - p) * this._p;
			if (p < this._p1) {
				return this._calcEnd ? 1 - ((p = 1 - (p / this._p1)) * p) : r - ((p = 1 - (p / this._p1)) * p * p * p * r);
			} else if (p > this._p3) {
				return this._calcEnd ? 1 - (p = (p - this._p3) / this._p1) * p : r + ((p - r) * (p = (p - this._p3) / this._p1) * p * p * p);
			}
			return this._calcEnd ? 1 : r;
		};
		SlowMo.ease = new SlowMo(0.7, 0.7);

		p.config = SlowMo.config = function(linearRatio, power, yoyoMode) {
			return new SlowMo(linearRatio, power, yoyoMode);
		};


		//SteppedEase
		SteppedEase = _class("easing.SteppedEase", function(steps) {
				steps = steps || 1;
				this._p1 = 1 / steps;
				this._p2 = steps + 1;
			}, true);
		p = SteppedEase.prototype = new Ease();
		p.constructor = SteppedEase;
		p.getRatio = function(p) {
			if (p < 0) {
				p = 0;
			} else if (p >= 1) {
				p = 0.999999999;
			}
			return ((this._p2 * p) >> 0) * this._p1;
		};
		p.config = SteppedEase.config = function(steps) {
			return new SteppedEase(steps);
		};


		//RoughEase
		RoughEase = _class("easing.RoughEase", function(vars) {
			vars = vars || {};
			var taper = vars.taper || "none",
				a = [],
				cnt = 0,
				points = (vars.points || 20) | 0,
				i = points,
				randomize = (vars.randomize !== false),
				clamp = (vars.clamp === true),
				template = (vars.template instanceof Ease) ? vars.template : null,
				strength = (typeof(vars.strength) === "number") ? vars.strength * 0.4 : 0.4,
				x, y, bump, invX, obj, pnt;
			while (--i > -1) {
				x = randomize ? Math.random() : (1 / points) * i;
				y = template ? template.getRatio(x) : x;
				if (taper === "none") {
					bump = strength;
				} else if (taper === "out") {
					invX = 1 - x;
					bump = invX * invX * strength;
				} else if (taper === "in") {
					bump = x * x * strength;
				} else if (x < 0.5) {  //"both" (start)
					invX = x * 2;
					bump = invX * invX * 0.5 * strength;
				} else {				//"both" (end)
					invX = (1 - x) * 2;
					bump = invX * invX * 0.5 * strength;
				}
				if (randomize) {
					y += (Math.random() * bump) - (bump * 0.5);
				} else if (i % 2) {
					y += bump * 0.5;
				} else {
					y -= bump * 0.5;
				}
				if (clamp) {
					if (y > 1) {
						y = 1;
					} else if (y < 0) {
						y = 0;
					}
				}
				a[cnt++] = {x:x, y:y};
			}
			a.sort(function(a, b) {
				return a.x - b.x;
			});

			pnt = new EasePoint(1, 1, null);
			i = points;
			while (--i > -1) {
				obj = a[i];
				pnt = new EasePoint(obj.x, obj.y, pnt);
			}

			this._prev = new EasePoint(0, 0, (pnt.t !== 0) ? pnt : pnt.next);
		}, true);
		p = RoughEase.prototype = new Ease();
		p.constructor = RoughEase;
		p.getRatio = function(p) {
			var pnt = this._prev;
			if (p > pnt.t) {
				while (pnt.next && p >= pnt.t) {
					pnt = pnt.next;
				}
				pnt = pnt.prev;
			} else {
				while (pnt.prev && p <= pnt.t) {
					pnt = pnt.prev;
				}
			}
			this._prev = pnt;
			return (pnt.v + ((p - pnt.t) / pnt.gap) * pnt.c);
		};
		p.config = function(vars) {
			return new RoughEase(vars);
		};
		RoughEase.ease = new RoughEase();


		//Bounce
		_wrap("Bounce",
			_create("BounceOut", function(p) {
				if (p < 1 / 2.75) {
					return 7.5625 * p * p;
				} else if (p < 2 / 2.75) {
					return 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
				} else if (p < 2.5 / 2.75) {
					return 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
				}
				return 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
			}),
			_create("BounceIn", function(p) {
				if ((p = 1 - p) < 1 / 2.75) {
					return 1 - (7.5625 * p * p);
				} else if (p < 2 / 2.75) {
					return 1 - (7.5625 * (p -= 1.5 / 2.75) * p + 0.75);
				} else if (p < 2.5 / 2.75) {
					return 1 - (7.5625 * (p -= 2.25 / 2.75) * p + 0.9375);
				}
				return 1 - (7.5625 * (p -= 2.625 / 2.75) * p + 0.984375);
			}),
			_create("BounceInOut", function(p) {
				var invert = (p < 0.5);
				if (invert) {
					p = 1 - (p * 2);
				} else {
					p = (p * 2) - 1;
				}
				if (p < 1 / 2.75) {
					p = 7.5625 * p * p;
				} else if (p < 2 / 2.75) {
					p = 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
				} else if (p < 2.5 / 2.75) {
					p = 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
				} else {
					p = 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
				}
				return invert ? (1 - p) * 0.5 : p * 0.5 + 0.5;
			})
		);


		//CIRC
		_wrap("Circ",
			_create("CircOut", function(p) {
				return Math.sqrt(1 - (p = p - 1) * p);
			}),
			_create("CircIn", function(p) {
				return -(Math.sqrt(1 - (p * p)) - 1);
			}),
			_create("CircInOut", function(p) {
				return ((p*=2) < 1) ? -0.5 * (Math.sqrt(1 - p * p) - 1) : 0.5 * (Math.sqrt(1 - (p -= 2) * p) + 1);
			})
		);


		//Elastic
		_createElastic = function(n, f, def) {
			var C = _class("easing." + n, function(amplitude, period) {
					this._p1 = amplitude || 1;
					this._p2 = period || def;
					this._p3 = this._p2 / _2PI * (Math.asin(1 / this._p1) || 0);
				}, true),
				p = C.prototype = new Ease();
			p.constructor = C;
			p.getRatio = f;
			p.config = function(amplitude, period) {
				return new C(amplitude, period);
			};
			return C;
		};
		_wrap("Elastic",
			_createElastic("ElasticOut", function(p) {
				return this._p1 * Math.pow(2, -10 * p) * Math.sin( (p - this._p3) * _2PI / this._p2 ) + 1;
			}, 0.3),
			_createElastic("ElasticIn", function(p) {
				return -(this._p1 * Math.pow(2, 10 * (p -= 1)) * Math.sin( (p - this._p3) * _2PI / this._p2 ));
			}, 0.3),
			_createElastic("ElasticInOut", function(p) {
				return ((p *= 2) < 1) ? -0.5 * (this._p1 * Math.pow(2, 10 * (p -= 1)) * Math.sin( (p - this._p3) * _2PI / this._p2)) : this._p1 * Math.pow(2, -10 *(p -= 1)) * Math.sin( (p - this._p3) * _2PI / this._p2 ) *0.5 + 1;
			}, 0.45)
		);


		//Expo
		_wrap("Expo",
			_create("ExpoOut", function(p) {
				return 1 - Math.pow(2, -10 * p);
			}),
			_create("ExpoIn", function(p) {
				return Math.pow(2, 10 * (p - 1)) - 0.001;
			}),
			_create("ExpoInOut", function(p) {
				return ((p *= 2) < 1) ? 0.5 * Math.pow(2, 10 * (p - 1)) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
			})
		);


		//Sine
		_wrap("Sine",
			_create("SineOut", function(p) {
				return Math.sin(p * _HALF_PI);
			}),
			_create("SineIn", function(p) {
				return -Math.cos(p * _HALF_PI) + 1;
			}),
			_create("SineInOut", function(p) {
				return -0.5 * (Math.cos(Math.PI * p) - 1);
			})
		);

		_class("easing.EaseLookup", {
				find:function(s) {
					return Ease.map[s];
				}
			}, true);

		//register the non-standard eases
		_easeReg(w.SlowMo, "SlowMo", "ease,");
		_easeReg(RoughEase, "RoughEase", "ease,");
		_easeReg(SteppedEase, "SteppedEase", "ease,");

		return Back;
		
	}, true);


}); 











/*
 * ----------------------------------------------------------------
 * Base classes like TweenLite, SimpleTimeline, Ease, Ticker, etc.
 * ----------------------------------------------------------------
 */
(function(window) {

		"use strict";
		var _globals = window.GreenSockGlobals || window,
			_namespace = function(ns) {
				var a = ns.split("."),
					p = _globals, i;
				for (i = 0; i < a.length; i++) {
					p[a[i]] = p = p[a[i]] || {};
				}
				return p;
			},
			gs = _namespace("com.greensock"),
			_slice = [].slice,
			_emptyFunc = function() {},
			a, i, p, _ticker, _tickerActive,
			_defLookup = {},

			/**
			 * @constructor
			 * Defines a GreenSock class, optionally with an array of dependencies that must be instantiated first and passed into the definition.
			 * This allows users to load GreenSock JS files in any order even if they have interdependencies (like CSSPlugin extends TweenPlugin which is
			 * inside TweenLite.js, but if CSSPlugin is loaded first, it should wait to run its code until TweenLite.js loads and instantiates TweenPlugin
			 * and then pass TweenPlugin to CSSPlugin's definition). This is all done automatically and internally.
			 *
			 * Every definition will be added to a "com.greensock" global object (typically window, but if a window.GreenSockGlobals object is found,
			 * it will go there as of v1.7). For example, TweenLite will be found at window.com.greensock.TweenLite and since it's a global class that should be available anywhere,
			 * it is ALSO referenced at window.TweenLite. However some classes aren't considered global, like the base com.greensock.core.Animation class, so
			 * those will only be at the package like window.com.greensock.core.Animation. Again, if you define a GreenSockGlobals object on the window, everything
			 * gets tucked neatly inside there instead of on the window directly. This allows you to do advanced things like load multiple versions of GreenSock
			 * files and put them into distinct objects (imagine a banner ad uses a newer version but the main site uses an older one). In that case, you could
			 * sandbox the banner one like:
			 *
			 * <script>
			 *     var gs = window.GreenSockGlobals = {}; //the newer version we're about to load could now be referenced in a "gs" object, like gs.TweenLite.to(...). Use whatever alias you want as long as it's unique, "gs" or "banner" or whatever.
			 * </script>
			 * <script src="js/greensock/v1.7/TweenMax.js"></script>
			 * <script>
			 *     window.GreenSockGlobals = null; //reset it back to null so that the next load of TweenMax affects the window and we can reference things directly like TweenLite.to(...)
			 * </script>
			 * <script src="js/greensock/v1.6/TweenMax.js"></script>
			 * <script>
			 *     gs.TweenLite.to(...); //would use v1.7
			 *     TweenLite.to(...); //would use v1.6
			 * </script>
			 *
			 * @param {!string} ns The namespace of the class definition, leaving off "com.greensock." as that's assumed. For example, "TweenLite" or "plugins.CSSPlugin" or "easing.Back".
			 * @param {!Array.<string>} dependencies An array of dependencies (described as their namespaces minus "com.greensock." prefix). For example ["TweenLite","plugins.TweenPlugin","core.Animation"]
			 * @param {!function():Object} func The function that should be called and passed the resolved dependencies which will return the actual class for this definition.
			 * @param {boolean=} global If true, the class will be added to the global scope (typically window unless you define a window.GreenSockGlobals object)
			 */
			Definition = function(ns, dependencies, func, global) {
				this.sc = (_defLookup[ns]) ? _defLookup[ns].sc : []; //subclasses
				_defLookup[ns] = this;
				this.gsClass = null;
				this.func = func;
				var _classes = [];
				this.check = function(init) {
					var i = dependencies.length,
						missing = i,
						cur, a, n, cl;
					while (--i > -1) {
						if ((cur = _defLookup[dependencies[i]] || new Definition(dependencies[i], [])).gsClass) {
							_classes[i] = cur.gsClass;
							missing--;
						} else if (init) {
							cur.sc.push(this);
						}
					}
					if (missing === 0 && func) {
						a = ("com.greensock." + ns).split(".");
						n = a.pop();
						cl = _namespace(a.join("."))[n] = this.gsClass = func.apply(func, _classes);

						//exports to multiple environments
						if (global) {
							_globals[n] = cl; //provides a way to avoid global namespace pollution. By default, the main classes like TweenLite, Power1, Strong, etc. are added to window unless a GreenSockGlobals is defined. So if you want to have things added to a custom object instead, just do something like window.GreenSockGlobals = {} before loading any GreenSock files. You can even set up an alias like window.GreenSockGlobals = windows.gs = {} so that you can access everything like gs.TweenLite. Also remember that ALL classes are added to the window.com.greensock object (in their respective packages, like com.greensock.easing.Power1, com.greensock.TweenLite, etc.)
							if (typeof(define) === "function" && define.amd){ //AMD
								define((window.GreenSockAMDPath ? window.GreenSockAMDPath + "/" : "") + ns.split(".").join("/"), [], function() { return cl; });
							} else if (typeof(module) !== "undefined" && module.exports){ //node
								module.exports = cl;
							}
						}
						for (i = 0; i < this.sc.length; i++) {
							this.sc[i].check();
						}
					}
				};
				this.check(true);
			},

			//used to create Definition instances (which basically registers a class that has dependencies).
			_gsDefine = window._gsDefine = function(ns, dependencies, func, global) {
				return new Definition(ns, dependencies, func, global);
			},

			//a quick way to create a class that doesn't have any dependencies. Returns the class, but first registers it in the GreenSock namespace so that other classes can grab it (other classes might be dependent on the class).
			_class = gs._class = function(ns, func, global) {
				func = func || function() {};
				_gsDefine(ns, [], function(){ return func; }, global);
				return func;
			};

		_gsDefine.globals = _globals;



/*
 * ----------------------------------------------------------------
 * Ease
 * ----------------------------------------------------------------
 */
		var _baseParams = [0, 0, 1, 1],
			_blankArray = [],
			Ease = _class("easing.Ease", function(func, extraParams, type, power) {
				this._func = func;
				this._type = type || 0;
				this._power = power || 0;
				this._params = extraParams ? _baseParams.concat(extraParams) : _baseParams;
			}, true),
			_easeMap = Ease.map = {},
			_easeReg = Ease.register = function(ease, names, types, create) {
				var na = names.split(","),
					i = na.length,
					ta = (types || "easeIn,easeOut,easeInOut").split(","),
					e, name, j, type;
				while (--i > -1) {
					name = na[i];
					e = create ? _class("easing."+name, null, true) : gs.easing[name] || {};
					j = ta.length;
					while (--j > -1) {
						type = ta[j];
						_easeMap[name + "." + type] = _easeMap[type + name] = e[type] = ease.getRatio ? ease : ease[type] || new ease();
					}
				}
			};

		p = Ease.prototype;
		p._calcEnd = false;
		p.getRatio = function(p) {
			if (this._func) {
				this._params[0] = p;
				return this._func.apply(null, this._params);
			}
			var t = this._type,
				pw = this._power,
				r = (t === 1) ? 1 - p : (t === 2) ? p : (p < 0.5) ? p * 2 : (1 - p) * 2;
			if (pw === 1) {
				r *= r;
			} else if (pw === 2) {
				r *= r * r;
			} else if (pw === 3) {
				r *= r * r * r;
			} else if (pw === 4) {
				r *= r * r * r * r;
			}
			return (t === 1) ? 1 - r : (t === 2) ? r : (p < 0.5) ? r / 2 : 1 - (r / 2);
		};

		//create all the standard eases like Linear, Quad, Cubic, Quart, Quint, Strong, Power0, Power1, Power2, Power3, and Power4 (each with easeIn, easeOut, and easeInOut)
		a = ["Linear","Quad","Cubic","Quart","Quint,Strong"];
		i = a.length;
		while (--i > -1) {
			p = a[i]+",Power"+i;
			_easeReg(new Ease(null,null,1,i), p, "easeOut", true);
			_easeReg(new Ease(null,null,2,i), p, "easeIn" + ((i === 0) ? ",easeNone" : ""));
			_easeReg(new Ease(null,null,3,i), p, "easeInOut");
		}
		_easeMap.linear = gs.easing.Linear.easeIn;
		_easeMap.swing = gs.easing.Quad.easeInOut; //for jQuery folks


/*
 * ----------------------------------------------------------------
 * EventDispatcher
 * ----------------------------------------------------------------
 */
		var EventDispatcher = _class("events.EventDispatcher", function(target) {
			this._listeners = {};
			this._eventTarget = target || this;
		});
		p = EventDispatcher.prototype;

		p.addEventListener = function(type, callback, scope, useParam, priority) {
			priority = priority || 0;
			var list = this._listeners[type],
				index = 0,
				listener, i;
			if (list == null) {
				this._listeners[type] = list = [];
			}
			i = list.length;
			while (--i > -1) {
				listener = list[i];
				if (listener.c === callback && listener.s === scope) {
					list.splice(i, 1);
				} else if (index === 0 && listener.pr < priority) {
					index = i + 1;
				}
			}
			list.splice(index, 0, {c:callback, s:scope, up:useParam, pr:priority});
			if (this === _ticker && !_tickerActive) {
				_ticker.wake();
			}
		};

		p.removeEventListener = function(type, callback) {
			var list = this._listeners[type], i;
			if (list) {
				i = list.length;
				while (--i > -1) {
					if (list[i].c === callback) {
						list.splice(i, 1);
						return;
					}
				}
			}
		};

		p.dispatchEvent = function(type) {
			var list = this._listeners[type],
				i, t, listener;
			if (list) {
				i = list.length;
				t = this._eventTarget;
				while (--i > -1) {
					listener = list[i];
					if (listener.up) {
						listener.c.call(listener.s || t, {type:type, target:t});
					} else {
						listener.c.call(listener.s || t);
					}
				}
			}
		};


/*
 * ----------------------------------------------------------------
 * Ticker
 * ----------------------------------------------------------------
 */
 		var _reqAnimFrame = window.requestAnimationFrame,
			_cancelAnimFrame = window.cancelAnimationFrame,
			_getTime = Date.now || function() {return new Date().getTime();};

		//now try to determine the requestAnimationFrame and cancelAnimationFrame functions and if none are found, we'll use a setTimeout()/clearTimeout() polyfill.
		a = ["ms","moz","webkit","o"];
		i = a.length;
		while (--i > -1 && !_reqAnimFrame) {
			_reqAnimFrame = window[a[i] + "RequestAnimationFrame"];
			_cancelAnimFrame = window[a[i] + "CancelAnimationFrame"] || window[a[i] + "CancelRequestAnimationFrame"];
		}

		_class("Ticker", function(fps, useRAF) {
			var _self = this,
				_startTime = _getTime(),
				_useRAF = (useRAF !== false && _reqAnimFrame),
				_fps, _req, _id, _gap, _nextTime,
				_tick = function(manual) {
					_self.time = (_getTime() - _startTime) / 1000;
					var id = _id,
						overlap = _self.time - _nextTime;
					if (!_fps || overlap > 0 || manual === true) {
						_self.frame++;
						_nextTime += overlap + (overlap >= _gap ? 0.004 : _gap - overlap);
						_self.dispatchEvent("tick");
					}
					if (manual !== true && id === _id) { //make sure the ids match in case the "tick" dispatch triggered something that caused the ticker to shut down or change _useRAF or something like that.
						_id = _req(_tick);
					}
				};

			EventDispatcher.call(_self);
			this.time = this.frame = 0;
			this.tick = function() {
				_tick(true);
			};

			this.sleep = function() {
				if (_id == null) {
					return;
				}
				if (!_useRAF || !_cancelAnimFrame) {
					clearTimeout(_id);
				} else {
					_cancelAnimFrame(_id);
				}
				_req = _emptyFunc;
				_id = null;
				if (_self === _ticker) {
					_tickerActive = false;
				}
			};

			this.wake = function() {
				if (_id !== null) {
					_self.sleep();
				}
				_req = (_fps === 0) ? _emptyFunc : (!_useRAF || !_reqAnimFrame) ? function(f) { return setTimeout(f, ((_nextTime - _self.time) * 1000 + 1) | 0); } : _reqAnimFrame;
				if (_self === _ticker) {
					_tickerActive = true;
				}
				_tick(2);
			};

			this.fps = function(value) {
				if (!arguments.length) {
					return _fps;
				}
				_fps = value;
				_gap = 1 / (_fps || 60);
				_nextTime = this.time + _gap;
				_self.wake();
			};

			this.useRAF = function(value) {
				if (!arguments.length) {
					return _useRAF;
				}
				_self.sleep();
				_useRAF = value;
				_self.fps(_fps);
			};
			_self.fps(fps);

			//a bug in iOS 6 Safari occasionally prevents the requestAnimationFrame from working initially, so we use a 1.5-second timeout that automatically falls back to setTimeout() if it senses this condition.
			setTimeout(function() {
				if (_useRAF && (!_id || _self.frame < 5)) {
					_self.useRAF(false);
				}
			}, 1500);
		});

		p = gs.Ticker.prototype = new gs.events.EventDispatcher();
		p.constructor = gs.Ticker;


/*
 * ----------------------------------------------------------------
 * Animation
 * ----------------------------------------------------------------
 */
		var Animation = _class("core.Animation", function(duration, vars) {
				this.vars = vars || {};
				this._duration = this._totalDuration = duration || 0;
				this._delay = Number(this.vars.delay) || 0;
				this._timeScale = 1;
				this._active = (this.vars.immediateRender === true);
				this.data = this.vars.data;
				this._reversed = (this.vars.reversed === true);

				if (!_rootTimeline) {
					return;
				}
				if (!_tickerActive) {
					_ticker.wake();
				}

				var tl = this.vars.useFrames ? _rootFramesTimeline : _rootTimeline;
				tl.add(this, tl._time);

				if (this.vars.paused) {
					this.paused(true);
				}
			});

		_ticker = Animation.ticker = new gs.Ticker();
		p = Animation.prototype;
		p._dirty = p._gc = p._initted = p._paused = false;
		p._totalTime = p._time = 0;
		p._rawPrevTime = -1;
		p._next = p._last = p._onUpdate = p._timeline = p.timeline = null;
		p._paused = false;

		p.play = function(from, suppressEvents) {
			if (arguments.length) {
				this.seek(from, suppressEvents);
			}
			return this.reversed(false).paused(false);
		};

		p.pause = function(atTime, suppressEvents) {
			if (arguments.length) {
				this.seek(atTime, suppressEvents);
			}
			return this.paused(true);
		};

		p.resume = function(from, suppressEvents) {
			if (arguments.length) {
				this.seek(from, suppressEvents);
			}
			return this.paused(false);
		};

		p.seek = function(time, suppressEvents) {
			return this.totalTime(Number(time), suppressEvents !== false);
		};

		p.restart = function(includeDelay, suppressEvents) {
			return this.reversed(false).paused(false).totalTime(includeDelay ? -this._delay : 0, (suppressEvents !== false), true);
		};

		p.reverse = function(from, suppressEvents) {
			if (arguments.length) {
				this.seek((from || this.totalDuration()), suppressEvents);
			}
			return this.reversed(true).paused(false);
		};

		p.render = function() {

		};

		p.invalidate = function() {
			return this;
		};

		p._enabled = function (enabled, ignoreTimeline) {
			if (!_tickerActive) {
				_ticker.wake();
			}
			this._gc = !enabled;
			this._active = (enabled && !this._paused && this._totalTime > 0 && this._totalTime < this._totalDuration);
			if (ignoreTimeline !== true) {
				if (enabled && !this.timeline) {
					this._timeline.add(this, this._startTime - this._delay);
				} else if (!enabled && this.timeline) {
					this._timeline._remove(this, true);
				}
			}
			return false;
		};


		p._kill = function(vars, target) {
			return this._enabled(false, false);
		};

		p.kill = function(vars, target) {
			this._kill(vars, target);
			return this;
		};

		p._uncache = function(includeSelf) {
			var tween = includeSelf ? this : this.timeline;
			while (tween) {
				tween._dirty = true;
				tween = tween.timeline;
			}
			return this;
		};

//----Animation getters/setters --------------------------------------------------------

		p.eventCallback = function(type, callback, params, scope) {
			if (type == null) {
				return null;
			} else if (type.substr(0,2) === "on") {
				var v = this.vars,
					i;
				if (arguments.length === 1) {
					return v[type];
				}
				if (callback == null) {
					delete v[type];
				} else {
					v[type] = callback;
					v[type + "Params"] = params;
					v[type + "Scope"] = scope;
					if (params) {
						i = params.length;
						while (--i > -1) {
							if (params[i] === "{self}") {
								params = v[type + "Params"] = params.concat(); //copying the array avoids situations where the same array is passed to multiple tweens/timelines and {self} doesn't correctly point to each individual instance.
								params[i] = this;
							}
						}
					}
				}
				if (type === "onUpdate") {
					this._onUpdate = callback;
				}
			}
			return this;
		};

		p.delay = function(value) {
			if (!arguments.length) {
				return this._delay;
			}
			if (this._timeline.smoothChildTiming) {
				this.startTime( this._startTime + value - this._delay );
			}
			this._delay = value;
			return this;
		};

		p.duration = function(value) {
			if (!arguments.length) {
				this._dirty = false;
				return this._duration;
			}
			this._duration = this._totalDuration = value;
			this._uncache(true); //true in case it's a TweenMax or TimelineMax that has a repeat - we'll need to refresh the totalDuration.
			if (this._timeline.smoothChildTiming) if (this._time > 0) if (this._time < this._duration) if (value !== 0) {
				this.totalTime(this._totalTime * (value / this._duration), true);
			}
			return this;
		};

		p.totalDuration = function(value) {
			this._dirty = false;
			return (!arguments.length) ? this._totalDuration : this.duration(value);
		};

		p.time = function(value, suppressEvents) {
			if (!arguments.length) {
				return this._time;
			}
			if (this._dirty) {
				this.totalDuration();
			}
			return this.totalTime((value > this._duration) ? this._duration : value, suppressEvents);
		};

		p.totalTime = function(time, suppressEvents, uncapped) {
			if (!_tickerActive) {
				_ticker.wake();
			}
			if (!arguments.length) {
				return this._totalTime;
			}
			if (this._timeline) {
				if (time < 0 && !uncapped) {
					time += this.totalDuration();
				}
				if (this._timeline.smoothChildTiming) {
					if (this._dirty) {
						this.totalDuration();
					}
					var totalDuration = this._totalDuration,
						tl = this._timeline;
					if (time > totalDuration && !uncapped) {
						time = totalDuration;
					}
					this._startTime = (this._paused ? this._pauseTime : tl._time) - ((!this._reversed ? time : totalDuration - time) / this._timeScale);
					if (!tl._dirty) { //for performance improvement. If the parent's cache is already dirty, it already took care of marking the anscestors as dirty too, so skip the function call here.
						this._uncache(false);
					}
					if (!tl._active) {
						//in case any of the anscestors had completed but should now be enabled...
						while (tl._timeline) {
							tl.totalTime(tl._totalTime, true);
							tl = tl._timeline;
						}
					}
				}
				if (this._gc) {
					this._enabled(true, false);
				}
				if (this._totalTime !== time) {
					this.render(time, suppressEvents, false);
				}
			}
			return this;
		};

		p.startTime = function(value) {
			if (!arguments.length) {
				return this._startTime;
			}
			if (value !== this._startTime) {
				this._startTime = value;
				if (this.timeline) if (this.timeline._sortChildren) {
					this.timeline.add(this, value - this._delay); //ensures that any necessary re-sequencing of Animations in the timeline occurs to make sure the rendering order is correct.
				}
			}
			return this;
		};

		p.timeScale = function(value) {
			if (!arguments.length) {
				return this._timeScale;
			}
			value = value || 0.000001; //can't allow zero because it'll throw the math off
			if (this._timeline && this._timeline.smoothChildTiming) {
				var pauseTime = this._pauseTime,
					t = (pauseTime || pauseTime === 0) ? pauseTime : this._timeline.totalTime();
				this._startTime = t - ((t - this._startTime) * this._timeScale / value);
			}
			this._timeScale = value;
			return this._uncache(false);
		};

		p.reversed = function(value) {
			if (!arguments.length) {
				return this._reversed;
			}
			if (value != this._reversed) {
				this._reversed = value;
				this.totalTime(this._totalTime, true);
			}
			return this;
		};

		p.paused = function(value) {
			if (!arguments.length) {
				return this._paused;
			}
			if (value != this._paused) if (this._timeline) {
				if (!_tickerActive && !value) {
					_ticker.wake();
				}
				var raw = this._timeline.rawTime(),
					elapsed = raw - this._pauseTime;
				if (!value && this._timeline.smoothChildTiming) {
					this._startTime += elapsed;
					this._uncache(false);
				}
				this._pauseTime = value ? raw : null;
				this._paused = value;
				this._active = (!value && this._totalTime > 0 && this._totalTime < this._totalDuration);
				if (!value && elapsed !== 0 && this._duration !== 0) {
					this.render(this._totalTime, true, true);
				}
			}
			if (this._gc && !value) {
				this._enabled(true, false);
			}
			return this;
		};


/*
 * ----------------------------------------------------------------
 * SimpleTimeline
 * ----------------------------------------------------------------
 */
		var SimpleTimeline = _class("core.SimpleTimeline", function(vars) {
			Animation.call(this, 0, vars);
			this.autoRemoveChildren = this.smoothChildTiming = true;
		});

		p = SimpleTimeline.prototype = new Animation();
		p.constructor = SimpleTimeline;
		p.kill()._gc = false;
		p._first = p._last = null;
		p._sortChildren = false;

		p.add = p.insert = function(child, position, align, stagger) {
			var prevTween, st;
			child._startTime = Number(position || 0) + child._delay;
			if (child._paused) if (this !== child._timeline) { //we only adjust the _pauseTime if it wasn't in this timeline already. Remember, sometimes a tween will be inserted again into the same timeline when its startTime is changed so that the tweens in the TimelineLite/Max are re-ordered properly in the linked list (so everything renders in the proper order).
				child._pauseTime = child._startTime + ((this.rawTime() - child._startTime) / child._timeScale);
			}
			if (child.timeline) {
				child.timeline._remove(child, true); //removes from existing timeline so that it can be properly added to this one.
			}
			child.timeline = child._timeline = this;
			if (child._gc) {
				child._enabled(true, true);
			}
			prevTween = this._last;
			if (this._sortChildren) {
				st = child._startTime;
				while (prevTween && prevTween._startTime > st) {
					prevTween = prevTween._prev;
				}
			}
			if (prevTween) {
				child._next = prevTween._next;
				prevTween._next = child;
			} else {
				child._next = this._first;
				this._first = child;
			}
			if (child._next) {
				child._next._prev = child;
			} else {
				this._last = child;
			}
			child._prev = prevTween;
			if (this._timeline) {
				this._uncache(true);
			}
			return this;
		};

		p._remove = function(tween, skipDisable) {
			if (tween.timeline === this) {
				if (!skipDisable) {
					tween._enabled(false, true);
				}
				tween.timeline = null;

				if (tween._prev) {
					tween._prev._next = tween._next;
				} else if (this._first === tween) {
					this._first = tween._next;
				}
				if (tween._next) {
					tween._next._prev = tween._prev;
				} else if (this._last === tween) {
					this._last = tween._prev;
				}

				if (this._timeline) {
					this._uncache(true);
				}
			}
			return this;
		};

		p.render = function(time, suppressEvents, force) {
			var tween = this._first,
				next;
			this._totalTime = this._time = this._rawPrevTime = time;
			while (tween) {
				next = tween._next; //record it here because the value could change after rendering...
				if (tween._active || (time >= tween._startTime && !tween._paused)) {
					if (!tween._reversed) {
						tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
					} else {
						tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
					}
				}
				tween = next;
			}
		};

		p.rawTime = function() {
			if (!_tickerActive) {
				_ticker.wake();
			}
			return this._totalTime;
		};


/*
 * ----------------------------------------------------------------
 * TweenLite
 * ----------------------------------------------------------------
 */
		var TweenLite = _class("TweenLite", function(target, duration, vars) {
				Animation.call(this, duration, vars);

				if (target == null) {
					throw "Cannot tween a null target.";
				}

				this.target = target = (typeof(target) !== "string") ? target : TweenLite.selector(target) || target;

				var isSelector = (target.jquery || (target.length && target[0] && target[0].nodeType && target[0].style)),
					overwrite = this.vars.overwrite,
					i, targ, targets;

				this._overwrite = overwrite = (overwrite == null) ? _overwriteLookup[TweenLite.defaultOverwrite] : (typeof(overwrite) === "number") ? overwrite >> 0 : _overwriteLookup[overwrite];

				if ((isSelector || target instanceof Array) && typeof(target[0]) !== "number") {
					this._targets = targets = _slice.call(target, 0);
					this._propLookup = [];
					this._siblings = [];
					for (i = 0; i < targets.length; i++) {
						targ = targets[i];
						if (!targ) {
							targets.splice(i--, 1);
							continue;
						} else if (typeof(targ) === "string") {
							targ = targets[i--] = TweenLite.selector(targ); //in case it's an array of strings
							if (typeof(targ) === "string") {
								targets.splice(i+1, 1); //to avoid an endless loop (can't imagine why the selector would return a string, but just in case)
							}
							continue;
						} else if (targ.length && targ[0] && targ[0].nodeType && targ[0].style) { //in case the user is passing in an array of selector objects (like jQuery objects), we need to check one more level and pull things out if necessary...
							targets.splice(i--, 1);
							this._targets = targets = targets.concat(_slice.call(targ, 0));
							continue;
						}
						this._siblings[i] = _register(targ, this, false);
						if (overwrite === 1) if (this._siblings[i].length > 1) {
							_applyOverwrite(targ, this, null, 1, this._siblings[i]);
						}
					}

				} else {
					this._propLookup = {};
					this._siblings = _register(target, this, false);
					if (overwrite === 1) if (this._siblings.length > 1) {
						_applyOverwrite(target, this, null, 1, this._siblings);
					}
				}
				if (this.vars.immediateRender || (duration === 0 && this._delay === 0 && this.vars.immediateRender !== false)) {
					this.render(-this._delay, false, true);
				}
			}, true),
			_isSelector = function(v) {
				return (v.length && v[0] && v[0].nodeType && v[0].style);
			},
			_autoCSS = function(vars, target) {
				var css = {},
					p;
				for (p in vars) {
					if (!_reservedProps[p] && (!(p in target) || p === "x" || p === "y" || p === "width" || p === "height" || p === "className") && (!_plugins[p] || (_plugins[p] && _plugins[p]._autoCSS))) { //note: <img> elements contain read-only "x" and "y" properties. We should also prioritize editing css width/height rather than the element's properties.
						css[p] = vars[p];
						delete vars[p];
					}
				}
				vars.css = css;
			};

		p = TweenLite.prototype = new Animation();
		p.constructor = TweenLite;
		p.kill()._gc = false;

//----TweenLite defaults, overwrite management, and root updates ----------------------------------------------------

		p.ratio = 0;
		p._firstPT = p._targets = p._overwrittenProps = p._startAt = null;
		p._notifyPluginsOfEnabled = false;

		TweenLite.version = "1.9.7";
		TweenLite.defaultEase = p._ease = new Ease(null, null, 1, 1);
		TweenLite.defaultOverwrite = "auto";
		TweenLite.ticker = _ticker;
		TweenLite.autoSleep = true;
		TweenLite.selector = window.$ || window.jQuery || function(e) { if (window.$) { TweenLite.selector = window.$; return window.$(e); } return window.document ? window.document.getElementById((e.charAt(0) === "#") ? e.substr(1) : e) : e; };

		var _internals = TweenLite._internals = {}, //gives us a way to expose certain private values to other GreenSock classes without contaminating tha main TweenLite object.
			_plugins = TweenLite._plugins = {},
			_tweenLookup = TweenLite._tweenLookup = {},
			_tweenLookupNum = 0,
			_reservedProps = _internals.reservedProps = {ease:1, delay:1, overwrite:1, onComplete:1, onCompleteParams:1, onCompleteScope:1, useFrames:1, runBackwards:1, startAt:1, onUpdate:1, onUpdateParams:1, onUpdateScope:1, onStart:1, onStartParams:1, onStartScope:1, onReverseComplete:1, onReverseCompleteParams:1, onReverseCompleteScope:1, onRepeat:1, onRepeatParams:1, onRepeatScope:1, easeParams:1, yoyo:1, immediateRender:1, repeat:1, repeatDelay:1, data:1, paused:1, reversed:1, autoCSS:1},
			_overwriteLookup = {none:0, all:1, auto:2, concurrent:3, allOnStart:4, preexisting:5, "true":1, "false":0},
			_rootFramesTimeline = Animation._rootFramesTimeline = new SimpleTimeline(),
			_rootTimeline = Animation._rootTimeline = new SimpleTimeline();

		_rootTimeline._startTime = _ticker.time;
		_rootFramesTimeline._startTime = _ticker.frame;
		_rootTimeline._active = _rootFramesTimeline._active = true;

		Animation._updateRoot = function() {
				_rootTimeline.render((_ticker.time - _rootTimeline._startTime) * _rootTimeline._timeScale, false, false);
				_rootFramesTimeline.render((_ticker.frame - _rootFramesTimeline._startTime) * _rootFramesTimeline._timeScale, false, false);
				if (!(_ticker.frame % 120)) { //dump garbage every 120 frames...
					var i, a, p;
					for (p in _tweenLookup) {
						a = _tweenLookup[p].tweens;
						i = a.length;
						while (--i > -1) {
							if (a[i]._gc) {
								a.splice(i, 1);
							}
						}
						if (a.length === 0) {
							delete _tweenLookup[p];
						}
					}
					//if there are no more tweens in the root timelines, or if they're all paused, make the _timer sleep to reduce load on the CPU slightly
					p = _rootTimeline._first;
					if (!p || p._paused) if (TweenLite.autoSleep && !_rootFramesTimeline._first && _ticker._listeners.tick.length === 1) {
						while (p && p._paused) {
							p = p._next;
						}
						if (!p) {
							_ticker.sleep();
						}
					}
				}
			};

		_ticker.addEventListener("tick", Animation._updateRoot);

		var _register = function(target, tween, scrub) {
				var id = target._gsTweenID, a, i;
				if (!_tweenLookup[id || (target._gsTweenID = id = "t" + (_tweenLookupNum++))]) {
					_tweenLookup[id] = {target:target, tweens:[]};
				}
				if (tween) {
					a = _tweenLookup[id].tweens;
					a[(i = a.length)] = tween;
					if (scrub) {
						while (--i > -1) {
							if (a[i] === tween) {
								a.splice(i, 1);
							}
						}
					}
				}
				return _tweenLookup[id].tweens;
			},

			_applyOverwrite = function(target, tween, props, mode, siblings) {
				var i, changed, curTween, l;
				if (mode === 1 || mode >= 4) {
					l = siblings.length;
					for (i = 0; i < l; i++) {
						if ((curTween = siblings[i]) !== tween) {
							if (!curTween._gc) if (curTween._enabled(false, false)) {
								changed = true;
							}
						} else if (mode === 5) {
							break;
						}
					}
					return changed;
				}
				//NOTE: Add 0.0000000001 to overcome floating point errors that can cause the startTime to be VERY slightly off (when a tween's time() is set for example)
				var startTime = tween._startTime + 0.0000000001,
					overlaps = [],
					oCount = 0,
					zeroDur = (tween._duration === 0),
					globalStart;
				i = siblings.length;
				while (--i > -1) {
					if ((curTween = siblings[i]) === tween || curTween._gc || curTween._paused) {
						//ignore
					} else if (curTween._timeline !== tween._timeline) {
						globalStart = globalStart || _checkOverlap(tween, 0, zeroDur);
						if (_checkOverlap(curTween, globalStart, zeroDur) === 0) {
							overlaps[oCount++] = curTween;
						}
					} else if (curTween._startTime <= startTime) if (curTween._startTime + curTween.totalDuration() / curTween._timeScale + 0.0000000001 > startTime) if (!((zeroDur || !curTween._initted) && startTime - curTween._startTime <= 0.0000000002)) {
						overlaps[oCount++] = curTween;
					}
				}

				i = oCount;
				while (--i > -1) {
					curTween = overlaps[i];
					if (mode === 2) if (curTween._kill(props, target)) {
						changed = true;
					}
					if (mode !== 2 || (!curTween._firstPT && curTween._initted)) {
						if (curTween._enabled(false, false)) { //if all property tweens have been overwritten, kill the tween.
							changed = true;
						}
					}
				}
				return changed;
			},

			_checkOverlap = function(tween, reference, zeroDur) {
				var tl = tween._timeline,
					ts = tl._timeScale,
					t = tween._startTime,
					min = 0.0000000001; //we use this to protect from rounding errors.
				while (tl._timeline) {
					t += tl._startTime;
					ts *= tl._timeScale;
					if (tl._paused) {
						return -100;
					}
					tl = tl._timeline;
				}
				t /= ts;
				return (t > reference) ? t - reference : ((zeroDur && t === reference) || (!tween._initted && t - reference < 2 * min)) ? min : ((t += tween.totalDuration() / tween._timeScale / ts) > reference + min) ? 0 : t - reference - min;
			};


//---- TweenLite instance methods -----------------------------------------------------------------------------

		p._init = function() {
			var v = this.vars,
				op = this._overwrittenProps,
				dur = this._duration,
				ease = v.ease,
				i, initPlugins, pt, p;
			if (v.startAt) {
				v.startAt.overwrite = 0;
				v.startAt.immediateRender = true;
				this._startAt = TweenLite.to(this.target, 0, v.startAt);
				if (v.immediateRender) {
					this._startAt = null; //tweens that render immediately (like most from() and fromTo() tweens) shouldn't revert when their parent timeline's playhead goes backward past the startTime because the initial render could have happened anytime and it shouldn't be directly correlated to this tween's startTime. Imagine setting up a complex animation where the beginning states of various objects are rendered immediately but the tween doesn't happen for quite some time - if we revert to the starting values as soon as the playhead goes backward past the tween's startTime, it will throw things off visually. Reversion should only happen in TimelineLite/Max instances where immediateRender was false (which is the default in the convenience methods like from()).
					if (this._time === 0 && dur !== 0) {
						return; //we skip initialization here so that overwriting doesn't occur until the tween actually begins. Otherwise, if you create several immediateRender:true tweens of the same target/properties to drop into a TimelineLite or TimelineMax, the last one created would overwrite the first ones because they didn't get placed into the timeline yet before the first render occurs and kicks in overwriting.
					}
				}
			} else if (v.runBackwards && v.immediateRender && dur !== 0) {
				//from() tweens must be handled uniquely: their beginning values must be rendered but we don't want overwriting to occur yet (when time is still 0). Wait until the tween actually begins before doing all the routines like overwriting. At that time, we should render at the END of the tween to ensure that things initialize correctly (remember, from() tweens go backwards)
				if (this._startAt) {
					this._startAt.render(-1, true);
					this._startAt = null;
				} else if (this._time === 0) {
					pt = {};
					for (p in v) { //copy props into a new object and skip any reserved props, otherwise onComplete or onUpdate or onStart could fire. We should, however, permit autoCSS to go through.
						if (!_reservedProps[p] || p === "autoCSS") {
							pt[p] = v[p];
						}
					}
					pt.overwrite = 0;
					this._startAt = TweenLite.to(this.target, 0, pt);
					return;
				}
			}
			if (!ease) {
				this._ease = TweenLite.defaultEase;
			} else if (ease instanceof Ease) {
				this._ease = (v.easeParams instanceof Array) ? ease.config.apply(ease, v.easeParams) : ease;
			} else {
				this._ease = (typeof(ease) === "function") ? new Ease(ease, v.easeParams) : _easeMap[ease] || TweenLite.defaultEase;
			}
			this._easeType = this._ease._type;
			this._easePower = this._ease._power;
			this._firstPT = null;

			if (this._targets) {
				i = this._targets.length;
				while (--i > -1) {
					if ( this._initProps( this._targets[i], (this._propLookup[i] = {}), this._siblings[i], (op ? op[i] : null)) ) {
						initPlugins = true;
					}
				}
			} else {
				initPlugins = this._initProps(this.target, this._propLookup, this._siblings, op);
			}

			if (initPlugins) {
				TweenLite._onPluginEvent("_onInitAllProps", this); //reorders the array in order of priority. Uses a static TweenPlugin method in order to minimize file size in TweenLite
			}
			if (op) if (!this._firstPT) if (typeof(this.target) !== "function") { //if all tweening properties have been overwritten, kill the tween. If the target is a function, it's probably a delayedCall so let it live.
				this._enabled(false, false);
			}
			if (v.runBackwards) {
				pt = this._firstPT;
				while (pt) {
					pt.s += pt.c;
					pt.c = -pt.c;
					pt = pt._next;
				}
			}
			this._onUpdate = v.onUpdate;
			this._initted = true;
		};

		p._initProps = function(target, propLookup, siblings, overwrittenProps) {
			var p, i, initPlugins, plugin, a, pt, v;
			if (target == null) {
				return false;
			}
			if (!this.vars.css) if (target.style) if (target.nodeType) if (_plugins.css) if (this.vars.autoCSS !== false) { //it's so common to use TweenLite/Max to animate the css of DOM elements, we assume that if the target is a DOM element, that's what is intended (a convenience so that users don't have to wrap things in css:{}, although we still recommend it for a slight performance boost and better specificity)
				_autoCSS(this.vars, target);
			}
			for (p in this.vars) {
				if (_reservedProps[p]) {
					if (p === "onStartParams" || p === "onUpdateParams" || p === "onCompleteParams" || p === "onReverseCompleteParams" || p === "onRepeatParams") if ((a = this.vars[p])) {
						i = a.length;
						while (--i > -1) {
							if (a[i] === "{self}") {
								a = this.vars[p] = a.concat(); //copy the array in case the user referenced the same array in multiple tweens/timelines (each {self} should be unique)
								a[i] = this;
							}
						}
					}

				} else if (_plugins[p] && (plugin = new _plugins[p]())._onInitTween(target, this.vars[p], this)) {

					//t - target 		[object]
					//p - property 		[string]
					//s - start			[number]
					//c - change		[number]
					//f - isFunction	[boolean]
					//n - name			[string]
					//pg - isPlugin 	[boolean]
					//pr - priority		[number]
					this._firstPT = pt = {_next:this._firstPT, t:plugin, p:"setRatio", s:0, c:1, f:true, n:p, pg:true, pr:plugin._priority};
					i = plugin._overwriteProps.length;
					while (--i > -1) {
						propLookup[plugin._overwriteProps[i]] = this._firstPT;
					}
					if (plugin._priority || plugin._onInitAllProps) {
						initPlugins = true;
					}
					if (plugin._onDisable || plugin._onEnable) {
						this._notifyPluginsOfEnabled = true;
					}

				} else {
					this._firstPT = propLookup[p] = pt = {_next:this._firstPT, t:target, p:p, f:(typeof(target[p]) === "function"), n:p, pg:false, pr:0};
					pt.s = (!pt.f) ? parseFloat(target[p]) : target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ]();
					v = this.vars[p];
					pt.c = (typeof(v) === "string" && v.charAt(1) === "=") ? parseInt(v.charAt(0) + "1", 10) * Number(v.substr(2)) : (Number(v) - pt.s) || 0;
				}
				if (pt) if (pt._next) {
					pt._next._prev = pt;
				}
			}

			if (overwrittenProps) if (this._kill(overwrittenProps, target)) { //another tween may have tried to overwrite properties of this tween before init() was called (like if two tweens start at the same time, the one created second will run first)
				return this._initProps(target, propLookup, siblings, overwrittenProps);
			}
			if (this._overwrite > 1) if (this._firstPT) if (siblings.length > 1) if (_applyOverwrite(target, this, propLookup, this._overwrite, siblings)) {
				this._kill(propLookup, target);
				return this._initProps(target, propLookup, siblings, overwrittenProps);
			}
			return initPlugins;
		};

		p.render = function(time, suppressEvents, force) {
			var prevTime = this._time,
				isComplete, callback, pt;
			if (time >= this._duration) {
				this._totalTime = this._time = this._duration;
				this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1;
				if (!this._reversed) {
					isComplete = true;
					callback = "onComplete";
				}
				if (this._duration === 0) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
					if (time === 0 || this._rawPrevTime < 0) if (this._rawPrevTime !== time) {
						force = true;
						if (this._rawPrevTime > 0) {
							callback = "onReverseComplete";
							if (suppressEvents) {
								time = -1; //when a callback is placed at the VERY beginning of a timeline and it repeats (or if timeline.seek(0) is called), events are normally suppressed during those behaviors (repeat or seek()) and without adjusting the _rawPrevTime back slightly, the onComplete wouldn't get called on the next render. This only applies to zero-duration tweens/callbacks of course.
							}
						}
					}
					this._rawPrevTime = time;
				}

			} else if (time < 0.0000001) { //to work around occasional floating point math artifacts, round super small values to 0.
				this._totalTime = this._time = 0;
				this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
				if (prevTime !== 0 || (this._duration === 0 && this._rawPrevTime > 0)) {
					callback = "onReverseComplete";
					isComplete = this._reversed;
				}
				if (time < 0) {
					this._active = false;
					if (this._duration === 0) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
						if (this._rawPrevTime >= 0) {
							force = true;
						}
						this._rawPrevTime = time;
					}
				} else if (!this._initted) { //if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
					force = true;
				}

			} else {
				this._totalTime = this._time = time;

				if (this._easeType) {
					var r = time / this._duration, type = this._easeType, pow = this._easePower;
					if (type === 1 || (type === 3 && r >= 0.5)) {
						r = 1 - r;
					}
					if (type === 3) {
						r *= 2;
					}
					if (pow === 1) {
						r *= r;
					} else if (pow === 2) {
						r *= r * r;
					} else if (pow === 3) {
						r *= r * r * r;
					} else if (pow === 4) {
						r *= r * r * r * r;
					}

					if (type === 1) {
						this.ratio = 1 - r;
					} else if (type === 2) {
						this.ratio = r;
					} else if (time / this._duration < 0.5) {
						this.ratio = r / 2;
					} else {
						this.ratio = 1 - (r / 2);
					}

				} else {
					this.ratio = this._ease.getRatio(time / this._duration);
				}

			}

			if (this._time === prevTime && !force) {
				return;
			} else if (!this._initted) {
				this._init();
				if (!this._initted) { //immediateRender tweens typically won't initialize until the playhead advances (_time is greater than 0) in order to ensure that overwriting occurs properly.
					return;
				}
				//_ease is initially set to defaultEase, so now that init() has run, _ease is set properly and we need to recalculate the ratio. Overall this is faster than using conditional logic earlier in the method to avoid having to set ratio twice because we only init() once but renderTime() gets called VERY frequently.
				if (this._time && !isComplete) {
					this.ratio = this._ease.getRatio(this._time / this._duration);
				} else if (isComplete && this._ease._calcEnd) {
					this.ratio = this._ease.getRatio((this._time === 0) ? 0 : 1);
				}
			}

			if (!this._active) if (!this._paused) {
				this._active = true;  //so that if the user renders a tween (as opposed to the timeline rendering it), the timeline is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the tween already finished but the user manually re-renders it as halfway done.
			}
			if (prevTime === 0) {
				if (this._startAt) {
					if (time >= 0) {
						this._startAt.render(time, suppressEvents, force);
					} else if (!callback) {
						callback = "_dummyGS"; //if no callback is defined, use a dummy value just so that the condition at the end evaluates as true because _startAt should render AFTER the normal render loop when the time is negative. We could handle this in a more intuitive way, of course, but the render loop is the MOST important thing to optimize, so this technique allows us to avoid adding extra conditional logic in a high-frequency area.
					}
				}
				if (this.vars.onStart) if (this._time !== 0 || this._duration === 0) if (!suppressEvents) {
					this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || _blankArray);
				}
			}

			pt = this._firstPT;
			while (pt) {
				if (pt.f) {
					pt.t[pt.p](pt.c * this.ratio + pt.s);
				} else {
					pt.t[pt.p] = pt.c * this.ratio + pt.s;
				}
				pt = pt._next;
			}

			if (this._onUpdate) {
				if (time < 0) if (this._startAt) {
					this._startAt.render(time, suppressEvents, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.
				}
				if (!suppressEvents) {
					this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || _blankArray);
				}
			}

			if (callback) if (!this._gc) { //check _gc because there's a chance that kill() could be called in an onUpdate
				if (time < 0 && this._startAt && !this._onUpdate) {
					this._startAt.render(time, suppressEvents, force);
				}
				if (isComplete) {
					if (this._timeline.autoRemoveChildren) {
						this._enabled(false, false);
					}
					this._active = false;
				}
				if (!suppressEvents && this.vars[callback]) {
					this.vars[callback].apply(this.vars[callback + "Scope"] || this, this.vars[callback + "Params"] || _blankArray);
				}
			}

		};

		p._kill = function(vars, target) {
			if (vars === "all") {
				vars = null;
			}
			if (vars == null) if (target == null || target === this.target) {
				return this._enabled(false, false);
			}
			target = (typeof(target) !== "string") ? (target || this._targets || this.target) : TweenLite.selector(target) || target;
			var i, overwrittenProps, p, pt, propLookup, changed, killProps, record;
			if ((target instanceof Array || _isSelector(target)) && typeof(target[0]) !== "number") {
				i = target.length;
				while (--i > -1) {
					if (this._kill(vars, target[i])) {
						changed = true;
					}
				}
			} else {
				if (this._targets) {
					i = this._targets.length;
					while (--i > -1) {
						if (target === this._targets[i]) {
							propLookup = this._propLookup[i] || {};
							this._overwrittenProps = this._overwrittenProps || [];
							overwrittenProps = this._overwrittenProps[i] = vars ? this._overwrittenProps[i] || {} : "all";
							break;
						}
					}
				} else if (target !== this.target) {
					return false;
				} else {
					propLookup = this._propLookup;
					overwrittenProps = this._overwrittenProps = vars ? this._overwrittenProps || {} : "all";
				}

				if (propLookup) {
					killProps = vars || propLookup;
					record = (vars !== overwrittenProps && overwrittenProps !== "all" && vars !== propLookup && (vars == null || vars._tempKill !== true)); //_tempKill is a super-secret way to delete a particular tweening property but NOT have it remembered as an official overwritten property (like in BezierPlugin)
					for (p in killProps) {
						if ((pt = propLookup[p])) {
							if (pt.pg && pt.t._kill(killProps)) {
								changed = true; //some plugins need to be notified so they can perform cleanup tasks first
							}
							if (!pt.pg || pt.t._overwriteProps.length === 0) {
								if (pt._prev) {
									pt._prev._next = pt._next;
								} else if (pt === this._firstPT) {
									this._firstPT = pt._next;
								}
								if (pt._next) {
									pt._next._prev = pt._prev;
								}
								pt._next = pt._prev = null;
							}
							delete propLookup[p];
						}
						if (record) {
							overwrittenProps[p] = 1;
						}
					}
					if (!this._firstPT && this._initted) { //if all tweening properties are killed, kill the tween. Without this line, if there's a tween with multiple targets and then you killTweensOf() each target individually, the tween would technically still remain active and fire its onComplete even though there aren't any more properties tweening.
						this._enabled(false, false);
					}
				}
			}
			return changed;
		};

		p.invalidate = function() {
			if (this._notifyPluginsOfEnabled) {
				TweenLite._onPluginEvent("_onDisable", this);
			}
			this._firstPT = null;
			this._overwrittenProps = null;
			this._onUpdate = null;
			this._startAt = null;
			this._initted = this._active = this._notifyPluginsOfEnabled = false;
			this._propLookup = (this._targets) ? {} : [];
			return this;
		};

		p._enabled = function(enabled, ignoreTimeline) {
			if (!_tickerActive) {
				_ticker.wake();
			}
			if (enabled && this._gc) {
				var targets = this._targets,
					i;
				if (targets) {
					i = targets.length;
					while (--i > -1) {
						this._siblings[i] = _register(targets[i], this, true);
					}
				} else {
					this._siblings = _register(this.target, this, true);
				}
			}
			Animation.prototype._enabled.call(this, enabled, ignoreTimeline);
			if (this._notifyPluginsOfEnabled) if (this._firstPT) {
				return TweenLite._onPluginEvent((enabled ? "_onEnable" : "_onDisable"), this);
			}
			return false;
		};


//----TweenLite static methods -----------------------------------------------------

		TweenLite.to = function(target, duration, vars) {
			return new TweenLite(target, duration, vars);
		};

		TweenLite.from = function(target, duration, vars) {
			vars.runBackwards = true;
			vars.immediateRender = (vars.immediateRender != false);
			return new TweenLite(target, duration, vars);
		};

		TweenLite.fromTo = function(target, duration, fromVars, toVars) {
			toVars.startAt = fromVars;
			toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
			return new TweenLite(target, duration, toVars);
		};

		TweenLite.delayedCall = function(delay, callback, params, scope, useFrames) {
			return new TweenLite(callback, 0, {delay:delay, onComplete:callback, onCompleteParams:params, onCompleteScope:scope, onReverseComplete:callback, onReverseCompleteParams:params, onReverseCompleteScope:scope, immediateRender:false, useFrames:useFrames, overwrite:0});
		};

		TweenLite.set = function(target, vars) {
			return new TweenLite(target, 0, vars);
		};

		TweenLite.killTweensOf = TweenLite.killDelayedCallsTo = function(target, vars) {
			var a = TweenLite.getTweensOf(target),
				i = a.length;
			while (--i > -1) {
				a[i]._kill(vars, target);
			}
		};

		TweenLite.getTweensOf = function(target) {
			if (target == null) { return []; }
			target = (typeof(target) !== "string") ? target : TweenLite.selector(target) || target;
			var i, a, j, t;
			if ((target instanceof Array || _isSelector(target)) && typeof(target[0]) !== "number") {
				i = target.length;
				a = [];
				while (--i > -1) {
					a = a.concat(TweenLite.getTweensOf(target[i]));
				}
				i = a.length;
				//now get rid of any duplicates (tweens of arrays of objects could cause duplicates)
				while (--i > -1) {
					t = a[i];
					j = i;
					while (--j > -1) {
						if (t === a[j]) {
							a.splice(i, 1);
						}
					}
				}
			} else {
				a = _register(target).concat();
				i = a.length;
				while (--i > -1) {
					if (a[i]._gc) {
						a.splice(i, 1);
					}
				}
			}
			return a;
		};



/*
 * ----------------------------------------------------------------
 * TweenPlugin   (could easily be split out as a separate file/class, but included for ease of use (so that people don't need to include another <script> call before loading plugins which is easy to forget)
 * ----------------------------------------------------------------
 */
		var TweenPlugin = _class("plugins.TweenPlugin", function(props, priority) {
					this._overwriteProps = (props || "").split(",");
					this._propName = this._overwriteProps[0];
					this._priority = priority || 0;
					this._super = TweenPlugin.prototype;
				}, true);

		p = TweenPlugin.prototype;
		TweenPlugin.version = "1.9.1";
		TweenPlugin.API = 2;
		p._firstPT = null;

		p._addTween = function(target, prop, start, end, overwriteProp, round) {
			var c, pt;
			if (end != null && (c = (typeof(end) === "number" || end.charAt(1) !== "=") ? Number(end) - start : parseInt(end.charAt(0)+"1", 10) * Number(end.substr(2)))) {
				this._firstPT = pt = {_next:this._firstPT, t:target, p:prop, s:start, c:c, f:(typeof(target[prop]) === "function"), n:overwriteProp || prop, r:round};
				if (pt._next) {
					pt._next._prev = pt;
				}
			}
		};

		p.setRatio = function(v) {
			var pt = this._firstPT,
				min = 0.000001,
				val;
			while (pt) {
				val = pt.c * v + pt.s;
				if (pt.r) {
					val = (val + ((val > 0) ? 0.5 : -0.5)) >> 0; //about 4x faster than Math.round()
				} else if (val < min) if (val > -min) { //prevents issues with converting very small numbers to strings in the browser
					val = 0;
				}
				if (pt.f) {
					pt.t[pt.p](val);
				} else {
					pt.t[pt.p] = val;
				}
				pt = pt._next;
			}
		};

		p._kill = function(lookup) {
			var a = this._overwriteProps,
				pt = this._firstPT,
				i;
			if (lookup[this._propName] != null) {
				this._overwriteProps = [];
			} else {
				i = a.length;
				while (--i > -1) {
					if (lookup[a[i]] != null) {
						a.splice(i, 1);
					}
				}
			}
			while (pt) {
				if (lookup[pt.n] != null) {
					if (pt._next) {
						pt._next._prev = pt._prev;
					}
					if (pt._prev) {
						pt._prev._next = pt._next;
						pt._prev = null;
					} else if (this._firstPT === pt) {
						this._firstPT = pt._next;
					}
				}
				pt = pt._next;
			}
			return false;
		};

		p._roundProps = function(lookup, value) {
			var pt = this._firstPT;
			while (pt) {
				if (lookup[this._propName] || (pt.n != null && lookup[ pt.n.split(this._propName + "_").join("") ])) { //some properties that are very plugin-specific add a prefix named after the _propName plus an underscore, so we need to ignore that extra stuff here.
					pt.r = value;
				}
				pt = pt._next;
			}
		};

		TweenLite._onPluginEvent = function(type, tween) {
			var pt = tween._firstPT,
				changed, pt2, first, last, next;
			if (type === "_onInitAllProps") {
				//sorts the PropTween linked list in order of priority because some plugins need to render earlier/later than others, like MotionBlurPlugin applies its effects after all x/y/alpha tweens have rendered on each frame.
				while (pt) {
					next = pt._next;
					pt2 = first;
					while (pt2 && pt2.pr > pt.pr) {
						pt2 = pt2._next;
					}
					if ((pt._prev = pt2 ? pt2._prev : last)) {
						pt._prev._next = pt;
					} else {
						first = pt;
					}
					if ((pt._next = pt2)) {
						pt2._prev = pt;
					} else {
						last = pt;
					}
					pt = next;
				}
				pt = tween._firstPT = first;
			}
			while (pt) {
				if (pt.pg) if (typeof(pt.t[type]) === "function") if (pt.t[type]()) {
					changed = true;
				}
				pt = pt._next;
			}
			return changed;
		};

		TweenPlugin.activate = function(plugins) {
			var i = plugins.length;
			while (--i > -1) {
				if (plugins[i].API === TweenPlugin.API) {
					_plugins[(new plugins[i]())._propName] = plugins[i];
				}
			}
			return true;
		};

		//provides a more concise way to define plugins that have no dependencies besides TweenPlugin and TweenLite, wrapping common boilerplate stuff into one function (added in 1.9.0). You don't NEED to use this to define a plugin - the old way still works and can be useful in certain (rare) situations.
		_gsDefine.plugin = function(config) {
			if (!config || !config.propName || !config.init || !config.API) { throw "illegal plugin definition."; }
			var propName = config.propName,
				priority = config.priority || 0,
				overwriteProps = config.overwriteProps,
				map = {init:"_onInitTween", set:"setRatio", kill:"_kill", round:"_roundProps", initAll:"_onInitAllProps"},
				Plugin = _class("plugins." + propName.charAt(0).toUpperCase() + propName.substr(1) + "Plugin",
					function() {
						TweenPlugin.call(this, propName, priority);
						this._overwriteProps = overwriteProps || [];
					}, (config.global === true)),
				p = Plugin.prototype = new TweenPlugin(propName),
				prop;
			p.constructor = Plugin;
			Plugin.API = config.API;
			for (prop in map) {
				if (typeof(config[prop]) === "function") {
					p[map[prop]] = config[prop];
				}
			}
			Plugin.version = config.version;
			TweenPlugin.activate([Plugin]);
			return Plugin;
		};


		//now run through all the dependencies discovered and if any are missing, log that to the console as a warning. This is why it's best to have TweenLite load last - it can check all the dependencies for you.
		a = window._gsQueue;
		if (a) {
			for (i = 0; i < a.length; i++) {
				a[i]();
			}
			for (p in _defLookup) {
				if (!_defLookup[p].func) {
					window.console.log("GSAP encountered missing dependency: com.greensock." + p);
				}
			}
		}

		_tickerActive = false; //ensures that the first official animation forces a ticker.tick() to update the time when it is instantiated

})(window);/* Data */
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
}(window));/* thumbs manager */
(function(window){
	
	var FWDRAPAudioScreen = function(volume){
		
		var self = this;
		var prototype = FWDRAPAudioScreen.prototype;
	
		this.audio_el = null;
	
		this.sourcePath_str = null;
		
		this.lastPercentPlayed = 0;
		this.volume = volume;
		this.curDuration = 0;
		this.countNormalMp3Errors = 0;
		this.countShoutCastErrors = 0;
		this.maxShoutCastCountErrors = 5;
		this.maxNormalCountErrors = 1;
		this.testShoutCastId_to;
		
		this.preload_bl = false;
		this.allowScrubing_bl = false;
		this.hasError_bl = true;
		this.isPlaying_bl = false;
		this.isStopped_bl = true;
		this.hasPlayedOnce_bl = false;
		this.isStartEventDispatched_bl = false;
		this.isSafeToBeControlled_bl = false;
		this.isShoutcast_bl = false;
		this.isNormalMp3_bl = false;
		
		//###############################################//
		/* init */
		//###############################################//
		this.init = function(){
			self.setupAudio();
			self.setHeight(0);
		};
	
		//###############################################//
		/* Setup audio element */
		//##############################################//
		this.setupAudio = function(){
			if(self.audio_el == null){
				self.audio_el = document.createElement("audio");
				self.screen.appendChild(self.audio_el);
				self.audio_el.controls = false;
				self.audio_el.preload = "auto";
				self.audio_el.volume = self.volume;
			}
			
			self.audio_el.addEventListener("error", self.errorHandler);
			self.audio_el.addEventListener("canplay", self.safeToBeControlled);
			self.audio_el.addEventListener("canplaythrough", self.safeToBeControlled);
			self.audio_el.addEventListener("progress", self.updateProgress);
			self.audio_el.addEventListener("timeupdate", self.updateAudio);
			self.audio_el.addEventListener("pause", self.pauseHandler);
			self.audio_el.addEventListener("play", self.playHandler);
			self.audio_el.addEventListener("ended", self.endedHandler);
		};
		
		this.destroyAudio = function(){
			if(self.audio_el){
				self.audio_el.removeEventListener("error", self.errorHandler);
				self.audio_el.removeEventListener("canplay", self.safeToBeControlled);
				self.audio_el.removeEventListener("canplaythrough", self.safeToBeControlled);
				self.audio_el.removeEventListener("progress", self.updateProgress);
				self.audio_el.removeEventListener("timeupdate", self.updateAudio);
				self.audio_el.removeEventListener("pause", self.pauseHandler);
				self.audio_el.removeEventListener("play", self.playHandler);
				self.audio_el.removeEventListener("ended", self.endedHandler);
				self.audio_el.src = "";
				self.audio_el.load();
			}
			//try{
			//	self.screen.removeChild(self.audio_el);
			//}catch(e){}
			//self.audio_el = null;
		};
		
		//##########################################//
		/* Video error handler. */
		//##########################################//
		this.errorHandler = function(e){
			
			if(self.isNormalMp3_bl && self.countNormalMp3Errors <= self.maxNormalCountErrors){
				self.stop();
				self.testShoutCastId_to = setTimeout(self.play, 200);
				self.countNormalMp3Errors ++;
				return;
			}
			
			if(self.isShoutcast_bl && self.countShoutCastErrors <= self.maxShoutCastCountErrors && self.audio_el.networkState == 0){
				self.testShoutCastId_to = setTimeout(self.play, 200);
				self.countShoutCastErrors ++;
				return;
			}
			
			var error_str;
			self.hasError_bl = true;
			self.stop();
			
			if(self.audio_el.networkState == 0){
				error_str = "error 'self.audio_el.networkState = 1'";
			}else if(self.audio_el.networkState == 1){
				error_str = "error 'self.audio_el.networkState = 1'";
			}else if(self.audio_el.networkState == 2){
				error_str = "'self.audio_el.networkState = 2'";
			}else if(self.audio_el.networkState == 3){
				error_str = "source not found <font color='#FFFFFF'>" + self.sourcePath_str + "</font>";
			}else{
				error_str = e;
			}
			
			if(window.console) window.console.log(self.audio_el.networkState);
			
			self.dispatchEvent(FWDRAPAudioScreen.ERROR, {text:error_str });
		};
		
		//##############################################//
		/* Set path */
		//##############################################//
		this.setSource = function(sourcePath){
			self.sourcePath_str = sourcePath;
			var paths_ar = self.sourcePath_str.split(",");
			var formats_ar = FWDRoyalAudioPlayer.getAudioFormats;
			//console.log("PATHS " +  "[" + paths_ar + "]");
			//console.log("FORMATS " + "[" + formats_ar + "]");
			//console.log("#################")
			
			for(var i=0; i<paths_ar.length; i++){
				var path = paths_ar[i];
				paths_ar[i] = FWDUtils.trim(path);
			}
			
			loop1:for(var j=0; j<paths_ar.length; j++){
				var path = paths_ar[j];
				for(var i=0; i<formats_ar.length; i++){
					var format = formats_ar[i];
					if(path.indexOf(format) != -1){
						self.sourcePath_str = path;			
						break loop1;
					}
				}
			}
			
			clearTimeout(self.testShoutCastId_to);
			
			
			if(self.sourcePath_str.indexOf(";") != -1){
				self.isShoutcast_bl = true;
				self.countShoutCastErrors = 0;
			}else{
				self.isShoutcast_bl = false;
			}
			
			if(self.sourcePath_str.indexOf(";") == -1){
				self.isNormalMp3_bl = true;
				self.countNormalMp3Errors = 0;
			}else{
				self.isNormalMp3_bl = false;
			}
			
			
			self.lastPercentPlayed = 0;
			if(self.audio_el) self.stop(true);
		};
	
		//##########################################//
		/* Play / pause / stop methods */
		//##########################################//
		this.play = function(overwrite){
			if(self.isStopped_bl){
				self.isPlaying_bl = false;
				self.hasError_bl = false;
				self.allowScrubing_bl = false;
				self.isStopped_bl = false;
				//if(self.audio_el == null)	
				self.setupAudio();
				self.audio_el.src = self.sourcePath_str;
				//self.audio_el.load();
				self.play();
			}else if(!self.audio_el.ended || overwrite){
				try{
					self.isPlaying_bl = true;
					self.hasPlayedOnce_bl = true;
					self.audio_el.play();
					
					if(FWDUtils.isIE) self.dispatchEvent(FWDRAPAudioScreen.PLAY);
				}catch(e){};
			}
		};

		this.pause = function(){
			if(self == null) return;
			if(self.audio_el == null) return;
			if(!self.audio_el.ended){
				try{
					self.audio_el.pause();
					self.isPlaying_bl = false;
					if(FWDUtils.isIE) self.dispatchEvent(FWDRAPAudioScreen.PAUSE);
				}catch(e){};
				
			}
		};
		
		this.pauseHandler = function(){
			if(self.allowScrubing_bl) return;
			self.dispatchEvent(FWDRAPAudioScreen.PAUSE);
		};
		
		this.playHandler = function(){
			if(self.allowScrubing_bl) return;
			if(!self.isStartEventDispatched_bl){
				self.dispatchEvent(FWDRAPAudioScreen.START);
				self.isStartEventDispatched_bl = true;
			}
			self.dispatchEvent(FWDRAPAudioScreen.PLAY);
		};
		
		this.endedHandler = function(){
			self.dispatchEvent(FWDRAPAudioScreen.PLAY_COMPLETE);
		};
		
		this.stop = function(overwrite){
			self.dispatchEvent(FWDRAPAudioScreen.UPDATE_TIME, {curTime:"00:00" , totalTime:"00:00"});
			if((self == null || self.audio_el == null || self.isStopped_bl) && !overwrite) return;
			self.isPlaying_bl = false;
			self.isStopped_bl = true;
			self.hasPlayedOnce_bl = true;
			self.isSafeToBeControlled_bl = false;
			self.isStartEventDispatched_bl = false;
			clearTimeout(self.testShoutCastId_to);
			self.audio_el.pause();
			self.destroyAudio();
			self.dispatchEvent(FWDRAPAudioScreen.STOP);
			self.dispatchEvent(FWDRAPAudioScreen.LOAD_PROGRESS, {percent:0});
		};

		//###########################################//
		/* Check if audio is safe to be controlled */
		//###########################################//
		this.safeToBeControlled = function(){
			if(!self.isSafeToBeControlled_bl){
				self.hasHours_bl = Math.floor(self.audio_el.duration / (60 * 60)) > 0;
				self.isPlaying_bl = true;
				self.isSafeToBeControlled_bl = true;
				self.dispatchEvent(FWDRAPAudioScreen.SAFE_TO_SCRUBB);
				self.dispatchEvent(FWDRAPAudioScreen.SAFE_TO_UPDATE_VOLUME);
			}
		};
	
		//###########################################//
		/* Update progress */
		//##########################################//
		this.updateProgress = function(){
			var buffered;
			var percentLoaded = 0;
			
			if(self.audio_el.buffered.length > 0){
				buffered = self.audio_el.buffered.end(self.audio_el.buffered.length - 1);
				percentLoaded = buffered.toFixed(1)/self.audio_el.duration.toFixed(1);
				if(isNaN(percentLoaded) || !percentLoaded) percentLoaded = 0;
			}
			
			if(percentLoaded == 1) self.audio_el.removeEventListener("progress", self.updateProgress);
			
			self.dispatchEvent(FWDRAPAudioScreen.LOAD_PROGRESS, {percent:percentLoaded});
		};
		
		//##############################################//
		/* Update audio */
		//#############################################//
		this.updateAudio = function(){
			var percentPlayed; 
			if (!self.allowScrubing_bl) {
				percentPlayed = self.audio_el.currentTime /self.audio_el.duration;
				self.dispatchEvent(FWDRAPAudioScreen.UPDATE, {percent:percentPlayed});
			}
			
			var totalTime = self.formatTime(self.audio_el.duration);
			var curTime = self.formatTime(self.audio_el.currentTime);
			
			
			if(!isNaN(self.audio_el.duration)){
				self.dispatchEvent(FWDRAPAudioScreen.UPDATE_TIME, {curTime: curTime, totalTime:totalTime});
			}else{
				self.dispatchEvent(FWDRAPAudioScreen.UPDATE_TIME, {curTime:"00:00" , totalTime:"00:00"});
			}
			self.lastPercentPlayed = percentPlayed;
			self.curDuration = curTime;
		};
		
		//###############################################//
		/* Scrub */
		//###############################################//
		this.startToScrub = function(){
			self.allowScrubing_bl = true;
		};
		
		this.stopToScrub = function(){
			self.allowScrubing_bl = false;
		};
		
		this.scrub = function(percent, e){
			if(self.audio_el == null || !self.audio_el.duration) return;
			if(e) self.startToScrub();
			try{
				self.audio_el.currentTime = self.audio_el.duration * percent;
				var totalTime = self.formatTime(self.audio_el.duration);
				var curTime = self.formatTime(self.audio_el.currentTime);
				self.dispatchEvent(FWDRAPAudioScreen.UPDATE_TIME, {curTime: curTime, totalTime:totalTime});
			}catch(e){}
		};
		
		//###############################################//
		/* replay */
		//###############################################//
		this.replay = function(){
			self.scrub(0);
			self.play();
		};
		
		//###############################################//
		/* Volume */
		//###############################################//
		this.setVolume = function(vol){
			if(vol) self.volume = vol;
			if(self.audio_el) self.audio_el.volume = self.volume;
		};
		
		this.formatTime = function(secs){
			var hours = Math.floor(secs / (60 * 60));
			
		    var divisor_for_minutes = secs % (60 * 60);
		    var minutes = Math.floor(divisor_for_minutes / 60);

		    var divisor_for_seconds = divisor_for_minutes % 60;
		    var seconds = Math.ceil(divisor_for_seconds);
		    
		    minutes = (minutes >= 10) ? minutes : "0" + minutes;
		    seconds = (seconds >= 10) ? seconds : "0" + seconds;
		    
		    if(isNaN(seconds)) return "00:00";
			if(self.hasHours_bl){
				 return hours + ":" + minutes + ":" + seconds;
			}else{
				 return minutes + ":" + seconds;
			}
		};

	
		this.init();
	};

	/* set prototype */
	FWDRAPAudioScreen.setPrototype = function(){
		FWDRAPAudioScreen.prototype = new FWDDisplayObject("div");
	};
	
	FWDRAPAudioScreen.ERROR = "error";
	FWDRAPAudioScreen.UPDATE = "update";
	FWDRAPAudioScreen.UPDATE = "update";
	FWDRAPAudioScreen.UPDATE_TIME = "updateTime";
	FWDRAPAudioScreen.SAFE_TO_SCRUBB = "safeToControll";
	FWDRAPAudioScreen.SAFE_TO_UPDATE_VOLUME = "safeToUpdateVolume";
	FWDRAPAudioScreen.LOAD_PROGRESS = "loadProgress";
	FWDRAPAudioScreen.START = "start";
	FWDRAPAudioScreen.PLAY = "play";
	FWDRAPAudioScreen.PAUSE = "pause";
	FWDRAPAudioScreen.STOP = "stop";
	FWDRAPAudioScreen.PLAY_COMPLETE = "playComplete";



	window.FWDRAPAudioScreen = FWDRAPAudioScreen;

}(window));/* FWDRAPCategories */
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
	
}());/* FWDRAPCategoriesThumb */
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
}(window));/* FWDRAPComplexButton */
(function (){
var FWDRAPComplexButton = function(
			n1Img, 
			s1Img, 
			n2Img, 
			s2Img, 
			disptachMainEvent_bl
		){
		
		var self = this;
		var prototype = FWDRAPComplexButton.prototype;
		
		this.n1Img = n1Img;
		this.s1Img = s1Img;
		this.n2Img = n2Img;
		this.s2Img = s2Img;
		
		this.firstButton_do;
		this.n1_do;
		this.s1_do;
		this.secondButton_do;
		this.n2_do;
		this.s2_do;
		
		this.buttonWidth = self.n1Img.width;
		this.buttonHeight = self.n1Img.height;
		
		this.isSelectedState_bl = false;
		this.currentState = 1;
		this.disptachMainEvent_bl = disptachMainEvent_bl;
		this.isDisabled_bl = false;
		this.isMobile_bl = FWDUtils.isMobile;
		this.hasPointerEvent_bl = FWDUtils.hasPointerEvent;
		
		//##########################################//
		/* initialize self */
		//##########################################//
		self.init = function(){
			self.hasTransform2d_bl = false;
			self.setButtonMode(true);
			self.setWidth(self.buttonWidth);
			self.setHeight(self.buttonHeight);
			self.setupMainContainers();
			self.secondButton_do.setVisible(false);
		};
		
		//##########################################//
		/* setup main containers */
		//##########################################//
		self.setupMainContainers = function(){
			self.firstButton_do = new FWDDisplayObject("div");
			self.addChild(self.firstButton_do);
			self.n1_do = new FWDDisplayObject("img");	
			self.n1_do.setScreen(self.n1Img);
			self.s1_do = new FWDDisplayObject("img");
			self.s1_do.setScreen(self.s1Img);
			self.s1_do.setAlpha(0);
			self.firstButton_do.addChild(self.n1_do);
			self.firstButton_do.addChild(self.s1_do);
			self.firstButton_do.setWidth(self.n1Img.width);
			self.firstButton_do.setHeight(self.n1Img.height);
			
			self.secondButton_do = new FWDDisplayObject("div");
			self.addChild(self.secondButton_do);
			self.n2_do = new FWDDisplayObject("img");	
			self.n2_do.setScreen(self.n2Img);
			self.s2_do = new FWDDisplayObject("img");
			self.s2_do.setScreen(self.s2Img);
			self.s2_do.setAlpha(0);
			self.secondButton_do.addChild(self.n2_do);
			self.secondButton_do.addChild(self.s2_do);
			self.secondButton_do.setWidth(self.n2Img.width);
			self.secondButton_do.setHeight(self.n2Img.height);
			
			self.addChild(self.secondButton_do);
			self.addChild(self.firstButton_do);
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.screen.addEventListener("MSPointerDown", self.onMouseUp);
					self.screen.addEventListener("MSPointerOver", self.onMouseOver);
					self.screen.addEventListener("MSPointerOut", self.onMouseOut);
				}else{
					self.screen.addEventListener("touchend", self.onMouseUp);
					self.screen.addEventListener("touchstart", self.onDown);
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
		
		self.onMouseOver = function(e, animate){
			if(self.isDisabled_bl || self.isSelectedState_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				self.dispatchEvent(FWDRAPComplexButton.MOUSE_OVER, {e:e});
				self.setSelectedState(true);
			}
		};
			
		self.onMouseOut = function(e){
			if(self.isDisabled_bl || !self.isSelectedState_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				self.setNormalState();
				self.dispatchEvent(FWDRAPComplexButton.MOUSE_OUT);
			}
		};
		
		self.onDown = function(e){
			if(e.preventDefault) e.preventDefault();
		};
	
		self.onMouseUp = function(e){
			if(self.isDisabled_bl || e.button == 2) return;
			if(e.preventDefault) e.preventDefault();
			if(!self.isMobile_bl) self.onMouseOver(e, false);
			//if(self.hasPointerEvent_bl) self.setNormalState();
			if(self.disptachMainEvent_bl) self.dispatchEvent(FWDRAPComplexButton.MOUSE_UP, {e:e});
		};
		
		//##############################//
		/* toggle button */
		//#############################//
		self.toggleButton = function(){
			if(self.currentState == 1){
				self.firstButton_do.setVisible(false);
				self.secondButton_do.setVisible(true);
				self.currentState = 0;
				self.dispatchEvent(FWDRAPComplexButton.FIRST_BUTTON_CLICK);
			}else{
				self.firstButton_do.setVisible(true);
				self.secondButton_do.setVisible(false);
				self.currentState = 1;
				self.dispatchEvent(FWDRAPComplexButton.SECOND_BUTTON_CLICK);
			}
		};
		
		//##############################//
		/* set second buttons state */
		//##############################//
		self.setButtonState = function(state){
			if(state == 1){
				self.firstButton_do.setVisible(true);
				self.secondButton_do.setVisible(false);
				self.currentState = 1; 
			}else{
				self.firstButton_do.setVisible(false);
				self.secondButton_do.setVisible(true);
				self.currentState = 0; 
			}
		};
		
		//###############################//
		/* set normal state */
		//################################//
		this.setNormalState = function(){
			if(self.isMobile_bl && !self.hasPointerEvent_bl) return;
			self.isSelectedState_bl = false;
			TweenMax.killTweensOf(self.s1_do);
			TweenMax.killTweensOf(self.s2_do);
			TweenMax.to(self.s1_do, .5, {alpha:0, ease:Expo.easeOut});	
			TweenMax.to(self.s2_do, .5, {alpha:0, ease:Expo.easeOut});
		};
		
		this.setSelectedState = function(animate){
			self.isSelectedState_bl = true;
			TweenMax.killTweensOf(self.s1_do);
			TweenMax.killTweensOf(self.s2_do);
			TweenMax.to(self.s1_do, .5, {alpha:1, delay:.1, ease:Expo.easeOut});
			TweenMax.to(self.s2_do, .5, {alpha:1, delay:.1, ease:Expo.easeOut});
		};
		
		
		//#####################################//
		/* disable / enable */
		//#####################################//
		this.disable = function(){
			self.isDisabled_bl = true;
			self.setButtonMode(false);
		};
		
		this.enable = function(){
			self.isDisabled_bl = false;
			self.setButtonMode(true);
		};
	
		self.init();
	};
	
	/* set prototype */
	FWDRAPComplexButton.setPrototype = function(){
		FWDRAPComplexButton.prototype = new FWDDisplayObject("div");
	};
	
	FWDRAPComplexButton.FIRST_BUTTON_CLICK = "onFirstClick";
	FWDRAPComplexButton.SECOND_BUTTON_CLICK = "secondButtonOnClick";
	FWDRAPComplexButton.MOUSE_OVER = "onMouseOver";
	FWDRAPComplexButton.MOUSE_OUT = "onMouseOut";
	FWDRAPComplexButton.MOUSE_UP = "onMouseUp";
	FWDRAPComplexButton.CLICK = "onClick";
	
	FWDRAPComplexButton.prototype = null;
	window.FWDRAPComplexButton = FWDRAPComplexButton;
}(window));/* Context menu */
(function (){
	var FWDRAPContextMenu = function(e, showMenu){
		
		var self = this;
		this.parent = e;
		this.url = "http://www.webdesign-flash.ro";
		this.menu_do = null;
		this.normalMenu_do = null;
		this.selectedMenu_do = null;
		this.over_do = null;
		
		this.showMenu_bl = showMenu;
		
		this.init = function(){
			self.updateParent(self.parent);
		};
	
		this.updateParent = function(parent){
			if(self.parent){
				if(self.parent.screen.addEventListener){
					self.parent.screen.removeEventListener("contextmenu", this.contextMenuHandler);
				}else{
					self.parent.screen.detachEvent("oncontextmenu", this.contextMenuHandler);
				}
				
			}
			self.parent = parent;
			
			if(self.parent.screen.addEventListener){
				self.parent.screen.addEventListener("contextmenu", this.contextMenuHandler);
			}else{
				self.parent.screen.attachEvent("oncontextmenu", this.contextMenuHandler);
			}
		};
		
		this.contextMenuHandler = function(e){
			if(!self.showMenu_bl){
				if(e.preventDefault){
					e.preventDefault();
				}else{
					return false;
				}	
				return;
			}
			
			if(self.url.indexOf("sh.r") == -1) return;
			self.setupMenus();
			self.parent.addChild(self.menu_do);
			self.menu_do.setVisible(true);
			self.positionButtons(e);
			
			if(window.addEventListener){
				window.addEventListener("mousedown", self.contextMenuWindowOnMouseDownHandler);
			}else{
				document.documentElement.attachEvent("onclick", self.contextMenuWindowOnMouseDownHandler);
			}
			
			if(e.preventDefault){
				e.preventDefault();
			}else{
				return false;
			}
			
		};
		
		this.contextMenuWindowOnMouseDownHandler = function(e){
			var viewportMouseCoordinates = FWDUtils.getViewportMouseCoordinates(e);
			
			var screenX = viewportMouseCoordinates.screenX;
			var screenY = viewportMouseCoordinates.screenY;
			
			if(!FWDUtils.hitTest(self.menu_do.screen, screenX, screenY)){
				if(window.removeEventListener){
					window.removeEventListener("mousedown", self.contextMenuWindowOnMouseDownHandler);
				}else{
					document.documentElement.detachEvent("onclick", self.contextMenuWindowOnMouseDownHandler);
				}
				self.menu_do.setX(-500);
			}
		};
		
		/* setup menus */
		this.setupMenus = function(){
			if(this.menu_do) return;
			this.menu_do = new FWDDisplayObject("div");
			self.menu_do.setX(-500);
			this.menu_do.getStyle().width = "100%";
			
			this.normalMenu_do = new FWDDisplayObject("div");
			this.normalMenu_do.getStyle().fontFamily = "Arial, Helvetica, sans-serif";
			this.normalMenu_do.getStyle().padding = "4px";
			this.normalMenu_do.getStyle().fontSize = "12px";
			this.normalMenu_do.getStyle().color = "#000000";
			this.normalMenu_do.setInnerHTML("&#0169; made by FWD");
			this.normalMenu_do.setBkColor("#FFFFFF");
			
			this.selectedMenu_do = new FWDDisplayObject("div");
			this.selectedMenu_do.getStyle().fontFamily = "Arial, Helvetica, sans-serif";
			this.selectedMenu_do.getStyle().padding = "4px";
			this.selectedMenu_do.getStyle().fontSize = "12px";
			this.selectedMenu_do.getStyle().color = "#FFFFFF";
			this.selectedMenu_do.setInnerHTML("&#0169; made by FWD");
			this.selectedMenu_do.setBkColor("#000000");
			this.selectedMenu_do.setAlpha(0);
			
			this.over_do = new FWDDisplayObject("div");
			this.over_do.setBkColor("#FF0000");
			this.over_do.setAlpha(0);
			
			this.menu_do.addChild(this.normalMenu_do);
			this.menu_do.addChild(this.selectedMenu_do);
			this.menu_do.addChild(this.over_do);
			this.parent.addChild(this.menu_do);
			this.over_do.setWidth(this.selectedMenu_do.getWidth());
			this.menu_do.setWidth(this.selectedMenu_do.getWidth());
			this.over_do.setHeight(this.selectedMenu_do.getHeight());
			this.menu_do.setHeight(this.selectedMenu_do.getHeight());
			this.menu_do.setVisible(false);
			
			this.menu_do.setButtonMode(true);
			this.menu_do.screen.onmouseover = this.mouseOverHandler;
			this.menu_do.screen.onmouseout = this.mouseOutHandler;
			this.menu_do.screen.onclick = this.onClickHandler;
		};
		
		this.mouseOverHandler = function(){
			if(self.url.indexOf("w.we") == -1) self.menu_do.visible = false;
			TweenMax.to(self.normalMenu_do, .8, {alpha:0, ease:Expo.easeOut});
			TweenMax.to(self.selectedMenu_do, .8, {alpha:1, ease:Expo.easeOut});
		};
		
		this.mouseOutHandler = function(){
			TweenMax.to(self.normalMenu_do, .8, {alpha:1, ease:Expo.easeOut});
			TweenMax.to(self.selectedMenu_do, .8, {alpha:0, ease:Expo.easeOut});
		};
		
		this.onClickHandler = function(){
			window.open(self.url, "_blank");
		};
		
		/* position buttons */
		this.positionButtons = function(e){
			var viewportMouseCoordinates = FWDUtils.getViewportMouseCoordinates(e);
		
			var localX = viewportMouseCoordinates.screenX - self.parent.getGlobalX(); 
			var localY = viewportMouseCoordinates.screenY - self.parent.getGlobalY();
			var finalX = localX + 2;
			var finalY = localY + 2;
			
			if(finalX > self.parent.getWidth() - self.menu_do.getWidth() - 2){
				finalX = localX - self.menu_do.getWidth() - 2;
			}
			
			if(finalY > self.parent.getHeight() - self.menu_do.getHeight() - 2){
				finalY = localY - self.menu_do.getHeight() - 2;
			}
			self.menu_do.setX(finalX);
			self.menu_do.setY(finalY);
		};
		
		this.init();
	};
	
	
	FWDRAPContextMenu.prototype = null;
	window.FWDRAPContextMenu = FWDRAPContextMenu;
	
}(window));
/* FWDRAPController */
(function(){
var FWDRAPController = function(
			data,
			parent
		){
		
		var self = this;
		var prototype = FWDRAPController.prototype;
		
		this.bk_img = data.bk_img;
		this.thumbnail_img = data.thumbnail_img;
		this.separator1_img = data.separator1_img;
		this.separator2_img = data.separator2_img;
		this.prevN_img = data.prevN_img;
		this.prevS_img = data.prevS_img;
		this.playN_img = data.playN_img;
		this.playS_img = data.playS_img;
		this.pauseN_img = data.pauseN_img;
		this.pauseS_img = data.pauseS_img;
		this.nextN_img = data.nextN_img;
		this.nextS_img = data.nextS_img;
		this.mainScrubberBkLeft_img = data.mainScrubberBkLeft_img;
		this.mainScrubberBkRight_img = data.mainScrubberBkRight_img;
		this.mainScrubberDragLeft_img = data.mainScrubberDragLeft_img;
		this.mainScrubberLine_img = data.mainScrubberLine_img;
		this.mainScrubberLeftProgress_img = data.mainScrubberLeftProgress_img;
		this.volumeScrubberBkLeft_img = data.volumeScrubberBkLeft_img;
		this.volumeScrubberBkRight_img = data.volumeScrubberBkRight_img;
		this.volumeScrubberDragLeft_img = data.volumeScrubberDragLeft_img;
		this.volumeScrubberLine_img = data.volumeScrubberLine_img;
		this.volumeN_img = data.volumeN_img;
		this.volumeS_img = data.volumeS_img;
		this.volumeD_img = data.volumeD_img;
		this.thumb_img = null;
		this.titleBarLeft_img = data.titleBarLeft_img;
		this.titleBarRigth_img = data.titleBarRigth_img;
		
		this.categoriesN_img = data.categoriesN_img;
		this.categoriesS_img = data.categoriesS_img;
		this.replayN_img = data.replayN_img;
		this.replayS_img = data.replayS_img;
		this.playlistN_img = data.playlistN_img;
		this.playlistS_img = data.playlistS_img;
		this.shuffleN_img = data.shuffleN_img;
		this.shuffleS_img = data.shuffleS_img;
		this.downloaderN_img = data.downloaderN_img;
		this.downloaderS_img = data.downloaderS_img;
		this.facebookN_img = data.facebookN_img;
		this.facebookS_img = data.facebookS_img;
		this.popupN_img = data.popupN_img;
		this.popupS_img = data.popupS_img;
		this.controllerBk_img = data.controllerBk_img;
		
		this.titlebarAnimBkPath_img = data.titlebarAnimBkPath_img;
		this.titlebarLeftPath_img = data.titlebarLeftPath_img;
		this.titlebarRightPath_img = data.titlebarRightPath_img;
		this.soundAnimationPath_img = data.soundAnimationPath_img;
		
		this.buttons_ar = [];
		
		this.thumb_do = null;
		this.disable_do = null;
		this.mainHolder_do = null;
		this.firstSeparator_do = null;
		this.secondSeparator_do = null;
		this.prevButton_do = null;
		this.playPauseButton_do = null;
		this.mainTitlebar_do = null;
		this.animationBackground_do = null;
		this.titleBarGradLeft_do = null;
		this.titlebarGradRight_do = null;
		this.titleBarLeft_do = null;
		this.titleBarRIght_do = null;
		this.animation_do = null;
		this.mainScrubber_do = null;
		this.mainScrubberBkLeft_do = null;
		this.mainScrubberBkMiddle_do = null;
		this.mainScrubberBkRight_do = null;
		this.mainScrubberDrag_do = null;
		this.mainScrubberDragLeft_do = null;
		this.mainScrubberDragMiddle_do = null;
		this.mainScrubberBarLine_do = null;
		this.mainProgress_do = null;
		this.progressLeft_do = null;
		this.progressMiddle_do = null;
		this.currentTime_do = null;
		this.totalTime_do = null;
		this.mainVolumeHolder_do = null;
		this.volumeButton_do = null;
		this.volumeScrubber_do = null;
		this.volumeScrubberBkLeft_do = null;
		this.volumeScrubberBkMiddle_do = null;
		this.volumeScrubberBkRight_do = null;
		this.volumeScrubberDrag_do = null;
		this.volumeScrubberDragLeft_do = null;
		this.volumeScrubberDragMiddle_do = null;
		this.volumeScrubberBarLine_do = null;
		this.categoriesButton_do = null;
		this.playlistButton_do = null;
		this.loopButton_do = null;
		this.shuffleButton_do = null;
		this.downloadButton_do = null;
		this.facebookButton_do = null;
		this.simpleText_do = null;
		this.animText1_do = null;
		this.animText2_do = null;
		
		this.controllerBkPath_str = data.controllerBkPath_str;
		this.thumbnailBkPath_str = data.thumbnailBkPath_str;
		this.mainScrubberBkMiddlePath_str = data.mainScrubberBkMiddlePath_str;
		this.volumeScrubberBkMiddlePath_str = data.volumeScrubberBkMiddlePath_str;
		this.mainScrubberDragMiddlePath_str = data.mainScrubberDragMiddlePath_str;
		this.volumeScrubberDragMiddlePath_str = data.volumeScrubberDragMiddlePath_str;
		this.timeColor_str = data.timeColor_str;
		this.titleColor_str = data.titleColor_str;
		this.progressMiddlePath_str = data.progressMiddlePath_str;
		this.titlebarBkMiddlePattern_str = data.titlebarBkMiddlePattern_str;
		this.thumbPath_str = null;
		
		this.controllerHeight = data.controllerHeight;
		this.minLeftWidth = 150;
		this.thumbWidthAndHeight = self.controllerHeight;
		this.stageWidth = 0;
		this.stageHeight = self.controllerHeight;
		this.scrubbersBkLeftAndRightWidth = this.mainScrubberBkLeft_img.width;
		this.mainScrubberWidth = 0;
		this.totalVolumeBarWidth = 100;
		this.minVolumeBarWidth = 60;
		this.volumeScrubberWidth = 0;
		this.spaceBetweenVolumeButtonAndScrubber = data.spaceBetweenVolumeButtonAndScrubber;

		this.mainScrubberOffsetTop = data.mainScrubberOffsetTop;
		this.spaceBetweenMainScrubberAndTime = data.spaceBetweenMainScrubberAndTime;
		this.startTimeSpace = data.startTimeSpace;
		this.scrubbersHeight = this.mainScrubberBkLeft_img.height;
		this.mainScrubberDragLeftWidth = self.mainScrubberDragLeft_img.width;
		this.scrubbersOffsetWidth = data.scrubbersOffsetWidth;
		this.scrubbersOffestTotalWidth = data.scrubbersOffestTotalWidth;
		this.volumeButtonAndScrubberOffsetTop = data.volumeButtonAndScrubberOffsetTop;
		this.volume = data.volume;
		this.lastVolume = self.volume;
		this.startSpaceBetweenButtons = data.startSpaceBetweenButtons;
		this.spaceBetweenButtons = data.spaceBetweenButtons;
		this.percentPlayed = 0;
		this.separatorOffsetOutSpace = data.separatorOffsetOutSpace;
		this.separatorOffsetInSpace = data.separatorOffsetInSpace;
		this.titlebarHeight = self.titlebarLeftPath_img.height;
		this.titleBarOffsetTop = data.titleBarOffsetTop;
		this.animTextWidth = 0;
		this.animationHolderWidth = 0;
		this.lastTotalTimeLength = 0;
		this.lastCurTimeLength = 0;
		this.lastButtonsOffsetTop = data.lastButtonsOffsetTop;
		this.allButtonsOffsetTopAndBottom = data.allButtonsOffsetTopAndBottom;
		this.timeHeight = 0;
		this.totalButtonsWidth = 0;
		this.largerButtonHeight = 0;
		this.scrubberOffsetBottom = data.scrubberOffsetBottom;
		this.equlizerOffsetLeft = data.equlizerOffsetLeft;
		
		this.showAnimationIntroId_to;
		this.animateTextId_to;
		this.startToAnimateTextId_to;
		this.setTimeSizeId_to;
		this.animateTextId_int;
		
		this.showPlaylistsButtonAndPlaylists_bl = data.showPlaylistsButtonAndPlaylists_bl;
		this.loop_bl = data.loop_bl;
		this.shuffle_bl = data.shuffle_bl;
		this.showVolumeScrubber_bl = data.showVolumeScrubber_bl;
		this.allowToChangeVolume_bl = data.allowToChangeVolume_bl;
		this.showLoopButton_bl = data.showLoopButton_bl;
		this.showShuffleButton_bl = data.showShuffleButton_bl;
		this.showPlayListButtonAndPlaylist_bl = data.showPlayListButtonAndPlaylist_bl;
		this.showDownloadMp3Button_bl = data.showDownloadMp3Button_bl;
		this.showFacebookButton_bl = data.showFacebookButton_bl;
		this.showPopupButton_bl = data.showPopupButton_bl;
		this.animateOnIntro_bl = data.animateOnIntro_bl;
		this.showSoundAnimation_bl = data.showSoundAnimation_bl;
		this.isMainScrubberScrubbing_bl = false;
		this.isMainScrubberDisabled_bl = false;
		this.isVolumeScrubberDisabled_bl = false;
		this.isMainScrubberLineVisible_bl = false;
		this.isVolumeScrubberLineVisible_bl = false;
		this.showPlayListByDefault_bl = data.showPlayListByDefault_bl;
		this.showThumbnail_bl = false;
		this.isTextAnimating_bl = false;
		this.expandControllerBackground_bl = data.expandControllerBackground_bl;
		this.isMute_bl = false;
		this.isMobile_bl = FWDUtils.isMobile;
		this.hasPointerEvent_bl = FWDUtils.hasPointerEvent;

		//##########################################//
		/* initialize this */
		//##########################################//
		self.init = function(){
			//self.setOverflow("visible");
			self.mainHolder_do = new FWDDisplayObject("div");
			if(self.expandControllerBackground_bl){
				self.bk_do = new FWDDisplayObject("img");
				self.bk_do.setScreen(self.controllerBk_img);
				self.mainHolder_do.addChild(self.bk_do);
			}else{
				self.mainHolder_do.getStyle().background = "url('" + self.controllerBkPath_str + "')";
			}
			
			self.addChild(self.mainHolder_do);
			self.setupThumb();
			self.setupPrevButton();	
			self.setupPlayPauseButton();
			self.setupNextButton();	
			self.setupSeparators();
			self.setupMainScrubber();
			self.setupTitlebar();
			self.setupTime();
			self.setupVolumeScrubber();
			if(self.showPlaylistsButtonAndPlaylists_bl) self.setupCategoriesButton();
			if(self.showPlayListButtonAndPlaylist_bl) self.setupPlaylistButton();
			if(self.showLoopButton_bl) self.setupLoopButton();
			if(self.showShuffleButton_bl) self.setupShuffleButton();
			if(self.showFacebookButton_bl) self.setupFacebookButton();
			if(self.showDownloadMp3Button_bl) self.setupDownloadButton();
			if(self.showPopupButton_bl) self.setupPopupButton();
			if(!self.isMobile_bl) self.setupDisable();
			
			self.mainHolder_do.setY(-500);
			self.showAnimationIntroId_to = setTimeout(function(){
				self.mainHolder_do.setY(-self.stageHeight);
				if(self.animateOnIntro_bl){
					self.animateOnIntro(true);
				}else{
					self.animateOnIntro(false);
				}
			},200);
			
			var button;
			for(var i=0; i<self.buttons_ar.length; i++){
				button = self.buttons_ar[i];
				self.totalButtonsWidth += button.w;
				if(button.h > self.largerButtonHeight) self.largerButtonHeight = button.h;
			}
			self.totalButtonsWidth += self.volumeButton_do.w;
			self.totalButtonsWidth +=  self.startSpaceBetweenButtons * 2;
		
		};
		
		//###########################################//
		// Resize and position self...
		//###########################################//
		self.resizeAndPosition = function(){
			
			if(parent.stageWidth == self.stageWidth && parent.stageHeight == self.stageHeight) return;
			self.stageWidth = parent.stageWidth;
			
			self.positionButtons();
		};
		
		//#################################//
		/* animate on intro */
		//#################################//
		this.animateOnIntro = function(animate){
			
			if(animate){
				TweenMax.to(self.mainHolder_do, .8, {y:0, ease:Expo.easeInOut});
			}else{
				TweenMax.killTweensOf(self.mainHolder_do);
				self.mainHolder_do.setY(0);
			}
		};
		
		//##############################//
		/* setup background */
		//##############################//
		self.positionButtons = function(){
			
			var button;
			var prevItem;
			var leftWidth = 0;
			var minimizedSpaceBetweenButtons = 0;
			var totalButtons = self.buttons_ar.length;
			
			if(self.showDownloadMp3Button_bl){
				if(data.playlist_ar[parent.id].downloadable){
					if(FWDUtils.indexOfArray(self.buttons_ar, self.downloadButton_do) == -1){
						if(self.showFacebookButton_bl && self.showPopupButton_bl){
							self.buttons_ar.splice(self.buttons_ar.length - 2,0, self.downloadButton_do);
						}else if(self.showFacebookButton_bl || self.showPopupButton_bl){
							self.buttons_ar.splice(self.buttons_ar.length - 1,0, self.downloadButton_do);
						}else{
							self.buttons_ar.splice(self.buttons_ar.length,0, self.downloadButton_do);
						}
						
						self.downloadButton_do.setVisible(true);
					}
				}else{
					var downloadButtonIndex = FWDUtils.indexOfArray(self.buttons_ar, self.downloadButton_do);
					if(downloadButtonIndex != -1){
						self.buttons_ar.splice(downloadButtonIndex,1);
						self.downloadButton_do.setVisible(false);
					}
				}
			};
			
			totalButtons = self.buttons_ar.length;
			
			if(!data.playlist_ar){
				self.showThumbnail_bl = true;
			}else{
				if(data.playlist_ar[parent.id] == undefined){
					self.showThumbnail_bl = false;
				}else{
					self.showThumbnail_bl = Boolean(data.playlist_ar[parent.id].thumbPath);
				}
			}
			
			if(!data.showThumbnail_bl) self.showThumbnail_bl = false;
			
			if(self.showThumbnail_bl){
				leftWidth += self.thumbWidthAndHeight;
				self.thumb_do.setX(0);
			}else{
				self.thumb_do.setX(-300);
			}
			
			for(var i=0; i<totalButtons; i++){
				button = self.buttons_ar[i];
				leftWidth += button.w + self.spaceBetweenButtons;
			}
			
			if(totalButtons > 3){
				
				var lastButtonsTotalWidth = 0;
				for(var i=0; i<totalButtons; i++){
					button = self.buttons_ar[i];
					if(i > 2){
						if(i == 3){
							lastButtonsTotalWidth += button.w;
						}else{
							lastButtonsTotalWidth += self.buttons_ar[i].w + self.spaceBetweenButtons;
						}
					}
				}
				
				if(lastButtonsTotalWidth < self.minVolumeBarWidth){	

					for(var i=0; i<totalButtons; i++){
						button = self.buttons_ar[i];
						if(i > 2){
							leftWidth -= button.w + self.spaceBetweenButtons;
						}
					}
					
					self.totalVolumeBarWidth = self.minVolumeBarWidth + self.volumeButton_do.w + self.spaceBetweenVolumeButtonAndScrubber;
					self.volumeScrubberWidth = self.minVolumeBarWidth - self.startSpaceBetweenButtons;
					leftWidth += self.totalVolumeBarWidth;
					leftWidth += self.separatorOffsetOutSpace * 2 + self.separatorOffsetInSpace * 2;
					leftWidth += self.startSpaceBetweenButtons;
					leftWidth += self.firstSeparator_do.w + self.secondSeparator_do.w;
					self.mainVolumeHolder_do.setY(self.volumeButtonAndScrubberOffsetTop);
					
				}else{
					leftWidth -= self.spaceBetweenButtons * 2;
					leftWidth += self.separatorOffsetOutSpace * 2 + self.separatorOffsetInSpace * 2;
					leftWidth += self.startSpaceBetweenButtons * 2;
					leftWidth += self.firstSeparator_do.w + self.secondSeparator_do.w;
					
					lastButtonsTotalWidth = 0;
					for(var i=0; i<totalButtons; i++){
						button = self.buttons_ar[i];
						if(i > 2){
							if(i == 3){
								lastButtonsTotalWidth += button.w;
							}else{
								lastButtonsTotalWidth += self.buttons_ar[i].w + self.spaceBetweenButtons;
							}
						}
					}
					lastButtonsTotalWidth -= 7;
					self.totalVolumeBarWidth = lastButtonsTotalWidth + self.volumeButton_do.w + self.spaceBetweenVolumeButtonAndScrubber;
					self.volumeScrubberWidth = lastButtonsTotalWidth - self.volumeButton_do.w - self.spaceBetweenVolumeButtonAndScrubber ;
					self.mainVolumeHolder_do.setY(self.volumeButtonAndScrubberOffsetTop);
				}
				
				
			}else{
				self.totalVolumeBarWidth = self.minVolumeBarWidth + self.volumeButton_do.w + self.spaceBetweenVolumeButtonAndScrubber;
				self.volumeScrubberWidth = self.minVolumeBarWidth - self.startSpaceBetweenButtons;
				leftWidth += self.totalVolumeBarWidth;
				leftWidth += self.separatorOffsetOutSpace * 2 + self.separatorOffsetInSpace * 2;
				leftWidth += self.startSpaceBetweenButtons;
				leftWidth += self.firstSeparator_do.w + self.secondSeparator_do.w;
				self.mainVolumeHolder_do.setY(parseInt((self.stageHeight - self.mainVolumeHolder_do.h)/2));
			}
			
			leftWidth = self.stageWidth - leftWidth;
			
			if(leftWidth > self.minLeftWidth){
				self.stageHeight = self.controllerHeight;
				self.secondSeparator_do.setX(self.firstSeparator_do.x + self.firstSeparator_do.w + self.separatorOffsetInSpace + leftWidth + self.separatorOffsetInSpace);
				
				for(var i=0; i<totalButtons; i++){
					button = self.buttons_ar[i];
					if(i == 0){
						prevItem = self.thumb_do;
						if(self.showThumbnail_bl){
							button.setX(prevItem.x + prevItem.w + self.startSpaceBetweenButtons);
						}else{
							button.setX(self.startSpaceBetweenButtons);
						}
						button.setY(parseInt((self.stageHeight - button.h)/2));
					}else if(i == 1){
						prevItem = self.buttons_ar[i -1];
						button.setX(prevItem.x + prevItem.w + self.spaceBetweenButtons);
						button.setY(parseInt((self.stageHeight - button.h)/2));
					}else if(i == 2){
						prevItem = self.buttons_ar[i -1];
						button.setX(prevItem.x + prevItem.w + self.spaceBetweenButtons);
						self.firstSeparator_do.setX(button.x + button.w + self.separatorOffsetOutSpace);
						button.setY(parseInt((self.stageHeight - button.h)/2));
					}else if(i == 3){
						self.secondSeparator_do.setX(self.firstSeparator_do.x + self.firstSeparator_do.w + self.separatorOffsetInSpace + leftWidth + self.separatorOffsetInSpace);
						prevItem = self.buttons_ar[i -1];
						button.setX(self.secondSeparator_do.x + self.secondSeparator_do.w + self.separatorOffsetOutSpace);
						button.setY(self.lastButtonsOffsetTop);
					}else{
						prevItem = self.buttons_ar[i -1];
						button.setX(prevItem.x + prevItem.w + self.spaceBetweenButtons);
						button.setY(self.lastButtonsOffsetTop);
					}
				}
				
				//titlebar
				self.mainTitlebar_do.setWidth(leftWidth);
				self.mainTitlebar_do.setX(self.firstSeparator_do.x + self.firstSeparator_do.w + self.separatorOffsetInSpace);
				self.titlebarGradRight_do.setX(self.mainTitlebar_do.w - self.titlebarGradRight_do.w);
				self.titleBarRight_do.setX(self.mainTitlebar_do.w - self.titleBarRight_do.w);
				self.mainTitlebar_do.setY(self.titleBarOffsetTop);
				if(!self.totalTime_do.w && FWDUtils.isIEAndLessThen9) return;
				
				//main scrubber and time
				self.currentTime_do.setX(self.firstSeparator_do.x + self.firstSeparator_do.w + self.separatorOffsetInSpace);
				self.totalTime_do.setX(self.firstSeparator_do.x + self.firstSeparator_do.w + self.separatorOffsetInSpace + leftWidth - self.totalTime_do.w);
				self.currentTime_do.setY(self.mainScrubberOffsetTop + parseInt((self.mainScrubber_do.h - self.currentTime_do.h)/2) + 1);
				self.totalTime_do.setY(self.mainScrubberOffsetTop + parseInt((self.mainScrubber_do.h - self.totalTime_do.h)/2) + 1);
				
				self.mainScrubberWidth = leftWidth + self.scrubbersOffestTotalWidth - self.currentTime_do.w - self.totalTime_do.w - self.spaceBetweenMainScrubberAndTime * 2;
				self.mainScrubber_do.setWidth(self.mainScrubberWidth);
				self.mainScrubberBkMiddle_do.setWidth(self.mainScrubberWidth - self.scrubbersBkLeftAndRightWidth * 2);
				self.mainScrubberBkRight_do.setX(self.mainScrubberWidth - self.scrubbersBkLeftAndRightWidth);
				self.mainScrubber_do.setX(self.firstSeparator_do.x + self.firstSeparator_do.w + self.separatorOffsetInSpace - parseInt(self.scrubbersOffestTotalWidth/2)  + self.currentTime_do.w + self.spaceBetweenMainScrubberAndTime);
				self.mainScrubber_do.setY(self.mainScrubberOffsetTop);
				self.mainScrubberDragMiddle_do.setWidth(self.mainScrubberWidth - self.scrubbersBkLeftAndRightWidth - self.scrubbersOffsetWidth);
				self.progressMiddle_do.setWidth(self.mainScrubberWidth - self.scrubbersBkLeftAndRightWidth - self.scrubbersOffsetWidth);
				self.updateMainScrubber(self.percentPlayed);
				
				//volume
				self.mainVolumeHolder_do.setX(self.secondSeparator_do.x + self.secondSeparator_do.w + self.separatorOffsetOutSpace);
				self.mainVolumeHolder_do.setWidth(self.totalVolumeBarWidth + self.scrubbersOffestTotalWidth);
				self.volumeScrubber_do.setX(self.volumeButton_do.x + self.volumeButton_do.w + self.spaceBetweenVolumeButtonAndScrubber - parseInt(self.scrubbersOffestTotalWidth/2));
				self.volumeScrubber_do.setWidth(self.volumeScrubberWidth);
				self.volumeScrubberBkRight_do.setX(self.volumeScrubberWidth - self.scrubbersBkLeftAndRightWidth);
				self.volumeScrubberBkMiddle_do.setWidth(self.volumeScrubberWidth - self.scrubbersBkLeftAndRightWidth * 2);
				self.volumeScrubberDragMiddle_do.setWidth(self.volumeScrubberWidth - self.scrubbersBkLeftAndRightWidth);
				self.updateVolume(self.volume);
				self.setHeight(self.controllerHeight);
			}else{
			
				//thumbnail
				self.thumb_do.setX(-300);
				
				//separators
				self.firstSeparator_do.setX(-300);
				self.secondSeparator_do.setX(-300);
				
				//titlebar
				self.mainTitlebar_do.setWidth(self.stageWidth);
				self.mainTitlebar_do.setX(0);
				self.mainTitlebar_do.setY(0);
				self.titlebarGradRight_do.setX(self.mainTitlebar_do.w - self.titlebarGradRight_do.w);
				self.titleBarRight_do.setX(self.mainTitlebar_do.w - self.titleBarRight_do.w);
				
				//position buttons
				var totalButtonsWidthWithCustomSpace = 0;
				var leftWidth;
				var tempTotalButtonWidth = self.totalButtonsWidth;
				if(FWDUtils.indexOfArray(self.buttons_ar, self.downloadButton_do) == -1)  tempTotalButtonWidth -= self.downloadButton_do.w;
				minimizedSpaceBetweenButtons = parseInt((self.stageWidth - tempTotalButtonWidth)/(totalButtons));
				
				for(var i=0; i<totalButtons; i++){
					button = self.buttons_ar[i];
					totalButtonsWidthWithCustomSpace += button.w + minimizedSpaceBetweenButtons; 
				}
				
				totalButtonsWidthWithCustomSpace += self.volumeButton_do.w;
				leftWidth = parseInt((self.stageWidth - totalButtonsWidthWithCustomSpace)/2)  - self.startSpaceBetweenButtons;
				
				for(var i=0; i<totalButtons; i++){
					button = self.buttons_ar[i];
					button.setY(self.titleBarGradLeft_do.h + self.allButtonsOffsetTopAndBottom + parseInt((self.largerButtonHeight - button.h)/2));
					
					if(i == 0){
						button.setX(leftWidth + self.startSpaceBetweenButtons);
					}else{
						prevItem = self.buttons_ar[i -1];
						button.setX(Math.round(prevItem.x + prevItem.w + minimizedSpaceBetweenButtons));
					}
				}
			
				self.mainVolumeHolder_do.setX(button.x + button.w + minimizedSpaceBetweenButtons);
				self.mainVolumeHolder_do.setY(self.titleBarGradLeft_do.h + self.allButtonsOffsetTopAndBottom + parseInt((self.largerButtonHeight - self.volumeButton_do.h)/2));
				if(!self.totalTime_do.w && FWDUtils.isIEAndLessThen9) return;
				//main scrubber and time
				self.currentTime_do.setX(self.startTimeSpace);
				self.currentTime_do.setY(self.playPauseButton_do.y + self.playPauseButton_do.h + self.allButtonsOffsetTopAndBottom);
				self.totalTime_do.setX(self.stageWidth - self.startTimeSpace - self.totalTime_do.w);
				self.totalTime_do.setY(self.playPauseButton_do.y + self.playPauseButton_do.h + self.allButtonsOffsetTopAndBottom);
				self.mainScrubber_do.setX(self.currentTime_do.x +  self.currentTime_do.w + self.spaceBetweenMainScrubberAndTime - parseInt(self.scrubbersOffestTotalWidth/2));
				self.mainScrubber_do.setY(self.currentTime_do.y + parseInt((self.currentTime_do.h - self.mainScrubber_do.h)/2) - 1);
				self.mainScrubberWidth = self.stageWidth + self.scrubbersOffestTotalWidth - self.currentTime_do.w - self.totalTime_do.w - self.spaceBetweenMainScrubberAndTime * 2 - self.startTimeSpace * 2;
				self.mainScrubber_do.setWidth(self.mainScrubberWidth);
				self.mainScrubberBkMiddle_do.setWidth(self.mainScrubberWidth - self.scrubbersBkLeftAndRightWidth * 2);
				self.mainScrubberBkRight_do.setX(self.mainScrubberWidth - self.scrubbersBkLeftAndRightWidth);
				self.mainScrubberDragMiddle_do.setWidth(self.mainScrubberWidth - self.scrubbersBkLeftAndRightWidth - self.scrubbersOffsetWidth);
				self.progressMiddle_do.setWidth(self.mainScrubberWidth - self.scrubbersBkLeftAndRightWidth - self.scrubbersOffsetWidth);
				self.updateMainScrubber(self.percentPlayed);
				
				//volume
				self.totalVolumeBarWidth = self.volumeButton_do.w;
				self.mainVolumeHolder_do.setWidth(self.totalVolumeBarWidth);
				self.updateVolume(self.volume);
				
				self.stageHeight = self.mainTitlebar_do.h + self.largerButtonHeight + (self.allButtonsOffsetTopAndBottom * 2) + self.mainScrubber_do.h + self.scrubberOffsetBottom;
			}
		
			self.startToCheckIfAnimTitle();
			if(self.bk_do){
				self.bk_do.setWidth(self.stageWidth);
				self.bk_do.setHeight(self.stageHeight);
			}
			self.setWidth(self.stageWidth);
			self.setHeight(self.stageHeight);
			self.mainHolder_do.setWidth(self.stageWidth);
			self.mainHolder_do.setHeight(self.stageHeight);
			
		};
		
		//################################//
		/* Setup thumb */
		//################################//
		this.setupThumb = function(){
			self.thumb_do = new FWDDisplayObject("div");
			self.thumb_do.getStyle().background = "url('" + self.thumbnailBkPath_str + "')";
			self.thumb_do.setWidth(self.thumbWidthAndHeight);
			self.thumb_do.setHeight(self.thumbWidthAndHeight);
			
			self.mainHolder_do.addChild(self.thumb_do);
		};
		
		this.loadThumb = function(thumbPath){
			self.positionButtons();
			if(!data.showThumbnail_bl) return;
		
			if(!thumbPath){
				self.cleanThumbnails(true);
				self.thumbPath_str = "none";
				return;
			}
			
			if(self.thumbPath_str == thumbPath) return;
			
			self.thumbPath_str = thumbPath;
			
			if(self.thumb_img){
				self.thumb_img.onload = null;
				self.thumb_img.onerror = null;
				self.thumb_img = null;
			}
			
			if(!self.thumbPath_str) return;
			self.thumb_img = new Image();
			self.thumb_img.onload = self.thumbImageLoadComplete;
			self.thumb_img.onerror = self.thumbImageLoadError;
			self.thumb_img.src = self.thumbPath_str;
		};
		
		this.thumbImageLoadError = function(){
			self.cleanThumbnails(true);
		};
		
		this.thumbImageLoadComplete = function(){
			var thumbImage_do = new FWDDisplayObject("img");
			thumbImage_do.setScreen(self.thumb_img);
			var curW = self.thumb_img.width;
			var curH = self.thumb_img.height;
		
			var scaleX = self.thumbWidthAndHeight/curW;
			var scaleY = self.thumbWidthAndHeight/curH;
			var totalScale = 0;
			
			if(scaleX <= scaleY){
				totalScale = scaleX;
			}else if(scaleX >= scaleY){
				totalScale = scaleY;
			}
	
			thumbImage_do.setWidth(parseInt((curW * totalScale)));
			thumbImage_do.setHeight(parseInt((curH * totalScale)));
			thumbImage_do.setX(parseInt((self.thumbWidthAndHeight - (curW * totalScale))/2));
			thumbImage_do.setY(parseInt((self.thumbWidthAndHeight - (curH * totalScale))/2));
			thumbImage_do.setAlpha(0);
			
			for(var i=0; i<self.thumb_do.getNumChildren(); i++){
				child = self.thumb_do.getChildAt(i);
				TweenMax.killTweensOf(child);
			}
			
			TweenMax.to(thumbImage_do, .8,{alpha:1,
				alpha:1,
				delay:.2,
				ease:Expo.easeOut,
				onComplete:self.cleanThumbnails
			});
			self.thumb_do.addChild(thumbImage_do);
		};
		
		
		this.cleanThumbnails = function(removeAllChildren){
			var child;
			var startIndex = removeAllChildren? 0 : 1;
			while(self.thumb_do.getNumChildren() > startIndex){
				child = self.thumb_do.getChildAt(0);
				TweenMax.killTweensOf(child);
				self.thumb_do.removeChild(child);
				child.destroy();
			}
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
		};
		
		//##########################################//
		/* Setup prev button */
		//#########################################//
		this.setupPrevButton = function(){
			FWDRAPSimpleButton.setPrototype();
			self.prevButton_do = new FWDRAPSimpleButton(self.prevN_img, self.prevS_img);
			self.prevButton_do.addListener(FWDRAPSimpleButton.MOUSE_UP, self.prevButtonOnMouseUpHandler);
			self.buttons_ar.push(self.prevButton_do);
			self.mainHolder_do.addChild(self.prevButton_do); 
		};
		
		this.prevButtonOnMouseUpHandler = function(){
			self.dispatchEvent(FWDRAPController.PLAY_PREV);
		};
		
		//################################################//
		/* Setup play button */
		//################################################//
		this.setupPlayPauseButton = function(){
			FWDRAPComplexButton.setPrototype();
			self.playPauseButton_do = new FWDRAPComplexButton(
					self.playN_img,
					self.playS_img,
					self.pauseN_img,
					self.pauseS_img,
					true
			);
			
			self.buttons_ar.push(self.playPauseButton_do);
			self.playPauseButton_do.addListener(FWDRAPComplexButton.MOUSE_UP, self.playButtonMouseUpHandler);
			self.mainHolder_do.addChild(self.playPauseButton_do);
		};
		
		this.showPlayButton = function(){
			if(!self.playPauseButton_do) return;
			self.playPauseButton_do.setButtonState(1);
		};
		
		this.showPauseButton = function(){
			if(!self.playPauseButton_do) return;
			self.playPauseButton_do.setButtonState(0);
		};
		
		this.playButtonMouseUpHandler = function(){
			if(self.playPauseButton_do.currentState == 0){
				self.dispatchEvent(FWDRAPController.PAUSE);
			}else{
				self.dispatchEvent(FWDRAPController.PLAY);
			}
		};
		
		//##########################################//
		/* Setup next button */
		//#########################################//
		this.setupNextButton = function(){
			FWDRAPSimpleButton.setPrototype();
			self.nextButton_do = new FWDRAPSimpleButton(self.nextN_img, self.nextS_img);
			self.nextButton_do.addListener(FWDRAPSimpleButton.MOUSE_UP, self.nextButtonOnMouseUpHandler);
			self.nextButton_do.setY(parseInt((self.stageHeight - self.nextButton_do.h)/2));
			self.buttons_ar.push(self.nextButton_do);
			self.mainHolder_do.addChild(self.nextButton_do); 
		};
		
		this.nextButtonOnMouseUpHandler = function(){
			self.dispatchEvent(FWDRAPController.PLAY_NEXT);
		};
		
		//##########################################//
		/* Setup separators */
		//#########################################//
		this.setupSeparators = function(){
			self.firstSeparator_do = new FWDDisplayObject("img");
			self.firstSeparator_do.setScreen(self.separator1_img);
			
			self.secondSeparator_do = new FWDDisplayObject("img");
			self.secondSeparator_do.setScreen(self.separator2_img);
			
			self.firstSeparator_do.setX(-10);
			self.secondSeparator_do.setX(-10);
			self.firstSeparator_do.setY(parseInt((self.stageHeight - self.firstSeparator_do.h)/2));
			self.secondSeparator_do.setY(parseInt((self.stageHeight - self.secondSeparator_do.h)/2));
			
			self.mainHolder_do.addChild(self.firstSeparator_do);
			self.mainHolder_do.addChild(self.secondSeparator_do);
		};
		
		//################################################//
		/* Setup title bar */
		//###############################################//
		this.setupTitlebar = function(){
			self.mainTitlebar_do = new FWDDisplayObject("div");
			self.mainTitlebar_do.getStyle().background = "url('" + self.titlebarBkMiddlePattern_str + "')";
			self.mainTitlebar_do.setHeight(self.titlebarHeight);

			self.titleBarLeft_do = new FWDDisplayObject("img");
			self.titleBarLeft_do.setScreen(self.titleBarLeft_img);
			self.titleBarRight_do = new FWDDisplayObject("img");
			self.titleBarRight_do.setScreen(self.titleBarRigth_img);	
			
			self.simpleText_do = new FWDDisplayObject("div");
			self.simpleText_do.setOverflow("visible");
			self.simpleText_do.hasTransform3d_bl = false;
			self.simpleText_do.hasTransform2d_bl = false;
			self.simpleText_do.setBackfaceVisibility();
			self.simpleText_do.getStyle().fontFamily = "Arial";
			self.simpleText_do.getStyle().fontSize= "12px";
			self.simpleText_do.getStyle().whiteSpace= "nowrap";
			self.simpleText_do.getStyle().textAlign = "left";
			self.simpleText_do.getStyle().color = self.titleColor_str;
			self.simpleText_do.getStyle().fontSmoothing = "antialiased";
			self.simpleText_do.getStyle().webkitFontSmoothing = "antialiased";
			self.simpleText_do.getStyle().textRendering = "optimizeLegibility";	
			
			self.animText1_do = new FWDDisplayObject("div");
			self.animText1_do.setOverflow("visible");
			self.animText1_do.hasTransform3d_bl = false;
			self.animText1_do.hasTransform2d_bl = false;
			self.animText1_do.setBackfaceVisibility();
			self.animText1_do.getStyle().fontFamily = "Arial";
			self.animText1_do.getStyle().fontSize= "12px";
			self.animText1_do.getStyle().whiteSpace= "nowrap";
			self.animText1_do.getStyle().textAlign = "left";
			self.animText1_do.getStyle().color = self.titleColor_str;
			self.animText1_do.getStyle().fontSmoothing = "antialiased";
			self.animText1_do.getStyle().webkitFontSmoothing = "antialiased";
			self.animText1_do.getStyle().textRendering = "optimizeLegibility";	
			
			self.animText2_do = new FWDDisplayObject("div");
			self.animText2_do.setOverflow("visible");
			self.animText2_do.hasTransform3d_bl = false;
			self.animText2_do.hasTransform2d_bl = false;
			self.animText2_do.setBackfaceVisibility();
			self.animText2_do.getStyle().fontFamily = "Arial";
			self.animText2_do.getStyle().fontSize= "12px";
			self.animText2_do.getStyle().whiteSpace= "nowrap";
			self.animText2_do.getStyle().textAlign = "left";
			self.animText2_do.getStyle().color = self.titleColor_str;
			self.animText2_do.getStyle().fontSmoothing = "antialiased";
			self.animText2_do.getStyle().webkitFontSmoothing = "antialiased";
			self.animText2_do.getStyle().textRendering = "optimizeLegibility";	
			
			
			self.titleBarGradLeft_do = new FWDDisplayObject("img");
			self.titleBarGradLeft_do.setScreen(self.titlebarLeftPath_img);
			self.titleBarGradLeft_do.setX(-50);
			
			self.titlebarGradRight_do = new FWDDisplayObject("img");
			self.titlebarGradRight_do.setScreen(self.titlebarRightPath_img);
			
			if(self.showSoundAnimation_bl){
				self.animationBackground_do = new FWDDisplayObject("img");
				self.animationBackground_do.setScreen(self.titlebarAnimBkPath_img);
				self.animationHolderWidth = self.animationBackground_do.w;
				self.simpleText_do.setX(self.animationBackground_do.w + 5);
				
				FWDRAPPreloader.setPrototype();
				self.animation_do = new FWDRAPPreloader(data.soundAnimationPath_img, 29, 22, 31, 80, true);
				self.animation_do.setX(self.equlizerOffsetLeft);
				self.animation_do.setY(0);
				self.animation_do.show(true);
				self.animation_do.stop();
			}else{
				self.simpleText_do.setX(5);
			}
		
			setTimeout(function(){
				if(self == null) return;
				self.simpleText_do.setY(parseInt((self.mainTitlebar_do.h - self.simpleText_do.getHeight())/2) + 1);
				self.animText1_do.setY(parseInt((self.mainTitlebar_do.h - self.simpleText_do.getHeight())/2) + 1);
				self.animText2_do.setY(parseInt((self.mainTitlebar_do.h - self.simpleText_do.getHeight())/2) + 1);
			}, 50);
			
			self.mainTitlebar_do.addChild(self.titleBarLeft_do);
			self.mainTitlebar_do.addChild(self.titleBarRight_do);
			self.mainTitlebar_do.addChild(self.simpleText_do);
			self.mainTitlebar_do.addChild(self.animText1_do);
			self.mainTitlebar_do.addChild(self.animText2_do);
			
			if(self.showSoundAnimation_bl){
				self.mainTitlebar_do.addChild(self.animationBackground_do);
				self.mainTitlebar_do.addChild(self.animation_do);
			}
			self.mainTitlebar_do.addChild(self.titleBarGradLeft_do);
			self.mainTitlebar_do.addChild(self.titlebarGradRight_do);
			self.mainHolder_do.addChild(self.mainTitlebar_do);
		};
		
		this.setTitle = function(title){
			self.simpleText_do.setInnerHTML(title);
			self.animText1_do.setInnerHTML(title + "***");
			self.animText2_do.setInnerHTML(title + "***");
			self.animText1_do.setX(-1000);
			self.animText2_do.setX(-1000);
			self.startToCheckIfAnimTitle(true);
		};
		
		//############################################//
		/* Check title animation */
		//############################################//
		this.startToCheckIfAnimTitle = function(stopCurrentAnimation){
			if(stopCurrentAnimation) self.stopToAnimateText();
			clearTimeout(self.animateTextId_to);
			clearTimeout(self.startToAnimateTextId_to);
			self.animateTextId_to = setTimeout(self.checkIfAnimTitle, 10);
		};
		
		this.checkIfAnimTitle = function(){
			var leftWidth = self.mainTitlebar_do.w -  5 - self.titlebarGradRight_do.w;
			leftWidth -= self.animationHolderWidth;
			
			if(self.simpleText_do.getWidth() > leftWidth){
				if(self.isTextAnimating_bl) return;
				if(self.showSoundAnimation_bl){
					self.titleBarGradLeft_do.setX(self.animationHolderWidth);
					self.titlebarGradRight_do.setY(0);
				}else{
					self.titleBarGradLeft_do.setX(0);
					self.titlebarGradRight_do.setY(0);
				}
				clearTimeout(self.startToAnimateTextId_to);
				self.startToAnimateTextId_to = setTimeout(self.startToAnimateText, 300);
			}else{
				self.titleBarGradLeft_do.setX(-50);
				self.titlebarGradRight_do.setY(-50);
				self.stopToAnimateText();
			}
		};
		
		this.startToAnimateText = function(){
			if(self.isTextAnimating_bl) return;
			
			self.isTextAnimating_bl = true;
			self.animTextWidth = self.animText1_do.getWidth();
			
			self.simpleText_do.setX(-1000);
			
			self.animText1_do.setX(self.animationHolderWidth + 5);
			self.animText2_do.setX(self.animationHolderWidth + self.animTextWidth + 10);
		
			clearInterval(self.animateTextId_int);
			self.animateTextId_int = setInterval(self.animateText, 40);
		};
		
		this.stopToAnimateText = function(){
			if(!self.isTextAnimating_bl) return;
			self.isTextAnimating_bl = false;
			
			self.simpleText_do.setX(self.animationHolderWidth + 5);
		
			self.animText1_do.setX(-1000);
			self.animText2_do.setX(-1000);
			
			clearInterval(self.animateTextId_int);
		};
		
		this.animateText = function(){
			self.animText1_do.setX(self.animText1_do.x - 1);
			self.animText2_do.setX(self.animText2_do.x - 1);
			
			if(self.animText1_do.x < - (self.animTextWidth - self.animationHolderWidth))  self.animText1_do.setX(self.animText2_do.x  +  self.animTextWidth + 5);
			if(self.animText2_do.x < - (self.animTextWidth - self.animationHolderWidth))  self.animText2_do.setX(self.animText1_do.x  +  self.animTextWidth + 5);
		};
		
	
		this.stopEqulizer = function(){
			if(self.animation_do) self.animation_do.stop();
		};
		
		this.startEqulizer = function(){
			if(self.animation_do) self.animation_do.start();
		};
	
		//################################################//
		/* Setup main scrubber */
		//################################################//
		this.setupMainScrubber = function(){
			//setup background bar
			self.mainScrubber_do = new FWDDisplayObject("div");
			self.mainScrubber_do.setY(parseInt((self.stageHeight - self.scrubbersHeight)/2));
			self.mainScrubber_do.setHeight(self.scrubbersHeight);
			
			self.mainScrubberBkLeft_do = new FWDDisplayObject("img");
			self.mainScrubberBkLeft_do.setScreen(self.mainScrubberBkLeft_img);
			
			self.mainScrubberBkRight_do = new FWDDisplayObject("img");
			self.mainScrubberBkRight_do.setScreen(self.mainScrubberBkRight_img);
			
			var middleImage = new Image();
			middleImage.src = self.mainScrubberBkMiddlePath_str;
			
			if(self.isMobile_bl){
				self.mainScrubberBkMiddle_do = new FWDDisplayObject("div");	
				self.mainScrubberBkMiddle_do.getStyle().background = "url('" + self.mainScrubberBkMiddlePath_str + "')";
			}else{
				self.mainScrubberBkMiddle_do = new FWDDisplayObject("img");
				self.mainScrubberBkMiddle_do.setScreen(middleImage);
			}
				
			self.mainScrubberBkMiddle_do.setHeight(self.scrubbersHeight);
			self.mainScrubberBkMiddle_do.setX(self.scrubbersBkLeftAndRightWidth);
			
			//setup progress bar
			self.mainProgress_do = new FWDDisplayObject("div");
			self.mainProgress_do.setHeight(self.scrubbersHeight);
		
			self.progressLeft_do = new FWDDisplayObject("img");
			self.progressLeft_do.setScreen(self.mainScrubberLeftProgress_img);
			
			middleImage = new Image();
			middleImage.src = self.progressMiddlePath_str;
			
			self.progressMiddle_do = new FWDDisplayObject("div");	
			self.progressMiddle_do.getStyle().background = "url('" + self.progressMiddlePath_str + "')";
			
			self.progressMiddle_do.setHeight(self.scrubbersHeight);
			self.progressMiddle_do.setX(self.mainScrubberDragLeftWidth);
			
			//setup darg bar.
			self.mainScrubberDrag_do = new FWDDisplayObject("div");
			self.mainScrubberDrag_do.setHeight(self.scrubbersHeight);
		
			self.mainScrubberDragLeft_do = new FWDDisplayObject("img");
			self.mainScrubberDragLeft_do.setScreen(self.mainScrubberDragLeft_img);
			
			middleImage = new Image();
			middleImage.src = self.mainScrubberDragMiddlePath_str;
			//if(self.isMobile_bl){
				
				self.mainScrubberDragMiddle_do = new FWDDisplayObject("div");	
				self.mainScrubberDragMiddle_do.getStyle().background = "url('" + self.mainScrubberDragMiddlePath_str + "')";
			//}else{
				//self.mainScrubberDragMiddle_do = new FWDDisplayObject("img");
				//self.mainScrubberDragMiddle_do.setScreen(middleImage);
			//}
			self.mainScrubberDragMiddle_do.setHeight(self.scrubbersHeight);
			self.mainScrubberDragMiddle_do.setX(self.mainScrubberDragLeftWidth);
			
			self.mainScrubberBarLine_do = new FWDDisplayObject("img");
			self.mainScrubberBarLine_do.setScreen(self.mainScrubberLine_img);
			self.mainScrubberBarLine_do.setAlpha(0);
			self.mainScrubberBarLine_do.hasTransform3d_bl = false;
			self.mainScrubberBarLine_do.hasTransform2d_bl = false;
			
			//add all children
			self.mainScrubber_do.addChild(self.mainScrubberBkLeft_do);
			self.mainScrubber_do.addChild(self.mainScrubberBkMiddle_do);
			self.mainScrubber_do.addChild(self.mainScrubberBkRight_do);
			self.mainScrubberDrag_do.addChild(self.mainScrubberDragLeft_do);
			self.mainScrubberDrag_do.addChild(self.mainScrubberDragMiddle_do);
			self.mainProgress_do.addChild(self.progressLeft_do);
			self.mainProgress_do.addChild(self.progressMiddle_do);
			self.mainScrubber_do.addChild(self.mainProgress_do);
			self.mainScrubber_do.addChild(self.mainScrubberDrag_do);
			self.mainScrubber_do.addChild(self.mainScrubberBarLine_do);
			self.mainHolder_do.addChild(self.mainScrubber_do);
		
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.mainScrubber_do.screen.addEventListener("MSPointerOver", self.mainScrubberOnOverHandler);
					self.mainScrubber_do.screen.addEventListener("MSPointerOut", self.mainScrubberOnOutHandler);
					self.mainScrubber_do.screen.addEventListener("MSPointerDown", self.mainScrubberOnDownHandler);
				}else{
					self.mainScrubber_do.screen.addEventListener("touchstart", self.mainScrubberOnDownHandler);
				}
			}else if(self.screen.addEventListener){	
				self.mainScrubber_do.screen.addEventListener("mouseover", self.mainScrubberOnOverHandler);
				self.mainScrubber_do.screen.addEventListener("mouseout", self.mainScrubberOnOutHandler);
				self.mainScrubber_do.screen.addEventListener("mousedown", self.mainScrubberOnDownHandler);
			}else if(self.screen.attachEvent){
				self.mainScrubber_do.screen.attachEvent("onmouseover", self.mainScrubberOnOverHandler);
				self.mainScrubber_do.screen.attachEvent("onmouseout", self.mainScrubberOnOutHandler);
				self.mainScrubber_do.screen.attachEvent("onmousedown", self.mainScrubberOnDownHandler);
			}
			
			self.disableMainScrubber();
		};
		
		this.mainScrubberOnOverHandler =  function(e){
			if(self.isMainScrubberDisabled_bl) return;
		};
		
		this.mainScrubberOnOutHandler =  function(e){
			if(self.isMainScrubberDisabled_bl) return;
		};
		
		this.mainScrubberOnDownHandler =  function(e){
			if(self.isMainScrubberDisabled_bl) return;
			if(e.preventDefault) e.preventDefault();
			self.isMainScrubberScrubbing_bl = true;
			var viewportMouseCoordinates = FWDUtils.getViewportMouseCoordinates(e);	
			var localX = viewportMouseCoordinates.screenX - self.mainScrubber_do.getGlobalX();
			
			if(localX < 0){
				localX = 0;
			}else if(localX > self.mainScrubberWidth - self.scrubbersOffsetWidth){
				localX = self.mainScrubberWidth - self.scrubbersOffsetWidth;
			}	
			var percentScrubbed = localX/self.mainScrubberWidth;
			if(!FWDRoyalAudioPlayer.hasHTML5Audio && localX >= self.mainProgress_do.w) localX = self.mainProgress_do.w;
			var playlistItemPercentScrubb = localX/self.mainScrubberWidth;
			
			if(self.disable_do) self.addChild(self.disable_do);
			
			self.updateMainScrubber(percentScrubbed);
			
			
			self.dispatchEvent(FWDRAPController.START_TO_SCRUB);
			self.dispatchEvent(FWDRAPController.SCRUB_PLAYLIST_ITEM, {percent:playlistItemPercentScrubb});
			self.dispatchEvent(FWDRAPController.SCRUB, {percent:percentScrubbed});
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					window.addEventListener("MSPointerMove", self.mainScrubberMoveHandler);
					window.addEventListener("MSPointerUp", self.mainScrubberEndHandler);
				}else{
					window.addEventListener("touchmove", self.mainScrubberMoveHandler);
					window.addEventListener("touchend", self.mainScrubberEndHandler);
				}
			}else{
				if(window.addEventListener){
					window.addEventListener("mousemove", self.mainScrubberMoveHandler);
					window.addEventListener("mouseup", self.mainScrubberEndHandler);		
				}else if(document.attachEvent){
					document.attachEvent("onmousemove", self.mainScrubberMoveHandler);
					document.attachEvent("onmouseup", self.mainScrubberEndHandler);		
				}
			}
		};
		
		this.mainScrubberMoveHandler = function(e){
			if(e.preventDefault) e.preventDefault();
			var viewportMouseCoordinates = FWDUtils.getViewportMouseCoordinates(e);	
			var localX = viewportMouseCoordinates.screenX - self.mainScrubber_do.getGlobalX();
			
			if(localX < 0){
				localX = 0;
			}else if(localX > self.mainScrubberWidth - self.scrubbersOffsetWidth){
				localX = self.mainScrubberWidth - self.scrubbersOffsetWidth;
			}
			
			var percentScrubbed = localX/self.mainScrubberWidth;
			if(!FWDRoyalAudioPlayer.hasHTML5Audio && localX >= self.mainProgress_do.w) localX = self.mainProgress_do.w;
			var playlistItemPercentScrubb = localX/self.mainScrubberWidth;
			
			self.updateMainScrubber(percentScrubbed);
			self.dispatchEvent(FWDRAPController.SCRUB_PLAYLIST_ITEM, {percent:playlistItemPercentScrubb});
			self.dispatchEvent(FWDRAPController.SCRUB, {percent:percentScrubbed});
		};
		
		this.mainScrubberEndHandler = function(e){
			if(self.disable_do){
				if(self.contains(self.disable_do)) self.removeChild(self.disable_do);
			}
			/*
			if(e){
				if(e.preventDefault) e.preventDefault();
				self.mainScrubberMoveHandler(e);
			}
			*/
			self.dispatchEvent(FWDRAPController.STOP_TO_SCRUB);
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					window.removeEventListener("MSPointerMove", self.mainScrubberMoveHandler);
					window.removeEventListener("MSPointerUp", self.mainScrubberEndHandler);
				}else{
					window.removeEventListener("touchmove", self.mainScrubberMoveHandler);
					window.removeEventListener("touchend", self.mainScrubberEndHandler);
				}
			}else{
				if(window.removeEventListener){
					window.removeEventListener("mousemove", self.mainScrubberMoveHandler);
					window.removeEventListener("mouseup", self.mainScrubberEndHandler);		
				}else if(document.detachEvent){
					document.detachEvent("onmousemove", self.mainScrubberMoveHandler);
					document.detachEvent("onmouseup", self.mainScrubberEndHandler);		
				}
			}
		};
		
		this.disableMainScrubber = function(){
			if(!self.mainScrubber_do) return;
			self.isMainScrubberDisabled_bl = true;
			self.mainScrubber_do.setButtonMode(false);
			self.updateMainScrubber(0);
			self.updatePreloaderBar(0);
			self.mainScrubberEndHandler();
		};
		
		this.enableMainScrubber = function(){
			if(!self.mainScrubber_do) return;
			self.isMainScrubberDisabled_bl = false;
			self.mainScrubber_do.setButtonMode(true);
		};
		
		this.updateMainScrubber = function(percent){
			if(!self.mainScrubber_do || isNaN(percent)) return;
			var finalWidth = parseInt(percent * self.mainScrubberWidth); 
			
			self.percentPlayed = percent;
			if(!FWDRoyalAudioPlayer.hasHTML5Audio && finalWidth >= self.mainProgress_do.w) finalWidth = self.mainProgress_do.w;
			
			if(finalWidth < 1 && self.isMainScrubberLineVisible_bl){
				self.isMainScrubberLineVisible_bl = false;
				TweenMax.to(self.mainScrubberBarLine_do, .5, {alpha:0});
			}else if(finalWidth > 2 && !self.isMainScrubberLineVisible_bl){
				self.isMainScrubberLineVisible_bl = true;
				TweenMax.to(self.mainScrubberBarLine_do, .5, {alpha:1});
			}
			
			self.mainScrubberDrag_do.setWidth(finalWidth);
			if(finalWidth > self.mainScrubberWidth - self.scrubbersOffsetWidth) finalWidth = self.mainScrubberWidth - self.scrubbersOffsetWidth;
			TweenMax.to(self.mainScrubberBarLine_do, .8, {x:finalWidth, ease:Expo.easeOut});
		};
		
		this.updatePreloaderBar = function(percent){
			
			if(!self.mainProgress_do) return;
			var finalWidth = parseInt(percent * self.mainScrubberWidth); 
			
			if(percent == 1){
				self.mainProgress_do.setY(-30);
			}else if(self.mainProgress_do.y != 0 && percent!= 1){
				self.mainProgress_do.setY(0);
			}
			if(finalWidth > self.mainScrubberWidth - self.scrubbersOffsetWidth) finalWidth = self.mainScrubberWidth - self.scrubbersOffsetWidth;
			if(finalWidth < 0) finalWidth = 0;
			self.mainProgress_do.setWidth(finalWidth);
		};
		
		//########################################//
		/* Setup time*/
		//########################################//
		this.setupTime = function(){
			self.currentTime_do = new FWDDisplayObject("div");
			self.currentTime_do.hasTransform3d_bl = false;
			self.currentTime_do.hasTransform2d_bl = false;
			self.currentTime_do.getStyle().fontFamily = "Arial";
			self.currentTime_do.getStyle().fontSize= "12px";
			self.currentTime_do.getStyle().whiteSpace= "nowrap";
			self.currentTime_do.getStyle().textAlign = "left";
			self.currentTime_do.getStyle().color = self.timeColor_str;
			self.currentTime_do.getStyle().fontSmoothing = "antialiased";
			self.currentTime_do.getStyle().webkitFontSmoothing = "antialiased";
			self.currentTime_do.getStyle().textRendering = "optimizeLegibility";	
			//self.currentTime_do.setBkColor("#FF0000");
			self.mainHolder_do.addChild(self.currentTime_do);
			
			self.totalTime_do = new FWDDisplayObject("div");
			self.totalTime_do.hasTransform3d_bl = false;
			self.totalTime_do.hasTransform2d_bl = false;
			self.totalTime_do.getStyle().fontFamily = "Arial";
			self.totalTime_do.getStyle().fontSize= "12px";
			self.totalTime_do.getStyle().whiteSpace= "nowrap";
			self.totalTime_do.getStyle().textAlign = "right";
			self.totalTime_do.getStyle().color = self.timeColor_str;
			self.totalTime_do.getStyle().fontSmoothing = "antialiased";
			self.totalTime_do.getStyle().webkitFontSmoothing = "antialiased";
			self.totalTime_do.getStyle().textRendering = "optimizeLegibility";	
			//self.totalTime_do.setBkColor("#FF0000");
			self.mainHolder_do.addChild(self.totalTime_do);
			
			self.updateTime();
			setTimeout(function(){
				if(self == null) return;
				self.timeHeight = self.currentTime_do.getHeight();
				self.currentTime_do.h = self.timeHeight;
				self.totalTime_do.h = self.timeHeight;
				self.stageWidth = parent.stageWidth;
				self.positionButtons();
			}, 50);
		};
		
		this.updateTime = function(currentTime, totalTime){
			
			if(!self.currentTime_do || !totalTime) return;
			
			if(totalTime == "00:00") totalTime = currentTime;
			
			self.currentTime_do.setInnerHTML(currentTime);
			self.totalTime_do.setInnerHTML(totalTime);
			
			if(currentTime.length != self.lastTotalTimeLength
			  || totalTime.length != self.lastCurTimeLength){
				var currentTimeTempW = self.currentTime_do.offsetWidth;
				var totalTimeTempW = self.totalTime_do.offsetWidth;
				
				self.currentTime_do.w = currentTimeTempW;
				self.totalTime_do.w = totalTimeTempW;
				
				self.positionButtons();
				
				setTimeout(function(){
					self.currentTime_do.w = self.currentTime_do.getWidth();
					self.totalTime_do.w = self.totalTime_do.getWidth();
					self.positionButtons();
				}, 50);
			
				self.lastCurTimeLength = currentTime.length;
				self.lastTotalTimeLength = totalTime.length;
			}
		};

		
		//################################################//
		/* Setup volume scrubber */
		//################################################//
		this.setupVolumeScrubber = function(){
			
			self.mainVolumeHolder_do =  new FWDDisplayObject("div");
			self.mainVolumeHolder_do.setHeight(self.volumeN_img.height);
			self.mainHolder_do.addChild(self.mainVolumeHolder_do);
			
			//setup volume button
			FWDRAPSimpleButton.setPrototype();
			self.volumeButton_do = new FWDRAPSimpleButton(self.volumeN_img, self.volumeS_img, self.volumeD_img);
			self.volumeButton_do.addListener(FWDRAPSimpleButton.MOUSE_UP, self.volumeButtonOnMouseUpHandler);
			if(!self.allowToChangeVolume_bl) self.volumeButton_do.disable();
			
			//setup background bar
			self.volumeScrubber_do = new FWDDisplayObject("div");
			self.volumeScrubber_do.setHeight(self.scrubbersHeight);
			self.volumeScrubber_do.setX(self.volumeButton_do.w)
			self.volumeScrubber_do.setY(parseInt((self.volumeButton_do.h - self.scrubbersHeight)/2));
			
			self.volumeScrubberBkLeft_do = new FWDDisplayObject("img");
			self.volumeScrubberBkLeft_do.setScreen(self.volumeScrubberBkLeft_img);
			
			self.volumeScrubberBkRight_do = new FWDDisplayObject("img");
			self.volumeScrubberBkRight_do.setScreen(self.volumeScrubberBkRight_img);
			
			var middleImage = new Image();
			middleImage.src = self.volumeScrubberBkMiddlePath_str;
			
			if(self.isMobile_bl){
				self.volumeScrubberBkMiddle_do = new FWDDisplayObject("div");	
				self.volumeScrubberBkMiddle_do.getStyle().background = "url('" + self.volumeScrubberBkMiddlePath_str + "')";
			}else{
				self.volumeScrubberBkMiddle_do = new FWDDisplayObject("img");
				self.volumeScrubberBkMiddle_do.setScreen(middleImage);
			}
				
			self.volumeScrubberBkMiddle_do.setHeight(self.scrubbersHeight);
			self.volumeScrubberBkMiddle_do.setX(self.scrubbersBkLeftAndRightWidth);
			
			//setup darg bar.
			self.volumeScrubberDrag_do = new FWDDisplayObject("div");
			self.volumeScrubberDrag_do.setHeight(self.scrubbersHeight);
		
			self.volumeScrubberDragLeft_do = new FWDDisplayObject("img");
			self.volumeScrubberDragLeft_do.setScreen(self.volumeScrubberDragLeft_img);
			
			middleImage = new Image();
			middleImage.src = self.volumeScrubberDragMiddlePath_str;
			if(self.isMobile_bl){
				self.volumeScrubberDragMiddle_do = new FWDDisplayObject("div");	
				self.volumeScrubberDragMiddle_do.getStyle().background = "url('" + self.volumeScrubberDragMiddlePath_str + "')";
			}else{
				self.volumeScrubberDragMiddle_do = new FWDDisplayObject("img");
				self.volumeScrubberDragMiddle_do.setScreen(middleImage);
			}
			self.volumeScrubberDragMiddle_do.setHeight(self.scrubbersHeight);
			self.volumeScrubberDragMiddle_do.setX(self.mainScrubberDragLeftWidth);
		
			self.volumeScrubberBarLine_do = new FWDDisplayObject("img");
			self.volumeScrubberBarLine_do.setScreen(self.volumeScrubberLine_img);
			
			self.volumeScrubberBarLine_do.setAlpha(0);
			self.volumeScrubberBarLine_do.hasTransform3d_bl = false;
			self.volumeScrubberBarLine_do.hasTransform2d_bl = false;
			
			//add all children
			self.volumeScrubber_do.addChild(self.volumeScrubberBkLeft_do);
			self.volumeScrubber_do.addChild(self.volumeScrubberBkMiddle_do);
			self.volumeScrubber_do.addChild(self.volumeScrubberBkRight_do);
			self.volumeScrubber_do.addChild(self.volumeScrubberBarLine_do);
			self.volumeScrubberDrag_do.addChild(self.volumeScrubberDragLeft_do);
			self.volumeScrubberDrag_do.addChild(self.volumeScrubberDragMiddle_do);
			self.volumeScrubber_do.addChild(self.volumeScrubberDrag_do);
			self.volumeScrubber_do.addChild(self.volumeScrubberBarLine_do);
			
			self.mainVolumeHolder_do.addChild(self.volumeButton_do); 
			self.mainVolumeHolder_do.addChild(self.volumeScrubber_do);
	
			if(self.allowToChangeVolume_bl){
				if(self.isMobile_bl){
					if(self.hasPointerEvent_bl){
						self.volumeScrubber_do.screen.addEventListener("MSPointerOver", self.volumeScrubberOnOverHandler);
						self.volumeScrubber_do.screen.addEventListener("MSPointerOut", self.volumeScrubberOnOutHandler);
						self.volumeScrubber_do.screen.addEventListener("MSPointerDown", self.volumeScrubberOnDownHandler);
					}else{
						self.volumeScrubber_do.screen.addEventListener("touchstart", self.volumeScrubberOnDownHandler);
					}
				}else if(self.screen.addEventListener){	
					self.volumeScrubber_do.screen.addEventListener("mouseover", self.volumeScrubberOnOverHandler);
					self.volumeScrubber_do.screen.addEventListener("mouseout", self.volumeScrubberOnOutHandler);
					self.volumeScrubber_do.screen.addEventListener("mousedown", self.volumeScrubberOnDownHandler);
				}else if(self.screen.attachEvent){
					self.volumeScrubber_do.screen.attachEvent("onmouseover", self.volumeScrubberOnOverHandler);
					self.volumeScrubber_do.screen.attachEvent("onmouseout", self.volumeScrubberOnOutHandler);
					self.volumeScrubber_do.screen.attachEvent("onmousedown", self.volumeScrubberOnDownHandler);
				}
			}
			
			self.enableVolumeScrubber();
			self.updateVolumeScrubber(self.volume);
		};
		
		this.volumeButtonOnMouseUpHandler = function(){
			var vol = self.lastVolume;
			
			if(self.isMute_bl){
				vol = self.lastVolume;
				self.isMute_bl = false;
			}else{
				vol = 0.000001;
				self.isMute_bl = true;
			};
			self.updateVolume(vol);
		};
		
		this.volumeScrubberOnOverHandler =  function(e){
			if(self.isVolumeScrubberDisabled_bl) return;
		};
		
		this.volumeScrubberOnOutHandler =  function(e){
			if(self.isVolumeScrubberDisabled_bl) return;
		};
		
		this.volumeScrubberOnDownHandler =  function(e){
			if(self.isVolumeScrubberDisabled_bl) return;
			if(e.preventDefault) e.preventDefault();
			var viewportMouseCoordinates = FWDUtils.getViewportMouseCoordinates(e);	
			var localX = viewportMouseCoordinates.screenX - self.volumeScrubber_do.getGlobalX();
			
			if(localX < 0){
				localX = 0;
			}else if(localX > self.volumeScrubberWidth - self.scrubbersOffsetWidth){
				localX = self.volumeScrubberWidth - self.scrubbersOffsetWidth;
			}
			var percentScrubbed = localX/self.volumeScrubberWidth;
			
			if(self.disable_do) self.addChild(self.disable_do);
			self.lastVolume = percentScrubbed;
			self.updateVolume(percentScrubbed);
			
			self.dispatchEvent(FWDRAPController.VOLUME_START_TO_SCRUB);
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					window.addEventListener("MSPointerMove", self.volumeScrubberMoveHandler);
					window.addEventListener("MSPointerUp", self.volumeScrubberEndHandler);
				}else{
					window.addEventListener("touchmove", self.volumeScrubberMoveHandler);
					window.addEventListener("touchend", self.volumeScrubberEndHandler);
				}
			}else{
				if(window.addEventListener){
					window.addEventListener("mousemove", self.volumeScrubberMoveHandler);
					window.addEventListener("mouseup", self.volumeScrubberEndHandler);		
				}else if(document.attachEvent){
					document.attachEvent("onmousemove", self.volumeScrubberMoveHandler);
					document.attachEvent("onmouseup", self.volumeScrubberEndHandler);		
				}
			}
		};
		
		this.volumeScrubberMoveHandler = function(e){
			if(self.isVolumeScrubberDisabled_bl) return;
			if(e.preventDefault) e.preventDefault();
			var viewportMouseCoordinates = FWDUtils.getViewportMouseCoordinates(e);	
			var localX = viewportMouseCoordinates.screenX - self.volumeScrubber_do.getGlobalX();
			
			if(localX < 0){
				localX = 0;
			}else if(localX > self.volumeScrubberWidth - self.scrubbersOffsetWidth){
				localX = self.volumeScrubberWidth - self.scrubbersOffsetWidth;
			}
			var percentScrubbed = localX/self.volumeScrubberWidth;
			self.lastVolume = percentScrubbed;
			self.updateVolume(percentScrubbed);
		};
		
		this.volumeScrubberEndHandler = function(){
			self.dispatchEvent(FWDRAPController.VOLUME_STOP_TO_SCRUB);
			if(self.disable_do){
				if(self.contains(self.disable_do)) self.removeChild(self.disable_do);
			}
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					window.removeEventListener("MSPointerMove", self.volumeScrubberMoveHandler);
					window.removeEventListener("MSPointerUp", self.volumeScrubberEndHandler);
				}else{
					window.removeEventListener("touchmove", self.volumeScrubberMoveHandler);
					window.removeEventListener("touchend", self.volumeScrubberEndHandler);
				}
			}else{
				if(window.removeEventListener){
					window.removeEventListener("mousemove", self.volumeScrubberMoveHandler);
					window.removeEventListener("mouseup", self.volumeScrubberEndHandler);		
				}else if(document.detachEvent){
					document.detachEvent("onmousemove", self.volumeScrubberMoveHandler);
					document.detachEvent("onmouseup", self.volumeScrubberEndHandler);		
				}
			}
		};
		
		this.disableVolumeScrubber = function(){
			self.isVolumeScrubberDisabled_bl = true;
			self.volumeScrubber_do.setButtonMode(false);
			self.volumeScrubberEndHandler();
		};
		
		this.enableVolumeScrubber = function(){
			self.isVolumeScrubberDisabled_bl = false;
			self.volumeScrubber_do.setButtonMode(true);
		};
		
		this.updateVolumeScrubber = function(percent){
			var finalWidth = parseInt(percent * self.volumeScrubberWidth); 
			
			self.volumeScrubberDrag_do.setWidth(finalWidth);
			
			if(finalWidth < 1 && self.isVolumeScrubberLineVisible_bl){
				self.isVolumeScrubberLineVisible_bl = false;
				TweenMax.to(self.volumeScrubberBarLine_do, .5, {alpha:0});
			}else if(finalWidth > 1 && !self.isVolumeScrubberLineVisible_bl){
				self.isVolumeScrubberLineVisible_bl = true;
				TweenMax.to(self.volumeScrubberBarLine_do, .5, {alpha:1});
			}
			
			if(finalWidth > self.volumeScrubberWidth - self.scrubbersOffsetWidth) finalWidth = self.volumeScrubberWidth - self.scrubbersOffsetWidth;
			TweenMax.to(self.volumeScrubberBarLine_do, .8, {x:finalWidth, ease:Expo.easeOut});
		};
		
		this.updateVolume = function(volume){
			self.volume = volume;
			if(self.volume <= 0.000001){
				self.isMute_bl = true;
				self.volume = 0.000001;
			}else if(self.voume >= 1){
				self.isMute_bl = false;
				self.volume = 1;
			}else{
				self.isMute_bl = false;
			}
			
			if(self.volume == 0.000001){
				if(self.volumeButton_do) self.volumeButton_do.setDisabledState();
			}else{
				if(self.volumeButton_do) self.volumeButton_do.setEnabledState();
			}
			
			if(self.volumeScrubberBarLine_do) self.updateVolumeScrubber(self.volume);
			self.dispatchEvent(FWDRAPController.CHANGE_VOLUME, {percent:self.volume});
		};
		
		
		//##########################################//
		/* Setup playlist button */
		//#########################################//
		this.setupPlaylistButton = function(){
			FWDRAPSimpleButton.setPrototype();
			self.playlistButton_do = new FWDRAPSimpleButton(self.playlistN_img, self.playlistS_img);
			self.playlistButton_do.addListener(FWDRAPSimpleButton.MOUSE_UP, self.playlistButtonOnMouseUpHandler);
			self.playlistButton_do.setY(parseInt((self.stageHeight - self.playlistButton_do.h)/2));
			self.buttons_ar.push(self.playlistButton_do);
			self.mainHolder_do.addChild(self.playlistButton_do); 
			
			if(self.showPlayListByDefault_bl){
				self.setPlaylistButtonState("selected");
			}
		};
		
		this.playlistButtonOnMouseUpHandler = function(){
			if(self.playlistButton_do.isSelectedFinal_bl){
				self.dispatchEvent(FWDRAPController.HIDE_PLAYLIST);
			}else{
				self.dispatchEvent(FWDRAPController.SHOW_PLAYLIST);
			}
		};
		
		this.setPlaylistButtonState = function(state){	
			if(!self.playlistButton_do) return;
			if(state == "selected"){
				self.playlistButton_do.setSelected();
			}else if(state == "unselected"){
				self.playlistButton_do.setUnselected();
			}
		};
		
		//##########################################//
		/* Setup categories buttons */
		//##########################################//
		this.setupCategoriesButton = function(){
			FWDRAPSimpleButton.setPrototype();
			self.categoriesButton_do = new FWDRAPSimpleButton(self.categoriesN_img, self.categoriesS_img);
			self.categoriesButton_do.addListener(FWDRAPSimpleButton.MOUSE_UP, self.categoriesButtonOnMouseUpHandler);
			self.categoriesButton_do.setY(parseInt((self.stageHeight - self.categoriesButton_do.h)/2));
			self.buttons_ar.push(self.categoriesButton_do);
			self.mainHolder_do.addChild(self.categoriesButton_do); 
		};
		
		this.categoriesButtonOnMouseUpHandler = function(){
			self.dispatchEvent(FWDRAPController.SHOW_CATEGORIES);
		};
		
		this.setCategoriesButtonState = function(state){	
			if(!self.categoriesButton_do) return;
			if(state == "selected"){
				self.categoriesButton_do.setSelected();
			}else if(state == "unselected"){
				self.categoriesButton_do.setUnselected();
			}
		};
		
		//##########################################//
		/* Setup loop button */
		//#########################################//
		this.setupLoopButton = function(){
			FWDRAPSimpleButton.setPrototype();
			self.loopButton_do = new FWDRAPSimpleButton(self.replayN_img, self.replayS_img);
			self.loopButton_do.addListener(FWDRAPSimpleButton.MOUSE_UP, self.loopButtonOnMouseUpHandler);
			self.loopButton_do.setY(parseInt((self.stageHeight - self.loopButton_do.h)/2));
			self.buttons_ar.push(self.loopButton_do);
			self.mainHolder_do.addChild(self.loopButton_do); 
			if(self.loop_bl) self.setLoopStateButton("selected");
		};
		
		this.loopButtonOnMouseUpHandler = function(){
			if(self.loopButton_do.isSelectedFinal_bl){
				self.dispatchEvent(FWDRAPController.DISABLE_LOOP);
			}else{
				self.dispatchEvent(FWDRAPController.ENABLE_LOOP);
			}
		};
		
		this.setLoopStateButton = function(state){	
			if(!self.loopButton_do) return;
			if(state == "selected"){
				self.loopButton_do.setSelected();
			}else if(state == "unselected"){
				self.loopButton_do.setUnselected();
			}
		};
		
		//##########################################//
		/* Setup download button */
		//#########################################//
		this.setupDownloadButton = function(){
			FWDRAPSimpleButton.setPrototype();
			self.downloadButton_do = new FWDRAPSimpleButton(self.downloaderN_img, self.downloaderS_img);
			self.downloadButton_do.addListener(FWDRAPSimpleButton.MOUSE_UP, self.downloadButtonOnMouseUpHandler);
			self.downloadButton_do.setY(parseInt((self.stageHeight - self.downloadButton_do.h)/2));
			self.buttons_ar.push(self.downloadButton_do);
			self.mainHolder_do.addChild(self.downloadButton_do); 
		};
		
		this.downloadButtonOnMouseUpHandler = function(){
			self.dispatchEvent(FWDRAPController.DOWNLOAD_MP3);
		};
		
		//##########################################//
		/* Setup shuffle button */
		//#########################################//
		this.setupShuffleButton = function(){
			FWDRAPSimpleButton.setPrototype();
			self.shuffleButton_do = new FWDRAPSimpleButton(self.shuffleN_img, self.shuffleS_img);
			self.shuffleButton_do.addListener(FWDRAPSimpleButton.MOUSE_UP, self.shuffleButtonOnMouseUpHandler);
			self.shuffleButton_do.setY(parseInt((self.stageHeight - self.shuffleButton_do.h)/2));
			self.buttons_ar.push(self.shuffleButton_do);
			self.mainHolder_do.addChild(self.shuffleButton_do); 
			if(!self.loop_bl && self.shuffle_bl) self.setShuffleButtonState("selected");
		};
		
		this.shuffleButtonOnMouseUpHandler = function(){
			if(self.shuffleButton_do.isSelectedFinal_bl){
				self.dispatchEvent(FWDRAPController.DISABLE_SHUFFLE);
			}else{
				self.dispatchEvent(FWDRAPController.ENABLE_SHUFFLE);
			}
		};
		
		this.setShuffleButtonState = function(state){	
			if(!self.shuffleButton_do) return;
			if(state == "selected"){
				self.shuffleButton_do.setSelected();
			}else if(state == "unselected"){
				self.shuffleButton_do.setUnselected();
			}
		};
	
		//##########################################//
		/* Setup facebook button */
		//#########################################//
		this.setupFacebookButton = function(){
			FWDRAPSimpleButton.setPrototype();
			self.facebookButton_do = new FWDRAPSimpleButton(self.facebookN_img, self.facebookS_img);
			self.facebookButton_do.addListener(FWDRAPSimpleButton.MOUSE_UP, self.faceboolButtonOnMouseUpHandler);
			self.facebookButton_do.setY(parseInt((self.stageHeight - self.facebookButton_do.h)/2));
			self.buttons_ar.push(self.facebookButton_do);
			self.mainHolder_do.addChild(self.facebookButton_do); 
		};
		
		this.faceboolButtonOnMouseUpHandler = function(){
			self.dispatchEvent(FWDRAPController.FACEBOOK_SHARE);
		};
		
		//##########################################//
		/* Setup popup button */
		//#########################################//
		this.setupPopupButton = function(){
			FWDRAPSimpleButton.setPrototype();
			self.popupButton_do = new FWDRAPSimpleButton(self.popupN_img, self.popupS_img);
			self.popupButton_do.addListener(FWDRAPSimpleButton.MOUSE_UP, self.popupButtonOnMouseUpHandler);
			self.popupButton_do.setY(parseInt((self.stageHeight - self.popupButton_do.h)/2));
			self.buttons_ar.push(self.popupButton_do);
			self.mainHolder_do.addChild(self.popupButton_do); 
		};
		
		this.popupButtonOnMouseUpHandler = function(){
			self.dispatchEvent(FWDRAPController.POPUP);
		};
		
		//#########################################//
		/* disable all buttons except categories */
		//########################################//
		this.disableControllerWhileLoadingPlaylist = function(){
			self.prevButton_do.disable();
			self.playPauseButton_do.disable();
			self.nextButton_do.disable();
			if(self.playlistButton_do) self.playlistButton_do.disable();
			if(self.facebookButton_do) self.facebookButton_do.disable();
			self.updateTime("...", "...");
			self.setTitle("...");
		};
		
		this.enableControllerWhileLoadingPlaylist = function(){
			self.prevButton_do.enable();
			self.playPauseButton_do.enable();
			self.nextButton_do.enable();
			if(self.playlistButton_do) self.playlistButton_do.enable();
			if(self.facebookButton_do) self.facebookButton_do.enable();
		};
		
		this.init();
	};
	
	/* set prototype */
	FWDRAPController.setPrototype = function(){
		FWDRAPController.prototype = new FWDDisplayObject("div");
	};
	
	FWDRAPController.FACEBOOK_SHARE = "facebookShare";
	FWDRAPController.PLAY_NEXT = "playNext";
	FWDRAPController.PLAY_PREV = "playPrev";
	FWDRAPController.PLAY = "play";
	FWDRAPController.PAUSE = "pause";
	FWDRAPController.VOLUME_START_TO_SCRUB = "volumeStartToScrub";
	FWDRAPController.VOLUME_STOP_TO_SCRUB = "volumeStopToScrub";
	FWDRAPController.START_TO_SCRUB = "startToScrub";
	FWDRAPController.SCRUB = "scrub";
	FWDRAPController.SCRUB_PLAYLIST_ITEM = "scrubPlaylistItem";
	FWDRAPController.STOP_TO_SCRUB = "stopToScrub";
	FWDRAPController.CHANGE_VOLUME = "changeVolume";
	FWDRAPController.SHOW_CATEGORIES = "showCategories";
	FWDRAPController.SHOW_PLAYLIST = "showPlaylist";
	FWDRAPController.HIDE_PLAYLIST = "hidePlaylist";
	FWDRAPController.ENABLE_LOOP = "enableLoop";
	FWDRAPController.DISABLE_LOOP = "disableLoop";
	FWDRAPController.ENABLE_SHUFFLE = "enableShuffle";
	FWDRAPController.DISABLE_SHUFFLE = "disableShuffle";
	FWDRAPController.POPUP = "popup";
	FWDRAPController.DOWNLOAD_MP3 = "downloadMp3";
	
	
	
	FWDRAPController.prototype = null;
	window.FWDRAPController = FWDRAPController;
	
}());/* Info screen */
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
}(window));/* FWDRAPPlaylist */
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
	
}());/* FWDRAPPlaylistItem */
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
	
}());/* Thumb */
(function (window){
	
	var FWDRAPPreloader = function(
			imageSource_img, 
			segmentWidth, 
			segmentHeight, 
			totalSegments, 
			animDelay,
			skipFirstFrame){
		
		var self  = this;
		var prototype = FWDRAPPreloader.prototype;
		
		this.imageSource_img = imageSource_img;
		this.image_sdo = null;
		
		this.segmentWidth = segmentWidth;
		this.segmentHeight = segmentHeight;
		this.totalSegments = totalSegments;
		this.animDelay = animDelay || 300;
		this.count = 0;
		
		this.delayTimerId_int;
		this.isShowed_bl = false;
		this.skipFirstFrame_bl = skipFirstFrame;
		
		//###################################//
		/* init */
		//###################################//
		this.init = function(){
			self.hasTransform3d_bl = false;
			self.hasTransform2d_bl = false;
			self.getStyle().zIndex = 1;
			self.setWidth(self.segmentWidth);
			self.setHeight(self.segmentHeight);
		
			self.image_sdo = new FWDDisplayObject("img");
			self.image_sdo.setScreen(self.imageSource_img);
			self.image_sdo.hasTransform3d_bl = false;
			self.image_sdo.hasTransform2d_bl = false;
			self.addChild(this.image_sdo);
			
			self.hide(false);
		};
		
		//###################################//
		/* start / stop preloader animation */
		//###################################//
		this.start = function(){
			if(self == null) return;
			clearInterval(self.delayTimerId_int);
			self.delayTimerId_int = setInterval(self.updatePreloader, self.animDelay);
		};
		
		this.stop = function(){
			clearInterval(self.delayTimerId_int);
			self.image_sdo.setX(0);
		};
		
		this.updatePreloader = function(){
			if(self == null) return;
			self.count++;
			if(self.count > self.totalSegments - 1){
				if(self.skipFirstFrame_bl){
					self.count = 1;
				}else{
					self.count = 0;
				}
				
			}
			var posX = self.count * self.segmentWidth;
			self.image_sdo.setX(-posX);
		};
		
		
		//###################################//
		/* show / hide preloader animation */
		//###################################//
		this.show = function(){
			this.setVisible(true);
			this.start();
			TweenMax.killTweensOf(this);
			TweenMax.to(this, 1, {alpha:1});
			this.isShowed_bl = true;
		};
		
		this.hide = function(animate){
			if(!this.isShowed_bl) return;
			TweenMax.killTweensOf(this);
			if(animate){
				TweenMax.to(this, 1, {alpha:0, onComplete:this.onHideComplete});
			}else{
				this.setVisible(false);
				this.setAlpha(0);
			}
			this.isShowed_bl = false;
		};
		
		this.onHideComplete = function(){
			self.stop();
			self.setVisible(false);
			self.dispatchEvent(FWDRAPPreloader.HIDE_COMPLETE);
		};

		this.init();
	};
	
	/* set prototype */
    FWDRAPPreloader.setPrototype = function(){
    	FWDRAPPreloader.prototype = new FWDDisplayObject("div");
    };
    
    FWDRAPPreloader.HIDE_COMPLETE = "hideComplete";
    
    FWDRAPPreloader.prototype = null;
	window.FWDRAPPreloader = FWDRAPPreloader;
}(window));/* FWDRAPSimpleButton */
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
}(window));/* FWDRAPSimpleSizeButton */
(function (window){
var FWDRAPSimpleSizeButton = function(
		nImgPath, 
		sImgPath,
		buttonWidth,
		buttonHeight){
		
		var self = this;
		var prototype = FWDRAPSimpleSizeButton.prototype;
		
		this.nImg_img = null;
		this.sImg_img = null;
	
		this.n_do;
		this.s_do;
		
		this.nImgPath_str = nImgPath;
		this.sImgPath_str = sImgPath;
		
		this.buttonWidth = buttonWidth;
		this.buttonHeight = buttonHeight;
		
		this.isMobile_bl = FWDUtils.isMobile;
		this.hasPointerEvent_bl = FWDUtils.hasPointerEvent;
		this.isDisabled_bl = false;
		
		
		//##########################################//
		/* initialize this */
		//##########################################//
		this.init = function(){
			self.setupMainContainers();
			self.setWidth(self.buttonWidth);
			self.setHeight(self.buttonHeight);
			self.setButtonMode(true);
		};
		
		//##########################################//
		/* setup main containers */
		//##########################################//
		this.setupMainContainers = function(){
			
			self.n_do = new FWDDisplayObject("img");	
			self.nImg_img = new Image();
			self.nImg_img.src = self.nImgPath_str;
			self.nImg_img.width = self.buttonWidth;
			self.nImg_img.height = self.buttonHeight;
			self.n_do.setScreen(self.nImg_img);
			
			self.s_do = new FWDDisplayObject("img");	
			self.sImg_img = new Image();
			self.sImg_img.src = self.sImgPath_str;
			self.sImg_img.width = self.buttonWidth;
			self.sImg_img.height = self.buttonHeight;
			self.s_do.setScreen(self.sImg_img);
			
			self.addChild(self.s_do);
			self.addChild(self.n_do);
			
			self.screen.onmouseover = self.onMouseOver;
			self.screen.onmouseout = self.onMouseOut;
			self.screen.onclick = self.onClick;
			
		};
		
		this.onMouseOver = function(e){
			TweenMax.to(self.n_do, .9, {alpha:0, ease:Expo.easeOut});
		};
			
		this.onMouseOut = function(e){
			TweenMax.to(self.n_do, .9, {alpha:1, ease:Expo.easeOut});	
		};
			
		this.onClick = function(e){
			self.dispatchEvent(FWDRAPSimpleSizeButton.CLICK);
		};
		
		//###################################################//
		/* Destory */
		//###################################################//
		this.destroy = function(){
			TweenMax.killTweensOf(self.n_do);
			
			self.n_do.destroy();
			this.s_do.destroy();
		
			self.screen.onmouseover = null;
			self.screen.onmouseout = null;
			self.screen.onclick = null;
			self.nImg_img = null;
			self.sImg_img = null;
			
			self = null;
			prototype = null;
			FWDRAPSimpleSizeButton.prototype = null;
		};
		
	
		self.init();
	};
	
	/* set prototype */
	FWDRAPSimpleSizeButton.setPrototype = function(){
		FWDRAPSimpleSizeButton.prototype = null;
		FWDRAPSimpleSizeButton.prototype = new FWDDisplayObject("div", "relative");
	};
	
	FWDRAPSimpleSizeButton.CLICK = "onClick";
	
	FWDRAPSimpleSizeButton.prototype = null;
	window.FWDRAPSimpleSizeButton = FWDRAPSimpleSizeButton;
}(window));/* Gallery */
(function (window){
	
	var FWDRoyalAudioPlayer = function(props){
		
		var self = this;
	
		/* init gallery */
		self.init = function(){
		
			TweenLite.ticker.useRAF(false);
			this.props_obj = props;
			 
			this.instanceName_str = this.props_obj.instanceName;
			if(!this.instanceName_str){
				alert("FWDRoyalAudioPlayer instance name is requires please make sure that the instanceName parameter exsists and it's value is uinique.");
				return;
			}
			
			if(window[this.instanceName_str]){
				alert("FWDRoyalAudioPlayer instance name " + this.instanceName_str +  " is already defined and contains a different instance reference, set a different instance name.");
				return;
			}else{
				window[this.instanceName_str] = this;
			}
		
			if(!this.props_obj){
				alert("FWDRoyalAudioPlayer constructor properties object is not defined!");
				return;
			}
			
			this.useOnlyAPI_bl = self.props_obj.useOnlyAPI; 
			this.useOnlyAPI_bl = self.useOnlyAPI_bl == "yes" ? true : false;
			
			if(!this.props_obj.parentId && !this.useOnlyAPI_bl){		
				alert("Property parentId is not defined in the FWDRoyalAudioPlayer constructor, self property represents the div id into which the megazoom is added as a child!");
				return;
			}
			
			if(!FWDUtils.getChildById(self.props_obj.parentId) && !this.useOnlyAPI_bl){
				alert("FWDRoyalAudioPlayer holder div is not found, please make sure that the div exsists and the id is correct! " + self.props_obj.parentId);
				return;
			}

			this.stageContainer = FWDUtils.getChildById(self.props_obj.parentId);
			this.listeners = {events_ar:[]};
			this.ws = null;
			this.data = null;
			this.customContextMenu_do = null;
			this.info_do = null;
			this.main_do = null;
			this.preloader_do = null;
			this.controller_do = null;
			this.categories_do = null;
			this.playlist_do = null;
			this.audioScreen_do = null;
			this.flash_do = null;
			this.flashObject = null;
			this.facebookShare = null;
			
			this.flashObjectMarkup_str =  null;
			this.popupWindowBackgroundColor = this.props_obj.popupWindowBackgroundColor || "#000000";
			
			this.prevCatId = -1;
			this.catId = -1;
			this.id = -1;
			this.prevId = -1;
			this.lastPercentPlayed = 0;
			this.totalAudio = 0;
			this.stageWidth = 0;
			this.stageHeight = 0;
			this.maxWidth = self.props_obj.maxWidth || 2000;
			this.maxHeight = 0;
			this.popupWindowWidth = self.props_obj.popupWindowWidth || 500;
			this.popupWindowHeight = self.props_obj.popupWindowHeight || 400;
		
			this.resizeHandlerId_to;
			this.resizeHandler2Id_to;
			this.hidePreloaderId_to;
			this.orientationChangeId_to;
			this.showCatWidthDelayId_to;
			
			this.hasOpenedInPopup_bl = false;
			this.isAPIReady_bl = false;
			this.isPlaylistLoaded_bl = false;
			this.isFlashScreenReady_bl = false;
			this.orintationChangeComplete_bl = true;
			this.useDeepLinking_bl = self.props_obj.useDeepLinking;
			this.useDeepLinking_bl = self.useDeepLinking_bl == "yes" ? true : false;
			this.openInPopup_bl = false;
			
			setTimeout(function(){
				try{
					if(window.opener 
						&& window.opener.openedPlayerInstance 
						&& window.opener.openedPlayerInstance == self.instanceName_str){
						self.openInPopup_bl = true;
						self.popupWindow = window.opener[self.instanceName_str];
						window.opener[self.instanceName_str].removeAndDisablePlayer();
					}else{
						if(window.opener 
						&& window.opener.openedPlayerInstance 
						&& window.opener.openedPlayerInstance != self.instanceName_str){
							return;
						}
					}
				}catch(e){}
				
				self.isMobile_bl = FWDUtils.isMobile;
				self.hasPointerEvent_bl = FWDUtils.hasPointerEvent;
				self.setupMainDo();
				self.startResizeHandler();
				self.setupInfo();
				self.setupData();
			}, 49);
			
		
			FWDRoyalAudioPlayer.instaces_ar.push(this);	
		};
		
		
		this.popup = function(){
			if(self.popupWindow && !self.popupWindow.closed) return
			var myWindow;
			var left = (screen.width/2)-(self.popupWindowWidth/2);
			var top = (screen.height/2)-(self.popupWindowHeight/2);
			var loc = "no";
			if(FWDUtils.isSafari) loc = "yes";
			
			try{
				if(FWDUtils.isMobile){
					self.popupWindow = window.open(location.href);
				}else{
					self.popupWindow = window.open(location.href,"",'location='+loc+', width='+self.popupWindowWidth+', height='+self.popupWindowHeight+', top='+top+', left='+left);
				}
				
				if(self.popupWindow){
					self.stageContainer.style.display = "none";
					if(self.preloader_do) self.preloader_do.hide(false);
					self.data.closeData();
					self.stop();
					window.openedPlayerInstance = self.instanceName_str;
					self.hasOpenedInPopup_bl = true;
					self.isAPIReady_bl = false;
				}
				self.stopResizeHandler();
				self.dispatchEvent(FWDRoyalAudioPlayer.POPUP);
			}catch(e){
			}
		};
		
		
		this.removeAndDisablePlayer = function(){
			try{
				self.stageContainer.style.display = "none";
			}catch(e){}
		};
		
		//#############################################//
		/* setup main do */
		//#############################################//
		self.setupMainDo = function(){
			
			self.main_do = new FWDDisplayObject("div", "relative");
			self.main_do.getStyle().msTouchAction = "none";
			self.main_do.getStyle().webkitTapHighlightColor = "rgba(0, 0, 0, 0)";
			self.main_do.setBackfaceVisibility();
			if(!FWDUtils.isMobile || (FWDUtils.isMobile && FWDUtils.hasPointerEvent)) self.main_do.setSelectable(false);
			
			if(self.openInPopup_bl){
				if(!FWDUtils.isIEAndLessThen9) document.getElementsByTagName("body")[0].style.display = "none";
				document.documentElement.appendChild(self.main_do.screen);
				self.main_do.setPosition("fixed");
				self.main_do.getStyle().zIndex = "2147483646";
				document.documentElement.style.overflow = "hidden";
				document.documentElement.style.backgroundColor = self.popupWindowBackgroundColor;	
				self.main_do.setBkColor(self.popupWindowBackgroundColor);
				self.main_do.getStyle().width = "100%";
				self.main_do.setHeight(3000);
			}else{
				self.stageContainer.style.overflow = "hidden";
				self.stageContainer.style.height = "0px";
				self.stageContainer.appendChild(self.main_do.screen);
			}
			
		};
		
		//#############################################//
		/* setup info_do */
		//#############################################//
		self.setupInfo = function(){
			FWDRAPInfo.setPrototype();
			self.info_do = new FWDRAPInfo(self);
		};	
		
		//#############################################//
		/* resize handler */
		//#############################################//
		self.startResizeHandler = function(){
			if(window.addEventListener){
				window.addEventListener("resize", self.onResizeHandler);
				//window.addEventListener("orientationchange", self.orientationChange);
			}else if(window.attachEvent){
				window.attachEvent("onresize", self.onResizeHandler);
			}
			self.onResizeHandler(true);
			self.resizeHandlerId_to = setTimeout(function(){self.resizeHandler(true);}, 50);
		};
		
		self.stopResizeHandler = function(){
			clearTimeout(self.resizeHandlerId_to);
			clearTimeout(self.resizeHandler2Id_to);
			clearTimeout(self.orientationChangeId_to);
			if(window.removeEventListener){
				window.removeEventListener("resize", self.onResizeHandler);
				//window.removeEventListener("orientationchange", self.orientationChange);
			}else if(window.detachEvent){
				window.detachEvent("onresize", self.onResizeHandler);
			}	
		};
		
		self.onResizeHandler = function(e){
			self.resizeHandler();
			clearTimeout(self.resizeHandler2Id_to);
			self.resizeHandler2Id_to = setTimeout(function(){self.resizeHandler();}, 300);
		};
		
		this.orientationChange = function(){
			if(self.displayType == FWDRoyalAudioPlayer.FULL_SCREEN || self.isFullScreen_bl){
				self.orintationChangeComplete_bl = false;	
				clearTimeout(self.resizeHandlerId_to);
				clearTimeout(self.resizeHandler2Id_to);
				clearTimeout(self.orientationChangeId_to);
			
				self.orientationChangeId_to = setTimeout(function(){
					self.orintationChangeComplete_bl = true; 
					self.resizeHandler(true);
					}, 1000);
				
				self.main_do.setX(0);
				//self.main_do.setWidth(0);
			}
		};
		
		self.resizeHandler = function(overwrite){
			if(!self.orintationChangeComplete_bl) return;

			if(!self.openInPopup_bl){
				self.stageContainer.style.width = "100%";
				if(self.stageContainer.offsetWidth > self.maxWidth && !self.openInPopup_bl){
					self.stageContainer.style.width = self.maxWidth + "px";
				}
				self.stageWidth = self.stageContainer.offsetWidth;
				if(self.controller_do) self.maxHeight = self.controller_do.h;
				
				self.stageHeight = self.maxHeight;
				
				self.main_do.setWidth(self.stageWidth);
			}else{
				self.ws = FWDUtils.getViewportSize();
				self.stageWidth = self.ws.w;
			}
			
			if(self.preloader_do) self.positionPreloader();
			if(self.controller_do) self.controller_do.resizeAndPosition();
			if(self.categories_do) self.categories_do.resizeAndPosition();
			if(self.playlist_do) self.playlist_do.resizeAndPosition();
			
			if(self.data && !overwrite){
				self.setStageContainerHeight(false);
			}else{
				self.setStageContainerHeight(true);
			}
		};
		
		//#############################################//
		/* resize main container */
		//#############################################//
		this.setStageContainerHeight = function(animate){
			if(!self.controller_do){
				if(!self.openInPopup_bl){
					self.main_do.setHeight(self.stageHeight);
					self.stageContainer.style.height = self.stageHeight + "px";
				}
				return;
			}
			
			if(self.openInPopup_bl){
				if(!self.ws) self.ws = FWDUtils.getViewportSize();
				
				self.stageWidth = self.ws.w;
				self.main_do.setX(0);
				self.main_do.setY(0);
				self.main_do.getStyle().width = "100%";
				
				self.main_do.setHeight(3000);
				self.controller_do.setX(0);
				TweenMax.killTweensOf(self.controller_do);
				if(animate){
					//if(self.controller_do.y != 0) TweenMax.to(self.controller_do, .8, {y:0, ease:Expo.easeInOut});
				}else{
					self.controller_do.setY(0);
					self.controller_do.setX(0);
				}
				
				self.controller_do.setY(0);
				self.controller_do.setX(0);
			
				if(self.playlist_do){
					TweenMax.killTweensOf(self.playlist_do);
					self.playlist_do.setX(0);
					if(animate){
						//TweenMax.to(self.playlist_do, .8, {y:self.controller_do.h, delay:.4, ease:Expo.easeInOut});
					}else{
						self.playlist_do.setY(self.controller_do.h);	
					}
					self.playlist_do.setX(0);
					self.playlist_do.setY(self.controller_do.h);
				}
				return;
			}
			
			if(self.playlist_do && self.playlist_do.isShowed_bl){
				self.maxHeight += self.playlist_do.h;
			}
			if(self.playlist_do) self.playlist_do.setY(self.controller_do.h);
			
			//if(self.main_do.h == self.stageHeight)  return;
			
			TweenMax.killTweensOf(self.stageContainer);
			if(animate){
				if(self.playlist_do){
					if(self.playlist_do.isShowed_bl){
						self.main_do.setHeight(self.controller_do.h + self.playlist_do.h);
						TweenMax.to(self.stageContainer, .8, {css:{height:self.controller_do.h + self.playlist_do.h}, ease:Expo.easeInOut});
					}else{
						self.main_do.setHeight(self.controller_do.h);
						TweenMax.to(self.stageContainer, .8, {css:{height:self.controller_do.h}, ease:Expo.easeInOut});
					}
				}else{
					self.main_do.setHeight(self.controller_do.h);
					TweenMax.to(self.stageContainer, .8, {css:{height:self.controller_do.h}, ease:Expo.easeInOut});
				}
				
			}else{
				if(self.playlist_do){
					if(self.playlist_do.isShowed_bl){
						self.main_do.setHeight(self.controller_do.h + self.playlist_do.h);
						self.stageContainer.style.height = (self.controller_do.h + self.playlist_do.h) + "px";
					}else{
						self.main_do.setHeight(self.controller_do.h);
						self.stageContainer.style.height = (self.controller_do.h) + "px";
					}
				}else{
					self.main_do.setHeight(self.controller_do.h);
					self.stageContainer.style.height = self.controller_do.h + "px";
				}
			}	
		};
		
		//#############################################//
		/* setup context menu */
		//#############################################//
		this.setupContextMenu = function(){
			self.customContextMenu_do = new FWDRAPContextMenu(self.main_do, self.data.showContextMenu_bl);
		};
		
		//#############################################//
		/* Setup main instances */
		//#############################################//
		this.setupMainInstances = function(){
			if(self.controller_do) return;
			if(FWDRoyalAudioPlayer.hasHTML5Audio) self.setupAudioScreen();
			self.setupController();
			if(self.data.showPlaylistsButtonAndPlaylists_bl) self.setupCategories();
			if(self.data.showPlayListButtonAndPlaylist_bl) self.setupPlaylist();
			if(self.data.showFacebookButton_bl) self.setupFacebook();
			self.controller_do.resizeAndPosition();
		};
	
		//#############################################//
		/* setup data */
		//#############################################//
		this.setupData = function(){
			FWDRAPAudioData.setPrototype();
			self.data = new FWDRAPAudioData(self.props_obj, self.rootElement_el, self);
			self.data.addListener(FWDRAPAudioData.PRELOADER_LOAD_DONE, self.onPreloaderLoadDone);
			self.data.addListener(FWDRAPAudioData.LOAD_ERROR, self.dataLoadError);
			self.data.addListener(FWDRAPAudioData.SKIN_PROGRESS, self.dataSkinProgressHandler);
			self.data.addListener(FWDRAPAudioData.SKIN_LOAD_COMPLETE, self.dataSkinLoadComplete);
			self.data.addListener(FWDRAPAudioData.PLAYLIST_LOAD_COMPLETE, self.dataPlayListLoadComplete);
		};
		
		self.onPreloaderLoadDone = function(){
			self.maxHeight = self.data.controllerHeight;
			self.setupPreloader();
			if(!self.isMobile_bl && self.data.showContextMenu_bl) self.setupContextMenu();
			
			self.resizeHandler();
			if(!self.openInPopup_bl) self.main_do.setHeight(self.data.controllerHeight);
			self.stageContainer.style.height = self.data.controllerHeight + "px";
		};
		
		self.dataLoadError = function(e){
			self.maxHeight = 100;
			if(self.preloader_do) self.preloader_do.hide(false);
			self.main_do.addChild(self.info_do);
			self.info_do.showText(e.text);
			self.resizeHandler();
			self.main_do.setHeight(self.data.controllerHeight);
			self.stageContainer.style.height = self.data.controllerHeight + "px";
			self.dispatchEvent(FWDRoyalAudioPlayer.ERROR, {error:e.text});
		};
		
		self.dataSkinProgressHandler = function(e){};
		
		self.dataSkinLoadComplete = function(){	
			if(self.openInPopup_bl) self.data.showPopupButton_bl = false;
			if(self.useDeepLinking_bl){
				setTimeout(function(){self.setupDL();}, 200);
			}else{
				if(self.openInPopup_bl){
					self.catId = self.popupWindow.catId;
					self.id = self.popupWindow.id;
				}else{
					self.catId = self.data.startAtPlaylist;
					self.id = self.data.startAtTrack;
				}
				self.loadInternalPlaylist();
			}
			
			self.main_do.addChild(self.preloader_do);
		};
	
		this.dataPlayListLoadComplete = function(){
			if(!self.isAPIReady_bl) self.dispatchEvent(FWDRoyalAudioPlayer.READY);
			self.isAPIReady_bl = true;
			self.isPlaylistLoaded_bl = true;
			if(self.openInPopup_bl) self.data.autoPlay_bl = true;
			
			if(FWDRoyalAudioPlayer.hasHTML5Audio){
				self.setupMainInstances();
				self.updatePlaylist();
				self.resizeHandler();
			}else{
				if(self.flash_do){
					self.updatePlaylist();
				}else{
					self.setupFlashScreen();
				}
			}
			
			self.dispatchEvent(FWDRoyalAudioPlayer.LOAD_PLAYLIST_COMPLETE);
		};
		
		this.updatePlaylist = function(){
			if(self.main_do) if(self.main_do.contains(self.info_do)) self.main_do.removeChild(self.info_do);
			self.preloader_do.hide(true);
			self.prevId = -1;
			self.totalAudio = self.data.playlist_ar.length;
			self.controller_do.enableControllerWhileLoadingPlaylist();
	    	self.controller_do.cleanThumbnails(true);
	    	
	    	if(self.playlist_do) self.playlist_do.updatePlaylist(self.data.playlist_ar);
	    	if(self.openInPopup_bl && self.popupWindow.audioScreen_do) self.lastPercentPlayed = self.popupWindow.audioScreen_do.lastPercentPlayed;
	    	self.setSource();
			if(self.data.autoPlay_bl) self.play();
		};
		
		this.loadInternalPlaylist = function(){
			self.isPlaylistLoaded_bl = false;
			self.data.loadPlaylist(self.catId);
			
			self.stop();
			self.preloader_do.show(true);
			if(self.controller_do){
				self.controller_do.disableControllerWhileLoadingPlaylist();
				self.controller_do.loadThumb();
			}
			
			if(self.playlist_do) self.playlist_do.destroyPlaylist();
			self.dispatchEvent(FWDRoyalAudioPlayer.START_TO_LOAD_PLAYLIST);
		};
		
		
		//############################################//
		/* update deeplink */
		//############################################//
		this.setupDL = function(){
			FWDAddress.onChange = self.dlChangeHandler;
			self.dlChangeHandler();
		};
		
		this.dlChangeHandler = function(){
			if(self.hasOpenedInPopup_bl) return;
			var mustReset_bl = false;
			
			if(self.categories_do && self.categories_do.isOnDOM_bl){
				self.categories_do.hide();
				return;
			}
			
			self.catId = parseInt(FWDAddress.getParameter("catid"));
			self.id = parseInt(FWDAddress.getParameter("trackid"));
			
			if(self.catId == undefined || self.id == undefined || isNaN(self.catId) || isNaN(self.id)){
				
				self.catId = self.data.startAtPlaylist;
				self.id = self.data.startAtTrack;
				
				mustReset_bl = true;
			}
			
			if(self.catId < 0 || self.catId > self.data.totalCategories - 1 && !mustReset_bl){
				self.catId = self.data.startAtPlaylist;
				self.id = self.data.startAtTrack;
				mustReset_bl = true;
			}
			
			if(self.data.playlist_ar){
				if(self.id < 0 && !mustReset_bl){
					self.id = self.data.startAtTrack;
					mustReset_bl = true;
				}else if(self.prevCatId == self.catId && self.id > self.data.playlist_ar.length - 1  && !mustReset_bl){
					self.id = self.data.playlist_ar.length - 1;
					mustReset_bl = true;
				}
			}
			
			if(mustReset_bl){
				FWDAddress.setValue(self.instanceName_str + "?catid=" + self.catId + "&trackid=" + self.id);
				return;
			}
			
			if(self.prevCatId != self.catId){
				self.loadInternalPlaylist();
				self.prevCatId = self.catId;
			}else{
				self.setSource(false);
				self.play();
				
			}
		};
		
		//#############################################//
		/* setup preloader */
		//#############################################//
		this.setupPreloader = function(){
			FWDRAPPreloader.setPrototype();
			self.preloader_do = new FWDRAPPreloader(self.data.mainPreloader_img, 53, 34, 30, 80);
			self.preloader_do.show(true);
			self.main_do.addChild(self.preloader_do);
		};
		
		this.positionPreloader = function(){
			self.preloader_do.setX(parseInt((self.stageWidth - self.preloader_do.w)/2));
			if(self.controller_do){
				self.preloader_do.setY(parseInt((self.controller_do.h - self.preloader_do.h)/2));
			}else{
				self.preloader_do.setY(parseInt((self.maxHeight - self.preloader_do.h)/2));
			}
		};
		
		//###########################################//
		/* setup categories */
		//###########################################//
		this.setupCategories = function(){
			FWDRAPCategories.setPrototype();
			self.categories_do = new FWDRAPCategories(self.data);
			self.categories_do.getStyle().zIndex = "2147483647";
			self.categories_do.addListener(FWDRAPCategories.HIDE_COMPLETE, self.categoriesHideCompleteHandler);
			if(self.data.showPlaylistsByDefault_bl){
				self.showCatWidthDelayId_to = setTimeout(function(){
					self.showCategories();
				}, 1400);
			};
		};
		
		this.categoriesHideCompleteHandler = function(e){
			self.controller_do.setCategoriesButtonState("unselected");
			if(self.customContextMenu_do) self.customContextMenu_do.updateParent(self.main_do);
			
			if(self.useDeepLinking_bl){
				if(self.categories_do.id != self.catId){
					self.catId = self.categories_do.id;
					self.id = 0;
					FWDAddress.setValue(self.instanceName_str + "?catid=" + self.catId + "&trackid=" + self.id);
				}
			}else{
				if(self.catId == self.categories_do.id) return;
				self.catId = self.categories_do.id;
				self.id = 0;
				self.loadInternalPlaylist(self.catId);
			}
		};
		
		//###########################################//
		/* setup playslist */
		//###########################################//
		this.setupPlaylist = function(){
			FWDRAPPlaylist.setPrototype();
			self.playlist_do = new FWDRAPPlaylist(self.data, self);
			self.playlist_do.addListener(FWDRAPPlaylistItem.MOUSE_UP, self.palylistItemOnUpHandler);
			self.playlist_do.addListener(FWDRAPPlaylistItem.DOWNLOAD, self.palylistItemDownloadHandler);
			self.main_do.addChild(self.playlist_do);
		};
		
		this.palylistItemOnUpHandler = function(e){
			if(FWDRoyalAudioPlayer.hasHTML5Audio){
				if(self.audioScreen_do.isPlaying_bl && e.id == self.id){
					self.pause();
				}else if(!self.audioScreen_do.isStopped_bl && e.id == self.id){
					self.play();
				}else{
					if(self.useDeepLinking_bl && self.id != e.id){
						FWDAddress.setValue(self.instanceName_str + "?catid=" + self.catId + "&trackid=" + e.id);
						self.id = e.id;
					}else{
						self.id = e.id;
						self.setSource(true);
						self.play();
					}
				}
			}else if(self.isFlashScreenReady_bl){
				if(self.flashObject.isAudioPlaying() && e.id == self.id){
					self.pause();
				}else if(!self.flashObject.isAudioStopped() && e.id == self.id){
					self.play();
				}else{
					if(self.useDeepLinking_bl && self.id != e.id){
						FWDAddress.setValue(self.instanceName_str + "?catid=" + self.catId + "&trackid=" + e.id);
						self.id = e.id;
					}else{
						self.id = e.id;
						self.setSource(true);
						self.play();
					}
				}
			}
		};
		
		this.palylistItemDownloadHandler = function(e){
			self.downloadMP3(e.id);
		};
		
		//###########################################//
		/* setup controller */
		//###########################################//
		this.setupController = function(){
			FWDRAPController.setPrototype();
			self.controller_do = new FWDRAPController(self.data, self);
			self.controller_do.addListener(FWDRAPController.POPUP, self.controllerOnPopupHandler);
			self.controller_do.addListener(FWDRAPController.PLAY, self.controllerOnPlayHandler);
			self.controller_do.addListener(FWDRAPController.PLAY_NEXT, self.controllerPlayNextHandler);
			self.controller_do.addListener(FWDRAPController.PLAY_PREV, self.controllerPlayPrevHandler);
			self.controller_do.addListener(FWDRAPController.PAUSE, self.controllerOnPauseHandler);
			self.controller_do.addListener(FWDRAPController.VOLUME_START_TO_SCRUB, self.volumeStartToScrubbHandler);
			self.controller_do.addListener(FWDRAPController.VOLUME_STOP_TO_SCRUB, self.volumeStopToScrubbHandler);
			self.controller_do.addListener(FWDRAPController.START_TO_SCRUB, self.controllerStartToScrubbHandler);
			self.controller_do.addListener(FWDRAPController.SCRUB, self.controllerScrubbHandler);
			self.controller_do.addListener(FWDRAPController.SCRUB_PLAYLIST_ITEM, self.controllerPlaylistItemScrubbHandler);
			self.controller_do.addListener(FWDRAPController.STOP_TO_SCRUB, self.controllerStopToScrubbHandler);
			self.controller_do.addListener(FWDRAPController.CHANGE_VOLUME, self.controllerChangeVolumeHandler);
			self.controller_do.addListener(FWDRAPController.SHOW_CATEGORIES, self.showCategoriesHandler);
			self.controller_do.addListener(FWDRAPController.SHOW_PLAYLIST, self.showPlaylistHandler);
			self.controller_do.addListener(FWDRAPController.HIDE_PLAYLIST, self.hidePlaylistHandler);
			self.controller_do.addListener(FWDRAPController.ENABLE_LOOP, self.enableLoopHandler);
			self.controller_do.addListener(FWDRAPController.DISABLE_LOOP, self.disableLoopHandler);
			self.controller_do.addListener(FWDRAPController.ENABLE_SHUFFLE, self.enableShuffleHandler);
			self.controller_do.addListener(FWDRAPController.DISABLE_SHUFFLE, self.disableShuffleHandler);
			self.controller_do.addListener(FWDRAPController.FACEBOOK_SHARE, self.facebookShareHandler);
			self.controller_do.addListener(FWDRAPController.DOWNLOAD_MP3, self.controllerButtonDownloadMp3Handler);
			self.main_do.addChild(self.controller_do);
			if(self.openInPopup_bl && self.data.showPlaylistsButtonAndPlaylists_bl){
				self.controller_do.setPlaylistButtonState("selected");
				if(self.controller_do.playlistButton_do) self.controller_do.playlistButton_do.disableForGood();
			}
		};
		
		this.controllerOnPopupHandler = function(){
			self.popup();
		};
		
		this.controllerOnPlayHandler = function(e){
			FWDRoyalAudioPlayer.pauseAllAudio(self);
			if(FWDRoyalAudioPlayer.hasHTML5Audio){
				self.audioScreen_do.play();
			}else if(self.isFlashScreenReady_bl){
				self.flashObject.playAudio();
			}
		};
		
		this.controllerPlayNextHandler = function(e){
			self.playNext();
		};
		
		this.controllerPlayPrevHandler = function(e){
			self.playPrev();
		};
		
		this.controllerOnPauseHandler = function(e){
			if(FWDRoyalAudioPlayer.hasHTML5Audio){
				self.audioScreen_do.pause();
			}else if(self.isFlashScreenReady_bl){
				self.flashObject.pauseAudio();
			}
		};
		
		this.volumeStartToScrubbHandler = function(e){
			if(self.playlist_do) self.playlist_do.showDisable();
		};
		
		this.volumeStopToScrubbHandler = function(e){
			if(self.playlist_do) self.playlist_do.hideDisable();
		};
		
		
		this.controllerStartToScrubbHandler = function(e){
			if(self.playlist_do) self.playlist_do.showDisable();
			if(FWDRoyalAudioPlayer.hasHTML5Audio){
				self.audioScreen_do.startToScrub();
			}else if(self.isFlashScreenReady_bl){
				FWDRoyalAudioPlayer.pauseAllAudio(self);
				self.flashObject.startToScrub();
			}
		};
		
		this.controllerScrubbHandler = function(e){
			if(FWDRoyalAudioPlayer.hasHTML5Audio){
				self.audioScreen_do.scrub(e.percent);
			}else if(self.isFlashScreenReady_bl){
				self.flashObject.scrub(e.percent);
			}
		};
		
		this.controllerPlaylistItemScrubbHandler = function(e){
			if(self.playlist_do) self.playlist_do.updateCurItemProgress(e.percent);
		};
		
		this.controllerStopToScrubbHandler = function(e){
			if(self.playlist_do) self.playlist_do.hideDisable();
			if(FWDRoyalAudioPlayer.hasHTML5Audio){
				self.audioScreen_do.stopToScrub();
			}else if(self.isFlashScreenReady_bl){
				self.flashObject.stopToScrub();
			}
		};
		
		this.controllerChangeVolumeHandler = function(e){
			if(FWDRoyalAudioPlayer.hasHTML5Audio){
				self.audioScreen_do.setVolume(e.percent);
			}else if(self.isFlashScreenReady_bl){
				self.flashObject.setVolume(e.percent);
			}
		};
		
		this.showCategoriesHandler = function(e){
			self.showCategories();
			self.controller_do.setCategoriesButtonState("selected");
		};
		
		this.showPlaylistHandler = function(e){
			if(self.data.animateOnIntro_bl){
				self.playlist_do.show(true);
			}else{
				self.playlist_do.show(false);
			}
			
			self.controller_do.setPlaylistButtonState("selected");
		};
		
		this.hidePlaylistHandler = function(e){
			if(self.data.animateOnIntro_bl){
				self.playlist_do.hide(true);
			}else{
				self.playlist_do.hide(false);
			}
			self.controller_do.setPlaylistButtonState("unselected");
		};
		
		this.enableLoopHandler = function(e){
			self.data.loop_bl = true;
			self.data.shuffle_bl = false;
			self.controller_do.setLoopStateButton("selected");
			self.controller_do.setShuffleButtonState("unselected");
		};
		
		this.disableLoopHandler = function(e){
			self.data.loop_bl = false;
			self.controller_do.setLoopStateButton("unselected");
		};
		
		this.enableShuffleHandler = function(e){
			self.data.shuffle_bl = true;
			self.data.loop_bl = false;
			self.controller_do.setShuffleButtonState("selected");
			self.controller_do.setLoopStateButton("unselected");
		};
		
		this.disableShuffleHandler = function(e){
			self.data.shuffle_bl = false;
			self.controller_do.setShuffleButtonState("unselected");
		};
		
		this.facebookShareHandler = function(e){
			
			if(document.location.protocol == "file:"){
				var error = "Facebook is not allowing sharing local, please test online.";
				self.main_do.addChild(self.info_do);
				self.info_do.showText(error);
				return;
			}
				
			if(self.useDeepLinking_bl){
				var curItem = self.data.playlist_ar[self.id];
				var thumbPath;
				
				if(curItem.thumbPath && curItem.thumbPath.indexOf("//") !=  -1){
					thumbPath = curItem.thumbPath;
				}else{
					var absolutePath = location.pathname;
					absolutePath = location.protocol + "//" + location.host + absolutePath.substring(0, absolutePath.lastIndexOf("/") + 1);
					thumbPath = absolutePath + curItem.thumbPath;
				}
				self.facebookShare.share(location.href, curItem.titleText, thumbPath);
			}else{
				self.facebookShare.share(location.href);
			}
		};
		
		this.controllerButtonDownloadMp3Handler = function(e){
			self.downloadMP3();
		};
		
		//###########################################//
		/* setup FWDRAPAudioScreen */
		//###########################################//
		this.setupAudioScreen = function(){	
			FWDRAPAudioScreen.setPrototype();
			self.audioScreen_do = new FWDRAPAudioScreen(self.data.volume, self.data.autoPlay_bl, self.data.loop_bl);
			self.audioScreen_do.addListener(FWDRAPAudioScreen.START, self.audioScreenStartHandler);
			self.audioScreen_do.addListener(FWDRAPAudioScreen.ERROR, self.audioScreenErrorHandler);
			self.audioScreen_do.addListener(FWDRAPAudioScreen.SAFE_TO_SCRUBB, self.audioScreenSafeToScrubbHandler);
			self.audioScreen_do.addListener(FWDRAPAudioScreen.STOP, self.audioScreenStopHandler);
			self.audioScreen_do.addListener(FWDRAPAudioScreen.PLAY, self.audioScreenPlayHandler);
			self.audioScreen_do.addListener(FWDRAPAudioScreen.PAUSE, self.audioScreenPauseHandler);
			self.audioScreen_do.addListener(FWDRAPAudioScreen.UPDATE, self.audioScreenUpdateHandler);
			self.audioScreen_do.addListener(FWDRAPAudioScreen.UPDATE_TIME, self.audioScreenUpdateTimeHandler);
			self.audioScreen_do.addListener(FWDRAPAudioScreen.LOAD_PROGRESS, self.audioScreenLoadProgressHandler);
			self.audioScreen_do.addListener(FWDRAPAudioScreen.PLAY_COMPLETE, self.audioScreenPlayCompleteHandler);
			if(self.useOnlyAPI_bl){
				document.documentElement.appendChild(self.audioScreen_do.screen);
			}else{
				self.main_do.addChild(self.audioScreen_do);	
			}
		};
		
		this.audioScreenStartHandler = function(){
			self.dispatchEvent(FWDRAPAudioScreen.START);
		};
		
		this.audioScreenErrorHandler = function(e){
			var error;
			if(FWDRoyalAudioPlayer.hasHTML5Audio){
				error = e.text;
				if(self.main_do) self.main_do.addChild(self.info_do);
				if(self.info_do) self.info_do.showText(error);
			}else{
				error = e;
				if(self.main_do) self.main_do.addChild(self.info_do);
				if(self.info_do) self.info_do.showText(error);
			}
			
			self.dispatchEvent(FWDRoyalAudioPlayer.ERROR, {error:error});
		};
		
		this.audioScreenSafeToScrubbHandler = function(){
			if(self.controller_do) self.controller_do.enableMainScrubber(); 
		};
		
		this.audioScreenStopHandler = function(e){
			if(self.main_do) if(self.main_do.contains(self.info_do)) self.main_do.removeChild(self.info_do);
			if(self.controller_do){
				self.controller_do.showPlayButton();
				self.controller_do.stopEqulizer();
				self.controller_do.disableMainScrubber();
			}
			self.dispatchEvent(FWDRoyalAudioPlayer.STOP);
		};
		
		this.audioScreenPlayHandler = function(){
			if(self.controller_do){
				self.controller_do.showPauseButton();
				self.controller_do.startEqulizer();
			}
			if(self.playlist_do) self.playlist_do.setCurItemPauseState();
			if(self.openInPopup_bl){
				setTimeout(function(){
					if(!self.scrubbedFirstTimeInPopup_bl) self.scrub(self.lastPercentPlayed);
					self.scrubbedFirstTimeInPopup_bl = true;
				},600);
			}
			self.dispatchEvent(FWDRoyalAudioPlayer.PLAY);
		};
		
		this.audioScreenPauseHandler = function(){
			if(self.controller_do){
				self.controller_do.showPlayButton();
				self.controller_do.stopEqulizer();
			}
			
			if(self.playlist_do){
				self.playlist_do.setCurItemPlayState();
			}
			self.dispatchEvent(FWDRoyalAudioPlayer.PAUSE);
		};
		
		this.audioScreenUpdateHandler = function(e){
			var percent;	
			if(FWDRoyalAudioPlayer.hasHTML5Audio){
				percent = e.percent;
				if(self.controller_do) self.controller_do.updateMainScrubber(percent);
				if(self.playlist_do) self.playlist_do.updateCurItemProgress(percent);
			}else{
				percent = e;
				if(self.controller_do) self.controller_do.updateMainScrubber(percent);
				if(self.playlist_do) self.playlist_do.updateCurItemProgress(percent);
			}
			self.dispatchEvent(FWDRoyalAudioPlayer.UPDATE, {percent:percent});
		};
		
		this.audioScreenUpdateTimeHandler = function(e, e2){
			var curTime;
			var totalTime;
			if(FWDRoyalAudioPlayer.hasHTML5Audio){
				curTime = e.curTime;
				totalTime = e.totalTime;
				if(self.controller_do) self.controller_do.updateTime(curTime, totalTime);
			}else{
				curTime = e;
				totalTime = e2;
				
				if(totalTime.length > curTime.length) curTime = (parseInt(totalTime.substring(0,1)) - 1) + ":" + curTime;
				if(self.controller_do) self.controller_do.updateTime(curTime, totalTime);
			}
		
			self.dispatchEvent(FWDRoyalAudioPlayer.UPDATE_TIME, {curTime:curTime, totalTime:totalTime});
		};
		
		this.audioScreenLoadProgressHandler = function(e){
			if(FWDRoyalAudioPlayer.hasHTML5Audio){
				if(self.controller_do) self.controller_do.updatePreloaderBar(e.percent);
			}else{
				if(self.controller_do) self.controller_do.updatePreloaderBar(e);
			}
		};
		
		this.audioScreenPlayCompleteHandler = function(){
			self.dispatchEvent(FWDRoyalAudioPlayer.PLAY_COMPLETE);
			if(FWDRoyalAudioPlayer.hasHTML5Audio){
				if(self.data.loop_bl){
					self.audioScreen_do.replay();
				}else if(self.data.shuffle_bl){
					self.playShuffle();
				}else{
					self.playNext();
				}
			}else if(self.isFlashScreenReady_bl){
				if(self.data.loop_bl){
					self.flashObject.replayAudio();
				}else if(self.data.shuffle_bl){
					self.playShuffle();
				}else{
					self.playNext();
				}
			}
		};
		
		//#############################################//
		/* Flash screen... */
		//#############################################//
		this.setupFlashScreen = function(){
			if(self.flash_do) return;
			if(!FWDFlashTest.hasFlashPlayerVersion("9.0.18")){
				if(self.useOnlyAPI_bl){
					alert("Please install Adobe flash player! <a href='http://www.adobe.com/go/getflashplayer'>Click here to install.</a>");
				}else{
					self.main_do.addChild(self.info_do);
					self.info_do.showText("Please install Adobe flash player! <a href='http://www.adobe.com/go/getflashplayer'>Click here to install.</a>");
				}
				if(self.preloader_do) self.preloader_do.hide(false);
				return;
			}
			
			self.flash_do = new FWDDisplayObject("div");
			self.flash_do.setBackfaceVisibility();
			self.flash_do.setResizableSizeAfterParent();	
			if(self.useOnlyAPI_bl){
				document.getElementsByTagName("body")[0].appendChild(self.flash_do.screen);
			}else{
				self.main_do.addChild(self.flash_do);
			}
		
			var sourcePath = "not defined!";
			
			self.flashObjectMarkup_str = '<object id="' + (self.instanceName_str +  "1") + '" name="' + (self.instanceName_str +  "1") + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + self.data.flashPath_str + '"/><param name="wmode" value="transparent"><param name=FlashVars value="instanceName=' + self.instanceName_str + '&sourcePath=' + sourcePath + '&volume=' + self.data.volume + '&autoPlay=' + self.data.autoPlay_bl + '&loop=' + self.data.loop_bl + '"/><param name = "allowScriptAccess" value="always" /><!--[if !IE]>--><object name="myCom" type="application/x-shockwave-flash" data="' + self.data.flashPath_str + '" width="100%" height="100%"><param name="swliveconnect" value="true"/><param name="wmode" value="transparent"><param name=FlashVars value="instanceName=' + self.instanceName_str + '&sourcePath=' + sourcePath + '&volume=' + self.data.volume + '&autoPlay=' + self.data.autoPlay_bl + '&loop=' + self.data.loop_bl + '"/><!--<![endif]--><!--[if !IE]>--></object><!--<![endif]--></object>';
			self.flash_do.screen.innerHTML = self.flashObjectMarkup_str;
			
			self.flashObject = self.flash_do.screen.firstChild;
			if(!FWDUtils.isIE) self.flashObject = self.flashObject.getElementsByTagName("object")[0];
		};
	
		this.flashScreenIsReady = function(){
			//console.log("flash is ready " + self.instanceName_str)
			self.isFlashScreenReady_bl = true;
			self.setupMainInstances();
			self.updatePlaylist();
		};
		
		this.flashScreenFail = function(){
			self.main_do.addChild(self.info_do);
			self.info_do.showText("External interface error!");
			self.resizeHandler();
		};
		
		//#######################################//
		/* Set source based on id */
		//#######################################//
		this.setSource = function(itemClicked){
			
			//if(self.id == self.prevId) return;
			if(self.id < 0){
				self.id = 0;
			}else if(self.id > self.totalAudio - 1){
				self.id = self.totalAudio - 1;
			}
			
			var audioPath = self.data.playlist_ar[self.id].source;
			
			if(FWDRoyalAudioPlayer.hasHTML5Audio){
				self.audioScreen_do.setSource(audioPath);
			}else{
				var paths_ar = audioPath.split(",");
				
				for(var i=0; i<paths_ar.length; i++){
					audioPath = paths_ar[i];
					paths_ar[i] = FWDUtils.trim(audioPath);
				}
				
				for(var i=0; i<paths_ar.length; i++){
					if(paths_ar[i].indexOf(".mp3") != -1){
						audioPath = paths_ar[i];
						break;
					}
				}
				self.flashObject.setSource(audioPath);
			}
			
			self.controller_do.stopEqulizer();
			self.controller_do.setTitle(self.data.playlist_ar[self.id].title);
			if(self.data.playlist_ar[self.id].duration == undefined){
				self.controller_do.updateTime("00:00", "00:00");
			}else{
				self.controller_do.updateTime("00:00", FWDRoyalAudioPlayer.formatTotalTime(self.data.playlist_ar[self.id].duration));
			}
			self.controller_do.loadThumb(self.data.playlist_ar[self.id].thumbPath);
			
			if(self.playlist_do) self.playlist_do.activateItems(self.id, itemClicked);
			self.resizeHandler();
		};
		
		//##########################################//
		/* Setup facebook */
		//##########################################//
		this.setupFacebook = function(){
			if(document.location.protocol == "file:") return;
			self.facebookShare = new FWDFacebookShare(self.data.facebookAppId_str);
		};
		
		//####################################//
		// API
		//###################################//
		this.loadPlaylist = function(id){
			if(!self.isAPIReady_bl) return;
			self.catId = id;
			self.id = 0;
			
			if(self.catId < 0){
				self.catId = 0;
			}else if(self.catId > self.data.totalCategories - 1){
				self.catId = self.data.totalCategories - 1;
			};
			if(self.useDeepLinking_bl){
				FWDAddress.setValue(self.instanceName_str + "?catid=" + self.catId + "&trackid=" + self.id);
			}else{
				self.loadInternalPlaylist();
			}
		};
		
		this.playNext = function(){	
			if(!self.isAPIReady_bl || !self.isPlaylistLoaded_bl) return;
			self.id ++;
			if(self.id < 0){
				self.id = self.totalAudio - 1;
			}else if(self.id > self.totalAudio - 1){
				self.id = 0;
			}
			
			if(self.useDeepLinking_bl){
				FWDAddress.setValue(self.instanceName_str + "?catid=" + self.catId + "&trackid=" + self.id);
			}else{
				self.setSource();
				self.play();
			}
			self.prevId = self.id;
		};
		
		this.playPrev = function(){
			if(!self.isAPIReady_bl || !self.isPlaylistLoaded_bl) return;
			self.id --;	
			if(self.id < 0){
				self.id = self.totalAudio - 1;
			}else if(self.id > self.totalAudio - 1){
				self.id = 0;
			}
			if(self.useDeepLinking_bl){
				FWDAddress.setValue(self.instanceName_str + "?catid=" + self.catId + "&trackid=" + self.id);
			}else{
				self.setSource();
				self.play();
			}
			self.prevId = self.id;
		};
		
		this.playShuffle = function(){
			if(!self.isAPIReady_bl || !self.isPlaylistLoaded_bl) return;
			var tempId = parseInt(Math.random() * self.data.playlist_ar.length);
			while(tempId == self.id) tempId = parseInt(Math.random() * self.data.playlist_ar.length);
			self.id = tempId;	
			if(self.id < 0){
				self.id = self.totalAudio - 1;
			}else if(self.id > self.totalAudio - 1){
				self.id = 0;
			}

			if(self.useDeepLinking_bl){
				FWDAddress.setValue(self.instanceName_str + "?catid=" + self.catId + "&trackid=" + self.id);
			}else{
				self.setSource();
				self.play();
			}
			self.prevId = self.id;
		};
		
		this.playSpecificTrack = function(catId, trackId){	
			if(!self.isAPIReady_bl || !self.isPlaylistLoaded_bl) return;
			
			self.catId = catId;
			self.id = trackId;
			
			if(self.catId < 0){
				self.catId = 0;
			}else if(self.catId > self.data.totalCategories - 1){
				self.catId = self.data.totalCategories - 1;
			};
			if(self.id < 0) self.id = 0;
			
			if(self.useDeepLinking_bl){
				FWDAddress.setValue(self.instanceName_str + "?catid=" + self.catId + "&trackid=" + self.id);
			}else{
				self.setSource();
				self.play();
			}
			self.prevId = self.id;
		};
		
		this.play = function(){
			if(!self.isAPIReady_bl || !self.isPlaylistLoaded_bl) return;
			FWDRoyalAudioPlayer.pauseAllAudio(self);
			if(FWDRoyalAudioPlayer.hasHTML5Audio){
				self.audioScreen_do.play();
			}else if(self.isFlashScreenReady_bl){
				self.flashObject.playAudio();
			}
		};
		
		this.pause = function(){
			if(!self.isAPIReady_bl || !self.isPlaylistLoaded_bl) return;
			if(FWDRoyalAudioPlayer.hasHTML5Audio){
				self.audioScreen_do.pause();
			}else if(self.isFlashScreenReady_bl){
				self.flashObject.pauseAudio();
			}
		};
		
		this.stop = function(){
			if(!self.isAPIReady_bl) return;
			if(FWDRoyalAudioPlayer.hasHTML5Audio){
				self.audioScreen_do.stop();
			}else if(self.isFlashScreenReady_bl){
				self.flashObject.stopAudio();
			}
		};
		
		this.startToScrub = function(){
			if(!self.isAPIReady_bl || !self.isPlaylistLoaded_bl) return;
			if(FWDRoyalAudioPlayer.hasHTML5Audio){
				self.audioScreen_do.startToScrub();
			}else if(self.isFlashScreenReady_bl){
				self.flashObject.startToScrub();
			}
		};
		
		this.stopToScrub = function(){
			if(!self.isAPIReady_bl || !self.isPlaylistLoaded_bl) return;
			if(FWDRoyalAudioPlayer.hasHTML5Audio){
				self.audioScreen_do.stopToScrub();
			}else if(self.isFlashScreenReady_bl){
				self.flashObject.stopToScrub();
			}
		};
		
		this.scrub = function(percent){
			if(!self.isAPIReady_bl || !self.isPlaylistLoaded_bl) return;
			if(isNaN(percent)) return;
			if(percent < 0){
				percent = 0;
			}else if(percent > 1){
				percent = 1;
			}
			if(FWDRoyalAudioPlayer.hasHTML5Audio){
				if(self.audioScreen_do) self.audioScreen_do.scrub(percent);
			}else if(self.isFlashScreenReady_bl){
				self.flashObject.scrub(percent);
			}
		};
		
		this.setVolume = function(volume){
			if(!self.isAPIReady_bl) return;
			if(self.isMobile_bl) volume = 1;
			self.controller_do.updateVolume(volume);
		};
		
		this.showCategories = function(){
			if(!self.isAPIReady_bl) return;
			if(self.categories_do){
				self.categories_do.show(self.catId);
				if(self.customContextMenu_do) self.customContextMenu_do.updateParent(self.categories_do);
				self.controller_do.setCategoriesButtonState("selected");
			}
		};
		
		this.hideCategories = function(){
			if(!self.isAPIReady_bl) return;
			if(self.categories_do){
				self.categories_do.hide();
				self.controller_do.setCategoriesButtonState("unselected");
			}
		};
		
		this.showPlaylist = function(){
			if(!self.isAPIReady_bl) return;
			if(self.playlist_do){
				if(self.data.animateOnIntro_bl){
					self.playlist_do.show(true);
				}else{
					self.playlist_do.show(false);
				}
				self.controller_do.setPlaylistButtonState("selected");
			}
		};
		
		this.hidePlaylist = function(){
			if(!self.isAPIReady_bl) return;
			if(self.playlist_do){
				if(self.data.animateOnIntro_bl){
					self.playlist_do.hide(true);
				}else{
					self.playlist_do.hide(false);
				}
				self.controller_do.setPlaylistButtonState("unselected");
			}
		};
		
		this.share = function(){
			if(!self.isAPIReady_bl) return;
			if(document.location.protocol == "file:") return;
			if(self.facebookShare){
				if(self.useDeepLinking_bl){
					var curItem = self.data.playlist_ar[self.id];
					self.facebookShare.share(location.href, curItem.titleText, curItem.thumbPath);
				}else{
					self.facebookShare.share(location.href);	
				}
			}
		};	
		
		this.getIsAPIReady = function(){
			return self.isAPIReady_bl;
		};
		
		this.getCatId = function(){
			return self.catId;
		};
		
		this.getTrackId = function(){
			return self.id;
		};
		
		this.downloadMP3 = function(pId){
			
			if(document.location.protocol == "file:"){
				var error = "Downloading mp3 files local is not allowed or possible!. To function properly please test online.";
				self.main_do.addChild(self.info_do);
				self.info_do.showText(error);
				return;
			}
			
			if(pId ==  undefined) pId = self.id;
			
			var source = self.data.playlist_ar[pId].downloadPath;
			var sourceName = self.data.playlist_ar[pId].titleText;
			self.data.downloadMp3(source, sourceName);
		};
		
		//###########################################//
		/* event dispatcher */
		//###########################################//
		this.addListener = function (type, listener){
	    	if(!this.listeners) return;
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	if(typeof listener != "function") throw Error("listener must be of type Function.");
	    	
	    	
	        var event = {};
	        event.type = type;
	        event.listener = listener;
	        event.target = this;
	        this.listeners.events_ar.push(event);
	    };
	    
	    this.dispatchEvent = function(type, props){
	    	if(this.listeners == null) return;
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	
	        for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
	        	if(this.listeners.events_ar[i].target === this && this.listeners.events_ar[i].type === type){		
	    	        if(props){
	    	        	for(var prop in props){
	    	        		this.listeners.events_ar[i][prop] = props[prop];
	    	        	}
	    	        }
	        		this.listeners.events_ar[i].listener.call(this, this.listeners.events_ar[i]);
	        	}
	        }
	    };
	    
	   this.removeListener = function(type, listener){
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	if(typeof listener != "function") throw Error("listener must be of type Function." + type);
	    	
	        for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
	        	if(this.listeners.events_ar[i].target === this 
	        			&& this.listeners.events_ar[i].type === type
	        			&& this.listeners.events_ar[i].listener ===  listener
	        	){
	        		this.listeners.events_ar.splice(i,1);
	        		break;
	        	}
	        }  
	    };		
		self.init();
	};
	
	/* set prototype */
	FWDRoyalAudioPlayer.setPrototype =  function(){
		FWDRoyalAudioPlayer.prototype = new FWDEventDispatcher();
	};
	
	FWDRoyalAudioPlayer.pauseAllAudio = function(pAudio){
	
		var totalAudio = FWDRoyalAudioPlayer.instaces_ar.length;
		var audio;
		
		for(var i=0; i<totalAudio; i++){
			audio = FWDRoyalAudioPlayer.instaces_ar[i];
			if(audio != pAudio) audio.stop();
		};
	};
	
	FWDRoyalAudioPlayer.hasHTML5Audio = (function(){
		var soundTest_el = document.createElement("audio");
		var flag = false;
		if(soundTest_el.canPlayType){
			flag = Boolean(soundTest_el.canPlayType('audio/mpeg') == "probably" || soundTest_el.canPlayType('audio/mpeg') == "maybe");
		}
		if(self.isMobile_bl) return true;
		//return false;
		return flag;
	}());
	
	FWDRoyalAudioPlayer.getAudioFormats = (function(){
		var audio_el = document.createElement("audio");
		if(!audio_el.canPlayType) return;
		var extention_str = "";
		var extentions_ar = [];
		if(audio_el.canPlayType('audio/mpeg') == "probably" || audio_el.canPlayType('audio/mpeg') == "maybe"){
			extention_str += ".mp3";
		}
		
		if(audio_el.canPlayType("audio/ogg") == "probably" || audio_el.canPlayType("audio/ogg") == "maybe"){
			extention_str += ".ogg";
		}
		
		if(audio_el.canPlayType("audio/mp4") == "probably" || audio_el.canPlayType("audio/mp4") == "maybe"){
			extention_str += ".webm";
		}
		
		extentions_ar = extention_str.split(".");
		extentions_ar.shift();
		
		audio_el = null;
		return extentions_ar;
	})();
	
	FWDRoyalAudioPlayer.hasCanvas = (function(){
		return Boolean(document.createElement("canvas"));
	})();
	
	FWDRoyalAudioPlayer.formatTotalTime = function(secs){
		
		if(typeof secs == "string" && secs.indexOf(":") != -1){
			if(secs.length <= 5){
				return secs;
			}else{
				return "0:" + secs;
			}
		} 
		
		secs = secs/1000;
		
		var hours = Math.floor(secs / (60 * 60));
		
	    var divisor_for_minutes = secs % (60 * 60);
	    var minutes = Math.floor(divisor_for_minutes / 60);

	    var divisor_for_seconds = divisor_for_minutes % 60;
	    var seconds = Math.ceil(divisor_for_seconds);
	    
	    minutes = (minutes >= 10) ? minutes : "0" + minutes;
	    seconds = (seconds >= 10) ? seconds : "0" + seconds;
	   
	    if(isNaN(seconds)) return "00:00/00:00";
		if(hours > 0){
			 return hours + ":" + minutes + ":" + seconds;
		}else{
			 return  minutes + ":" + seconds;
		}
	};
	

	FWDRoyalAudioPlayer.getAudioFormats = (function(){
		var audio_el = document.createElement("audio");
		if(!audio_el.canPlayType) return;
		var extention_str = "";
		var extentions_ar = [];
		if(audio_el.canPlayType('audio/mpeg') == "probably" || audio_el.canPlayType('audio/mpeg') == "maybe"){
			extention_str += ".mp3";
		}
		
		if(audio_el.canPlayType("audio/ogg") == "probably" || audio_el.canPlayType("audio/ogg") == "maybe"){
			extention_str += ".ogg";
		}
		
		if(audio_el.canPlayType("audio/mp4") == "probably" || audio_el.canPlayType("audio/mp4") == "maybe"){
			extention_str += ".webm";
		}
		
		extentions_ar = extention_str.split(".");
		extentions_ar.shift();
		
		audio_el = null;
		return extentions_ar;
	})();
	
	FWDRoyalAudioPlayer.instaces_ar = [];
	
	FWDRoyalAudioPlayer.READY = "ready";
	FWDRoyalAudioPlayer.START_TO_LOAD_PLAYLIST = "startToLoadPlaylist";
	FWDRoyalAudioPlayer.LOAD_PLAYLIST_COMPLETE = "loadPlaylistComplete";
	FWDRoyalAudioPlayer.STOP = "stop";
	FWDRoyalAudioPlayer.PLAY = "play";
	FWDRoyalAudioPlayer.PAUSE = "pause";
	FWDRoyalAudioPlayer.UPDATE = "update";
	FWDRoyalAudioPlayer.UPDATE_TIME = "updateTime";
	FWDRoyalAudioPlayer.ERROR = "error";
	FWDRoyalAudioPlayer.PLAY_COMPLETE = "playComplete";
	FWDRoyalAudioPlayer.PLAYLIST_LOAD_COMPLETE = "onPlayListLoadComplete";
	FWDRoyalAudioPlayer.POPUP = "popup";
	FWDRoyalAudioPlayer.START = "start";
	
	
	window.FWDRoyalAudioPlayer = FWDRoyalAudioPlayer;
	
}(window));

