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
      var n = cards
        .map(function(note) {
          return (
            '<div class="card orange lighten-4"><p class="note flow-text"><i class="material-icons">announcement</i><b>' +
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
        })
        .join('');
      $('#notes').html(n);
    })
    .catch(function(err) {
      return console.log(err);
    });
}

function addnotes(add) {
  if (!add.notes) {
    return '';
  }

  var tnotes = '<ul>\n            '
    .concat(
      add.notes
        .map(function(n) {
          return '<li>'.concat(n, '</li>');
        })
        .join(''),
      '\n            </ul>\n            <img src="'
    )
    .concat(add.image, '"/>\n            ');
  return tnotes;
}
