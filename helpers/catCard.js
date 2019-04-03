function cardWith(cat) {
  var card = '\n  <div class="card '
    .concat(
      edge,
      '">\n    <div class="card-image waves-effect waves-block waves-light"><a href="?code='
    )
    .concat(cat.code, '">\n      <img class="responsive-img" src="')
    .concat(
      cat.image,
      '">\n    </a></div>\n    <div class="card-content">\n      <a href="?code='
    )
    .concat(
      cat.code,
      '">\n        <span class="card-title grey-text text-darken-4">'
    )
    .concat(titleCase(cat.title), '</span>\n        ')
    .concat(getTags(cat.tags), '\n      </a>\n    </div>\n  </div>');
  return card;
}
