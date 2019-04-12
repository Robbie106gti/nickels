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

/* function setSpecsCol(item) {
  var spec2 =
    '<div class="card-panel grey lighten-3 bullet"><span class="card-title"><h4>Specifications</h4></span><div class="divider"></div><ul class="flow-text"><li style="list-style-type: none"><ul><li class="second"><i class="material-icons">tune</i> Height: ' +
    item.dimensions.heights +
    '</li><li class="second"><i class="material-icons">tune</i> Width: ' +
    item.dimensions.widths +
    '</li><li class="second"><i class="material-icons">tune</i> Depth: ' +
    item.dimensions.depths +
    '</li><li class="second"><i class="material-icons">tune</i> Front: ' +
    item.dimensions.thickness +
    '</li></ul></li>' +
    item.standards
      .map(function(st) {
        return '<li  style="list-style-type: none">' + st + '</li>';
      })
      .join('') +
    '</ul>' +
    item.options
      ? '<div id="options">' + setOptions(item.options) + '</div>'
      : '' + item.restrictions
      ? '<div id="restrictions">' +
        setRestrictions(item.restrictions) +
        '</div>'
      : '' + '</div></div>';
  return spec2;
} */

function setSpecsCol(item) {
  // console.log(item);
  var cardcol =
    '<div class="card-panel grey lighten-3 bullet"> <span class="card-title"><h4>Specifications</h4></span> <div class="divider"></div> <ul class="flow-text"><li style="list-style-type: none"><ul>';
  var licol = [
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
