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
    fetch(`./pod.json`)
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            setGI(data.information);
            setSpecs(data.information);
            setNotes(data.information.notes);
            setImages(data.information);
            setCode(data.rgb);
            setActive(data);
            setActions();
        })
        .catch(err => console.log(err));
    }

    function setImages(info) {
        let style = "";
        if ($.urlParam('code')) {
            style = "inactive";
        }
        const images = `${info.imageCards.map(image => `
		<div class="col s6 m3 l3">
			<div id="imageCard${image.id}" class="card hoverable medium ${style}">
				<div class="card-image waves-effect waves-block waves-light">
					<img class="responsive-img activator" src="${image.image}">
				</div>
				<div class="card-content activator">
					<span><i class="material-icons activator">details</i></span>
					${getTags(image.tags)}
				</div>
				<div class="card-reveal">
				  <span class="card-title blue-grey-text text-darken-3">Codes: <i class="material-icons right">close</i></span>
				  ${getCollections(info, image.links)}
				</div>
			</div>
		</div>        
        `).join('')}`;
        $("#images").html(images);
    }

    function setGI(information) {
        const cat = `<h1 id="topic">${information.title}</h1><h5>${information.subTitle}</h5><div id="actions"></div>`;    
        $("#topic").html(cat);
        const des = `${information.description}`;
        $("#des").html(des);
    }

    function setSpecs(info) {
        const spec = `${info.specifications.map(spec => `
        <div class="card-panel grey lighten-3 bullet">
            <span class="card-title">
                <h4>${spec.title}</h4>
            </span>
            <div class="divider"></div>
            <ul class="flow-text">
                ${li(spec.items)}
            </ul>
        </div>
        <div id="notes-${spec.title}"></div>
        `).join('')}`;
        $("#spec").html(spec);
    }

    function li(list) {
        const lis = `${list.map(li => `<li>${li.content}</li>`).join('')}`;
        return lis;
    }

    function setCode(data) {        
        // console.log($.urlParam('code'));
        if ($.urlParam('code') && data) {
            // console.log(data);
            let id = $.urlParam('code');
            let card = data.filter(function (el) {return el.title == id});
            // console.log(card);
            let cardId = "imageCard" + card[0].cardId;
            document.getElementById(cardId).classList.remove("inactive");
            document.getElementById(card[0].title).className += " active";
            const code = `${card.map(spec => `
            <div class="card horizontal blue-grey lighten-5">
                <div class="detail-card">
                    <span><img class="detail-image materialboxed" src="${spec.image}"></span>
                    <span><img class="detail-image materialboxed" src="${spec.image2}"></span>
                </div>
                <div class="card-content">
                    <div class="collection">
                        <h5 class="collection-item blue-grey-text text-darken-1">${spec.title}</h5>
                        ${makeSpec(spec.specifications)}
                        <div class="collection-item blue-grey-text text-darken-4"><b><ul><li>Code</b>: <span class="ordercode" cart="">${spec.title}</span></li></ul></div>
                    </div>
                </div>
                <a href="pod.html"><i id="close" class="close material-icons">close</i></a>
            </div>
            `).join('')}`;
        $("#code").html(code);
        var currentDiv = null;
        $(document).ready(function() {
            if (parent.shopcart) {
               $("[cart='']").css("cursor","pointer")
               $("[cart='']").attr("title","Click to add this item to your job.")
               addtocartcontextmenu();
               $("#Search").hide();
               $('[href="http://www.nickelscabinets.com/"]').hide();
            }
        });
    
        function addtocartcontextmenu() {
            $("[cart='']").contextMenu({
             menu: 'AddToCartMenu'
            },
    
            function onclick(action, el, pos) {
                //location.href = "main.wcsx?sid=50&pk=" + $(el).attr('pk')
                //    $(this).find('ul').hide();
                switch (action) {
                    case 'add':
                        parent.addtocart(el)
                        break
                    case 'edit':
    
                        break
    
                    default:
                        alert('Feature currently unavailable.')
                }
            });
    
            // This is the left click function
            $("[cart='']").click(function() {
               if (confirm("Do you want to add this item to your order?")) {
                  parent.addtocart(this);
               }
            });
        } 

        }
    }

    function setActive(data) {
        if ($.urlParam('code') && data) {
            let id = $.urlParam('code');
            Materialize.toast(`You are on page ${id}`, 3000);
            $('.materialboxed').materialbox();
        }
    }

    function getLinks(tags) {
        if (!tags) return;
        const keys = `${tags.map(a => `<a id="${a.title}" href="${a.link}">${a.title}</a><br>`).join('')}`;
        return keys;
    }

    function getTags(tags) {
        if (!tags) return;
        const keys = `${tags.map(tag => `<div class="chip">${tag}</div>`).join('')}`;
        return keys;
    }

    function getCollections(info, links) {
        if(!links) return;
        const col = `${info.catagories.map(cat => `
				<div class="collection">
                  <h5 class="collection-item blue-grey-text text-darken-1">${cat.title}</h5>
                  ${makeLink(cat, links)}
                </div>
        `).join('')}`
        return col;
    }

    function makeLink(catagory, links) {
        if(!links) return;
        let filteredLinks = links.filter(function (el) {return el.cat == catagory.id});
        const linkArray = `${filteredLinks.map(link => `<a id="${link.link}" href="?code=${link.link}" class="collection-item deep-orange-text text-darken-4">${link.title} - ${link.link}</a>`).join('')}`;
        return linkArray;
    }

    function makeSpec(items) {
        const item = `${items.map(i => `<div class="collection-item blue-grey-text text-darken-4"><b>${i.title}</b>:  <code>${i.content}</code></div>`).join('')}`;
        return item;
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
                let n = `${cards.map(note => `
                <div class="card orange lighten-4">
                    <p class="note flow-text">
                        <i class="material-icons">announcement</i>
                        ${note.content}
                    </p>
                </div>`).join('')}`;                
            $("#notes-Specifications").html(n);
        })
        .catch(err => console.log(err));
    }

    function setActions() {           
        let action = `
            <div class="fixed-action-btn toolbar">
                <a class="btn-floating btn-large red">
                    <i class="large material-icons">assistant</i>
                </a>
                <ul>
                    <li class="waves-effect waves-light"><a href="#TopPage"><i class="material-icons">arrow_upward</i> Top</a></li>
                    <li class="waves-effect waves-light"><a href="#BottomPage"><i class="material-icons">arrow_downward</i> Bottom</a></li>
                    <li class="waves-effect waves-light"><a href="../index.html"><i class="material-icons">arrow_back</i> Back</a></li>
                    
                </ul>
            </div>`;
        $("#actions").html(action);
    }