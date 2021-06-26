const express = require("express");
const bodyParser = require("body-parser"); // looks through the body and retrieve data based on name
const https = require("https"); // no need to install because it is a native node module
const app = express(); // initialze a new express app

app.use(bodyParser.urlencoded({
  extended: true
}));

// request(req)
// response(res)
app.get("/", function(req, res) { // route file/ original homepage
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  // cityName is declared in the input html element
  const city = req.body.cityName; // no need to parse because it is in string
  console.log(city);
  //openweather map endpoint + path + parameter
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" +city+ "&units=imperial&appid=0f4b2ca3317b3d1692a30fb9abf05ec1";
  // the response is the data sent back from the openweathermap
  https.get(url, function(response) { // refer to external server
    console.log(response.statusCode); // find the status code
    // this correseponds to the a bunch of message(backend) the openweathermap sent
    // below

    //the actual data we care about
    response.on("data", function(data) {
      // console.log(data); this is going to be in hex code

      // change the hex code to a java object
      const weatherData = JSON.parse(data);
      console.log(weatherData);

      // JSON.stringify(object) this will turn an JS object into a flat string
      // that will take up the minimum amount of space

      const imgURL = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png"

      const temp = weatherData.main.temp;
      console.log(temp);
      const descript = weatherData.weather[0].description; // array with only one item
      console.log(descript);

      res.write("<h1>The temperature in "+city+" is " + temp + "</h1>");
      res.write("<p>with " + descript + "</p>");
      res.write("<img src =" + imgURL + ">")
      res.send();
    });
  });

});


// you can only call res.send one time in a get method!!!


// res.send("The server is up and running");
// });


app.listen(3000, function() {
  console.log("server is live #3000");
});
