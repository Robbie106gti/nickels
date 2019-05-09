//// Main js for entry-point /////
headerFooter('./');

window.onload = getCatalog();

function getCatalog() {
  fetch('./versions/v1/json/catalog.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // console.log(data['catalog']);
      data = data['catalog'];

      var html = ''.concat(
        data
          .map(function(cat) {
            if (skipItem(cat) === false) {
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
