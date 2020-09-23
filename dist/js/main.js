var timer = 0;
var body = document.querySelector('html');
var sliders = document.querySelectorAll('.slider-item');
var sliderControls = document.querySelectorAll('.slider-circles div');
var modal = document.getElementById('modal');
var darkLayer = document.getElementById('dark-layer');
var itemsCounter = document.getElementById('items-counter');
const arrows = document.querySelectorAll('.arrows');
var sliderIndex = 0;
var cardsOfertas = '';
var cards = document.querySelectorAll('.card');
var cardsMasVendidos = '';
var menuIcon = document.querySelector('.menu-bars');
var menu = document.querySelector('.menu');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('change');

    if (menu.style.display == 'none' || menu.style.display == '') {
        menu.style.display = 'block';
    } else {
        menu.style.display = 'none';
    }

}

arrows.forEach((element) => {
    element.addEventListener('click', (e) => { Arrows(e) });
});

cards.forEach((element) => {
    element.addEventListener('click', (e) => {

        var padre = e.target.parentElement;
        var producto = {};

        if (padre.className != 'card') {
            // subir un nivel
            padre = padre.parentElement;
        }

        // construir objeto producto
        producto = {
            nombre: padre.querySelector('.product-name').innerHTML,
            marca: padre.querySelector('.product-brand').innerHTML,
            precio: padre.querySelector('.product-price').innerHTML,
            content: padre.querySelector('.product-content').innerHTML,
            img: padre.querySelector('.product-thumb').src
        }

        console.log(producto);

        OpenModal(producto);
    });
});

sliderControls.forEach((element) => {
    element.addEventListener('click', (e) => {
        for (var i = 0; i < sliderControls.length; i++) {
            //get clicked index
            if (sliderControls[i] == e.target) {
                sliderIndex = i;
                AutoSlide();
            }
        }
    });
});

window.onload = () => {
    CountItems();
    AutoSlide(sliderIndex);
}

window.onclick = function (e) {
    if (e.target.id == 'dark-layer') {
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
            setTimeout(CloseModal, 3000);
            break;
    }
}

function AutoSlide() {
    clearTimeout(timer);

    if (sliderIndex > 2) { sliderIndex = 0; }

    PaintControls();

    // Reset all
    for (var i = 0; i < sliders.length; i++) {
        sliders[i].style.display = 'none';
    }

    sliders[sliderIndex].style.display = 'block';

    sliderIndex++;

    timer = setTimeout(AutoSlide, 5000);
}

function PaintControls() {

    // Reset all
    for (var i = 0; i < sliderControls.length; i++) {
        sliderControls[i].style.background = 'transparent';
    }

    sliderControls[sliderIndex].style.background = '#fff';
}

function Arrows(e) {
    // Recorrer array y mostrar acorde
    var seccion = e.target.parentElement.id;
    var direccion = e.target.name;
    console.log(ofertas.end);

    for (let i = ofertas.start; i < ofertas.end; i++) {
        // Dirección
        ofertas[i].nombre;
    }

    seccion.start = seccion.end + 1;
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