var express = require('express');
var debug = require('debug')('Music Quick Search');
var router = express.Router();

router.get('/', function(req, res) {
	res.render('search', { 
		title: 'Music Quick Search',
		type: req.query.type,
		key: req.query.key
	});
});

module.exports = router;