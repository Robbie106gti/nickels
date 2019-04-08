function getTags(tags) {
  var _this = this;

  if (!tags) return;
  var keys = ''.concat(
    tags
      .map(
        function (tag) {
          _newArrowCheck(this, _this);

          return '<div class="chip">'.concat(tag, '</div>');
        }.bind(this)
      )
      .join('')
  );
  return keys;
}
