const fs = require('fs');
const codes = JSON.parse(fs.readFileSync('./json/codes.json'));
const cabBase = JSON.parse(fs.readFileSync('./json/base cabinets.json'));
const results = [];

cabBase["Base Cabinets"].map(base => {
  basecodes = codes.codes.filter(code => base.code === code.root);
  base.active = base.active ? true : false;
  let active = new Array();
  basecodes.map(act => active.push(act.active));
  if (active.includes(!true)) {
    console.log(base)
    base.active = false;
  }
  base.attached.map(opt => {
    const atcode = base.root + opt.height;
    basecodes.filter(bc => bc.itemcodes.includes(atcode))
  })
})

function createFile(html, newcodes) {
  console.log({ newitems: oldcodes.codes.length, olditems: newcodes.length });
  var json = JSON.stringify({ codes: [...newcodes] });
  fs.writeFile('node/json/' + html, json, 'utf8', function (err) {
    if (err) throw err;
    console.log('File is created successfully.');
  });
}
