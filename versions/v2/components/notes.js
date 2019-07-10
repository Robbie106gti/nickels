function setNotes(loc, notes) {
  if (notes === undefined) {
    console.log('notes are ', notes)
    return;
  }
  if (!notes.length || notes === undefined) {
    console.log('notes is empty');
    return;
  }
  const el = document.getElementById('notes');
  try {
    fetch(loc + '/versions/v2/json/notes.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var cards = filterItems(data['notes'], notes);
        var n = cards
          .map(function (note) {
            if (!note) {
              console.log("Oops! i didn't find the note!");
              return;
            }
            var newnote = note.contentLink ? noteHasLink(note) : noteNoLink(note);
            if (note.itemcodes) {
              newnote = noteHasCodes(newnote, note.itemcodes);
            }
            return newnote;
          })
          .join('');
        el ? (el.innerHTML = n) : console.log('No notes Element! ' + el);
      })
      .catch(function (err) {
        return console.log(err);
      });

  } catch (error) {
    console.log('Notes has run into a error, see error: ' + error)
  }
}

function noteHasLink(note) {
  return '<div class="card orange lighten-4"><p class="note flow-text"><i class="material-icons">announcement</i><b>'.concat(
    note.title,
    '</b>',
    note.content,
    '<a href="',
    note.link,
    '">',
    note.contentLink,
    '</a>',
    note.ccontent,
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

  var tnotes = '<ul>'
    .concat(
      add.notes
        .map(function (n) {
          return '<li>'.concat(n, '</li>');
        })
        .join(''),
      '</ul><img src="'
    )
    .concat(add.image, '"/>');
  return tnotes;
}

function notes(notes) {
  var n2 = notes.map(function (note) {
    if (!note) {
      console.log("Oops! i didn't find the note!");
      return;
    }
    return '<div class="card orange lighten-4"><p class="note flow-text"><i class="material-icons">announcement</i><b>'.concat(
      note.title,
      '</b>',
      note.content,
      '<a href="',
      note.link,
      '">',
      note.contentLink,
      '</a>',
      note.ccontent,
      '</p></div>'
    );
  });
}

function plainNotes(notes) {
  let n = notes
    .map(function (note) {
      return (
        '<div class="card orange lighten-4"><p class="note flow-text"><i class="material-icons">announcement</i><b>' +
        note.title +
        ', </b>' +
        note.content +
        '</p></div>'
      );
    })
    .join('');
  $('#notes').html(n);
}
