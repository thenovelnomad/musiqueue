console.log("Content script loaded");

function frameHandler(active, url) {
	var frame = document.getElementById("mq-frame");

	if (!frame) {
		frame = document.createElement('iframe');
		frame.setAttribute('width', '100%');
		frame.setAttribute('height', '0px');
		frame.setAttribute('frameborder', '0');
		frame.setAttribute('id', 'mq-frame');
		frame.setAttribute('style', 'position:fixed; display:block; z-index:2147483647; left:0; bottom: 0;');
		document.body.appendChild(frame);
	}

	if (typeof url == "undefined") {
		if (typeof localStorage["mq-last"] == "undefined") {
			url = "http://musiqueue.herokuapp.com/query";
		} else {
			url = localStorage["mq-last"];
		}
	} 

	if (url === "http://musiqueue.herokuapp.com/query") {
		frame.setAttribute('height', '75px');
	} else {
		frame.setAttribute('height', '350px');
	}

	if (active == "1") {
		localStorage["mq-last"] = url;
		frame.setAttribute('src', url);
	} else {
		frame.remove();
	}
};

chrome.runtime.sendMessage({"response": localStorage["mqActive"]}, function(response) {
	console.log("Message responder");
	console.log(response);

	frameHandler(response.loadFrame);
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		var active;

		if (typeof localStorage["mqActive"] == "undefined") {
			active = false;
		} else {
			active = true;
		}

		if (request.switch == "1") {
			active = !active;

			if (active) {
				frameHandler("1", request.url);
			} else {
				frameHandler("0")
			}
		}

		if (request.url) {
			frameHandler("1", request.url);
		}	

   		if (active) {
   			localStorage["mqActive"] = 1;
   		} else {
   			localStorage.removeItem("mqActive");
   		}

   		sendResponse(localStorage["mqActive"]);
});
