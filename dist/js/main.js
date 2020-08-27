var timer = 0;
var body = document.querySelector('html');
var sliders = document.querySelectorAll('.slider-item');
var sliderControls = document.querySelectorAll('.slider-circles div');
var modal = document.getElementById('modal');
var darkLayer = document.getElementById('dark-layer');
var itemsCounter = document.getElementById('items-counter');
var sliderIndex = 0;
var cardsOfertas = '';
var cardsMasVendidos = '';
var ofertasIndex = 0;
var masVendidosIndex = 0;
var start = 0, end = start + 3;

window.onload = () => {

    //CARGAR DATOS DEMO
    fetch("./data/ofertas.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let cardsFetched = '';
            for (var i = 0; i < data.length; i++) {
                cardsFetched += `
                    <div class="card">
                        <img src="${data[i].img}" alt="thumb" class="product-thumb">
                        <p class="product-content">${data[i].cantidad}</p>
                        <hr>
                        <h4 class="product-name">${data[i].nombre}</h4>
                        <h5 class="product-brand">${data[i].marca}</h5>
                        <p class="product-price">$ ${data[i].precio}</p>
                    </div>
                `
            }
            let parent = document.querySelector('#content-ofertas');
            parent.innerHTML = cardsFetched;
            cardsOfertas = document.querySelectorAll('#content-ofertas .card');
            //LOAD INITIAL DATA
            for (var i = 0; i < cardsOfertas.length; i++) {
                if (i < 4) {
                    cardsOfertas[i].style.display = 'block';
                } else {
                    cardsOfertas[i].style.display = 'none';
                }
            }
        })

    fetch("./data/masvendidos.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let cardsFetched = '';
            for (var i = 0; i < data.length; i++) {
                cardsFetched += `
                    <div class="card">
                        <img src="${data[i].img}" alt="thumb" class="product-thumb">
                        <p class="product-content">${data[i].cantidad}</p>
                        <hr>
                        <h4 class="product-name">${data[i].nombre}</h4>
                        <h5 class="product-brand">${data[i].marca}</h5>
                        <p class="product-price">$ ${data[i].precio}</p>
                    </div>
                `
            }
            let parent = document.querySelector('#content-mas-vendidos');
            parent.innerHTML = cardsFetched;
            cardsMasVendidos = document.querySelectorAll('#content-mas-vendidos .card');
            //LOAD INITIAL DATA
            for (var i = 0; i < cardsMasVendidos.length; i++) {
                if (i < 4) {
                    cardsMasVendidos[i].style.display = 'block';
                } else {
                    cardsMasVendidos[i].style.display = 'none';
                }

            }
        })
    CountItems();
    AutoSlide(sliderIndex);
}

window.onclick = function (e) {
    if (e.target.id == 'dark-layer') {
        CloseModal();
    }

    if (e.target.className == 'circle') {
        for (var i = 0; i < sliderControls.length; i++) {
            //get clicked index
            if (sliderControls[i] == e.target) {
                sliderIndex = i;
                AutoSlide();
            }
        }
    }

    if (e.target.parentElement.className == 'card' || e.target.className == 'card') {
        //get clicked card values
        var product = {
            nombre: e.target.parentElement.getElementsByClassName('product-name')[0].innerHTML,
            marca: e.target.parentElement.getElementsByClassName('product-brand')[0].innerHTML,
            precio: e.target.parentElement.getElementsByClassName('product-price')[0].innerHTML,
            content: e.target.parentElement.getElementsByClassName('product-content')[0].innerHTML,
            img: e.target.parentElement.getElementsByClassName('product-thumb')[0].src
        }
        OpenModal(product);
    }

    if (e.target.parentElement.id == 'ofertas') {
        if (e.target.id == 'arrow-left') {
            Pagination('ofertas', 'down');
        }
        if (e.target.id == 'arrow-right') {
            Pagination('ofertas', 'up');
        }
    }
    if (e.target.parentElement.id == 'masvendidos') {
        if (e.target.id == 'arrow-left') {
            Pagination('masvendidos', 'down');
        }
        if (e.target.id == 'arrow-right') {
            Pagination('masvendidos', 'up');
        }
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
            setTimeout(CloseModal, 3000);
            break;
    }
}

function AutoSlide() {
    clearTimeout(timer);
    if (sliderIndex > 2) { sliderIndex = 0; }
    PaintControls();
    //RESET ALL
    for (var i = 0; i < sliders.length; i++) {
        sliders[i].style.display = 'none';
    }
    sliders[sliderIndex].style.display = 'block';
    sliderIndex++;
    timer = setTimeout(AutoSlide, 5000);
}

function PaintControls() {
    //RESET ALL
    for (var i = 0; i < sliderControls.length; i++) {
        sliderControls[i].style.background = 'transparent';
    }
    sliderControls[sliderIndex].style.background = '#fff';
}

function Pagination(section, direction) {
    let max;
    switch (section) {
        case 'ofertas':
            max = cardsOfertas.length;
            switch (direction) {
                case 'down':
                    if (start > 0) {
                        end = start - 1;
                        start = end - 3;

                        for (var i = 0; i < max; i++) {
                            if (i >= start && i <= end) {
                                cardsOfertas[i].style.display = 'block';
                            } else {
                                cardsOfertas[i].style.display = 'none';
                            }
                        }
                    }
                    break;

                case 'up':
                    if (end < max - 1) {
                        start = end + 1;
                        end = start + 3;

                        for (var i = 0; i < cardsOfertas.length; i++) {
                            if (i >= start && i <= end) {
                                cardsOfertas[i].style.display = 'block';
                            } else {
                                cardsOfertas[i].style.display = 'none';
                            }
                        }
                    }
                    break;
            }
            break;

        case 'masvendidos':
            max = cardsMasVendidos.length;
            switch (direction) {
                case 'down':
                    if (start > 0) {
                        end = start - 1;
                        start = end - 3;

                        for (var i = 0; i < max; i++) {
                            if (i >= start && i <= end) {
                                cardsMasVendidos[i].style.display = 'block';
                            } else {
                                cardsMasVendidos[i].style.display = 'none';
                            }
                        }
                    }
                    break;

                case 'up':
                    if (end < max - 1) {
                        start = end + 1;
                        end = start + 3;
                        for (var i = 0; i < cardsMasVendidos.length; i++) {
                            if (i >= start && i <= end) {
                                cardsMasVendidos[i].style.display = 'block';
                            } else {
                                cardsMasVendidos[i].style.display = 'none';
                            }
                        }
                    }
                    break;
            }
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

function CountItems() {
    let total = 0;
    if (sessionStorage.getItem('productos')) {
        let productos = JSON.parse(sessionStorage.getItem('productos'));
        for (var i = 0; i < productos.length; i++) {
            total += productos[i].cantidad;
        }
    }
    else {
        total = 0;
    }
    itemsCounter.innerHTML = total;
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
