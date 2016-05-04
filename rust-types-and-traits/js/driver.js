function goToSlide(n) {
  const slides = document.querySelectorAll('section');
  while (n < 0) {
    n += slides.length;
  }
  n = n % slides.length;
  const chosenSlide = slides[n];
  for (let s of slides) {
    s.classList.remove('previous');
    s.classList.remove('current');
    s.classList.remove('next');
  }
  chosenSlide.classList.add('current');
  let previousSlide = chosenSlide.previousSibling || slides[slides.length - 1];
  let nextSlide = chosenSlide.nextSibling || slides[0];

  previousSlide.classList.add('previous');
  nextSlide.classList.add('next');
  window.history.replaceState({}, null, `#${n}`);
}

function slideFromLoc() {
  let slideNum = parseInt(document.location.hash.slice(1));
  if (isNaN(slideNum)) {
    slideNum = 0;
  }
  goToSlide(slideNum);
}

(function() {
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
    target.appendChild(acc);

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
