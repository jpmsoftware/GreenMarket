var arrows = document.querySelectorAll('.arrows');
var start = 0;
var end = 4;

arrows.forEach((element) => {
    element.addEventListener('click', (e) => {
        Move(e);
    });
});

function Move(e) {
    switch (e.target.name) {
        case 'left':
            if (start > 0) {
                end = start - 1;
                start = end - 4;
                Paginate(e.target.parentElement.className);
            }
            break;

        case 'right':
            if (end < 11) {
                start = end + 1;
                end = start + 4;
                Paginate(e.target.parentElement.className)
            }
            break;
    }
}

function Paginate(section) {
    var items = document.querySelectorAll(`.${section} .card`);

    for (var i = 0; i < items.length; i++) {
        if (i >= start && i <= end) {
            items[i].style.display = 'block';
        } else {
            items[i].style.display = 'none';
        }
    }
}

// Initial pagination with start = 0, end = 4
Paginate('ofertas');
Paginate('masvendidos');