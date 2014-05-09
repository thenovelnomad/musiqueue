var express = require('express');
var router = express.Router();

router.get('/save', function(req, res) {
	console.log("some more stuff");
  	res.cookie('playlistKey', req.query.playlistKey, {
			signed: true,
			expires: new Date(Date.now() + 1000*60*60*24*30)
	});
	
	res.send(true);
});

router.get('/get', function(req, res) {
  	res.send(req.signedCookies.playlistKey) 
});

module.exports = router;