if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf('MSIE ');
  alert(
    'Our appologies it seems like you are using Internet Explorer, your experiance will be worse using this browser and not all information can be garantied. Would you please switch to Chrome/Edge/Firefox/Safari or Opera.'
  );
}
