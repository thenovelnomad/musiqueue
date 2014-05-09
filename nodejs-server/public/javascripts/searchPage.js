(function() {
	// initiate main object on window
	window.Main = {
		results: {},
		
		actions: {
			"Play Now": function(id){
				key = Main.results[id].key;
				R.player.play({source: key});
			},
			"Add to Queue": function(id){
				key = Main.results[id].key;
				R.player.queue.add(key);
				R.player.queue.on("add", function(model, collection, info) {
				  console.log("Source " + model.get("name") + " added to queue at " + info.index);
				})
			},
			"Add to Playlist": function(id){
				var key = Main.results[id].key;
				var type = Main.results[id].type;
				
				$.get('/settings/get', function(data) {
					if (!data) {
						alert("There was an error retrieving your playlist key. Please try again.");
					}
					else {
						var playlistKey = data;
						
						if (type == "a"){
							key = "";
							var trackKeys = Main.results[id].trackKeys;
							while (trackKeys.length > 0) {
								key += trackKeys.shift() + ",";
							};
						}

						R.request({
							method: "addToPlaylist",
							content: {
								playlist: playlistKey,
								tracks: key
							},
							success: function(response){
								console.log(Main.results[id].name + "successfully added to playlist.");
							},
							error: function(response) {
						    	console.log("Error with add to playlist for " + key + ": " + response.message);
						  	}
						});
					}
				});
			},
			"Add to Collection": function(id){
				key = Main.results[id].key;
				R.request({
					method: "addToCollection",
					content: {keys: key},
					success: function(response){
						console.log(Main.results[id].name + "successfully added to collection.");
					},
					error: function(response) {
				    	console.log("error with add to collection for " + key + ": " + response.message);
				  	}
				});
			}
		},
			
    	init: function() {
      		var self = this;

			//Initiate rdio API
		    R.ready(function() {
				if (!R.authenticated) {
					$.get('./');
				}
				else {
					var query = $("#query").data();
					console.log(query);
					self.search(query, function(results) {
						self.displayResults(results);
					});
				}
				
				$("#search-results").on("click", "button", function() {
					var action = $(this).attr("title");
					var id = $(this).closest("div[id^='result']")
									.attr("id")
									.replace("result-","");
					var type = self.results[id].type;
					console.log(action);

					self.actions[action](id);
				});
			});
		},
		
		search: function(query,callback) {
			var self = this;
			R.request({
				method: "search",
				content: {
					query: query.key,
					types: query.type,
					count: 5,
				},
				success: function(response) {
					self.results = response.result.results;
					if (query.type != "Artist"){
						if (typeof callback == "function") {
							callback(self.results);
						}
					}
					else{
						var artistKey = self.results[0].key;
						self.artistTracks(artistKey, callback);
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
					count: 5,
				},
				success: function(response) {
					self.results = response.result;
					if (typeof callback == "function") {
						callback(self.results);
					}
				},
			  	error: function(response) {
			    	console.log("error with search for " + key + ": " + response.message);
			  	}
			});
		},
		
		displayResults: function(results, callback) {
			function parseData(track) {
				var container = $("<div class=\"col-md-6\"></div>");
				container.append("<h4><a href=\"" + track.shortUrl + "\">" + track.name + " - " + track.artist + "</a></h4>");
				return container;
			};

			console.log("In display");
			console.log(results);

			var node = $("#search-results");

			for (var i = 0; i < results.length; i++) {
				var resultInfo = parseData(results[i]);
				var buttons = $("#result-options").clone()
												  .removeAttr("id")
												  .removeClass("hidden");
				node.append($("<div id=\"result-"+i+"\" class=\"row\"></div>"));

				$("#result-"+ i).append(buttons)
							    .append(resultInfo);
			};
		}
	};
			
	$(document).ready(function() {
	    Main.init();
	});
})()