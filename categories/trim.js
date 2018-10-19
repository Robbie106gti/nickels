//// Main js for catagories /////

$.ajax({
  url: "../layout/header.html",
  context: document.body,
  success: function (response) {
    $("#header").html(response);
  }
});
$.ajax({
  url: "../layout/footer.html",
  context: document.body,
  success: function (response) {
    $("#footer").html(response);
  }
});

window.onload = getSubs();



function getSubs() {
  $.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
      return null;
    } else {
      return decodeURI(results[1]) || 0;
    }
  }
  const edges = [];
  const cat = $.urlParam('cat');
  const item = $.urlParam('item') ? $.urlParam('item') : null;
  const params = {
    cat: cat,
    item: item
  }
  structure(params);
  setGI(cat);
  const catagory = cat.toLowerCase();
  fetch(`../json/${catagory}.json`)
    .then(response => response.json())
    .then(data => {
      // console.log(data['catalog']);
      data = data[cat];
      const html = params.item !== null ? buildItem(data, params) : mainCatView(data);

    }).then(() => initMaterializeJS())
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
  const html = params.item !== null ? `
        <div id="modals"></div>
        <div class="col s12 m6">
            <div id="des"></div>
            <div id="specs"></div>
            <div id="notes"></div>
        </div>
        <div class="col s12 m6">
            <div id="images"></div>
        </div>
        <div class="col s12 m12">
            <div id="codes" class="col s12 m6"></div>
            <div id="options" class="col s12 m6"></div>
        </div>` : null;
  $('#catalog').html(html);
}

function mainCatView(data) {
  const b = document.getElementById("catalog");
  b.setAttribute("class", "grid");
  const html = `${data.map(cat =>                `
                    <div class="card"><a href="${cat.link}">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img class="image20 activator" src="${cat.image}">
                        </div>
                        <div class="card-content">
                            <span class="card-title activator grey-text text-darken-4">${cat.title}<i class="material-icons right">more_vert</i></span>
                            ${getTags(cat.tags)}
                        </div></a>
                    </div>`
            ).join('')}`;
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
}

function setImages(item) {
  let image = `<div class="card">
                            <div class="padding">
                                <img class="responsive-img materialboxed" src="${item.image}" alt="${item.imageTitle}">
                                <span class="card-title black-text"><b>${item.imageTitle}</b></span>
                            </div>
                        </div>`;
  $("#images").html(image);
}

function setDescription(item) {
  let htmldes = `<div class="card-panel  blue-grey darken-1 white-text">
                        <span class="card-title">
                            <h4>Description</h4>
                        </span>
                        <div class="divider"></div>
                        <span id="des" class="flow-text">${item.title}, ${item.description}</span>
                    </div>`;
  $("#des").html(htmldes);
}

function setStandards(item) {
  const specs = item.standards;
  let htmlspecs = `<div class="card-panel grey lighten-3 bullet">
                        <span class="card-title">
                            <h4>Standards</h4>
                        </span>
                        <div class="divider"></div>
                        <div id="specli"><ul class="flow-text">${specs.map(spec => `<li><small><b>${spec.title}: </b>${spec.content}</small></li>`).join('')}</ul></div>
            <div id="options">${setOptions(item.options)}</div>
            <div id="restrictions">${setRestrictions(item.restrictions)}</div>
                    </div>`;
  $("#specs").html(htmlspecs);
}

function setOptions(options) {
  let htmloptions = `<span class="card-title">
                            <h4>Options</h4>
                        </span>
                        <div class="divider"></div>
                        <div id="specli"><ul class="flow-text">${options.map(option => `<li><small><b>${option.title}: </b>${option.content}</small>${option.action ? actionButton(option): ''}</li>`).join('')}</ul></div>`;
  return htmloptions;
}

function actionButton(option) {
  edges = option.edges;

  const htmlbutton = `<button data-target="modaledges" class="btn modal-trigger" (onclick)="openModal('modaledges')">${option.action}</button>`;
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
  let htmlrestictions = `<span class="card-title">
                            <h4>Restrictions</h4>
                        </span>
                        <div class="divider"></div>
                        <div id="specli"><ul class="flow-text">${res.map(r => `<li><small><i  class="material-icons">notifications</i> - ${r}</small></li>`).join('')}</ul></div>`;
  return htmlrestictions;
}

function setNotes(notes) {
  let htmlnotes = notes.map(note => `<div class="card orange lighten-4">
                            <p class="note flow-text">
                                <i class="material-icons">announcement</i>
                                <b>${note.title},</b> ${note.content}
                            </p>
                        </div>`).join('');
  $("#notes").html(htmlnotes);
}

function isString(value) {
  return typeof value === 'string';
}

function setGI(data) {
  const cat = isString(data) ? `<h1 id="topic">${data}</h1>` : `<h1 id="topic">${data.sub}</h1><h5>${data.title}</h5><div id="actions"></div>`;
  $("#topic").html(cat);
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
      data.forEach(edge => edges.includes(edge.title) ? shownEdges.push(edge) : '');
      const html = `${shownEdges.map(e => `<div class="card padding"> <img class="responsive-img" src="${e.image}"><h5>${e.title} ${e.description ? `(${e.description})`: ''}</h5><span>Length: ${e.size.inch}"</span></div>`              
        ).join('')}`;
      const modaledges = `<!-- Modal Structure -->
      <div id="modaledges" class="modal">
        <div class="modal-content">
        <div class="">
        <h4>Edge options<a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a></h4></div>
          <div id="edges" class="row grid">${html}</div>
        </div>
      </div>`;
      $("#modals").html(modaledges);
      initMaterializeJS();
    })
    .catch(err => console.log(err));
}
