var cards = document.querySelectorAll('.card');
var iconSearch = document.querySelector('.icon-search').addEventListener('click', () => {
    document.querySelector('.formSearch').submit();
});

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
            marca: parentElement.querySelector('.product-brand').innerHTML,
            precio: parentElement.querySelector('.product-price').innerHTML,
            content: parentElement.querySelector('.product-content').innerHTML,
            img: parentElement.querySelector('.product-thumb').src
        }

        OpenModal(producto);
    });
});