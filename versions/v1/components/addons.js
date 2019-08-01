function addons(page) {
  try {
    fetch(`../../versions/v1/json/addons.json`, { cache: "reload" })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        let addons = data['addons'].filter(function (el, i) {
          let t = page.options.includes(el.id);
          let id;
          if (t === true) {
            id = el.id;
          } else {
            id = t;
          }
          return el.id === id;
        });
        let n =
          '<div class="card padding"><h4>Addional Customizations:</h4><ul class="collapsible popout" data-collapsible="accordion">' +
          addons
            .map(function (addon) {
              return (
                '<li class="white"><div class="collapsible-header"><i class="material-icons">' +
                addon.icon +
                '</i>' +
                addon.title +
                '</div><div class="collapsible-body"><span><b>' +
                addon.title +
                '</b> ' +
                addon.content +
                '</span></div></li>'
              );
            })
            .join('') +
          '</ul></div>';
        $('#options').html(n);
        $(document).ready(function () {
          $('.collapsible').collapsible();
        });
      })
      .catch(function (err) {
        return console.log(err);
      });

  } catch (error) {

    console.log('Addons had a issue to load, see error:' + error)
  }
}
