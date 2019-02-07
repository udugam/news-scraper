# Basketball News Scraper
This application scrapes basketball articles from realgm.com and allows a user to add or remove their own comments on each article. 

# Under The Hood
Upon initial load of the homepage, the node server will scrape realgm.com for basketball related articles. The scraped articles are then compared against a database of previously scraped articles. If a scraped articles do not already exist in the database, it's saved.

- On the node server, the request and cheerio packages are used to scrape and access the html elements respectively. 
- A mongodb database is used to store every scrapped article's key information including comments that a user can make on the article.
- mongoose is used as the ODB
- express is used to create the server application
- express-handlebars is used to generate html that gets sent to the client
- boostrap is used to present the articles in a simple and organized manner
