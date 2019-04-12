//// Main js for catagories /////
headerFooter(null);

window.onload = getPage();
info.title = 'Columns';

function getPage() {
  fetch('./items.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (!code) {
        var tabs = data['sub-cats'];
        var html = {};
        tabs.forEach(function(tab) {
          html = _objectSpread(
            _defineProperty(
              {},
              tab.root,
              data.items.filter(function(item) {
                return tab.root === item.root;
              })
            ),
            html
          );
        });

        $('#catalog').html(tabbedSec(html, tabs));
        setGICol(info);
        return;
      } else {
        info.item = data.items.filter(function(item) {
          return item.code.toLowerCase() === code;
        })[0];
        info.item.requires ? addRequired(info, data) : info;
        info.item.fronts ? addFronts(info, data) : info;
      }
      makeStructure(info);
    })
    .catch(function(err) {
      return console.log(err);
    });
}

function addFronts(info, data) {
  info.item.fronts = info.item.fronts.map(function(front) {
    return data.items.filter(function(item) {
      return item.code === front;
    })[0];
  });
  return info;
}

function addRequired(info, data) {
  info.item.requires = data.items.filter(function(item) {
    return item.code === info.item.requires[0];
  })[0];
  info.item.images = info.item.images.concat(info.item.requires.images);
  info.item.notes = info.item.notes.concat(info.item.requires.notes);
  // console.log(info);
  return info;
}

function tabbedSec(object, tabs) {
  var li = tabs
    .map(function(tab) {
      var i =
        '<li class="tab col s3"><a class="" href="#' +
        tab.root +
        '">' +
        tab.title +
        '</a></li>';
      return i;
    })
    .join('');
  var grids = tabs
    .map(function(tab) {
      var g =
        '<div id="' +
        tab.root +
        '" class="grid">' +
        object[tab.root]
          .map(function(card) {
            return cardWith(card);
          })
          .join('') +
        '</div>';
      return g;
    })
    .join('');
  var html =
    '<div class="row"><div class="" onload="loadTabs()"><ul class="tabs">' +
    li +
    '</ul></div>' +
    grids +
    '</div>';
  return html;
}

function makeStructure(info) {
  setGICol(info);
  var structure =
    '<div class="col s12 m8"><div id="des"></div><div id="spec">' +
    setSpecsCol(info.item) +
    '</div><div id="notes"></div><div id="codes"></div></div><div id="images" class="col s12 m4">' +
    setMainImage(info.item) +
    '</div><div id="table" class="col s12 m4">' +
    organizeTables(info) +
    '</div>';
  $('#catalog').html(structure);
  description(info.item.title, info.item.description);
  $('#codes').html(setCode(info.item.code));
  setNotes('../../../', info.item.notes);
}
