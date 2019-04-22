function setSpecs(specs, page) {
  fetch('../../json/specifications.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var spec = data['specifications'].filter(function(el, i) {
        var t = specs.includes(el.id);
        var id;
        if (t === true) {
          id = el.id;
        } else {
          id = t;
        }
        return el.id === id;
      });
      var n = spec
        .map(function(n) {
          return '<li><b>' + n.title + '</b>: ' + n.content + '</li>';
        })
        .join('');
      n =
        '<ul class="flow-text"><li id="dim">' +
        setDim(page) +
        '</li>' +
        n +
        '</ul>';
      $('#specli').html(n);
    })
    .catch(function(err) {
      return console.log(err);
    });
  var s = specs
    .map(function(spec) {
      return '<li><b>' + spec.title + '</b>: ' + spec.content + '</li>';
    })
    .join('');
  return s;
}

function setSpecsND(loc, specs) {
  fetch(loc + '/json/specifications.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var spec = data['specifications'].filter(function(el, i) {
        var t = specs.includes(el.id);
        var id;
        if (t === true) {
          id = el.id;
        } else {
          id = t;
        }
        return el.id === id;
      });
      var n =
        '<div class="card-panel">' +
        spec
          .map(function(n) {
            return '<li><b>' + n.title + '</b>: ' + n.content + '</li>';
          })
          .join('') +
        '</div>';
      n = '<ul class="flow-text">' + n + '</ul>';
      $('#spec').html(n);
    })
    .catch(function(err) {
      return console.log(err);
    });
  var s = specs
    .map(function(spec) {
      return '<li><b>' + spec.title + '</b>: ' + spec.content + '</li>';
    })
    .join('');
  return s;
}

function setSpecsCol(item) {
  // console.log(item);
  var cardcol =
    '<div class="card-panel grey lighten-3 bullet"> <span class="card-title"><h4>Specifications</h4></span> <div class="divider"></div> <ul class="flow-text"><li style="list-style-type: none"><ul>';
  var licol = new Array();
  if (item.dimensions) {
    [
      { name: 'heights', title: 'Height' },
      { name: 'widths', title: 'Width' },
      { name: 'depths', title: 'Depth' },
      { name: 'thickness', title: 'Front' }
    ]
      .map(function(li) {
        return (
          '<li class="second">' +
          li.title +
          ': ' +
          item.dimensions[li.name] +
          '</li>'
        );
      })
      .join('');
  }
  licol += item.standards
    .map(function(st) {
      return '<li>' + st + '<li>';
    })
    .join('');
  var resopt = item.options
    ? '<div id="options">' + setOptions(item.options) + '</div>'
    : '' + item.restrictions
    ? '<div id="restrictions">' + setRestrictions(item.restrictions) + '</div>'
    : '';
  cardcol = cardcol + licol + resopt + '</ul></li></ul></div>';

  return cardcol;
}
