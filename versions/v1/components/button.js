function button(name, icon, fnc) {
  let button = '<button class="waves-effect waves-light btn" onClick="fnc">';
  button = icon ? '<i class="material-icons ' + icon.loc + '">' + icon.name + '</i>' : '';
  button = name + '</button>';
  return button;
}

