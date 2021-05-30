var iconLogin = document.querySelector('.icon-avatar');
var btnIngresar = document.querySelector('.btnLogin');

iconLogin.addEventListener('click', () => {

    var loginModal = document.querySelector('.loginModal');
    var colorLayer = document.querySelector('.dark-layer');

    colorLayer.style.display = 'block';
    loginModal.style.display = 'flex';
    loginModal.classList.add('displayed');
    body.style.overflow = 'hidden';
});
