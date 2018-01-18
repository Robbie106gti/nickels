//// Main js for catagories /////
$.ajax({
  url: "../../../layout/header.html",
  context: document.body,
  success: function (response) {
    $("#header").html(response);
  }
});
$.ajax({
  url: "../../../layout/footer.html",
  context: document.body,
  success: function (response) {
    $("#footer").html(response);
  }
});

window.onload = getPage();

var edge = "";
var ua = window.navigator.userAgent;
var msie = ua.indexOf("Edge/");
if (msie !== -1) {
  var edge = ua.split("Edge/");
  if (edge[1] < 16) {
    edge = "col s3";
  }
}

function getPage() {
  $.urlParam = function (name) {
    var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
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
  const code = $.urlParam("code");
  const page = $.urlParam("page");
  const id = $.urlParam("id");
  fetch(`./loox.json`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (!code && !page) {
        const d = document.getElementById("catalog");
        d.className += " grid";
        const html = `${data.information.map(cat => cardWith(cat)).join("")}`;
        $("#catalog").html(html);
        let info = {
          cat: "Loox",
          root: page,
          height: code,
          title: "LED lighting",
          item: {
            pre: false
          }
        };
        setGI(info);
        makeHelper();
        return;
      }
      let info = data.information.filter(i => i.id == page)[0];
      info = { ...info,
        page: page,
        code: code,
        tab: id
      };
      let item = info.attached.filter(i => i.item == code)[0];
      let includes = item.includes.map(item => {
        return data.items.filter(i => i.code === item)[0];
      });
      if (includes.length >= 0) {
        let spec = [];
        includes.map(item => (spec = spec.concat(item.specifications)));
        spec.sort((a, b) => a - b);
        item = {
          specifications: unique(spec),
          ...item
        };
      }
      info = {
        item,
        ...info,
        includes
      };
      makeStructure(info);
    })
    .catch(err => console.log(err));
}

function unique(array) {
  var seen = new Set();
  return array.filter(function (item) {
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
  switch (info.page) {
    case "spots":
      card = cardWithAction(info);
      $("#catalog").html(card);
      includesCard(info);
      setSpecs(info.item);
      callButton();
      break;
    case "strips":
      card = cardWithAction(info);
      $("#catalog").html(card);
      includesCard(info);
      setSpecs(info.item);
      callButton();
      break;
    case "parts":
      partsChose(info);
      break;
    default:
      $("#catalog").html(index);
      callButton();
  }
}

function partsChose(info) {
  switch (info.code) {
    case "drivers":
      card = info.includes.map(
        card => `<div class="col s12 m6">${partHcard(card)}</div>`
      );
      $("#catalog").html(card);
      $(document).ready(function () {
        $(".slider").slider();
      });
      callButton();
      break;
    case "lights":
      card = info.includes.map(item => cardWithActionLight(item));
      $("#catalog").html(card);
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
      }
    );
}

function setGI(info) {
  console.log(info);
  let topic = `
        <a href="${info.page ? './index.html' : '../../../'}" class="right">
          <i class="small material-icons">arrow_back</i>
        </a>
        <div id="actions"></div>
        <div>
            <h1 id="titleHeader">${titleCase(info.title)}</h1>
            ${
              info.item.pre
                ? '<h5 id="subHeader">Option: ' +
                  titleCase(info.item.pre) +
                  " " +
                  titleCase(info.item.item) +
                  "</h5>"
                : ""
            }
        </div>
        <div class="fixed-action-btn" style="top: 85px; right: 24px;">
        <a class="waves-effect waves-light btn btn-floating cyan" onclick="$('.tap-target').tapTarget('open')">?</a>
        </div>
        <div id="ddwn"></div>
        <div id="helper"></div>    
        `;
  $("#topic").html(topic);
}

function makeDDWN(ddwn) {
  ddwn = `<!-- Dropdown Trigger -->
        <a class='dropdown-button btn bot red' data-activates='dropdown1'>Related items</a>
      
        <!-- Dropdown Structure -->
        <ul id='dropdown1' class='dropdown-content red'>
            ${makeActions(ddwn)}
        </ul>`;
  $("#ddwn").html(ddwn);
}

function makeActions(card) {
  let action = `${card
    .map(
      a =>
        `<li class="waves-effect waves-light"><a class="white-text" href="./index.html?page=${
          a.page
        }&code=${a.item}"><i class="material-icons">art_track</i>${titleCase(
          a.item
        )}</a></li>`
    )
    .join("")}`;
  return action;
}

