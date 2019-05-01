try {
  getJoke();

} catch (error) {
  Console.log('OOps! no joke for you :(')
}


async function getJoke() {
  const dadjokes = 'https://icanhazdadjoke.com/';

  const request = new Request(dadjokes, {
    method: 'GET',
    headers: new Headers({ Accept: 'application/json' })
  });
  fetch(request)
    .then(function (response) {
      var contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      }
      throw new TypeError("Oops, we haven't got JSON!")
    })
    .then(function (data) {
      console.log(data.joke)

      if (data.joke) {
        const joke = data.joke
        const el = document.getElementById('dadjoke');
        if (joke && el) {
          const html = '<div style="text-align:center;" class="card-panel"><span class"chip">' + joke + '</span> <br><small>From api: https://icanhazdadjoke.com</small></div>'
          el.classList.add('row');
          el.innerHTML = html;
        }
      }
    })
    .catch(function (err) { console.log(err) });
}
