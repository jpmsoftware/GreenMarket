var body = document.querySelector('html');
var modal = document.querySelector('.modal');
var darkLayer = document.querySelector('.dark-layer');

window.onclick = function (e) {
    if (e.target.className == 'dark-layer') {
        CloseModal();
    }
}

modal.onclick = (e) => {
    switch (e.target.id) {
        case 'icon-close':
            CloseModal();
            break;

        case 'plus':
            document.getElementById('cantidad').value = parseInt(document.getElementById('cantidad').value) + 1;
            break;

        case 'minus':
            //prevent negative values
            if (parseInt(document.getElementById('cantidad').value) > 1) {
                document.getElementById('cantidad').value = parseInt(document.getElementById('cantidad').value) - 1;
            }
            break;

        case 'agregar':
            var producto = {
                nombre: document.querySelector('.product-info h1').innerHTML,
                marca: document.querySelector('.product-info .product-brand').innerHTML,
                cantidad: parseInt(document.querySelector('#cantidad').value)
            }
            let productos = [];
            if (sessionStorage.getItem('productos')) {
                productos = JSON.parse(sessionStorage.getItem('productos'));
            }
            productos.push(producto);
            sessionStorage.setItem('productos', JSON.stringify(productos));
            CountItems();
            UnifyItems();
            let button = document.querySelector('.product-info .button');
            button.style.backgroundColor = '#3BB143';
            button.innerHTML = 'Agregado';
            setTimeout(CloseModal, 2000);
            break;
    }
}

function OpenModal(product) {
    modal.style.display = 'flex';
    darkLayer.style.display = 'block';
    body.style.overflow = 'hidden';

    //GET SELECTED PRODUCT DETAILS
    modal.querySelector('.product-info h1').innerHTML = product.nombre;
    modal.querySelector('.product-info .product-brand').innerHTML = product.marca;
    modal.querySelector('.product-info .price').innerHTML = product.precio;
    modal.querySelector('.thumb-big').src = product.img;
    modal.querySelector('.product-content').innerHTML = product.content;
}

function CloseModal() {
    modal.style.display = 'none';
    darkLayer.style.display = 'none';
    body.style.overflowY = 'scroll';

    //RESET VIEW
    document.getElementById('cantidad').value = 1;
    document.getElementById('agregar').style.background = '#000';
    document.getElementById('agregar').innerHTML = 'Agregar';
}

function UnifyItems() {
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