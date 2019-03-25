//// Main js for catagories /////
'use strict';
$.ajax({
    url: "../../../layout/header.html",
    context: document.body,
    success: function(response) {
        $("#header").html(response);
    }
});
$.ajax({
    url: "../../../layout/footer.html",
    context: document.body,
    success: function(response) {
        $("#footer").html(response);
    }
});

window.onload = getPage();
var ua = window.navigator;
console.log(ua);
var edge = "col s3";

function getPage() {
  $.urlParam = function (name) {
    var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(window.location.href);
    if (results == null) {
      return null;
    } else {
      var url = decodeURI(results[1]) || 0;
      url = url.toLowerCase();
      return url;
    }
  };
  var code = $.urlParam("code");
  var page = $.urlParam("page");
  fetch("./loox.json").then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log(data);
    if (!code && !page) {
      var d = document.getElementById("catalog");
      d.className += " grid";
      var html = "" + data.information.map(function (cat) {
        return cardWith(cat);
      }).join("");
      $("#catalog").html(html);
      var _info = {
        cat: "Loox",
        root: page,
        height: code,
        title: "LED lighting",
        item: {
          pre: false
        }
      };
      setGI(_info);
      makeHelper();
      return;
    }
    var info = data.information.filter(function (i) {
      return i.id == page;
    })[0];
    info["page"] = page;
    info["code"] = code;
    var item = info.attached.filter(function (i) {
      return i.item == code;
    })[0];
    var includes = item.includes.map(function (item) {
      return data.items.filter(function (i) {
        return i.code === item;
      })[0];
    });
    if (includes.length >= 0) {
      var spec = [];
      includes.map(function (item) {
        return spec = spec.concat(item.specifications);
      });
      spec.sort(function (a, b) {
        return a - b;
      });
      item["specifications"] = unique(spec);
      info["item"] = item;
    }
    info["includes"] = includes;
    makeStructure(info);
  }).catch(function (err) {
    return console.log(err);
  });
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

function makeStructure(info) {
  var index = "\n        <div class=\"col s12 m6\">\n            <p>Page not Found.</p>\n        </div>";
  setGI(info);
  makeDDWN(info.attached);
  makeHelper();
  var card;
  switch (info.page) {
    case "spots":
      card = cardWithAction(info);
      $("#catalog").html(card);
      includesCard(info);
      setSpecs(info.item);
      callButton();
      break;
    case "strips":
      card = cardWithAction(info);
      $("#catalog").html(card);
      includesCard(info);
      setSpecs(info.item);
      callButton();
      break;
    case "parts":
      partsChose(info);
      break;
    default:
      $("#catalog").html(index);
      callButton();
  }
}

function partsChose(info) {
    var card;
  switch (info.code) {
    case "power supplies":
      card = info.includes.map(function (card) {
        return "<div class=\"col s12 m6\">" + partHcard(card) + "</div>";
      });
      $("#catalog").html(card);
      $(document).ready(function () {
        $(".slider").slider();
      });
      callButton();
      break;
    case "lights":
      card = info.includes.map(function (item) {
        return cardWithActionLight(item);
        callButton();
      });
      $("#catalog").html(card);
      setSpecs(info.item);
      callButton();
      break;
    default:
      makeTabs(info);
      callButton();
  }
}

function callButton() {
    $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrainWidth: true, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: true, // Displays dropdown below the button
        alignment: 'left', // Displays dropdown with edge aligned to the left of button
        stopPropagation: false // Stops event propagation
      }
    );
}

function setGI(info) {
  console.log(info);
  var topic = "\n        <a href=\"" + (info.page ? './index.html' : '../../index.html?cat=Accessories') + "\" class=\"right\">\n          <i class=\"small material-icons\">arrow_back</i>\n        </a>\n        <div id=\"actions\"></div>\n        <div>\n            <h1 id=\"titleHeader\">" + titleCase(info.title) + "</h1>\n            " + (info.item.pre ? '<h5 id="subHeader">Option: ' + titleCase(info.item.pre) + " " + titleCase(info.item.item) + "</h5>" : "") + "\n        </div>\n        <div class=\"fixed-action-btn\" style=\"top: 85px; right: 24px;\">\n        <a class=\"waves-effect waves-light btn btn-floating cyan\" onclick=\"$('.tap-target').tapTarget('open')\">?</a>\n        </div>\n        <div id=\"ddwn\"></div>\n        <div id=\"helper\"></div>    \n        ";
  $("#topic").html(topic);
}

