headerFooter('../../../../');
window.onload = getPage();
info.cat = 'Slide-Out Storage Racks';
function getPage() {
  fetch('../../../../versions/v2/items/sor.json', { cache: 'reload' })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // console.log(data);
      let page = new Array();
      let items = new Object();
      switch (info.page) {
        case 'podnr':
          page = data.items.podnr;
          items = data.podnr;
          break;
        case 'tpods':
          page = data.items.tpods;
          items = data.tpods;
          break;
        case 'bpods':
          page = data.items.bpods;
          items = data.bpods;
          break;
        case 'ls':
          info.cat = 'Corner Solutions';
          page = data.items.ls;
          items = data.ls;
          break;
        case 'rgbs':
          info.cat = 'Recycle/Garbage Bins';
          page = data.items.rgbs;
          items = data.ls;
          break;
        case 'ros':
          info.cat = 'Roll-out shelves';
          page = data.items.ros;
          items = data.ros;
          break;
        default:
          page = data.items.sors;
          items = data.sors;
          break;
      }
      setGIA2({ title: info.cat });
      if (info.code) {
        itemstructure(
          items.filter(function(item) {
            return item.code === info.code;
          })[0]
        );
      } else {
        structure(page);
      }
    })
    .then(function() {
      lastCallCodes();
      $('.materialboxed').materialbox();
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
  document.getElementById('catalog').innerHTML = ''.concat(
    '<div class="col s12 m8">',
    '<div id="des"></div>',
    '<div id="div-sor" class="card-panel hide">',
    '<div id="spec"></div>',
    '<div id="options"></div>',
    '<div id="restrictions"></div>',
    '</div>',
    '<div id="notes"></div>',
    '<div id="codes"></div>',
    '</div>',
    '<div id="images" class="col s12 m4">',
    '</div><div class="col s4"><div id="table"></div><div id="itemcode" class="card-panel"></div></div>'
  );

  setGIA2({ title: info.cat, subTitle: item.title });
  description(item.title, item.description);
  setSpecsND('../../../../', item.specifications);
  setNotes('../../../../', item.notes);
  document.getElementById('images').innerHTML = setMainImage(item);
  ordercodesConvertion(item);
}

function ordercodesConvertion(item) {
  let codes = '';
  switch (info.page) {
    case 'podnr':
      codes = basicCode(item);
      break;
    case 'tpods':
      codes = codesWithHeights(item);
      break;
    case 'bpods':
      codes = codesLRSizes(item);
      break;
    case 'ls':
      codes = lemans(item);
      break;
    default:
      codes = basicCode(item);
      break;
  }
  document.getElementById('itemcode').innerHTML = codes;
}
function basicCode(item) {
  return 'Add ' + item.title + ' to your order ' + ordercodes(item.code);
}

function codesWithHeights(item) {
  return (
    '<ul>' +
    item.sizes
      .map(function(size) {
        const code = item.code.replace(item.cib, '') + size + item.cib;
        const ncode = {
          title: item.title + ' ' + size + '"',
          code: code
        };
        return '<li>' + basicCode(ncode) + '</li>';
      })
      .join('') +
    '</ul>'
  );
}

function codesLRSizes(item) {
  return (
    '<ul>' +
    item.lr
      .map(function(lr) {
        return item.sizes
          .map(function(size) {
            const ncode =
              item.constr[0] + lr.code + item.constr[1] + size + item.constr[2];
            const title =
              item.title + ' ' + lr.title + ' for ' + size + '" wide cabinets';
            return '<li>' + basicCode({ title: title, code: ncode }) + '</li>';
          })
          .join('');
      })
      .join('') +
    '</ul>'
  );
}

function lemans(item) {
  if (item.code === 'ls-mc' || item.code === 'ls-mc2') {
    return (
      '<ul>' +
      item.finish
        .map(function(fi) {
          const ncode = item.code + '-' + fi.code;
          const title = item.title + ' - ' + titleCase(fi.title);
          return '<li>' + basicCode({ title: title, code: ncode }) + '</li>';
        })
        .join('') +
      '</ul>'
    );
  }
  if (item.finish && item.lr && item.sizes) {
    return (
      '<h5>Hardware codes:</h5><table><tr><th>Finish</th><th>Cabinet width</th><th>Hinged</th><th>Ordercode</th></th>' +
      item.sizes
        .map(function(size) {
          return item.lr
            .map(function(lr) {
              return item.finish
                .map(function(fi) {
                  const ncode = item.code + lr.code + '-' + fi.code + size;
                  return (
                    '<tr>' +
                    makeTD(titleCase(fi.title)) +
                    makeTD(size + '"') +
                    makeTD(titleCase(lr.title)) +
                    makeTD(ordercodes(ncode)) +
                    '</tr>'
                  );
                })
                .join('');
            })
            .join('');
        })
        .join('') +
      '</table>'
    );
  } else {
    return basicCode(item);
  }
}
