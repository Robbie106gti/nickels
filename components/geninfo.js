function setGI(page) {
  var topic =
    '<a href="../index.html?cat=' +
    page.cat +
    '" class="right"><i class="small material-icons">arrow_back</i> <span class="lift">Back</span></a><div id="actions"></div><div><h1 id="titleHeader">' +
    page.cat +
    '</h1><h5 id="subHeader">' +
    page.root +
    '__' +
    page.height +
    ' : ' +
    page.title +
    ' ' +
    page.height +
    '" high</h5></div>';
  $('#topic').html(topic);
}

function setGICol(page) {
  var link = !info.code
    ? '../../../catalog.html'
    : './index.html#' + info.item.root;
  var topic = '\n        <a href="'
    .concat(
      link,
      '" class="right">\n          <i class="small material-icons">arrow_back</i> <span class="lift">Back</span>\n        </a>\n        <div>\n            <h1 id="titleHeader">'
    )
    .concat(titleCase(info.title), '</h1>\n            ')
    .concat(
      info.item ? '<h5>'.concat(info.item.title, '</h5>') : '',
      '\n        </div>\n        <div id="ddwn"></div>\n        '
    );
  $('#topic').html(topic);
}

function setGIA(page) {
  var giaTitle = page.item
    ? '<h5 id="subHeader">'.concat(page.item.title, '</h5>')
    : '';
  var giaLink = page.item ? './' : '../../index.html?cat=Accessories';
  var topic =
    '<a href="' +
    giaLink +
    '" class="right"><i class="small material-icons">arrow_back</i> <span class="lift">Back</span></a><div id="actions"></div><div><h1 id="titleHeader">' +
    page.cat +
    '</h1>' +
    giaTitle +
    '</div>';
  $('#topic').html(topic);
}
