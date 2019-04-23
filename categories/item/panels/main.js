//// Main js for catagories /////
headerFooter(null);
window.onload = getPage();
info.cat = 'Shelves';
var catalog = document.getElementById('catalog');
function getPage() {
  fetch('./items.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (!info.code) {
        var tabs = data['sub-cats'];
        var html = tabs
          .map(function (t) {
            return cardWith(t);
          })
          .join('');
        console.log(catalog);

        if (edge === '') catalog.classList.add('grid');
        catalog.innerHTML = html;
        setGIA(info);
        return;
      } else {
        info.item = data.items.filter(function (item) {
          return item.code.toLowerCase() === code;
        })[0];
      }
      makeStructure(info);
    })
    .catch(function (err) {
      return console.log(err);
    });
}

function makeStructure(info) {
  setGIA(info);
  var structure =
    '<div class="col s12 m8"><div id="des"></div><div id="spec"></div><div id="notes"></div><div id="codes"></div></div><div id="images" class="col s12 m4">' +
    setMainImage(info.item) +
    '</div><div id="table" class="col s12"></div>';
  $('#catalog').html(structure);
  setSpecsND('../../..', info.item.specifications);
  $('#table').html(shTable(info));
  description(info.item.title, info.item.description);
  // $('#codes').html(setCode(info.item.code));
  setNotes('../../../', info.item.notes);
}
