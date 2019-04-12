function setTableColumns(item) {
  var table = '<table class="striped highlight grey darken-4"><thead>\n                  <tr class="white-text"><th>CLM#</th><th>Cornerblock</th><th>Molding</th><th>Construction</th></tr>\n                </thead><tbody>\n                  <tr><td><span class="ordercode">'
    .concat(item.code, '</span></td>')
    .concat(
      item.cnm
        .map(function(c) {
          return '<td>'.concat(c, '</td>');
        })
        .join(''),
      '<td><a href="?code='
    )
    .concat(item.requires.code, '">')
    .concat(
      item.requires.title,
      '</a></td></tr>\n                </tbody></table>'
    );
  return table;
}

function setColumnHeights(item) {
  var heights = !item.requires ? item.heights : item.requires.heights;
  var table = '<table class="striped highlight"><thead >\n  <tr class=""><th colspan="3">Column heights</th></tr>\n                  <tr ><th>CLM</th><th>Description</th><th>Inch Heights</th></tr>\n                </thead><tbody>\n                  '.concat(
    heights
      .map(function(h) {
        return '<tr><td>'
          .concat(item.requires ? item.requires.code : item.code, '__')
          .concat(h, '</td><td>Column ')
          .concat(h, '" high</td><td>')
          .concat(h, '"</td></tr>');
      })
      .join(''),
    '</tbody></table>'
  );
  return table;
}

function setFrontOptions(item) {
  var table =
    '<table class="striped highlight"><thead >\n  <tr class=""><th colspan="3">Front options</th></tr>\n                  <tr ><th>CLM</th><th>Cornerblock</th><th>Molding</th></tr>\n                </thead><tbody>';
  table +=
    item.fronts
      .map(function(f) {
        return '<tr><td>'.concat(f.code, '</td>').concat(
          f.cnm
            .map(function(c) {
              return '<td>'.concat(c, '</td>');
            })
            .join(''),
          '</td></tr>'
        );
      })
      .join('') + '</tbody></table>';
  return table;
}

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

function organizeTables(info) {
  var tables;

  if (info.item.fronts) {
    tables = '<div class="card-panel">'
      .concat(setFrontOptions(info.item), '</div><div class="card-panel">')
      .concat(setColumnHeights(info.item, '24'), '</div>');
    // console.log(tables);
    return tables;
  }

  if (!info.item.requires) return '';
  return '<div class="card-panel">'
    .concat(setTableColumns(info.item), '</div><div class="card-panel">')
    .concat(setColumnHeights(info.item), '</div>');
}
