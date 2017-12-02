//// Main js for catagories /////
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
$.ajax({
    url: "../../layout/loader.html", 
    context: document.body,
    success: function(response) {
        $("#loader").html(response);
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
    const code = $.urlParam('code');
    makeStructure();
    fetch(`../../json/general information.json`)
        .then(response => response.json())
        .then(data => {
            let codes = data[`items`];
            let page = codes.filter(function(el) { return el.code === code })
            page = page[0];
            setGI(page);
            setDes(page);
            setPar(page);
            setimages(page);
            setNotes(page.notes);
            setOptions(page);
            console.log(page)
        })
        .catch(err => console.log(err));
    }  
    
    function makeStructure() {
        let main = `
        <div class="col s12 m6 card">
            <div id="des"></div>
            <div id="para" class="flow-text"></div>
        </div>
        <div id="images" class="col s12 m6">
        </div>
        <div class="col s12 m12">
            <div id="notes" class="col s12 m6"></div>
            <div id="options" class="col s12 m6"></div>
        </div>`;
        $("#catalog").html(main);
    }
    
    function setGI(page) {
        let topic = `
        <a href="../index.html?cat=${page.cat}" class="right">
            <i class="small material-icons">arrow_back</i>
        </a>
        <div id="actions"></div>
        <div>
            <h1 id="titleHeader">${page.cat}</h1>
            <h5 id="subHeader">${page.title}</h5>
        </div>        
        `;
        $("#topic").html(topic);
    }
    
    function setDes(page) {
        let topic = `<h5 id="subHeader"">${page.description}</h5><div class="divider"></div>`;
        $("#des").html(topic);
    }
    
    function setPar(page) {
        let para = `${page.paragraphs.map(n => `<p class="${n.class}">${n.text}</p>`).join('')}`;
        $("#para").html(para);
    }
    
    function setimages(page) {
        let imag = `${page.images.map(image => `<div class="card">
        <div class="padding">
            <img class="responsive-img materialboxed" src="${image.image}">
            ${imageTitle(image)}
        </div>
    </div>`).join('')}`;
        $("#images").html(imag);
    }

    function imageTitle(image) {
        if(image.title === "") { return ''; }
        let title = `<span class="card-title black-text"><b>${image.title}</b></span>`;
        return title;
    }
    
    function setNotes(notes) {
        fetch(`../../json/notes.json`)
            .then(response => response.json())
            .then(data => {
                let cards = data['notes'].filter(function(el, i) {
                    let t = notes.includes(el.id);
                    let id;
                    if(t === true) { id = el.id } else {  id = t }
                    return el.id === id;
                });
                let n = `${cards.map(note => 
                        `
                        <div class="card orange lighten-4">
                            <p class="note flow-text">
                                <i class="material-icons">announcement</i>
                                <b>${note.title}</b>${note.content}<a href="${note.link}">${note.contentLink}<a/>${note.ccontent}
                            </p>
                        </div>`
                    ).join('')}`;
                    // console.log(n);
                $("#notes").html(n);
        })
        .catch(err => console.log(err));
    }

    function setOptions(page) {
        if(page.options.length === 0) return;
        fetch(`../../json/addons.json`)
            .then(response => response.json())
            .then(data => {
                let addons = data['addons'].filter(function(el, i) {
                    let t = page.options.includes(el.id);
                    let id;
                    if(t === true) { id = el.id } else {  id = t }
                    return el.id === id;
                });
                let n = `
                <div class="card padding">
                    <h4>Addional Customizations:</h4>
                        <ul class="collapsible popout" data-collapsible="accordion">
                        ${addons.map(addon => 
                        `<li class="white">
                          <div class="collapsible-header"><i class="material-icons">${addon.icon}</i>${addon.title}</div>
                          <div class="collapsible-body"><span><b>${addon.title}</b> ${addon.content}</span></div>
                        </li>`
                   ).join('')}
                   </ul></div>`;
                   // console.log(n);
                $("#options").html(n);
                $(document).ready(function(){
                    $('.collapsible').collapsible();
                  });
        })
        .catch(err => console.log(err));
    }