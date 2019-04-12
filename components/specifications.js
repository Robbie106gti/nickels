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
