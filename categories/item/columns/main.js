//// Main js for catagories /////
headerFooter(null);

window.onload = getPage();

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
  fetch(`./items.json`)
    .then(response => response.json())
    .then(data => {
      // console.log(data);
      const info = {
        title: 'Columns',
        code,
        item: null
      };
      if (!code) {
        const tabs = data['sub-cats'];
        let html = {};
        tabs.forEach(tab => {
          html = Object.assign({}, html, {
            [tab.root]: data.items.filter(item => tab.root === item.root)
          });
          /*  html = {
             [tab.root]: data.items.filter(item => tab.root === item.root),
             ...html
           }; */
        });

        $('#catalog').html(tabbedSec(html, tabs));
        setGI(info);
        return;
      } else {
        info.item = data.items.filter(
          item => item.code.toLowerCase() === code
        )[0];
        info.item.requires ? addRequired(info, data) : info;
        info.item.fronts ? addFronts(info, data) : info;
      }
      makeStructure(info);
    })
    .catch(err => console.log(err));
}

function addFronts(info, data) {
  info.item.fronts = info.item.fronts.map(
    front => data.items.filter(item => item.code === front)[0]
  );
  return info;
}

function addRequired(info, data) {
  info.item.requires = data.items.filter(
    item => item.code === info.item.requires[0]
  )[0];
  info.item.images = info.item.images.concat(info.item.requires.images);
  info.item.notes = info.item.notes.concat(info.item.requires.notes);
  console.log(info);
  return info;
}

function tabbedSec(object, tabs) {
  // console.log(object, tabs);
  const li = tabs
    .map(tab => {
      const i = `<li class="tab col s3"><a class="" href="#${tab.root}">${
        tab.title
      }</a></li>`;
      return i;
    })
    .join('');
  const grids = tabs
    .map(tab => {
      const g = `<div id="${tab.root}" class="grid">${object[tab.root]
        .map(card => cardWith(card))
        .join('')}</div>`;
      return g;
    })
    .join('');
  const html = `<div class="row">
  <div class="" onload="loadTabs()">
    <ul class="tabs">
      ${li}
    </ul>
  </div>
  ${grids}
</div>`;
  return html;
}

function makeStructure(info) {
  // console.log(info);
  setGI(info);
  const structure = `
  <div class="col s12 m8">
    <div id="des"></div>
    <div id="spec"></div>
    <div id="notes"></div>
    <div id="codes"></div>
  </div>
  <div id="images" class="col s12 m4">
  ${setMainImage(info.item)}</div>
  <div id="table" class="col s12 m4">${organizeTables(info)}</div>`;
  $('#catalog').html(structure);
  setDes(info.item);
  setSpecs(info.item);
  $('#codes').html(setCode(info.item.code));
  setNotes(null, info.item.notes);
}

function organizeTables(info) {
  let tables;
  if (info.item.fronts) {
    tables = `<div class="card-panel">${setFrontOptions(
      info.item
    )}</div><div class="card-panel">${setColumnHeights(info.item, '24')}</div>`;
    console.log(tables);
    return tables;
  }
  if (!info.item.requires) return '';
  return `<div class="card-panel">${setTableColumns(
    info.item
  )}</div><div class="card-panel">${setColumnHeights(info.item)}</div>`;
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
  const link = !info.code
    ? '../../../catalog.html'
    : './index.html#' + info.item.root;
  let topic = `
        <a href="${link}" class="right">
          <i class="small material-icons">arrow_back</i> <span class="lift">Back</span>
        </a>
        <div>
            <h1 id="titleHeader">${titleCase(info.title)}</h1>
            ${info.item ? `<h5>${info.item.title}</h5>` : ''}
        </div>
        <div id="ddwn"></div>
        `;
  $('#topic').html(topic);
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

function setSpecs(item) {
  const spec = `
    <div class="card-panel grey lighten-3 bullet">
      <span class="card-title">
        <h4>Specifications</h4>
      </span>
      <div class="divider"></div>
      <ul class="flow-text">
        <li style="list-style-type: none"><ul>
        <li class="second"><i class="material-icons">tune</i> Height: ${
          item.dimensions.heights
        }</li>
        <li class="second"><i class="material-icons">tune</i> Width: ${
          item.dimensions.widths
        }</li>
        <li class="second"><i class="material-icons">tune</i> Depth: ${
          item.dimensions.depths
        }</li>
        <li class="second"><i class="material-icons">tune</i> Front: ${
          item.dimensions.thickness
        }</li>
        </ul></li>
        ${item.standards
          .map(st => `<li  style="list-style-type: none">${st}</li>`)
          .join('')}
      </ul>
      ${
        item.options
          ? `<div id="options">${setOptions(item.options)}</div>`
          : ''
      }
      ${
        item.restrictions
          ? `<div id="restrictions">${setRestrictions(item.restrictions)}</div>`
          : ''
      }</div>
    </div>
    `;
  $('#spec').html(spec);
}