function makeTabs(info) {
  let tabs = `<div><ul id="tabs-swipe-demo" class="tabs">
                    ${info.item.tabs
                      .map(
                        tab => { 
                            if(tab === info.tab) { return `<li class="tab col s3"><a href="#${tab}" class="active">${tab}</a></li>`}
                            if (info.tab == null && tab === info.item.tabs[0]) { return `<li class="tab col s3"><a href="#${tab}" class="active">${tab}</a></li>`}
                            return `<li class="tab col s3"><a href="#${tab}">${tab}</a></li>`;
                        })
                      .join("")}</ul>
                    ${info.item.tabs
                      .map(
                        tab =>
                          `<div id="${tab}" class="grid">${composeTab(tab, info)}</div>`
                      )
                      .join("")}</div>`;
  $("#catalog").html(tabs);
  $(document).ready(function(){
    $('ul.tabs').tabs();
  });
}

function composeTab(tab, info) {
  let cards = info.includes.filter(i => i.tab == tab);
  return cards.map(card => cardWithActioMSC(card)).join('');
}

function titleCase(str) {
  if (str == null) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      if (!word) return;
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(" ");
}

function cardWith(cat) {
  const card = `<div class="card ${edge}">
                  <div class="card-image waves-effect waves-block waves-light">
                      <img class="activator" src="${cat.image}">
                  </div>
                  <div class="card-content">
                      <span class="card-title activator grey-text text-darken-4">${
                        titleCase(cat.title)
                      }<i class="material-icons right">more_vert</i></span>
                      ${getTags(cat.tags)}
                  </div>
                  <div class="card-reveal">
                      <span class="card-title grey-text text-darken-4">${
                        titleCase(cat.title)
                      }<i class="material-icons right">close</i></span>
                      ${getLinks(cat)} 
              </div></div>`;
  return card;
}

function cardWithAction(info) {
  const card = `<div class="card col s12 m6">
                  <div class="card-image waves-effect waves-block waves-light">
                      <img class="activator" src="${info.item.image}">
                  </div>
                  <div class="card-content">
                      <span class="card-title activator grey-text text-darken-4">${titleCase(
                        info.item.pre
                      )} ${titleCase(info.item.item)}</span>
                      <a class="btn-floating right waves-effect waves-light red"><i class="material-icons">add</i></a>
                      <p>${
                        info.item.description
                          ? info.item.description
                          : info.description
                      }.</p>
                  </div>
                  <div class="card-panel grey lighten-3 bullet">
                        <span class="card-title">
                            <h4>Specifications</h4>
                        </span>
                        <div class="divider"></div>
                        <div id="specli"></div>
                  </div>
              </div><div id="include"></div>`;
  return card;
}

function cardWithActionLight(item) {
  const card = `<div class="col s12 m4">
                  <div class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img class="activator image20" src="${
                            item.images[0].image
                        }">
                    </div>
                    <div class="card-content">
                        <span class="card-title activator grey-text text-darken-4">${titleCase(
                            item.title
                        )}</span>
                        <a class="btn-floating right waves-effect waves-light red"><i class="material-icons">add</i></a>
                        <p>${item.description}.</p>
                    </div>
                    <div id="spec${item.code}">${setSpecs2(item)}</div>
                    <div id="note${item.code}">${setNotes(item)}</div>
                  </div></div>`;
  return card;
}

function cardWithActioMSC(item) {
  const card = `<div class="card">
                  <div class="card-image waves-effect waves-block waves-light">
                      <img class="activator image20" src="${
                        item.images[0].image
                      }">
                  </div>
                  <div class="card-content">
                      <span class="card-title activator grey-text text-darken-4">${titleCase(
                        item.title
                      )}</span>
                      <a class="btn-floating right waves-effect waves-light red"><i class="material-icons">add</i></a>
                      <p>${item.description}.</p>
                  </div>
                  <div id="spec${item.code}">${setSpecs2(item)}</div>
                  <div id="note${item.code}">${setNotes(item)}</div>
              </div>`;
  return card;
}

