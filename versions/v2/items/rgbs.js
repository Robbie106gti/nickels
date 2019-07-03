//// Main js for catagories /////
headerFooter('../../../../');

window.onload = getPage();

function getPage() {
  fetch('../../../../versions/v2/items/rgbs.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let information = null;
      let items = null;
      switch (info.type) {
        case 'wood':
          information = data.information.wood;
          items = data.rgb.wood;
          break;
        case 'metal':
          information = data.information.metal;
          items = data.rgb.metal;
          break;
        default:
          information = data.information.metal;
          items = data.rgb.metal;
          break;
      }
      setGIA2(information);
      setSpecs(information);
      setImages(information);
      setCode(items);
    }).then(function () {
      lastCallCodes();
      $('.materialboxed').materialbox();
    })
    .catch(function (err) {
      console.log(err);
    });
}

function setImages(info) {
  let style = '';
  if ($.urlParam('code')) {
    style = 'inactive';
  }
  const images = info.imageCards
    .map(function (image) {
      return '<div class="col s6 m3 l3"><div id="imageCard'.concat(
        image.id,
        '" class="card hoverable medium',
        style,
        '"><div class="card-image waves-effect waves-block waves-light"><img class="responsive-img activator" src="',
        imageSRC(image.image),
        '"></div><div class="card-content activator open"><span><i class="material-icons activator">details</i></span>',
        getTags(image.tags),
        '</div><div class="card-reveal"><span class="card-title blue-grey-text text-darken-3">Codes: <i class="material-icons right">close</i></span>',
        getCollections(info, image.links),
        '</div></div></div>'
      );
    })
    .join('');
  $('#images').html(images);
}

function setSpecs(info) {
  const spec = info.specifications
    .map(function (spec) {
      return '<div class="card-panel grey lighten-3 bullet"><span class="card-title"><h4>'.concat(
        spec.title,
        '</h4>            </span><div class="divider"></div><ul class="flow-text">',
        li(spec.items),
        '</ul></div><div id="notes"></div>'
      );
    })
    .join('');
  $('#spec').html(spec);
}

function li(list) {
  const lis = list
    .map(function (li) {
      return '<li>' + li.content + '</li>';
    })
    .join('');
  return lis;
}

function setCode(data) {
  if ($.urlParam('code') && data) {
    let id = $.urlParam('code');
    let card = data.filter(function (el) {
      return el.title == id;
    });
    let cardId = 'imageCard' + card[0].cardId;
    document.getElementById(cardId).classList.remove('inactive');
    document.getElementById(card[0].title).className += ' active';
    const code = card
      .map(function (spec) {
        return '<div class="card horizontal blue-grey lighten-5"><div class="detail-card"><span><img class="detail-image materialboxed" src="'.concat(
          imageSRC(spec.image),
          '"></span><span><img class="detail-image materialboxed" src="',
          imageSRC(spec.image2),
          '"></span></div><div class="card-content"><div class="collection"><h5 class="collection-item blue-grey-text text-darken-1">',
          spec.title,
          '</h5>',
          makeSpec(spec.specifications),
          '<div class="collection-item blue-grey-text text-darken-4"><b><ul><li>Code</b>: ',
          ordercodes(spec.title),
          '</span></li></ul></div></div></div><a href="index.html"><i id="close" class="close material-icons">close</i></a></div>'
        );
      })
      .join('');
    $('#code').html(code);
  }
}

function getLinks(tags) {
  if (!tags) return;
  const keys = tags
    .map(function (a) {
      return (
        '<a id="' + a.title + '" href="' + a.link + '">' + a.title + '</a><br>'
      );
    })
    .join('');
  return keys;
}

function getCollections(info, links) {
  if (!links) return;
  const col = info.catagories
    .map(function (cat) {
      return (
        '<div class="collection"><h5 class="collection-item blue-grey-text text-darken-1">' +
        cat.title +
        '</h5>' +
        makeLink(cat, links) +
        '</div>'
      );
    })
    .join('');
  return col;
}

function makeLink(catagory, links) {
  if (!links) return;
  let filteredLinks = links.filter(function (el) {
    return el.cat == catagory.id;
  });
  const linkArray = filteredLinks
    .map(function (link) {
      return (
        '<a id="' +
        link.link +
        '" href="?code=' +
        link.link +
        '&type=' +
        info.type +
        '" class="collection-item deep-orange-text text-darken-4">' +
        link.title +
        ' - ' +
        link.link +
        '</a>'
      );
    })
    .join('');
  return linkArray;
}

function makeSpec(items) {
  const item = items
    .map(function (i) {
      return (
        '<div class="collection-item blue-grey-text text-darken-4"><b>' +
        i.title +
        '</b>:  <code>' +
        i.content +
        '</code></div>'
      );
    })
    .join('');
  return item;
}
