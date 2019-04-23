function setRestrictions(res) {
  var _this = this;

  if (res === undefined) return '';
  var htmlrestictions = '<span class="card-title">\n                            <h4>Restrictions</h4>\n                        </span>\n                        <div class="divider"></div>\n                        <div id="specli"><ul class="flow-text">'.concat(
    res
      .map(
        function (r) {
          _newArrowCheck(this, _this);

          return '<li><small><i  class="material-icons">notifications</i> - '.concat(
            r,
            '</small></li>'
          );
        }.bind(this)
      )
      .join(''),
    '</ul></div>'
  );
  return htmlrestictions;
}

function setSpecsND(loc, items) {
  fetch(loc + '/json/restrictions.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var res = filterItems(data['restrictions'], items);
      $('#rest').html(res);
    })
    .catch(function (err) {
      return console.log(err);
    });
}
