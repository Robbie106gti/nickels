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
  fetch(`./legs.json`)
    .then(response => response.json())
    .then(data => {
      // console.log(data);
      const info = {
        title: 'Legs and Posts',
        code,
        item: null
      };
      if (!code) {
        const d = document.getElementById('catalog');
        d.className += ' grid';
        const html = `${data.legs.map(cat => cardWith(cat)).join('')}`;
        $('#catalog').html(html);
        setGI(info);
        makeHelper();
        return;
      } else {
        info.item = data.legs.filter(
          item => item.code.toLowerCase() === code
        )[0];
      }
      makeStructure(info);
    })
    .catch(err => console.log(err));
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

function makeStructure(info) {
  setGI(info);
  const structure = `
  <div class="col s12 m8">
    <div id="des"></div>
    <div id="spec"></div>
    <div id="notes"></div>
    <div id="codes"></div>
  </div>
  <div id="images" class="col s12 m4">
  ${setMainImage(info.item)}</div>`;
  $('#catalog').html(structure);
  setDes(info.item);
  setSpecs(info.item);
}

function setMainImage(info) {
  const main = `<div class="card card-panel"><div class="center"><span class="card-title ">Images</span></div>
    ${exampleImages(info)}
    <img class="responsive-img materialboxed" src="${
      info.images[0].image
    }"></div>`;
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

function setGI(info) {
  const link = !info.code ? '../../index.html?cat=Accessories' : './index.html';
  let topic = `
        <a href="${link}" class="right">
          <i class="small material-icons">arrow_back</i>
        </a>
        <div>
            <h1 id="titleHeader">${titleCase(info.title)}</h1>
            ${info.item ? `<h5>${info.item.title}</h5>` : ''}
        </div>
        <div id="ddwn"></div>
        `;
  $('#topic').html(topic);
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

function cardWith(cat) {
  const card = `<div class="card ${edge}"><a href="./index.html?code=${
    cat.code
  }">
                  <div class="card-image waves-effect waves-block waves-light">
                      <img class=""
                      src="${cat.images[0].image}" >
                  </div>
                  <div class="card-content">
                      <span class="card-title grey-text text-darken-4">${titleCase(
                        cat.title
                      )}<i class="material-icons right">more_vert</i></span>
                      ${getTags(cat.tags)}
                  </div></a>
                </div>`;
  return card;
}

function setDes(item) {
  const des = `
  <div class="card-panel  blue-grey darken-1 white-text">
    <span class="card-title">
      <h4>Description</h4>
    </span>
    <div class="divider"></div>
    <span id="des" class="flow-text">
    ${item.description}
    </span>
  </div>`;
  item.description ? $('#des').html(des) : null;
}

function setSpecs(item) {
  const spec = `
    <div class="card-panel grey lighten-3 bullet">
      <span class="card-title">
        <h4>Specifications</h4>
      </span>
      <div class="divider"></div>
      <ul class="flow-text">
        <li><ul>
        <li class="second"><i class="material-icons">tune</i> Height: ${
          item.dimensions.height
        }</li>
        <li class="second"><i class="material-icons">tune</i> Width: ${
          item.dimensions.width
        }</li>
        <li class="second"><i class="material-icons">tune</i> Depth: ${
          item.dimensions.depth
        }</li>
        </ul></li>
        <li>Available in the following materials:
${item.materials
  .map((mat, i, arr) => {
    i++;
    let text = i === arr.length ? ' and ' + mat : mat + ', ';
    return text;
  })
  .join('')}
        </li>
      </ul>
    </div>
    `;
  $('#spec').html(spec);
}

function setNotes(item) {
  fetch(`./loox.json`)
    .then(response => response.json())
    .then(data => {
      let cards = data['notes'].filter(function(el, i) {
        let t = item.notes.includes(el.id);
        let id;
        if (t === true) {
          id = el.id;
        } else {
          id = t;
        }
        return el.id === id;
      });
      let n = `${cards
        .map(
          note =>
            `<div class="card orange lighten-4">
                            <p class="note flow-text">
                                <i class="material-icons">announcement</i>
                                <b>${note.title}</b>${note.content}<a href="${
              note.link
            }">${note.contentLink}<a/>${note.ccontent}
                            </p>
                        </div>`
        )
        .join('')}`;
      $(`#note${item.code}`).html(n);
    })
    .catch(err => console.log(err));
}

function getTags(tags) {
  if (!tags) return;
  const keys = `${tags.map(tag => `<div class="chip">${tag}</div>`).join('')}`;
  return keys;
}

// This is the left click function 2018
function addCodenow(wcode) {
  wcode = `<span>${wcode}</span>`;
  if (confirm('Do you want to add this item to your order?')) {
    parent.addtocart(wcode);
  }
}
