let slidesWindow = null;

function deckNext() {
  let newSlide = currentSlide() + 1;
  goToSlide(newSlide);
  notifySlides(newSlide);
}

function deckPrev() {
  let newSlide = currentSlide() - 1;
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
    const url = `index.html#${currentSlide()}`;
    const opts = 'toolbar=0,location=0,menubar=0,width=640,height=480';
    slidesWindow = window.open(url, '_blank', opts);
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

  window.addEventListener('beforeunload', event => {
    if (slidesWindow) {
      slidesWindow.close();
    }
  });
})();
