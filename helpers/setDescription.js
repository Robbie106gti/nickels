function setDes(item) {
  var des = '\n  <div class="card-panel  blue-grey darken-1 white-text">\n    <span class="card-title">\n      <h4>Description</h4>\n    </span>\n    <div class="divider"></div>\n    <span id="des" class="flow-text">\n    '.concat(
    item.description,
    '\n    </span>\n  </div>'
  );
  item.description ? $('#des').html(des) : null;
}
