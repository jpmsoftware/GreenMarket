var suggestions = document.querySelector('.suggestions');
var searchBox = document.querySelector('#searchBox');

searchBox.addEventListener('keyup', () => {
    if(searchBox.value.length > 0) {
        suggestions.style.display = 'block';
        // code for searching in the json goes here
    } else {
        suggestions.style.display = 'none';
    }
});
