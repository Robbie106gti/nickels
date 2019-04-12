//// Main js for catagories /////
$.ajax({
  url: '../../../layout/header.html',
  context: document.body,
  success: function(response) {
    $('#header').html(response);
  }
});
$.ajax({
  url: '../../../layout/footer.html',
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
      let url = decodeURI(results[1]) || 0;
      url = url.toLowerCase();
      return url;
    }
  };
  const code = $.urlParam('code');
  const page = $.urlParam('page');
  const id = $.urlParam('id');
  fetch(`./mc.json`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setGI(data.information, code);
      if (!code && !page) {
        const d = document.getElementById('catalog');
        d.className += ' grid';
        const html = `${data.items.map(cat => cardWith(cat)).join('')}`;
        $('#catalog').html(html);
      } else {
        makeLayout();
        let item = data.items.filter(item => item.code === code.toUpperCase());
        item = item[0];
        setDes(item);
        setSpecs(data.specifications, item);
        setNotes(data.notes, item);
        setImages(item, data.information.sides);
      }
    })
    .catch(err => console.log(err));
}

function makeLayout() {
  let html = `
  <div class="col s12 m12 l4">
    <div class="card-panel  blue-grey darken-1 white-text">
      <span class="card-title">
        <h4>Description</h4>
      </span>
      <div class="divider"></div>
      <span id="des" class="flow-text">
      </span>
    </div>
    <div id="spec"></div>
  </div>
  <div id="images"></div>`;
  $('#catalog').html(html);
}

function setImages(info, sides) {
  const images = `<div class="col s6 m6 l5">
    ${info.baskets
      .map(
        basket => `<div class="col s12 m12 l6">
      <div id="imageCard${
        basket.code
      }" class="card hoverable tooltipped" data-position="top" data-tooltip="Click to see options and codes">
        <div class="card-image waves-effect waves-block waves-light">
          <img class="responsive-img activator" src="${basket.image}">
        </div>
        <div class="card-content activator open">
          <span><i class="material-icons activator">details</i></span>
          Hardware codes with <b>${basket.title}</b> baskets
        </div>
        <div class="card-reveal">
          <span class="card-title blue-grey-text text-darken-3">Codes: <i class="material-icons right">close</i></span>
          ${getCollections(info, basket, sides)}
        </div>
      </div>
    </div>
    `
      )
      .join('')}</div><div class="col s6 m6 l3">${setMainImage(info)}</div>`;
  $('#images').html(images);
  $(document).ready(function() {
    $('.materialboxed').materialbox();
  });
  $(document).ready(function() {
    $('.tooltipped').tooltip();
  });
}

function getCollections(info, basket, sides) {
  if (!basket) return;
  const col = `
    <div class="collection">
      <h5 class="collection-item blue-grey-text text-darken-1">${
        basket.title
      } basket width options</h5>
      <ul>
      ${sides
        .map(side => {
          const wcode = `${info.code}-${side.code}-${basket.code}`;
          const li = `<li class="collection-item">
                      Code for a ${side.option} hand cabinet<br>
                      <span class="ordercode tooltipped" data-position="top" data-tooltip="add to order" onclick="addCodenow(${"'" +
                        wcode +
                        "'"})">${wcode}</span>
                    </li>`;
          return li;
        })
        .join('')}
      </ul>
    </div>`;
  return col;
}

function setGI(information, code) {
  let title = titleCase(code);
  const mc = title ? ` - ${title}` : '';
  code = !code ? '../../index.html?cat=Accessories' : './index.html';
  const cat = `<a href="${code}" class="right"><i class="small material-icons">arrow_back</i> <span class="lift">Back</span></a>
  <h1 id="topic">${information.title}${mc}</h1><h5>${
    information.subTitle
  }</h5><div id="actions"></div>`;
  $('#topic').html(cat);
}

function setDes(item) {
  $('#des').html(item.description);
}

function titleCase(str) {
  if (str == null) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(function(word) {
      if (!word) return;
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(' ');
}

function setSpecs(specs, item) {
  const newSpecs = new Array();
  specs.filter(spec =>
    item.specifications.includes(spec.id) ? newSpecs.push(spec) : ''
  );
  const spec = `
    <div class="card-panel grey lighten-3 bullet">
      <span class="card-title">
        <h4>Specifications</h4>
      </span>
      <div class="divider"></div>
      <ul class="flow-text">
        ${li(newSpecs)}
      </ul>
    </div>
    <div id="notes"></div>
    `;
  $('#spec').html(spec);
}

function li(list) {
  const lis = `${list
    .map(
      li =>
        `<li>${li.link ? '<a href="' + li.link + '">' : ''}<b>${
          li.title
        }: </b><br>${li.content}.${li.link ? '</a>' : ''}</li>`
    )
    .join('')}`;
  return lis;
}

function cardWith(cat) {
  const card = `
  <div class="card ${edge}">
    <div class="card-image waves-effect waves-block waves-light"><a href="?code=${
      cat.code
    }">
      <img class="responsive-img" src="${cat.image}">
    </a></div>
    <div class="card-content">
      <a href="?code=${cat.code}">
        <span class="card-title grey-text text-darken-4">${titleCase(
          cat.title
        )}</span>
        ${getTags(cat.tags)}
      </a>
    </div>
  </div>`;
  return card;
}

function setNotes(notes, item) {
  const newNotes = new Array();
  notes.filter(note =>
    item.notes.includes(note.id) ? newNotes.push(note) : ''
  );
  let n = `${newNotes
    .map(
      note => `
  <div class="card orange lighten-4">
      <p class="note flow-text">
          <i class="material-icons">announcement</i>
          <b>${note.title}, </b>
          ${note.content}${noteCodes(note)}
      </p>
  </div>`
    )
    .join('')}`;
  $('#notes').html(n);
}

function noteCodes(note) {
  if (!note.codes) return '';
  return `<br>
  ${note.codes
    .map(
      code =>
        `${
          code.title
        }: <span class="ordercode tooltipped" data-position="top" data-tooltip="add to order" onclick="addCodenow(${"'" +
          code.code +
          "'"})">${code.code}</span><br>`
    )
    .join('')}`;
}

function setMainImage(info) {
  const main = `<div class="card card-panel"><div class="center"><span class="card-title ">Images</span></div>
    ${exampleImages(info)}
    <img class="responsive-img materialboxed" src="${info.image}"></div>`;
  return main;
}

function exampleImages(info) {
  let icons = `${info.images
    .map(image => {
      return (im = `<div class="box-image">
                  <img src="${
                    image.image
                  }" class="materialboxed tooltipped" data-position="top" data-tooltip="click to enlarge" data-caption="${
        image.title
      }">
               </div>`);
    })
    .join('')}`;
  return icons;
}

// This is the left click function 2018
function addCodenow(wcode) {
  if (confirm(`Do you want to add ${wcode} item to your order?`)) {
    wcode = `<span>${wcode}</span>`;
    parent.addtocart(wcode);
  }
}

function unique(array) {
  var seen = new Set();
  return array.filter(function(item) {
    if (!seen.has(item)) {
      seen.add(item);
      return true;
    }
  });
}

function getTags(tags) {
  if (!tags) return;
  const keys = `${tags.map(tag => `<div class="chip">${tag}</div>`).join('')}`;
  return keys;
}
