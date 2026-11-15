const KEY = 'grove-theme';

function stored() {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch (e) {
    return 'system';
  }
}

export function initThemeToggle() {
  const group = document.querySelector('[data-theme-toggle]');
  if (!group) return;
  const root = document.documentElement;
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const buttons = group.querySelectorAll('[data-theme-choice]');

  function render(choice) {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.themeChoice === choice)));
  }
  function apply(choice) {
    root.setAttribute('data-theme', choice === 'system' ? (mq.matches ? 'dark' : 'light') : choice);
    render(choice);
  }

  buttons.forEach((b) =>
    b.addEventListener('click', () => {
      const choice = b.dataset.themeChoice;
      try {
        if (choice === 'system') localStorage.removeItem(KEY);
        else localStorage.setItem(KEY, choice);
      } catch (e) { /* storage blocked: choice applies to this page only */ }
      apply(choice);
    })
  );
  // Keep other tabs in sync.
  window.addEventListener('storage', (e) => { if (e.key === KEY || e.key === null) apply(stored()); });

  render(stored());
  group.hidden = false;
}
