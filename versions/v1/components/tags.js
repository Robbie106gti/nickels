function getTags(tags) {
  const keys = ''.concat(
    tags
      .map(function(tag) {
        let html = '<span class="chip activator">'.concat(tag, '</span>');
        return html;
      })
      .join('')
  );
  return keys;
}
