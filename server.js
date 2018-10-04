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
    var urlToScrape = "https://basketball.realgm.com"
    request(urlToScrape, function(error, response, html) {
        var $ = cheerio.load(html)

        //
        $(".secondary-story").each(function(element) {
            var article = {}

            //edit content for each article and store in article object to prepare for database storage
            article.headline = $(this).find(".article-title").text()
            article.summary = $(this).find(".article-content").text()
            article.link = urlToScrape + $(this).find(".article-title").children("a").attr("href")
            article.thumbnail = urlToScrape + $(this).find(".article-image").attr("style").match(/'(.*?)'/)[1]
        
            //Store article in database
            db.Article.findOneAndUpdate({link:article.link}, article)
            // db.Article.create(article)
            .then(function(dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
                res.json(true)
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                return res.json(err);
            });
        })

        // Create a new Article using the `result` object built from scraping
    })
})


//Start App
app.listen(PORT, function() {
    console.log(`App listening on ${PORT}`)
})
