var burger = document.querySelector('.burger');
var menu = document.querySelector('.menu');

burger.onclick = () => {
    burger.classList.toggle('change');

    if (menu.style.display == 'none' || menu.style.display == '') {
        menu.style.display = 'block';
    } else {
        menu.style.display = 'none';
    }
}