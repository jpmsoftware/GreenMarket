var deleteButtons = document.getElementsByClassName('btn-delete-product');
var buttonBuy = document.getElementById('button-carrito');
var productos = null;
var totalElement = document.getElementById('total');

function updateTable() {
    productos = JSON.parse(sessionStorage.getItem('productos'));
    var output = '';

    if (productos === null || productos.length === 0) {

        table.style.display = 'none';
        document.getElementById('msg-carrito').classList.toggle('visible');
        totalElement.classList.remove('visible');
        buttonBuy.classList.remove('visible');

    } else {

        let index = 0;
        let total = 0;
        
        productos.map((producto) => {
            output +=
                `<tr>
                    <td><img src="/data/thumbs/${producto.img}" class="carrito-thumb" alt="img"></td>
                    <td>${producto.nombre}</td>
                    <td>$${producto.precio}</td> 
                    <td>${producto.cantidad}</td>
                    <td>$${producto.cantidad * producto.precio}</td>
                    <td>
                        <a 
                            name="${index}"
                            class="btn-delete-product"
                            id="delete-product"
                            href="javascript:void(0)"><img src="/img/icon-close.svg" alt="eliminar"/>
                        </a>
                    </td>
                    </tr>`
            index++;
            total += producto.cantidad * producto.precio;
        });

        totalElement.innerHTML = `Total: $ ${total}`;
        totalElement.classList.add('visible');
        buttonBuy.classList.add('visible');
    }

    table.children[1].innerHTML = output;

    countItems();
}

updateTable();

Array.from(deleteButtons).forEach((button) => {

    button.addEventListener('click', (e) => {
        
        // Get selected index
        let index = parseInt(e.target.parentElement.name);
                
        // Remove row from table
        table.children[1].rows[index].remove();

        // Remove from productos list object
        productos.splice(index, 1);

        // Update session
        sessionStorage.setItem('productos', JSON.stringify(productos));

        // update price
        // put 'no tiene productos en su carrito' on a separate func
    });
});