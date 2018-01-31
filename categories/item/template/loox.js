//// Main js for catagories /////
$.ajax({
    url: "../../../layout/header.html", 
    context: document.body,
    success: function(response) {
        $("#header").html(response);
    }
});
$.ajax({
    url: "../../../layout/footer.html", 
    context: document.body,
    success: function(response) {
        $("#footer").html(response);
    }
});
    
window.onload = getPage();

function getPage() {
    
    $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results==null){
           return null;
        }
        else{
           return decodeURI(results[1]) || 0;
        }
    }
    // console.log(decodeURIComponent($.urlParam('cat'))); 
    // output: General Information
    // const cat = $.urlParam('cat');
    // let catagory = cat.toLowerCase();
    // console.log(catagory);
    fetch(`./loox.json`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch(err => console.log(err));
    }