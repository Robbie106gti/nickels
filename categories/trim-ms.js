//// Main js for catagories /////

$.ajax({
  url: '../layout/header.html',
  context: document.body,
  success: function(response) {
    $('#header').html(response);
  }
});
$.ajax({
  url: '../layout/footer.html',
  context: document.body,
  success: function(response) {
    $('#footer').html(response);
  }
});
var ua = window.navigator;
console.log(ua);
var edge = 'col s3';

window.onload = getSubs();
function _newArrowCheck(innerThis, boundThis) {
  if (innerThis !== boundThis) {
    throw new TypeError('Cannot instantiate an arrow function');
  }
}

function getSubs() {
  var _this = this;

  $.urlParam = function(name) {
    var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(
      window.location.href
    );

    if (results == null) {
      return null;
    } else {
      return decodeURI(results[1]) || 0;
    }
  };

  var edges = [];
  var cat = $.urlParam('cat');
  var item = $.urlParam('item') ? $.urlParam('item') : null;
  var params = {
    cat: cat,
    item: item
  };
  structure(params);
  setGI(cat);
  var catagory = cat.toLowerCase();
  fetch('../json/'.concat(catagory, '.json'))
    .then(
      function(response) {
        _newArrowCheck(this, _this);

        return response.json();
      }.bind(this)
    )
    .then(
      function(data) {
        _newArrowCheck(this, _this);

        // console.log(data['catalog']);
        data = data[cat];
        var html =
          params.item !== null ? buildItem(data, params) : mainCatView(data);
      }.bind(this)
    )
    .then(
      function() {
        _newArrowCheck(this, _this);

        return initMaterializeJS();
      }.bind(this)
    )
    .catch(
      function(err) {
        _newArrowCheck(this, _this);

        return console.log(err);
      }.bind(this)
    );
}

function initMaterializeJS() {
  $(document).ready(function() {
    $('.modal').modal({
      dismissible: true
    });
  });
}

function structure(params) {
  var html =
    params.item !== null
      ? '\n        <div id="modals"></div>\n        <div class="col s12 m6">\n            <div id="des"></div>\n            <div id="specs"></div>\n            <div id="notes"></div>\n        </div>\n        <div class="col s12 m6">\n            <div id="images"></div>\n        </div>\n            <div id="codes" class="col s12 m6"></div>\n            <div id="options2" class="col s12 m6"></div>'
      : null;
  $('#catalog').html(html);
}

function mainCatView(data) {
  var _this2 = this;

  data.sort(function(a, b) {
    if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
    if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
    return 0;
  });
  var b = document.getElementById('catalog');
  b.setAttribute('class', 'row');
  var html = ''.concat(
    data
      .map(
        function(cat) {
          _newArrowCheck(this, _this2);

          return '<div class="col s3"><div class="card medium"><a href="'
            .concat(
              cat.link,
              '">\n                <div class="card-image waves-effect waves-block waves-light">\n                    <img class="image20 activator" src="'
            )
            .concat(
              cat.image,
              '">\n                </div>\n                <div class="card-content">\n                    <span class="card-title activator grey-text text-darken-4">'
            )
            .concat(
              cat.title,
              '<i class="material-icons right">more_vert</i></span>\n                    '
            )
            .concat(
              getTags(cat.tags),
              '\n                </div></a>\n            </div></div>'
            );
        }.bind(this)
      )
      .join('')
  );
  $('#catalog').html(html);
}

function buildItem(data, params) {
  var _this3 = this;

  var item = data.filter(
    function(item) {
      _newArrowCheck(this, _this3);

      return item.code === params.item;
    }.bind(this)
  )[0];
  setGI({
    sub: params.cat,
    title: item.title
  });
  console.log({
    data: data,
    item: item,
    params: params
  });
  setDescription(item);
  setStandards(item);
  setNotes(item.notes);
  setImages(item);
  setCodes(item);

  if (item.legLeveller) {
    setOptions2(item.legLeveller);
  }
}

