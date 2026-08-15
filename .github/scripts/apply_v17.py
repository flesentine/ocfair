from pathlib import Path
import re

p = Path('index.html')
s = p.read_text(encoding='utf-8')

if 'id="ux-v17"' in s:
    print('V17 already applied')
    raise SystemExit(0)

s = s.replace('<title>Fair Night — Exact Pins V16</title>', '<title>Fair Night — Live Explore V17</title>', 1)

css = r'''<style id="ux-v17">
#view-explore .section{padding-left:16px;padding-right:16px}
#view-explore .exploreHero{padding:18px 18px 17px;border-radius:24px;background:linear-gradient(150deg,#24232e,#16161d);box-shadow:none}
#view-explore .exploreHero h2{font-size:28px;margin:5px 0 8px;line-height:1.03}
#view-explore .exploreHero p{font-size:14px;line-height:1.45;color:#e0dbe4;max-width:none}
#view-explore .filterBar{position:sticky;top:70px;z-index:18;margin:0 -16px;padding:11px 16px 10px;background:rgba(10,10,15,.94);backdrop-filter:blur(18px);border-bottom:1px solid #2d2b35}
#view-explore .filterBar button{min-height:40px;padding:0 13px;font-size:12px;color:#d8d2dc;background:#1d1c25;border-color:#44414c}
#view-explore .filterBar button.active{background:#fff;color:#09090d;border-color:#fff}
#view-explore .sectionHead{align-items:center;margin-bottom:11px}
#view-explore .sectionHead h2{font-size:24px;letter-spacing:-.025em}
#view-explore .sectionHead span{font-size:10px;color:#c6c0ca;letter-spacing:.08em}
#view-explore .placeGrid{gap:10px}
#view-explore .placeCard{grid-template-columns:52px minmax(0,1fr);gap:12px;padding:15px;border-radius:20px;background:#1b1a23;border-color:#403e49}
#view-explore .placeArrow{display:none}
#view-explore .placeIcon{width:52px;height:52px;font-size:27px;background:#2a2933}
#view-explore .placeCard h3{font-size:16px;line-height:1.2;margin:1px 0 5px}
#view-explore .placeCard p{font-size:13.5px;line-height:1.43;color:#d4ced8}
#view-explore .placeMeta{margin-top:8px;gap:5px}
#view-explore .placeMeta span{font-size:10px;padding:5px 8px;color:#ded8e2;background:#302f39}
#view-explore .mapPill{min-height:39px;margin-top:10px;padding:0 12px;font-size:11px;border-color:rgba(105,224,255,.34);background:rgba(105,224,255,.10);color:#d7f7ff}
#view-explore .coordText{font-size:10.5px;color:#d9bd70;font-weight:750;opacity:.9}
#view-explore .spotlight{padding:17px;border-radius:21px;background:linear-gradient(135deg,rgba(158,134,255,.17),rgba(255,79,134,.11))}
#view-explore .spotlight b{font-size:18px}
#view-explore .spotlight p{font-size:13.5px;line-height:1.45;color:#e1dbe5;max-width:none}
#view-explore .spotTags span{font-size:10px;padding:5px 7px}
.tonightList{display:grid;gap:9px}
.tonightCard{display:grid;grid-template-columns:64px minmax(0,1fr);gap:12px;padding:14px;border-radius:19px;background:#1b1a23;border:1px solid #403e49}
.tonightCard.live{border-color:rgba(88,221,160,.62);background:linear-gradient(110deg,rgba(88,221,160,.10),#1b1a23 46%)}
.tonightWhen{padding-top:1px}
.tonightWhen b{display:block;font-size:15px;color:var(--gold)}
.tonightWhen span{display:block;margin-top:4px;font-size:9px;font-weight:900;letter-spacing:.09em;text-transform:uppercase;color:#bdb7c2}
.tonightCard.live .tonightWhen span{color:#8ff0bd}
.tonightBody h3{margin:0 0 4px;font-size:16px;line-height:1.2}
.tonightBody p{margin:0;color:#d2ccd6;font-size:12.5px;line-height:1.4}
.tonightMeta{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:9px}
.tonightMeta button{min-height:36px;border-radius:11px;border:1px solid rgba(105,224,255,.3);background:rgba(105,224,255,.09);color:#d7f7ff;font-size:10px;font-weight:900;padding:0 10px}
.tonightMeta small{color:#aaa4ae;font-size:9.5px}
.exploreHint{margin-top:10px;padding:12px 13px;border-radius:16px;background:#17171e;border:1px solid #33313c;color:#d7d1dc;font-size:12px;line-height:1.42}
.exploreHint b{color:#fff}
@media(max-width:370px){#view-explore .filterBar button{font-size:11px;padding:0 11px}.tonightCard{grid-template-columns:58px 1fr}}
</style>'''
s = s.replace('</head>', css + '\n</head>', 1)

