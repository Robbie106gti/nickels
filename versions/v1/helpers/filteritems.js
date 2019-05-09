function filterItems(data, items) {
  // console.log(data)
  return data.filter(function(el, i) {
    var t = items.includes(el.id);
    var id;
    if (t === true) {
      id = el.id;
    } else {
      id = t;
    }
    return el.id === id;
  });
}

function plinesFilterItems(array) {
  return array.filter(function(a) {
    return skipItem(a);
  });
}

function skipItem(item) {
  let bull = true;
  item.visable === false ? (bull = false) : '';
  item.active === false ? (bull = false) : '';
  if (item.lines) {
    item.lines[info.pline] === false ? (bull = false) : '';
  }
  if (!item.lines) {
    console.log('this item has no product lines: ' + item.title);
  }
  return bull;
}
