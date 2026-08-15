(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const extraEvents = [
    {id:'postcards7',start:'12:00',end:'19:00',time:'Until 7',title:'Postcards for Troops',loc:'Heroes Hall',map:'33.66618,-117.90350',note:'A quick hands-on stop before 7: write a postcard for service members while you are already near Heroes Hall.'},
    {id:'secondwind',start:'17:00',end:'19:00',time:'5–7',title:'Second Wind and Friends',loc:'Butterfly Stage',map:'',note:'Live music running until 7. Good if you pass the stage and want a no-commitment music stop.'},
    {id:'jbk630',start:'18:30',end:'19:10',time:'6:30',title:'JBK Band',loc:'Plaza Stage',map:'',note:'Free community-stage set. An easy alternative if you miss the 6 PM magic show.'},
    {id:'pigs8',start:'20:00',end:'20:30',time:'8:00',title:'Racing Pigs — night race',loc:'Park Plaza',map:'33.66722,-117.90302',note:'Another full pig race at 8 PM if the earlier races did not fit your route.'},
    {id:'eat7',start:'19:00',end:'19:30',time:'7:00',title:'Eating Contest',loc:'OC Promenade Stage',map:'33.66714,-117.90027',note:'Short, silly fair spectacle. Easy to sample without giving up a big chunk of the night.'},
    {id:'phil7',start:'19:00',end:'19:45',time:'7:00',title:'Phil Shane',loc:'Baja Bar and Grill',map:'',note:'Live music at Baja Bar and Grill. Useful if food and music line up naturally.'},
    {id:'canyon7',start:'19:00',end:'19:45',time:'7:00',title:'Centennial Canyon Riders',loc:'Butterfly Stage',map:'',note:'Free live set on Butterfly Stage; also repeats at 8 and 9.'},
    {id:'phil8',start:'20:00',end:'20:45',time:'8:00',title:'Phil Shane',loc:'Baja Bar and Grill',map:'',note:'Second evening set at Baja Bar and Grill.'},
    {id:'sofie8',start:'20:00',end:'20:40',time:'8:00',title:'Sofie Tabesh',loc:'Meadows Stage',map:'',note:'Free 40-minute set on Meadows Stage.'},
    {id:'canyon8',start:'20:00',end:'20:45',time:'8:00',title:'Centennial Canyon Riders',loc:'Butterfly Stage',map:'',note:'Second evening set on Butterfly Stage.'},
    {id:'narada830',start:'20:30',end:'21:15',time:'8:30',title:'DJ Narada · Fair After Dark',loc:'Plaza Pacifica',map:'',note:'Friday dance-party set. Best later-night energy option if everyone still has gas in the tank.'},
    {id:'phil9',start:'21:00',end:'21:45',time:'9:00',title:'Phil Shane',loc:'Baja Bar and Grill',map:'',note:'Late set at Baja Bar and Grill.'},
    {id:'sofie9',start:'21:00',end:'21:40',time:'9:00',title:'Sofie Tabesh',loc:'Meadows Stage',map:'',note:'Second Meadows Stage set.'},
    {id:'canyon9',start:'21:00',end:'21:45',time:'9:00',title:'Centennial Canyon Riders',loc:'Butterfly Stage',map:'',note:'Third Butterfly Stage set.'},
    {id:'mariachi915',start:'21:15',end:'22:00',time:'9:15',title:'Mariachi Juvenil',loc:'OC Promenade Stage',map:'33.66714,-117.90027',note:'Second Mariachi set tonight. Free and easy to catch if you are already around Promenade.'},
    {id:'narada930',start:'21:30',end:'22:15',time:'9:30',title:'DJ Narada · Fair After Dark',loc:'Plaza Pacifica',map:'',note:'Second Friday-night dance set.'},
    {id:'sofie10',start:'22:00',end:'22:40',time:'10:00',title:'Sofie Tabesh',loc:'Meadows Stage',map:'',note:'Final Meadows Stage set.'},
    {id:'mariachi1015',start:'22:15',end:'23:00',time:'10:15',title:'Mariachi Juvenil',loc:'OC Promenade Stage',map:'33.66714,-117.90027',note:'Final Mariachi set of the night.'},
    {id:'narada1030',start:'22:30',end:'23:15',time:'10:30',title:'DJ Narada · Fair After Dark',loc:'Plaza Pacifica',map:'',note:'Last listed DJ Narada set tonight.'}
  ];

  const extraPlaces = [
    {
      id:'collections', icon:'🏆', title:'Collections + Table Settings', cats:'best chill family browse', map:'',
      text:'Blue-ribbon collections plus the second Table Settings show in Hobbies & Handcrafts. Indoor, easy, and open until 11 tonight.',
      meta:['Hobbies & Handcrafts','until 11','easy browse']
    },
    {
      id:'culinary', icon:'🍰', title:'Culinary Arts + Chef Ray Duey', cats:'best shylene family chill', map:'33.66714,-117.90027',
      text:'Culinary competition displays and Chef Ray Duey are running in OC Promenade until 11. Good add-on to Explorium or Sand & Sea.',
      meta:['OC Promenade','until 11','food + exhibits']
    },
    {
      id:'ribbons', icon:'🌻', title:'Fruit, Vegetable + Floral Ribbons', cats:'shylene family chill browse', map:'33.66606,-117.90208',
      text:'Walk the current fruit, vegetable and floral competition displays around the Silo, Patio and Millennium Barn before 10.',
      meta:['farm side','until 10','blue ribbons']
    },
    {
      id:'scrollsaw', icon:'🪚', title:'Woodworkers + Scroll Saw Demos', cats:'best family chill browse cool', map:'33.66688,-117.90035',
      text:'OC Woodworkers and scroll-saw demonstrations in the Visual Arts area. Better than just looking at finished pieces because you can watch the craft happen.',
      meta:['Visual Arts','until 10','live demo']
    }
  ];

  function addEvents() {
    if (typeof tonightEvents === 'undefined' || !Array.isArray(tonightEvents)) return;
    const ids = new Set(tonightEvents.map(e => e.id));
    extraEvents.forEach(e => { if (!ids.has(e.id)) tonightEvents.push(e); });
  }

  function expandedRenderTonight() {
    const el = $('#tonightList');
    if (!el || typeof tonightEvents === 'undefined') return;
    const now = typeof nowLA === 'function' ? nowLA() : 0;
    const toMin = typeof mins === 'function' ? mins : s => {
      const [h,m] = s.split(':').map(Number); return h * 60 + m;
    };
    const format = typeof fmt === 'function' ? fmt : n => `${Math.max(0,Math.round(n))}m`;

    const live = tonightEvents
      .filter(e => now >= toMin(e.start) && now < toMin(e.end))
      .sort((a,b) => toMin(a.end) - toMin(b.end));
    const future = tonightEvents
      .filter(e => now < toMin(e.start))
      .sort((a,b) => toMin(a.start) - toMin(b.start));

    const list = [...live.slice(0,3), ...future]
      .filter((e,i,a) => a.findIndex(x => x.id === e.id) === i)
      .slice(0,6);

    if (!list.length) {
      el.innerHTML = '<div class="exploreHint"><b>Scheduled stuff is winding down.</b> Switch back to Best for exhibits, drinks, REWIND and night rides.</div>';
      return;
    }

    el.innerHTML = '';
    list.forEach(e => {
      const isLive = now >= toMin(e.start) && now < toMin(e.end);
      const d = document.createElement('div');
      d.className = 'tonightCard' + (isLive ? ' live' : '');
      const status = isLive ? 'LIVE' : format(toMin(e.start) - now);
      const mapButton = e.map ? '<button type="button">Open Maps</button>' : '';
      d.innerHTML = `
        <div class="tonightWhen"><b>${e.time}</b><span>${status}</span></div>
        <div class="tonightBody">
          <h3>${e.title}</h3>
          <p>${e.note}</p>
          <div class="tonightMeta">${mapButton}<small>${e.loc}</small></div>
        </div>`;
      const btn = $('button', d);
      if (btn && typeof openAppleMaps === 'function') btn.onclick = () => openAppleMaps(e.map, e.title);
      el.appendChild(d);
    });

    const head = $('#tonightSection .sectionHead span');
    if (head) head.textContent = 'live + next shows';
  }

  function createPlaceCard(p) {
    const card = document.createElement('div');
    card.className = 'placeCard extraV23';
    card.dataset.cats = p.cats;
    card.dataset.extraId = p.id;
    if (p.map) card.dataset.map = p.map;
    card.innerHTML = `
      <div class="placeIcon">${p.icon}</div>
      <div>
        <h3>${p.title}</h3>
        <p>${p.text}</p>
        <div class="placeMeta">${p.meta.map(x => `<span>${x}</span>`).join('')}</div>
      </div>`;
    if (p.map) {
      const content = card.children[1];
      const btn = document.createElement('button');
      btn.className = 'mapPill';
      btn.type = 'button';
      btn.textContent = 'Open Maps';
      btn.onclick = ev => {
        ev.stopPropagation();
        if (typeof openAppleMaps === 'function') openAppleMaps(p.map, p.title);
      };
      content.appendChild(btn);
    }
    return card;
  }

  function filterExtras(filter) {
    $$('.extraV23').forEach(card => {
      const cats = (card.dataset.cats || '').split(' ');
      const show = filter === 'all' || filter === 'best' && cats.includes('best') || filter === 'shylene' && cats.includes('shylene') || filter === 'chill' && cats.includes('chill');
      card.classList.toggle('hide', !show);
    });
  }

  function addPlaces() {
    const grid = $('#placeGrid');
    if (!grid) return;
    extraPlaces.forEach(p => {
      if ($(`.extraV23[data-extra-id="${p.id}"]`)) return;
      grid.appendChild(createPlaceCard(p));
    });

    $$('#exploreFilters button').forEach(b => {
      b.addEventListener('click', () => filterExtras(b.dataset.filter));
    });
    const active = $('#exploreFilters button.active')?.dataset.filter || 'best';
    filterExtras(active);
  }

  addEvents();
  addPlaces();

  if (typeof renderTonight === 'function') {
    try { renderTonight = expandedRenderTonight; } catch (e) { window.renderTonight = expandedRenderTonight; }
    expandedRenderTonight();
  }
})();
