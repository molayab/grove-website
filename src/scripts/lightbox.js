(function () {
  // Screenshot lightbox. Each thumbnail is a plain link to the full PNG, so
  // without JS (or without <dialog> support) clicking still opens the image.
  var dialog = document.getElementById('lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  var img = document.getElementById('lightbox-img');
  var caption = document.getElementById('lightbox-caption');
  var links = Array.prototype.slice.call(document.querySelectorAll('.screenshot-frame'));
  var current = 0;

  function show(i) {
    current = (i + links.length) % links.length;
    var link = links[current];
    var item = link.closest('.screenshot-item');
    var cap = item && item.querySelector('.screenshot-caption');
    img.src = link.getAttribute('href');
    img.alt = link.querySelector('img').alt;
    caption.textContent = cap ? cap.textContent : '';
  }

  links.forEach(function (link, i) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      show(i);
      dialog.showModal();
    });
  });

  dialog.querySelector('.lightbox-prev').addEventListener('click', function () { show(current - 1); });
  dialog.querySelector('.lightbox-next').addEventListener('click', function () { show(current + 1); });
  dialog.querySelector('.lightbox-close').addEventListener('click', function () { dialog.close(); });
  // Clicking the dark backdrop (anything but the image or a control) closes it.
  dialog.addEventListener('click', function (e) {
    if (e.target === dialog || e.target.classList.contains('lightbox-figure')) dialog.close();
  });
  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();
