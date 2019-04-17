const fs = require('fs');
const codes = JSON.parse(fs.readFileSync('./json/codes.json'));

///// >> Base Cabinets << //////
const cabBase = JSON.parse(fs.readFileSync('./json/base cabinets.json'));
const cabBaseC = JSON.parse(fs.readFileSync('./json/base channel cabinets.json'));

///// >> Tall Cabinets << //////
const cabTall = JSON.parse(fs.readFileSync('./json/tall cabinets.json'));
const cabTallC = JSON.parse(fs.readFileSync('./json/tall channel cabinets.json'));

///// >> Wall Cabinets << //////
const cabWall = JSON.parse(fs.readFileSync('./json/wall cabinets.json'));
const cabWallC = JSON.parse(fs.readFileSync('./json/wall channel cabinets.json'));

///// >> Vanity Cabinets << //////
const cabVan = JSON.parse(fs.readFileSync('./json/vanity cabinets.json'));
const cabVanC = JSON.parse(fs.readFileSync('./json/vanity channel cabinets.json'));
const cabFVan = JSON.parse(fs.readFileSync('./json/floating vanity cabinets.json'));
const cabFVanC = JSON.parse(fs.readFileSync('./json/floating vanity channel cabinets.json'));

///// >> Wardrobe Cabinets << //////
const cabWar = JSON.parse(fs.readFileSync('./json/wardrobe cabinets.json'));

const cabLines = [
  { title: 'base cabinets', var: 'cabBase' }, { title: 'base channel cabinets', var: 'cabBaseC' }, { title: 'tall cabinets', var: 'cabTall' }, { title: 'tall channel cabinets', var: 'cabTallC' }, { title: 'wall cabinets', var: 'cabWall' }, { title: 'wall channel cabinets', var: 'cabWallC' }, { title: 'vanity cabinets', var: 'cabVan' }, { title: 'vanity channel cabinets', var: 'cabVanC' }, { title: 'floating vanity cabinets', var: 'cabFVan' }, { title: 'floating vanity channel cabinets', var: 'cabFVanC' }, { title: 'wardrobe cabinets', var: 'cabWar' }];

cabLines.map(line => {
  switch (line.var) {
    case 'cabBase':
      newcabline(line, cabBase);
      break;
    case 'cabBaseC':
      newcabline(line, cabBaseC);
      break;
    case 'cabTall':
      newcabline(line, cabTall);
      break;
    case 'cabTallC':
      newcabline(line, cabTallC);
      break;
    case 'cabWall':
      newcabline(line, cabWall);
      break;
    case 'cabWallC':
      newcabline(line, cabWallC);
      break;
    case 'cabVan':
      newcabline(line, cabVan);
      break;
    case 'cabVanC':
      newcabline(line, cabVanC);
      break;
    case 'cabFVan':
      newcabline(line, cabFVan);
      break;
    case 'cabFVanC':
      newcabline(line, cabFVanC);
      break;
    case 'cabWar':
      newcabline(line, cabWar);
      break;
    default: console.log('didnot find anything');
  }
});



function newcabline(item, cabline) {
  const newCabL = cabline[titleCase(item.title)].map(base => {
    const newBase = {
      active: true,
      lines: {
        custom: false,
        lighthouse: false,
        cornerstone: false,
        modal: false,
        modcon: false
      }, ...base
    };
    basecodes = codes.codes.filter(code => base.code === code.root);
    let active = new Array();
    basecodes.map(act => active.push(act.active));
    if (active.includes(!true)) {
      console.log(active)
      // newBase.active = false;
    }
    newBase.attached = base.attached.map(opt => {
      const atcode = base.code + opt.height;
      const item = basecodes.filter(bc => bc.itemcodes.includes(atcode))[0];
      // console.log(item)
      const newOpt = {
        active: true,
        lines: {
          custom: true,
          lighthouse: true,
          cornerstone: true,
          modal: false,
          modcon: false
        },
        itemcodes: [],
        ...opt
      };
      if (item) {
        newOpt.active = item.active;
        newOpt.lines = item.lines;
        newOpt.itemcodes = item.itemcodes;
        if (item.lines.custom) newBase.lines.custom = true;
        if (item.lines.lighthouse) newBase.lines.lighthouse = true;
        if (item.lines.cornerstone) newBase.lines.cornerstone = true;
        if (item.lines.custom) newBase.lines.custom = true;
        if (item.lines.modal) newBase.lines.modal = true;
      }
      return newOpt;
    })
    return newBase;
  });
  createFile(item.title, newCabL, cabline);
}

function createFile(html, newcodes, oldcodes) {
  // console.log({ newitems: cabBase[titleCase(html)].length, olditems: oldcodes[titleCase(html)].length });
  var json = JSON.stringify({ [titleCase(html)]: [...newcodes] });
  fs.writeFile('node/json/' + html + '.json', json, 'utf8', function (err) {
    if (err) throw err;
    console.log('File is created successfully.');
  });
}

function titleCase(str) {
  if (str == null) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(function (word) {
      if (!word) return;
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(' ');
}
