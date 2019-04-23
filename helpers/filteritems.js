function filterItems(data, items) {
  // console.log(data)
  return data.filter(function (el, i) {
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
