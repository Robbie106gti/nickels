function cardWith(cat) {
  const dactive = cat.active ? '' : ' red';
  const temp = cat.template ? template(cat) : '?code=' + cat.code;
  var image = cat.image ? cat.image : cat.images[0].image;
  var card = '<div class="card '.concat(
    dactive,
    edge,
    '"><div class="card-image waves-effect waves-block waves-light"><a href="',
    temp,
    '"><img class="responsive-img" src="',
    imageSRC(image),
    '"></a></div><div class="card-content"><a href="',
    temp,
    '"><span class="card-title grey-text text-darken-4">',
    titleCase(cat.title),
    '</span>',
    getTags(cat.tags),
    '</a></div></div>'
  );
  return card;
}

function template(cat) {
  if (cat.template === cat.code) {
    return cat.template;
  }
  if (cat.template !== cat.code) {
    return cat.template + '/index.html?page=' + cat.code;
  }
}

function cardMenu(cat) {
  return '<div class="card '
    .concat(edge, '"><a href="')
    .concat(
      cat.link,
      '"><div class="card-image waves-effect waves-block waves-light"><img class="image20 activator" src="'
    )
    .concat(
      imageSRC(cat.image),
      '"></div><div class="card-content"><span class="card-title activator grey-text text-darken-4">'
    )
    .concat(cat.title, '</span>')
    .concat(getTags(cat.tags), '</div></a></div>');
}

function cabinetCard(cat) {
  const dactive = cat.active ? '' : ' red';
  return '<div class="card '
    .concat(
      edge,
      dactive,
      '"><div class="card-image waves-effect waves-block waves-light"><img class="image20 activator" src="'
    )
    .concat(
      imageSRC(cat.image),
      '"></div><div class="card-content"><span class="card-title grey-text text-darken-4 activator">'
    )
    .concat(cat.title, '<i class="material-icons right">more_vert</i></span>')
    .concat(
      getTags(cat.tags),
      '</div><div class="card-reveal"><span class="card-title grey-text text-darken-4">'
    )
    .concat(cat.title, '<i class="material-icons right">close</i></span>')
    .concat(getLinks(cat), '</div>\n</div>\n');
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
      '"><div class="card-image waves-effect waves-block waves-light"><img class="image20 activator" src="'
    )
    .concat(
      imageSRC(cat.image),
      '"></div><div class="card-content"><span class="card-title activator grey-text text-darken-4">'
    )
    .concat(cat.title, '<i class="material-icons right">more_vert</i></span>')
    .concat(
      getTags(cat.tags),
      '</div><div class="card-reveal"><span class="card-title grey-text text-darken-4">'
    )
    .concat(cat.title, '<i class="material-icons right">close</i></span>')
    .concat(getLinks(cat), '</div></div>');
  return card;
}

function cardNoreveal(cat) {
  var card;

  if (cat.attached[0].sub === '') {
    var card = '<div class="card '
      .concat(edge, '"><a href="')
      .concat(
        cat.attached[0].link,
        '.html"><div class="card-image waves-effect waves-block waves-light"><img class="image20 " src="'
      )
      .concat(
        imageSRC(cat.image),
        '"></div><div class="card-content"><span class="card-title grey-text text-darken-4">'
      )
      .concat(cat.title, '<i class="material-icons right">more_vert</i></span>')
      .concat(getTags(cat.tags), '</div></a></div>');
  } else {
    card = '<div class="card '
      .concat(edge, '"><a href="./')
      .concat(
        configLink(cat),
        '"><div class="card-image waves-effect waves-block waves-light"><img class="image20" src="'
      )
      .concat(
        imageSRC(cat.image),
        '"></div><div class="card-content"><span class="card-title grey-text text-darken-4">'
      )
      .concat(cat.title, '<i class="material-icons right">more_vert</i></span>')
      .concat(getTags(cat.tags), '</div></a></div>');
  }

  return card;
}
