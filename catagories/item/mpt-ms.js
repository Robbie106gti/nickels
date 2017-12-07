//// Main js for catagories /////
'use strict';
$.ajax({
    url: "../../layout/header.html", 
    context: document.body,
    success: function(response) {
        $("#header").html(response);
    }
});
$.ajax({
    url: "../../layout/footer.html", 
    context: document.body,
    success: function(response) {
        $("#footer").html(response);
    }
});

window.onload = getPage();