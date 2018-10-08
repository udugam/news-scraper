var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//Define Article Schema with relation to comment model
var ArticleSchema = new Schema({
    headline: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: false
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    created: {
        type: Date,
        required: true
    }
})

//Create collection "articles" based on above Schema
var Article = mongoose.model("Article",ArticleSchema)

//Export reference to articles collection
module.exports = Article
