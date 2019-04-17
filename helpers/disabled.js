function disableItem(item) {
  console.log(item)
  var disabled;
  if (item.active === false) disabled = 'disabled';
  if (pline) {
    if (item.lines) {
      if (item.lines[pline] === false) disabled = 'disabled';
    }
  }
  if (disabled) {
    const gi = document.getElementById('top');
    gi.classList.add(disabled);
    const at = document.getElementById('subHeader').innerText;
    at.innerHTML = at + ' - NOT AVAILABLE in ' + pline;
    console.log(at)
  }
}
