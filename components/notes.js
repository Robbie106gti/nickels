function setNotes(loc, notes) {
  if (!notes) {
    return;
  }
  fetch(loc + 'json/notes.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var cards = filterItems(data['notes'], notes)
      var n = cards
        .map(function (note) {
          var newnote = note.contentLink ? noteHasLink(note) : noteNoLink(note);
          if (note.itemcodes) {
            newnote = noteHasCodes(newnote, note.itemcodes);
          }
          return newnote;
        })
        .join('');
      $('#notes').html(n);
    })
    .catch(function (err) {
      return console.log(err);
    });
}

function noteHasLink(note) {
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
}

function noteNoLink(note) {
  return (
    '<div class="card orange lighten-4"><p class="note flow-text"><i class="material-icons">announcement</i><b>' +
    note.title +
    '</b>' +
    note.content +
    '</p></div>'
  );
}

function noteHasCodes(note, itemcodes) {
  // console.log(note);
  itemcodes.forEach(function (code) {
    var newstr = '<span class="ordercode">' + code + '</span>';
    note = note.replace(code, newstr);
  });
  //console.log(note);
  return note;
}

function addnotes(add) {
  if (!add.notes) {
    return '';
  }

  var tnotes = '<ul>\n            '
    .concat(
      add.notes
        .map(function (n) {
          return '<li>'.concat(n, '</li>');
        })
        .join(''),
      '\n            </ul>\n            <img src="'
    )
    .concat(add.image, '"/>\n            ');
  return tnotes;
}

function notes(notes) {
  var n2 = notes.map(function (note) {
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
  });
}
