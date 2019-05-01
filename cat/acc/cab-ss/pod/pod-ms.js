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

function getPage() {

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
    // const cat = $.urlParam('cat');
    // let catagory = cat.toLowerCase();
    // console.log(catagory);
    fetch('./pod.json').then(function (response) {
        return response.json();
    }).then(function (data) {
        // console.log(data)
        setGI(data.information);
        setSpecs(data.information);
        setNotes(data.information.notes);
        setImages(data.information);
        setCode(data.rgb);
        setActive(data);
        setActions();
    }).catch(function (err) {
        return console.log(err);
    });
}

function setImages(info) {
    var style = "";
    if ($.urlParam('code')) {
        style = "inactive";
    }
    var images = '' + info.imageCards.map(function (image) {
        return '\n\t\t<div class="col s6 m3 l3">\n\t\t\t<div id="imageCard' + image.id + '" class="card hoverable medium ' + style + '">\n\t\t\t\t<div class="card-image waves-effect waves-block waves-light">\n\t\t\t\t\t<img class="responsive-img activator" src="' + image.image + '">\n\t\t\t\t</div>\n\t\t\t\t<div class="card-content activator open">\n\t\t\t\t\t<span><i class="material-icons activator">details</i></span>\n\t\t\t\t\t' + getTags(image.tags) + '\n\t\t\t\t</div>\n\t\t\t\t<div class="card-reveal">\n\t\t\t\t  <span class="card-title blue-grey-text text-darken-3">Codes: <i class="material-icons right">close</i></span>\n\t\t\t\t  ' + getCollections(info, image.links) + '\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>        \n        ';
    }).join('');
    $("#images").html(images);
}

function setGI(information) {
    var cat = '<h1 id="topic">' + information.title + '</h1><h5>' + information.subTitle + '</h5><div id="actions"></div>';
    $("#topic").html(cat);
    var des = '' + information.description;
    $("#des").html(des);
}

function setSpecs(info) {
    var spec = '' + info.specifications.map(function (spec) {
        return '\n        <div class="card-panel grey lighten-3 bullet">\n            <span class="card-title">\n                <h4>' + spec.title + '</h4>\n            </span>\n            <div class="divider"></div>\n            <ul class="flow-text">\n                ' + li(spec.items) + '\n            </ul>\n        </div>\n        <div id="notes-' + spec.title + '"></div>\n        ';
    }).join('');
    $("#spec").html(spec);
}

function li(list) {
    var lis = '' + list.map(function (li) {
        return '<li>' + li.content + '</li>';
    }).join('');
    return lis;
}

function setCode(data) {
    // console.log($.urlParam('code'));
    if ($.urlParam('code') && data) {
        // console.log(data);
        var id = $.urlParam('code');
        var card = data.filter(function (el) {
            return el.title == id;
        });
        // console.log(card);
        var cardId = "imageCard" + card[0].cardId;
        document.getElementById(cardId).classList.remove("inactive");
        document.getElementById(card[0].title).className += " active";
        var code = '' + card.map(function (spec) {
            return '\n            <div class="card horizontal blue-grey lighten-5">\n                <div class="detail-card">\n                    <span><img class="detail-image materialboxed" src="' + spec.image + '"></span>\n                    <span><img class="detail-image materialboxed" src="' + spec.image2 + '"></span>\n                </div>\n                <div class="card-content">\n                    <div class="collection">\n                        <h5 class="collection-item blue-grey-text text-darken-1">' + spec.title + '</h5>\n                        ' + makeSpec(spec.specifications) + '\n                        <div class="collection-item blue-grey-text text-darken-4"><b>Code</b>:  <code class="ordercode">' + spec.title + '</code></div>\n                    </div>\n                </div>\n                <a href="pod.html"><i id="close" class="close material-icons">close</i></a>\n            </div>\n            ';
        }).join('');
        $("#code").html(code);
    }
}

function setActive(data) {
    if ($.urlParam('code') && data) {
        var id = $.urlParam('code');
        Materialize.toast('You are on page ' + id, 3000);
        $('.materialboxed').materialbox();
    }
}

function getLinks(tags) {
    if (!tags) return;
    var keys = '' + tags.map(function (a) {
        return '<a id="' + a.title + '" href="' + a.link + '">' + a.title + '</a><br>';
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

function getCollections(info, links) {
    if (!links) return;
    var col = '' + info.catagories.map(function (cat) {
        return '\n\t\t\t\t<div class="collection">\n                  <h5 class="collection-item blue-grey-text text-darken-1">' + cat.title + '</h5>\n                  ' + makeLink(cat, links) + '\n                </div>\n        ';
    }).join('');
    return col;
}

function makeLink(catagory, links) {
    if (!links) return;
    var filteredLinks = links.filter(function (el) {
        return el.cat == catagory.id;
    });
    var linkArray = '' + filteredLinks.map(function (link) {
        return '<a id="' + link.link + '" href="?code=' + link.link + '" class="collection-item deep-orange-text text-darken-4">' + link.title + ' - ' + link.link + '</a>';
    }).join('');
    return linkArray;
}

function makeSpec(items) {
    var item = '' + items.map(function (i) {
        return '<div class="collection-item blue-grey-text text-darken-4"><b>' + i.title + '</b>:  <code>' + i.content + '</code></div>';
    }).join('');
    return item;
}

function setNotes(notes) {
    fetch('../../json/notes.json').then(function (response) {
        return response.json();
    }).then(function (data) {
        var cards = data['notes'].filter(function (el, i) {
            var t = notes.includes(el.id);
            var id;
            if (t === true) {
                id = el.id;
            } else {
                id = t;
            }
            return el.id === id;
        });
        var n = '' + cards.map(function (note) {
            return '\n                <div class="card orange lighten-4">\n                    <p class="note flow-text">\n                        <i class="material-icons">announcement</i>\n                        ' + note.content + '\n                    </p>\n                </div>';
        }).join('');
        $("#notes-Specifications").html(n);
    }).catch(function (err) {
        return console.log(err);
    });
}

function setActions() {
    var action = '\n            <div class="fixed-action-btn toolbar">\n                <a class="btn-floating btn-large red">\n                    <i class="large material-icons">assistant</i>\n                </a>\n                <ul>\n                    <li class="waves-effect waves-light"><a href="#TopPage"><i class="material-icons">arrow_upward</i> Top</a></li>\n                    <li class="waves-effect waves-light"><a href="#BottomPage"><i class="material-icons">arrow_downward</i> Bottom</a></li>\n                    <li class="waves-effect waves-light"><a href="../index.html?cat=Accessories"><i class="material-icons">arrow_back</i> Back</a></li>\n                    \n                </ul>\n            </div>';
    $("#actions").html(action);
}