function getEdges(loc, edges) {
  fetch(loc + '/json/edges.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      const shownEdges = new Array();
      data.forEach(edge =>
        edges.includes(edge.title) ? shownEdges.push(edge) : ''
      );
      const html = shownEdges
        .map(
          e =>
            '<div class="card padding"> <img class="responsive-img" src="' +
            imageSRC(e.image) +
            '"><h5>' +
            e.title +
            ' ' +
            (e.description ? e.description : '') +
            '</h5><span>Length: ' +
            e.size.inch +
            '"</span></div>'
        )
        .join('');
      const modaledges = '<!-- Modal Structure -->'.concat(
        '<div id="modaledges" class="modal">',
        '<div class="modal-content">',
        '<div class="">',
        '<h4>Edge options<a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a></h4></div>',
        '<div id="edges" class="row grid">',
        html,
        '</div>',
        '</div>',
        '</div>'
      );
      $('#modals').html(modaledges);
      initMaterializeJS();
    })
    .catch(function(err) {
      console.log(err);
    });
}
