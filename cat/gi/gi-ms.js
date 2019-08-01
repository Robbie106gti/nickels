//// Main js for catagories /////
'use strict';
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
  var code = $.urlParam('code');
  fetch('../../json/general information.json', { cache: "reload" })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var codes = data['items'];
      var page = codes.filter(function(el) {
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
    .catch(function(err) {
      return console.log(err);
    });
}

function makeEmployee() {
  var main =
    '<div class="col s12 m12 card">\n            <div id="des" class="col s6 offset-s3 m6 offset-m3"></div>\n            <div id="para" class="flow-text col s6 offset-s3 m6 offset-m3"></div>\n            <div class="col s12 m12"><h3 class="center-align">Contact us</h3></div>\n            <div id="address" class="col s6 m4 "></div>\n            <div id="hours" class="col s6 m4"></div>\n            <div id="social" class="col s6 m4"></div>\n        </div>\n        <div id="images" class="col s12 m12">\n        </div>';
  $('#catalog').html(main);
}

function insertEmployees(page) {
  var people = page.employees;
  people.sort(dynamicSort('lname'));
  var employees =
    '' +
    people
      .map(function(p) {
        return employeeCard(p);
      })
      .join('');
  $('#images').html(employees);
}

function employeeCard(p) {
  if (p.working === false) {
    return '';
  }
  var card =
    '\n        <div class="card sticky-action col s2 m2">\n            <div class="card-image waves-effect waves-block waves-light">\n                <img class="activator" src="' +
    p.image +
    '">\n                <span class="card-title bgd1">' +
    p.fname +
    ' ' +
    p.lname +
    '</span>\n            </div>\n            <div class="card-action">' +
    p.position +
    '</div>\n            <div class="card-reveal">\n                <span class="card-title grey-text text-darken-4">' +
    p.fname +
    ' ' +
    p.lname +
    '<i class="material-icons right">close</i></span>\n                <ul>\n                    <li>E-mail: <a href="mailto:' +
    p.email +
    '">' +
    p.email +
    '</a></li>\n                    <li># Ext: ' +
    p.phone +
    '</li>\n                </ul>\n            </div>\n        </div>';
  return card;
}

function makeStructure() {
  var main =
    '\n        <div class="col s12 m6 card">\n            <div id="des"></div>\n            <div id="para" class="flow-text"></div>\n        </div>\n        <div id="images" class="col s12 m6">\n        </div>\n        <div class="col s12 m12">\n            <div id="notes" class="col s12 m6"></div>\n            <div id="options" class="col s12 m6"></div>\n        </div>';
  $('#catalog').html(main);
}

function setContact(page) {
  var address =
    '\n        <div class="card-panel grey lighten-5 z-depth-1">\n            <div class="row valign-wrapper">\n                <div class="col s2">\n                    <img src="../../assets/nc.gif" alt="" class="circle responsive-img"> <!-- notice the "circle" class -->\n                </div>\n                <div class="col s10">\n                    <h4>' +
    page.address.name +
    '</h4>\n                    <ul>\n                        <li>' +
    page.address.street +
    '</li>\n                        <li>' +
    page.address.city +
    ', ' +
    page.address.state +
    '</li>\n                        <li>' +
    page.address.postcode +
    '</li>\n                        <br><div class="divider"></div><br>\n                        <li>Phone: ' +
    page.address.phone +
    '</li>\n                        <li>Toll free: ' +
    page.address.tfphone +
    '</li>\n                        <li>Fax: ' +
    page.address.fax +
    '</li>\n                    </ul>\n                </div>\n            </div>\n        </div>';
  var hours =
    '\n        <div class="card-panel grey lighten-5 z-depth-1">\n            <div class="row valign-wrapper">\n                <div class="col s12">\n                    <h4>Office hours:</h4>\n                    <ul>\n                        <li>' +
    page.hours.days +
    '</li>\n                        <li>from ' +
    page.hours.ftime +
    ' to ' +
    page.hours.ttime +
    ' (' +
    page.hours.zone +
    ')</li>\n                    </ul>\n                </div>\n            </div>\n        </div>';
  var social =
    '\n        <div class="card-panel grey lighten-5 z-depth-1">\n            <div class="row valign-wrapper">\n                <div class="col s12">\n                    <h4>Other ways to connect with us:</h4>\n                    <ul>\n                        ' +
    page.social
      .map(function(s) {
        return (
          '<li>' +
          s.name +
          ' <a href="' +
          s.link +
          s.email +
          '">' +
          s.content +
          '</a></li>'
        );
      })
      .join('') +
    '\n                    </ul>\n                </div>\n            </div>\n        </div>';
  $('#address').html(address);
  $('#hours').html(hours);
  $('#social').html(social);
}

function setGI(page) {
  var topic =
    '\n        <a href="../index.html?cat=' +
    page.cat +
    '" class="right">\n            <i class="small material-icons">arrow_back</i> <span class="lift">Back</span>\n        </a>\n        <div id="actions"></div>\n        <div>\n            <h1 id="titleHeader">' +
    page.cat +
    '</h1>\n            <h5 id="subHeader">' +
    page.title +
    '</h5>\n        </div>        \n        ';
  $('#topic').html(topic);
}

function setDes(page) {
  var topic =
    '<h5 id="subHeader"">' +
    page.description +
    '</h5><div class="divider"></div>';
  $('#des').html(topic);
}

function setPar(page) {
  var para =
    '' +
    page.paragraphs
      .map(function(n) {
        return '<p class="' + n.class + '">' + n.text + '</p>';
      })
      .join('');
  $('#para').html(para);
}

function setimages(page) {
  var imag =
    '' +
    page.images
      .map(function(image) {
        return (
          '<div class="card">\n        <div class="padding">\n            <img class="responsive-img materialboxed" src="' +
          image.image +
          '">\n            ' +
          imageTitle(image) +
          '\n        </div>\n    </div>'
        );
      })
      .join('');
  $('#images').html(imag);
}

function imageTitle(image) {
  if (image.title === '') {
    return '';
  }
  var title =
    '<span class="card-title black-text"><b>' + image.title + '</b></span>';
  return title;
}

function setNotes(notes) {
  fetch('../../json/notes.json', { cache: "reload" })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var cards = data['notes'].filter(function(el, i) {
        var t = notes.includes(el.id);
        var id = void 0;
        if (t === true) {
          id = el.id;
        } else {
          id = t;
        }
        return el.id === id;
      });
      var n =
        '' +
        cards
          .map(function(note) {
            return (
              '\n                        <div class="card orange lighten-4">\n                            <p class="note flow-text">\n                                <i class="material-icons">announcement</i>\n                                <b>' +
              note.title +
              '</b>' +
              note.content +
              '<a href="' +
              note.link +
              '">' +
              note.contentLink +
              '<a/>' +
              note.ccontent +
              '\n                            </p>\n                        </div>'
            );
          })
          .join('');
      // console.log(n);
      $('#notes').html(n);
    })
    .catch(function(err) {
      return console.log(err);
    });
}

function setOptions(page) {
  if (page.options.length === 0) return;
  fetch('../../json/addons.json', { cache: "reload" })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var addons = data['addons'].filter(function(el, i) {
        var t = page.options.includes(el.id);
        var id = void 0;
        if (t === true) {
          id = el.id;
        } else {
          id = t;
        }
        return el.id === id;
      });
      var n =
        '\n                <div class="card padding">\n                    <h4>Addional Customizations:</h4>\n                        <ul class="collapsible popout" data-collapsible="accordion">\n                        ' +
        addons
          .map(function(addon) {
            return (
              '<li class="white">\n                          <div class="collapsible-header"><i class="material-icons">' +
              addon.icon +
              '</i>' +
              addon.title +
              '</div>\n                          <div class="collapsible-body"><span><b>' +
              addon.title +
              '</b> ' +
              addon.content +
              '</span></div>\n                        </li>'
            );
          })
          .join('') +
        '\n                   </ul></div>';
      // console.log(n);
      $('#options').html(n);
      $(document).ready(function() {
        $('.collapsible').collapsible();
      });
    })
    .catch(function(err) {
      return console.log(err);
    });
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