function setImages(item) {
  var image = '';

  switch (item.sizeImage) {
    case 'small':
      image = imageCard(item);
      break;

    default:
      image = '<div class="card" style="overflow: hidden; max-height: 100%;">\n                            <div class="padding">\n                                <img class="responsive-img materialboxed" src="'
        .concat(item.image, '" alt="')
        .concat(
          item.imageTitle,
          '">\n                                <span class="card-title black-text"><b>'
        )
        .concat(
          item.imageTitle,
          '</b></span>\n                            </div>\n                            '
        )
        .concat(
          item.specImage ? specImage(item) : '',
          '\n                        </div>'
        );
  }

  $('#images').html(image);
  $(document).ready(function() {
    $('.materialboxed').materialbox();
  });
}

function imageCard(item) {
  var card = '<div class="col s4"><div class="card small" style="overflow: hidden; max-height: 100%;"><div class="padding">\n      <img class="responsive-img materialboxed" src="'
    .concat(item.image, '" alt="')
    .concat(
      item.imageTitle,
      '">\n      <span class="card-title black-text"><b>'
    )
    .concat(item.imageTitle, '</b></span>\n  </div></div></div>');
  card =
    card +
    '<div class="col s4"><div class="card small" style="overflow: hidden; max-height: 100%;"><div class="padding">\n      <img class="responsive-img materialboxed" src="'
      .concat(item.specImage, '" alt="')
      .concat(
        item.specImageTitle,
        '">\n      <span class="card-title black-text"><b>'
      )
      .concat(item.specImageTitle, '</b></span>\n  </div></div></div>');

  if (item.specImage2) {
    card =
      card +
      '<div class="col s4"><div class="card small" style="overflow: hidden; max-height: 100%;"><div class="padding">\n      <img class="responsive-img materialboxed" src="'
        .concat(item.specImage2, '" alt="')
        .concat(
          item.specImageTitle2,
          '">\n      <span class="card-title black-text"><b>'
        )
        .concat(item.specImageTitle2, '</b></span>\n  </div></div></div>');
  }

  return card;
}

function specImage(item) {
  return '\n  <div class="padding">\n      <img class="responsive-img materialboxed" src="'
    .concat(item.specImage, '" alt="')
    .concat(
      item.specImageTitle,
      '">\n      <span class="card-title black-text"><b>'
    )
    .concat(item.specImageTitle, '</b></span>\n  </div>');
}

function setDescription(item) {
  var htmldes = '<div class="card-panel  blue-grey darken-1 white-text">\n                        <span class="card-title">\n                            <h4>Description</h4>\n                        </span>\n                        <div class="divider"></div>\n                        <span id="des" class="flow-text">'
    .concat(item.title, ', ')
    .concat(item.description, '</span>\n                    </div>');
  $('#des').html(htmldes);
}

function setStandards(item) {
  var _this4 = this;

  var specs = item.standards;
  var htmlspecs = '<div class="card-panel grey lighten-3">\n                        <span class="card-title">\n                            <h4>Standards</h4>\n                        </span>\n                        <div class="divider"></div>\n                        <div id="specli"><ul class="flow-text">'
    .concat(
      specs
        .map(
          function(spec) {
            _newArrowCheck(this, _this4);

            return '<li><small><b>'
              .concat(spec.title, ': </b>')
              .concat(spec.content, '</small></li>');
          }.bind(this)
        )
        .join(''),
      '</ul></div>\n            <div id="options">'
    )
    .concat(
      setOptions(item.options),
      '</div>\n            <div id="restrictions">'
    )
    .concat(
      setRestrictions(item.restrictions),
      '</div>\n                    </div>'
    );
  $('#specs').html(htmlspecs);
}

