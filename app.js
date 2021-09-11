const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
require("dotenv").config()


const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Current date
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const date = new Date();
const currentDay = days[date.getDay()];
const today = date.getDate();
const currentMonth = date.toLocaleString('default', { month: 'short' });
const currentYear = date.getFullYear();
const currentTime = date.getTime();


app.get("/", function(req, res){

  res.render("homePage", {currentYear:currentYear});
});


app.post("/", function(req, res){
  const query = _.capitalize(req.body.cityName);
  const key = process.env.API_KEY;
  const unit = "metric";

  const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+key+ "&units="+unit;

  https.get(url, function (response){
    // console.log(response.statusCode);

    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      const temperature = Math.round(weatherData.main.temp);
      const feelsLikeTemp = Math.round(weatherData.main.feels_like);
      const weatherDescription = _.capitalize(weatherData.weather[0].description);
      const speed = weatherData.wind.speed;
      const humidity = weatherData.main.humidity;
      const icon = weatherData.weather[0].icon;
      const iconURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
      res.render("results",
      {
        currentYear:currentYear,
        currentTime: currentTime,
        today: today,
        currentDay: currentDay,
        currentMonth: currentMonth,
        currentYear: currentYear,
        temperature: temperature,
        feelsLikeTemp:feelsLikeTemp,
        weatherDescription:weatherDescription,
        speed: speed,
        humidity: humidity,
        query: query,
        iconURL: iconURL
      });
    });

  });
})






app.listen(3000, function(){
  console.log("Server is running on port 3000.");
});
