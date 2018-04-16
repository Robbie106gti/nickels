//// Main js for catagories /////
$.ajax({
  url: "../../../layout/header.html",
  context: document.body,
  success: function (response) {
    $("#header").html(response);
  }
});
$.ajax({
  url: "../../../layout/footer.html",
  context: document.body,
  success: function (response) {
    $("#footer").html(response);
  }
});

window.onload = getPage();
var edge = "";
var ua = window.navigator.userAgent;
var msie = ua.indexOf("Edge/");
if (msie !== -1) {
  var edge = ua.split("Edge/");
  if (edge[1] < 16) {
    edge = "col s3";
  } 
}

function getPage() {
  $.urlParam = function (name) {
    var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
      window.location.href
    );
    if (results == null) {
      return null;
    } else {
      let url = decodeURI(results[1]) || 0;
      url = url.toLowerCase();
      return url;
    }
  };
  const code = $.urlParam("code");
  const page = $.urlParam("page");
  const id = $.urlParam("id");
  fetch(`./mc.json`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (!code && !page) {
        const d = document.getElementById("catalog");
        d.className += " grid";
        const html = `${data.items.map(cat => cardWith(cat)).join("")}`;
        $("#catalog").html(html);
        setGI(data.information);
      }
    })
    .catch(err => console.log(err));
}

function setGI(information) {
  const cat = `<h1 id="topic">${information.title}</h1><h5>${information.subTitle}</h5><div id="actions"></div>`;
  $("#topic").html(cat);
  const des = `${information.description}`;
  $("#des").html(des);
}

function titleCase(str) {
  if (str == null) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      if (!word) return;
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(" ");
}

function setSpecs(specs) {
  const spec = `
    <div class="card-panel grey lighten-3 bullet">
      <span class="card-title">
        <h4>Specifications</h4>
      </span>
      <div class="divider"></div>
      <ul class="flow-text">
        ${li(specs)}
      </ul>
    </div>
    <div id="notes"></div>
    `;
  $("#spec").html(spec);
}

function cardWith(cat) {
  const card = `<div class="card ${edge}">
                  <div class="card-image waves-effect waves-block waves-light">
                    <img class="responsive-img" src="${cat.image}">
                  </div>
                  <div class="card-content">
                    <span class="card-title grey-text text-darken-4">${
                      titleCase(cat.title)
                    }</span>
                    ${getTags(cat.tags)}
                  </div>
                </div>`;
  return card;
}

// This is the left click function 2018 
function addCodenow(wcode) {
  wcode = `<span>${wcode}</span>`;
  if (confirm("Do you want to add this item to your order?")) {
    parent.addtocart(wcode);
  }
}

function unique(array) {
  var seen = new Set();
  return array.filter(function (item) {
    if (!seen.has(item)) {
      seen.add(item);
      return true;
    }
  });
}

function getTags(tags) {
  if (!tags) return;
  const keys = `${tags.map(tag => `<div class="chip">${tag}</div>`).join("")}`;
  return keys;
}
