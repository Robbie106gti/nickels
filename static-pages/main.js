//// Main js for entry-point /////

$.ajax({
    url: "./layout/header.html", 
    context: document.body,
    success: function(response) {
        $("#header").html(response);
    }
});
$.ajax({
    url: "./layout/footer.html", 
    context: document.body,
    success: function(response) {
        $("#footer").html(response);
    }
});
$.ajax({
    url: "./layout/loader.html", 
    context: document.body,
    success: function(response) {
        $("#loader").html(response);
    }
});
/* $.ajax({
    url: "/json/catalog.json", 
    context: document.body,
    success: function(response) {
        console.log(response)
        $("#catalog").html(response);
    }
}); */

// To add to window
if (!window.Promise) {
    import Promise from 'promise-polyfill';
  window.Promise = Promise;
  import 'whatwg-fetch';
}

window.onload = getCatalog();

function getCatalog() {
    fetch('./json/catalog.json')
        .then(response => response.json())
        .then(data => {
            // console.log(data['catalog']);
            data = data['catalog'];
           const html = `${data.map(cat =>
                `
                <div class="card"><a href="${cat.link}">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img class="image20 activator" src="${cat.image}">
                    </div>
                    <div class="card-content">
                        <span class="card-title activator grey-text text-darken-4">${cat.title}</span>
                        ${getTags(cat.tags)}
                    </div></a>
                </div>
                `
            ).join('')}`;
            $('#catalog').html(html);
        })
        .catch(err => console.log(err));
    }

    function getTags(tags) {
        if (!tags) return;
        const keys = `${tags.map(tag => `<div class="chip">${tag}</div>`).join('')}`;
        return keys;
    }