(function () {
  fetch('/download.json', { cache: 'no-store' })
    .then(function (r) { if (!r.ok) throw new Error('bad status'); return r.json(); })
    .then(function (data) {
      var btn = document.getElementById('download-btn');
      var meta = document.getElementById('download-meta');
      var allReleases = document.getElementById('download-all-releases');

      if (data.download_url) btn.href = data.download_url;

      if (meta) {
        var sizeMb = data.size_bytes ? (data.size_bytes / (1024 * 1024)).toFixed(1) + ' MB · ' : '';
        var date = data.published_at
          ? new Date(data.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
          : '';
        meta.textContent = (data.version ? 'v' + data.version + ' · ' : '') + sizeMb + date;
      }

      if (allReleases && data.html_url) allReleases.href = data.html_url.replace(/\/tag\/.*$/, '');
    })
    .catch(function () {
      // Static fallback already in the markup covers this case.
    });
})();
