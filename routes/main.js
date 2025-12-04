// Create a new router
const express = require("express")
const router = express.Router()
const request = require('request');

// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
});

router.get('/about',function(req, res, next){
    res.render('about.ejs')
});

// Weather route (Lab 9a)
router.get('/weather', function (req, res, next) {
  // Get city from query string eg:london. Default: London
  let city = req.query.city || 'London';

  // Your OpenWeatherMap API key
  let apiKey = '0d4fe764426a58f20bf1d6b2d1c32407';

  // Build the URL for the API call
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  // Call the API
  request(url, function (err, response, body) {
    if (err) {
      // If the HTTP request itself failed
      return next(err);
    }

    // Try to parse the JSON
    let weather;
    try {
      weather = JSON.parse(body);
    } catch (e) {
      return res.render('weather.ejs', {
        weather: null,
        error: 'Error parsing weather data.'
      });
    }

    // Lab 9a Task 6 – error handling if city is invalid :contentReference[oaicite:2]{index=2}
    if (weather && weather.main) {
      const data = {
        name: weather.name,
        temp: weather.main.temp,
        humidity: weather.main.humidity,
        windSpeed: weather.wind && weather.wind.speed,
        description: weather.weather && weather.weather[0] && weather.weather[0].description
      };

      res.render('weather.ejs', {
        weather: data,
        error: null
      });
    } else {
      res.render('weather.ejs', {
        weather: null,
        error: 'No data found for that city.'
      });
    }
  });
});

// Export the router object so index.js can access it
module.exports = router