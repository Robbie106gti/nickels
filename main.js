//// Main js for entry-point /////
'use strict';
$.ajax({
  url: './layout/header.html',
  context: document.body,
  success: function(response) {
    $('#header').html(response);
  }
});
$.ajax({
  url: './layout/footer.html',
  context: document.body,
  success: function(response) {
    $('#footer').html(response);
  }
});

window.onload = getCatalog();

var edge = '';
var ua = window.navigator.userAgent;
var msie = ua.indexOf('Edge/');
if (msie !== -1) {
  var edge = ua.split('Edge/');
  if (edge[1] < 16) {
    edge = 'col s3';
  }
}

function getCatalog() {
  fetch('./json/catalog.json')
    .then(response => response.json())
    .then(data => {
      // console.log(data['catalog']);
      data = data['catalog'];
      const html = `${data
        .map(cat => {
          if (cat.visable === false) {
            return '';
          }
          let html = `
                <div class="card ${edge}"><a href="${cat.link}">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img class="image20 activator" src="${cat.image}">
                    </div>
                    <div class="card-content">
                        <span class="card-title activator grey-text text-darken-4">${
                          cat.title
                        }</span>
                        ${getTags(cat.tags)}
                    </div></a>
                </div>
                `;
          return html;
        })
        .join('')}`;
      $('#catalog').html(html);
    })
    .catch(err => console.log(err));
}

function getTags(tags) {
  if (!tags) return;
  const keys = `${tags.map(tag => `<div class="chip">${tag}</div>`).join('')}`;
  return keys;
}
