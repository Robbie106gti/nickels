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
    fetch(`../../json/codes.json`)
        .then(response => response.json())
        .then(data => {
            let codes = data[`codes`];
            let page = codes.filter(function(el) { return el.code === code })
            page = page[0];
            setGI(page);
            setCode(page);
            setActive();
        })
        .catch(err => console.log(err));
    }  
    
    function makeStructure() {
        let main = `
        <div class="col s12 m6">
            <div id="des"></div>
            <div id="specs"></div>
            <div id="notes"></div>
        </div>
        <div class="col s12 m6">
            <div id="images"></div>
        </div>
        <div class="col s12 m12">
            <div id="codes" class="col s12 m6"></div>
            <div id="options" class="col s12 m6"></div>
        </div>`;
        $("#catalog").html(main);
    }

    function setCode(page) {
         let des = `<div class="card-panel  blue-grey darken-1 white-text">
                        <span class="card-title">
                            <h4>Description</h4>
                        </span>
                        <div class="divider"></div>
                        <span id="des" class="flow-text">${page.title}, ${page.description}</span>
                    </div>`;
        $("#des").html(des);
        let specs = `<div class="card-panel grey lighten-3 bullet">
                        <span class="card-title">
                            <h4>Specifications</h4>
                        </span>
                        <div class="divider"></div>
                        <div id="specli"></div>
                    </div>`;
        $("#specs").html(specs);
        setSpecs(page.specifications, page);
        codeTable(page);
        setImages(page.images, page.title, page.height);
        setNotes(page.notes);
        setActions(page);
        setOptions(page);
    }

    function setGI(page) {
        let topic = `
        <a href="../index.html?cat=${page.cat}" class="right">
          <i class="small material-icons">arrow_back</i>
        </a>
        <div id="actions"></div>
        <div>
            <h1 id="titleHeader">${page.cat}</h1>
            <h5 id="subHeader">${page.root}__${page.height} : ${page.title} ${page.height}" high</h5>
        </div>        
        `;
        $("#topic").html(topic);
    }
    
    function setActive() {
        if ($.urlParam('code')) {
            let id = $.urlParam('code');
            Materialize.toast(`You are on page ${id}`, 3000);
            $('.materialboxed').materialbox();
        }
    }

    function setSpecs(specs, page) {
        fetch(`../../json/specifications.json`)
            .then(response => response.json())
            .then(data => {
                let spec = data['specifications'].filter(function(el, i) {
                    let t = specs.includes(el.id);
                    let id;
                    if(t === true) { id = el.id } else {  id = t }
                    return el.id === id;
                });
                let n = `${spec.map(n => `<li><b>${n.title}</b>: ${n.content}</li>`).join('')}`;
                    // console.log(spec);
                n = `<ul class="flow-text">
                        <li id="dim">${setDim(page)}</li>
                        ${n}
                    </ul>`;
                $("#specli").html(n);
        })
        .catch(err => console.log(err));
        let s = `${specs.map(spec => `
        <li><b>${spec.title}</b>: ${spec.content}</li>`).join('')}`;
        return s;
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

    function setImages(images, title, height) {
        let image = `${images.map(image => `
                        <div class="card">
                            <div class="padding">
                                <img class="responsive-img materialboxed" src="${image.image}">
                                <img class="responsive-img materialboxed" src="${image.image2}">
                                <span class="card-title black-text"><b>${image.title}${title} ${height}" high</b></span>
                            </div>
                        </div>`
                        ).join('')}`;
        $("#images").html(image);
    }

    function codeTable(page) {
        let table = `
        <div class="card padding">
            <table class="striped highlight centered">
                <thead>
                <tr>
                    <th>Cabinet Widths</th>
                    <th>Order Codes</th>
                </tr>
                </thead>
                <tbody id="tbody">                
                    ${page.widths.map(code => `<tr><td>${code}"</td><td class="ordercode">${page.root}${code}${page.height}</td></tr>`).join('')}   
                </tbody>
            </table>
            ${additional(page)}
        </div>
        `;
        $("#codes").html(table);
    }

    function setActions(page) {
        // console.log(page)
        let cat = page.cat.toLowerCase();
        fetch(`../../json/${cat}.json`)
            .then(response => response.json())
            .then(data => {
                
                let card = data[page.cat].filter(function(el, i) {
                    return el.code === page.root;
                });
                card = card[0];
                // console.log(card);                
                let action = `
                    <div class="fixed-action-btn toolbar">
                        <a class="btn-floating btn-large red">
                            <i class="large material-icons">assistant</i>
                        </a>
                        <ul>
                            <li class="waves-effect waves-light"><a href="#TopPage"><i class="material-icons">arrow_upward</i> Top</a></li>
                            <li class="waves-effect waves-light"><a href="#BottomPage"><i class="material-icons">arrow_downward</i> Bottom</a></li>
                            <li class="waves-effect waves-light"><a href="./index.html?cat=${page.cat}"><i class="material-icons">arrow_back</i> Back</a></li>
                        </ul>
                    </div>
                    <!-- Dropdown Trigger -->
                    <a class='dropdown-button btn bot red' data-activates='dropdown1'>Related items</a>
                  
                    <!-- Dropdown Structure -->
                    <ul id='dropdown1' class='dropdown-content red'>
                        ${makeActions(card)}
                    </ul>
                    `;
                $("#actions").html(action);
                $('.dropdown-button').dropdown({
                    inDuration: 300,
                    outDuration: 225,
                    constrainWidth: true, // Does not change width of dropdown to that of the activator
                    hover: true, // Activate on hover
                    gutter: 0, // Spacing from edge
                    belowOrigin: true, // Displays dropdown below the button
                    alignment: 'left', // Displays dropdown with edge aligned to the left of button
                    stopPropagation: false // Stops event propagation
                  }
                );
        })
        .catch(err => console.log(err));
    }

    function makeActions(card) {
        let action = `${card.attached.map(a => `<li class="waves-effect waves-light"><a class="white-text" href="./${a.link}.html?code=${card.code}${a.height}"><i class="material-icons">art_track</i>${a.height}" high</a></li>`).join('')}`;
        return action;
    }

    function setDim(page) {
        fetch(`../../json/iwhd.json`)
            .then(response => response.json())
            .then(data => {
                let dim = data['iwhd'].filter(function(el, i) {
                    let t = page.iwhd.includes(el.id);
                    let id;
                    if(t === true) { id = el.id } else {  id = t }
                    return el.id === id;
                });
                let n = `<ul><b>Dimensional adjustments</b>:${dim.map(iwhd => 
                        `<li class="second"><i class="material-icons">tune</i> ${iwhd.title} - ${iwhd.content}</li>`
                   ).join('')}</ul>`;
                    // console.log(n);
                $("#dim").html(n);
        })
        .catch(err => console.log(err));
    }

    function setOptions(page) {
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

    function additional(page) {
        if(!page.additional) { return ``; }
        let add = `<br><div class="divider"></div><br>
        <table class="striped highlight centered">
            <thead><tr>
            ${page.additional.header.map(h => `<th>${h}</th>`).join('')}
            </tr></thead>
            <tbody id="tbody">
            ${page.additional.rows.map(r => `<tr><td>${r.cw}</td><td>${r.fw}</td><td>${r.l}</td><td>${r.dw}</td></tr>`).join('')}
            </tbody>
        </table>
        ${addnotes(page.additional)}`;
        ;
        return add;
    }

    function addnotes(add) {
        if (!add.notes) { return ``; }
        let tnotes = `<ul>
            ${add.notes.map(n => `<li>${n}</li>`).join('')}
            </ul>
            <img src="${add.image}"/>
            `;
       return tnotes;
    }