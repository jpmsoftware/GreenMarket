
var itemsCounterElement = document.querySelector('.items-counter');

window.onload = () => {
    CountItems();
}

function CountItems() {
    const productos = sessionStorage.getItem('productos');
    var total = 0;
    
    if (productos) {
        for (var i = 0; i < productos.length; i++) {
            
            total += parseInt(productos[i].cantidad);
        }
    }

    itemsCounterElement.innerHTML = total;
}