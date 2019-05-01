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

var edge = '';
var ua = window.navigator.userAgent;
var msie = ua.indexOf('Edge/');
if (msie !== -1) {
  var edge = ua.split('Edge/');
  if (edge[1] < 16) {
    edge = 'col s3';
  }
}

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
  const code = $.urlParam('code');
  fetch(`../../json/general information.json`)
    .then(response => response.json())
    .then(data => {
      let codes = data[`items`];
      let page = codes.filter(function(el) {
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
    .catch(err => console.log(err));
}

function makeMedia() {
  let main = `<div id="videos" class="col s12 m12 grid2"></div>`;
  $('#catalog').html(main);
}

function makeStructure() {
  let main = `<div class="col s12 m12 card">
            <div id="des" class="col s6 offset-s3 m6 offset-m3"></div>
            <div id="para" class="flow-text col s6 offset-s3 m6 offset-m3"></div>
            <div class="col s12 m12"><h3 class="center-align">Contact us</h3></div>
            <div id="address" class="col s6 m4 "></div>
            <div id="hours" class="col s6 m4"></div>
            <div id="social" class="col s6 m4"></div>
        </div>
        <div id="images" class="col s12 m12 grid2">
        </div>`;
  $('#catalog').html(main);
}

function videos(page) {
  let videos = page.videos.map(video => cardWithout(video)).join('');
  $('#videos').html(videos);
}

function cardWithout(video) {
  let card = `<div class="card ${edge}">
                        <div class="video-container">
                            <iframe src="https://player.vimeo.com/video/${
                              video.video
                            }" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
                        </div>
                        <div class="card-content">
                            <span class="card-title grey-text text-darken-4">${
                              video.title
                            }</span>
                            ${getTags(video.tags)}
                        </div>
                    </div>`;
  return card;
}

function cardDropbox(image) {
  let card = `<div class="card ${edge}">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img class="responsive-img materialboxed" src="/catalog/build/assets${
                              image.path_lower
                            }">
                        </div>
                        <div class="card-content">
                            <a href="/catalog/build/assets${
                              image.path_lower
                            }" download>
                                <span class="card-title grey-text text-darken-4">${
                                  image.name
                                }</span>
                            </a>
                        </div>
                    </div>`;
  return card;
}

function getTags(tags) {
  if (!tags) return;
  const keys = `${tags.map(tag => `<div class="chip">${tag}</div>`).join('')}`;
  return keys;
}

function setGI(page) {
  let topic = `
        <a href="../index.html?cat=${page.cat}" class="right">
            <i class="small material-icons">arrow_back</i> <span class="lift">Back</span>
        </a>
        <div id="actions"></div>
        <div>
            <h3 class="center-align">${page.title}</h3>
            <h6 class="center-align">${page.description}</h6>
        </div>
        `;
  $('#topic').html(topic);
}

function setImages(page) {
  var dbx = new Dropbox({
    accessToken:
      'KK55he_frfAAAAAAAAABbWEaOtBGTzkI7Hs4lMqJ1TG0TxDHpPMuOVoce72CitZm'
  });
  dbx
    .filesListFolder({ path: '/nickels kitchens' })
    .then(response => {
      console.log(response);
      let images = response.entries.map(image => cardDropbox(image)).join('');
      $('#videos').html(images);
      $(document).ready(function() {
        $('.materialboxed').materialbox();
      });
    })
    .catch(function(error) {
      console.log(error);
    });
}
