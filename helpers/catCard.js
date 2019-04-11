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

function cardMenu(cat) {
  return '\n                <div class="card '
    .concat(edge, '"><a href="')
    .concat(
      cat.link,
      '">\n                    <div class="card-image waves-effect waves-block waves-light">\n                        <img class="image20 activator" src="'
    )
    .concat(
      cat.image,
      '">\n                    </div>\n                    <div class="card-content">\n                        <span class="card-title activator grey-text text-darken-4">'
    )
    .concat(cat.title, '</span>\n                        ')
    .concat(
      getTags(cat.tags),
      '\n                    </div></a>\n                </div>\n                '
    );
}

function cabinetCard(cat) {
  return '<div class="card '
    .concat(
      edge,
      '">\n  <div class="card-image waves-effect waves-block waves-light">\n      <img class="image20 activator" src="'
    )
    .concat(
      cat.image,
      '">\n  </div>\n  <div class="card-content activator">\n      <span class="card-title grey-text text-darken-4">'
    )
    .concat(
      cat.title,
      '<i class="material-icons right">more_vert</i></span>\n      '
    )
    .concat(
      getTags(cat.tags),
      '\n  </div>\n  <div class="card-reveal">\n      <span class="card-title grey-text text-darken-4">'
    )
    .concat(
      cat.title,
      '<i class="material-icons right">close</i></span>\n      '
    )
    .concat(getLinks(cat), '\n  </div>\n</div>\n');
}

function switchCard(cat) {
  var cardcontent = '';

  if (cat.attached.length === 1) {
    cardcontent = cardNoreveal(cat);
  } else {
    cardcontent = cardReveal(cat);
  }

  return cardcontent;
}

function cardReveal(cat) {
  var card = '<div class="card '
    .concat(
      edge,
      '">\n            <div class="card-image waves-effect waves-block waves-light">\n                <img class="image20 activator" src="'
    )
    .concat(
      cat.image,
      '">\n            </div>\n            <div class="card-content">\n                <span class="card-title activator grey-text text-darken-4">'
    )
    .concat(
      cat.title,
      '<i class="material-icons right">more_vert</i></span>\n                '
    )
    .concat(
      getTags(cat.tags),
      '\n            </div>\n            <div class="card-reveal">\n                <span class="card-title grey-text text-darken-4">'
    )
    .concat(
      cat.title,
      '<i class="material-icons right">close</i></span>\n                '
    )
    .concat(getLinks(cat), '\n            </div>\n        </div>');
  return card;
}

function cardNoreveal(cat) {
  var card;

  if (cat.attached[0].sub === '') {
    card = '<div class="card '
      .concat(edge, '">\n                <a href="')
      .concat(
        cat.attached[0].link,
        '.html">\n                  <div class="card-image waves-effect waves-block waves-light">\n                      <img class="image20 " src="'
      )
      .concat(
        cat.image,
        '">\n                  </div>\n                  <div class="card-content">\n                      <span class="card-title grey-text text-darken-4">'
      )
      .concat(
        cat.title,
        '<i class="material-icons right">more_vert</i></span>\n                      '
      )
      .concat(
        getTags(cat.tags),
        '\n                  </div>\n                </a>\n              </div>'
      );
  } else {
    card = '<div class="card '
      .concat(edge, '">\n                <a href="./item/')
      .concat(
        configLink(cat),
        '">\n                  <div class="card-image waves-effect waves-block waves-light">\n                      <img class="image20" src="'
      )
      .concat(
        cat.image,
        '">\n                  </div>\n                  <div class="card-content">\n                      <span class="card-title grey-text text-darken-4">'
      )
      .concat(
        cat.title,
        '<i class="material-icons right">more_vert</i></span>\n                      '
      )
      .concat(
        getTags(cat.tags),
        '\n                  </div>\n                </a>\n              </div>'
      );
  }

  return card;
}