function makeDDWN(ddwn) {
  ddwn = "<!-- Dropdown Trigger -->\n        <a class='dropdown-button btn bot red' data-activates='dropdown1'>Related items</a>\n      \n        <!-- Dropdown Structure -->\n        <ul id='dropdown1' class='dropdown-content red'>\n            " + makeActions(ddwn) + "\n        </ul>";
  $("#ddwn").html(ddwn);
}

function makeActions(card) {
  var action = "" + card.map(function (a) {
    return "<li class=\"waves-effect waves-light\"><a class=\"white-text\" href=\"./index.html?page=" + a.page + "&code=" + a.item + "\"><i class=\"material-icons\">art_track</i>" + titleCase(a.item) + "</a></li>";
  }).join("");
  return action;
}

function makeTabs(info) {
  var tabs = "<div><ul id=\"tabs-swipe-demo\" class=\"tabs\">\n" + info.item.tabs.map(function (tab) {
    return "<li class=\"tab col s3\"><a href=\"#" + tab + "\">" + tab + "</a></li>";
  }).join("") + "</ul>\n                    " + info.item.tabs.map(function (tab) {
    return "<div id=\"" + tab + "\" class=\"grid\">" + composeTab(tab, info) + "</div>";
  }).join("") + "</div>";
  $("#catalog").html(tabs);
  $(document).ready(function(){
    $('ul.tabs').tabs();
  });
}

function composeTab(tab, info) {
  var cards = info.includes.filter(function (i) {
    return i.tab == tab;
  });
  return cards.map(function (card) {
    return cardWithActioMSC(card);
  }).join('');
}

function titleCase(str) {
  if (str == null) return "";
  return str.toLowerCase().split(" ").map(function (word) {
    if (!word) return;
    return word.replace(word[0], word[0].toUpperCase());
  }).join(" ");
}

function cardWith(cat) {
  var card = "<div class=\"card " + edge + "\">\n                  <div class=\"card-image waves-effect waves-block waves-light\">\n                      <img class=\"activator\" src=\"" + cat.image + "\">\n                  </div>\n                  <div class=\"card-content\">\n                      <span class=\"card-title activator grey-text text-darken-4\">" + titleCase(cat.title) + "<i class=\"material-icons right\">more_vert</i></span>\n                      " + getTags(cat.tags) + "\n                  </div>\n                  <div class=\"card-reveal\">\n                      <span class=\"card-title grey-text text-darken-4\">" + titleCase(cat.title) + "<i class=\"material-icons right\">close</i></span>\n                      " + getLinks(cat) + " \n              </div></div>";
  return card;
}

function cardWithAction(info) {
  var card = "<div class=\"card col s12 m6\">\n                  <div class=\"card-image waves-effect waves-block waves-light\">\n                      <img class=\"activator\" src=\"" + info.item.image + "\">\n                  </div>\n                  <div class=\"card-content\">\n                      <span class=\"card-title activator grey-text text-darken-4\">" + titleCase(info.item.pre) + " " + titleCase(info.item.item) + "</span>\n                      <a class=\"btn-floating right waves-effect waves-light red\"><i class=\"material-icons\">add</i></a>\n                      <p>" + (info.item.description ? info.item.description : info.description) + ".</p>\n                  </div>\n                  <div class=\"card-panel grey lighten-3 bullet\">\n                        <span class=\"card-title\">\n                            <h4>Specifications</h4>\n                        </span>\n                        <div class=\"divider\"></div>\n                        <div id=\"specli\"></div>\n                  </div>\n              </div><div id=\"include\"></div>";
  return card;
}

function cardWithActionLight(item) {
  var card = "<div class=\"col s12 m4\">\n                  <div class=\"card\">\n                    <div class=\"card-image waves-effect waves-block waves-light\">\n                        <img class=\"activator image20\" src=\"" + item.images[0].image + "\">\n                    </div>\n                    <div class=\"card-content\">\n                        <span class=\"card-title activator grey-text text-darken-4\">" + titleCase(item.title) + "</span>\n                        <a class=\"btn-floating right waves-effect waves-light red\"><i class=\"material-icons\">add</i></a>\n                        <p>" + item.description + ".</p>\n                    </div>\n                    <div id=\"spec" + item.code + "\">" + setSpecs2(item) + "</div>\n                    <div id=\"note" + item.code + "\">" + setNotes(item) + "</div>\n                  </div></div>";
  return card;
}

