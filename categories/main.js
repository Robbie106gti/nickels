//// Main js for catagories /////
headerFooter('../');
window.onload = getSubs();
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
  };

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
  var catagory = cat.toLowerCase();
  fetch('../node/json/'.concat(catagory, '.json'))
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      data = data[cat];
      if (info.active !== 'false') {
        data = data.filter(function(a) {
          return a.active;
        });
        window.location !== window.parent.location
          ? (data = data.filter(function(a) {
              return a.lines[pline];
            }))
          : '';
      }
      data.length === 0
        ? data.push({
            title: 'No items in this Category for ' + titleCase(pline),
            active: false,
            image: '',
            tags: ['none'],
            id: '0',
            code: 'ERROR',
            attached: [{ height: 'ERROR', link: 'error' }]
          })
        : '';
      var html = data
        .map(function(cat) {
          return cabinetCard(cat);
        })
        .join('');
      $('#catalog').html(html);
    })
    ['catch'](function(err) {
      return console.log(err);
    });
}

function fetchGI(cat) {
  var catagory = cat.toLowerCase();
  fetch('../json/'.concat(catagory, '.json'))
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // console.log(data['catalog']);
      data = data[cat];
      var html = ''.concat(
        data
          .map(function(cat) {
            return cat.active === false ? null : switchCard(cat);
          })
          .join('')
      );
      $('#catalog').html(html);
    })
    ['catch'](function(err) {
      return console.log(err);
    });
}

function setGI(title) {
  var cat = '<h1 id="topic">'.concat(title, '</h1>');
  $('#topic').html(cat);
}
