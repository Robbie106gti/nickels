function setTableColumns(rws, cols, ) {
  const header = cols.map(col => '<th>' + col + '</th>');
  const

  const table = `<table class="striped highlight grey darken-4"><thead>
                  <tr class="white-text"><th>CLM#</th><th>Cornerblock</th><th>Molding</th><th>Construction</th></tr>
                </thead><tbody>
                  <tr><td><span class="ordercode">${
    item.code
    }</span></td>${item.cnm
      .map(c => `<td>${c}</td>`)
      .join('')}<td><a href="?code=${item.requires.code}">${
    item.requires.title
    }</a></td></tr>
                </tbody></table>`;
  return table;
}
