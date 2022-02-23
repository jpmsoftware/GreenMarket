const loading = document.getElementById('loading');
const header = document.getElementById('header');
const body = document.querySelector('body');
const mask = document.getElementById('mask');
const dialog = document.querySelector('.modal');
const btnAddProduct = document.getElementById('agregar');
const closeIcon = document.getElementById('icon-close-modal');
const cards = document.querySelectorAll('.card');
const btnSearch = document.getElementById('btn-search');
const quantityElement = document.getElementById('cantidad');
const plusIcon = document.getElementById('plus');
const minusIcon = document.getElementById('minus');
const menuElement = document.getElementById('categories-menu');
const msg = document.getElementById('msg');
const searchInput = document.getElementById('search-box');
const searchSuggestionsElement = document.getElementById('search-suggestions');
const itemsCounterElement = document.querySelector('.items-counter');
const loginButton = document.getElementById('login-button');
const loginWindow = document.getElementById('login-window');
var suggestions = null;

window.onload = async function () {
    suggestions = await loadSuggestions();
    countItems();

    loading.classList.remove('visible');
}

window.onscroll = () => {
    if (window.scrollY >= 400) {
        header.classList.add('sticky');
        header.classList.add('border-bottom');
    } else {
        header.classList.remove('sticky');
        header.classList.remove('border-bottom');
    }
}

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

loginButton.addEventListener('click', () => {
    mask.classList.toggle('visible');
    loginWindow.classList.toggle('flex');
    body.classList.toggle('block-scroll');
});

mask.addEventListener('click', () => {
    hideTopElements();
});

function openProduct(product) {
    dialog.classList.toggle('flex');
    mask.classList.toggle('visible');
    body.classList.toggle('block-scroll');

    // Get selected product details
    dialog.querySelector('.product-info h1').innerHTML = product.nombre;
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

closeIcon.addEventListener('click', () => hideTopElements());

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

    hideTopElements();
    reduceItemsCount();

    // Show 'product added message'
    msg.classList.toggle('visible');
    document.getElementById('product-name').innerHTML = producto.nombre;
    document.getElementById('product-thumb').src = '/data/thumbs/'+ producto.img;

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
    const response = await fetch('/data/suggestions.json');
    const data = await response.json();
    return data;
}

function searchSuggestions(input) {

    let data = [];

    suggestions.forEach((element) => {

        if(data.length < 6) {
            if (element.name.toLowerCase().includes(input.toLowerCase())) {
                data.push(element.name);
            }
        }
    });
    return data;
}

function hideTopElements() {
    let topElements = document.getElementsByClassName('top');
    
    Array.from(topElements).forEach(element => {
        element.classList.remove('visible');
        element.classList.remove('flex');
    });

    body.classList.remove('block-scroll');
    mask.classList.remove('visible');
}