old_top = '''      <div class="exploreHero"><div class="eyebrow">Wander mode</div><h2>Worth a detour.</h2><p>Not everything needs a scheduled time. These are the places I’d actually pull you toward if you’re nearby and have 15–40 minutes.</p></div>
      <div class="filterBar" id="exploreFilters"><button class="active" data-filter="all">Everything</button><button data-filter="family">👨‍👩‍👧 Family</button><button data-filter="cool">✨ Cool stuff</button><button data-filter="chill">🌿 Easy</button><button data-filter="beer">🍺 Beer</button><button data-filter="shop">🛍 Shop</button></div>'''
new_top = '''      <div class="exploreHero"><div class="eyebrow">Explore · curated for tonight</div><h2>Pick by mood, not by directory.</h2><p>I trimmed the fair down to things actually worth your time. Start with Best, or jump straight to what Shylene would like, something easy, tonight’s live stuff, or a drink.</p></div>
      <div class="filterBar" id="exploreFilters"><button class="active" data-filter="best">★ Best</button><button data-filter="shylene">👧 Shylene</button><button data-filter="chill">🌿 Easy</button><button data-filter="tonight">🌙 Tonight</button><button data-filter="beer">🍺 Drinks</button><button data-filter="all">All</button></div>'''
if old_top not in s:
    raise SystemExit('Explore header anchor not found')
s = s.replace(old_top, new_top, 1)

insert_anchor = '''    </section>

    <section class="section" style="padding-top:10px">
      <div class="spotlight">'''
tonight_section = '''    </section>

    <section class="section" id="tonightSection" style="padding-top:16px">
      <div class="sectionHead"><h2>Tonight, live</h2><span>next useful options</span></div>
      <div class="tonightList" id="tonightList"></div>
      <div class="exploreHint"><b>Don’t chase the clock.</b> This list automatically drops things that are over. If two choices overlap, pick whichever is already near you.</div>
    </section>

    <section class="section" style="padding-top:16px">
      <div class="spotlight">'''
if insert_anchor not in s:
    raise SystemExit('Tonight insert anchor not found')
s = s.replace(insert_anchor, tonight_section, 1)

s = s.replace('data-cats="family cool chill" data-map="33.66714,-117.90027"', 'data-cats="best shylene family cool chill" data-map="33.66714,-117.90027"', 1)
s = s.replace('data-cats="family chill" data-map="33.66599,-117.90253"', 'data-cats="best shylene family chill" data-map="33.66599,-117.90253"', 1)
s = s.replace('data-cats="family cool" data-map="33.66770,-117.89915"', 'data-cats="shylene family cool" data-map="33.66770,-117.89915"', 1)
s = s.replace('data-cats="cool chill" data-map="33.66688,-117.90035"', 'data-cats="chill browse cool" data-map="33.66688,-117.90035"', 1)
s = s.replace('data-cats="shop chill" data-map="33.66670,-117.90300"', 'data-cats="browse chill" data-map="33.66670,-117.90300"', 1)

