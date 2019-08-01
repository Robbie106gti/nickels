//// Main js for catagories /////
'use strict';
$.ajax({
  url: '../../layout/header.html',
  context: document.body,
  success: function(response) {
    $('#header').html(response);
  }
});
$.ajax({
  url: '../../layout/footer.html',
  context: document.body,
  success: function(response) {
    $('#footer').html(response);
  }
});

window.onload = getPage();
var edge = 'col s3';

function getPage() {
  $.urlParam = function(name) {
    var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(
      window.location.href
    );
    if (results == null) {
      return null;
    } else {
      return decodeURI(results[1]) || 0;
    }
  };
  var code = $.urlParam('code');
  fetch('../../json/general information.json', { cache: "reload" })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var codes = data['items'];
      var page = codes.filter(function(el) {
        return el.code === code;
      });
      page = page[0];
      console.log(page);
      switch (page.template) {
        case 'media':
          makeMedia();
          setGI(page);
          videos(page);
          break;
        default:
          makeMedia();
          setGI(page);
          setImages(page);
      }
    })
    .catch(function(err) {
      return console.log(err);
    });
}

function makeMedia() {
  var main = '<div id="videos" class="col s12 m12 grid2"></div>';
  $('#catalog').html(main);
}

function makeStructure() {
  var main =
    '<div class="col s12 m12 card">\n            <div id="des" class="col s6 offset-s3 m6 offset-m3"></div>\n            <div id="para" class="flow-text col s6 offset-s3 m6 offset-m3"></div>\n            <div class="col s12 m12"><h3 class="center-align">Contact us</h3></div>\n            <div id="address" class="col s6 m4 "></div>\n            <div id="hours" class="col s6 m4"></div>\n            <div id="social" class="col s6 m4"></div>\n        </div>\n        <div id="images" class="col s12 m12 grid2">\n        </div>';
  $('#catalog').html(main);
}

function videos(page) {
  var videos = page.videos
    .map(function(video) {
      return cardWithout(video);
    })
    .join('');
  $('#videos').html(videos);
}

function cardWithout(video) {
  var card =
    '<div class="card ' +
    edge +
    '">\n                        <div class="video-container">\n                            <iframe src="https://player.vimeo.com/video/' +
    video.video +
    '" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n                        </div>\n                        <div class="card-content">\n                            <span class="card-title grey-text text-darken-4">' +
    video.title +
    '</span>\n                            ' +
    getTags(video.tags) +
    '\n                        </div>\n                    </div>';
  return card;
}

function cardDropbox(image) {
  var card =
    '<div class="card ' +
    edge +
    '">\n                        <div class="card-image waves-effect waves-block waves-light">\n                            <img class="responsive-img materialboxed" src="/catalog/build/assets' +
    image.path_lower +
    '">\n                        </div>\n                        <div class="card-content">\n                            <a href="/catalog/build/assets' +
    image.path_lower +
    '" download>\n                                <span class="card-title grey-text text-darken-4">' +
    image.name +
    '</span>\n                            </a>\n                        </div>\n                    </div>';
  return card;
}

function getTags(tags) {
  if (!tags) return;
  var keys =
    '' +
    tags
      .map(function(tag) {
        return '<div class="chip">' + tag + '</div>';
      })
      .join('');
  return keys;
}

function setGI(page) {
  var topic =
    '\n        <a href="../index.html?cat=' +
    page.cat +
    '" class="right">\n            <i class="small material-icons">arrow_back</i> <span class="lift">Back</span>\n        </a>\n        <div id="actions"></div>\n        <div>\n            <h3 class="center-align">' +
    page.title +
    '</h3>\n            <h6 class="center-align">' +
    page.description +
    '</h6>\n        </div>        \n        ';
  $('#topic').html(topic);
}

function setImages(page) {
  var dbx = new Dropbox({
    accessToken:
      'KK55he_frfAAAAAAAAABbWEaOtBGTzkI7Hs4lMqJ1TG0TxDHpPMuOVoce72CitZm'
  });
  dbx
    .filesListFolder({ path: '/nickels kitchens' })
    .then(function(response) {
      console.log(response);
      var images = response.entries
        .map(function(image) {
          return cardDropbox(image);
        })
        .join('');
      $('#videos').html(images);
      $(document).ready(function() {
        $('.materialboxed').materialbox();
      });
    })
    .catch(function(error) {
      console.log(error);
    });
}
