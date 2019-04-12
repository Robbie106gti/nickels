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

function setMainImage(info) {
  var main = '<div class="card card-panel"><div class="center"><span class="card-title ">Images</span></div>\n    '
    .concat(
      exampleImages(info),
      '\n    <img class="responsive-img materialboxed" src="'
    )
    .concat(info.images[0].image, '"></div>');
  return main;
}

function exampleImages(info) {
  var icons = ''.concat(
    info.images
      .map(function(image) {
        return (im = '<div class="box-image">\n                  <img src="'
          .concat(
            image.image,
            '" class="materialboxed tooltipped" data-position="top" data-tooltip="click to enlarge" data-caption="'
          )
          .concat(image.title, '">\n               </div>'));
      })
      .join('')
  );
  return icons;
}
