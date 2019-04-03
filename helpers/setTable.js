function setTableColumns(item) {
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

function setColumnHeights(item) {
  const table = `<table class="striped highlight><thead >
  <tr class=""><th colspan="3">Column heights</th></tr>
                  <tr ><th>CLM</th><th>Description</th><th>Inch Heights</th></tr>
                </thead><tbody>
                  ${item.requires.heights
                    .map(
                      h =>
                        `<tr><td>${
                          item.requires.code
                        }__${h}</td><td>Column ${h}" high</td><td>${h}"</td></tr>`
                    )
                    .join('')}
                </tbody></table>`;
  return table;
}

function setFrontOptions(item) {
  const table = `<table class="striped highlight><thead >
  <tr class=""><th colspan="3">Front options</th></tr>
                  <tr ><th>CLM</th><th>Cornerblock</th><th>Molding</th></tr>
                </thead><tbody>
                  ${item.fronts
                    .map(
                      f =>
                        `<tr><td>${
                          f.code
                        }</td>${f.cnm.map(c => `<td>${c}</td>`).join('')${h}"</td>}</tr>`
                    )
                    .join('')}
                </tbody></table>`;
  return table;
}
