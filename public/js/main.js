var suggestions = null;
var loading = document.getElementById('loading');
var header = document.getElementById('header');
var body = document.querySelector('body');
var mask = document.getElementById('mask');
var dialog = document.querySelector('.modal');
var burger = document.getElementById('burger');
var mobileMenu = document.getElementById('header-bottom');
var btnAddProduct = document.getElementById('agregar');
var favourites = document.getElementById('favourites');
var iconClose = document.getElementById('icon-close');
var closeIcon = document.getElementById('icon-close-modal');
var cards = document.querySelectorAll('.card');
var btnSearch = document.getElementById('btn-search');
var quantityElement = document.getElementById('cantidad');
var iconSearch = document.getElementById('icon-search');
var searchForm = document.getElementById('form-search');
var plusIcon = document.getElementById('plus');
var minusIcon = document.getElementById('minus');
var menuElement = document.getElementById('categories-menu');
var msg = document.getElementById('msg');
var searchInput = document.getElementById('search-box');
var searchSuggestionsElement = document.getElementById('search-suggestions');
var itemsCounterElement = document.querySelector('.items-counter');
var loginButton = document.getElementById('login');
var loginWindow = document.getElementById('login-window');

window.onload = async function () {
  suggestions = await loadSuggestions();

  countItems();

  loading.classList.remove('visible');
}

window.onscroll = () => {
  if (window.scrollY >= 400) {
    header.classList.add('sticky');
  } else {
    header.classList.remove('sticky');
  }
}

favourites.addEventListener('click', () => {
  alert('Aún no ha agregado ningun producto a "favoritos"');
});

searchInput.addEventListener('keyup', (e) => {
  if (searchInput.value.length > 0) {
    let elements = searchSuggestions(searchInput.value);

    searchSuggestionsElement.classList.add('visible');

    searchSuggestionsElement.innerHTML = '';

    elements.forEach((element) => {
      let paragraph = document.createElement('p');
      let anchor = document.createElement('a');

      anchor.innerHTML = element;
      anchor.href = `/search?search=${element}`;

      paragraph.appendChild(anchor);

      searchSuggestionsElement.appendChild(paragraph);
    });

  } else {
    searchSuggestionsElement.classList.remove('visible');
  }
});

btnSearch.addEventListener('click', () => document.forms.namedItem('form-search').submit());

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('visible');
  body.classList.toggle('block-scroll');
});

iconClose.addEventListener('click', () => {
  mobileMenu.classList.remove('visible');
});

iconSearch.addEventListener('click', () => {
  alert();
  // searchForm.classList.toggle('visible');
});

loginButton.addEventListener('click', () => {
  mask.classList.toggle('visible');
  loginWindow.classList.toggle('flex');
  body.classList.toggle('block-scroll');
});

mask.addEventListener('click', () => {
  closeTopElements();
});

function openProduct(product) {
  dialog.classList.toggle('flex');
  mask.classList.toggle('visible');
  body.classList.toggle('block-scroll');

  // Get selected product details
  dialog.querySelector('.product-info h1').innerHTML = product.nombre;
  dialog.querySelector('.product-description').innerHTML = product.descripcion;
  dialog.querySelector('.thumb-big').src = product.img;
  dialog.querySelector('.product-info .price').innerHTML = product.precio;

  document.getElementById('cantidad').value = 1;
  document.getElementById('agregar').innerHTML = 'Agregar';
}

function reduceItemsCount() {
  //unify same products

  let productos = JSON.parse(sessionStorage.getItem('productos'));

  for (var i = 0; i < productos.length; i++) {
    for (var x = i + 1; x < productos.length; x++) {
      //Si hay dos elementos idénticos, unificar sus cantidades, y borrar el segundo elemento
      if (productos[i].nombre == productos[x].nombre) {
        productos[i].cantidad += productos[x].cantidad;
        productos.splice(x);
      }
    }
  }
  sessionStorage.setItem('productos', JSON.stringify(productos));
  countItems();
}

cards.forEach((element) => {
  element.addEventListener('click', () => {

    producto = {
      nombre: element.querySelector('.product-name').innerHTML,
      descripcion: element.querySelector('.product-description').innerHTML,
      precio: element.querySelector('.product-price').innerHTML,
      img: element.querySelector('.product-thumb').src
    }

    openProduct(producto);
  });
});

plusIcon.addEventListener('click', () => quantityElement.value = parseInt(quantityElement.value) + 1);

minusIcon.addEventListener('click', () => {
  if (parseInt(quantityElement.value) > 1) {
    quantityElement.value = parseInt(quantityElement.value) - 1;
  }
});

closeIcon.addEventListener('click', () => closeTopElements());

btnAddProduct.addEventListener('click', () => {
  let productos = [];
  let producto = {
    nombre: document.querySelector('.product-info h1').innerHTML,
    cantidad: parseInt(document.querySelector('#cantidad').value),
    precio: parseInt(document.querySelector('.price').innerHTML.substr(2)),
    img: document.querySelector('.modal img:first-child').src
  }

  producto.img = producto.img.substr(producto.img.lastIndexOf('/') + 1, 10);

  if (sessionStorage.getItem('productos')) {
    productos = JSON.parse(sessionStorage.getItem('productos'));
  }

  productos.push(producto);
  sessionStorage.setItem('productos', JSON.stringify(productos));

  closeTopElements();
  reduceItemsCount();

  // Show 'product added message'
  msg.classList.toggle('visible');
  document.getElementById('product-name').innerHTML = producto.nombre;
  document.getElementById('product-thumb').src = '/data/thumbs/' + producto.img;

  window.setTimeout(() => {
    msg.classList.toggle('visible');
  }, 5000);
});

function countItems() {
  var productos = JSON.parse(sessionStorage.getItem('productos'));
  var total = 0;

  if (productos) {
    for (var i = 0; i < productos.length; i++) {
      total += parseInt(productos[i].cantidad);
    }
  }

  itemsCounterElement.innerHTML = total;
}

async function loadSuggestions() {
  // load suggestions.json file
  let file = await fetch('/data/suggestions.json');

  let data = await file.json();

  return data;
}

function searchSuggestions(input) {

  let data = [];

  suggestions.forEach((element) => {

    if (data.length < 6) {
      if (element.name.toLowerCase().includes(input.toLowerCase())) {
        data.push(element.name);
      }
    }
  });
  return data;
}

function closeTopElements() {
  let topElements = document.getElementsByClassName('top');

  Array.from(topElements).forEach(element => {
    element.classList.remove('visible');
    element.classList.remove('flex');
  });

  body.classList.remove('block-scroll');
  mask.classList.remove('visible');
}