const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../db') 
const sanitize = require('express-validator/filter');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Weather', data: JSON.stringify(findTemperatures('helsinki')) });
});

router.post('/api/v1/weather', (req, res) => {
  const data = {location: req.body.location.toLowerCase(), temp: req.body.temp, time: new Date()};  
  const text = 'INSERT INTO temperatures(location, temperature, time) values ($1, $2, $3)';
  const values = [data.location, data.temp, data.time]

  db.query(text, values)
    .then(result => {
      res.redirect('back');
    }).catch(err => console.error('error executing query', err.stack));
});

router.get('/api/v1/weather', (req, res) => {
  const text = "SELECT * \
                FROM temperatures \
                WHERE location = '" + req.query.location.toLowerCase() + "'"; 
  let results = {};
  db.query(text)
    .then(result => {
      results = result.rows; 
      // console.log(results);
      res.status(200).json(results);
    })
    .catch(err => console.error('error executing query', err.stack));

});

module.exports = router;

function findTemperatures(location) {
  const maxTemperatureQuery = "SELECT max(temperature) \
                               FROM temperatures \
                               WHERE location = '" + location + "' \
                               AND time > NOW() - interval '1 day'";

  const minTemperatureQuery = "SELECT min(temperature) \
                               FROM temperatures \
                               WHERE location = '" + location + "' \
                               AND time > NOW() - interval '1 day'";

  const currentTemperatureQuery = "SELECT temperature \
                                   FROM temperatures \
                                   WHERE location = '" + location + "' \
                                   ORDER BY time DESC LIMIT 1";

  let temperatures = {location: {'current': null, 'hi': null, 'low': null}}
  
  let databaseQuery = new Promise((resolve, reject) => {
    db.query(currentTemperatureQuery).then(res => {
      // console.log(res.rows);
      temperatures.location.current = res.rows[0];
    }).catch(err => console.error('error executing query', err.stack));

    db.query(minTemperatureQuery).then(res => {
      // console.log(res.rows);
      temperatures.location.low = res.rows[0];
    }).catch(err => console.error('error executing query', err.stack));

    db.query(maxTemperatureQuery).then(res => {
      // console.log(res.rows);
      temperatures.location.max = res.rows[0];
    }).catch(err => console.error('error executing query', err.stack));
  });

  databaseQuery.then(resolve => { console.log(JSON.stringify(temperatures)); return temperatures; });
}