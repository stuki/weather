const express = require('express');
const router = express.Router();
const db = require('../db');

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const temperatureRangeQuery = "SELECT location AS location, MAX(temperature) AS max, MIN(temperature) AS min \
                                   FROM temperatures \
                                   WHERE time > NOW() - interval '1 day' \
                                   GROUP BY location";

    const temperatureCurrentQuery = "SELECT DISTINCT ON (location) * \
                                     FROM temperatures \
                                     ORDER BY location, time DESC";

    const temperatureRange = await db.query(temperatureRangeQuery);
    const temperatureCurrent = await db.query(temperatureCurrentQuery);

    let data = {
      'helsinki': {},
      'amsterdam': {},
      'dubai': {},
      'tokyo': {},
      'new york': {}
    };

    for (var i in temperatureCurrent.rows) {
      data[temperatureCurrent.rows[i].location].current = temperatureCurrent.rows[i].temperature;
    };
    for (var i in temperatureRange.rows) {
      data[temperatureRange.rows[i].location].max = temperatureRange.rows[i].max;
      data[temperatureRange.rows[i].location].min = temperatureRange.rows[i].min;
    };

    res.render('index', { title: 'Weather', data: data });
  } catch(err) {
    next(err);
  };
  
});


// API Handler
router.post('/api/v1/weather', (req, res) => {
  const data = {location: req.body.location.toLowerCase(), temp: req.body.temp, time: new Date()};  
  const text = 'INSERT INTO temperatures(location, temperature, time) values ($1, $2, $3)';
  const values = [data.location, data.temp, data.time];

  db.query(text, values)
    .then(result => {
      res.redirect('back');
    }).catch(err => console.error('error executing query', err.stack));
});

router.get('/api/v1/weather', async (req, res, next) => {
  try {
    const text = "SELECT * \
                FROM temperatures \
                WHERE location = $1"; 

    const locations = ["helsinki", "tokyo", "dubai", "new york", "amsterdam"];

    let values = [];

    if (locations.indexOf(req.query.location.toLowerCase()) > -1 ) {
      values.push(req.query.location.toLowerCase());
    };

    const results = await db.query(text, values);
    res.status(200).json(results.rows);
  
  } catch(err) {
    next(err);
  };
});

module.exports = router;