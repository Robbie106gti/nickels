function toasts() {
  if ($.urlParam('code')) {
    let id = $.urlParam('code');
    Materialize.toast(`You are on page ${id}`, 3000);
    $('.materialboxed').materialbox();
  }
}
