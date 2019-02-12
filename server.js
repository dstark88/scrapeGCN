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

app.use(express.static("public"));
app.use(logger("dev"));
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

// scrape route
app.get("/scrape", function(req, res) {
  console.log("hit /scrape");

  axios.get("https://www.globalcyclingnetwork.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    var result = {};

    $("div.video-item-container").each(function(i, element) { 
     
      result.title = $(element).find("h4.video-item__title").text();
      result.date =$(element).find("h6.video-item__date").text();  
      result.img = $(element).find("img.video-item__thumbnail").attr("src");
      console.log("image: ", result.img, " : server.js 72");
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
    res.send("Scrape Complete");
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
app.get("/saved", (req, res) => {
  db.Article.find({"keep": true})
  .populate("note")
  .then(function(data) {
      var hbsObject = {
          articles: data
      }
      console.log("saved data: ", data);
      res.render("saved", {articles: data});
  });
});

// Route for saving a specific Article by id
app.post("/articles/save/:id", function(req, res) {
  console.log("in post save articles");
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOneAndUpdate({ _id: req.params.id }, { "keep": true })
  
    .then(function(err, doc) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      if (err) {
        console.log(err);
      } else {
        res.send(doc);
      }
    });
});

// Route for saving/updating an Article's associated Note
// app.post("/articles/:id", function(req, res) {
//   // Create a new note and pass the req.body to the entry
//   db.Note.create(req.body)
//     .then(function(dbNote) {
//       // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//       // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//       return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//     })
//     .then(function(dbArticle) {
//       // If we were able to successfully update an Article, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });



// Save an article by the id
// app.post("/all/save/:id", function(req, res) {
//   console.log("posting to /all/save/:id");
//   db.Article.findOneAndUpdate({ "_id": req.params.id}, { "keep": true}, function(err, data) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(data);
//     }
//   })
// })

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