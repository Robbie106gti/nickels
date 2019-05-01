//// Main js for catagories /////
headerFooter('../../');

window.onload = getSubs();

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
  const edges = [];
  const cat = $.urlParam('cat');
  const item = $.urlParam('item') ? $.urlParam('item') : null;
  const params = {
    cat: cat,
    item: item
  };
  structure(params);
  setGI(cat);
  const catagory = cat.toLowerCase();
  fetch(`../../json/${catagory}.json`)
    .then(response => response.json())
    .then(data => {
      console.log(data['catalog']);
      data = data[cat];
      const html =
        params.item !== null ? buildItem(data, params) : mainCatView(data);
    })
    .then(() => initMaterializeJS())
    .catch(err => console.log(err));
}

function initMaterializeJS() {
  $(document).ready(function () {
    $('.modal').modal({
      dismissible: true
    });
  });
}

function structure(params) {
  const html =
    params.item !== null
      ? `
        <div id="modals"></div>
        <div class="col s12 m6">
            <div id="des"></div>
            <div id="specs"></div>
            <div id="notes"></div>
        </div>
        <div class="col s12 m6">
            <div id="images"></div>
        </div>
            <div id="codes" class="col s12 m6"></div>
            <div id="options2" class="col s12 m6"></div>`
      : null;
  $('#catalog').html(html);
}

function mainCatView(data) {
  data.sort(function (a, b) {
    if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
    if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
    return 0;
  });
  const b = document.getElementById('catalog');
  b.setAttribute('class', 'grid');
  const html = `${data
    .map(
      cat => `<div class="card"><a href="${cat.link}">
                <div class="card-image waves-effect waves-block waves-light">
                    <img class="image20 activator" src="${cat.image}">
                </div>
                <div class="card-content">
                    <span class="card-title activator grey-text text-darken-4">${
        cat.title
        }<i class="material-icons right">more_vert</i></span>
                    ${getTags(cat.tags)}
                </div></a>
            </div>`
    )
    .join('')}`;
  $('#catalog').html(html);
}

function buildItem(data, params) {
  const item = data.filter(item => item.code === params.item)[0];
  setGI({
    sub: params.cat,
    title: item.title
  });
  console.log({
    data,
    item,
    params
  });
  setDescription(item);
  setStandards(item);
  setNotes(item.notes);
  setImages(item);
  setCodes(item);
  if (item.legLeveller) {
    setOptions2(item.legLeveller);
  }
}

function setImages(item) {
  let image = '';
  switch (item.sizeImage) {
    case 'small':
      image = imageCard(item);
      break;
    default:
      image = `<div class="card" style="overflow: hidden; max-height: 100%;">
                            <div class="padding">
                                <img class="responsive-img materialboxed" src="${
        item.image
        }" alt="${item.imageTitle}">
                                <span class="card-title black-text"><b>${
        item.imageTitle
        }</b></span>
                            </div>
                            ${item.specImage ? specImage(item) : ''}
                        </div>`;
  }
  $('#images').html(image);
  $(document).ready(function () {
    $('.materialboxed').materialbox();
  });
}

function imageCard(item) {
  let card = `<div class="col s4"><div class="card small" style="overflow: hidden; max-height: 100%;"><div class="padding">
      <img class="responsive-img materialboxed" src="${item.image}" alt="${
    item.imageTitle
    }">
      <span class="card-title black-text"><b>${item.imageTitle}</b></span>
  </div></div></div>`;
  card =
    card +
    `<div class="col s4"><div class="card small" style="overflow: hidden; max-height: 100%;"><div class="padding">
      <img class="responsive-img materialboxed" src="${item.specImage}" alt="${
    item.specImageTitle
    }">
      <span class="card-title black-text"><b>${item.specImageTitle}</b></span>
  </div></div></div>`;
  if (item.specImage2) {
    card =
      card +
      `<div class="col s4"><div class="card small" style="overflow: hidden; max-height: 100%;"><div class="padding">
      <img class="responsive-img materialboxed" src="${item.specImage2}" alt="${
      item.specImageTitle2
      }">
      <span class="card-title black-text"><b>${item.specImageTitle2}</b></span>
  </div></div></div>`;
  }
  return card;
}

function specImage(item) {
  return `
  <div class="padding">
      <img class="responsive-img materialboxed" src="${item.specImage}" alt="${
    item.specImageTitle
    }">
      <span class="card-title black-text"><b>${item.specImageTitle}</b></span>
  </div>`;
}

