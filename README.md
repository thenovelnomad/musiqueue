MusiQueue
============================

A Chrome extension that adds a context menu to quickly search Rdio for a text selection by track, artist, or album.

After loading the extension in Chrome, click the link to the options page. This will begin authentication with Rdio. Once authentication is complete, the page should refresh and you should see what's currently playing on Rdio as a confirmation that the Rdio authentication was a success.

You can select a default playlist to which you can add tracks and albums. Click save to store the setting.

During browsing, you should now see a new context menu titled Search Rdio for... upon selecting some text and right-clicking. This menu has three child menus, Artist, Album, and Track. When one is selected, the extension will launch a small pop-up window with the top five results returned by Rdio. You are able to Play, Queue, Add to Playlist, and Add to Collection directly from this popup.

Notes:
Performing an Artist search, finds the first resulting artist for your search and then returns that artist's top 5 tracks.

Currently, if you directly play a track and close the popup, the track will stop playing. Will try to change this behavior.


[![Stories in Ready](https://badge.waffle.io/thenovelnomad/musiqueue.png?label=ready&title=Ready)](https://waffle.io/thenovelnomad/musiqueue)
