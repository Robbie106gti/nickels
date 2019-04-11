//// Main js for catagories /////
'use strict';
$.ajax({
  url: '../../layout/header.html',
  context: document.body,
  success: function(response) {
    $('#header').html(response);
  }
});
$.ajax({
  url: '../../layout/footer.html',
  context: document.body,
  success: function(response) {
    $('#footer').html(response);
  }
});

window.onload = getPage();

function getPage() {
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
  var code = $.urlParam('code');
  makeStructure();
  fetch('../../json/codes.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var codes = data['codes'];
      var page = codes.filter(function(el) {
        var _this = this;
        var res = code.search(el.root);
        var arr = new Array();
        arr.push(el.root + '__' + el.height);
        arr.push(el.code);

        if (res !== -1) {
          el.height
            ? el.widths.map(
                function(h) {
                  _newArrowCheck(this, _this);

                  return arr.push(el.root + h + el.height);
                }.bind(this)
              )
            : '';
        }

        return arr.includes(code);
      });
      page = page[0];
      setGI(page);
      setCode(page);
      setActive();
    })
    .catch(function(err) {
      return console.log(err);
    });
}

function makeStructure() {
  var main =
    '\n        <div class="col s12 m6">\n            <div id="des"></div>\n            <div id="specs"></div>\n            <div id="notes"></div>\n        </div>\n        <div class="col s12 m6">\n            <div id="images"></div>\n        </div>\n        <div class="col s12 m12">\n            <div id="codes" class="col s12 m6"></div>\n            <div id="options" class="col s12 m6"></div>\n        </div>';
  $('#catalog').html(main);
}

function setCode(page) {
  var des =
    '<div class="card-panel  blue-grey darken-1 white-text">\n                        <span class="card-title">\n                            <h4>Description</h4>\n                        </span>\n                        <div class="divider"></div>\n                        <span id="des" class="flow-text">' +
    page.title +
    ', ' +
    page.description +
    '</span>\n                    </div>';
  $('#des').html(des);
  var specs =
    '<div class="card-panel grey lighten-3 bullet">\n                        <span class="card-title">\n                            <h4>Specifications</h4>\n                        </span>\n                        <div class="divider"></div>\n                        <div id="specli"></div>\n                    </div>';
  $('#specs').html(specs);
  setSpecs(page.specifications, page);
  codeTable(page);
  setImages(page.images, page.title, page.height);
  setNotes(page.notes);
  setActions(page);
  // setOptions(page);
}

function setGI(page) {
  var topic =
    '\n        <a href="../index.html?cat=' +
    page.cat +
    '" class="right">\n          <i class="small material-icons">arrow_back</i> <span class="lift">Back</span>\n        </a>\n        <div id="actions"></div>\n        <div>\n            <h1 id="titleHeader">' +
    page.cat +
    '</h1>\n            <h5 id="subHeader">' +
    page.root +
    '__' +
    page.height +
    ' : ' +
    page.title +
    ' ' +
    page.height +
    '" high</h5>\n        </div>        \n        ';
  $('#topic').html(topic);
}

function setActive() {
  if ($.urlParam('code')) {
    var id = $.urlParam('code');
    Materialize.toast('You are on page ' + id, 3000);
    $('.materialboxed').materialbox();
  }
}

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
      var n =
        '' +
        spec
          .map(function(n) {
            return '<li><b>' + n.title + '</b>: ' + n.content + '</li>';
          })
          .join('');
      // console.log(spec);
      n =
        '<ul class="flow-text">\n                        <li id="dim">' +
        setDim(page) +
        '</li>\n                        ' +
        n +
        '\n                    </ul>';
      $('#specli').html(n);
    })
    .catch(function(err) {
      return console.log(err);
    });
  var s =
    '' +
    specs
      .map(function(spec) {
        return (
          '\n        <li><b>' + spec.title + '</b>: ' + spec.content + '</li>'
        );
      })
      .join('');
  return s;
}

function setNotes(notes) {
  fetch('../../json/notes.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var cards = data['notes'].filter(function(el, i) {
        var t = notes.includes(el.id);
        var id;
        if (t === true) {
          id = el.id;
        } else {
          id = t;
        }
        return el.id === id;
      });
      var n =
        '' +
        cards
          .map(function(note) {
            return (
              '\n                        <div class="card orange lighten-4">\n                            <p class="note flow-text">\n                                <i class="material-icons">announcement</i>\n                                <b>' +
              note.title +
              '</b>' +
              note.content +
              '<a href="' +
              note.link +
              '">' +
              note.contentLink +
              '<a/>' +
              note.ccontent +
              '\n                            </p>\n                        </div>'
            );
          })
          .join('');
      // console.log(n);
      $('#notes').html(n);
    })
    .catch(function(err) {
      return console.log(err);
    });
}

function setImages(images, title, height) {
  var image =
    '' +
    images
      .map(function(image) {
        return (
          '\n                        <div class="card">\n                            <div class="padding">\n                                <img class="responsive-img materialboxed" src="' +
          image.image +
          '">\n                                <img class="responsive-img materialboxed" src="' +
          image.image2 +
          '">\n                                <span class="card-title black-text"><b>' +
          image.title +
          title +
          ' ' +
          height +
          '" high</b></span>\n                            </div>\n                        </div>'
        );
      })
      .join('');
  $('#images').html(image);
}

