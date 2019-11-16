const noCambia = "Leonidas";

let cambia = "@LeonidasEsteban"

function cambiarNombre(nuevoNombre) {
  cambia = nuevoNombre
}

const getUserAll = new Promise(function(todoBien, todoMal) {
  // llamar a un api
  setTimeout(function() {
    // luego de 3 segundos
    todoBien('se acabó el tiempo');
  }, 5000)
})

const getUser = new Promise(function(todoBien, todoMal) {
  // llamar a un api
  setTimeout(function() {
    // luego de 3 segundos
    todoBien('se acabó el tiempo 3');
  }, 3000)
})

// getUser
//   .then(function() {
//     console.log('todo está bien en la vida')
//   })
//   .catch(function(message) {
//     console.log(message)
//   })

Promise.race([
  getUser,
  getUserAll,
])
.then(function(message) {
  console.log(message);
})
.catch(function(message) {
  console.log(message)
})



$.ajax('https://randomuser.me/api/', {
  method: 'GET',
  success: function(data) {
    console.log(data)
  },
  error: function(error) {
    console.log(error)
  }
})
// Aqui se ve como usar un api con javascript puro y jquery
fetch('https://randomuser.me/api/')
  .then(function (response) {
    // console.log(response)
    return response.json()
  })
  .then(function (user) {
    console.log('user', user.results[0].name.first)
  })
  .catch(function() {
    console.log('algo falló')
  });

  
(async function load(){
  async function getData(url){
    const responsive=await fetch(url)
    const data =await responsive.json()
    return data;
    // En esta parte es una funcion para usar fetch y poder traer las apis
  }
  
  const $featuringContainer=document.getElementById("featuring");
  const $home=document.getElementById("home");
  const $form=document.getElementById("form");
  
  function setAttributes($element, attributes) {
    for (const attribute in attributes) {
      $element.setAttribute(attribute, attributes[attribute]);
      // Esta es un funcion para agregar los atributos al carte cuando lo encontremos
    }
  }

  const BASE_API = 'https://yts.am/api/v2/';

  function featuringTemplate(peli) {
    return (
      `
      <div class="featuring">
        <div class="featuring-image">
          <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
        </div>
        <div class="featuring-content">
          <p class="featuring-title">Pelicula encontrada</p>
          <p class="featuring-album">${peli.title}</p>
        </div>
      </div>
      `
    )
  }

  $form.addEventListener('submit', async (event) => {
    event.preventDefault();
    $home.classList.add('search-active')
    const $loader = document.createElement('img');
    setAttributes($loader, {
      src: 'src/images/loader.gif',
      height: 50,
      width: 50,
    })
    $featuringContainer.append($loader);
    // Esta funcion es para cuando busquemos algo en la barra de busqueda el codigo genere un cartel con la pelicula encontrada
    const data = new FormData($form);
    const {
      data:{
        movies:pelis
      }
    } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)
    const HTMLString = featuringTemplate(pelis[0]);
    $featuringContainer.innerHTML = HTMLString;
  })

  const actionList = await getData(`${BASE_API}list_movies.json?genre=action`)
  const dramaList = await getData(`${BASE_API}list_movies.json?genre=drama`)
  const animationList = await getData(`${BASE_API}list_movies.json?genre=animation`)
  console.log(actionList, dramaList, animationList)

  // const $home=$(".home");
  const $actionContainer=document.querySelector("#action");
  const $dramaContainer=document.getElementById("drama");
  const $animationContainer=document.getElementById("animation");
  
  function videoItemTemplate(movie,category) {
    return (
      `<div class="primaryPlaylistItem" data-id="${movie.id}" data-category="${category}">
        <div class="primaryPlaylistItem-image">
          <img src="${movie.medium_cover_image}">
        </div>
        <h4 class="primaryPlaylistItem-title">
          ${movie.title}
        </h4>
      </div>`
    )//Esta funcion es para generar las imagenes que nos trae el api en el formato que queremos
  }
  function createTemplate(HTMLString){
    const html=document.implementation.createHTMLDocument();
    html.body.innerHTML=HTMLString;
    return html.body.children[0]
  } // En esta funcion se va crear un elemento de HTML  para luego agregarle contenido :)
  function addEventClick($element){
    $element.addEventListener("click",()=>{
      showModal($element)
    })
    // $("div").on("click", function(){})
  }
  function renderMovieList(list,$container,category){
    // actionList.data.movies
    $container.children[0].remove();
    list.forEach((movie)=>{
      const HTMLString=videoItemTemplate(movie,category);
      const movieElement=createTemplate(HTMLString);
      $container.append(movieElement);
      addEventClick(movieElement);
    })

  }
  
  renderMovieList(actionList.data.movies,$actionContainer,"action")
  renderMovieList(dramaList.data.movies,$dramaContainer,"drama")
  renderMovieList(animationList.data.movies,$animationContainer,"animation")
  
  
  const $modal=document.getElementById("modal");
  const $overlay=document.getElementById("overlay");
  const $hideModal=document.getElementById("hide-modal");
  
  const $modalTitle=$modal.querySelector("h1");
  const $modalImage=$modal.querySelector("img");
  const $modalDrescription=$modal.querySelector("p");

  function showModal($element){
    $overlay.classList.add("active");
    $modal.style.animation="modalIn .8s forwards"
    const id =$element.dataset.id
    const category=$element.dataset.category;
  }
  $hideModal.addEventListener("click",hideModal);
  function hideModal(){
    $overlay.classList.remove("active");
    $modal.style.animation="modalout .8s forwards"
  }

})()