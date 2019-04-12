function getTags(tags) {
  var _this = this;

  if (!tags) return;
  var keys = ''.concat(
    tags
      .map(
        function(tag) {
          _newArrowCheck(this, _this);

          return '<span class="chip activator">'.concat(tag, '</span>');
        }.bind(this)
      )
      .join('')
  );
  return keys;
}
