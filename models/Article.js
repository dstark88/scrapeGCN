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
    img: {
        data: Buffer, 
        contentType: String, 
    },
    link: {
        type: String,
        // required: true,
    },
    keep: {
        type: Boolean,
        default: false,
    }
})

var Article = mongoose.model("Article", articleSchema);

module.exports = Article;
