var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({ 
    title: {
        type: String,
        // unique: true,
        // required: true,
    },
    date: {
        type: String,
        // required: true,
    },
    img: {
        type: String, 
    },
    link: {
        type: String,
        // unique: true,
        // required: true,
    },
    keep: {
        type: Boolean,
        default: false,
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
})

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
