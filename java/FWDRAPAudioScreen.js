/* thumbs manager */
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

}(window));