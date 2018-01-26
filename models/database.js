const Pool = require('pg');

const createTableText = `
CREATE TABLE temperatures(
    id SERIAL PRIMARY KEY,
    location VARCHAR(40) not null, 
    temp INT not null, 
    time TIMESTAMPTZ);
`

const pool = new Pool()

pool.query(createTableText)
  .then(res => console.log(res.rows[0]))
  .catch(e => console.error(e.stack));

await pool.end();