function setDescription(item) {
  let htmldes = `<div class="card-panel  blue-grey darken-1 white-text">
                        <span class="card-title">
                            <h4>Description</h4>
                        </span>
                        <div class="divider"></div>
                        <span id="des" class="flow-text">${item.title}, ${
    item.description
    }</span>
                    </div>`;
  $('#des').html(htmldes);
}

function setStandards(item) {
  const specs = item.standards;
  let htmlspecs = `<div class="card-panel grey lighten-3">
                        <span class="card-title">
                            <h4>Standards</h4>
                        </span>
                        <div class="divider"></div>
                        <div id="specli"><ul class="flow-text">${specs
      .map(
        spec =>
          `<li><small><b>${spec.title}: </b>${
          spec.content
          }</small></li>`
      )
      .join('')}</ul></div>
            <div id="options">${setOptions(item.options)}</div>
            <div id="restrictions">${setRestrictions(item.restrictions)}</div>
                    </div>`;
  $('#specs').html(htmlspecs);
}

function setOptions(options) {
  if (options === undefined) return '';
  let htmloptions = `<span class="card-title">
                            <h4>Options</h4>
                        </span>
                        <div class="divider"></div>
                        <div id="specli"><ul class="flow-text">${options
      .map(option =>
        option.active === false
          ? ''
          : `<li><small><b>${option.title}: </b>${
          option.content
          }</small>${
          option.action ? actionButton(option) : ''
          }</li>`
      )
      .join('')}</ul></div>`;
  return htmloptions;
}

function setOptions2(option) {
  console.log(option);
  let options = `<div class="card-panel grey lighten-3 row">
  <span class="card-title">
      <h4>${option.title}</h4>
  </span>
  <div class="divider"></div>
  <div class="col s12">
    <p>${option.description}</p>
    <ul class="col s9"><span>${option.optionsTitle}</span>
      ${option.options
      .map(
        option =>
          `<li><b><span class="ordercode" >${option.code}</span>: </b>${
          option.description
          }</li>`
      )
      .join('')}
    </ul>
    <div class="card-image col s3">
    <img src="${option.image}" class="responsive-img materialboxed">
  </div>
    <div class="divider"></div>
    <ul class="col s12"><span><h5>Standards</h5></span>
      ${option.standards.map(option => `<li>${option}</li>`).join('')}
    </ul>
    </div>
  </div>`;

  $('#options2').html(options);
}

function setCodes(item) {
  let htmlcodes = ``;
  switch (item.table.template) {
    case 'three':
      htmlcodes = tableThree(item.table);
      break;
    case 'two':
      htmlcodes = tableTwo(item.table);
      break;
    default:
      htmlcodes = `<div class="card-panel grey lighten-3">
                        <table class="bordered striped highlight">
                        <theader><tr>${item.table.header
          .map(th => `<th>${th}</th>`)
          .join('')}</tr></theader>
                        <tbody>${item.table.content
          .map(
            row =>
              `<tr><td>${
              row.de
              }</td><td><ul><li><span  class="ordercode">${
              row.code
              }</span></li></ul></td><td>${
              row.description
              }</td></tr>`
          )
          .join('')}</tbody>
                        </table>
                    </div>`;
  }
  $('#codes').html(htmlcodes);

  $('.dropdown-button').dropdown({
    hover: true
  });
}

function tableTwo(table) {
  const tableTwo = `<div class="card-panel grey lighten-3">
  <table class="bordered striped highlight">
  <theader><tr>${table.header
      .map(th => `<th>${th}</th>`)
      .join('')}</tr></theader>
  <tbody>${table.content
      .map(row =>
        row.active === false
          ? ''
          : `<tr>
          <td>${row.code}</td>
          <td>${row.unique ? 'Set height' : `${row.heights} (Inch)`}</td>
          <td>${row.unique ? 'Set lengths' : `${row.lengths} (feet)`}</td>
          <td>
          ${
          row.unique
            ? `<span class="ordercode" >${row.code}</span>`
            : `<a class='dropdown-button btn' href='#' data-activates='dropdownordercodes${
            row.code
            }'>OrderCodes</a>
          <ul id='dropdownordercodes${row.code}' class='dropdown-content'>
            ${row.heights
              .map(height =>
                row.lengths
                  .map(
                    length =>
                      `<li><span class="ordercode">${row.code +
                      height}-${length}</span><small>${height}" high - ${length}' long</small></li>`
                  )
                  .join('')
              )
              .join('')}
          </ul>`
          }</td>
          <td>${row.description}</td>
        </tr>`
      )
      .join('')}</tbody>
  </table>
