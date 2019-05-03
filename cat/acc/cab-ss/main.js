//// Main js for catagories /////
headerFooter('../../../');
window.onload = getPage();
info.cat = 'Cabinet Storage Solutions';
var catalog = document.getElementById('catalog');
function getPage() {
  fetch('./items.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (!info.code) {
        var tabs = data['sub-cats'];
        var html = tabs
          .map(function(t) {
            if (info.active) {
              return t.active ? cardWith(t) : '';
            } else {
              return cardWith(t);
            }
          })
          .join('');
        // console.log(catalog);

        if (edge === '') catalog.classList.add('grid');
        catalog.innerHTML = html;
        setGIA(info);
        return;
      } else {
        info.item = data.items.filter(function(item) {
          return item.code.toLowerCase() === code;
        })[0];
      }
      makeStructure(info);
    })
    .catch(function(err) {
      return console.log(err);
    });
}

function makeStructure(info) {
  setGIA(info);
  var structure =
    '<div class="col s12 m8"><div id="des"></div><div id="spec"></div><div id="notes"></div><div id="codes"></div></div><div id="images" class="col s12 m4">' +
    setMainImage(info.item) +
    '</div><div id="table" class="col s4"></div>';
  $('#catalog').html(structure);
  setSpecsND('../../..', info.item.specifications);
  if (info.item.options) optionSpecs('../../..', info.item.options);
  if (info.item.restrictions)
    restrictionsSpecs('../../..', info.item.restrictions);
  $('#table').html('<div class="card-panel">' + simpleTable(info) + '</div>');
  description(info.item.title, info.item.description);
  // $('#codes').html(setCode(info.item.code));
  setNotes('../../../', info.item.notes);
}
