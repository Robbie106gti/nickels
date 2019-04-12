/* function setTableColumns(rws, cols) {
  const header = cols.map(col => '<th>' + col + '</th>');

  const table = `<table class="striped highlight grey darken-4"><thead><tr class="white-text"><th>CLM#</th><th>Cornerblock</th><th>Molding</th><th>Construction</th></tr></thead><tbody><tr><td><span class="ordercode">${
    item.code
    }</span></td>${item.cnm
      .map(c => `<td>${c}</td>`)
      .join('')}<td><a href="?code=${item.requires.code}">${
    item.requires.title
    }</a></td></tr>
                </tbody></table>`;
  return table;
} */

function codeTable(page) {
  var table = '<div class="card padding"><table class="striped highlight centered"><thead><tr><th>Cabinet Widths</th>    <th>Order Codes</th></tr></thead><tbody id="tbody">'
    .concat(
      page.widths
        .map(function(code) {
          return '<tr><td>'
            .concat(code, '"</td><td><ul><li><span class="ordercode">')
            .concat(page.root)
            .concat(code)
            .concat(page.height, '</span></li></ul></td></tr>');
        })
        .join(''),
      '</tbody></table>'
    )
    .concat(additional(page), '</div>');
  $('#codes').html(table);
}
