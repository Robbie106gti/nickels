function ordercodes(code) {
  document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.tooltipped');
    var instances = M.Tooltip.init(elems, options);
  });
  return '<span class="ordercode tooltipped" data-position="top" data-tooltip="Click here to add ' + code + ' to your order.">' + code + '</span>';
}

function htmlAddCodes(html, codes) {
  return codes.map(function (code) {
    return html.replace(code, ordercodes(code))
  });
}
