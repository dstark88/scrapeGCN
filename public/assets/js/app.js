// function displayResults(data) {
//   $("tbody").html("");

//   data.forEach(function(this) {
//     var tr = $("<tr>").addClass("collection-item").append(
//       $("<td>").text(this.title),
//       $("<td>").text(this.date),
//       $("<td>").text(this.link),
//       // $("<button>").addClass("waves-effect waves-light btn")
//       // .addElementById("saved-GCN")
//       // .append("Save Article"),
//     );

//     $("tbody").append(tr);
//   });
// }

// can't seem to get to work
// function setActive(selector) {
//   $("th").removeClass("active");
//   $(selector).addClass("active");
// }

// $.getJSON("/all", function(data) {
//   // Call our function to generate a table body

//   displayResults(data);
//   console.log(data);
// });

$("#scrapeBtn").on("click", function(dbArticle) {
  console.log("clicked the scrape btn");
  $.ajax({
      method: "GET",
      url: "/scrape",
  }).then(function(dbArticle) {
      console.log(dbArticle);
      // displayResults(data);
      window.location = "/"
  })
});

// $("#saved-GCN").on("click", function() {
//   setActive("#saved-GCN");
//   $.getJSON("/saved", function(data) {
//     // Call our function to generate a table body
//     displayResults(data);
//     console.log(data);
//   });
// })
// $("#saved-GCN").on("click", function () {
//   var thisId = $(this).attr("data-id");
//   console.log(thisId, "save id");
//   $.ajax({
//       method: "POST",
//       url: "/save/:id" + thisId
//   }).then(function(data) {
//       location = location; 
//   });
// });

// $(".unsave").on("click", function () {
//   var thisId = $(this).attr("data-id");
//   console.log(thisId, "unsave id");
//   $.ajax({
//       method: "POST",
//       url: "/unsave/:id" + thisId
//   }).then(function (data) {
//       window.location = "/saved"
//   });
// });

// function savedResults(data) {
//   $("tbody").empty();

//   data.forEach(function(Articledb) {
//     var tr = $("<tr>").addClass("collection-item").append(
//       $("<td>").text(Articledb.title),
//       $("<td>").text(Articledb.date),
//       $("<td>").text(Articledb.link),
//       $("<button>").addClass("waves-effect waves-light btn notes").append("Article Notes"),
//       $("<button>").addClass("waves-effect waves-light btn unsave").append("Unsave"),
//     );

//     $("tbody").append(tr);
//   });
// }


