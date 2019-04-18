$.urlParam = function(name) {
  var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(
    window.location.href
  );
  if (results == null) {
    return null;
  } else {
    return decodeURI(results[1]) || 0;
  }
};

var pline = 'custom';
if (window.location !== window.parent.location) {
  pline = parent.document.getElementById('pline').innerText.toLocaleLowerCase();
  window.load = setPline();
}

var code = $.urlParam('code') || null;
var act = $.urlParam('act') || true;
var page = $.urlParam('page') || null;
var witem = $.urlParam('item') || null;
var wpline = $.urlParam('pline') || null;
var wcat = $.urlParam('cat') || null;
var host = window.location.protocol + window.location.host;
var pth = window.location.pathname;
var hash = window.location.hash;

var info = {
  title: null,
  code: code,
  item: null,
  active: act,
  pline: pline,
  page: page,
  witem: witem,
  wcat: wcat,
  host: host,
  pth: pth,
  hash: hash
};

console.log(info);

function setPline() {
  pline = parent.document.getElementById('pline').innerText.toLocaleLowerCase();
}

function setLine() {
  document.getElementById('prodline').innerHTML = '- ' + info.pline;
}