function includesCard(info) {
  let include = `<div class="col s12 m6">
        <div class="card-panel">
        <h2 class="header">${titleCase(info.item.pre)} ${titleCase(
    info.item.item
  )} includes:</h2>
        ${info.includes.map(item => hcard(item)).join("")}
        </div></div>`;
  $("#include").html(include);
}

function hcard(item) {
  let hcard = `<div class="card horizontal">
        <div class="card-image" style="overflow: hidden">
          <img src="${item.images[0].image}" alt="${item.images[0].title}">
        </div>
        <div class="card-stacked">
          <div class="card-content">
            <p>${item.description}</p>
          </div>
          <div class="card-action">
            <a href="#">Replacement part code: ${item.code}</a>
          </div>
        </div>
      </div><div id="note${item.code}">${setNotes(item)}</div>`;
  return hcard;
}

function partHcard(item) {
  let hcard = `
        <div class="slider">
            <ul class="slides">
                ${item.images.map(image => setSlides(image)).join("")}  
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
  return (image = `<img class="image20" src="${image.image}" alt="${
    image.title
  }">`);
}

function setSlides(image) {
  return (image = `
        <li>
            <img src="${image.image}" alt="${image.title}">               
        </li>`);
}

function setNotes(item) {
  fetch(`./loox.json`)
    .then(response => response.json())
    .then(data => {
      let cards = data["notes"].filter(function (el, i) {
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
        .join("")}`;
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
      let spec = data["specifications"].filter(function (el, i) {
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
        .join("")}</ul>`;
      $("#specli").html(n);
    })
    .catch(err => console.log(err));
}

function setSpecs2(item) {
  fetch(`./loox.json`)
    .then(response => response.json())
    .then(data => {
      let spec = data["specifications"].filter(function (el, i) {
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
              .join("")}</ul></div>`;
        $(`#spec${item.code}`).html(n);
        return;
      }
      $(`#spec${item.code}`).html('');
    })
    .catch(err => console.log(err));
}

function setSpecNversions(item) {
  console.log(item);
  fetch(`./loox.json`)
    .then(response => response.json())
    .then(data => {
      let spec = data["specifications"].filter(function (el, i) {
        let t = item.specifications.includes(el.id);
        let id;
        if (t === true) {
          id = el.id;
        } else {
          id = t;
        }
        return el.id === id;
      });
      let n = `<ul class="flow-text">
                ${spec.map(
                    n => `<li><b>${n.title}</b>: ${n.content}</li>`
                    )
                    .join("")}
            </ul>
            <table class="striped highlight centered">
                <thead>
                <tr>
                    <th></th>
                    ${item.versions.map(th => `<th>${th.code}</th>`)
                        .join("")}
                </tr>
                </thead>
                <tbody id="tbody">                
                    ${item.vtable.map(tr => rowIt(tr, item))
                        .join("")}
                </tbody>`;
      $(`#spec${item.code}`).html(n);
    })
    .catch(err => console.log(err));
}

function rowIt(tr, item) {
  tr = `<tr><td>${titleCase(tr)}</td>${item.versions.map(th => {
      if (tr === "download") {
        return `<td><a href="https://webquoin.com/catalog/build/assets/loox/${th[tr]}">${th[tr]}</a></td>`;
      }
      return `<td>${th[tr]}</td>`;
}).join("")}</tr>`;
return tr;
}

function getLinks(cat) {
  if (!cat.attached) return;
  const keys = `${cat.attached.map(a => formatLink(a)).join("")}`;
  return keys;
}

function formatLink(a) {
  let link = `<a href="./index.html?page=${a.page}&code=${a.item}">${
    titleCase(a.item)
  }</a><br>`;
  return link;
}

function getTags(tags) {
  if (!tags) return;
  const keys = `${tags.map(tag => `<div class="chip">${tag}</div>`).join("")}`;
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
                <b>Step 3:</b> Choose a driver.<br>
                <b>Step 4:</b> Do you need a switch?<br>
                <b>Step 5:</b> Do you need extensions?
            </p>
          </div>
        </div>`;
  $("#helper").html(help);
}
