if (window.location !== window.parent.location) {
  window.load = parent.activatecat();
  window.load = setTimeout(function() {
    parent.activatecat();
  }, 2000);
}