crafters = '''      <div class="placeCard" data-cats="browse chill" data-map="33.66670,-117.90300"><div class="placeIcon">🛍️</div><div><h3>Crafters Village + shopping buildings</h3><p>Good wandering territory when Ati wants to browse and nobody wants to commit to another scheduled event.</p><div class="placeMeta"><span>shopping</span><span>browsing</span></div></div><div class="placeArrow">›</div></div>'''
additions = '''      <div class="placeCard" data-cats="best shylene family cool" data-map="33.66714,-117.90027"><div class="placeIcon">🔎</div><div><h3>Surf & Snack Society Scavenger Hunt</h3><p>A low-commitment hunt through OC Promenade that gives Shylene something to actively do instead of just walking past exhibits.</p><div class="placeMeta"><span>OC Promenade</span><span>open until 10</span><span>Shylene pick</span></div></div><div class="placeArrow">›</div></div>
      <div class="placeCard" data-cats="best shylene family cool" data-map="33.66714,-117.90027"><div class="placeIcon">🧪</div><div><h3>Explorium</h3><p>Hands-on exhibit space inside OC Promenade. Good spontaneous stop when you want something interactive without committing to a ride line.</p><div class="placeMeta"><span>OC Promenade</span><span>hands-on</span><span>until 11</span></div></div><div class="placeArrow">›</div></div>
      <div class="placeCard" data-cats="chill browse cool" data-map="33.66618,-117.90350"><div class="placeIcon">✈️</div><div><h3>Heroes Hall + A-4 Skyhawk</h3><p>Vietnam exhibit, the Santa Ana Army Air Base story and the full-size A-4M Skyhawk outside. A genuinely different change of pace from the midway.</p><div class="placeMeta"><span>history</span><span>aircraft</span><span>quiet detour</span></div><div class="coordText">📍 33.66618, -117.90350</div></div><div class="placeArrow">›</div></div>
      <div class="placeCard" data-cats="shylene family cool" data-map="33.66758,-117.89920"><div class="placeIcon">🐓</div><div><h3>Urban Chickens + Livestock Pavilion</h3><p>Tonight’s livestock area includes Urban Chickens and Golden West Game Breeders. Better if Shylene wants animals but you’ve already done Centennial Farm.</p><div class="placeMeta"><span>livestock</span><span>animals</span><span>until 10</span></div><div class="coordText">📍 33.66758, -117.89920</div></div><div class="placeArrow">›</div></div>'''
if crafters not in s:
    raise SystemExit('Crafters card anchor not found')
s = s.replace(crafters, crafters + '\n' + additions, 1)

s = s.replace("openAppleMaps('33.66685,-117.90178')", "openAppleMaps('33.66685,-117.90178','REWIND: A VHS Comeback')")

tonight_js = '''const tonightEvents=[
 {id:'pigs5',start:'17:00',end:'17:30',time:'5:00',title:'All-Alaskan Racing Pigs',loc:'Park Plaza',map:'33.66722,-117.90302',note:'If you are close, this is still worth catching. Shylene can pick a pig.'},
 {id:'livestock6',start:'18:00',end:'18:30',time:'6:00',title:'Global Livestock & Exotics',loc:'Livestock Corral',map:'33.66758,-117.89920',note:'A short animal stop that feels more special than another lap through the midway.'},
 {id:'magic6',start:'18:00',end:'18:45',time:'6:00',title:'Magic of Frank Thurston',loc:'OC Promenade Stage',map:'33.66714,-117.90027',note:'Best sit-down reset: real show, shade from walking, and easy for all three of you.'},
 {id:'cow615',start:'18:15',end:'18:30',time:'6:15',title:'Cow Milking Demonstration',loc:'Millennium Barn',map:'33.66606,-117.90208',note:'Only 15 minutes and very county-fair. Great Shylene detour if you are near the farm.'},
 {id:'pigs630',start:'18:30',end:'19:00',time:'6:30',title:'Racing Pigs — second chance',loc:'Park Plaza',map:'33.66722,-117.90302',note:'Missed 5 PM? You get another shot at 6:30.'},
 {id:'cantina',start:'18:00',end:'22:00',time:'6–10',title:'La Nueva Diligencia',loc:'La Cantina',map:'33.66636,-117.90108',note:'Live music plus margaritas, palomas and beer. Easy grown-up stop without leaving the family flow.'},
 {id:'pour8',start:'20:00',end:'21:00',time:'8:00',title:'Art of the Pour',loc:'OC Promenade',map:'33.66714,-117.90027',note:'Paid 21+ cocktail session. Only choose this if Ati and Shylene are happy doing their own nearby thing.'},
 {id:'beegold',start:'20:15',end:'22:15',time:'8:15',title:'Bee Gees Gold',loc:'The Hangar',map:'33.66776,-117.90091',note:'Big recognizable-music option later tonight. Good if you want to end with a show instead of more rides.'},
 {id:'mariachi',start:'20:15',end:'21:00',time:'8:15',title:'Mariachi Juvenil',loc:'OC Promenade Stage',map:'33.66714,-117.90027',note:'Free evening performance and an easy add-on if you are already around Promenade.'}
];
'''
if 'const events=[\n' not in s:
    raise SystemExit('Events anchor not found')
s = s.replace('const events=[\n', tonight_js + 'const events=[\n', 1)

