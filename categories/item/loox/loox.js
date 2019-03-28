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
  const tab = $.urlParam('tab');
  fetch(`./loox.json`)
    .then(response => response.json())
    .then(data => {
      // console.log(data);
      if (!code && !page) {
        const d = document.getElementById('catalog');
        d.className += ' grid';
        const html = `${data.information.map(cat => cardWith(cat)).join('')}`;
        $('#catalog').html(html);
        let info = {
          cat: 'Loox',
          root: page,
          height: code,
          title: 'LED Loox lighting',
          item: {
            pre: false
          }
        };
        setGI(info);
        makeHelper();
        return;
      }
      let info = data.information.filter(i => i.id == page)[0];
      info['page'] = page;
      info['code'] = code;
      info['tab'] = tab;
      /*       info = { ...info,
              page: page,
              code: code,
              tab: id
            }; */
      let item = info.attached.filter(i => i.item == code)[0];
      let includes = item.includes.map(item => {
        return data.items.filter(i => i.code === item)[0];
      });
      if (includes.length >= 0) {
        let spec = [];
        // console.log(item, includes);
        includes.map(item => (spec = spec.concat(item.specifications)));
        spec.sort((a, b) => a - b);
        item['specifications'] = unique(spec);
        /*         item = {
                  specifications: unique(spec),
                  ...item
                }; */
      }
      info['includes'] = includes;
      info['item'] = item;
      /*       info = {
              item,
              ...info,
              includes
            }; */
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
  let index = `
        <div class="col s12 m6">
            <p>Page not Found.</p>
        </div>`;
  setGI(info);
  makeDDWN(info.attached);
  makeHelper();
  console.log(info.item);
  switch (info.page) {
    case 'spots':
      card = cardWithAction(info);
      $('#catalog').html(card);
      includesCard(info);
      setSpecs(info.item);
      info.prepare ? setPrepare(info.prepare) : null;
      callButton();
      break;
    case 'strips':
      card = cardWithAction(info);
      $('#catalog').html(card);
      includesCard(info);
      setSpecs(info.item);
      info.item.prepare ? setPrepare(info.item.prepare) : null;
      callButton();
      break;
    case 'parts':
      partsChose(info);
      break;
    default:
      $('#catalog').html(index);
      callButton();
  }
}

function partsChose(info) {
  switch (info.code) {
    case 'power supplies':
      card = info.includes.map(
        card => `<div class="col s12 m6">${partHcard(card)}</div>`
      );
      $('#catalog').html(card);
      $(document).ready(function() {
        $('.slider').slider();
      });
      callButton();
      break;
    case 'lights':
      card = info.includes.map(item => cardWithActionLight(item));
      $('#catalog').html(card);
      setSpecs(info.item);
      callButton();
      break;
    default:
      makeTabs(info);
      callButton();
  }
}

function callButton() {
  $('.dropdown-button').dropdown({
    inDuration: 300,
    outDuration: 225,
    constrainWidth: true, // Does not change width of dropdown to that of the activator
    hover: true, // Activate on hover
    gutter: 0, // Spacing from edge
    belowOrigin: true, // Displays dropdown below the button
    alignment: 'left', // Displays dropdown with edge aligned to the left of button
    stopPropagation: false // Stops event propagation
  });

  $(document).ready(function() {
    $('.tooltipped').tooltip({
      delay: 50
    });
  });

  $(document).ready(function() {
    $('.slider').slider();
  });
}

function setGI(info) {
  // console.log(info);
  let topic = `
        <a href="${
          info.page ? './index.html' : '../../index.html?cat=Accessories'
        }" class="right">
          <i class="small material-icons">arrow_back</i>
        </a>
        <div id="actions"></div>
        <div>
            <h1 id="titleHeader">${titleCase(info.title)}</h1>
            ${
              info.item.pre
                ? '<h5 id="subHeader">Option: ' +
                  titleCase(info.item.pre) +
                  ' ' +
                  titleCase(info.item.item) +
                  '</h5>'
                : ''
            }
        </div>
        <div class="fixed-action-btn" style="top: 85px; right: 24px;">
        <a class="waves-effect waves-light btn btn-floating cyan" onclick="$('.tap-target').tapTarget('open')">?</a>
        </div>
        <div id="ddwn"></div>
        <div id="helper"></div>
        `;
  $('#topic').html(topic);
}

function makeDDWN(ddwn) {
  ddwn = `<!-- Dropdown Trigger -->
        <a class='dropdown-button btn bot red' data-activates='dropdown1'>Related items</a>

        <!-- Dropdown Structure -->
        <ul id='dropdown1' class='dropdown-content red'>
            ${makeActions(ddwn)}
        </ul>`;
  $('#ddwn').html(ddwn);
}

function makeActions(card) {
  // console.log(card);
  let action = `${card
    .map(a =>
      a.active !== false
        ? `<li class="waves-effect waves-light"><a class="white-text" href="./index.html?page=${
            a.page
          }&code=${a.item}"><i class="material-icons">art_track</i>${titleCase(
            a.item
          )}</a></li>`
        : ''
    )
    .join('')}`;
  return action;
}

