(() => {
  'use strict';

  const FAIR_CENTER = { lat: 33.6667, lon: -117.9010 };
  const REFRESH_MS = 30000;
  const WALK_FT_PER_MIN = 220;
  let nearButton = null;
  let nearSection = null;
  let refreshTimer = null;
  let nearActive = false;
  let requesting = false;
  let lastPosition = null;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function parseCoord(raw) {
    const m = String(raw || '').trim().match(/^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/);
    return m ? { lat: Number(m[1]), lon: Number(m[2]) } : null;
  }

  function haversineMiles(a, b) {
    const R = 3958.7613;
    const toRad = d => d * Math.PI / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lon - a.lon);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
  }

  function distanceText(mi) {
    const ft = mi * 5280;
    if (ft < 90) return 'right here';
    if (ft < 1000) return `${Math.round(ft / 25) * 25} ft`;
    return `${mi.toFixed(mi < 1 ? 2 : 1)} mi`;
  }

  function walkText(mi) {
    const ft = mi * 5280;
    if (ft < 90) return '<1 min';
    return `${Math.max(1, Math.round(ft / WALK_FT_PER_MIN))} min`;
  }

  function cleanTitle(card) {
    return ($('h3', card)?.textContent || 'OC Fair stop')
      .replace('BEST FIT', '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function collectCandidates() {
    const out = [];

    $$('#view-explore .placeCard[data-map]').forEach(card => {
      const c = parseCoord(card.dataset.map);
      if (!c) return;
      out.push({
        key: `place:${cleanTitle(card)}:${card.dataset.map}`,
        title: cleanTitle(card),
        subtitle: $('p', card)?.textContent?.trim() || '',
        meta: $$('.placeMeta span', card).map(x => x.textContent.trim()).slice(0, 2).join(' · '),
        icon: $('.placeIcon', card)?.textContent?.trim() || '📍',
        coords: c,
        raw: card.dataset.map,
        kind: 'place',
        card
      });
    });

    try {
      if (typeof tonightEvents !== 'undefined' && Array.isArray(tonightEvents)) {
        const now = typeof nowLA === 'function' ? nowLA() : 0;
        tonightEvents.forEach(e => {
          const c = parseCoord(e.map);
          if (!c) return;
          const end = typeof mins === 'function' ? mins(e.end) : 24 * 60;
          if (now > end + 5) return;
          out.push({
            key: `event:${e.id}`,
            title: e.title,
            subtitle: e.note || e.loc || '',
            meta: `${e.time} · ${e.loc}`,
            icon: '🌙',
            coords: c,
            raw: e.map,
            kind: 'event',
            live: typeof mins === 'function' ? now >= mins(e.start) && now <= end : false
          });
        });
      }
    } catch (e) {
      console.warn('Near Me schedule candidates skipped', e);
    }

    const seen = new Set();
    return out.filter(x => {
      if (seen.has(x.key)) return false;
      seen.add(x.key);
      return true;
    });
  }

  function ensureSection() {
    if (nearSection) return nearSection;
    const tonight = $('#tonightSection');
    if (!tonight) return null;

    nearSection = document.createElement('section');
    nearSection.id = 'nearbySection';
    nearSection.className = 'section nearSection hide';
    nearSection.innerHTML = `
      <div class="nearHeader">
        <div>
          <div class="eyebrow">GPS · private on this phone</div>
          <h2>Closest right now</h2>
        </div>
        <button class="nearRefresh" type="button">↻ Refresh</button>
      </div>
      <div class="nearStatus" id="nearStatus">Tap Near Me to rank nearby stops.</div>
      <div class="nearResults" id="nearResults"></div>
      <div class="nearPrivacy">📍 Straight-line GPS estimate. Fair walkways can make the real walk a little longer.</div>
    `;
    tonight.before(nearSection);
    $('.nearRefresh', nearSection).onclick = () => requestLocation(true);
    return nearSection;
  }

  function ensureButton() {
    const bar = $('#exploreFilters');
    if (!bar || $('#nearMeFilter')) return $('#nearMeFilter');

    nearButton = document.createElement('button');
    nearButton.id = 'nearMeFilter';
    nearButton.type = 'button';
    nearButton.dataset.filter = 'near';
    nearButton.textContent = '📍 Near Me';

    const best = $('button[data-filter="best"]', bar);
    if (best) best.before(nearButton);
    else bar.prepend(nearButton);

    nearButton.onclick = activateNearMe;

    $$('#exploreFilters button').forEach(b => {
      if (b === nearButton) return;
      b.addEventListener('click', () => {
        nearActive = false;
        nearButton?.classList.remove('active');
        nearSection?.classList.add('hide');
        stopRefreshLoop();
      });
    });

    return nearButton;
  }

  function activateNearMe() {
    $$('#exploreFilters button').forEach(b => b.classList.toggle('active', b === nearButton));
    nearActive = true;
    ensureSection()?.classList.remove('hide');
    requestLocation(false);
    setTimeout(() => ensureSection()?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    startRefreshLoop();
  }

  function setStatus(message, state = '') {
    const el = $('#nearStatus');
    if (!el) return;
    el.className = `nearStatus ${state}`.trim();
    el.textContent = message;
  }

  function updateDistanceBadges(position) {
    $$('#view-explore .placeCard[data-map]').forEach(card => {
      const c = parseCoord(card.dataset.map);
      if (!c) return;
      const mi = haversineMiles(position, c);
      let badge = $('.nearDistanceBadge', card);
      if (!badge) {
        badge = document.createElement('div');
        badge.className = 'nearDistanceBadge';
        const content = card.children[1];
        if (content) {
          const h3 = $('h3', content);
          if (h3) h3.insertAdjacentElement('afterend', badge);
          else content.prepend(badge);
        }
      }
      badge.textContent = `${distanceText(mi)} · ${walkText(mi)}`;
    });
  }

  function renderNearest(position, accuracyMeters) {
    lastPosition = position;
    updateDistanceBadges(position);

    const results = $('#nearResults');
    if (!results) return;

    const fromFair = haversineMiles(position, FAIR_CENTER);
    const accuracyFeet = Math.round((accuracyMeters || 0) * 3.28084 / 10) * 10;

    if (fromFair > 1.2) {
      setStatus(`You’re about ${fromFair.toFixed(1)} mi from the fair. Near Me will rank internal stops once you arrive.`, 'warn');
      results.innerHTML = '';
      return;
    }

    if (accuracyFeet > 180) setStatus(`Location found · GPS is only accurate to about ±${accuracyFeet} ft`, 'warn');
    else setStatus(`Location on${accuracyFeet ? ` · about ±${accuracyFeet} ft accuracy` : ''}`, 'good');

    const ranked = collectCandidates()
      .map(x => ({ ...x, distance: haversineMiles(position, x.coords) }))
      .sort((a, b) => {
        const liveBoostA = a.live ? 0.015 : 0;
        const liveBoostB = b.live ? 0.015 : 0;
        return (a.distance - liveBoostA) - (b.distance - liveBoostB);
      })
      .slice(0, 5);

    if (!ranked.length) {
      results.innerHTML = `<div class="nearEmpty">No mapped stops available right now.</div>`;
      return;
    }

    results.innerHTML = '';
    ranked.forEach((x, i) => {
      const row = document.createElement('article');
      row.className = `nearResult${i === 0 ? ' closest' : ''}${x.live ? ' live' : ''}`;
      const label = x.live ? `LIVE · ${x.meta}` : x.meta;
      row.innerHTML = `
        <div class="nearRank">${i === 0 ? 'NEAREST' : `#${i + 1}`}</div>
        <div class="nearIcon">${x.icon}</div>
        <div class="nearBody">
          <h3>${x.title}</h3>
          <div class="nearMeters"><b>${distanceText(x.distance)}</b><span>${walkText(x.distance)} walk</span></div>
          ${label ? `<div class="nearMeta">${label}</div>` : ''}
          ${x.subtitle ? `<p>${x.subtitle}</p>` : ''}
          <button class="nearMapBtn" type="button">Open Maps</button>
        </div>
      `;
      $('.nearMapBtn', row).onclick = () => {
        if (typeof openAppleMaps === 'function') openAppleMaps(x.raw, x.title);
      };
      results.appendChild(row);
    });
  }

  function locationError(err) {
    requesting = false;
    const code = err && err.code;
    if (code === 1) setStatus('Location is off for this site. Allow location for Fair Night, then tap Refresh.', 'warn');
    else if (code === 2) setStatus('GPS could not get a reliable position. Move into a more open area and try again.', 'warn');
    else setStatus('GPS timed out. Tap Refresh and try again.', 'warn');
  }

  function requestLocation(force) {
    ensureSection();
    if (!navigator.geolocation) {
      setStatus('This browser does not provide GPS location.', 'warn');
      return;
    }
    if (requesting) return;

    requesting = true;
    setStatus(force ? 'Refreshing location…' : 'Finding you inside the fair…', 'loading');

    navigator.geolocation.getCurrentPosition(
      pos => {
        requesting = false;
        const point = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        renderNearest(point, pos.coords.accuracy);
      },
      locationError,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: force ? 0 : 15000 }
    );
  }

  function startRefreshLoop() {
    stopRefreshLoop();
    refreshTimer = setInterval(() => {
      if (!nearActive || document.hidden) return;
      if ($('#view-explore')?.classList.contains('active')) requestLocation(false);
    }, REFRESH_MS);
  }

  function stopRefreshLoop() {
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = null;
  }

  function goNearMe() {
    if (typeof switchView === 'function') switchView('explore');
    setTimeout(() => {
      ensureButton();
      activateNearMe();
    }, 80);
  }

  function cleanUX() {
    document.body.classList.add('ux19');

    // Replace repeated technical map wording with a simple user action.
    $$('.mapPill').forEach(btn => { btn.textContent = 'Open Maps'; });

    // Add one obvious proximity shortcut to NOW instead of making people hunt in Explore.
    const quickRow = $('#view-now .quickRow');
    if (quickRow && !$('#uxNearShortcut')) {
      const btn = document.createElement('button');
      btn.id = 'uxNearShortcut';
      btn.className = 'uxNearShortcut';
      btn.type = 'button';
      btn.textContent = '📍 What’s near me right now?';
      btn.onclick = goNearMe;
      quickRow.insertAdjacentElement('afterend', btn);
    }

    // Make Coming Up deliberately short and provide one path to the full schedule.
    const upcoming = $('#upcoming');
    if (upcoming) {
      [...upcoming.children].slice(2).forEach(x => x.style.display = 'none');
      const section = upcoming.closest('.section');
      if (section && !$('.uxPlanShortcut', section)) {
        const btn = document.createElement('button');
        btn.className = 'uxPlanShortcut';
        btn.type = 'button';
        btn.textContent = 'View full plan →';
        btn.onclick = () => typeof switchView === 'function' && switchView('plan');
        upcoming.insertAdjacentElement('afterend', btn);
      }
    }

    // Put the filters people use while walking first.
    const filters = $('#exploreFilters');
    if (filters) {
      const order = ['near', 'best', 'tonight', 'shylene', 'beer', 'easy', 'all'];
      order.forEach(key => {
        const el = $(`button[data-filter="${key}"]`, filters);
        if (el) filters.appendChild(el);
      });
      const shy = $('button[data-filter="shylene"]', filters);
      if (shy) shy.textContent = '★ Shylene';
      const beer = $('button[data-filter="beer"]', filters);
      if (beer) beer.textContent = '🍺 Drinks';
      const tonight = $('button[data-filter="tonight"]', filters);
      if (tonight) tonight.textContent = '🌙 Tonight';
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && nearActive) requestLocation(false);
  });

  ensureSection();
  ensureButton();
  cleanUX();

  // The main app re-renders some DOM pieces. Re-apply lightweight cleanup after those renders.
  const observer = new MutationObserver(() => {
    clearTimeout(observer._t);
    observer._t = setTimeout(() => {
      $$('.mapPill').forEach(btn => { if (btn.textContent !== 'Open Maps') btn.textContent = 'Open Maps'; });
      const upcoming = $('#upcoming');
      if (upcoming) [...upcoming.children].slice(2).forEach(x => x.style.display = 'none');
      if (lastPosition) updateDistanceBadges(lastPosition);
    }, 30);
  });
  const app = $('.app');
  if (app) observer.observe(app, { childList: true, subtree: true });
})();
