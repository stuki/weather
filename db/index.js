const { Pool } = require('pg');

const pool = new Pool({
	host: process.env.DATABASE_URL
	database: 'temperatures'
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  }
};