function makeTabs(info) {
  console.log(info);
  let tabs = `<div>
    <ul id="tabs-swipe-demo" class="tabs">
      ${info.item.tabs
        .map(
          tab =>
            `<li class="tab col s3"><a href="./index.html?page=${
              info.page
            }&code=${info.code}&tab=${tab}#${tab}" class="${
              info.tab === tab ? 'active' : ''
            }">${tab}</a></li>`
        )
        .join('')}
    </ul>
    ${info.item.tabs
      .map(
        tab =>
          `<div id="${tab}" class="${tab !== 'prepare' ? 'grid' : ''} ${
            info.tab === tab ? 'active' : ''
          }" >${composeTab(tab, info)}</div>`
      )
      .join('')}
  </div>`;
  $('#catalog').html(tabs);
  $(document).ready(function() {
    $('ul.tabs').tabs();
  });
  //info.tab ? instance.select(info.tab) : null;
}

function composeTab(tab, info) {
  let cards =
    tab !== 'prepare'
      ? info.includes.filter(i => i.tab == tab)
      : prepareTab(tab, info);
  return cards.map(card => cardWithActioMSC(card)).join('');
}

function prepareTab(tab, info) {
  console.log(tab, info);
  let card = [];
  setPrepare(info.item.prepare);
  return card;
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
  const card = `<div class="card ${edge}">
                  <div class="card-image waves-effect waves-block waves-light">
                      <img class="activator"
                      src="${cat.image}" >
                  </div>
                  <div class="card-content">
                      <span class="card-title activator grey-text text-darken-4">${titleCase(
                        cat.title
                      )}<i class="material-icons right">more_vert</i></span>
                      ${getTags(cat.tags)}
                  </div>
                  <div class="card-reveal">
                      <span class="card-title grey-text text-darken-4">${titleCase(
                        cat.title
                      )}<i class="material-icons right">close</i></span>
                      ${getLinks(cat)}
              </div></div>`;
  return card;
}

function webqoinCode(info) {
  let wqCode = `<span class="ordercode tooltipped" data-position="bottom" data-delay="50" data-tooltip="Would you like to add this to your order">${
    info.item.wcode
  }</span></span>
                      <a class="btn-floating right waves-effect waves-light red" href="javascript:" onclick="parent.stopPropagate(event);parent.additemtowq('<a>${
                        info.item.wcode
                      })</a>'"><i  class="material-icons tooltipped" data-position="bottom" data-delay="50" data-tooltip="Would you like to add this to your order">add</i></a>`;
  if (info.item.length) {
    wqCode = null;
    wqCode = info.item.length
      .map(
        l =>
          `<span class="ordercode tooltipped" data-position="bottom" data-delay="50" data-tooltip="Would you like to add ${"'" +
            info.item.wcode +
            '-' +
            l +
            "'"} to your order">${info.item.wcode + '-' + l}</span>`
      )
      .join('/');
    wqCode = wqCode + '</span>';
  }
  if (info.colors) {
    wqCode = null;
    wqCode = info.colors
      .map(
        l =>
          `<span class="ordercode tooltipped" data-position="bottom" data-delay="50" data-tooltip="Would you like to add ${"'" +
            info.item.wcode +
            '-' +
            l.code +
            "'"} to your order">${info.item.wcode + '-' + l.code}</span>
      <a class="btn-floating right waves-effect waves-light second" style="background-color: ${
        l.color
      }" href="javascript:" onclick="parent.stopPropagate(event);parent.additemtowq('<a>${info
            .item.wcode +
            '-' +
            l.code}</a>')">
      <i class="material-icons tooltipped" data-position="bottom" data-delay="50" data-tooltip="Would you like to add ${"'" +
        l.title +
        "'"} to your order">add</i>
      </a>
      `
      )
      .join('/');
    wqCode = '</span>' + wqCode;
  }
  return wqCode;
}

function kitIncludes(item) {
  return `<ul class="collection with-header"><li class="collection-header"><h5>Kit includes the following items:</h5></li><li class="collection-item">Power supply not included</li>${item.includes
    .map(i => `<li class="collection-item">${i.title}</li>`)
    .join('')}</ul>`;
}

