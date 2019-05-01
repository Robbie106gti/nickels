var csv = require('csv-parser');
var createCsvWriter = require('csv-writer').createObjectCsvWriter;
var fs = require('fs');
var codes = JSON.parse(fs.readFileSync('./cat/columns/items.json'));

var csvWriter = createCsvWriter({
  path: 'node/columns.csv',
  header: [
    { id: 'title', title: 'Title' },
    { id: 'itemcode', title: 'Item Code' },
    { id: 'html', title: 'HTML' },
    { id: 'link', title: 'Link' }
  ]
});

const htmlFile = (code, title) => `<!DOCTYPE html>
<!--[if lt IE 7]> <html lang="en-us" class="ie6"> <![endif]-->
<!--[if IE 7]>    <html lang="en-us" class="ie7"> <![endif]-->
<!--[if IE 8]>    <html lang="en-us" class="ie8"> <![endif]-->
<!--[if gt IE 8]><!-->
<html lang="en-us">
  <!--<![endif]-->

  <head>
    <meta
      http-equiv="refresh"
      content="0; url=/catalog/build/cat/columns/index.html?code=${code}"
    />
    <script type="text/javascript">
      window.location.href = '/catalog/build/cat/columns/index.html?code=${code}';
    </script>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=9" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <title>${title}</title>
  </head>

  <body>
    <div class="container">
      <a href="/catalog/build/cat/columns/index.html?code=${code}">
        <h1>${title}</h1>
      </a>
      <p>
        <a href="/catalog/build/cat/columns/index.html?code=${code}">Redirect</a>
      </p>
    </div>
  </body>
</html>`;

const csvdata = codes.items.map(code => {
  const html = code.code + '.html';
  const itemcode = code.code;
  const link = code.code;
  const title = code.title;
  const item = {
    title,
    itemcode,
    html,
    link
  };
  createFile(html, itemcode, title);
  return item;
});
createCsv(csvdata);

function createFile(html, code, title) {
  fs.writeFile('node/redirects/' + html, htmlFile(code, title), function (err) {
    if (err) throw err;
    console.log('File is created successfully.');
  });
}

function createCsv(data) {
  csvWriter
    .writeRecords(data)
    .then(() => console.log('The CSV file was written successfully'));
}
