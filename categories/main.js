//// Main js for catagories /////
'use strict';

var edge = '';
var ua = window.navigator.userAgent;
var msie = ua.indexOf('Edge/');
if (msie !== -1) {
  var edge = ua.split('Edge/');
  if (edge[1] < 16) {
    edge = 'col s3';
  }
}

if (!/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
  window.onload = getSubs();
}

function getSubs() {
  $.urlParam = function (name) {
    var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(
      window.location.href
    );
    if (results == null) {
      return null;
    } else {
      return decodeURI(results[1]) || 0;
    }
  };
  // console.log(decodeURIComponent($.urlParam('cat')));
  // output: General Information
  const cat = $.urlParam('cat');
  setGI(cat);
  switch (cat) {
    case 'General Information':
      fetchGI(cat);
      break;
    case 'Accessories':
      fetchGI(cat);
      break;
    default:
      fetchCabinets(cat);
  }
}

function fetchCabinets(cat) {
  let catagory = cat.toLowerCase();
  // console.log(catagory);
  fetch(`../json/${catagory}.json`)
    .then(response => response.json())
    .then(data => {
      console.log(data[cat]);
      data = data[cat];
      const html = `${data
        .map(cat => (cat.active === false ? null : cabinetCard(cat)))
        .join('')}`;
      $('#catalog').html(html);
    })
    .catch(err => console.log(err));
}

function cabinetCard(cat) {
  return `<div class="card ${edge}">
  <div class="card-image waves-effect waves-block waves-light">
      <img class="image20 activator" src="${cat.image}">
  </div>
  <div class="card-content activator">
      <span class="card-title grey-text text-darken-4">${
    cat.title
    }<i class="material-icons right">more_vert</i></span>
      ${getTags(cat.tags)}
  </div>
  <div class="card-reveal">
      <span class="card-title grey-text text-darken-4">${
    cat.title
    }<i class="material-icons right">close</i></span>
      ${getLinks(cat)}
  </div>
</div>
`;
}

function fetchGI(cat) {
  let catagory = cat.toLowerCase();
  // console.log(catagory);
  fetch(`../json/${catagory}.json`)
    .then(response => response.json())
    .then(data => {
      // console.log(data['catalog']);
      data = data[cat];
      const html = `${data.map(cat => (cat.active === false ? null : switchCard(cat))).join('')}`;
      $('#catalog').html(html);
    })
    .catch(err => console.log(err));
}

function switchCard(cat) {
  let cardcontent = ``;
  if (cat.attached.length === 1) {
    cardcontent = cardWithout(cat);
  } else {
    cardcontent = cardWith(cat);
  }
  return cardcontent;
}

function cardWith(cat) {
  const card = `<div class="card ${edge}">
            <div class="card-image waves-effect waves-block waves-light">
                <img class="image20 activator" src="${cat.image}">
            </div>
            <div class="card-content">
                <span class="card-title activator grey-text text-darken-4">${
    cat.title
    }<i class="material-icons right">more_vert</i></span>
                ${getTags(cat.tags)}
            </div>
            <div class="card-reveal">
                <span class="card-title grey-text text-darken-4">${
    cat.title
    }<i class="material-icons right">close</i></span>
                ${getLinks(cat)}
            </div>
        </div>`;
  return card;
}

function cardWithout(cat) {
  let card;
  if (cat.attached[0].sub === '') {
    card = `<div class="card ${edge}">
                <a href="${cat.attached[0].link}.html">
                  <div class="card-image waves-effect waves-block waves-light">
                      <img class="image20 " src="${cat.image}">
                  </div>
                  <div class="card-content">
                      <span class="card-title grey-text text-darken-4">${
      cat.title
      }<i class="material-icons right">more_vert</i></span>
                      ${getTags(cat.tags)}
                  </div>
                </a>
              </div>`;
  } else {
    card = `<div class="card ${edge}">
                <a href="./item/${configLink(cat)}">
                  <div class="card-image waves-effect waves-block waves-light">
                      <img class="image20" src="${cat.image}">
                  </div>
                  <div class="card-content">
                      <span class="card-title grey-text text-darken-4">${
      cat.title
      }<i class="material-icons right">more_vert</i></span>
                      ${getTags(cat.tags)}
                  </div>
                </a>
              </div>`;
  }
  return card;
}

function configLink(cat) {
  switch (cat.attached[0].code) {
    case 'NONE':
      return `${cat.attached[0].link}.html`;
      break;
    default:
      return `${cat.attached[0].link}.html?code=${cat.code}${
        cat.attached[0].sub
        }`;
  }
}

function setGI(title) {
  const cat = `<h1 id="topic">${title}</h1>`;
  $('#topic').html(cat);
}

function getLinks(cat) {
  if (!cat.attached) return;
  const keys = `${cat.attached.map(a => formatLink(cat, a)).join('')}`;
  return keys;
}

function formatLink(cat, a) {
  let link = ``;
  if (a.sub) {
    link = `<a href="./item/${a.link}.html?code=${cat.code}${a.sub}">${
      a.title
      }</a><br>`;
  } else {
    link = `<a href="./item/${a.link}.html?code=${cat.code}${a.height}">${
      a.height
      } Inch high</a><br>`;
  }
  return link;
}

function getTags(tags) {
  if (!tags) return;
  const keys = `${tags
    .map(tag => `<div class="chip activator">${tag}</div>`)
    .join('')}`;
  return keys;
}
