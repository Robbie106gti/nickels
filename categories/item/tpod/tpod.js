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
      console.log(data)
      setGI(data.information);
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