function setOptions(options) {
  var _this5 = this;

  if (options === undefined) return '';
  var htmloptions = '<span class="card-title">\n                            <h4>Options</h4>\n                        </span>\n                        <div class="divider"></div>\n                        <div id="specli"><ul class="flow-text">'.concat(
    options
      .map(
        function(option) {
          _newArrowCheck(this, _this5);

          return option.active === false
            ? ''
            : '<li><small><b>'
                .concat(option.title, ': </b>')
                .concat(option.content, '</small>')
                .concat(option.action ? actionButton(option) : '', '</li>');
        }.bind(this)
      )
      .join(''),
    '</ul></div>'
  );
  return htmloptions;
}

function setOptions2(option) {
  var _this6 = this;

  console.log(option);
  var options = '<div class="card-panel grey lighten-3 row">\n  <span class="card-title">\n      <h4>'
    .concat(
      option.title,
      '</h4>\n  </span>\n  <div class="divider"></div>\n  <div class="col s12">\n    <p>'
    )
    .concat(option.description, '</p>\n    <ul class="col s9"><span>')
    .concat(option.optionsTitle, '</span>\n      ')
    .concat(
      option.options
        .map(
          function(option) {
            _newArrowCheck(this, _this6);

            return '<li><b><span class="ordercode" >'
              .concat(option.code, ': </span></b>')
              .concat(option.description, '</li>');
          }.bind(this)
        )
        .join(''),
      '\n    </ul>\n    <div class="card-image col s3">\n    <img src="'
    )
    .concat(
      option.image,
      '" class="responsive-img materialboxed">\n  </div>\n    <div class="divider"></div>\n    <ul class="col s12"><span><h5>Standards</h5></span>\n      '
    )
    .concat(
      option.standards
        .map(
          function(option) {
            _newArrowCheck(this, _this6);

            return '<li>'.concat(option, '</li>');
          }.bind(this)
        )
        .join(''),
      '\n    </ul>\n    </div>\n  </div>'
    );
  $('#options2').html(options);
}

function setCodes(item) {
  var _this7 = this;

  var htmlcodes = '';

  switch (item.table.template) {
    case 'three':
      htmlcodes = tableThree(item.table);
      break;

    case 'two':
      htmlcodes = tableTwo(item.table);
      break;

    default:
      htmlcodes = '<div class="card-panel grey lighten-3">\n                        <table class="bordered striped highlight">\n                        <theader><tr>'
        .concat(
          item.table.header
            .map(
              function(th) {
                _newArrowCheck(this, _this7);

                return '<th>'.concat(th, '</th>');
              }.bind(this)
            )
            .join(''),
          '</tr></theader>\n                        <tbody>'
        )
        .concat(
          item.table.content
            .map(
              function(row) {
                _newArrowCheck(this, _this7);

                return '<tr><td>'
                  .concat(
                    row.de,
                    '</td><td><ul><li><span  class="ordercode"   onclick="addToOrder(\''
                  )
                  .concat(row.code, '\')">')
                  .concat(row.code, '</span></li></ul></td><td>')
                  .concat(row.description, '</td></tr>');
              }.bind(this)
            )
            .join(''),
          '</tbody>\n                        </table>\n                    </div>'
        );
  }

  $('#codes').html(htmlcodes);
  $('.dropdown-button').dropdown({
    hover: true
  });
}