function cardWithActioMSC(item) {
  var card = "<div class=\"card col s3\">\n                  <div class=\"card-image waves-effect waves-block waves-light\">\n                      <img class=\"activator image20\" src=\"" + item.images[0].image + "\">\n                  </div>\n                  <div class=\"card-content\">\n                      <span class=\"card-title activator grey-text text-darken-4\">" + titleCase(item.title) + "</span>\n                      <a class=\"btn-floating right waves-effect waves-light red\"><i class=\"material-icons\">add</i></a>\n                      <p>" + item.description + ".</p>\n                  </div>\n                  <div id=\"spec" + item.code + "\">" + setSpecs2(item) + "</div>\n                  <div id=\"note" + item.code + "\">" + setNotes(item) + "</div>\n              </div>";
  return card;
}

function includesCard(info) {
  var include = "<div class=\"col s12 m6\">\n        <div class=\"card-panel\">\n        <h2 class=\"header\">" + titleCase(info.item.pre) + " " + titleCase(info.item.item) + " includes:</h2>\n        " + info.includes.map(function (item) {
    return hcard(item);
  }).join("") + "\n        </div></div>";
  $("#include").html(include);
}

function hcard(item) {
  var hcard = "<div class=\"card horizontal\">\n        <div class=\"card-image\" style=\"overflow: hidden\">\n          <img src=\"" + item.images[0].image + "\" alt=\"" + item.images[0].title + "\">\n        </div>\n        <div class=\"card-stacked\">\n          <div class=\"card-content\">\n            <p>" + item.description + "</p>\n          </div>\n          <div class=\"card-action\">\n            <a href=\"#\">Replacement part code: " + item.code + "</a>\n          </div>\n        </div>\n      </div><div id=\"note" + item.code + "\">" + setNotes(item) + "</div>";
  return hcard;
}

function partHcard(item) {
  var hcard = "\n        <div class=\"slider\">\n            <ul class=\"slides\">\n                " + item.images.map(function (image) {
    return setSlides(image);
  }).join("") + "  \n            </ul>\n        </div>\n        <div class=\"card-panel  blue-grey darken-1 white-text\">\n            <div class=\"card-content flow-text\">\n                <span class=\"card-title\"><b>" + item.title + "</b></span>\n                <p>" + item.description + "</p>\n            </div>\n        </div>\n        <div class=\"card-panel grey lighten-3 bullet\">\n              <span class=\"card-title\">\n                  <h4>Specifications</h4>\n              </span>\n              <div class=\"divider\"></div>\n              <div id=\"spec" + item.code + "\">" + setSpecNversions(item) + "</div>\n        </div>\n        <div id=\"note" + item.code + "\">" + setNotes(item) + "</div>";
  return hcard;
}

function setImage(image) {
  return image = "<img class=\"image20\" src=\"" + image.image + "\" alt=\"" + image.title + "\">";
}

function setSlides(image) {
  return image = "\n        <li>\n            <img src=\"" + image.image + "\" alt=\"" + image.title + "\">               \n        </li>";
}

function setNotes(item) {
  fetch("./loox.json").then(function (response) {
    return response.json();
  }).then(function (data) {
    var cards = data["notes"].filter(function (el, i) {
      var t = item.notes.includes(el.id);
      var id = void 0;
      if (t === true) {
        id = el.id;
      } else {
        id = t;
      }
      return el.id === id;
    });
    var n = "" + cards.map(function (note) {
      return "<div class=\"card orange lighten-4\">\n                            <p class=\"note flow-text\">\n                                <i class=\"material-icons\">announcement</i>\n                                <b>" + note.title + "</b>" + note.content + "<a href=\"" + note.link + "\">" + note.contentLink + "<a/>" + note.ccontent + "\n                            </p>\n                        </div>";
    }).join("");
    $("#note" + item.code).html(n);
  }).catch(function (err) {
    return console.log(err);
  });
}

