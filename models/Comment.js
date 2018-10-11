var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var CommentSchema = new Schema ({
     comment: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now()
    }
})

//Create collection "articles" based on above Schema
var Comment = mongoose.model("Comment",CommentSchema)

//Export reference to articles collection
module.exports = Comment
