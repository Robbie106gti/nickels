function setCode(code) {
  document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.tooltipped');
    var instances = M.Tooltip.init(elems, options);
  });
  var code =
    '<div class="card-panel blue accent-1"><p class="flow-text"><b><i class="material-icons">add_shopping_cart</i> Click the ordercode to add to your job: </b><span class="ordercode tooltipped" data-position="top" data-tooltip="Click here to add ' + code + ' to your order.">' +
    code +
    '</span></p></div>';
  return code;
}
