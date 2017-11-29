'use strict';
//// Main js for entry-point /////

$.ajax({
    url: "./layout/header.html", 
    context: document.body,
    success: function(response) {
        $("#header").html(response);
    }
});
$.ajax({
    url: "./layout/footer.html", 
    context: document.body,
    success: function(response) {
        $("#footer").html(response);
    }
});
$.ajax({
    url: "./layout/loader.html", 
    context: document.body,
    success: function(response) {
        $("#loader").html(response);
    }
});

window.onload = getCatalog();

function getCatalog() {
    fetch("./json/catalog.json")
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        // console.log(data['catalog']);
        data = data["catalog"];
        var html =
          "" +
          data
            .map(function(cat) {
              return (
                '\n                <div class="card"><a href="' +
                cat.link +
                '">\n                    <div class="card-image waves-effect waves-block waves-light">\n                        <img class="image20 activator" src="' +
                cat.image +
                '">\n                    </div>\n                    <div class="card-content">\n                        <span class="card-title activator grey-text text-darken-4">' +
                cat.title +
                "</span>\n                        " +
                getTags(cat.tags) +
                "\n                    </div></a>\n                </div>\n                "
              );
            })
            .join("");
        $("#catalog").html(html);
      })
      .catch(function(err) {
        return console.log(err);
      });
  }
  
  function getTags(tags) {
    if (!tags) return;
    var keys =
      "" +
      tags
        .map(function(tag) {
          return '<div class="chip">' + tag + "</div>";
        })
        .join("");
    return keys;
  }
  