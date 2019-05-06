//// Main js for catagories /////
headerFooter('../../');

window.onload = getSubs();

function getSubs() {
  const cat = $.urlParam('cat');
  const item = $.urlParam('item') ? $.urlParam('item') : null;
  const params = {
    cat: cat,
    item: item
  };
  structure(params);
  setGI(cat);
  const catagory = cat.toLowerCase();
  fetch('../../versions/v1/json/' + catagory + '.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      data = data[cat];
      params.item !== null ? buildItem(data, params) : mainCatView(data);
    })
    .then(function () {
      initMaterializeJS();
    })
    .catch(function (err) {
      console.log(err);
    });
}

function initMaterializeJS() {
  $(document).ready(function () {
    $('.modal').modal({
      dismissible: true
    });
  });
}

function structure(params) {
  const html =
    params.item !== null
      ? '<div id="modals"></div>'.concat(
        '<div class="col s12 m6">',
        '<div id="des"></div>',
        '<div id="specs"></div>',
        '<div id="notes"></div>',
        '</div>',
        '<div class="col s12 m6">',
        '<div id="images"></div>',
        '</div>',
        '<div id="codes" class="col s12 m6"></div>',
        '<div id="options2" class="col s12 m6"></div>'
      )
      : null;
  $('#catalog').html(html);
}

function mainCatView(data) {
  data.sort(function (a, b) {
    if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
    if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
    return 0;
  });
  const b = document.getElementById('catalog');
  !info.edge ? (b.className += ' grid') : '';
  const html = data
    .map(function (cat) {
      return (
        '<div class="card ' +
        info.edge +
        '"><a href="'.concat(
          cat.link,
          '">',
          '<div class="card-image waves-effect waves-block waves-light">',
          '<img class="image20 activator" src="',
          imageSRC(cat.image),
          '">',
          '</div>',
          '<div class="card-content">',
          '<span class="card-title activator grey-text text-darken-4">',
          cat.title,
          '<i class="material-icons right">more_vert</i></span>',
          getTags(cat.tags),
          '</div></a>',
          '</div>'
        )
      );
    })
    .join('');
  $('#catalog').html(html);
}

function buildItem(data, params) {
  const item = data.filter(function (item) {
    return item.code === params.item;
  })[0];
  setGI({
    sub: params.cat,
    title: item.title
  });
  console.log(item);
  info.item = item;
  description(info.item.title, info.item.description);
  setStandards(item);
  setNotes(item.notes);
  setImages(item);
  setCodes(item);
  if (item.legLeveller) {
    setOptions2(item.legLeveller);
  }
}

function setImages(item) {
  let image = '';
  switch (item.sizeImage) {
    case 'small':
      image = imageCard(item);
      break;
    default:
      image = '<div class="card" style="overflow: hidden; max-height: 100%;">'.concat(
        '<div class="padding">',
        '<img class="responsive-img materialboxed" src="',
        imageSRC(item.image),
        '" alt="',
        item.imageTitle,
        '">',
        '<span class="card-title black-text"><b>',
        item.imageTitle,
        '</b></span>',
        '</div>',
        item.specImage ? specImage(item) : '',
        '</div>'
      );
  }
  $('#images').html(image);
  $(document).ready(function () {
    $('.materialboxed').materialbox();
  });
}

function imageCard(item) {
  let card = '<div class="col s4"><div class="card small" style="overflow: hidden; max-height: 100%;"><div class="padding"><img class="responsive-img materialboxed" src="'
    .concat(
      imageSRC(item.image),
      '" alt="',
      item.imageTitle,
      '"><span class="card-title black-text"><b>',
      item.imageTitle,
      '</b></span></div></div></div>'
    )
    .concat(
      '<div class="col s4"><div class="card small" style="overflow: hidden; max-height: 100%;"><div class="padding"><img class="responsive-img materialboxed" src="',
      imageSRC(item.specImage),
      '" alt="',
      item.specImageTitle,
      '"><span class="card-title black-text"><b>',
      item.specImageTitle,
      '</b></span></div></div></div>'
    );

  if (item.specImage2) {
    card += '<div class="col s4"><div class="card small" style="overflow: hidden; max-height: 100%;"><div class="padding">'.concat(
      '<img class="responsive-img materialboxed" src="',
      imageSRC(item.specImage2),
      '" alt="',
      item.specImageTitle2,
      '"><span class="card-title black-text"><b>',
      item.specImageTitle2,
      '</b></span></div></div></div>'
    );
  }
  return card;
}

function specImage(item) {
  return '<div class="padding">'.concat(
    '<img class="responsive-img materialboxed" src="',
    item.specImage,
    '" alt="',
    item.specImageTitle,
    '"><span class="card-title black-text"><b>',
    item.specImageTitle,
    '</b></span></div>'
  );
}

