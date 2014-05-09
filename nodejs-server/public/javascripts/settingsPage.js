(function() {
	// initiate main object on window
	window.Main = {
		playlists: {},
			
    	init: function() {
      		var self = this;

			//Initiate rdio API
		    R.ready(function() {
			
				if (!R.authenticated()) {
					R.authenticate(function(success){
						console.log(success);
						if (!success) {
							$("#now-play").fadeOut();
							$("#main").fadeIn();
							$("#not-auth").fadeIn();
							$("#auth-btn").data("function", "auth")
										  .text("Authenticate");
						}
						else {
							self.init();
						}
					});
				}
				else {
					$("#not-auth").fadeOut();
					$("#auth-btn").data("function", "save")
								  .text("Save");
					self.loadPlaylists(function() {
						$.get('/settings/get', function(data) {
							console.log(data);
							$("#playlist-select").val(data);
							
							self.nowPlay(function() {
								$("#main").fadeIn();
								$("#now-play").fadeIn();
							});
						});
					});
					
				}
				$("#auth-btn").on('click', function() {
					var mode = $("#auth-btn").data("function");
					if (mode == "auth") {
						self.init();
					}
					else {
						self.save();
					}
				});
			});
		},
		
		/* 	
		Loads now playing information from rdio
		Reveals main HTML once load is complete
		*/
		
		nowPlay: function(callback) {
			var track = R.player.playingTrack();

			if (track) {
				artist = track.get('artist') || '';
		      	album = track.get('album') || '';
		      	trackName = track.get('name') || '';
				url = track.get('shortUrl') || '';
		      	albumCover = track.get('icon');
		    }

			var albumArt = $("<img src=\"" + albumCover + "\" alt=\"Album Art\" class=\"img-rounded\">");
			var songLink = $("<p class=\"text-center\"><a href=\"" + url + "\">" + trackName + " - " + artist + "</a></p>");

			$("#album-art").append(albumArt);
			$("#album-art").append(songLink);
			
			callback();
		},
		
		loadPlaylists: function(callback) {
			var self = this;
			var userKey = R.currentUser.get("key");
			
			R.request({
				method: "getUserPlaylists",
				content: {
					user: userKey
				},
				success: function(response) {
						self.playlists = response.result;
						for (var i = 0; i < self.playlists.length; i++){
							var name = self.playlists[i].name;
							var element = $("<option value=" + self.playlists[i].key + ">" + name + "</option>");
							$("#playlist-select").append(element);
						};
						
						$("#playlist-select").children("option").first().text("-");
						
						if (typeof callback == "function") {
							callback();
						}
				},
				error: function(response) {
			    	console.log("error with loading playlists: " + response.message);
			  	}
			});	
		},
		
		save: function(callback) {
			var playlistKey = $("#playlist-select").val();
			
			
			$.get('/settings/save', {"playlistKey": playlistKey}, function(data) {
				if (!data) {
					alert("There was an error saving the data. Please try again.");
				}
			});
			
			if (typeof callback == "function") {callback();}
		}
	};

	$(document).ready(function() {
	    Main.init();
	});
})();














