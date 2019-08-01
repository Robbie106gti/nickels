function setNotes(location, notes) {
  var _this = this;

  if (notes === undefined) return;
  location =
    location === null
      ? '../../../json/notes.json'
      : location + '/json/notes.json';
  console.log({
    location: location,
    notes: notes
  });
  fetch(location, { cache: "reload" })
    .then(
      function(response) {
        _newArrowCheck(this, _this);

        return response.json();
      }.bind(this)
    )
    .then(
      function(data) {
        var _this2 = this;

        _newArrowCheck(this, _this);

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
        var n = cards
          .map(
            function(note) {
              _newArrowCheck(this, _this2);

              return (
                '<div  class="card orange lighten-4"><p class="note flow-text"><i class="material-icons">announcement</i><b>' +
                note.title +
                '</b>' +
                note.content +
                '<a href="' +
                note.link +
                '">' +
                note.contentLink +
                '<a/>' +
                note.ccontent +
                '</p></div>'
              );
            }.bind(this)
          )
          .join('');
        $('#notes').html(n);
      }.bind(this)
    )
    .catch(
      function(err) {
        _newArrowCheck(this, _this);

        return console.log(err);
      }.bind(this)
    );
}
