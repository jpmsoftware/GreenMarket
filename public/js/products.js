var arrows = document.querySelectorAll('.arrows');
var start = 0;
var end = 5;

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
        start = end - 5;
        paginate();
      }
      break;

    case 'right':
      if (end < 17) {
        start = end + 1;
        end = start + 5;
        paginate();
      }
      break;
  }
}

function paginate() {
  var items = document.querySelectorAll(`.ofertas .card`);

  for (var i = 0; i < items.length; i++) {
    if (i >= start && i <= end) {

      items[i].classList.add('visible');

    } else {
      items[i].classList.remove('visible');
    }
  }
}

paginate();