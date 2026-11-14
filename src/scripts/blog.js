export function initBlog() {
  // "From the blog": the three newest posts tagged `grove` from the blog's
  // Atom feed. Cards are built with createElement/textContent only, never
  // innerHTML, since the feed is external content. On any failure the grid
  // stays hidden and the always-visible "All Grove posts" link is the fallback.
  var grid = document.querySelector('[data-blog-feed]');
  if (!grid || !window.fetch || !window.DOMParser) return;
  var FEED_URL = 'https://molayab.com/feed.xml';
  var POST_PREFIX = 'https://molayab.com/';
  var ATOM = 'http://www.w3.org/2005/Atom';
  var LOCALE = document.documentElement.lang === 'es' ? 'es' : 'en';
  var MAX = 160;
  var controller = window.AbortController ? new AbortController() : null;
  var timeout = setTimeout(function () { if (controller) controller.abort(); }, 5000);

  function child(entry, name) {
    var el = entry.getElementsByTagNameNS(ATOM, name)[0];
    return el ? el.textContent : '';
  }
  function plainText(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    return (doc.body ? doc.body.textContent : '').replace(/\s+/g, ' ').trim();
  }
  function truncate(text) {
    if (text.length <= MAX) return text;
    var cut = text.slice(0, MAX - 1);
    var space = cut.lastIndexOf(' ');
    if (space > MAX / 2) cut = cut.slice(0, space);
    return cut.replace(/[\s.,;:—–-]+$/, '') + '…';
  }
  function postLink(entry) {
    var links = entry.getElementsByTagNameNS(ATOM, 'link');
    for (var i = 0; i < links.length; i++) {
      var rel = links[i].getAttribute('rel');
      if (!rel || rel === 'alternate') return links[i].getAttribute('href') || '';
    }
    return '';
  }
  function isGrove(entry) {
    var cats = entry.getElementsByTagNameNS(ATOM, 'category');
    for (var i = 0; i < cats.length; i++) if (cats[i].getAttribute('term') === 'grove') return true;
    return false;
  }

  fetch(FEED_URL, controller ? { signal: controller.signal } : {})
    .then(function (r) { if (!r.ok) throw new Error('bad status'); return r.text(); })
    .then(function (xml) {
      var doc = new DOMParser().parseFromString(xml, 'application/xml');
      if (doc.getElementsByTagName('parsererror').length) throw new Error('bad feed');
      var format = new Intl.DateTimeFormat(LOCALE, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
      var posts = Array.prototype.slice.call(doc.getElementsByTagNameNS(ATOM, 'entry'))
        .filter(isGrove)
        .map(function (entry) {
          return {
            title: plainText(child(entry, 'title')),
            url: postLink(entry),
            date: new Date(child(entry, 'published')),
            summary: truncate(plainText(child(entry, 'summary') || child(entry, 'content')))
          };
        })
        .filter(function (p) { return p.title && p.url.indexOf(POST_PREFIX) === 0 && !isNaN(p.date.getTime()); })
        .sort(function (a, b) { return b.date - a.date; })
        .slice(0, 3);
      if (!posts.length) throw new Error('no posts');

      posts.forEach(function (post) {
        var card = document.createElement('article');
        card.className = 'blog-card';
        var time = document.createElement('time');
        time.className = 'blog-date';
        time.setAttribute('datetime', post.date.toISOString().slice(0, 10));
        time.textContent = format.format(post.date);
        var h3 = document.createElement('h3');
        var a = document.createElement('a');
        a.href = post.url;
        a.textContent = post.title;
        h3.appendChild(a);
        card.appendChild(time);
        card.appendChild(h3);
        if (post.summary) {
          var p = document.createElement('p');
          p.textContent = post.summary;
          card.appendChild(p);
        }
        grid.appendChild(card);
      });
      grid.hidden = false;
    })
    .catch(function () {
      // The "All Grove posts" link below the grid already covers this case.
    })
    .then(function () { clearTimeout(timeout); });
}
