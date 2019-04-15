const csv = require('csv-parser');
const fs = require('fs');
const oldcodes = JSON.parse(fs.readFileSync('./json/codes.json'));
const results = [];

fs.createReadStream('./node/Cabinets update.csv')
  .pipe(csv())
  .on('data', (data) => cleanData(data))
  .on('end', () => {
    createNew()
  });

function cleanData(data) {
  const csvi = {
    active: false,
    lines: {
      custom: false,
      lighthouse: false,
      cornerstone: false,
      modal: false,
      modcon: false
    },
    itemcode: data.itemcode,
    desc: data.desc
  };
  data["Custom"] === "T" ? (csvi.lines.custom = true, csvi.active = true) : csvi.lines.custom = false;
  data["Lighthouse"] === "T" ? (csvi.lines.lighthouse = true, csvi.active = true) : csvi.lines.lighthouse = false;
  data["Cornerstone"] === "T" ? (csvi.lines.cornerstone = true, csvi.active = true) : csvi.lines.cornerstone = false;
  results.push(csvi)
}

function createNew() {
  const jsondata = oldcodes.codes.map(code => {
    code.itemcodes = code.widths ? code.widths.map(w => code.root + w + code.height) : '';
    code.itemcodes.push(code.root + '__' + code.height);
    code.itemcodes.push(code.code);
    const csvitems = results.filter(csvitem => code.itemcodes.includes(csvitem.itemcode));
    const lines = { custom: false, lighthouse: false, cornerstone: false, modal: false, modcon: false };
    csvitems.map(i => {
      i.lines.custom === true ? lines.custom = true : '';
      i.lines.cornerstone === true ? lines.cornerstone = true : '';
      i.lines.lighthouse === true ? lines.lighthouse = true : '';
    });
    if (!code.active) {
      code.active = code.active === false ? false : true;
    }
    code.lines = lines;
    code.csvitems = csvitems;
    return code;
  });
  createFile('codes.json', jsondata);
}

function createFile(html, newcodes) {
  console.log({ newitems: oldcodes.codes.length, olditems: newcodes.length });
  var json = JSON.stringify({ codes: [...newcodes] });
  fs.writeFile('node/json/' + html, json, 'utf8', function (err) {
    if (err) throw err;
    console.log('File is created successfully.');
  });
}
