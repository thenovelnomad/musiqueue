(function() {
	chrome.tabs.getCurrent(function(currentTab) {
		chrome.tabs.update(currentTab.id, {url: "http://localhost:5000"});
	});
})();














