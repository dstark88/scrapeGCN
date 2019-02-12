var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({ 
    title: {
        type: String,
        // required: true,
    },
    date: {
        
        // required: true,
    },
    img: {
        type: String, 
    },
    link: {
        type: String,
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