function cardWithAction(info) {
  // console.log(info);
  let card = `<div class="card col s12 m6">
                  <div class="card-image waves-effect waves-block waves-light">
                      <img class="activator"
                      src="${info.item.image}" >
                  </div>
                  <div class="card-content">
                      <span class="card-title activator grey-text text-darken-4">${titleCase(
                        info.item.pre
                      )} ${titleCase(info.item.item)}
                      ${webqoinCode(info)}
                      <p>${
                        info.item.description
                          ? info.item.description
                          : info.description
                      }.</p>
                      ${info.includes ? kitIncludes(info) : ''}
                  </div>
                  <div class="card-panel grey lighten-3 bullet">
                        <span class="card-title">
                            <h4>Specifications</h4>
                        </span>
                        <div class="divider"></div>
                        <div id="specli"></div>
                  </div>
              </div><div id="include"></div>`;
  if (info.item.prepare) {
    card = card + '<div id="prepare"></div>';
  }
  if (info.prepare) {
    card = card + '<div id="prepare"></div>';
  }
  return card;
}

function cardWithActionLight(item) {
  const card = `<div class="col s12 m4">
                  <div class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img class="image20" src="${item.images[0].image}">
                    </div>
                    <div class="card-content">
                        <span class="card-title grey-text text-darken-4">${titleCase(
                          item.title
                        )}
                        ${
                          item.length
                            ? item.length
                                .map(l =>
                                  codeswebby({
                                    code: `${item.code}-${l}`,
                                    title: `${item.title} ${l} feet`
                                  })
                                )
                                .join(' / ')
                            : codeswebby({ code: item.code, title: item.title })
                        }
                        <p>${item.description}.</p>
                    </div>
                    <div id="spec${item.code}">${setSpecs2(item)}</div>
                    <div id="note${item.code}">${setNotes(item)}</div>
                  </div></div>`;
  return card;
}

function cardWithActioMSC(item) {
  const card = `<div class="card">
                  ${imagesMSC(item)}
                  <div class="card-content">
                      <span class="card-title activator grey-text text-darken-4">${titleCase(
                        item.title
                      )}</span> ${makeCodes(item)}
                      <p>${item.description}.</p>
                  </div>
                  <div id="spec${item.code}">${setSpecs2(item)}</div>
                  <div id="note${item.code}">${setNotes(item)}</div>
              </div>`;
  return card;
}

function imagesMSC(item) {
  const imgmsc =
    item.images.length >= 2
      ? `<div class="slider"><ul class="slides">${item.images.map(
          image =>
            `<li><img class="responsive-img" src="${image.image}" alt="${
              image.title
            }"/><div class="caption right-align"><h5 class="black-text">${
              image.title
            }</h5></div></li>`
        )}</ul></div>`
      : `
                  <div class="card-image waves-effect waves-block waves-light">
                      <img class="materialboxed activator image20"
                      src="${item.images[0].image}">
                  </div>`;
  return imgmsc;
}

function makeCodes(item) {
  if (item.length) {
    return item.length
      .map(l =>
        codeswebby({
          code: `${item.code}-${l}`,
          title: `${item.title} ${l} feet`
        })
      )
      .join(' / ');
  }
  if (item.colors) {
    return item.colors
      .map(l =>
        codeswebby({
          code: `${item.code}-${l.code}`,
          title: `${item.title} ${l.title}`
        })
      )
      .join(' / ');
  }
  return codeswebby({
    code: item.code
  });
}

function codeswebby(c) {
  let web = `<span class="ordercode tooltipped" data-position="bottom" data-delay="50" data-tooltip="Would you like to add ${
    c.title
  } to your order">${c.code}</span>`;
  return web;
}

function includesCard(info) {
  let include = `<div class="col s12 m6">
        <div class="card-panel">
        <h2 class="header">${titleCase(info.item.pre)} ${titleCase(
    info.item.item
  )} includes:</h2>
        ${info.includes.map(item => hcard(item)).join('')}
        </div></div>`;
  $('#include').html(include);
}

function hcard(item) {
  let hcard =
    item.images.length !== 1
      ? makeSliders(item)
      : `<div class="card horizontal">
        <div class="card-image" style="overflow: hidden">
          <img class="materialboxed" src="${item.images[0].image}" alt="${
          item.images[0].title
        }">
        </div>
        <div class="card-stacked">
          <div class="card-content">
            <p>${item.description}</p>
          </div>
          <div class="card-action">
            <p class="parts">Replacement part code: <span class="ordercode tooltipped" data-position="bottom" data-delay="50" data-tooltip="Would you like to add this to your order" >${
              item.code
            }</span></p>
          </div>
        </div>
      </div><div id="note${item.code}">${setNotes(item)}</div>`;
  return hcard;
}

