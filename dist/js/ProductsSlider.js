var arrows = document.querySelectorAll('.arrows');
var start = 0;
var end = 3;

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
                start = end - 3;
                Paginate(e.target.parentElement.id);
            }
            break;

        case 'right':
            if (end < 11) {
                start = end + 1;
                end = start + 3;
                Paginate(e.target.parentElement.id)
            }
            break;
    }
}

function Paginate(section) {
    var items = document.querySelectorAll(`#${section} .card`);

    for (var i = 0; i < items.length; i++) {
        if (i >= start && i <= end) {
            items[i].style.display = 'block';
        } else {
            items[i].style.display = 'none';
        }
    }
}

// Initial pagination with start = 0, end = 3
Paginate('ofertas');
Paginate('masvendidos');