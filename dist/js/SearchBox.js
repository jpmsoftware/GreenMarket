// var suggestions = document.querySelector('.suggestions');
// var searchBox = document.querySelector('#searchBox');
// var suggestionsData;

// searchBox.addEventListener('keyup', (e) => {
//     if(searchBox.value.length > 0) {
//         suggestions.style.display = 'block';
//         // Search JSON
//         suggestionsData.forEach((element) => {
//             if(e.target.value === element) {
//                 alert('Hay coincidencias');
//             }
//         });
//         console.log(suggestionsData);
        
//     } else {
//         suggestions.style.display = 'none';
//     }
// });

// function getSuggestions() {
//     // Load JSON
//     fetch('./data/suggestions.json')
//         .then(res => res.json())
//         .then((data) => { suggestionsData = data })
// }

// getSuggestions();