(function() {
	// initiate main object on window
	window.Main = {
		playlistKey: "",
		
		getPlaylistKey: function() {
			var self = this;
			console.log(self);
			
			$.get('/settings/get', function(data) {
				if (!data || typeof data === 'undefined') {
					console.log("There was an error retrieving your playlist key. Please try again.");
				}
				else {
					self.playlistKey = data;
				}
			});
		},
			
		init: function() {
     		var self = this;

			self.getPlaylistKey();

			//Initiate rdio API
			R.ready(function() {
				self.spin(false);
				if (!R.authenticated) {
					$.get('./');
				}
				else {
					var query = $("#query").data();
					self.search(query, function(results) {
						resultHandler.displayResults(results);
					});
					nowPlay.load(function(data) {
						if (data) {
							$("#now-play").fadeIn();
						}
					});
				}
				
				R.player.on("change:playingTrack", function(newValue) {
					nowPlay.load(function(data) {
						if (data) {
							$("#now-play").fadeIn();
						}
					});
				});
				
				R.player.on("change:playState", function(newValue) {
					nowPlay.stateToggle(newValue);
				});
				
				$("#search-results").on("click", "button", function() {
					var button = $(this);
					resultHandler.clickHandler(button);
				});
				
				$("#now-play").on("mouseup","button", function() {
					var button = $(this);
					nowPlay.clickHandler(button);
				});
			});
			
			self.spin(true);
		},
		
		search: function(query,callback) {
			R.request({
				method: "search",
				content: {
					query: query.key,
					types: query.type,
					count: 5
				},
				success: function(response) {
					resultHandler.results = response.result.results;
					if (query.type != "Artist"){
						if (typeof callback == "function") {
							callback(resultHandler.results);
						}
					}
					else{
						var artistKey = resultHandler.results[0].key;
						Main.artistTracks(artistKey, callback);
					}
				},
				error: function(response) {
					console.log("error with search for " + query.key + "of type " + query.type +": " + response.message);
				}
			});
		},
		
		artistTracks: function(key, callback) {
			var self = this;

			R.request({
				method: "getTracksForArtist",
				content: {
					artist: key,
					count: 5
				},
				success: function(response) {
					resultHandler.results = response.result;
					if (typeof callback == "function") {
						callback(resultHandler.results);
					}
				},
				error: function(response) {
					console.log("error with search for " + key + ": " + response.message);
				}
			});
		},
		
		spin: function(value) {
			var opts = {
			  lines: 11, // The number of lines to draw
			  length: 20, // The length of each line
			  width: 4, // The line thickness
			  radius: 25, // The radius of the inner circle
			  corners: 1, // Corner roundness (0..1)
			  rotate: 0, // The rotation offset
			  direction: 1, // 1: clockwise, -1: counterclockwise
			  color: '#000', // #rgb or #rrggbb or array of colors
			  speed: 0.8, // Rounds per second
			  trail: 74, // Afterglow percentage
			  shadow: false, // Whether to render a shadow
			  hwaccel: false, // Whether to use hardware acceleration
			  className: 'spinner', // The CSS class to assign to the spinner
			  zIndex: 2e9, // The z-index (defaults to 2000000000)
			  top: '50%', // Top position relative to parent
			  left: '50%' // Left position relative to parent
			};
	    	if (value) {
	    		this.spinner = new Spinner(opts).spin($("body")[0]);     
	    	} else {
	    		this.spinner.stop();
	    	}
	    }
	};
			
	$(document).ready(function() {
		Main.init();
	});
})();