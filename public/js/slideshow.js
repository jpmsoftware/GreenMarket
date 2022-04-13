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

    // Reset out of range index
    if (sliderIndex > 2) sliderIndex = 0;

    paintSelection();

    for (var i = 0; i < sliders.length; i++) {
        if (sliders[i].classList.contains('visible')) { sliders[i].classList.remove('visible') }
        if (i === sliderIndex) sliders[sliderIndex].classList.add('visible');
    }
    
    sliderIndex++;

    timer = setTimeout(AutoSlide, 5000);
}

function paintSelection() {

    for(var i = 0; i < sliderControls.length; i++) {
        if (sliderControls[i].classList.contains('active')) { sliderControls[i].classList.remove('active') }
        if (i === sliderIndex) sliderControls[sliderIndex].classList.add('active');
    }
}

AutoSlide();