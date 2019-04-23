function setOptions(res) {
  var _this = this;

  if (res === undefined) return '';
  var htmlrestictions = '<span class="card-title">\n                            <h4>Options</h4>\n                        </span>\n                        <div class="divider"></div>\n                        <div id="specli"><ul class="flow-text">'.concat(
    res
      .map(
        function (r) {
          _newArrowCheck(this, _this);

          return '<li><small><i  class="material-icons">create</i> - '.concat(
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


function optionSpecs(loc, items) {
  fetch(loc + '/json/options.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var res = filterItems(data['options'], items);
      $('#options').html(res);
    })
    .catch(function (err) {
      return console.log(err);
    });
}