function tableTwo(table) {
  var _this8 = this;

  var tableTwo = '<div class="card-panel grey lighten-3">\n  <table class="bordered striped highlight">\n  <theader><tr>'
    .concat(
      table.header
        .map(
          function(th) {
            _newArrowCheck(this, _this8);

            return '<th>'.concat(th, '</th>');
          }.bind(this)
        )
        .join(''),
      '</tr></theader>\n  <tbody>'
    )
    .concat(
      table.content
        .map(
          function(row) {
            var _this9 = this;

            _newArrowCheck(this, _this8);

            return row.active === false
              ? ''
              : '<tr>\n          <td>'
                  .concat(row.code, '</td>\n          <td>')
                  .concat(
                    row.unique
                      ? 'Set height'
                      : ''.concat(row.heights, ' (Inch)'),
                    '</td>\n          <td>'
                  )
                  .concat(
                    row.unique
                      ? 'Set lengths'
                      : ''.concat(row.lengths, ' (feet)'),
                    '</td>\n          <td>\n          '
                  )
                  .concat(
                    row.unique
                      ? '<span class="ordercode" >'.concat(row.code, '</span>')
                      : "<a class='dropdown-button btn' href='#' data-activates='dropdownordercodes"
                          .concat(
                            row.code,
                            "'>OrderCodes</a>\n          <ul id='dropdownordercodes"
                          )
                          .concat(
                            row.code,
                            "' class='dropdown-content'>\n            "
                          )
                          .concat(
                            row.heights
                              .map(
                                function(height) {
                                  var _this10 = this;

                                  _newArrowCheck(this, _this9);

                                  return row.lengths
                                    .map(
                                      function(length) {
                                        _newArrowCheck(this, _this10);

                                        return '<li><span class="ordercode"  onclick="addToOrder(\''
                                          .concat(row.code + height, '-')
                                          .concat(length, '\')">')
                                          .concat(row.code + height, '-')
                                          .concat(length, '</span><small>')
                                          .concat(height, '" high - ')
                                          .concat(
                                            length,
                                            "' long</small></li>"
                                          );
                                      }.bind(this)
                                    )
                                    .join('');
                                }.bind(this)
                              )
                              .join(''),
                            '\n          </ul>'
                          ),
                    '</td>\n          <td>'
                  )
                  .concat(row.description, '</td>\n        </tr>');
          }.bind(this)
        )
        .join(''),
      '</tbody>\n  </table>\n</div>'
    );
  return tableTwo;
}

function tableThree(table) {
  var _this11 = this;

  var tableTwo = '<div class="card-panel grey lighten-3">\n  <table class="bordered striped highlight">\n  <theader><tr>'
    .concat(
      table.header
        .map(
          function(th) {
            _newArrowCheck(this, _this11);

            return '<th>'.concat(th, '</th>');
          }.bind(this)
        )
        .join(''),
      '</tr></theader>\n  <tbody>'
    )
    .concat(
      table.content
        .map(
          function(row) {
            var _this12 = this;

            _newArrowCheck(this, _this11);

            return '<tr>\n          <td>'
              .concat(row.lengths, "' (Feet)</td>\n          <td>")
              .concat(row.return ? 'Yes' : 'No', '</td>\n          <td>')
              .concat(
                row.de ? 'Yes' : 'No',
                "</td>\n          <td>\n          <a class='dropdown-button btn' href='#' data-activates='dropdownordercodes"
              )
              .concat(
                row.code,
                "'>OrderCodes</a>\n          <ul id='dropdownordercodes"
              )
              .concat(row.code, "' class='dropdown-content'>\n                ")
              .concat(
                row.lengths
                  .map(
                    function(length) {
                      _newArrowCheck(this, _this12);

                      return '<li><span class="ordercode"  onclick="addToOrder(\''
                        .concat(row.code, '\')">')
                        .concat(row.code, '-')
                        .concat(length, '</span><small>')
                        .concat(length, "' long</small></li>");
                    }.bind(this)
                  )
                  .join(''),
                '\n          </ul></td>\n          <td>'
              )
              .concat(row.description, '</td>\n        </tr>');
          }.bind(this)
        )
        .join(''),
      '</tbody>\n  </table>\n</div>'
    );
  return tableTwo;
}

function actionButton(option) {
  edges = option.edges;
  var htmlbutton = '<button data-target="modaledges" class="btn modal-trigger" (onclick)="openModal(\'modaledges\')">'.concat(
    option.action,
    '</button>'
  );
  getEdges(edges);
  return htmlbutton;
}

function openModal(id) {
  $('#'.concat(id)).modal('open');
}

