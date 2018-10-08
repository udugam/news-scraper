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
        var scrapedArticles = $(".secondary-story, .lead-story-container")
    
        scrapedArticles.each(function(index, element) {
            var article = {}

            //edit content for each article and store in article object to prepare for database storage
            article.headline = $(this).find(".article-title").text()
            article.summary = $(this).hasClass("secondary-story") ? $(this).find(".article-content").text() : $(this).find(".article-title").siblings().text()
            article.link = $(this).hasClass("secondary-story") ? urlToScrape + $(this).find(".article-title").children("a").attr("href") : urlToScrape + $(this).find(".lead-photo").find("a").attr("href")
            article.thumbnail = $(this).hasClass("secondary-story") ? urlToScrape + $(this).find(".article-image").attr("style").match(/'(.*?)'/)[1] : urlToScrape + $(this).find(".lead-photo").find("img").attr("src")
            article.created = Date.now() 
        
            //Store article in database
            db.Article.findOneAndUpdate({link:article.link}, article, {upsert:true})
            // db.Article.create(article)
            .then(function(dbArticle) {
                //Determine when the last response comes in before fetching all articles and rendering them to the home page
                if(index==(scrapedArticles.length-1)) {
                    db.Article.find().sort({created:-1}).then(function(dbArticlesArray) {
                        res.render('home', {dbArticlesArray})
                    })
                }
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
        })

        

    })
})


//Start App
app.listen(PORT, function() {
    console.log(`App listening on ${PORT}`)
})
