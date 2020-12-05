var arrows = document.querySelectorAll('.arrows');
var cardsOfertas = '';
var cards = document.querySelectorAll('.card');
var cardsMasVendidos = '';

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

        OpenModal(producto);
    });
});


function Arrows(e) {
    // Recorrer array y mostrar acorde
    var seccion = e.target.parentElement.id;
    var direccion = e.target.name;

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