function closeModal(id) {
  $('#'.concat(id)).modal('close');
}

function setRestrictions(res) {
  var _this13 = this;

  if (res === undefined) return '';
  var htmlrestictions = '<span class="card-title">\n                            <h4>Restrictions</h4>\n                        </span>\n                        <div class="divider"></div>\n                        <div id="specli"><ul class="flow-text">'.concat(
    res
      .map(
        function(r) {
          _newArrowCheck(this, _this13);

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

function setNotes(notes) {
  var _this14 = this;

  if (notes === undefined) return '';
  var htmlnotes = notes
    .map(
      function(note) {
        _newArrowCheck(this, _this14);

        return '<div class="card orange lighten-4">\n                            <p class="note flow-text">\n                                <i class="material-icons">announcement</i>\n                                <b>'
          .concat(note.title, ',</b> ')
          .concat(
            note.content,
            '\n                            </p>\n                        </div>'
          );
      }.bind(this)
    )
    .join('');
  $('#notes').html(htmlnotes);
}

function isString(value) {
  return typeof value === 'string';
}

function setGI(data) {
  var linkies = isString(data)
    ? '../index.html'
    : './trim.html?cat=Trims%20Moldings';
  var div = '<div class="container "> <a href="'.concat(
    linkies,
    '" class="right"><i class="small material-icons">arrow_back</i></a><div id="topic"></div></div>'
  );
  $('#top').html(div);
  var cat = isString(data)
    ? '<h1 id="topic">'.concat(data, '</h1>')
    : '<h1 id="topic">'
        .concat(data.sub, '</h1><h5>')
        .concat(data.title, '</h5><div id="actions"></div>');
  $('#topic').html(cat);
}

function getTags(tags) {
  var _this15 = this;

  if (!tags) return '';
  var keys = ''.concat(
    tags
      .map(
        function(tag) {
          _newArrowCheck(this, _this15);

          return '<div class="chip">'.concat(tag, '</div>');
        }.bind(this)
      )
      .join('')
  );
  return keys;
}

function getEdges() {
  var _this16 = this;

  fetch('../json/edges.json')
    .then(
      function(response) {
        _newArrowCheck(this, _this16);

        return response.json();
      }.bind(this)
    )
    .then(
      function(data) {
        var _this17 = this;

        _newArrowCheck(this, _this16);

        var shownEdges = new Array();
        data.forEach(
          function(edge) {
            _newArrowCheck(this, _this17);

            return edges.includes(edge.title) ? shownEdges.push(edge) : '';
          }.bind(this)
        );
        var html = ''.concat(
          shownEdges
            .map(
              function(e) {
                _newArrowCheck(this, _this17);

                return '<div class="card padding"> <img class="responsive-img" src="'
                  .concat(e.image, '"><h5>')
                  .concat(e.title, ' ')
                  .concat(
                    e.description ? '('.concat(e.description, ')') : '',
                    '</h5><span>Length: '
                  )
                  .concat(e.size.inch, '"</span></div>');
              }.bind(this)
            )
            .join('')
        );
        var modaledges = '<!-- Modal Structure -->\n      <div id="modaledges" class="modal">\n        <div class="modal-content">\n        <div class="">\n        <h4>Edge options<a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a></h4></div>\n          <div id="edges" class="row grid">'.concat(
          html,
          '</div>\n        </div>\n      </div>'
        );
        $('#modals').html(modaledges);
        initMaterializeJS();
      }.bind(this)
    )
    .catch(
      function(err) {
        _newArrowCheck(this, _this16);

        return console.log(err);
      }.bind(this)
    );
}

function addToOrder(code) {
  console.log(
    code + ': this is the ordercode to add, CORS is blocking the JS interaction'
  );
  var input = parent.getElementById('txtItemcode');
  input ? document.getElementById('txtItemcode') : input;
  console.log(input);
  input.value = code;
}
