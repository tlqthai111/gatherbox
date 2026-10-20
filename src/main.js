// Shared entry point loaded by every page.
// Interface behaviour only; business logic lives in app.js (see docs/frontend-handoff.md).
import { initApp } from './app.js';

document.documentElement.classList.add('js');

initNavToggle();
initApp();


function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const list = document.getElementById('site-nav-list');
  if (!toggle || !list) return;

  toggle.hidden = false;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
}
