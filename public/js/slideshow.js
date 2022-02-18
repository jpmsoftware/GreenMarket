var timer = 0;
var sliders = document.querySelectorAll('.slider-item');
var sliderControls = document.querySelectorAll('.controls div');
var sliderIndex = 0;

sliderControls.forEach((element) => {
    element.addEventListener('click', (e) => {
        for (var i = 0; i < sliderControls.length; i++) {
            //get clicked index
            if (sliderControls[i] == e.target) {
                sliderIndex = i;
                AutoSlide();
            }
        }
    });
});

function AutoSlide() {
    clearTimeout(timer);

    if (sliderIndex > 2) { sliderIndex = 0; }

    changeSelection();

    // Reset all
    for (var i = 0; i < sliders.length; i++) {
        sliders[i].style.display = 'none';
    }

    sliders[sliderIndex].style.display = 'block';

    sliderIndex++;

    timer = setTimeout(AutoSlide, 5000);
}

function changeSelection() {

    // Reset all
    for (var i = 0; i < sliderControls.length; i++) {
        sliderControls[i].style.background = 'transparent';
    }

    sliderControls[sliderIndex].style.background = '#fff';
}

AutoSlide();