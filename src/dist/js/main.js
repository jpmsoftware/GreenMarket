var body = document.querySelector('body');
var mask = document.getElementById('mask');
var dialog = document.querySelector('.modal');
var menuIcon = document.getElementById('menu-icon');
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
var msg = document.getElementById('msg');
var searchInput = document.getElementById('search-box');
var itemsCounterElement = document.querySelector('.items-counter');
var btnDeleteElement = document.getElementById('delete-product');

mask.addEventListener('click', () => closeDialog());


window.onload = function() {
    CountItems();
}

searchInput.addEventListener('keyup', (e) => {
    if(e.key === "Enter") {

    }
});

function openDialog(product) {
    dialog.classList.toggle('visible');
    mask.classList.toggle('visible');
    body.classList.toggle('block-scroll');

    // Get selected product details
    dialog.querySelector('.product-info h1').innerHTML = product.nombre;
    dialog.querySelector('.thumb-big').src = product.img;
    dialog.querySelector('.product-info .price').innerHTML = product.precio;
}

function closeDialog() {
    dialog.classList.toggle('visible');
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
    CountItems();
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

menuIcon.addEventListener('click', () => {
    body.classList.toggle('block-scroll');
    mask.classList.toggle('visible');
    menu.classList.add('visible');
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

function CountItems() {
    var productos = JSON.parse(sessionStorage.getItem('productos'));
    var total = 0;

    if(productos) {
        for (var i = 0; i < productos.length; i++) {
            total += parseInt(productos[i].cantidad);
        }
    }

    itemsCounterElement.innerHTML = total;
}