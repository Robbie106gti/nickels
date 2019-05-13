if (window.location !== window.parent.location) {
  addOrdercodes();
  // window.onchange = addOrdercodes();
}

function addOrdercodes() {
  // console.log('add ordercodes');
  parent.activatecat();
}

function lastCallCodes() {
  if (window.location !== window.parent.location) {
    addOrdercodes();
    // window.onchange = addOrdercodes();
  }
}
