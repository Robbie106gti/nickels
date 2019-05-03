function setGI(page) {
  var topic =
    '<a href="./index.html?cat=' +
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
  document.getElementById('topic').innerHTML = topic;
}

function setGIN(page) {
  var topic =
    '<a href="../../index.html" class="right"><i class="small material-icons">arrow_back</i> <span class="lift">Back</span></a><div id="actions"></div><div><h1 id="titleHeader">' +
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
  document.getElementById('topic').innerHTML = topic;
}

function setGICol(page) {
  var link = !info.code ? '../../index.html' : './index.html#' + info.item.root;
  var topic = '<a href="'
    .concat(
      link,
      '" class="right"><i class="small material-icons">arrow_back</i> <span class="lift">Back</span></a><div><h1 id="titleHeader">'
    )
    .concat(titleCase(info.title), '</h1>')
    .concat(
      info.item ? '<h5>'.concat(info.item.title, '</h5>') : '',
      '</div><div id="ddwn"></div>'
    );
  document.getElementById('topic').innerHTML = topic;
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
  document.getElementById('topic').innerHTML = topic;
}

function setGIA2(obj) {
  let cat =
    '<a href="../index.html?cat=Accessories" class="right"><i class="small material-icons">arrow_back</i><span class="lift">Back</span></a></div>';
  cat += '<h1 id="topic">' + obj.title + '</h1>';
  if (obj.subTitle) {
    cat += '<h5>' + obj.subTitle + '</h5>';
  }
  cat += '<div id="actions"></div>';
  document.getElementById('topic').innerHTML = cat;
  obj.description
    ? (document.getElementById('des').innerHTML = obj.description)
    : '';
}
