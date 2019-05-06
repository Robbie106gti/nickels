const ordercodes = document.getElementsByClassName('ordercode');

ordercodes.map(oc => {
  const dp = document.createAttribute('data-position');
  dp.value = 'top';
  oc.setAttributeNode(dp);
  const dt = document.createAttribute('data-tooltip');
  dt.value = 'Click here to add ' + oc.innerHTML + ' to your job.';
  oc.setAttributeNode(dt);
}).then(() => prep());

function prep() {
  console.log('tooltipped!')
  $(document).ready(function () {
    $('.tooltipped').tooltip();
  });
}
