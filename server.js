//Import dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var request = require('request');
var cheerio = require('cheerio');
var exphbs = require('express-handlebars');

//Import db Schemas
var db = require('./models')

//Connect to Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoBasketballArticles"
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI)

//Setup express app
var app = express();
var PORT = process.env.PORT || 3000

//Setup Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    request("https://basketball.realgm.com/", function(error, response, html) {
        var $ = cheerio.load(html)

        //
        $(".secondary-story").each(function(element) {
            var article = {}

            article.headline = $(this).find(".article-title").text()
            article.summary = $(this).find(".article-content").text()
            article.link = $(this).find(".article-title").children("a").attr("href")
            article.thumbnail = $(this).find(".article-image").attr("style")
            console.log(article)
        })


        res.json(true)
    })
})


//Start App
app.listen(PORT, function() {
    console.log(`App listening on ${PORT}`)
})
