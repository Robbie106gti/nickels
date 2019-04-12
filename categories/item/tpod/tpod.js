//// Main js for catagories /////
$.ajax({
  url: "../../../layout/header.html",
  context: document.body,
  success: function (response) {
    $("#header").html(response);
  }
});
$.ajax({
  url: "../../../layout/footer.html",
  context: document.body,
  success: function (response) {
    $("#footer").html(response);
  }
});

window.onload = getPage();

function getPage() {
  $.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
      return null;
    } else {
      return decodeURI(results[1]) || 0;
    }
  }
  // console.log(decodeURIComponent($.urlParam('cat'))); 
  // output: General Information
  // const cat = $.urlParam('cat');
  // let catagory = cat.toLowerCase();
  // console.log(catagory);
  fetch(`./tpod.json`)
    .then(response => response.json())
    .then(data => {
      const item = data.information;
      // console.log(item)
      setGI(item);
      setSpecs(item.specifications);
      setNotes(item.notes);
      setImages(item);
    })
    .catch(err => console.log(err));
}

function setGI(information) {
  const cat = `<h1 id="topic">${information.title}</h1><h5>${information.subTitle}</h5><div id="actions"></div>`;
  $("#topic").html(cat);
  const des = `${information.description}`;
  $("#des").html(des);
}

function titleCase(str) {
  if (str == null) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      if (!word) return;
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(" ");
}

function setMainImage(info) {
  const main = `<div class="card card-panel"><div class="center"><span class="card-title ">Images</span></div>
    ${exampleImages(info)}
    <img class="responsive-img materialboxed" src="${info.mainImage}"></div>`;
  return main;
}

function setImages(info) {
    const images = `<div class="col s6 m6 l5">
    ${info.baskets.map(basket => `<div class="col s12 m12 l6">
      <div id="imageCard${basket.code}" class="card hoverable tooltipped" data-position="top" data-tooltip="Click to see width options and codes">
        <div class="card-image waves-effect waves-block waves-light">
          <img class="responsive-img activator" src="${basket.image}">
        </div>
        <div class="card-content activator open">
          <span><i class="material-icons activator">details</i></span>
          Hardware codes with <b>${basket.title}</b> baskets
        </div>
        <div class="card-reveal">
          <span class="card-title blue-grey-text text-darken-3">Codes: <i class="material-icons right">close</i></span>
          ${getCollections(info, basket)}
        </div>
      </div>
    </div>        
    `).join('')}</div><div class="col s6 m6 l3">${setMainImage(info)}</div>`;
    $("#images").html(images);
    $(document).ready(function(){
      $('.materialboxed').materialbox();
    });
    $(document).ready(function(){
      $('.tooltipped').tooltip();
    });
}

function setSpecs(specs) {
    const spec = `
    <div class="card-panel grey lighten-3 bullet">
        <span class="card-title">
            <h4>Specifications</h4>
        </span>
        <div class="divider"></div>
        <ul class="flow-text">
            ${li(specs)}
        </ul>
    </div>
    <div id="notes"></div>
    `;
    $("#spec").html(spec);
}

function getTags(tags) {
    if (!tags) return;
    const keys = `${tags.map(tag => `<div class="chip">${tag}</div>`).join('')}`;
    return keys;
}

function li(list) {
    const lis = `${list.map(li => `<li><b>${li.title}: </b><br>${li.content}.</li>`).join('')}`;
    return lis;
}

function getCollections(info, basket) {
    if(!basket) return;
    const col = `
    <div class="collection">
      <h5 class="collection-item blue-grey-text text-darken-1">${basket.title} basket width options</h5>
      <ul>
      ${info.widths.map(width => {
        const wcode = `${info.code}-${width}-${basket.code}`;
        const li = `<li class="collection-item">
                      Code for ${width}" TBR<br>
                      <span class="ordercode tooltipped" data-position="top" data-tooltip="add to order" onclick="addCodenow(${'\''+wcode+'\''})">${wcode}</span>
                    </li>`;
        return li;
      }).join('')}
      </ul>
    </div>`;
    return col;
}

function setNotes(notes) {
  let n = `${notes.map(note => `
  <div class="card orange lighten-4">
      <p class="note flow-text">
          <i class="material-icons">announcement</i>
          <b>${note.title}, </b>
          ${note.content}<br>
          ${note.codes.map(code => `${code.title}: <span class="ordercode tooltipped" data-position="top" data-tooltip="add to order" onclick="addCodenow(${'\''+code.code+'\''})">${code.code}</span><br>`).join('')}
      </p>
  </div>`).join('')}`;  
  $("#notes").html(n);
}

function exampleImages(info) {
  let icons = `${info.images.map(image => {
    return im = `<div class="box-image">
                  <img src="${image.image}" class="materialboxed tooltipped" data-position="top" data-tooltip="click to enlarge" data-caption="${image.title}">
               </div>`;
  }).join('')}`;
  return icons;
}

// This is the left click function 2018 
function addCodenow(wcode) {
	 if (confirm(`Do you want to add ${wcode} item to your order?`)) {
     wcode = `<span>${wcode}</span>`;
	   parent.addtocart(wcode);
	 }
  }