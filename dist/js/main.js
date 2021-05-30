var cards = document.querySelectorAll('.card');

var iconSearch = document.querySelector('.icon-search').addEventListener('click', () => {
    document.querySelector('.formSearch').submit();
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