function onClickHandler(info, tab) {
	//Handles query coming from context menu
	var key = info.selectionText;
	var menu = info.menuItemId;
	console.log(menu + ": " + key);
	var url = "http://localhost:5000/query?key=" + key + "&type=" + menu;
	
	var tabId = tab.id;

	chrome.tabs.sendMessage(tabId, {"switch": 0, "url": url});

	chrome.tabs.onUpdated.addListener(function(changeTabId, changeInfo, changeTab) {
		if (changeTabId === tabId){
			chrome.tabs.sendMessage(tabId, {"switch": 0, "url": url});
		}
	});
};

function toggleExtIcon(tog) {
	if (tog == "1") {
		chrome.browserAction.setIcon({path:"icons/icon16.png"});
	} else {
		chrome.browserAction.setIcon({path:"icons/icon16bw.png"});
	}
};

function toggleContextMenus(tog) {
		if (tog == "1") {
			//Enable context menus
			chrome.contextMenus.update("rdio",{"enabled": true});
			chrome.contextMenus.update("Artist",{"enabled": true});
			chrome.contextMenus.update("Album",{"enabled": true});
			chrome.contextMenus.update("Track",{"enabled": true});
		} else {
			//Disable context menus
			chrome.contextMenus.update("rdio",{"enabled": false});
			chrome.contextMenus.update("Artist",{"enabled": false});
			chrome.contextMenus.update("Album",{"enabled": false});
			chrome.contextMenus.update("Track",{"enabled": false});
		}
};

var parent = chrome.contextMenus.create({
	"id":"rdio",
	"title": "Search Rdio for %s", 
	"contexts":["selection"], 
	"enabled": false
});
var chArtist = chrome.contextMenus.create({
	"id":"Artist",
	"title": "Artist", 
	"contexts":["selection"], 
	"parentId": parent,
	"onclick": onClickHandler,
	"enabled": false	
});
var chAlbum = chrome.contextMenus.create({
	"id":"Album",
	"title": "Album", 
	"contexts":["selection"], 
	"parentId": parent,
	"onclick": onClickHandler,
	"enabled": false	
});
var chSong = chrome.contextMenus.create({
	"id":"Track",
	"title": "Track", 
	"contexts":["selection"], 
	"parentId":parent,
	"onclick": onClickHandler,
	"enabled": false	
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	toggleExtIcon(message.response);

	toggleContextMenus(message.response);

	sendResponse({loadFrame: message.response});
});

chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.sendMessage(tab.id, {"switch": 1}, function(response) {
		console.log("Responder: " + response);

		toggleExtIcon(response);

		toggleContextMenus(response);
	});
});

chrome.tabs.onActivated.addListener(function(active) {
	var tabId = active.tabId;

	chrome.tabs.sendMessage(tabId, {"switch": 0}, function(response) {
		console.log("Responder: " + response);

		toggleExtIcon(response);

		toggleContextMenus(response);
	});
});