function setSpecs(item) {
  if (!item.specifications) {
    return "";
  }
  fetch("./loox.json").then(function (response) {
    return response.json();
  }).then(function (data) {
    var spec = data["specifications"].filter(function (el, i) {
      var t = item.specifications.includes(el.id);
      var id = void 0;
      if (t === true) {
        id = el.id;
      } else {
        id = t;
      }
      return el.id === id;
    });
    var n = "<ul class=\"flow-text\">" + spec.map(function (n) {
      return "<li><b>" + n.title + "</b>: " + n.content + "</li>";
    }).join("") + "</ul>";
    $("#specli").html(n);
  }).catch(function (err) {
    return console.log(err);
  });
}

function setSpecs2(item) {
  fetch("./loox.json").then(function (response) {
    return response.json();
  }).then(function (data) {
    var spec = data["specifications"].filter(function (el, i) {
      var t = item.specifications.includes(el.id);
      var id = void 0;
      if (t === true) {
        id = el.id;
      } else {
        id = t;
      }
      return el.id === id;
    });
    if (spec.length >= 1) {
      var n = "<div class=\"card-panel grey lighten-3 bullet\">\n              <span class=\"card-title\">\n                  <h4>Specifications</h4>\n              </span>\n              <div class=\"divider\"></div>\n            <ul class=\"flow-text\">" + spec.map(function (n) {
        return "<li><b>" + n.title + "</b>: " + n.content + "</li>";
      }).join("") + "</ul></div>";
      $("#spec" + item.code).html(n);
      return;
    }
    $("#spec" + item.code).html('');
  }).catch(function (err) {
    return console.log(err);
  });
}

function setSpecNversions(item) {
  console.log(item);
  fetch("./loox.json").then(function (response) {
    return response.json();
  }).then(function (data) {
    var spec = data["specifications"].filter(function (el, i) {
      var t = item.specifications.includes(el.id);
      var id = void 0;
      if (t === true) {
        id = el.id;
      } else {
        id = t;
      }
      return el.id === id;
    });
    var n = "<ul class=\"flow-text\">\n                " + spec.map(function (n) {
      return "<li><b>" + n.title + "</b>: " + n.content + "</li>";
    }).join("") + "\n            </ul>\n            <table class=\"striped highlight centered\">\n                <thead>\n                <tr>\n                    <th></th>\n                    " + item.versions.map(function (th) {
      return "<th>" + th.code + "</th>";
    }).join("") + "\n                </tr>\n                </thead>\n                <tbody id=\"tbody\">                \n                    " + item.vtable.map(function (tr) {
      return rowIt(tr, item);
    }).join("") + "\n                </tbody>";
    $("#spec" + item.code).html(n);
  }).catch(function (err) {
    return console.log(err);
  });
}

function rowIt(tr, item) {
  tr = "<tr><td>" + titleCase(tr) + "</td>" + item.versions.map(function (th) {
    if (tr === "download") {
      return "<td><a href=\"/catalog/build/assets/loox/" + th[tr] + "\">" + th[tr] + "</a></td>";
    }
    return "<td>" + th[tr] + "</td>";
  }).join("") + "</tr>";
  return tr;
}

function getLinks(cat) {
  if (!cat.attached) return;
  var keys = "" + cat.attached.map(function (a) {
    return formatLink(a);
  }).join("");
  return keys;
}

function formatLink(a) {
  var link = "<a href=\"./index.html?page=" + a.page + "&code=" + a.item + "\">" + titleCase(a.item) + "</a><br>";
  return link;
}

function getTags(tags) {
  if (!tags) return;
  var keys = "" + tags.map(function (tag) {
    return "<div class=\"chip\">" + tag + "</div>";
  }).join("");
  return keys;
}

function makeHelper() {
  var help = "<div class=\"fixed-action-btn\" style=\"bottom: 45px; right: 24px;\">\n          <a id=\"menu\" class=\"btn btn-floating btn-large cyan\"><i class=\"material-icons\">menu</i></a>\n        </div>\n        <!-- Tap Target Structure -->\n        <div class=\"tap-target\" data-activates=\"menu\">\n          <div class=\"tap-target-content\" style=\"text-align: right;\">\n            <h5>Steps</h5>\n            <p>\n                <b>Step 1:</b> Choose the kind of light, strip or spot.<br>\n                <b>Step 2:</b> Where do you want to apply these lights?<br>\n                <b>Step 3:</b> Choose a power supply.<br>\n                <b>Step 4:</b> Do you need a switch?<br>\n                <b>Step 5:</b> Do you need extensions?\n            </p>\n          </div>\n        </div>";
  $("#helper").html(help);
}