function setStandards(item) {
  const specs = item.standards;
  let htmlspecs = '<div class="card-panel grey lighten-3">'.concat(
    '<span class="card-title">',
    '<h4>Standards</h4>',
    '</span>',
    '<div class="divider"></div>',
    '<div id="specli"><ul class="flow-text">',
    specs
      .map(function (spec) {
        return (
          '<li><small><b>' +
          spec.title +
          ': </b>' +
          spec.content +
          '</small></li>'
        );
      })
      .join(''),
    '</ul></div>',
    '<div id="options">',
    setOptions(item.options),
    '</div>',
    '<div id="restrictions">',
    setRestrictions(item.restrictions),
    '</div>',
    '</div>'
  );
  $('#specs').html(htmlspecs);
}

function setOptions(options) {
  if (options === undefined) return '';
  let htmloptions = '<span class="card-title">'.concat(
    '<h4>Options</h4>',
    '</span>',
    '<div class="divider"></div>',
    '<div id="specli"><ul class="flow-text">',
    options
      .map(function (option) {
        return option.active === false
          ? ''
          : '<li><small><b>' +
          option.title +
          ': </b>' +
          option.content +
          '</small>' +
          (option.action ? actionButton(option) : '') +
          '</li>';
      })
      .join(''),
    '</ul></div>'
  );
  return htmloptions;
}

function setOptions2(option) {
  console.log(option);
  let options = '<div class="card-panel grey lighten-3 row">'.concat(
    '<span class="card-title">',
    '<h4>',
    option.title,
    '</h4>',
    '</span>',
    '<div class="divider"></div>',
    '<div class="col s12">',
    '<p>',
    option.description,
    '</p>',
    '<ul class="col s9"><span>',
    option.optionsTitle,
    '</span>',
    option.options
      .map(function (option) {
        return (
          '<li><b>' +
          ordercodes(option.code) +
          ': </b>' +
          option.description +
          '</li>'
        );
      })
      .join(''),
    '</ul>',
    '<div class="card-image col s3">',
    '<img src="',
    imageSRC(option.image),
    '" class="responsive-img materialboxed">',
    '</div>',
    '<div class="divider"></div>',
    '<ul class="col s12"><span><h5>Standards</h5></span>',
    option.standards
      .map(function (option) {
        return '<li>' + option + '</li>';
      })
      .join(''),
    '</ul>',
    '</div>',
    '</div>'
  );

  $('#options2').html(options);
}

function setCodes(item) {
  console.log(item);
  let htmlcodes = '';
  switch (item.table.template) {
    case 'three':
      htmlcodes = tableThree(item.table);
      break;
    case 'two':
      htmlcodes = tableTwo(item.table);
      break;
    default:
      htmlcodes = '<div class="card-panel grey lighten-3">'.concat(
        '<table class="bordered striped highlight">',
        '<theader><tr>',
        item.table.header
          .map(function (th) {
            return '<th>' + th + '</th>';
          })
          .join(''),
        '</tr></theader>',
        '<tbody>',
        item.table.content
          .map(function (row) {
            return '<tr><td>'.concat(
              row.de,
              '</td><td><ul><li>',
              ordercodes(row.code),
              '</li></ul></td><td>',
              row.description,
              '</td></tr>'
            );
          })
          .join(''),
        '</tbody>',
        '</table>',
        '</div>'
      );
  }
  $('#codes').html(htmlcodes);

  $('.dropdown-button').dropdown({
    hover: true
  });
}

function tableTwo(table) {
  const tableTwo = '<div class="card-panel grey lighten-3">'.concat(
    '<table class="bordered striped highlight">',
    '<theader><tr>',
    table.header
      .map(function (th) {
        return '<th>' + th + '</th>';
      })
      .join(''),
    '</tr></theader>',
    '<tbody>',
    table.content
      .map(function (row) {
        return row.active === false
          ? ''
          : '<tr>'.concat(
            '<td>',
            row.code,
            '</td>',
            '<td>',
            row.unique ? 'Set height' : row.heights + ' (Inch)',
            '</td>',
            '<td>',
            row.unique ? 'Set lengths' : row.lengths + ' (feet)',
            '</td>',
            '<td>',
            row.unique
              ? ordercodes(row.code)
              : '<a class="dropdown-button btn" href="#" data-activates="dropdownordercodes' +
              row.code +
              '">OrderCodes</a>',
            '<ul id="dropdownordercodes' +
            row.code +
            '" class="dropdown-content">' +
            row.heights
              .map(function (height) {
                return row.lengths
                  .map(function (length) {
                    const wcode = row.code + height + '-' + length;
                    return (
                      '<li>' +
                      ordercodes(wcode) +
                      '<small>' +
                      height +
                      '" high - ' +
                      length +
                      ' long</small></li>'
                    );
                  })
                  .join('');
              })
              .join(''),
            '</ul>',
            '</td>',
            '<td>',
            row.description,
            '</td>',
            '</tr>'
          );
      })
      .join(''),
    '</tbody>',
    '</table>',
    '</div>'
  );
  return tableTwo;
}

