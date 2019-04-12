var edge = '';
var ua = window.navigator.userAgent;
var msie = ua.indexOf('Edge/');

if (msie !== -1) {
  var edge = ua.split('Edge/');
  if (edge[1] < 16) {
    edge = 'col s3 m3 medium';
  }
}
if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
  edge = 'col s3 m3 medium';
}

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
var code = $.urlParam('code');

var info = {
  title: '',
  code: code,
  item: ''
};
