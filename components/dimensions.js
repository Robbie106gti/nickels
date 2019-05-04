function setDim(page) {
  fetch('../json/iwhd.json')
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
      var n3 =
        '<ul><b>Dimensional adjustments</b>:' +
        dim
          .map(function(iwhd) {
            return (
              '<li class="second" style="list-style-type: circle"> ' +
              iwhd.title +
              ' - ' +
              iwhd.content +
              '</li>'
            );
          })
          .join('') +
        '</ul>';
      // console.log(n); <i class="material-icons">tune</i>
      $('#dim').html(n3);
    })
    .catch(function(err) {
      return console.log(err);
    });
}
