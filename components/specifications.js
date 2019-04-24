function setSpecs(specs, page) {
  fetch('../../json/specifications.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var spec = filterItems(data['specifications'], specs);
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
      var spec = filterItems(data['specifications'], specs);
      var n = spec
        .map(function(n) {
          return styleSpec(n);
        })
        .join('');
      n =
        '<div class="card-panel"><ul class="flow-text">' +
        n +
        '</ul><div id="options"></div><div id="restrictions"></div></div>';
      $('#spec').html(n);
    })
    .catch(function(err) {
      return console.log(err);
    });
}

function styleSpec(n) {
  var sli;
  if (!n.type) return '<li><b>' + n.title + '</b>: ' + n.content + '</li>';
  switch (n.type) {
    case 'list':
      sli = makelist(n);
      break;
    case 'table':
      sli = maketablespec(n);
      break;
    default:
      sli = '<li><b>' + n.title + '</b>: ' + n.content + '</li>';
      break;
  }
  return sli;
}

function makelist(n) {
  return '<ul>'.concat('<b>', n.title, ':</b>').concat(
    n.list
      .map(function(i) {
        return '<li class="second">'.concat(i, '</li>');
      })
      .join(''),
    '</ul>'
  );
}

function maketablespec(n) {
  let dh = false;
  const table = '<table class="striped highlight"><thead>'
    .concat(
      '<tr>',
      n.table.headers
        .map(function(rw) {
          if (rw.cw) dh = true;
          return '<th colspan="'.concat(
            rw.cw ? rw.cw : 1,
            '">',
            rw.title,
            '</th>'
          );
        })
        .join(''),
      dh ? '</tr>' + secondHd(n) : '',
      '</thead><tbody>'
    )
    .concat(
      n.table.rows
        .map(function(rw) {
          return '<tr>'.concat(
            makeTD(rw.title),
            makeTD(rw.wvgm),
            makeTD(rw.hvgm),
            makeTD(rw.whgm),
            makeTD(rw.hhgm),
            '</tr>'
          );
        })
        .join(''),
      '</tbody></table>'
    )
    .concat(
      '',
      n.astrixs.map(function(st) {
        return '<small>', st, '</small>';
      })
    );
  return table;
}

function secondHd(n) {
  return (
    '<tr>',
    n.table.headers2
      .map(function(rw) {
        return '<th '.concat('">', rw.title, '</th>');
      })
      .join('') + '</tr>'
  );
}

function makeTD(text) {
  return '<td>' + text + '</td>';
}

function setSpecsCol(item) {
  // console.log(item);
  if (!item.dimensions && item.standards.length === 0) {
    return '';
  }
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
