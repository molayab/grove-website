(function () {
  var CONSENT_KEY = 'grove-cookie-consent';
  var GA_ID = 'G-435ZWRJN2B';
  var banner = document.getElementById('cookie-banner');

  function loadGA() {
    if (window.__groveGaLoaded) return;
    window.__groveGaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }

  function showBanner() { if (banner) banner.hidden = false; }
  function hideBanner() { if (banner) banner.hidden = true; }

  var consent = localStorage.getItem(CONSENT_KEY);
  if (consent === 'accepted') {
    loadGA();
  } else if (consent !== 'declined') {
    showBanner();
  }

  var acceptBtn = document.getElementById('cookie-accept');
  var declineBtn = document.getElementById('cookie-decline');
  var settingsLink = document.getElementById('cookie-settings-link');

  if (acceptBtn) acceptBtn.addEventListener('click', function () {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    hideBanner();
    loadGA();
  });
  if (declineBtn) declineBtn.addEventListener('click', function () {
    localStorage.setItem(CONSENT_KEY, 'declined');
    hideBanner();
  });
  if (settingsLink) settingsLink.addEventListener('click', function (e) {
    e.preventDefault();
    showBanner();
  });
})();
