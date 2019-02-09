// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var request = require("request");
var exphbs = require("express-handlebars");
var app = express();
var db = require("./models");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/GCNArticles"

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true 
});

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
            "Grabbing every thread name and link\n" +
            "from Global Cycling Network's webdev board:" +
            "\n***********************************\n");

app.get("/", function(req, res) {
  console.log("hit / index");
  db.Article.find({}, null, { sort: { created: -1 }}, function(err, data) {
    res.render("index", { articles: data });
  })
});

app.get("/all/save", function(req, res) {
  console.log("hit /all/save ");
  db.Article.find({ "keep": true }, null, { sort: { created: -1 }}, function(err, data) {
    res.render("saved");
  })
})

// Find all articles
app.get("/all", function(req, res) {
  console.log("hit /all");
  db.Article.find({}, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  })
})

// Route 2
app.get("/scrape", function(req, res) {
  console.log("hit /scrape");

  axios.get("https://www.globalcyclingnetwork.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    var result = {};

    $("div.video-item-container").each(function(i, element) { 
     
      result.title = $(element).find("h4.video-item__title").text();
      result.date =$(element).find("h6.video-item__date").text();  
      result.img = $(element).find("img.video-item__thumbnail").attr("src");
      result.link = "https://www.globalcyclingnetwork.com" + $(element).find("a.video-item").attr("href"); 
      // console.log(result, "result server.js 60");
    db.Article.create(result)
    .then(function(dbArticle) {
        // console.log(dbArticle, "dbArticle server.js 69");
      })
      .catch(function(err) {
        console.log(err);
      });
    });
    res.send(result);
  });
});

// app.get("/saved", function(req, res) {
//   console.log("hit /saved");
//   db.Article.find({ saved: true }, function(err, data) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.json(data);
//     }
//     window.location.replace("/saved");
//   })
// })

// Save an article by the id
app.post("/all/save/:id", function(req, res) {
  console.log("posting to /all/save/:id");
  db.Article.findOneAndUpdate({ "_id": req.params.id}, { "keep": true}, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  })
})

//Unsave an article from saved
// app.post("/unsave/:id", function(req, res) {
//   console.log("unsave and id from unsave/:id");
//   db.Article.update({ "_id": req.params.id }, {$set:{"save": false}}, function(err, data) {
//     if (err) {
//       console.log(err);
//   }
//   else {
//       res.json(data);
//   }
//   });
// });


/* -/-/-/-/-/-/-/-/-/-/-/-/- */
// mongoose.connect(MONGODB_URI);
// Listen on port 8000
app.listen(8000, function() {
  console.log("App running on port 8000!");
});