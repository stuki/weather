var pg = require('pg');

var connectionString = process.env.DATABASE_URL
var createTableText = `
CREATE TABLE temperatures(
    id SERIAL PRIMARY KEY,
    location VARCHAR(40) not null, 
    temp INT not null, 
    time TIMESTAMPTZ);
`

var client = new pg.Client(connectionString);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query(createTableText, function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows);
    client.end();
  });
});