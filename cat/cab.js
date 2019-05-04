//// Page js for cabinet pages /////
headerFooter('../');

window.onload = getPage();
if ((pline = undefined)) {
  if (window.location !== window.parent.location) {
    setPline();
  }
}

function getPage() {
  makeStructure();
  fetch('../node/json/codes.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var codes = data['codes'];
      var page = codes.filter(function(el) {
        var res = code.search(el.root);
        var arr = new Array();
        arr.push(el.root + '__' + el.height);
        arr.push(el.code);
        if (res !== -1) {
          el.height
            ? el.widths.map(function(h) {
                return arr.push(el.root + h + el.height);
              })
            : '';
        }
        return arr.includes(code);
      });
      page = page[0];

      setGI(page);
      setCode(page);
    })
    .catch(function(err) {
      return console.log(err);
    });
}

function makeStructure() {
  var main =
    '<div class="col s12 m6"><div id="des"></div><div id="specs"><div class="card-panel grey lighten-3 bullet"><span class="card-title"><h4>Specifications</h4></span><div class="divider"></div><div id="specli"></div></div></div><div id="notes"></div></div><div class="col s12 m6"><div id="images"></div></div><div class="col s12 m12"><div id="codes" class="col s12 m6"></div><div id="options" class="col s12 m6"></div></div>';
  $('#catalog').html(main);
}

function setCode(page) {
  disableItem(page);
  description(page.title, page.description);
  setSpecs(page.specifications, page);
  codeTable(page);
  setImages(page.images, page.title, page.height);
  setNotes('../', page.notes);
  setActions(page);
}

function setActions(page) {
  var cat = page.cat.toLowerCase();
  fetch('../json/'.concat(cat, '.json'))
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var card = data[page.cat].filter(function(el, i) {
        return el.code === page.root;
      });
      card = card[0];

      var action = "<!-- Dropdown Trigger --><a class='dropdown-button btn bot light-blue darken-4' data-activates='dropdown1'>Other options</a><!-- Dropdown Structure --><ul id='dropdown1' class='dropdown-content light-blue darken-4'>".concat(
        makeActions(card),
        '</ul>'
      );
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
  var action = card.attached
    .map(function(a) {
      return '<li class="waves-effect waves-light"><a class="white-text" href="./'
        .concat(a.link, '.html?code=')
        .concat(card.code)
        .concat(a.height, '"><i class="material-icons">art_track</i>')
        .concat(a.height, '" high</a></li>');
    })
    .join('');
  return action;
}

function additional(page) {
  if (!page.additional) {
    return '';
  }

  var add = '<br><div class="divider"></div><br><table class="striped highlight centered"><thead><tr>'
    .concat(
      page.additional.header
        .map(function(h) {
          return '<th>'.concat(h, '</th>');
        })
        .join(''),
      '</tr></thead><tbody id="tbody">'
    )
    .concat(
      page.additional.rows
        .map(function(r) {
          return '<tr><td>'
            .concat(r.cw, '</td><td>')
            .concat(r.fw, '</td><td>')
            .concat(r.l, '</td><td>')
            .concat(r.dw, '</td></tr>');
        })
        .join(''),
      '</tbody></table>'
    )
    .concat(addnotes(page.additional));
  return add;
}
