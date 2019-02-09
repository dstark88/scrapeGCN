$("#scrapeBtn").on("click", function(dbArticle) {
  console.log("clicked the scrape btn");
  $.ajax({
      method: "GET",
      url: "/scrape",
  }).then(function(dbArticle) {
      console.log(dbArticle);

      window.location = "/"
  })
});

$("#savedBtn").on("click", function() {
    console.log("clicked the savedBtn");
    $.ajax({
        method: "GET",
        url: "/all/save",
    }).then(function(dbArticle) {
        console.log(dbArticle);
  
        window.location = "/all/save"
    })
  });

$(".save").on("click", function() {
    console.log("clicked save btn");
    var thisId = $(this).attr("data-id");
    console.log(thisId, "save id");
    $.ajax({
        method: "POST",
        url: "/all/save" + thisId
    }).then(function(dbArticle) {
        console.log(dbArticle);
  
        window.location = "/"
    })
});

// $(".unsave").on("click", function () {
//     console.log("clicked unsave btn");
//   var thisId = $(this).attr("data-id");
//   console.log(thisId, "unsave id");
//   $.ajax({
//       method: "DESTROY",
//       url: "/unsave/:id" + thisId
//   }).then(function (data) {
//       window.location = "/saved"
//   });
// });
