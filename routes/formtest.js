var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('formtest', { title: 'express' });
});

router.get('/testezin', function(req, res, next) {
  res.render('formtest', { title: 'cafe expresso e gostoso' });
});

module.exports = router;
