//// Main js for entry-point /////
'use strict';
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
  window.Promise = Promise;
}

window.onload = getCatalog();
document.getElementById("catalog").classList.remove('grid');
function getCatalog() {
    fetch('./json/catalog.json').then(function (response) {
        return response.json();
    }).then(function (data) {
        // console.log(data['catalog']);
        data = data['catalog'];
        var html = '' + data.map(function (cat) {
            return '\n                <div class="card col s3 hiie"><a href="' + cat.link + '">\n                    <div class="card-image waves-effect waves-block waves-light">\n                        <img class="image20 activator" src="' + cat.image + '">\n                    </div>\n                    <div class="card-content">\n                        <span class="card-title activator grey-text text-darken-4">' + cat.title + '</span>\n                        ' + getTags(cat.tags) + '\n                    </div></a>\n                </div>\n                ';
        }).join('');
        $('#catalog').html(html);
    }).catch(function (err) {
        return console.log(err);
    });
}

function getTags(tags) {
    if (!tags) return;
    var keys = '' + tags.map(function (tag) {
        return '<div class="chip">' + tag + '</div>';
    }).join('');
    return keys;
}

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.Promise=t()}(this,function(){"use strict";function e(){}function t(e,t){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,f._immediateFn(function(){var i=1===e._state?t.onFulfilled:t.onRejected;if(null!==i){var r;try{r=i(e._value)}catch(e){return void o(t.promise,e)}n(t.promise,r)}else(1===e._state?n:o)(t.promise,e._value)})):e._deferreds.push(t)}function n(e,t){try{if(t===e)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==typeof t||"function"==typeof t)){var n=t.then;if(t instanceof f)return e._state=3,e._value=t,void i(e);if("function"==typeof n)return void r(function(e,t){return function(){e.apply(t,arguments)}}(n,t),e)}e._state=1,e._value=t,i(e)}catch(t){o(e,t)}}function o(e,t){e._state=2,e._value=t,i(e)}function i(e){2===e._state&&0===e._deferreds.length&&f._immediateFn(function(){e._handled||f._unhandledRejectionFn(e._value)});for(var n=0,o=e._deferreds.length;o>n;n++)t(e,e._deferreds[n]);e._deferreds=null}function r(e,t){var i=!1;try{e(function(e){i||(i=!0,n(t,e))},function(e){i||(i=!0,o(t,e))})}catch(e){if(i)return;i=!0,o(t,e)}}function f(e){if(!(this instanceof f))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],r(e,this)}var u=setTimeout,c=f.prototype;return c.catch=function(e){return this.then(null,e)},c.then=function(n,o){var i=new this.constructor(e);return t(this,new function(e,t,n){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=n}(n,o,i)),i},f.all=function(e){return new f(function(t,n){function o(e,f){try{if(f&&("object"==typeof f||"function"==typeof f)){var u=f.then;if("function"==typeof u)return void u.call(f,function(t){o(e,t)},n)}i[e]=f,0==--r&&t(i)}catch(e){n(e)}}if(!e||void 0===e.length)throw new TypeError("Promise.all accepts an array");var i=Array.prototype.slice.call(e);if(0===i.length)return t([]);for(var r=i.length,f=0;i.length>f;f++)o(f,i[f])})},f.resolve=function(e){return e&&"object"==typeof e&&e.constructor===f?e:new f(function(t){t(e)})},f.reject=function(e){return new f(function(t,n){n(e)})},f.race=function(e){return new f(function(t,n){for(var o=0,i=e.length;i>o;o++)e[o].then(t,n)})},f._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){u(e,0)},f._unhandledRejectionFn=function(e){void 0!==console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)},f});