renderer = r'''function renderTonight(){const el=document.getElementById('tonightList');if(!el)return;const now=nowLA();const live=tonightEvents.filter(e=>now>=mins(e.start)&&now<mins(e.end));const future=tonightEvents.filter(e=>now<mins(e.start)).sort((a,b)=>mins(a.start)-mins(b.start));let list=[...live,...future].filter((e,i,a)=>a.findIndex(x=>x.id===e.id)===i).slice(0,4);if(!list.length){el.innerHTML='<div class="exploreHint"><b>Scheduled stuff is winding down.</b> Switch back to Best for exhibits, drinks, REWIND and night rides.</div>';return}el.innerHTML='';list.forEach(e=>{const isLive=now>=mins(e.start)&&now<mins(e.end);const d=document.createElement('div');d.className='tonightCard'+(isLive?' live':'');const status=isLive?'LIVE':fmt(mins(e.start)-now);d.innerHTML=`<div class="tonightWhen"><b>${e.time}</b><span>${status}</span></div><div class="tonightBody"><h3>${e.title}</h3><p>${e.note}</p><div class="tonightMeta"><button type="button"> exact pin</button><small>${e.loc}</small></div></div>`;d.querySelector('button').onclick=()=>openAppleMaps(e.map,e.title);el.appendChild(d)})}
function renderTimeline(){'''
if 'function renderTimeline(){' not in s:
    raise SystemExit('Timeline renderer anchor not found')
s = s.replace('function renderTimeline(){', renderer, 1)

pat = r"function setupExplore\(\)\{.*?\}\nfunction renderAll\(\)\{renderFocus\(\);renderUpcoming\(\);renderTimeline\(\);renderMissions\(\);renderPace\(\)\}"
repl = r'''function setupExplore(){const buttons=[...document.querySelectorAll('#exploreFilters button')];const filterCards=[...document.querySelectorAll('#placeGrid .placeCard')];const mapCards=[...document.querySelectorAll('.placeCard[data-map]')];const apply=f=>{buttons.forEach(x=>x.classList.toggle('active',x.dataset.filter===f));if(f==='tonight'){document.getElementById('tonightSection')?.scrollIntoView({behavior:'smooth',block:'start'});return}if(f==='beer'){document.getElementById('drinksSection')?.scrollIntoView({behavior:'smooth',block:'start'});return}filterCards.forEach(c=>c.classList.toggle('hide',f!=='all'&&!c.dataset.cats.split(' ').includes(f)))};buttons.forEach(b=>b.onclick=()=>apply(b.dataset.filter));mapCards.forEach(c=>{const content=c.children[1];if(!content||content.querySelector('.mapPill'))return;const btn=document.createElement('button');btn.className='mapPill';btn.type='button';btn.textContent=' Maps · exact pin';btn.onclick=(ev)=>{ev.stopPropagation();openAppleMaps(c.dataset.map,c.querySelector('h3')?.textContent.replace('BEST FIT','').trim()||'OC Fair stop')};content.appendChild(btn)});apply('best')}
function renderAll(){renderFocus();renderUpcoming();renderTonight();renderTimeline();renderMissions();renderPace()}'''
s, n = re.subn(pat, repl, s, count=1, flags=re.S)
if n != 1:
    raise SystemExit('Explore setup replacement failed')

s = s.replace("setInterval(()=>{try{renderFocus();renderUpcoming()}catch(e){console.warn('Live refresh skipped',e)}},60000);", "setInterval(()=>{try{renderFocus();renderUpcoming();renderTonight()}catch(e){console.warn('Live refresh skipped',e)}},60000);", 1)
s = s.replace('<div class="sectionHead"><h2>Places to wander into</h2><span>no schedule required</span></div>', '<div class="sectionHead"><h2>Good anytime</h2><span>worth the detour</span></div>', 1)
s = s.replace('Apple Maps now opens literal dropped pins', 'Navigation uses literal dropped pins', 1)

if '28799441' in s or '465873631' in s:
    raise SystemExit('Private Etix credentials detected')
for must in ['id="ux-v17"', 'id="tonightList"', 'const tonightEvents=[', 'Surf & Snack Society Scavenger Hunt', 'Heroes Hall + A-4 Skyhawk', 'renderTonight()']:
    if must not in s:
        raise SystemExit('Missing V17 element: ' + must)
if '</html>' not in s[-500:]:
    raise SystemExit('HTML incomplete')

p.write_text(s, encoding='utf-8')
print('Explore UX V17 applied')
