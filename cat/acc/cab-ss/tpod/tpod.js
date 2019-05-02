//// Main js for catagories /////
headerFooter('../../../../');

window.onload = getPage();

function getPage() {
  fetch('./tpod.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      const item = data.information;
      setGIA2(item);
      setSpecs(item.specifications);
      setNotes('../../../../', item.notes);
      setImages(item);
    })
    .catch(function(err) {
      console.log(err);
    });
}

function setMainImage(info) {
  const main = '<div class="card card-panel"><div class="center"><span class="card-title ">Images</span></div>'.concat(
    exampleImages(info),
    '<img class="responsive-img materialboxed" src="',
    imageSRC(info.mainImage),
    '"></div>'
  );
  return main;
}

function setImages(info) {
  const images = '<div class="col s6 m6 l5">'.concat(
    info.baskets
      .map(function(basket) {
        return '<div class="col s12 m12 l6"><div id="imageCard'.concat(
          basket.code,
          '" class="card hoverable tooltipped" data-position="top" data-tooltip="Click to see width options and codes"><div  class="card-image waves-effect waves-block waves-light"> <img class="responsive-img activator" src="',
          imageSRC(basket.image),
          '"></div><div class="card-content activator open"><span><i class="material-icons activator">details</i></span>Hardware codes with <b>',
          basket.title,
          '</b> baskets </div> <div class="card-reveal"> <span class="card-title blue-grey-text text-darken-3">Codes: <i class="material-icons right">close</i></span>',
          getCollections(info, basket),
          '</div></div></div>'
        );
      })
      .join(''),
    '</div><div class="col s6 m6 l3">',
    setMainImage(info),
    '</div>'
  );
  $('#images').html(images);
  $(document).ready(function() {
    $('.materialboxed').materialbox();
  });
  $(document).ready(function() {
    $('.tooltipped').tooltip();
  });
}

function setSpecs(specs) {
  const spec =
    '<div class="card-panel grey lighten-3 bullet"><span class="card-title"><h4>Specifications</h4></span><div class="divider"></div><ul class="flow-text">' +
    li(specs) +
    '</ul></div><div id="notes"></div>';
  $('#spec').html(spec);
}

function li(list) {
  const lis = list
    .map(function(li) {
      return '<li><b>' + li.title + ': </b><br>' + li.content + '.</li>';
    })
    .join('');
  return lis;
}

function getCollections(info, basket) {
  if (!basket) return;
  const col = '<div class="collection"><h5 class="collection-item blue-grey-text text-darken-1">'.concat(
    basket.title,
    'basket width options</h5><ul>',
    info.widths
      .map(function(width) {
        const wcode = info.code + '-' + width + '-' + basket.code;
        const li =
          '<li class="collection-item">Code for ' +
          width +
          ' TBR<br>' +
          ordercodes(wcode) +
          '</li>';
        return li;
      })
      .join(''),
    '</ul></div>'
  );
  return col;
}

function exampleImages(info) {
  let icons = info.images
    .map(function(image) {
      return (
        '<div class="box-image"><img src="' +
        imageSRC(image.image) +
        '" class="materialboxed tooltipped" data-position="top" data-tooltip="click to enlarge" data-caption="' +
        image.title +
        '"></div>'
      );
    })
    .join('');
  return icons;
}
