(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function applyV21() {
    document.body.classList.add('ux21');

    // Small copy refinements that do not change app behavior.
    $$('.uxPlanShortcut').forEach(btn => {
      if (btn.textContent.trim().startsWith('Full plan')) btn.textContent = 'See full plan';
    });

    const nearShortcut = $('#uxNearShortcut');
    if (nearShortcut) nearShortcut.textContent = '📍 Nearby';

    $$('.nearRank').forEach(el => {
      if (el.textContent.trim() === 'NEAREST') el.textContent = 'CLOSEST';
    });

    const refresh = $('#nearbySection .nearRefresh');
    if (refresh) refresh.textContent = 'Refresh';
  }

  applyV21();

  // Main app re-renders pieces of NOW / Explore. Re-apply only the tiny V21 labels.
  const app = $('.app');
  if (app) {
    const observer = new MutationObserver(() => {
      clearTimeout(observer._v21);
      observer._v21 = setTimeout(applyV21, 60);
    });
    observer.observe(app, { childList: true, subtree: true });
  }
})();
