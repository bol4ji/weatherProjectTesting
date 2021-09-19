/*jshint esversion: 6 */
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser"); // looks through the body and retrieve data based on name
const https = require("https"); // no need to install because it is a native node module


const app = express(); // initialze a new express app

app.set('view engine', 'ejs');




// this is needed to read the document/body page of the html
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

const date = new Date();

const cities = [
  "Accra",
  "Manchester",
  "Copenhagen",
  "Montreal",
  "Prague",
  "Amsterdam",
  "Porto",
  "Tokyo",
  "Moscow",
  "Dubai",
  "Stockholm",
  "Varna",
  "Caracas",
];



// request(req)
// response(res)
app.get("/", function(req, res) { // route file "/" means original homepage look at the form action
  const defaultCity = "lagos";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" +defaultCity+ "&units=imperial&appid="+process.env.ID;
  https.get(url, function(response){
    console.log(res.statusCode); // returns 200 if the api call is good

    response.on("data", function(data){
      const currentWeatherData = JSON.parse(data); // convert hex code to JSON
      console.log(currentWeatherData);
      const formatTemp = Math.round(currentWeatherData.main.temp);
      const cityName = currentWeatherData.name;
      const humidity = currentWeatherData.main.humidity + "%";
      const description = currentWeatherData.weather[0].main;
      const descriptiontv = currentWeatherData.weather[0].description;
      const currentDate = date.toDateString();
      const formatDate = currentDate.substring(currentDate.indexOf(" ") + 1); // format date for J
      console.log(formatDate);
      const currentTime = date.toLocaleTimeString();
      console.log(currentTime);
      const index = currentTime.indexOf(":", currentTime.indexOf(":") + 1);
      const timeFormat = currentTime.substring(0, index) + currentTime.substring(currentTime.indexOf(" "), currentTime.length);

      res.render("home",{
        temp: formatTemp,
        humid: humidity,
        cityName: cityName,
        timeFormat: timeFormat,
        formatDate: formatDate,
        description: description,
        cities: cities
      });
    });
  });
});

// what submitting the form should do
app.post("/", function(req, res) {
  // cityName is declared in the input html element
  // get the city name from user input
var finalCityName;

if(req.body.cityName == ""){
  finalCityName = req.body.cityNameBtn;
}else{
  finalCityName = req.body.cityName;
}
  const city = finalCityName; // no need to parse because it is in string
  console.log(city);
  //openweather map endpoint + path + parameter
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" +city+ "&units=imperial&appid="+process.env.ID;
  // the response is the data sent back from the openweathermap
  https.get(url, function(response) { // refer to external server
    console.log(response.statusCode); // find the status code
    // this correseponds to the a bunch of message(backend) the openweathermap sent
    // below

    //the actual data we care about
    response.on("data", function(data) {
      // console.log(data); this is going to be in hex code

      // change the hex code to a java object
      // this is all the data from the API including coordinates, visibility and others
      const currentWeatherData = JSON.parse(data);
      console.log(currentWeatherData);

      // JSON.stringify(object) this will turn an JS object into a flat string
      // that will take up the minimum amount of space

      const imgURL = "http://openweathermap.org/img/wn/" + currentWeatherData.weather[0].icon + "@2x.png";

      const formatTemp = Math.round(currentWeatherData.main.temp);
      const cityName = currentWeatherData.name;
      const humidity = currentWeatherData.main.humidity + "%";
      const description = currentWeatherData.weather[0].main;
      const descriptiontv = currentWeatherData.weather[0].description;
      const currentDate = date.toDateString();
      const formatDate = currentDate.substring(currentDate.indexOf(" ") + 1); // format date for J
      console.log(formatDate);
      const currentTime = date.toLocaleTimeString();
      console.log(currentTime);
      const index = currentTime.indexOf(":", currentTime.indexOf(":") + 1);
      const timeFormat = currentTime.substring(0, index) + currentTime.substring(currentTime.indexOf(" "), currentTime.length);

      res.render("home",{
        temp: formatTemp,
        humid: humidity,
        cityName: cityName,
        timeFormat: timeFormat,
        formatDate: formatDate,
        description: description,
        cities: cities
      });
    });
  });

});

// weather[0].icon got from using our json thing

// you can only call res.send one time in a get method!!!


// res.send("The server is up and running");
// });


let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
