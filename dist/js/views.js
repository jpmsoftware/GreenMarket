var total = document.querySelectorAll('tbody tr').length;
var inputs = document.getElementsByTagName('input');
var buttons = document.getElementsByClassName('guardar');
var tabla = document.getElementById('tabla');
var selectedIndex;


for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('change', () => {
        EnableButton();
    });
}



document.getElementById('total').innerHTML = `Total: ${total} productos`;

window.onload = () => {
    tabla.addEventListener('change', ChangeTable );
}

window.ondblclick = (e) => {
    var input = document.getElementById(e.target.id);
}

function EnableButton(index) {
    buttons[3].style.disabled = true;
}

function ChangeTable() {
    selectedIndex = tabla.selectedIndex;
    var path = '/gestion' + tabla.options[tabla.selectedIndex].value;  
    
    //SAVE SELECTED INDEX IN SESSION
    alert('selected index cambió a : ' + selectedIndex);

    //GET SELECTED TABLE
    window.location.href = path;
}