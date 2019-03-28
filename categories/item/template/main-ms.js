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
var ua = window.navigator;
console.log(ua);
var edge = 'col s3';

function getPage() {
  $.urlParam = function(name) {
    var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(
      window.location.href
    );

    if (results == null) {
      return null;
    } else {
      var url = decodeURI(results[1]) || 0;
      url = url.toLowerCase();
      return url;
    }
  };

  var code = $.urlParam('code');
  fetch('./items.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // console.log(data);
      var info = {
        title: 'Legs and Posts',
        code: code,
        item: null
      };

      if (!code) {
        var d = document.getElementById('catalog');
        d.className += ' grid';
        var html = ''.concat(
          data.legs
            .map(function(cat) {
              return cardWith(cat);
            })
            .join('')
        );
        $('#catalog').html(html);
        setGI(info);
        return;
      } else {
        info.item = data.legs.filter(function(item) {
          return item.code.toLowerCase() === code;
        })[0];
      }

      makeStructure(info);
    })
    .catch(function(err) {
      return console.log(err);
    });
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
  var structure = '\n  <div class="col s12 m8">\n    <div id="des"></div>\n    <div id="spec"></div>\n    <div id="notes"></div>\n    <div id="codes"></div>\n  </div>\n  <div id="images" class="col s12 m4">\n  '.concat(
    setMainImage(info.item),
    '</div>'
  );
  $('#catalog').html(structure);
  setDes(info.item);
  setSpecs(info.item);
  setCodes(info.item);
}

function setMainImage(info) {
  var main = '<div class="card card-panel"><div class="center"><span class="card-title ">Images</span></div>\n    '
    .concat(
      exampleImages(info),
      '\n    <img class="responsive-img materialboxed" src="'
    )
    .concat(info.images[0].image, '"></div>');
  return main;
}

function exampleImages(info) {
  var icons = ''.concat(
    info.images
      .map(function(image) {
        return (im = '<div class="box-image">\n                  <img src="'
          .concat(
            image.image,
            '" class="materialboxed tooltipped" data-position="top" data-tooltip="click to enlarge" data-caption="'
          )
          .concat(image.title, '">\n               </div>'));
      })
      .join('')
  );
  return icons;
}

function setGI(info) {
  var link = !info.code ? '../../index.html?cat=Accessories' : './index.html';
  var topic = '\n        <a href="'
    .concat(
      link,
      '" class="right">\n          <i class="small material-icons">arrow_back</i>\n        </a>\n        <div>\n            <h1 id="titleHeader">'
    )
    .concat(titleCase(info.title), '</h1>\n            ')
    .concat(
      info.item ? '<h5>'.concat(info.item.title, '</h5>') : '',
      '\n        </div>\n        <div id="ddwn"></div>\n        '
    );
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
  var card = '<div class="card '
    .concat(edge, '"><a href="./index.html?code=')
    .concat(
      cat.code,
      '">\n                  <div class="card-image waves-effect waves-block waves-light">\n                      <img class=""\n                      src="'
    )
    .concat(
      cat.images[0].image,
      '" >\n                  </div>\n                  <div class="card-content">\n                      <span class="card-title grey-text text-darken-4">'
    )
    .concat(
      titleCase(cat.title),
      '<i class="material-icons right">more_vert</i></span>\n                      '
    )
    .concat(
      getTags(cat.tags),
      '\n                  </div></a>\n                </div>'
    );
  return card;
}

function setDes(item) {
  var des = '\n  <div class="card-panel  blue-grey darken-1 white-text">\n    <span class="card-title">\n      <h4>Description</h4>\n    </span>\n    <div class="divider"></div>\n    <span id="des" class="flow-text">\n    '.concat(
    item.description,
    '\n    </span>\n  </div>'
  );
  item.description ? $('#des').html(des) : null;
}

function setSpecs(item) {
  var spec = '\n    <div class="card-panel grey lighten-3 bullet">\n      <span class="card-title">\n        <h4>Specifications</h4>\n      </span>\n      <div class="divider"></div>\n      <ul class="flow-text">\n        <li><ul>\n        <li class="second"><i class="material-icons">tune</i> Height: '
    .concat(
      item.dimensions.height,
      '</li>\n        <li class="second"><i class="material-icons">tune</i> Width: '
    )
    .concat(
      item.dimensions.width,
      '</li>\n        <li class="second"><i class="material-icons">tune</i> Depth: '
    )
    .concat(
      item.dimensions.depth,
      '</li>\n        </ul></li>\n        <li>Available in the following materials:\n'
    )
    .concat(
      item.materials
        .map(function(mat, i, arr) {
          i++;
          var text = i === arr.length ? ' and ' + mat : mat + ', ';
          return text;
        })
        .join(''),
      '\n        </li>\n      </ul>\n    </div>\n    '
    );
  $('#spec').html(spec);
}

function setCodes(item) {
  var codes = '<div class="card-panel blue accent-1">\n  <p class=""><b>Click the ordercode to add to your job:</b>\n    <span class="ordercode">'.concat(
    item.code,
    '</span></p>\n  </div>'
  );
  $('#codes').html(codes);
}

function setNotes(item) {
  fetch('./loox.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var cards = data['notes'].filter(function(el, i) {
        var t = item.notes.includes(el.id);
        var id;

        if (t === true) {
          id = el.id;
        } else {
          id = t;
        }

        return el.id === id;
      });
      var n = ''.concat(
        cards
          .map(function(note) {
            return '<div class="card orange lighten-4">\n                            <p class="note flow-text">\n                                <i class="material-icons">announcement</i>\n                                <b>'
              .concat(note.title, '</b>')
              .concat(note.content, '<a href="')
              .concat(note.link, '">')
              .concat(note.contentLink, '<a/>')
              .concat(
                note.ccontent,
                '\n                            </p>\n                        </div>'
              );
          })
          .join('')
      );
      $('#note'.concat(item.code)).html(n);
    })
    .catch(function(err) {
      return console.log(err);
    });
}

function getTags(tags) {
  if (!tags) return;
  var keys = ''.concat(
    tags
      .map(function(tag) {
        return '<div class="chip">'.concat(tag, '</div>');
      })
      .join('')
  );
  return keys;
} // This is the left click function 2018

function addCodenow(wcode) {
  wcode = '<span>'.concat(wcode, '</span>');

  if (confirm('Do you want to add this item to your order?')) {
    parent.addtocart(wcode);
  }
}
