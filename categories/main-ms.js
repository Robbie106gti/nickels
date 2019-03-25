//// Main js for catagories /////

if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
  window.onload = getSubs();
  document.getElementById('catalog').classList.remove('grid');
}
function _newArrowCheck(innerThis, boundThis) {
  if (innerThis !== boundThis) {
    throw new TypeError('Cannot instantiate an arrow function');
  }
}
var ua = window.navigator;
console.log(ua);
var edge = 'col s3';

function getSubs() {
  $.urlParam = function(name) {
    var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(
      window.location.href
    );

    if (results == null) {
      return null;
    } else {
      return decodeURI(results[1]) || 0;
    }
  }; // console.log(decodeURIComponent($.urlParam('cat')));
  // output: General Information

  var cat = $.urlParam('cat');
  setGI(cat);

  switch (cat) {
    case 'General Information':
      fetchGI(cat);
      break;

    case 'Accessories':
      fetchGI(cat);
      break;

    default:
      fetchCabinets(cat);
  }
}

function fetchCabinets(cat) {
  var _this = this;

  var catagory = cat.toLowerCase(); // console.log(catagory);

  fetch('../json/'.concat(catagory, '.json'))
    .then(
      function(response) {
        _newArrowCheck(this, _this);

        return response.json();
      }.bind(this)
    )
    .then(
      function(data) {
        var _this2 = this;

        _newArrowCheck(this, _this);

        console.log(data[cat]);
        data = data[cat];
        var html = ''.concat(
          data
            .map(
              function(cat) {
                _newArrowCheck(this, _this2);

                return cat.active === false ? null : cabinetCard(cat);
              }.bind(this)
            )
            .join('')
        );
        $('#catalog').html(html);
      }.bind(this)
    )
    .catch(
      function(err) {
        _newArrowCheck(this, _this);

        return console.log(err);
      }.bind(this)
    );
}

function cabinetCard(cat) {
  return '<div class="col s3"><div class="card medium'
    .concat(
      edge,
      '">\n  <div class="card-image waves-effect waves-block waves-light">\n      <img class="image20 activator" src="'
    )
    .concat(
      cat.image,
      '">\n  </div>\n  <div class="card-content">\n      <span class="card-title activator grey-text text-darken-4">'
    )
    .concat(
      cat.title,
      '<i class="material-icons right">more_vert</i></span>\n      '
    )
    .concat(
      getTags(cat.tags),
      '\n  </div>\n  <div class="card-reveal">\n      <span class="card-title grey-text text-darken-4">'
    )
    .concat(
      cat.title,
      '<i class="material-icons right">close</i></span>\n      '
    )
    .concat(getLinks(cat), '\n  </div>\n</div></div>\n');
}

function fetchGI(cat) {
  var _this3 = this;

  var catagory = cat.toLowerCase(); // console.log(catagory);

  fetch('../json/'.concat(catagory, '.json'))
    .then(
      function(response) {
        _newArrowCheck(this, _this3);

        return response.json();
      }.bind(this)
    )
    .then(
      function(data) {
        var _this4 = this;

        _newArrowCheck(this, _this3);

        // console.log(data['catalog']);
        data = data[cat];
        var html = ''.concat(
          data
            .map(
              function(cat) {
                _newArrowCheck(this, _this4);

                return switchCard(cat);
              }.bind(this)
            )
            .join('')
        );
        $('#catalog').html(html);
      }.bind(this)
    )
    .catch(
      function(err) {
        _newArrowCheck(this, _this3);

        return console.log(err);
      }.bind(this)
    );
}

function switchCard(cat) {
  var cardcontent = '';

  if (cat.attached.length === 1) {
    cardcontent = cardWithout(cat);
  } else {
    cardcontent = cardWith(cat);
  }

  return cardcontent;
}

function cardWith(cat) {
  var card = '<div class="col s3"><div class="card medium'
    .concat(
      edge,
      '">\n            <div class="card-image waves-effect waves-block waves-light">\n                <img class="image20 activator" src="'
    )
    .concat(
      cat.image,
      '">\n            </div>\n            <div class="card-content">\n                <span class="card-title activator grey-text text-darken-4">'
    )
    .concat(
      cat.title,
      '<i class="material-icons right">more_vert</i></span>\n                '
    )
    .concat(
      getTags(cat.tags),
      '\n            </div>\n            <div class="card-reveal">\n                <span class="card-title grey-text text-darken-4">'
    )
    .concat(
      cat.title,
      '<i class="material-icons right">close</i></span>\n                '
    )
    .concat(getLinks(cat), '\n            </div>\n        </div> </div>');
  return card;
}

function cardWithout(cat) {
  var card;

  if (cat.attached[0].sub === '') {
    card = '<div class="col s3"><div class="card '
      .concat(edge, '">\n                <a href="')
      .concat(
        cat.attached[0].link,
        '.html">\n                  <div class="card-image waves-effect waves-block waves-light">\n                      <img class="image20 activator" src="'
      )
      .concat(
        cat.image,
        '">\n                  </div>\n                  <div class="card-content">\n                      <span class="card-title activator grey-text text-darken-4">'
      )
      .concat(
        cat.title,
        '<i class="material-icons right">more_vert</i></span>\n                      '
      )
      .concat(
        getTags(cat.tags),
        '\n                  </div>\n                </a>\n              </div> </div>'
      );
  } else {
    card = '<div class="col s3"><div class="card medium'
      .concat(edge, '">\n                <a href="./item/')
      .concat(
        configLink(cat),
        '">\n                  <div class="card-image waves-effect waves-block waves-light">\n                      <img class="image20 activator" src="'
      )
      .concat(
        cat.image,
        '">\n                  </div>\n                  <div class="card-content">\n                      <span class="card-title activator grey-text text-darken-4">'
      )
      .concat(
        cat.title,
        '<i class="material-icons right">more_vert</i></span>\n                      '
      )
      .concat(
        getTags(cat.tags),
        '\n                  </div>\n                </a>\n              </div> </div>'
      );
  }

  return card;
}

function configLink(cat) {
  switch (cat.attached[0].code) {
    case 'NONE':
      return ''.concat(cat.attached[0].link, '.html');
      break;

    default:
      return ''
        .concat(cat.attached[0].link, '.html?code=')
        .concat(cat.code)
        .concat(cat.attached[0].sub);
  }
}

function setGI(title) {
  var cat = '<h1 id="topic">'.concat(title, '</h1>');
  $('#topic').html(cat);
}

function getLinks(cat) {
  var _this5 = this;

  if (!cat.attached) return;
  var keys = ''.concat(
    cat.attached
      .map(
        function(a) {
          _newArrowCheck(this, _this5);

          return formatLink(cat, a);
        }.bind(this)
      )
      .join('')
  );
  return keys;
}

function formatLink(cat, a) {
  var link = '';

  if (a.sub) {
    link = '<a href="./item/'
      .concat(a.link, '.html?code=')
      .concat(cat.code)
      .concat(a.sub, '">')
      .concat(a.title, '</a><br>');
  } else {
    link = '<a href="./item/'
      .concat(a.link, '.html?code=')
      .concat(cat.code)
      .concat(a.height, '">')
      .concat(a.height, ' Inch high</a><br>');
  }

  return link;
}

function getTags(tags) {
  var _this6 = this;

  if (!tags) return;
  var keys = ''.concat(
    tags
      .map(
        function(tag) {
          _newArrowCheck(this, _this6);

          return '<div class="chip">'.concat(tag, '</div>');
        }.bind(this)
      )
      .join('')
  );
  return keys;
}