</div>`;
  return tableTwo;
}

function tableThree(table) {
  const tableTwo = `<div class="card-panel grey lighten-3">
  <table class="bordered striped highlight">
  <theader><tr>${table.header
      .map(th => `<th>${th}</th>`)
      .join('')}</tr></theader>
  <tbody>${table.content
      .map(
        row =>
          `<tr>
          <td>${row.lengths}' (Feet)</td>
          <td>${row.return ? 'Yes' : 'No'}</td>
          <td>${row.de ? 'Yes' : 'No'}</td>
          <td>
          <a class='dropdown-button btn' href='#' data-activates='dropdownordercodes${
          row.code
          }'>OrderCodes</a>
          <ul id='dropdownordercodes${row.code}' class='dropdown-content'>
                ${row.lengths
            .map(
              length =>
                `<li><span class="ordercode">${
                row.code
                }-${length}</span><small>${length}' long</small></li>`
            )
            .join('')}
          </ul></td>
          <td>${row.description}</td>
        </tr>`
      )
      .join('')}</tbody>
  </table>
</div>`;
  return tableTwo;
}

function actionButton(option) {
  edges = option.edges;

  const htmlbutton = `<button data-target="modaledges" class="btn modal-trigger" (onclick)="openModal('modaledges')">${
    option.action
    }</button>`;
  getEdges(edges);
  return htmlbutton;
}

function openModal(id) {
  $(`#${id}`).modal('open');
}

function closeModal(id) {
  $(`#${id}`).modal('close');
}

function setRestrictions(res) {
  if (res === undefined) return '';
  let htmlrestictions = `<span class="card-title">
                            <h4>Restrictions</h4>
                        </span>
                        <div class="divider"></div>
                        <div id="specli"><ul class="flow-text">${res
      .map(
        r =>
          `<li><small><i  class="material-icons">notifications</i> - ${r}</small></li>`
      )
      .join('')}</ul></div>`;
  return htmlrestictions;
}

function setNotes(notes) {
  if (notes === undefined) return '';
  let htmlnotes = notes
    .map(
      note => `<div class="card orange lighten-4">
                            <p class="note flow-text">
                                <i class="material-icons">announcement</i>
                                <b>${note.title},</b> ${note.content}
                            </p>
                        </div>`
    )
    .join('');
  $('#notes').html(htmlnotes);
}

function isString(value) {
  return typeof value === 'string';
}

function setGI(data) {
  const link = isString(data)
    ? '../../index.html'
    : './trim.html?cat=Trims%20Moldings';
  let div = `
  <div class="container ">
    <a href="${link}" class="right">
      <i class="small material-icons">arrow_back</i> <span class="lift">Back</span>
    </a>
    <div id="topic"></div>
  </div>`;
  $('#top').html(div);
  const cat = isString(data)
    ? `<h1 id="topic">${data}</h1>`
    : `<h1 id="topic">${data.sub}</h1><h5>${
    data.title
    }</h5><div id="actions"></div>`;
  $('#topic').html(cat);
}

function getTags(tags) {
  if (!tags) return '';
  const keys = `${tags.map(tag => `<div class="chip">${tag}</div>`).join('')}`;
  return keys;
}

function getEdges() {
  fetch(`../json/edges.json`)
    .then(response => response.json())
    .then(data => {
      const shownEdges = new Array();
      data.forEach(edge =>
        edges.includes(edge.title) ? shownEdges.push(edge) : ''
      );
      const html = `${shownEdges
        .map(
          e =>
            `<div class="card padding"> <img class="responsive-img" src="${
            e.image
            }"><h5>${e.title} ${
            e.description ? `(${e.description})` : ''
            }</h5><span>Length: ${e.size.inch}"</span></div>`
        )
        .join('')}`;
      const modaledges = `<!-- Modal Structure -->
      <div id="modaledges" class="modal">
        <div class="modal-content">
        <div class="">
        <h4>Edge options<a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a></h4></div>
          <div id="edges" class="row grid">${html}</div>
        </div>
      </div>`;
      $('#modals').html(modaledges);
      initMaterializeJS();
    })
    .catch(err => console.log(err));
}
