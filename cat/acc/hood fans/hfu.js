//// Main js for catagories /////
headerFooter('../../../');

window.onload = getPage();

function getPage() {
  const code = info.code;
  const page = info.page;

  fetch('./hfu.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      setGI(data.information, code);
      if (!code && !page) {
        const d = document.getElementById('catalog');
        !info.edge ? (d.className += ' grid') : '';
        // console.log(info);
        const html = data.items
          .map(function (cat) {
            return cardWith(cat);
          })
          .join('');
        $('#catalog').html(html);
      } else {
        makeLayout();
        let item = data.items.filter(function (item) {
          return item.code === code.toUpperCase();
        });
        item = item[0];
        // console.log(item);
        item.description === ''
          ? ''
          : description(item.title, item.description);
        $('#subtitle').html(item.title);
        setSpecs(item);
        plainNotes(item.notes);
        setImages(item);
        setCodes(item);
      }
    }).then(function () {
      lastCallCodes();
      $('.materialboxed').materialbox();
    })
    .catch(function (err) {
      console.log(err);
    });
}

function makeLayout() {
  let html =
    '<div class="col s12 m8"><div id="des"></div><div id="spec"></div><div id="notes"></div><div id="codes"></div></div><div id="images" class="col s12 m4"></div>';
  $('#catalog').html(html);
}

function setGI(information, code) {
  code = !code ? '../../index.html?cat=Accessories' : './index.html';
  const cat =
    '<a href="' +
    code +
    '" class="right"><i class="small material-icons">arrow_back</i> <span class="lift">Back</span></a><h1 id="topic">' +
    information.title +
    '</h1><h5 id="subtitle">' +
    information.subTitle +
    '</h5><div id="actions"></div>';
  $('#topic').html(cat);
}

function setSpecs(item) {
  const spec =
    '<div class="card-panel grey lighten-3 bullet"><span class="card-title"><h4>Specifications</h4></span><div class="divider"></div><ul class="flow-text">' +
    item.standards
      .map(function (li) {
        return (
          '<li>' +
          (li.link ? '<a href="' + li.link + '">' : '') +
          '<b>' +
          li.title +
          ': </b><br>' +
          li.content +
          (li.link ? '</a>' : '') +
          '</li>'
        );
      })
      .join('') +
    '</ul></div>';
  $('#spec').html(spec);
}

function exampleImages(item) {
  let icons = item.images
    .map(function (image) {
      return (
        '<div class="box-image">' +
        '<img src="' +
        imageSRC(image.image) +
        '" class="materialboxed tooltipped" data-position="top" data-tooltip="click to enlarge ' +
        image.title +
        '" data-caption="' +
        image.title +
        '"></div>'
      );
    })
    .join('');
  return icons;
}

function exampleListImages(item) {
  let icons =
    '<table class="bordered striped highlight"><theader><tr><th>Images <small>(click to enlarge)</small></th><th>Title</th></tr></theader><tbody>' +
    item.images
      .map(function (image) {
        return (
          '<tr><td><img src="' +
          imageSRC(image.image) +
          '" alt="' +
          image.title +
          '" class="materialboxed" width="200px" data-position="top" data-tooltip="click to enlarge ' +
          image.title +
          '" data-caption="' +
          image.title +
          '"></td><td>' +
          image.title +
          '</td>'
        );
      })
      .join('') +
    '</tbody></table>';
  return icons;
}

function setImages(item) {
  const main =
    '<div class="card card-panel"><div class="center"><span class="card-title ">Images</span></div><img class="responsive-img materialboxed tooltipped" data-position="top" data-tooltip="click to enlarge ' +
    item.imageTitle +
    '" data-caption="' +
    item.imageTitle +
    '" src="' +
    imageSRC(item.image) +
    '">' +
    exampleListImages(item) +
    '</div>';
  $('#images').html(main);
  $(document).ready(function () {
    setTimeout(function () {
      $('.materialboxed').materialbox();
    }, 2000);
  });
}

function setCodes(item) {
  const htmlcodes = '<div class="card-panel grey lighten-3">'.concat(
    '<table class="bordered striped highlight">',
    '<theader><tr><th>Codes</th><th>Description (width - depth - height)</th><th>Recommended Hood fan</th></tr></theader><tbody>',
    item.widths
      .map(function (width) {
        return item.heights
          .map(function (height) {
            const wcode = item.code + width + height;
            return (
              '<tr><td>' +
              ordercodes(wcode) +
              '</td><td>' +
              item.title +
              ' - (w) ' +
              width +
              '" x (d) ' +
              item.depth +
              '" x (h) ' +
              height +
              '"</td><td>' +
              (item.versions[width].length
                ? item.versions[width]
                  .map(function (hood) {
                    return (
                      '<a href="' +
                      hood.link +
                      '" rel="noopener noreferrer" target="_blank">' +
                      hood.title +
                      '</a>'
                    );
                  })
                  .join(' / ')
                : '<a href="' +
                item.versions[width].link +
                '" rel="noopener noreferrer" target="_blank">' +
                item.versions[width].title +
                '</a>' +
                '</td></tr>')
            );
          })
          .join('');
      })
      .join(''),
    '</tbody></table></div>'
  );
  $('#codes').html(htmlcodes);
}
