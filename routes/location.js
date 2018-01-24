var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:location', function(req, res, next) {
  res.render('location',  {title: req.params.location});
});

module.exports = router;
