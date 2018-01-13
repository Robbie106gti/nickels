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

var edge = '';
var ua = window.navigator.userAgent;
var msie = ua.indexOf("Edge/");
if(msie !== -1) {
var edge = ua.split('Edge/')
if (edge[1] < 16) {
    edge = 'col s3';
    }
} 

function getPage() {
    
    $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results==null){
           return null;
        }
        else{
           let url = decodeURI(results[1]) || 0;
           url = url.toLowerCase();
           return url;
        }
    }
    const code = $.urlParam('code');
    const page = $.urlParam('page');
    makeStructure(page, code);
    fetch(`./loox.json`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data = data.information;
            if(!code && !page) {
                const html = `${data.map(cat => cardWith(cat)              
                ).join('')}`;
                $('#catalog').html(html);
                let info = { cat: "Loox", root: page, height: code, title: "LED lighting" };
                setGI(info);
                makeHelper();
            }
        })
        .catch(err => console.log(err));
    }
    
    function makeStructure(page, code) {
        let index = `
        <div class="col s12 m6">
            <p>Page not Found.</p>
        </div>`;
        switch(page) {
            case 'spots': 
                let info = { cat: "LED spots kits", root: page, height: code, title: "Round led kit" };
                let tabs = [{ title: "Round" }, { title: "Square" }]
                makeTabs(tabs, page, code);
                setGI(info);
                break;
            
            default:
            $("#catalog").html(index);
        }
    }

    function setGI(page) {
        let topic = `
        <a href="./index.html" class="right">
          <i class="small material-icons">arrow_back</i>
        </a>
        <div id="actions"></div>
        <div>
            <h1 id="titleHeader">${page.cat}</h1>
            <h5 id="subHeader">${page.root ? page.root + ' : ' : '' }${page.title}</h5>
        </div>
        <div class="fixed-action-btn" style="top: 125px; right: 24px;">
        <a class="waves-effect waves-light btn btn-floating cyan" onclick="$('.tap-target').tapTarget('open')">?</a>
        </div>
        <div id="helper"></div>    
        `;
        $("#topic").html(topic);
    }

    function makeTabs(tabs, page, code) {
        let spots = `<div><ul id="tabs-swipe-demo" class="tabs">
                       ${tabs.map(tab => {
                           let title = tab.title.toLowerCase();
                           if (title === code) { return `<li class="tab col s3"><a class="active" href="#${tab.title}">Kit ${tab.title}</a></li>` }
                           else { return `<li class="tab col s3"><a href="#${tab.title}">Kit ${tab.title}</a></li>` }
                       }).join('')}
                    </ul>
                    ${tabs.map(tab => {
                        return `<div id="${tab.title}" class="col s12">Kit ${tab.title} <img src="http://localhost:5500/assets/loox/${code}.png"></div>`
                    }).join('')}</div>`;
        $("#catalog").html(spots);
    }

    function titleCase(str) {
        return str.toLowerCase().split(' ').map(function(word) {
          return word.replace(word[0], word[0].toUpperCase());
        }).join(' ');
      }

    function cardWith(cat) {
        const card =  `<div class="card ${edge}">
                <div class="card-image waves-effect waves-block waves-light">
                    <img class="image20 activator" src="${cat.image}">
                </div>
                <div class="card-content">
                    <span class="card-title activator grey-text text-darken-4">${cat.title}<i class="material-icons right">more_vert</i></span>
                    ${getTags(cat.tags)}
                </div>
                <div class="card-reveal">
                    <span class="card-title grey-text text-darken-4">${cat.title}<i class="material-icons right">close</i></span>
                    ${getLinks(cat)} 
                </div>
            </div>`;
        return card;
    }

    function getLinks(cat) {
        if (!cat.attached) return;
        const keys = `${cat.attached.map(a => formatLink(a)).join('')}`;
        return keys;
    }

    function formatLink(a) {
        let link = `<a href="./index.html?page=${a.page}&code=${a.item}">${a.item}</a><br>`;
        return link;
        
    }

    function getTags(tags) {
        if (!tags) return;
        const keys = `${tags.map(tag => `<div class="chip">${tag}</div>`).join('')}`;
        return keys;
    }

    function makeHelper() {
        let help = `<div class="fixed-action-btn" style="bottom: 45px; right: 24px;">
          <a id="menu" class="btn btn-floating btn-large cyan"><i class="material-icons">menu</i></a>
        </div>
        <!-- Tap Target Structure -->
        <div class="tap-target" data-activates="menu">
          <div class="tap-target-content" style="text-align: right;">
            <h5>Steps</h5>
            <p>
                <b>Step 1:</b> Choise kind of light, strip or spot.<br>
                <b>Step 2:</b> Where do you want to apply the light?<br>
                <b>Step 3:</b> Choice a driver.<br>
                <b>Step 4:</b> Do you need a switch?<br>
                <b>Step 5:</b> Do you need extensions?
            </p>
          </div>
        </div>`;
        $('#helper').html(help);
    }