function makeSliders(item) {
  const slides = `<div class="card"><div class="slider"><ul class="slides">${item.images.map(
    image =>
      `<li><img class="responsive-img" src="${image.image}" alt="${
        image.title
      }"/><div class="caption right-align"><h5 class="black-text">${
        image.title
      }</h5></div></li>`
  )}</ul></div>
          <div class="card-content">
            <p>${item.description}</p>
          </div>
          <div class="card-action">
            ${partsCode(item)}
          </div>
  </div><div id="note${item.code}">${setNotes(item)}</div>`;
  return slides;
}

function partsCode(item) {
  let pcodes = `<p class="parts">Replacement part code: <span class="ordercode tooltipped" data-position="bottom" data-delay="50" data-tooltip="Would you like to add this to your order" >${
    item.code
  }</span></a>`;
  if (item.colors) {
    pcodes = item.colors.map(
      color =>
        ` <span class="ordercode tooltipped" data-position="bottom" data-delay="50" data-tooltip="Would you like to add ${
          item.title
        } in ${color.title} to your order" >${item.code}-${color.code}</span>`
    );
    pcodes = '<p class="parts">Replacement part code: ' + pcodes + '</p>';
  }
  if (item.length) {
    pcodes = item.length.map(
      l =>
        ` <span class="ordercode tooltipped" data-position="bottom" data-delay="50" data-tooltip="Would you like to add ${
          item.title
        } ${l} feet to your order" >${item.code}-${l}</span>`
    );
    pcodes = '<p class="parts">Replacement part code: ' + pcodes + '</p>';
  }
  return pcodes;
}

function partHcard(item) {
  let hcard = `
        <div class="slider">
            <ul class="slides">
                ${item.images.map(image => setSlides(image)).join('')}
            </ul>
        </div>
        <div class="card-panel  blue-grey darken-1 white-text">
            <div class="card-content flow-text">
                <span class="card-title"><b>${item.title}</b></span>
                <p>${item.description}</p>
            </div>
        </div>
        <div class="card-panel grey lighten-3 bullet">
              <span class="card-title">
                  <h4>Specifications</h4>
              </span>
              <div class="divider"></div>
              <div id="spec${item.code}">${setSpecNversions(item)}</div>
        </div>
        <div id="note${item.code}">${setNotes(item)}</div>`;
  return hcard;
}

function setImage(image) {
  return (image = `<img class="image20 materialboxed" src="${
    image.image
  }" alt="${image.title}">`);
}

