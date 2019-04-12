function getLinks(cat) {
  if (!cat.attached) return;
  var keys = ''.concat(
    cat.attached
      .map(function(a) {
        return formatLink(cat, a);
      })
      .join('')
  );
  return keys;
}

function formatLink(cat, a) {
  var link = '';

  if (a.sub) {
    link = '<a href="./item/'
      .concat(a.link, '.html?code=')
      .concat(cat.code)
      .concat(a.sub, '">')
      .concat(a.title, '</a><br>');
  } else {
    link = '<a href="./item/'
      .concat(a.link, '.html?code=')
      .concat(cat.code)
      .concat(a.height, '">')
      .concat(a.height, ' Inch high</a><br>');
  }

  return link;
}

function configLink(cat) {
  switch (cat.attached[0].code) {
    case 'NONE':
      return ''.concat(cat.attached[0].link, '.html');
      break;

    default:
      return ''
        .concat(cat.attached[0].link, '.html?code=')
        .concat(cat.code)
        .concat(cat.attached[0].sub);
  }
}
