// Helpers shared by Connections, Top 10 and Silhouette (Country Grid has its own): page header, toast, info box,
// daily key and number, seeds, streaks and sharing the result.
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const $=id=>document.getElementById(id);
const app=$('app'),layer=$('layer');
// hidden test mode, as in Borderline: ?test&day=2026-11-20 plays that day's puzzle (results are not saved)
const TESTQ=(()=>{try{return new URLSearchParams(location.search)}catch(e){return new URLSearchParams()}})();
const TESTDAY=TESTQ.has('test')&&/^\d{4}-\d{2}-\d{2}$/.test(TESTQ.get('day')||'')?TESTQ.get('day'):null;
function todayKey(){if(TESTDAY)return TESTDAY;const p=madridParts(Date.now());return p.year+'-'+p.month+'-'+p.day}
const dayNum=(key,first)=>Math.round((Date.parse(key+'T00:00Z')-Date.parse(first+'T00:00Z'))/864e5)+1;
function msToNextDay(){const p=madridParts(Date.now());return (24*3600-(+p.hour*3600+ +p.minute*60+ +p.second))*1000}
const nextIn=()=>{const ms=msToNextDay();return `${Math.floor(ms/36e5)} h ${Math.floor(ms%36e5/6e4)} min`};
// the same seed for everyone on a given day
function seedOf(str){let h=2166136261;for(const ch of str){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0}return h}
function load(k,def){try{const v=JSON.parse(localStorage.getItem(k)||'null');return v==null?def:v}catch(e){return def}}
function store(k,v){if(TESTDAY&&k!=='cx-free'&&k!=='t10-free'&&k!=='sil-train')return;try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
// days played in a row, ending today (or yesterday when today is not played yet)
function streakOf(hist){const day=k=>Math.round(Date.parse(k+'T12:00Z')/864e5),set=new Set(Object.keys(hist).map(day));
  let d=set.has(day(todayKey()))?day(todayKey()):day(todayKey())-1,n=0;while(set.has(d)){n++;d--}return n}

let toastT=null,toastMsg=null;
function toast(msg,kind){toastMsg={msg,kind};clearTimeout(toastT);toastT=setTimeout(()=>{toastMsg=null;drawToast()},2200);drawToast()}
function drawToast(){let el=$('toastbox');if(!el){el=document.createElement('div');el.id='toastbox';document.body.appendChild(el)}
  el.innerHTML=toastMsg?`<div class="toast ${toastMsg.kind||''}" role="status">${esc(toastMsg.msg)}</div>`:''}
// a dialog over the page (rules, a category's meaning); closes with its button, the scrim or Escape
function dialog(title,html,label){layer.innerHTML=`<div class="infoscrim" id="dscrim"></div><div class="infobox helpbox" role="dialog" aria-modal="true" aria-labelledby="dlgt"><h2 id="dlgt">${title}</h2>${html}<button class="primary" id="dok">${label||'Got it'}</button></div>`;
  const close=()=>{layer.innerHTML=''};$('dok').onclick=$('dscrim').onclick=close;$('dok').focus()}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('dok'))layer.innerHTML=''});
// header and Menu as in Borderline: on the home screen the Menu sits on the "Playing as" line, elsewhere in the header.
// Tapping the logo goes back to the home screen (each page defines goHome).
const MICONS={menu:'M4 6h16M4 12h16M4 18h16',games:'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',help:'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18M12 17v.01M12 13.5a1.5 1.5 0 0 1 1-1.5a2.6 2.6 0 1 0-3-4',
  stats:'M4 12h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1M10 8h4a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1M16 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1',
  credits:'M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6v13M12 6v13M21 6v13'};
const mico=k=>`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="${MICONS[k]}"/></svg>`;
const menuBtn=()=>`<button class="helpbtn" id="menu" aria-haspopup="true" aria-expanded="false">${mico('menu')}Menu</button>`;
// the name you play with in Borderline (same site, so the same device storage); Guest otherwise
function playerName(){try{return localStorage.getItem('bl-user')||'Guest'}catch(e){return 'Guest'}}
function header(brand,coord,home){
  const top=`<header class="top"><h1 class="brand" id="brand" role="link" tabindex="0" title="Home">${brand}</h1><span class="coord">${esc(coord)}</span>${home?'':menuBtn()}</header>`;
  return home?top+`<div class="userline"><span class="pin" style="background:var(--sea)"></span>Playing as ${esc(playerName())}<span class="uright">${menuBtn()}</span></div>`:top}
function drawMenu(open){let box=$('menulayer');
  if(!box){box=document.createElement('div');box.id='menulayer';document.body.appendChild(box)}
  const b=$('menu');if(b)b.setAttribute('aria-expanded',open?'true':'false');
  if(!open){box.innerHTML='';return}
  const it=(k,label)=>`<button class="mitem" data-menu="${k}">${mico(k)}${label}</button>`;
  box.innerHTML=`<div class="menuscrim" id="menuscrim"></div><nav class="menubox" aria-label="Menu" style="top:${Math.round((b?b.getBoundingClientRect().bottom:54)+4)}px">${it('help','How to play')}${it('stats','My stats')}${it('credits','Credits &amp; data sources')}${it('games','More games')}</nav>`;
  $('menuscrim').onclick=()=>drawMenu(false);
  box.querySelectorAll('[data-menu]').forEach(m=>m.onclick=()=>{const k=m.dataset.menu;drawMenu(false);
    if(k==='help')dialog('How to play',rulesHTML());
    else if(k==='stats')dialog('My stats',`<p class="hint">Your daily games, kept on this device.</p>${statsHTML()}`);
    else if(k==='credits')dialog('Credits &amp; data sources',typeof creditsHTML==='function'?creditsHTML():`<p>The countries, flags, categories and figures are the same ones Borderline uses, with the same sources.</p><p>The full list of sources is in Borderline: <a href="../borderline/">open Borderline</a> and tap <b>Menu → Credits &amp; data sources</b>.</p>`);
    else if(k==='games')location.href=typeof MORE_GAMES==='string'?MORE_GAMES:'https://hectorei19.github.io/geo-games/'})}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('#menu,#brand');if(!t)return;
  if(t.id==='menu')drawMenu(!document.querySelector('#menulayer .menubox'));else if(typeof goHome==='function')goHome()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.querySelector('#menulayer .menubox'))drawMenu(false);
  if(e.key==='Enter'&&document.activeElement&&document.activeElement.id==='brand'&&typeof goHome==='function')goHome()});

// phones: the system share menu; elsewhere copy the result and the link (if the clipboard is blocked, select the text)
const TOUCH=matchMedia('(pointer:coarse)').matches;
function share(text){
  const manual=()=>{const el=$('share');if(el){el.textContent=text;const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r)}
    let ok=false;try{ok=document.execCommand('copy')}catch(e){}toast(ok?'Result and link copied.':'Copy blocked here. The text is selected: copy it manually.',ok?'good':'')};
  if(navigator.share&&TOUCH){navigator.share({text}).catch(e=>{if(e&&e.name!=='AbortError')manual()});return}
  try{navigator.clipboard.writeText(text).then(()=>toast('Result and link copied.','good'),manual)}catch(e){manual()}}
const pageLink=q=>location.origin+location.pathname+(q||'');