function codeTable(page) {
  var table =
    '\n        <div class="card padding">\n            <table class="striped highlight centered">\n                <thead>\n                <tr>\n                    <th>Cabinet Widths</th>\n                    <th>Order Codes</th>\n                </tr>\n                </thead>\n                <tbody id="tbody">                \n                    ' +
    page.widths
      .map(function(code) {
        return (
          '<tr><td>' +
          code +
          '"</td><td class="ordercode">' +
          page.root +
          code +
          page.height +
          '</td></tr>'
        );
      })
      .join('') +
    '   \n                </tbody>\n            </table>\n            ' +
    additional(page) +
    '\n        </div>\n        ';
  $('#codes').html(table);
}

function setActions(page) {
  // console.log(page)
  var cat = page.cat.toLowerCase();
  fetch('../../json/' + cat + '.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var card = data[page.cat].filter(function(el, i) {
        return el.code === page.root;
      });
      card = card[0];
      // console.log(card);
      var action =
        '\n                    <div class="fixed-action-btn toolbar">\n                        <a class="btn-floating btn-large red">\n                            <i class="large material-icons">assistant</i>\n                        </a>\n                        <ul>\n                            <li class="waves-effect waves-light"><a href="#TopPage"><i class="material-icons">arrow_upward</i> Top</a></li>\n                            <li class="waves-effect waves-light"><a href="#BottomPage"><i class="material-icons">arrow_downward</i> Bottom</a></li>\n                            <li class="waves-effect waves-light"><a href="./index.html?cat=' +
        page.cat +
        "\"><i class=\"material-icons\">arrow_back</i> Back</a></li>\n                        </ul>\n                    </div>\n                    <!-- Dropdown Trigger -->\n                    <a class='dropdown-button btn bot  light-blue darken-4' data-activates='dropdown1'>Other options</a>\n                  \n                    <!-- Dropdown Structure -->\n                    <ul id='dropdown1' class='dropdown-content  light-blue darken-4'>\n                        " +
        makeActions(card) +
        '\n                    </ul>\n                    ';
      $('#actions').html(action);
      $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrainWidth: true, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: true, // Displays dropdown below the button
        alignment: 'left', // Displays dropdown with edge aligned to the left of button
        stopPropagation: false // Stops event propagation
      });
    })
    .catch(function(err) {
      return console.log(err);
    });
}

function makeActions(card) {
  var action =
    '' +
    card.attached
      .map(function(a) {
        return (
          '<li class="waves-effect waves-light"><a class="white-text" href="./' +
          a.link +
          '.html?code=' +
          card.code +
          a.height +
          '"><i class="material-icons">art_track</i>' +
          a.height +
          '" high</a></li>'
        );
      })
      .join('');
  return action;
}

function setDim(page) {
  fetch('../../json/iwhd.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var dim = data['iwhd'].filter(function(el, i) {
        var t = page.iwhd.includes(el.id);
        var id;
        if (t === true) {
          id = el.id;
        } else {
          id = t;
        }
        return el.id === id;
      });
      var n =
        '<ul><b>Dimensional adjustments</b>:' +
        dim
          .map(function(iwhd) {
            return (
              '<li class="second"><i class="material-icons">tune</i> ' +
              iwhd.title +
              ' - ' +
              iwhd.content +
              '</li>'
            );
          })
          .join('') +
        '</ul>';
      // console.log(n);
      $('#dim').html(n);
    })
    .catch(function(err) {
      return console.log(err);
    });
}

function setOptions(page) {
  fetch('../../json/addons.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var addons = data['addons'].filter(function(el, i) {
        var t = page.options.includes(el.id);
        var id;
        if (t === true) {
          id = el.id;
        } else {
          id = t;
        }
        return el.id === id;
      });
      var n =
        '\n                <div class="card padding">\n                    <h4>Addional Customizations:</h4>\n                        <ul class="collapsible popout" data-collapsible="accordion">\n                        ' +
        addons
          .map(function(addon) {
            return (
              '<li class="white">\n                          <div class="collapsible-header"><i class="material-icons">' +
              addon.icon +
              '</i>' +
              addon.title +
              '</div>\n                          <div class="collapsible-body"><span><b>' +
              addon.title +
              '</b> ' +
              addon.content +
              '</span></div>\n                        </li>'
            );
          })
          .join('') +
        '\n                   </ul></div>';
      // console.log(n);
      $('#options').html(n);
      $(document).ready(function() {
        $('.collapsible').collapsible();
      });
    })
    .catch(function(err) {
      return console.log(err);
    });
}

function additional(page) {
  if (!page.additional) {
    return '';
  }
  var add =
    '<br><div class="divider"></div><br>\n        <table class="striped highlight centered">\n            <thead><tr>\n            ' +
    page.additional.header
      .map(function(h) {
        return '<th>' + h + '</th>';
      })
      .join('') +
    '\n            </tr></thead>\n            <tbody id="tbody">\n            ' +
    page.additional.rows
      .map(function(r) {
        return (
          '<tr><td>' +
          r.cw +
          '</td><td>' +
          r.fw +
          '</td><td>' +
          r.l +
          '</td><td>' +
          r.dw +
          '</td></tr>'
        );
      })
      .join('') +
    '\n            </tbody>\n        </table>\n        ' +
    addnotes(page.additional);
  return add;
}

function addnotes(add) {
  if (!add.notes) {
    return '';
  }
  var tnotes =
    '<ul>\n            ' +
    add.notes
      .map(function(n) {
        return '<li>' + n + '</li>';
      })
      .join('') +
    '\n            </ul>\n            <img src="' +
    add.image +
    '"/>\n            ';
  return tnotes;
}
