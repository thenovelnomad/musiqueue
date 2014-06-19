(function() {
	window.nowPlay = {
		
		/* Stores currently playing track key */
		track: "",
		
		/* 	
		Loads now playing information from rdio
		Reveals main HTML once load is complete
		*/
		
		load: function(callback) {
			var self = this;
			var artist, album, trackName, url, albumCover;
			
			var track = R.player.playingTrack();

			if (track !== null) {
				artist = track.get('artist') || '';
		    	album = track.get('album') || '';
		    	trackName = track.get('name') || '';
				url = track.get('shortUrl') || '';
		    	albumCover = track.get('icon').replace('200.jpg', '1200.jpg');
				
				$("#now-play").find(".track-info").remove();
				
				$("#now-play").find("a").attr("href", url);
				$("#now-play").find("a").html("<h3 class=\"track-info\">" + trackName + " - " + artist + "</h3>");
				$("img.bg").attr("src", albumCover);
				
				if (typeof callback == "function") {
					callback(true);
				}
		    }
			else {
				if (typeof callback == "function") {
					callback(false);
				}
			}
		},
		
		stateToggle: function(playState) {
			if (playState == 1) {
				$("#main-play").attr("title", "Pause");
				$("#main-play").children("span").removeClass("glyphicon-play").addClass("glyphicon-pause");
			}
			else {
				$("#main-play").attr("title", "Play");
				$("#main-play").children("span").removeClass("glyphicon-pause").addClass("glyphicon-play");
			}
		},
		
		clickHandler: function(button) {
			var id = button.attr('id');
			if (id == "main-play") {
				R.player.togglePause();
			}
			else if (id == "main-back"){
				R.player.previous();
			}
			else if (id == "main-next"){
				R.player.next();
			}
		}
	};
})();