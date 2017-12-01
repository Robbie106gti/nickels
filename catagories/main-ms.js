//// Main js for catagories /////
'use strict';
$.ajax({
    url: "../layout/header.html", 
    context: document.body,
    success: function(response) {
        $("#header").html(response);
    }
});
$.ajax({
    url: "../layout/footer.html", 
    context: document.body,
    success: function(response) {
        $("#footer").html(response);
    }
});
$.ajax({
    url: "../layout/loader.html", 
    context: document.body,
    success: function(response) {
        $("#loader").html(response);
    }
});

window.onload = getSubs();
document.getElementById("catalog").classList.remove('grid');

function getSubs() {
    
        $.urlParam = function (name) {
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            if (results == null) {
                return null;
            } else {
                return decodeURI(results[1]) || 0;
            }
        };
        // console.log(decodeURIComponent($.urlParam('cat'))); 
        // output: General Information
        var cat = $.urlParam('cat');
        setGI(cat);
        var catagory = cat.toLowerCase();
        // console.log(catagory);
        fetch('../json/' + catagory + '.json').then(function (response) {
            return response.json();
        }).then(function (data) {
            // console.log(data['catalog']);
            data = data[cat];
            var html = '' + data.map(function (cat) {
                return '\n                    <div class="card col s3">\n                        <div class="card-image waves-effect waves-block waves-light">\n                            <img class="image20 activator" src="' + cat.image + '">\n                        </div>\n                        <div class="card-content">\n                            <span class="card-title activator grey-text text-darken-4">' + cat.title + '<i class="material-icons right">more_vert</i></span>\n                            ' + getTags(cat.tags) + '\n                        </div>\n                        <div class="card-reveal">\n                            <span class="card-title grey-text text-darken-4">' + cat.title + '<i class="material-icons right">close</i></span>\n                            ' + getLinks(cat) + ' \n                        </div>\n                    </div>\n                \n                ';
            }).join('');
            $('#catalog').html(html);
        }).catch(function (err) {
            return console.log(err);
        });
    }
    
    function setGI(title) {
        var cat = '<h1 id="topic">' + title + '</h1>';
        $("#topic").html(cat);
    }
    
    function getLinks(cat) {
        if (!cat.attached) return;
        var keys = '' + cat.attached.map(function (a) {
            return '<a href="./item/' + a.link + '.html?code=' + cat.code + a.height + '">' + a.height + ' Inch high</a><br>';
        }).join('');
        return keys;
    }
    
    function getTags(tags) {
        if (!tags) return;
        var keys = '' + tags.map(function (tag) {
            return '<div class="chip">' + tag + '</div>';
        }).join('');
        return keys;
    }