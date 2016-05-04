let slidesWindow = null;

function deckNext() {
  let currentSlideNum = parseInt(document.location.hash.slice(1));
  if (isNaN(currentSlideNum)) {
    currentSlideNum = -1;
  }
  let newSlide = currentSlideNum + 1;
  goToSlide(newSlide);
  notifySlides(newSlide);
}

function deckPrev() {
  let currentSlideNum = parseInt(document.location.hash.slice(1));
  if (isNaN(currentSlideNum)) {
    currentSlideNum = 0;
  }
  let newSlide = currentSlideNum - 1;
  goToSlide(newSlide);
  notifySlides(newSlide);
}

function notifySlides(slideNum) {
  if (slidesWindow === null) {
    return;
  }
  console.log('changing slide', slideNum);
  slidesWindow.postMessage({type: 'change slide', slideNum}, '*');
}

function openViewer() {
  if (slidesWindow === null || slidesWindow.closed) {
    console.log('opening slides');
    slidesWindow = window.open('index.html', 'Slides', '');
    window.focus();
  }
}

(function() {
  document.addEventListener('keydown', function(e) {
    if (e.which === 34 || // page down
      (e.which === 32 && !e.shiftKey) || // space without shift
      (e.which === 39) // right
    ) {
      deckNext();
    }

    if (e.which === 33 || // page up
      (e.which === 32 && e.shiftKey) || // space + shift
      (e.which === 37) // left
    ) {
      deckPrev();
    }

    if (e.key === 'p') {
      openViewer();
    }
  });
})();
