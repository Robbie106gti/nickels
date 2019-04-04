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

  $.getJSON('./hfu.json', function(response) {
    console.log(response);
  });
  fetch(`./hfu.json`)
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
        setSpecs(item);
        setNotes(item);
        setImages(item);
        setCodes(item);
      }
    })
    .catch(err => console.log(err));
}

function makeLayout() {
  let html = `
  <div class="col s12 m8">
    <div id="des"></div>
    <div id="spec"></div>
    <div id="notes"></div>
    <div id="codes"></div>
  </div>
  <div id="images" class="col s12 m4"></div>
  `;
  $('#catalog').html(html);
}

function setGI(information, code) {
  code = !code ? '../../index.html?cat=Accessories' : './index.html';
  const cat = `<a href="${code}" class="right"><i class="small material-icons">arrow_back</i> <span class="lift">Back</span></a>
  <h1 id="topic">${information.title}</h1><h5 id="subtitle">${
    information.subTitle
  }</h5><div id="actions"></div>`;
  $('#topic').html(cat);
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
  item.description !== '' ? $('#des').html(des) : '';
  $('#subtitle').html(item.title);
}

function setSpecs(item) {
  const spec = `
    <div class="card-panel grey lighten-3 bullet">
      <span class="card-title">
        <h4>Specifications</h4>
      </span>
      <div class="divider"></div>
      <ul class="flow-text">
      ${item.standards
        .map(
          li =>
            `<li>${li.link ? '<a href="' + li.link + '">' : ''}<b>${
              li.title
            }: </b><br>${li.content}${li.link ? '</a>' : ''}</li>`
        )
        .join('')}
      </ul>
    </div>
    `;
  $('#spec').html(spec);
}

function setMainImage(info) {}

function exampleImages(item) {
  let icons = `${item.images
    .map(image => {
      return (im = `<div class="box-image">
                  <img src="${
                    image.image
                  }" class="materialboxed tooltipped" data-position="top" data-tooltip="click to enlarge ${
        image.title
      }" data-caption="${image.title}">
               </div>`);
    })
    .join('')}`;
  return icons;
}

function exampleListImages(item) {
  let icons = `
  <table class="bordered striped highlight">
  <theader><tr><th>Images <small>(click to enlarge)</small></th><th>Title</th></tr></theader><tbody>${item.images
    .map(image => {
      return (im = `<tr><td>
    <img src="${image.image}" alt="${
        image.title
      }" class="materialboxed" width="200px" data-position="top" data-tooltip="click to enlarge ${
        image.title
      }" data-caption="${image.title}">
               </td><td>${image.title}</td>`);
    })
    .join('')}</tbody></table>`;
  return icons;
}

function setImages(item) {
  const main = `<div class="card card-panel"><div class="center"><span class="card-title ">Images</span></div>
    <img class="responsive-img materialboxed tooltipped" data-position="top" data-tooltip="click to enlarge ${
      item.imageTitle
    }" data-caption="${item.imageTitle}" src="${item.image}">
    ${exampleListImages(item)}</div>`;
  $('#images').html(main);
  $(document).ready(function() {
    setTimeout(function() {
      $('.materialboxed').materialbox();
    }, 2000);
  });
}

function setCodes(item) {
  const htmlcodes = `<div class="card-panel grey lighten-3">
  <table class="bordered striped highlight">
  <theader><tr><th>Codes</th><th>Description (width - depth - height)</th><th>Recommended Hood fan</th></tr></theader>
  <tbody>
  ${item.widths
    .map(width => {
      return item.heights
        .map(
          height => `
    <tr><td><span class="ordercode tooltipped" data-position="top" data-tooltip="add to order" onclick="addCodenow(${item.code +
      width +
      height})">${item.code + width + height}</span></td><td>${
            item.title
          } - (w) ${width}" x (d) ${item.depth}" x (h) ${height}"</td><td>${
            item.versions[width].length
              ? item.versions[width]
                  .map(
                    hood =>
                      `<a href="${
                        hood.link
                      }" rel="noopener noreferrer" target="_blank">${
                        hood.title
                      }</a>`
                  )
                  .join(' / ')
              : `<a href="${
                  item.versions[width].link
                }" rel="noopener noreferrer" target="_blank">${
                  item.versions[width].title
                }</a>`
          }</td></tr>
    `
        )
        .join('');
    })
    .join('')}
  </tbody>
  </table>
</div>`;
  $('#codes').html(htmlcodes);
}

function setNotes(item) {
  let n = item.notes
    .map(
      note => `
  <div class="card orange lighten-4">
      <p class="note flow-text">
          <i class="material-icons">announcement</i>
          <b>${note.title}, </b>
          ${note.content}
      </p>
  </div>`
    )
    .join('');
  $('#notes').html(n);
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
