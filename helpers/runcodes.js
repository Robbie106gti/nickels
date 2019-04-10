if (window.location !== window.parent.location) {
  $(document).ready(function () {
    parent.activatecat();
  });
  $(window).bind('load', function () {
    setTimeout(function () {
      parent.activatecat();
    }, 2000);
  });
}
