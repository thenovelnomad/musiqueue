var express = require('express');
var router = express.Router();

/* GET settings page. */
router.get('/', function(req, res) {
  res.render('settings', { title: 'Music Quick Search' });
});

module.exports = router;
