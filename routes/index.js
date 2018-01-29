const express = require('express');
const router = express.Router();
const db = require('../db');


/// GET index, query the database for temperature data
router.get('/', async (req, res, next) => {
  try {

    const dataQuery = "SELECT \
                         location AS location, \
                         (SELECT temperature \
                           FROM temperatures t2 \
                           WHERE t2.location = t1.location \
                           ORDER BY time \
                           DESC LIMIT 1) AS current, \
                         MAX(temperature) AS max, \
                         MIN(temperature) AS min \
                       FROM temperatures t1 \
                       WHERE time > NOW() - interval '1 day' \
                       GROUP BY location";

    const rawData = await db.query(dataQuery);

    let data = {
                'amsterdam': {}, 
                'dubai': {},
                'helsinki': {},
                'new york': {}, 
                'tokyo': {}
               };

    for (i in rawData.rows) {
      data[rawData.rows[i].location] = {
        current: rawData.rows[i].current, 
        max: rawData.rows[i].max, 
        min: rawData.rows[i].min}
    }

    res.render('index', { title: 'Weather', data: data });
  } catch(err) {
    next(err);
  };
  
});



// GET /location/:location
router.get('/location/:location', function(req, res, next) {
  res.render('location',  {title: req.params.location});
});



// API Handler
router.post('/api/v1/weather', (req, res) => {
  if (req.body.temp > -90 && req.body.temp < 60) {
    const data = {location: req.body.location.toLowerCase(), temp: req.body.temp, time: new Date()};  
    const text = 'INSERT INTO temperatures(location, temperature, time) values ($1, $2, $3)';
    const values = [data.location, data.temp, data.time];

    db.query(text, values)
      .then(result => {
        res.redirect('back');
      }).catch(err => console.error('error executing query', err.stack));
  } else {
    res.json('Error: Temperature out of range (-90C - 60C)')
  };
});

router.get('/api/v1/weather', async (req, res, next) => {
  try {
    const text = "SELECT * \
                  FROM temperatures \
                  WHERE location = $1";

    let values = [];
    values.push(req.query.location.toLowerCase());

    const results = await db.query(text, values);
    res.status(200).json(results.rows);
  
  } catch(err) {
    next(err);
  };
});

module.exports = router;