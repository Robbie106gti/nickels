function headerFooter(location) {
  // console.log(location);
  if (location === null) {
    location = '../../../';
  }
  var header = location + 'layout/header.html';
  var footer = location + 'layout/footer.html';
  $.ajax({
    url: header,
    context: document.body,
    success: function (response) {
      $('#header').html(response);
    }
  });
  $.ajax({
    url: footer,
    context: document.body,
    success: function (response) {
      $('#footer').html(response);
    }
  });
}
