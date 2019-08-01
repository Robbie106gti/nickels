function setSpecs(specs, page) {
  if (!specs) {
    console.log('Specifications is empty', page, specs);
    return '';
  }
  try {
    fetch('../versions/v2/json/specifications.json', { cache: 'reload' })
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
  } catch (error) {
    console.log('Specifications has run into a error, see error: ' + error);
  }
}

function setSpecsND(loc, specs) {
  if (!specs.length) {
    console.log('Specifications is empty', specs);
    return '';
  }
  try {
    fetch(loc + '/versions/v2/json/specifications.json', { cache: 'reload' })
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
        n = '<ul class="flow-text">' + n + '</ul></div>';
        document.getElementById('spec').innerHTML = n;
        document.getElementById('div-sor').classList.remove('hide');
      })
      .catch(function(err) {
        return console.log(err);
      });
  } catch (error) {
    console.log('Specifications has run into a error, see error: ' + error);
  }
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
    case 'modal':
      sli = makemodalspec(n);
      break;
    default:
      sli = '<li><b>' + n.title + '</b>: ' + n.content + '</li>';
      break;
  }
  return sli;
}

function makemodalspec(n) {
  let li = '<li><b>' + n.title + '</b>: ';
  let button = n.content + ' ' + n.modal.text;
  button = button.replace(
    n.modal.button,
    '<button data-target="' +
      n.id +
      'modal" class="btn small modal-trigger">' +
      n.modal.button +
      '</button>'
  );
  let content = '<div class="row">'.concat(
    n.modal.images
      .map(function(i) {
        return (
          '<div class="col s3"><div class="card-panel large"><p>' +
          i.title +
          '</p><img class="responsive-img materialboxed" src="' +
          i.image +
          '" alt="' +
          i.title +
          '"></div></div>'
        );
      })
      .join(''),
    '</div>'
  );
  let modal =
    '<div id="' +
    n.id +
    'modal" class="modal bottom-sheet"><div class="modal-content"><h4>'.concat(
      n.modal.title,
      '</h4>',
      content,
      '</div>',
      '<div class="modal-footer">',
      '</div></div>'
    );
  $(document).ready(function() {
    $('.modal').modal();
  });
  $(document).ready(function() {
    $('.materialboxed').materialbox();
  });
  return li + button + '</li>' + modal;
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
  let table =
    '<b>' +
    n.title +
    ':</b><table style="font-size:12pt" class="striped highlight"><thead>'
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
              n.table.headers
                .map(function(hd) {
                  if (hd.key !== 'ordercode') {
                    return makeTD(rw[hd.key]);
                  } else {
                    return makeTD(ordercodes(rw[hd.key]));
                  }
                })
                .join(''),
              '</tr>'
            );
          })
          .join(''),
        '</tbody></table>'
      );
  if (n.astrixs) {
    table += n.astrixs
      .map(function(st) {
        return '<p class="tiny-note">' + st + '</p>';
      })
      .join('');
  }
  return table;
}

function secondHd(n) {
  return (
    '<tr>',
    n.table.headers2
      .map(function(rw) {
        return '<th '.concat('"><small>', rw.title, '</small></th>');
      })
      .join('') + '</tr>'
  );
}

function makeTD(text) {
  if (!text) return '';
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
