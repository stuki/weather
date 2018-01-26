const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../db') 
const sanitize = require('express-validator/filter');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Weather' });
});

router.post('/api/v1/weather', (req, res) => {
  const data = {location: req.body.location.toLowerCase(), temp: req.body.temp, time: new Date()};
  console.log(data);
  
  const text = 'INSERT INTO temperature(location, temp, time) values ($1, $2, $3)'
  const values = [data.location, data.temp, data.time]

  db.query(text, values)
    .then(res => {
      req.flash('success');
      res.redirect('back');
    }).catch(err => console.error('error executing query', err.stack));
});

router.get('/api/v1/weather', (req, res) => {
  const text = "SELECT * FROM temperature WHERE location = '" + req.query.location + "'"
  var results = {};
  db.query(text)
    .then(res => {
      results = res.rows; 
    })
    .catch(err => console.error('error executing query', err.stack));

   await res.status(200).json(results);
});

module.exports = router;
