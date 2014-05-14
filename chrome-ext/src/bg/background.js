function onClickHandler(info, tab) {
	var key = info.selectionText;
	var menu = info.menuItemId;
	var url = "http://musicquicksearch.herokuapp.com/query?key=" + key + "&type=" + menu;
	
	var tabId = localStorage.musicSearchTabId;
	var windowId = localStorage.musicSearchWindowId;
	
	if (tabId === undefined) {
		chrome.windows.create({
			"url": url,
			width: 1199,
			height: 234,
			type: "popup"
		},
		function(resultWindow) {
			localStorage.musicSearchWindowId = resultWindow.id;
			localStorage.musicSearchTabId = resultWindow.tabs[0].id;
		});
	} 
	else {
		chrome.windows.update(parseInt(windowId), {focused: true}, function(focusWindow) {
			chrome.tabs.update(parseInt(tabId), {"url": url}, function(tab) {
				if (typeof tab == undefined) {
					console.log("there was an error");
				}
			});
		});
	}
};

var url = "";

var parent = chrome.contextMenus.create({"id":"rdio","title": "Search Rdio for %s", "contexts":["selection"]});
var chArtist = chrome.contextMenus.create({"id":"Artist","title": "Artist", "contexts":["selection"], "parentId":parent});
var chAlbum = chrome.contextMenus.create({"id":"Album","title": "Album", "contexts":["selection"], "parentId":parent});
var chSong = chrome.contextMenus.create({"id":"Track","title": "Track", "contexts":["selection"], "parentId":parent});

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	if (tabId == localStorage.getItem('musicSearchTabId')) {
		localStorage.removeItem('musicSearchTabId');
		localStorage.removeItem('musicSearchWindowId');
	}
});