(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const m = s => { const [h,n]=s.split(':').map(Number); return h*60+n; };
  const clock = n => { let h=Math.floor(n/60)%24, mm=n%60; const ap=h>=12?'PM':'AM'; h=h%12||12; return `${h}:${String(mm).padStart(2,'0')} ${ap}`; };

  const pins = {
    'Centennial Farm':'33.66599,-117.90253',
    'Heroes Hall':'33.66618,-117.90350',
    'Livestock Pavilion':'33.66758,-117.89920',
    'OC Promenade':'33.66714,-117.90027',
    'Silo Building, Patio & Millennium Barn':'33.66606,-117.90208',
    'Visual Arts & Woodworking Gallery':'33.66688,-117.90035',
    'Visual Arts Gallery':'33.66688,-117.90035',
    'Visual Arts - Los Alamitos (Bldg 14)':'33.66688,-117.90035',
    'Livestock Show Ring':'33.66758,-117.89920',
    'Livestock Corral':'33.66758,-117.89920',
    'OC Promenade Stage':'33.66714,-117.90027',
    'La Cantina':'33.66636,-117.90108',
    'Millennium Barn':'33.66606,-117.90208',
    'Park Plaza':'33.66722,-117.90302',
    'Hangar Stage':'33.66776,-117.90091'
  };

  const S = (id,start,end,title,loc,cats,opts={}) => ({id,start,end,title,loc,cats:cats.split(' '),map:pins[loc]||'',...opts});
  const schedule = [
    S('fruitgrowers','11:00','22:00','California Rare Fruit Growers Exhibit','Centennial Farm','exhibits animals kids'),
    S('gardeners','11:00','22:00','UC Cooperative Extension Master Gardeners','Centennial Farm','exhibits animals kids'),
    S('farmanimals','11:00','22:00','Centennial Farm’s Animals & Gardens','Centennial Farm','animals kids exhibits'),
    S('producebin','11:00','22:00','Centennial Farm Specialty Crop Produce Bin','Centennial Farm','exhibits animals kids'),
    S('vietnam','11:00','22:00','Echoes of Conflict: Remembering Vietnam','Heroes Hall','exhibits'),
    S('saaab','11:00','22:00','The SAAAB Story','Heroes Hall','exhibits'),
    S('collections','11:00','23:00','Collections Competition','Hobbies & Handcrafts Gallery','exhibits'),
    S('tablesettings','11:00','23:00','2nd Table Settings Show','Hobbies & Handcrafts Gallery','exhibits'),
    S('gamebreeders','11:00','22:00','Golden West Game Breeders','Livestock Pavilion','animals kids exhibits'),
    S('chickens','11:00','22:00','Urban Chickens','Livestock Pavilion','animals kids exhibits'),
    S('culinary','11:00','23:00','Culinary Arts','OC Promenade','exhibits kids'),
    S('explorium','11:00','23:00','Explorium','OC Promenade','kids exhibits'),
    S('chefray','11:00','23:00','Chef Ray Duey','OC Promenade','exhibits kids'),
    S('producefloral','11:00','22:00','Fruit, Vegetable & Floral Competitions','Silo Building, Patio & Millennium Barn','exhibits kids'),
    S('finearts','11:00','23:00','Fine Arts, Photography and Woodworking','Visual Arts & Woodworking Gallery','exhibits'),
    S('fiberarts','11:00','23:00','Fiber Arts, Handcrafts & Jewelry','Hobbies & Handcrafts Gallery','exhibits'),
    S('featuredartist','11:00','22:00','Featured Artist','Visual Arts Gallery','exhibits'),
    S('gilortega','11:00','22:00','Gil Ortega Exhibit','Visual Arts Gallery','exhibits'),
    S('woodworkers','11:00','22:00','OC Woodworkers & Scroll Saw Demonstrations','Visual Arts - Los Alamitos (Bldg 14)','exhibits kids'),
    S('photoexhibit','11:00','22:00','Photography Exhibit','Visual Arts - Los Alamitos (Bldg 14)','exhibits'),
    S('scavenger','11:00','22:00','Surf & Snack Society Scavenger Hunt','OC Promenade','kids exhibits'),
    S('postcards','12:00','19:00','Postcards for Troops','Heroes Hall','kids exhibits'),
    S('30weight','16:30','17:10','30 Weight Rock Band','Plaza Stage','music show'),
    S('secondwind','17:00','19:00','Second Wind and Friends','Butterfly Stage','music'),
    S('arabian','17:00','17:30','Cal Poly Pomona Arabian Horse Center','Livestock Show Ring','animals kids show'),
    S('luckycoot','17:00','17:40','Lucky Coot and the Band of Bobs','Meadows Stage','music'),
    S('popculture','17:00','17:45','Pop Culture at the OC Fair','OC Promenade Stage','show kids'),
    S('quidpunk','17:30','18:10','QuidPunkQuo','Plaza Stage','music'),
    S('taps','18:00','18:10','Taps & Flag Ceremony','Heroes Hall','show'),
    S('globalstock','18:00','18:30','Global Livestock & Exotics','Livestock Corral','animals kids show'),
    S('magic','18:00','18:45','The Magic of Frank Thurston','OC Promenade Stage','show kids'),
    S('diligencia','18:00','22:00','La Nueva Diligencia','La Cantina','music'),
    S('milking','18:15','18:30','Cow Milking Demonstrations','Millennium Barn','animals kids show'),
    S('jbk','18:30','19:10','JBK Band','Plaza Stage','music'),
    S('pigs630','18:30','19:00','All-Alaskan Racing Pigs','Park Plaza','show animals kids'),
    S('phil7','19:00','19:45','Phil Shane','Baja Bar and Grill','music'),
    S('canyon7','19:00','19:45','Centennial Canyon Riders','Butterfly Stage','music'),
    S('eating','19:00','19:30','Eating Contest','OC Promenade Stage','show kids'),
    S('headheart','19:30','21:30','The Head & The Heart + Wilderado','Pacific Amphitheatre','music show',{paid:true,badge:'TICKETED'}),
    S('phil8','20:00','20:45','Phil Shane','Baja Bar and Grill','music'),
    S('sofie8','20:00','20:40','Sofie Tabesh','Meadows Stage','music'),
    S('canyon8','20:00','20:45','Centennial Canyon Riders','Butterfly Stage','music'),
    S('pigs8','20:00','20:30','All-Alaskan Racing Pigs','Park Plaza','show animals kids'),
    S('pour','20:00','21:00','Art of the Pour – The Liquid Kitchen','OC Promenade','show',{paid:true,adult:true,badge:'$55 · 21+'}),
    S('beegees','20:15','22:15','Bee Gees Gold','Hangar Stage','music show',{paid:true,badge:'TICKETED'}),
    S('mariachi815','20:15','21:00','Mariachi Juvenil','OC Promenade Stage','music show'),
    S('narada830','20:30','21:15','DJ Narada · Fair After Dark','Plaza Pacifica','music show'),
    S('phil9','21:00','21:45','Phil Shane','Baja Bar and Grill','music'),
    S('sofie9','21:00','21:40','Sofie Tabesh','Meadows Stage','music'),
    S('canyon9','21:00','21:45','Centennial Canyon Riders','Butterfly Stage','music'),
    S('mariachi915','21:15','22:00','Mariachi Juvenil','OC Promenade Stage','music show'),
    S('narada930','21:30','22:15','DJ Narada · Fair After Dark','Plaza Pacifica','music show'),
    S('sofie10','22:00','22:40','Sofie Tabesh','Meadows Stage','music'),
    S('mariachi1015','22:15','23:00','Mariachi Juvenil','OC Promenade Stage','music show'),
    S('narada1030','22:30','23:15','DJ Narada · Fair After Dark','Plaza Pacifica','music show')
  ];

  let mode='next';

  function nowMinutes(){ return typeof nowLA==='function' ? nowLA() : new Date().getHours()*60+new Date().getMinutes(); }
  function isLive(e,now){ return now>=m(e.start)&&now<m(e.end); }
  function isPast(e,now){ return now>=m(e.end); }
  function timeLabel(e){ return `${clock(m(e.start))}–${clock(m(e.end))}`; }

  function matches(e,now){
    if(mode==='live') return isLive(e,now);
    if(mode==='next') return !isPast(e,now);
    if(mode==='all') return true;
    return e.cats.includes(mode) && !isPast(e,now);
  }

  function order(list,now){
    if(mode==='all') return [...list].sort((a,b)=>m(a.start)-m(b.start)||m(a.end)-m(b.end));
    return [...list].sort((a,b)=>{
      const al=isLive(a,now), bl=isLive(b,now);
      if(al!==bl) return al?-1:1;
      return m(a.start)-m(b.start)||m(a.end)-m(b.end);
    });
  }

  function card(e,now){
    const live=isLive(e,now), past=isPast(e,now);
    const d=document.createElement('article');
    d.className=`officialEvent${live?' live':''}${past?' past':''}`;
    const state=live?'LIVE':past?'PAST':m(e.start)-now<=30?'SOON':'';
    const chips=[...e.cats.slice(0,2).map(c=>c.toUpperCase())];
    if(e.badge) chips.unshift(e.badge);
    d.innerHTML=`
      <div class="officialTime"><b>${clock(m(e.start))}</b><span>${clock(m(e.end))}</span></div>
      <div class="officialBody">
        <div class="officialTitleLine"><h3>${e.title}</h3>${state?`<em>${state}</em>`:''}</div>
        <p>${e.loc}</p>
        <div class="officialChips">${chips.map(x=>`<span>${x}</span>`).join('')}</div>
        ${e.map?'<button class="officialMap" type="button">Open Maps</button>':''}
      </div>`;
    const b=$('.officialMap',d); if(b) b.onclick=()=>typeof openAppleMaps==='function'&&openAppleMaps(e.map,e.title);
    return d;
  }

  function render(){
    const listEl=$('#officialScheduleList'); if(!listEl) return;
    const now=nowMinutes();
    const visible=order(schedule.filter(e=>matches(e,now)),now);
    const liveCount=schedule.filter(e=>isLive(e,now)).length;
    const futureCount=schedule.filter(e=>m(e.start)>now).length;
    const openCount=schedule.filter(e=>!isPast(e,now)).length;
    const summary=$('#officialScheduleSummary');
    if(summary) summary.innerHTML=`<b>${schedule.length} official events</b><span>${liveCount} live · ${futureCount} starting later · ${openCount} not over</span>`;
    listEl.innerHTML='';
    if(!visible.length){ listEl.innerHTML='<div class="officialEmpty">Nothing in this filter right now. Try Next or All.</div>'; return; }
    visible.forEach(e=>listEl.appendChild(card(e,now)));
    $$('#officialModes button').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
  }

  function build(){
    const old=$('#tonightSection'); if(!old) return;
    old.classList.add('officialScheduleSection','hide');
    old.innerHTML=`
      <div class="sectionHead"><h2>Official schedule</h2><span>Fri Aug 14 · complete</span></div>
      <div class="officialSummary" id="officialScheduleSummary"></div>
      <div class="officialModes" id="officialModes">
        <button data-mode="live">● Live</button><button data-mode="next" class="active">Next</button><button data-mode="show">Shows</button><button data-mode="music">Music</button><button data-mode="animals">Animals</button><button data-mode="kids">Kids</button><button data-mode="exhibits">Exhibits</button><button data-mode="all">All 55</button>
      </div>
      <div class="officialHint">Past events disappear from every view except <b>All 55</b>. Ticketed/paid events are labeled. Maps only appears where we have a reliable internal pin.</div>
      <div class="officialScheduleList" id="officialScheduleList"></div>
      <a class="officialSource" href="https://ocfair.com/oc-fair/things-to-do/daily-schedule/" target="_blank" rel="noopener">Official OC Fair schedule ↗</a>`;

    $$('#officialModes button').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;render();});

    const bar=$('#exploreFilters');
    if(bar&&!$('#officialScheduleFilter')){
      const b=document.createElement('button'); b.id='officialScheduleFilter'; b.type='button'; b.dataset.filter='schedule'; b.textContent='📅 Schedule';
      const live=$('button[data-filter="tonight"]',bar); if(live) live.after(b); else bar.appendChild(b);
      b.onclick=()=>openSchedule('next',b);
    }

    const liveFilter=$('#exploreFilters button[data-filter="tonight"]');
    if(liveFilter) liveFilter.addEventListener('click',()=>openSchedule('live',liveFilter));
    $$('#exploreFilters button').forEach(b=>{
      if(b===liveFilter||b.id==='officialScheduleFilter') return;
      b.addEventListener('click',()=>old.classList.add('hide'));
    });
    render();
  }

  function openSchedule(nextMode,button){
    mode=nextMode;
    const sec=$('#tonightSection'); if(!sec) return;
    sec.classList.remove('hide');
    $$('#exploreFilters button').forEach(x=>x.classList.toggle('active',x===button));
    render();
    setTimeout(()=>sec.scrollIntoView({behavior:'smooth',block:'start'}),50);
  }

  function feedNearby(){
    try{
      if(typeof tonightEvents==='undefined'||!Array.isArray(tonightEvents)) return;
      const seen=new Set(tonightEvents.map(e=>e.id));
      schedule.filter(e=>e.map).forEach(e=>{
        const id='official-'+e.id; if(seen.has(id)) return;
        tonightEvents.push({id,start:e.start,end:e.end,time:clock(m(e.start)),title:e.title,loc:e.loc,map:e.map,note:e.paid?(e.badge||'Ticketed event'):`Official OC Fair · ${e.cats[0]}`});
      });
    }catch(err){console.warn('Official schedule nearby feed skipped',err);}
  }

  build();
  feedNearby();
  setInterval(render,60000);
  window.FAIR_OFFICIAL_SCHEDULE=schedule;
})();
