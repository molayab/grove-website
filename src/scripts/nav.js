// Collapsible nav (<= 860px). The static markup works without this script; the inline script
// in Base.astro adds `nav-enhanced` to <html>, and the kit then shows the toggle and hides the panel.
const MQ = '(max-width: 860px)';

export function initNav() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-menu]');
  if (!toggle || !menu) return;
  const mq = window.matchMedia(MQ);

  function set(open, restoreFocus) {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    if (open) document.addEventListener('click', onOutside);
    else document.removeEventListener('click', onOutside);
    if (!open && restoreFocus) toggle.focus();
  }
  function onOutside(e) {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) set(false);
  }

  toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') set(false, true);
  });
  mq.addEventListener('change', (e) => { if (!e.matches) set(false); });
}
