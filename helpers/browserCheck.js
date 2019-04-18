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
