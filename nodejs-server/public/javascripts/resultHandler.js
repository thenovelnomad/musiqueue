(function() {
	window.resultHandler = {
		result: {},
		
		actions: {
			"Play Now": function(id, button){
				var key = resultHandler.results[id].key;
				R.player.play({source: key});
			},
			"Add to Queue": function(id, button){
				var key = resultHandler.results[id].key;
				R.player.queue.add(key);
				R.player.queue.on("add", function(model, collection, info) {
					button.attr("disabled", "disabled");
				});
			},
			"Add to Playlist": function(id, button){
				var playlistKey = Main.playlistKey;
				var key = resultHandler.results[id].key;
				var type = resultHandler.results[id].type;
					
				if (type == "a"){
					key = "";
					var trackKeys = resultHandler.results[id].trackKeys;
					while (trackKeys.length > 0) {
						key += trackKeys.shift() + ",";
					}
				}

				R.request({
					method: "addToPlaylist",
					content: {
						playlist: playlistKey,
						tracks: key
					},
					success: function(response){
						button.attr("disabled", "disabled");
					},
					error: function(response) {
						console.log("Error with add to playlist for " + key + ": " + response.message);
					}
				});
			},
			"Add to Collection": function(id, button){
				var key = resultHandler.results[id].key;
				R.request({
					method: "addToCollection",
					content: {keys: key},
					success: function(response){
						button.attr("disabled", "disabled");
					},
					error: function(response) {
						console.log("error with add to collection for " + key + ": " + response.message);
					}
				});
			}
		},
		
		displayResults: function(results, callback) {
			var node = $("#search-results");

			if (results.length === 0) {
				node.append("<h3>No results returned</h3>");
			}

			for (var i = 0; i < results.length; i++) {
				var container = $("#result-options").clone().removeAttr("id").removeClass("hidden");
				container.attr("id","result-" + i);
				container.find("a").attr("href", results[i].shortUrl);
				container.find("a").append("<div class=\'track-info\'>" + results[i].name + "</div>");
				container.find("a").append("<div class=\'track-info\'>" + results[i].artist + "</div>");
				container.find("img").attr("src",results[i].icon)
				node.append(container);
			}
		},
		
		clickHandler: function(button) {
			var action = button.attr("title");
			var id = button.closest("div[id^='result']");
			id = id.attr("id").replace("result-","");

			resultHandler.actions[action](id, button);
		}
	}
})();