headerFooter('../../../../');
window.onload = getPage();
info.cat = 'Slide-Out Storage Rack';
function getPage() {
  fetch('./sor.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // console.log(data);
      setGIA2({ title: info.cat });
      if (info.code) {
        itemstructure(
          data.sors.filter(function(sor) {
            return sor.code === info.code;
          })[0]
        );
      } else {
        structure(data.items);
      }
    })
    .catch(function(err) {
      return console.log(err);
    });
}

function structure(items) {
  let catalog = document.getElementById('catalog');
  if (!info.edge) {
    catalog.classList.add('grid');
  }
  const html = items
    .map(function(item) {
      return cardWith(item);
    })
    .join('');
  catalog.innerHTML = html;
}

function itemstructure(item) {
  const html =
    '<div class="col s12 m8"><div id="des"></div><div id="spec"></div><div id="notes"></div><div id="codes"></div></div><div id="images" class="col s12 m4"></div><div class="col s4"><div id="table"></div><div id="itemcode" class="card-panel"></div></div>';
  document.getElementById('catalog').innerHTML = html;
  setGIA2({ title: info.cat, subTitle: item.title });
  description(item.title, item.description);
  setSpecsND('../../../../', item.specifications);
  setNotes('../../../../', item.notes);
  document.getElementById('images').innerHTML = setMainImage(item);
  const order = 'Add ' + item.title + ' to your order ' + ordercodes(item.code);
  document.getElementById('itemcode').innerHTML = order;
}
