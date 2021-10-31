var loading = document.getElementById('loading');
var body = document.querySelector('body');
var mask = document.getElementById('mask');
var dialog = document.querySelector('.modal');
var btnAddProduct = document.getElementById('agregar');
var menu = document.getElementById('menu');
var closeIcon = document.getElementById('close-icon');
var cards = document.querySelectorAll('.card');
var iconSearch = document.querySelector('.icon-search').addEventListener('click', () => {
    document.querySelector('.formSearch').submit(); });
var quantityElement = document.getElementById('cantidad');
var closeIcon = document.getElementById('icon-close-modal');
var plusIcon = document.getElementById('plus');
var minusIcon = document.getElementById('minus');
var menuBtn = document.getElementById('menu-btn');
var menuElement = document.getElementById('categories-menu');
var msg = document.getElementById('msg');
var searchInput = document.getElementById('search-box');
var searchSuggestionsElement = document.getElementById('search-suggestions');
var suggestions = null;
var itemsCounterElement = document.querySelector('.items-counter');
var btnDeleteElement = document.getElementById('delete-product');
var loginButton = document.getElementById('login-button');
var loginWindow = document.getElementById('login-window');


mask.addEventListener('click', () => {
    // close all elements on top
});

window.onload = async function() {
    suggestions = await loadSuggestions();
    countItems();

    loading.classList.remove('visible'); 
}

searchInput.addEventListener('keyup', (e) => {
    if(searchInput.value.length > 0) {
        searchSuggestionsElement.classList.add('visible');

        let elements = searchSuggestions(searchInput.value);
        let suggestionsItem = null;

        searchSuggestionsElement.innerHTML = elements;

    } else {
        searchSuggestionsElement.classList.remove('visible');
    }
});

menuBtn.addEventListener('click', () => {
    menuElement.classList.toggle('visible');
});

loginButton.addEventListener('click', () => {
    mask.classList.toggle('visible');
    loginWindow.classList.toggle('flex');
    body.classList.toggle('block-scroll');
});

function openDialog(product) {
    dialog.classList.toggle('flex');
    mask.classList.toggle('visible');
    body.classList.toggle('block-scroll');

    // Get selected product details
    dialog.querySelector('.product-info h1').innerHTML = product.nombre;
    dialog.querySelector('.thumb-big').src = product.img;
    dialog.querySelector('.product-info .price').innerHTML = product.precio;
}

function closeDialog() {
    dialog.classList.toggle('flex');
    mask.classList.toggle('visible');
    body.classList.toggle('block-scroll');

    var topElements = document.getElementsByClassName('top');
    Array.from(topElements).forEach(element => {
        element.classList.remove('visible');
    });
    mask.classList.remove('visible');

    //RESET VIEW
    document.getElementById('cantidad').value = 1;
    document.getElementById('agregar').innerHTML = 'Agregar';
}

function reduceItemsCount() {
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
    element.addEventListener('click', (e) => {

        var parentElement = e.target.parentElement;
        var producto = {};

        if (parentElement.className != 'card') {
            // subir un nivel
            parentElement = parentElement.parentElement;
        }

        // construir objeto producto
        producto = {
            nombre: parentElement.querySelector('.product-name').innerHTML,
            precio: parentElement.querySelector('.product-price').innerHTML,
            img: parentElement.querySelector('.product-thumb').src
        }

        openDialog(producto);
    });
});

plusIcon.addEventListener('click', () => {
    quantityElement.value = parseInt(quantityElement.value) + 1;
});

minusIcon.addEventListener('click', () => {
    if(parseInt(quantityElement.value) > 1) {
        quantityElement.value = parseInt(quantityElement.value) - 1;
    }
});

closeIcon.addEventListener('click', () => {
    closeDialog();
});

btnAddProduct.addEventListener('click', () => {
    var productos = [];
    var producto = {
        nombre: document.querySelector('.product-info h1').innerHTML,
        cantidad: parseInt(document.querySelector('#cantidad').value),
        precio: parseInt(document.querySelector('.price').innerHTML.substr(2)),
        img: document.querySelector('.modal img:first-child').src
    }

    producto.img = producto.img.substr(producto.img.lastIndexOf('/')+1, 10);

    if (sessionStorage.getItem('productos')) {
        productos = JSON.parse(sessionStorage.getItem('productos'));
    }

    productos.push(producto);
    sessionStorage.setItem('productos', JSON.stringify(productos));

    closeDialog();
    reduceItemsCount();    

    // Show 'product added message'
    msg.classList.toggle('visible');
    window.setTimeout(() => {
        msg.classList.toggle('visible');
    }, 5000);
});

function countItems() {
    var productos = JSON.parse(sessionStorage.getItem('productos'));
    var total = 0;

    if(productos) {
        for (var i = 0; i < productos.length; i++) {
            total += parseInt(productos[i].cantidad);
        }
    }

    itemsCounterElement.innerHTML = total;
}

async function loadSuggestions() {
    const response = await fetch('/data/suggestions.json');
    const data = await response.json();
    return data;
}

function searchSuggestions(input) {

    let data = [];
    
    suggestions.forEach((element) => {

        if(element.name.toLowerCase().includes(input.toLowerCase())) {
            data.push(`<p><a href="/search?search=${element.name}">${ element.name }</a></p>`);
        }
    });

    return data;
}