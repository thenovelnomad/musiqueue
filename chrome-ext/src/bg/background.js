function onClickHandler(info, tab) {
	var key = info.selectionText;
	var menu = info.menuItemId;
	var url = "http://localhost:5000/query?key=" + key + "&type=" + menu;
	
	console.log(info);
	console.log(menu);
	console.log(url);
	
	chrome.windows.create({
		"url": url,
		width: 800,
		height: 215,
		type: "popup"
	});
	

};

var url = "";

var parent = chrome.contextMenus.create({"id":"rdio","title": "Search Rdio for %s", "contexts":["selection"]});
var chArtist = chrome.contextMenus.create({"id":"Artist","title": "Artist", "contexts":["selection"], "parentId":parent});
var chAlbum = chrome.contextMenus.create({"id":"Album","title": "Album", "contexts":["selection"], "parentId":parent});
var chSong = chrome.contextMenus.create({"id":"Track","title": "Track", "contexts":["selection"], "parentId":parent});

chrome.contextMenus.onClicked.addListener(onClickHandler);