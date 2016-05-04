function deckNext() {
  let currentSlideNum = parseInt(document.location.hash.slice(1));
  if (isNaN(currentSlideNum)) {
    currentSlideNum = -1;
  }
  goToSlide(currentSlideNum + 1);
}

function deckPrev() {
  let currentSlideNum = parseInt(document.location.hash.slice(1));
  if (isNaN(currentSlideNum)) {
    currentSlideNum = 0;
  }
  goToSlide(currentSlideNum - 1);
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
  });

  window.addEventListener('message', ({data}) => {
    console.log('Got message', data);
    switch (data.type) {
      case 'change slide':
        goToSlide(data.slideNum);
        break;
    }
  });
})();
