var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../db') 
var sanitize = require('express-validator/filter');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Weather' });
});

router.post('/api/v1/weather', (req, res) => {
  var data = {location: req.body.location.toLowerCase(), temp: req.body.temp, time: new Date()};
  console.log(data);
  
  var text = 'INSERT INTO temperature(location, temp, time) values ($1, $2, $3)'
  var values = [data.location, data.temp, data.time]

  db.query(text, values)
    .then(resdb => {
      req.flash('success');
      res.redirect('back');
    }).catch(err => console.error('error executing query', err.stack));
});

router.get('/api/v1/weather', (req, res) => {
  var text = "SELECT * FROM temperature WHERE location = '" + req.query.location + "'"
  var results = {};
  db.query(text)
  .then(resdb => {
    results = resdb.rows; 
    res.status(200).json(results);
  })
  .catch(err => console.error('error executing query', err.stack));
});

module.exports = router;
