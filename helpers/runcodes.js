if (window.location !== window.parent.location) {
  window.load = setTimeout(function() {
    addOrdercodes();
  }, 2000);

  window.onchange = addOrdercodes();
}

function addOrdercodes() {
  console.log('add ordercodes');
  parent.activatecat();
}
