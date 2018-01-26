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
  const text = 'INSERT INTO temperatures(location, temperature, time) values ($1, $2, $3)'
  const values = [data.location, data.temp, data.time]

  db.query(text, values)
    .then(res => {
      res.redirect('back');
    }).catch(err => console.error('error executing query', err.stack));
});

router.get('/api/v1/weather', (req, res) => {
  const text = "SELECT * FROM temperatures WHERE location = '" + req.query.location.toLowerCase() + "'"
  var results = {};
  db.query(text)
    .then(result => {
      results = result.rows; 
      console.log(results);
      res.status(200).json(results);
    })
    .catch(err => console.error('error executing query', err.stack));

});

module.exports = router;
