// Games menu: a button at the top left lists the games, marks the ones played today and links to the Geo Games home page.
// Each game is its own website (hectorei19.github.io/country-grid, /connections, /top10, /silhouette), each with a copy of this file:
// change it in one, copy it to the others. They share one origin, so "played" is read from each game's save on this device.
const GAMES=[
  {id:'borderline',name:'Country Grid',href:'../country-grid/',hint:'Fill the grid of countries'},
  {id:'connections',name:'Connections',href:'../connections/',hint:'Find the four groups of four'},
  {id:'top10',name:'Top 10',href:'../top10/',hint:'Name the ten countries of a ranking'},
  {id:'silhouette',name:'Silhouette',href:'../silhouette/',hint:'Name the countries from their shapes'}];
// the Geo Games home page, last item of the menu
const MORE_GAMES='https://hectorei19.github.io/geo-games/';
const GAME_HERE=document.documentElement.dataset.game||'borderline';
function gamesDay(){const p=madridParts(Date.now());return p.year+'-'+p.month+'-'+p.day}
// the daily game of each page: Country Grid keeps bl-daily and bl-hist, the others cx-daily, t10-daily and sil-daily
function playedToday(id){const k=gamesDay();try{
  if(id==='borderline'){const h=JSON.parse(localStorage.getItem('bl-hist')||'{}')||{};if(h[k]&&h[k].f!==0)return true;
    const d=JSON.parse(localStorage.getItem('bl-daily')||'null');return !!(d&&d.date===k&&d.S&&d.S.over)}
  const d=JSON.parse(localStorage.getItem({connections:'cx-daily',top10:'t10-daily',silhouette:'sil-daily'}[id])||'null');return !!(d&&d.date===k&&d.over)}catch(e){return false}}
// the next game of the day not played yet, in menu order after this one (null when all are done)
function nextGame(cur){const i=GAMES.findIndex(g=>g.id===cur);
  for(let s=1;s<GAMES.length;s++){const g=GAMES[(i+s)%GAMES.length];if(!playedToday(g.id))return g}return null}
function nextGameHTML(cur){const g=nextGame(cur);
  return g?`<a class="primary nextgame" href="${g.href}">Next game: ${g.name} →</a>`
    :`<p class="hint">You have played all of today's games. New ones at midnight CET.</p>`}
const gamesBtn=()=>`<button class="helpbtn gamesbtn" id="gamesbtn" aria-haspopup="true" aria-expanded="false" aria-label="Games" title="Games"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>Games</button>`;
function drawGames(open){let box=document.getElementById('gamesmenu');
  if(!box){box=document.createElement('div');box.id='gamesmenu';document.body.appendChild(box)}
  const b=document.getElementById('gamesbtn');if(b)b.setAttribute('aria-expanded',open?'true':'false');
  if(!open){box.innerHTML='';return}
  const top=Math.round((b?b.getBoundingClientRect().bottom:54)+4);
  box.innerHTML=`<div class="menuscrim" id="gamesscrim"></div><nav class="gmenu" aria-label="Games" style="top:${top}px"><span class="gmhead">Today's games</span>${GAMES.map(g=>{const p=playedToday(g.id),here=g.id===GAME_HERE;
    return `<a class="gmitem${here?' here':''}" href="${g.href}"${here?' aria-current="page"':''}><span class="gmtxt"><b>${g.name}</b><small>${g.hint}</small></span><span class="gmst${p?' done':''}">${p?'✓ Played':here?'Playing':'Not played'}</span></a>`}).join('')}<a class="gmitem gmmore" href="${MORE_GAMES}"><span class="gmtxt"><b>More games</b><small>All the Geo Games</small></span><span class="gmst">→</span></a></nav>`;
  document.getElementById('gamesscrim').onclick=()=>drawGames(false)}
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#gamesbtn')){e.preventDefault();drawGames(!document.querySelector('#gamesmenu .gmenu'))}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.querySelector('#gamesmenu .gmenu'))drawGames(false)});
