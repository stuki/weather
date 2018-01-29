# Weather

A small exercise for my [summer job application for Reaktor](https://github.com/reaktor/kesa-2018). The task was to create an app that displays the current user submitted temperature for pre-determined locations (just so happens to be the same locations that Reaktor has offices, who'd have thunk!), and the minimum and maximum temperatures for the day. Clicking on a location brings you to a graph (not part of the task), and the submission form. Deployed on Heroku, using Express and PostgreSQL.

[It currently lives on heroku](https://stuki-weather.herokuapp.com)

## Setup

```
CREATE TABLE temperatures(
    id SERIAL PRIMARY KEY,
    location VARCHAR(40) not null, 
    temperature INT not null, 
    time TIMESTAMPTZ);
```

copy data to database with `\copy temperatures(location,temperature,time) FROM '/path/to/csv/data.csv' DELIMITER ',' CSV HEADER;`

## Built With

* [Express](https://expressjs.com/)
* PostgreSQL
* [Bootstrap](https://getbootstrap.com/)

## Author

**Oscar Storbacka**

[Here's some sort of resume if you're interested](https://github.com/stuki/resume/)
