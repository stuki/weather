const express = require('express');
const router = express.Router();

router.get('/:location', function(req, res, next) {
  res.render('location',  {title: req.params.location});
});

module.exports = router;
