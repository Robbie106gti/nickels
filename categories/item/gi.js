//// Main js for catagories /////
$.ajax({
  url: '../../layout/header.html',
  context: document.body,
  success: function(response) {
    $('#header').html(response);
  }
});
$.ajax({
  url: '../../layout/footer.html',
  context: document.body,
  success: function(response) {
    $('#footer').html(response);
  }
});

window.onload = getPage();

function getPage() {
  $.urlParam = function(name) {
    var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(
      window.location.href
    );
    if (results == null) {
      return null;
    } else {
      return decodeURI(results[1]) || 0;
    }
  };
  const code = $.urlParam('code');
  fetch(`../../json/general information.json`)
    .then(response => response.json())
    .then(data => {
      let codes = data[`items`];
      let page = codes.filter(function(el) {
        return el.code === code;
      });
      page = page[0];
      console.log(page);
      switch (page.template) {
        case 'empolyees':
          makeEmployee();
          setGI(page);
          setDes(page);
          setPar(page);
          insertEmployees(page);
          setContact(page);
          break;
        default:
          makeStructure();
          setGI(page);
          setDes(page);
          setPar(page);
          setimages(page);
          setNotes(page.notes);
          setOptions(page);
      }
    })
    .catch(err => console.log(err));
}

function makeEmployee() {
  let main = `<div class="col s12 m12 card">
            <div id="des" class="col s6 offset-s3 m6 offset-m3"></div>
            <div id="para" class="flow-text col s6 offset-s3 m6 offset-m3"></div>
            <div class="col s12 m12"><h3 class="center-align">Contact us</h3></div>
            <div id="address" class="col s6 m4 "></div>
            <div id="hours" class="col s6 m4"></div>
            <div id="social" class="col s6 m4"></div>
        </div>
        <div id="images" class="col s12 m12 grid2">
        </div>`;
  $('#catalog').html(main);
}

function insertEmployees(page) {
  let people = page.employees;
  people.sort(dynamicSort('lname'));
  let employees = `${people.map(p => employeeCard(p)).join('')}`;
  $('#images').html(employees);
}

function employeeCard(p) {
  if (p.working === false) {
    return '';
  }
  let card = `
        <div class="card sticky-action">
            <div class="card-image waves-effect waves-block waves-light">
                <img class="activator" src="${p.image}">
                <span class="card-title bgd1">${p.fname} ${p.lname}</span>
            </div>
            <div class="card-action">${p.position}</div>
            <div class="card-reveal">
                <span class="card-title grey-text text-darken-4">${p.fname} ${
    p.lname
  }<i class="material-icons right">close</i></span>
                <ul>
                    <li>E-mail: <a href="mailto:${p.email}">${p.email}</a></li>
                    <li># Ext: ${p.phone}</li>
                </ul>
            </div>
        </div>`;
  return card;
}

function makeStructure() {
  let main = `
        <div class="col s12 m6 card">
            <div id="des"></div>
            <div id="para" class="flow-text"></div>
        </div>
        <div id="images" class="col s12 m6">
        </div>
        <div class="col s12 m12">
            <div id="notes" class="col s12 m6"></div>
            <div id="options" class="col s12 m6"></div>
        </div>`;
  $('#catalog').html(main);
}

