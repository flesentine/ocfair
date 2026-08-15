(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function setText(selector, text) {
    const el = $(selector);
    if (el) el.textContent = text;
  }

  function tidyStaticCopy() {
    document.body.classList.add('ux20');

    // NOW utilities: shorter labels for walking use.
    const labels = {
      hungry: ['🍓', 'Food'],
      beer: ['🍺', 'Drinks'],
      break: ['🌿', 'Break'],
      fun: ['🎢', 'Fun']
    };
    Object.entries(labels).forEach(([intent, parts]) => {
      const b = $(`.quick[data-intent="${intent}"]`);
      if (b) b.innerHTML = `<span>${parts[0]}</span>${parts[1]}`;
    });

    const nearShortcut = $('#uxNearShortcut');
    if (nearShortcut) nearShortcut.textContent = '📍 Nearby';

    $$('.uxPlanShortcut').forEach(b => { b.textContent = 'Full plan →'; });

    // Explore filters: concise, semantic labels.
    const filterLabels = {
      near: '📍 Near',
      best: '★ Best',
      tonight: '● Live',
      shylene: '★ Shylene',
      beer: '🍺 Drinks',
      easy: '🌿 Easy',
      all: 'All'
    };
    Object.entries(filterLabels).forEach(([key, label]) => {
      const b = $(`#exploreFilters button[data-filter="${key}"]`);
      if (b) b.textContent = label;
    });

    // Near Me language.
    const eyebrow = $('#nearbySection .eyebrow');
    if (eyebrow) eyebrow.textContent = 'YOUR LOCATION · PRIVATE';
    setText('#nearbySection h2', 'Nearby');
    const refresh = $('#nearbySection .nearRefresh');
    if (refresh) refresh.textContent = 'Refresh';
    const privacy = $('#nearbySection .nearPrivacy');
    if (privacy) privacy.textContent = '📍 Distances are GPS estimates. Fair walkways can make the real walk a little longer.';

    // Technical navigation labels are noise.
    $$('.mapPill,.nearMapBtn').forEach(b => { b.textContent = 'Open Maps'; });
  }

  function tidyDynamicCopy() {
    // Main app and Near Me re-render these elements.
    $$('.mapPill,.nearMapBtn').forEach(b => { b.textContent = 'Open Maps'; });
    $$('.uxPlanShortcut').forEach(b => { b.textContent = 'Full plan →'; });

    const status = $('#nearStatus');
    if (status) {
      let t = status.textContent.trim();
      if (t === 'Tap Near Me to rank nearby stops.') status.textContent = 'Tap Near to rank the closest stops.';
      if (t.startsWith('Location on')) status.textContent = t.replace('Location on', 'Location ready');
      if (t.startsWith('Finding you inside the fair')) status.textContent = 'Finding your location…';
      if (t.startsWith('Refreshing location')) status.textContent = 'Refreshing…';
    }

    // Sheet copy: clearer headings without changing behavior.
    const sheet = $('#sheetContent');
    if (sheet) {
      const h2 = $('h2', sheet);
      if (h2) {
        h2.textContent = h2.textContent
          .replace('Hungry right now', 'Food')
          .replace('Beer / drink', 'Drinks')
          .replace('Need a reset', 'Take a break')
          .replace('Turn the energy up', 'More fun')
          .replace('Skip this. What instead?', 'Change plans');
      }

      $$('.sheetChoice b', sheet).forEach(b => {
        b.textContent = b.textContent
          .replace('Best family fit → ', '')
          .replace('Beer-first → ', '')
          .replace('Cocktails → ', '')
          .replace('See all drink spots →', 'More drink spots')
          .replace('Give Shylene control', 'Shylene picks')
          .replace('Explore a weird detour →', 'Explore nearby');
      });
    }
  }

  function improveNearbyStatus() {
    const status = $('#nearStatus');
    if (!status) return;
    const observer = new MutationObserver(() => {
      const t = status.textContent.trim();
      if (t.startsWith('Location on')) status.textContent = t.replace('Location on', 'Location ready');
      else if (t.startsWith('Finding you inside the fair')) status.textContent = 'Finding your location…';
      else if (t.startsWith('Refreshing location')) status.textContent = 'Refreshing…';
    });
    observer.observe(status, { childList: true, characterData: true, subtree: true });
  }

  tidyStaticCopy();
  tidyDynamicCopy();
  improveNearbyStatus();

  const app = $('.app');
  if (app) {
    const observer = new MutationObserver(() => {
      clearTimeout(observer._v20);
      observer._v20 = setTimeout(() => {
        tidyStaticCopy();
        tidyDynamicCopy();
      }, 40);
    });
    observer.observe(app, { childList: true, subtree: true });
  }
})();