function tableThree(table) {
  const tableTwo = '<div class="card-panel grey lighten-3">'.concat(
    '<table class="bordered striped highlight">',
    '<theader><tr>',
    table.header
      .map(function (th) {
        return '<th>' + th + '</th>';
      })
      .join(''),
    '</tr></theader>',
    '<tbody>',
    table.content
      .map(function (row) {
        return '<tr>'.concat(
          '<td>',
          row.lengths,
          "' (Feet)</td>",
          '<td>',
          row.return ? 'Yes' : 'No',
          '</td>',
          '<td>',
          row.de ? 'Yes' : 'No',
          '</td>',
          '<td>',
          '<a class="dropdown-button btn" href="#" data-activates="dropdownordercodes',
          row.code,
          '">OrderCodes</a>',
          '<ul id="dropdownordercodes',
          row.code,
          '" class="dropdown-content">',
          row.lengths
            .map(function (length) {
              const wcode = row.code + '-' + length;
              return (
                '<li>' +
                ordercodes(wcode) +
                '<small>' +
                length +
                "' long</small></li>"
              );
            })
            .join(''),
          '</ul></td>',
          '<td>',
          row.description,
          '</td>',
          '</tr>'
        );
      })
      .join(''),
    '</tbody>',
    '</table>',
    '</div>'
  );
  return tableTwo;
}

function actionButton(option) {
  edges = option.edges;

  const htmlbutton =
    '<button data-target="modaledges" class="btn modal-trigger" (onclick)="openModal(\'modaledges\')">' +
    option.action +
    '</button>';
  getEdges(edges);
  return htmlbutton;
}

function openModal(id) {
  $('#' + id).modal('open');
}

function closeModal(id) {
  $('#' + id).modal('close');
}

function setRestrictions(res) {
  if (res === undefined) return '';
  let htmlrestictions = '<span class="card-title">'.concat(
    '<h4>Restrictions</h4>',
    '</span>',
    '<div class="divider"></div>',
    '<div id="specli"><ul class="flow-text">' +
    res
      .map(function (r) {
        return (
          '<li><small><i  class="material-icons">notifications</i> - ' +
          r +
          '</small></li>'
        );
      })
      .join(''),
    '</ul></div>'
  );
  return htmlrestictions;
}

function setNotes(notes) {
  if (notes === undefined) return '';
  let htmlnotes = notes
    .map(function (note) {
      return '<div class="card orange lighten-4">'.concat(
        '<p class="note flow-text">',
        '<i class="material-icons">announcement</i>',
        '<b>',
        note.title,
        ',</b> ',
        note.content,
        '</p>',
        '</div>'
      );
    })
    .join('');
  $('#notes').html(htmlnotes);
}

function isString(value) {
  return typeof value === 'string';
}

function setGI(data) {
  const link = isString(data)
    ? '../../index.html'
    : './trim.html?cat=Trims%20Moldings';
  let div = '<div class="container ">'.concat(
    '<a href="',
    link,
    '" class="right">',
    '<i class="small material-icons">arrow_back</i> <span class="lift">Back</span>',
    '</a>',
    '<div id="topic"></div>',
    '</div>'
  );
  $('#top').html(div);
  const cat = isString(data)
    ? '<h1 id="topic">' + data + '</h1>'
    : '<h1 id="topic">' +
    data.sub +
    '</h1><h5>' +
    data.title +
    '</h5><div id="actions"></div>';
  $('#topic').html(cat);
}

function getEdges() {
  fetch('../../json/edges.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const shownEdges = new Array();
      data.forEach(function (edge) {
        return edges.includes(edge.title) ? shownEdges.push(edge) : '';
      });
      const html = shownEdges
        .map(function (e) {
          return (
            '<div class="card padding"> <img class="responsive-img" src="' +
            imageSRC(e.image) +
            '"><h5>' +
            e.title +
            ' ' +
            (e.description ? e.description : '') +
            '</h5><span>Length: ' +
            e.size.inch +
            '"</span></div>'
          );
        })
        .join('');
      const modaledges = '<!-- Modal Structure -->'.concat(
        '<div id="modaledges" class="modal">',
        '<div class="modal-content">',
        '<div class="">',
        '<h4>Edge options<a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a></h4></div>',
        '<div id="edges" class="row grid">',
        html,
        '</div>',
        '</div>',
        '</div>'
      );
      $('#modals').html(modaledges);
      initMaterializeJS();
    })
    .catch(function (err) {
      console.log(err);
    });
}
