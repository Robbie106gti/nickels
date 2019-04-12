//// Main js for entry-point /////
headerFooter('./');

window.onload = getCatalog();

function getCatalog() {
  fetch('./json/catalog.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // console.log(data['catalog']);
      data = data['catalog'];
      var html = ''.concat(
        data
          .map(function(cat) {
            if (cat.visable === false) {
              return '';
            }
            var html = cardMenu(cat);
            return html;
          })
          .join('')
      );
      $('#catalog').html(html);
    })
    ['catch'](function(err) {
      return console.log(err);
    });
}
