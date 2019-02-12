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

$(".save").on("click", function () {
    var thisId = $(this).attr("data-id");
    console.log(thisId);
    $.ajax({
        method: "POST",
        url: "/articles/save/" + thisId
    }).then(function(data) {
        window.location = "/"
    });
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
