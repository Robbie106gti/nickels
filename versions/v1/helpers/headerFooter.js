function headerFooter(location) {
  var header = '<nav>'.concat(
    '<div class="nav-wrapper brown darken-3">',
    '<div class="whiteLine"></div>',
    '<ul class="brand-logo">',
    '<li><a href="/catalog/build/"><img class="imageLogo" src="/catalog/build/assets/logoNC.png" alt="Nickels Cabinets" /></a></li>',
    '<li><span class="headingLogo"><i class="material-icons">collections_bookmark</i> Catalog</span></li>',
    '<li class=""><a id="refresh" class="btn-small open brown-text hide"><i class="material-icons">refresh</i></a></li>',
    '<li><small id="prodline" class="headingLogo"></small></li>',
    '</ul>',
    '</div><a id="TopPage"></a></nav>'
  );
  document.getElementById('header').innerHTML = header;
  var footer = '<div id="dadjoke"></div>'.concat(
    '<footer class="page-footer brown darken-3">',
    '<div class="footer-copyright">',
    '<div class="container">',
    '© 2019 Copyright Nickels Cabinets',
    '<a class="grey-text text-lighten-4 right" href="/catalog/build/">Start Catalog</a>',
    '</div>',
    '</div>',
    '<a id="BottomPage"></a></footer>'
  );
  document.getElementById('footer').innerHTML = footer;

  setLine();
  var refreshBtn = document.getElementById('refresh');
  var myIframe = parent.document.getElementById('pgCatalog');
  var myIframe2 = parent.document.getElementById('nklcatalog');
  if (window.location !== window.parent.location)
    refreshBtn.classList.remove('hide');

  refreshBtn.onclick = function() {
    myIframe.src === null ? null : myIframe.contentWindow.location.reload(true);
    myIframe2.src === null
      ? null
      : myIframe2.contentWindow.location.reload(true);
  };
}
