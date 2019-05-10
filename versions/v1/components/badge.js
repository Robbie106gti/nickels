function badge(nw, nr) {
  const badge = '<span class="' + nw + ' badge">' + nr + '</span>';
  return badge;
}

function plineBadge() {
  if (info.active !== false) {
    return '';
  }
  let color;
  switch (info.pline) {
    case 'cornerstone':
      color = 'red';
      break;
    case 'lighthouse':
      color = 'yellow';
      break;
    case 'custom':
      color = 'brown';
      break;
    default:
      color = 'blue';
      return;
  }
  const badge =
    '<span class="new ' +
    color +
    ' badge" data-badge-caption="' +
    info.pline +
    '">Not in</span>';
  return badge;
}
