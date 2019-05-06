//// Main js for catagories /////
headerFooter('../');
window.onload = getSubs();
function getSubs() {
  var cat = $.urlParam('cat');
  setGI(cat);

  switch (info.wcat) {
    case 'General Information':
      fetchGI(info.wcat);
      break;

    case 'Accessories':
      fetchGI(info.wcat);
      break;

    default:
      fetchCabinets(info.wcat);
  }
}

function fetchCabinets(cat) {
  var catagory = cat.toLowerCase();
  fetch('../versions/v1/json/'.concat(catagory, '.json'))
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      data = data[cat];
      if (info.active !== 'false') {
        data = data.filter(function (a) {
          return a.active;
        });
        window.location !== window.parent.location
          ? (data = data.filter(function (a) {
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
        .map(function (cat) {
          return cabinetCard(cat);
        })
        .join('');
      $('#catalog').html(html);
    })
  ['catch'](function (err) {
    return console.log(err);
  });
}

function fetchGI(cat) {
  var catagory = cat.toLowerCase();
  fetch('../versions/v1/json/'.concat(catagory, '.json'))
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data['catalog']);
      data = data[cat];
      var html = ''.concat(
        data
          .map(function (cat) {
            return cat.active === false ? null : switchCard(cat);
          })
          .join('')
      );
      $('#catalog').html(html);
    })
  ['catch'](function (err) {
    return console.log(err);
  });
}

function setGI(title) {
  var cat = '<h1 id="topic">'.concat(title, '</h1>');
  $('#topic').html(cat);
}
