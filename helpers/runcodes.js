if (window.location !== window.parent.location) {
  window.load = parent.activatecat();
  window.load = setTimeout(function() {
    parent.activatecat();
  }, 2000);
  $(document).ready(function() {
    $(window).ready(function() {
      parent.activatecat();
    });
  });
}
