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
  if (!items) {
    console.log('Options is empty', items)
    return ''
  }
  try {
    fetch(loc + '/versions/v1/json/options.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var res = optionHtml(filterItems(data['options'], items));
        $('#options').html(res);
      })
      .catch(function (err) {
        return console.log(err);
      });

  } catch (error) {
    console.log('Options has run into a error, see error: ' + error)

  }
}

function optionHtml(options) {
  return '<div class="divider"></div><h4>Options:</h4><ul class="flow-text">'.concat(options.map(function (opt) { return '<li>'.concat(optionSwitch(opt), '</li>') }).join(''), '</ul>');
}

function optionSwitch(opt) {
  switch (opt.type) {
    case 'list':
      return listOption(opt);
    case 'modal':
      return makemodalspec(opt);
    default:
      return '<b>' + opt.title + ' :</b> ' + opt.content;
  }
}

function listOption(opt) {
  return '<ul>'.concat('<b>' + opt.title + ':</b>', opt.list.map(function (li) { return '<li class="second">' + li + '</li>' }).join(''), '</ul>');
}