function setSlides(image) {
  return (image = `
        <li>
            <img
            src="${image.image}"
            alt="${image.title}" >
        </li>`);
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

function setSpecs(item) {
  if (!item.specifications) {
    return ``;
  }
  fetch(`./loox.json`)
    .then(response => response.json())
    .then(data => {
      let spec = data['specifications'].sort((a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
      });
      spec = spec.filter(function(el, i) {
        let t = item.specifications.includes(el.id);
        let id;
        if (t === true) {
          id = el.id;
        } else {
          id = t;
        }
        return el.id === id;
      });
      let n = `<ul class="flow-text">${spec
        .map(n => `<li><b>${n.title}</b>: ${n.content}</li>`)
        .join('')}</ul>`;
      $('#specli').html(n);
    })
    .catch(err => console.log(err));
}

function setSpecs2(item) {
  fetch(`./loox.json`)
    .then(response => response.json())
    .then(data => {
      let spec = data['specifications'].sort((a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
      });
      spec = spec.filter(function(el, i) {
        let t = item.specifications.includes(el.id);
        let id;
        if (t === true) {
          id = el.id;
        } else {
          id = t;
        }
        return el.id === id;
      });
      if (spec.length >= 1) {
        let n = `<div class="card-panel grey lighten-3 bullet">
              <span class="card-title">
                  <h4>Specifications</h4>
              </span>
              <div class="divider"></div>
            <ul class="flow-text">${spec
              .map(n => `<li><b>${n.title}</b>: ${n.content}</li>`)
              .join('')}</ul></div>`;
        $(`#spec${item.code}`).html(n);
        return;
      }
      $(`#spec${item.code}`).html('');
    })
    .catch(err => console.log(err));
}

function setPrepare(preps) {
  fetch(`./loox.json`)
    .then(response => response.json())
    .then(data => {
      let prepare = data['prepare'];
      prepare.sort((a, b) => {
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
        return 0;
      });
      prepare = prepare.filter(function(el, i) {
        let t = preps.includes(el.id);
        let id;
        if (t === true) {
          id = el.id;
        } else {
          id = t;
        }
        return el.id === id;
      });
      console.log(prepare);
      const p = prepare.map(
        pre =>
          `<div class="col s12 m6"><div class="card horizontal"><div class="card-image" style="overflow: hidden"><img class="materialboxed" src="${
            pre.image
          }" alt="${
            pre.title
          }"/></div><div class="card-stacked"><div class="card-content"><h5>${
            pre.title
          }</h5><p>${pre.description}</p></div>${prepareCodes(
            pre
          )}</div></div></div>`
      );
      $(`#prepare`).html(p);
      $(document).ready(function() {
        $('.materialboxed').materialbox();
      });
    })
    .catch(err => console.log(err));
}

function prepareCodes(pre) {
  let codes = pre.code
    ? `<div class="card-action"><p class="parts">Prepare cabinet code: <span class="ordercode tooltipped" data-position="bottom" data-delay="50" data-tooltip="Would you like to add this to your order" >${
        pre.code
      }</span></p></div>`
    : '';
  if (pre.lights) {
    codes = `<div class="card-action"><p class="parts">Prepare cabinet code: ${pre.lights
      .map(
        light =>
          `<span class="ordercode tooltipped" data-position="bottom" data-delay="50" data-tooltip="Would you like to add prepare for ${light} light(s) to your order" >${
            pre.code
          }-${light}</span>`
      )
      .join(', ')}</p></div>`;
  }
  return codes;
}

function setSpecNversions(item) {
  console.log(item);
  fetch(`./loox.json`)
    .then(response => response.json())
    .then(data => {
      let spec = data['specifications'];
      spec.sort((a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
      });
      spec = spec.filter(function(el, i) {
        let t = item.specifications.includes(el.id);
        let id;
        if (t === true) {
          id = el.id;
        } else {
          id = t;
        }
        return el.id === id;
      });
      let n = `<ul class="flow-text">${spec
        .map(n => `<li><b>${n.title}</b>: ${n.content}</li>`)
        .join('')}</ul>`;
      const table = `<table class="striped highlight centered">
        <thead>
          <tr>
            <th></th>
            ${item.versions
              .map(th => {
                if (th.active === false) return '';
                const thu = `<th><span class="ordercode tooltipped" data-position="bottom" data-delay="50" data-tooltip="Would you like to add this to your order">${
                  th.code
                }</span></th>`;
                return thu;
              })
              .join('')}
          </tr>
        </thead>
        <tbody id="tbody">
          ${item.vtable.map(tr => rowIt(tr, item)).join('')}
        </tbody>
      </table>`;
      n = n + table;
      $(`#spec${item.code}`).html(n);
    })
    .catch(err => console.log(err));
}

function rowIt(tr, item) {
  let line = item.versions
    .map(th => {
      if (th.active === false) return '';
      const y =
        tr !== 'download'
          ? `<td>${th[tr]}</td>`
          : `<td><a href="/catalog/build/assets/loox/${th[tr]}">${
              th[tr]
            }</a></td>`;
      return y;
    })
    .join('');
  line = `<tr><td>${titleCase(tr)}</td>` + line + '</tr>';
  return line;
}

function getLinks(cat) {
  if (!cat.attached) return;
  const keys = `${cat.attached
    .map(a => (a.active !== false ? formatLink(a) : ''))
    .join('')}`;
  return keys;
}

function formatLink(a) {
  let link = `<a href="./index.html?page=${a.page}&code=${a.item}">${titleCase(
    a.item
  )}</a><br>`;
  return link;
}

function getTags(tags) {
  if (!tags) return;
  const keys = `${tags.map(tag => `<div class="chip">${tag}</div>`).join('')}`;
  return keys;
}

function makeHelper() {
  let help = `<div class="fixed-action-btn" style="bottom: 45px; right: 24px;">
          <a id="menu" class="btn btn-floating btn-large cyan"><i class="material-icons">menu</i></a>
        </div>
        <!-- Tap Target Structure -->
        <div class="tap-target" data-activates="menu">
          <div class="tap-target-content" style="text-align: right;">
            <h5>Steps</h5>
            <p>
                <b>Step 1:</b> Choose the kind of light, strip or spot.<br>
                <b>Step 2:</b> Where do you want to apply these lights?<br>
                <b>Step 3:</b> Choose a power supply.<br>
                <b>Step 4:</b> Do you need a switch?<br>
                <b>Step 5:</b> Do you need extensions?
            </p>
          </div>
        </div>`;
  $('#helper').html(help);
}
