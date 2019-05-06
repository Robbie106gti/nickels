function loadTabs() {
  $(document).ready(function() {
    $('.tabs').tabs();
  });
  console.log('tabs run');
}

document.onload = setTimeout(function() {
  loadTabs();
}, 500);
