function setImages(images, title, height) {
  var image = images
    .map(function(image) {
      return '<div class="card">\n                            <div class="padding">\n                                <img class="responsive-img materialboxed" src="'
        .concat(image.image, '">\n                                ')
        .concat(
          image.image2 !== undefined
            ? '<img class="responsive-img materialboxed" src="'.concat(
                image.image2,
                '">'
              )
            : '',
          '\n                                <span class="card-title black-text"><b>'
        )
        .concat(image.title)
        .concat(title, ' ')
        .concat(
          height,
          '" high</b></span>\n                            </div>\n                        </div>'
        );
    })
    .join('');
  $('#images').html(image);
}
