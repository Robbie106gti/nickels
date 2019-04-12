function setGI(page) {
  var topic =
    '<a href="../index.html?cat=${page.cat}" class="right"><i class="small material-icons">arrow_back</i> <span class="lift">Back</span></a><div id="actions"></div><div><h1 id="titleHeader">' +
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
