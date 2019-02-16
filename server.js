// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var logger = require("morgan");
var cheerio = require("cheerio");
var request = require("request");
var exphbs = require("express-handlebars");
var app = express();
var db = require("./models");
var PORT = process.env.PORT || 8000;

app.use(express.static("public"));
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/GCNArticles"
// mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI) 
  // useNewUrlParser: true 



app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
            "Grabbing every thread name and link\n" +
            "from Global Cycling Network's webdev board:" +
            "\n***********************************\n");

app.get("/", function(req, res) {
  console.log("hit / index");
  db.Article.find({}, null, { sort: { created: 1 }}, function(err, data) {
    res.render("index", { articles: data });
  })
});

// scrape route
app.get("/scrape", function(req, res) {
  console.log("hit /scrape");    

  axios.get("https://www.globalcyclingnetwork.com/")
  .then(function(response) {
    var $ = cheerio.load(response.data);
    var result = {};

    $("div.video-item-container").each(function(i, element) { 

      result.title = $(element).find("h4.video-item__title").text();
      result.date =$(element).find("h6.video-item__date").text();  
      result.img = $(element).find("img.video-item__thumbnail").attr("src");
      result.link = "https://www.globalcyclingnetwork.com" + $(element).find("a.video-item").attr("href"); 
      // console.log(result, "result server.js 60");

    db.Article.create(result, function(err, dbArticle) {
      if (err) {
        // throw err;
        console.log("err and result: ");
      } 
      console.log(dbArticle);
    })

    });
    res.redirect("/");
  });
});

// Find all articles from database show json array
app.get("/articles", function(req, res) {
  console.log("hit /articles");
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//get saved articles
app.get("/saved", function(req, res) {
  db.Article.find({"keep": true})
  .populate("note")
  .then(function(data) {
      var savedArticles = {
          articles: data
      }
      console.log("saved data: ", data);
      res.render("saved", {articles: data});
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Route for saving a specific Article by id
app.post("/articles/save/:id", function(req, res) {
  console.log("in post save articles");
  db.Article.findOneAndUpdate({ _id: req.params.id }, {$set: { "keep": true }})
    .then(function(err, data) {
      if (err) {
        console.log(err);
      } else {
        res.send(data);
      }
    })
    .catch(function(err) {
      res.json(err);
    });
});

//Remove an article from saved
app.post("/articles/remove/:id", function(req, res) {
  console.log("in the findOneAndUpdate to remove");
  console.log("id params:", req.params.id);
    db.Article.findOneAndUpdate({ _id: req.params.id }, {$set: { keep: false }}, { new: true }, function(err, doc) {
      console.log("err: ", err);
      console.log("doc: ", doc);
      if (err) {
        console.log(err);
      } else {
        res.json(doc);
      }
    })
});

//Get an article by ID, populate with note
app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Save note 
app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

/* -/-/-/-/-/-/-/-/-/-/-/-/- */

app.listen(PORT, function() {
  console.log("App running on port 8000!");
});