function setContact(page) {
  let address = `
        <div class="card-panel grey lighten-5 z-depth-1">
            <div class="row valign-wrapper">
                <div class="col s2">
                    <img src="../../assets/nc.gif" alt="" class="circle responsive-img"> <!-- notice the "circle" class -->
                </div>
                <div class="col s10">
                    <h4>${page.address.name}</h4>
                    <ul>
                        <li>${page.address.street}</li>
                        <li>${page.address.city}, ${page.address.state}</li>
                        <li>${page.address.postcode}</li>
                        <br><div class="divider"></div><br>
                        <li>Phone: ${page.address.phone}</li>
                        <li>Toll free: ${page.address.tfphone}</li>
                        <li>Fax: ${page.address.fax}</li>
                    </ul>
                </div>
            </div>
        </div>`;
  let hours = `
        <div class="card-panel grey lighten-5 z-depth-1">
            <div class="row valign-wrapper">
                <div class="col s12">
                    <h4>Office hours:</h4>
                    <ul>
                        <li>${page.hours.days}</li>
                        <li>from ${page.hours.ftime} to ${page.hours.ttime} (${
    page.hours.zone
  })</li>
                    </ul>
                </div>
            </div>
        </div>`;
  let social = `
        <div class="card-panel grey lighten-5 z-depth-1">
            <div class="row valign-wrapper">
                <div class="col s12">
                    <h4>Other ways to connect with us:</h4>
                    <ul>
                        ${page.social
                          .map(
                            s =>
                              `<li>${s.name} <a href="${s.link}${s.email}">${
                                s.content
                              }</a></li>`
                          )
                          .join('')}
                    </ul>
                </div>
            </div>
        </div>`;
  $('#address').html(address);
  $('#hours').html(hours);
  $('#social').html(social);
}

function setGI(page) {
  let topic = `
        <a href="../index.html?cat=${page.cat}" class="right">
            <i class="small material-icons">arrow_back</i>
        </a>
        <div id="actions"></div>
        <div>
            <h1 id="titleHeader">${page.cat}</h1>
            <h5 id="subHeader">${page.title}</h5>
        </div>
        `;
  $('#topic').html(topic);
}

function setDes(page) {
  let topic = `<h5 id="subHeader"">${
    page.description
  }</h5><div class="divider"></div>`;
  $('#des').html(topic);
}

function setPar(page) {
  let para = `${page.paragraphs
    .map(n => `<p class="${n.class}">${n.text}</p>`)
    .join('')}`;
  $('#para').html(para);
}

function setimages(page) {
  let imag = `${page.images
    .map(
      image => `<div class="card">
        <div class="padding">
            <img class="responsive-img materialboxed" src="${image.image}">
            ${imageTitle(image)}
        </div>
    </div>`
    )
    .join('')}`;
  $('#images').html(imag);
}

function imageTitle(image) {
  if (image.title === '') {
    return '';
  }
  let title = `<span class="card-title black-text"><b>${
    image.title
  }</b></span>`;
  return title;
}

function set(notes) {
  fetch(`../../json/notes.json`)
    .then(response => response.json())
    .then(data => {
      let cards = data['notes'].filter(function(el, i) {
        let t = notes.includes(el.id);
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
            `
                        <div class="card orange lighten-4">
                            <p class="note flow-text">
                                <i class="material-icons">announcement</i>
                                <b>${note.title}</b>${note.content}<a href="${
              note.link
            }">${note.contentLink}<a/>${note.ccontent}
                            </p>
                        </div>`
        )
        .join('')}`;
      // console.log(n);
      $('#notes').html(n);
    })
    .catch(err => console.log(err));
}

function setOptions(page) {
  if (page.options.length === 0) return;
  fetch(`../../json/addons.json`)
    .then(response => response.json())
    .then(data => {
      let addons = data['addons'].filter(function(el, i) {
        let t = page.options.includes(el.id);
        let id;
        if (t === true) {
          id = el.id;
        } else {
          id = t;
        }
        return el.id === id;
      });
      let n = `
                <div class="card padding">
                    <h4>Addional Customizations:</h4>
                        <ul class="collapsible popout" data-collapsible="accordion">
                        ${addons
                          .map(
                            addon =>
                              `<li class="white">
                          <div class="collapsible-header"><i class="material-icons">${
                            addon.icon
                          }</i>${addon.title}</div>
                          <div class="collapsible-body"><span><b>${
                            addon.title
                          }</b> ${addon.content}</span></div>
                        </li>`
                          )
                          .join('')}
                   </ul></div>`;
      // console.log(n);
      $('#options').html(n);
      $(document).ready(function() {
        $('.collapsible').collapsible();
      });
    })
    .catch(err => console.log(err));
}

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function(a, b) {
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}
