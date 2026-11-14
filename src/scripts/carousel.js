(function () {
  // Hero carousel: cross-fades the stacked screenshots every few seconds.
  // Pauses while hovered or focused, while the tab is hidden, and when the
  // visitor uses the pause button; never auto-plays under reduced motion.
  var root = document.getElementById('hero-carousel');
  if (!root) return;
  var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var caption = document.getElementById('hero-caption');
  var pauseBtn = document.getElementById('hero-pause');
  var INTERVAL = 4500;
  var current = 0;
  var timer = null;
  var hovering = false;
  var userPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach(function (slide, n) {
      var active = n === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
    dots.forEach(function (dot, n) {
      dot.setAttribute('aria-current', n === current ? 'true' : 'false');
    });
    if (caption) caption.textContent = dots[current].getAttribute('aria-label');
  }

  function stop() { clearInterval(timer); timer = null; }
  function sync() {
    stop();
    if (!userPaused && !hovering && !document.hidden) {
      timer = setInterval(function () { show(current + 1); }, INTERVAL);
    }
  }
  function renderPause() {
    if (!pauseBtn) return;
    pauseBtn.setAttribute('aria-label', pauseBtn.getAttribute(userPaused ? 'data-label-play' : 'data-label-pause'));
    pauseBtn.querySelector('.hero-icon-pause').toggleAttribute('hidden', userPaused);
    pauseBtn.querySelector('.hero-icon-play').toggleAttribute('hidden', !userPaused);
  }

  dots.forEach(function (dot, n) {
    dot.addEventListener('click', function () { show(n); sync(); });
  });
  if (pauseBtn) pauseBtn.addEventListener('click', function () {
    userPaused = !userPaused;
    renderPause();
    sync();
  });
  root.addEventListener('mouseenter', function () { hovering = true; sync(); });
  root.addEventListener('mouseleave', function () { hovering = false; sync(); });
  document.addEventListener('visibilitychange', sync);

  show(0);
  renderPause();
  sync();
})();
