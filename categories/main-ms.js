//// Main js for catagories /////
'use strict';



if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
  window.onload = getSubs();
  document.getElementById("catalog").classList.remove('grid');
}

function getSubs() {

  $.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
      return null;
    } else {
      return decodeURI(results[1]) || 0;
    }
  };
  // console.log(decodeURIComponent($.urlParam('cat')));
  // output: General Information
  var cat = $.urlParam('cat');
  setGI(cat);
  switch (cat) {
    case 'General Information':
      fetchGI(cat);
      break;
    default:
      fetchCabinets(cat);
  }
}

function fetchCabinets(cat) {
  var catagory = cat.toLowerCase();
  // console.log(catagory);
  fetch('../json/' + catagory + '.json').then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log(data['catalog']);
    data = data[cat];
    var html = '' + data.map(function (cat) {
      return '<div class="card col s3 m3">\n                    <div class="card-image hiie waves-effect waves-block waves-light">\n                        <img class="image20 activator" src="' + cat.image + '">\n                    </div>\n                    <div class="card-content hie">\n                        <span class="card-title activator grey-text text-darken-4">' + cat.title + '<i class="material-icons right">more_vert</i></span>\n                        ' + getTags(cat.tags) + '\n                    </div>\n                    <div class="card-reveal">\n                        <span class="card-title grey-text text-darken-4">' + cat.title + '<i class="material-icons right">close</i></span>\n                        ' + getLinks(cat) + ' \n                    </div>\n                </div>\n                ';
    }).join('');
    $('#catalog').html(html);
  }).catch(function (err) {
    return console.log(err);
  });
}

function fetchGI(cat) {
  var catagory = cat.toLowerCase();
  // console.log(catagory);
  fetch('../json/' + catagory + '.json').then(function (response) {
    return response.json();
  }).then(function (data) {
    // console.log(data['catalog']);
    data = data[cat];
    var html = '' + data.map(function (cat) {
      return switchCard(cat);
    }).join('');
    $('#catalog').html(html);
  }).catch(function (err) {
    return console.log(err);
  });
}

function switchCard(cat) {
  var cardcontent = '';
  if (cat.attached.length === 1) {
    cardcontent = cardWithout(cat);
  } else {
    cardcontent = cardWith(cat);
  }
  return cardcontent;
}

function cardWith(cat) {
  var card = '<div class="card col s3 m3">\n            <div class="card-image hiie waves-effect waves-block waves-light">\n                <img class="image20 activator" src="' + cat.image + '">\n            </div>\n            <div class="card-content">\n                <span class="card-title activator grey-text text-darken-4">' + cat.title + '<i class="material-icons right">more_vert</i></span>\n                ' + getTags(cat.tags) + '\n            </div>\n            <div class="card-reveal">\n                <span class="card-title grey-text text-darken-4">' + cat.title + '<i class="material-icons right">close</i></span>\n                ' + getLinks(cat) + ' \n            </div>\n        </div>';
  return card;
}

function cardWithout(cat) {
  var card = void 0;
  if (cat.attached[0].sub === "") {
    card = '<div class="card col s3 m3">\n                <a href="' + cat.attached[0].link + '.html">\n                  <div class="card-image hiie waves-effect waves-block waves-light">\n                      <img class="image20 activator" src="' + cat.image + '">\n                  </div>\n                  <div class="card-content">\n                      <span class="card-title activator grey-text text-darken-4">' + cat.title + '<i class="material-icons right">more_vert</i></span>\n                      ' + getTags(cat.tags) + '\n                  </div>\n                </a>\n              </div>';
  } else {
    card = '<div class="card col s3 m3">\n                <a href="./item/' + cat.attached[0].link + '.html?code=' + cat.code + cat.attached[0].sub + '">\n                  <div class="card-image hiie waves-effect waves-block waves-light">\n                      <img class="image20 activator" src="' + cat.image + '">\n                  </div>\n                  <div class="card-content">\n                      <span class="card-title activator grey-text text-darken-4">' + cat.title + '<i class="material-icons right">more_vert</i></span>\n                      ' + getTags(cat.tags) + '\n                  </div>\n                </a>\n              </div>';
  }
  return card;
}

function setGI(title) {
  var cat = '<h1 id="topic">' + title + '</h1>';
  $("#topic").html(cat);
}

function getLinks(cat) {
  if (!cat.attached) return;
  var keys = '' + cat.attached.map(function (a) {
    return formatLink(cat, a);
  }).join('');
  return keys;
}

function formatLink(cat, a) {
  var link = '';
  if (a.sub) {
    link = '<a href="./item/' + a.link + '.html?code=' + cat.code + a.sub + '">' + a.title + '</a><br>';
  } else {
    link = '<a href="./item/' + a.link + '.html?code=' + cat.code + a.height + '">' + a.height + ' Inch high</a><br>';
  }
  return link;
}

function getTags(tags) {
  if (!tags) return;
  var keys = '' + tags.map(function (tag) {
    return '<div class="chip">' + tag + '</div>';
  }).join('');
  return keys;
}
