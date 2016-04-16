(function() {
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

  document.addEventListener('keydown', function(e) {
    if (e.which === 34 || // page down
      (e.which === 32 && !e.shiftKey) || // space without shift
      (e.which === 39) // right
    ) {
      deckNext();
    }

    if (e.which == 33 || // page up
      (e.which == 32 && e.shiftKey) || // space + shift
      (e.which == 37) // left
    ) {
      deckPrev();
    }
  });

  function goToSlide(n) {
    const slides = document.querySelectorAll('section');
    while (n < 0) {
      n += slides.length + 1;
    }
    n = n % (slides.length + 1);
    const chosenSlide = slides[n];
    for (let s of slides) {
      s.classList.remove('previous');
      s.classList.remove('current');
      s.classList.remove('next');
      // s.style.display = 'none';
    }
    if (chosenSlide) {
      chosenSlide.classList.add('current');
      // chosenSlide.style.display = 'block';
      if (chosenSlide.previousSibling) {
        chosenSlide.previousSibling.classList.add('previous');
      }
      if (chosenSlide.nextSibling) {
        chosenSlide.nextSibling.classList.add('next');
      }
    } else {
      slides[0].classList.add('next');
      slides[slides.length - 1].classList.add('previous');
    }
    window.history.pushState({}, null, `#${n}`);
  }

  function slideFromLoc() {
    let slideNum = parseInt(document.location.hash.slice(1));
    if (isNaN(slideNum)) {
      slideNum = 0;
    }
    goToSlide(slideNum);
  }

  window.onpopstate = slideFromLoc;

  function reqListener () {
    console.log(this.responseText);
  }

  var target = document.querySelector('[data-slides]');
  var url = target.dataset.slides;
  var req = new XMLHttpRequest();

  req.addEventListener('load', function() {
    var mdContent = this.responseText;
    var doc = document.createElement('div');
    doc.innerHTML = marked(mdContent);
    var acc = document.createElement('section');

    for (let child of doc.children) {
      const tagName = child.nodeName.toLowerCase();
      if (tagName === 'hr') {
        target.appendChild(acc);
        acc = document.createElement('section');
      } else if (tagName === 'meta') {
        for (let cls of child.classList) {
          acc.classList.add(cls);
        }
      } else {
        acc.appendChild(child.cloneNode(true));
      }
    }
    if (acc.children.length > 0) {
      target.appendChild(acc);
    }

    slideFromLoc();

    const codes = document.querySelectorAll('pre code');
    for (let code of codes) {
      let match = /lang-(.*)/.exec(code.className);
      if (match) {
        code.className = match[1];
      }
      if (!code.classList.contains('compiler')) {
        hljs.highlightBlock(code);
      }
    }
  });

  req.open('GET', url);
  req.send();

})();
