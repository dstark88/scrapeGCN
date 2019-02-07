var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var articleSchema = new Schema({ 
    title: {
        type: String,
        // required: true,
    },
    date: {
        type: String,
        // required: true,
    },
    link: {
        type: String,
        // required: true,
    }
})

var Article = mongoose.model("Article", articleSchema);

module.exports = Article;
