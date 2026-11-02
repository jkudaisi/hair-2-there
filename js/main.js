(()=>{
const D=window.H2T,BASE='https://hair2there9800.setmore.com';
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
const hdr=document.querySelector('.hdr');
const off=()=>hdr.getBoundingClientRect().height+8;
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(!t)return;e.preventDefault();scrollTo({top:t.getBoundingClientRect().top+scrollY-off(),behavior:RM?'auto':'smooth'})}));
// services
const GROUPS={braids:{k:'BRAIDS & NATURAL HAIR',c:['Braiding & Micros','Cornrow','Twist & Dreads','Weaves','Ladies','Children','Relaxers','Color']},
 cuts:{k:'CUTS & SHAVES',c:['Gentlemen','Children','Parts & Designs','Dye','Specials']}};
const sec=document.getElementById('services'),chips=document.getElementById('chips'),list=document.getElementById('svcList');
let door='cuts',cat=null;
const fmt=m=>m>=60?(Math.floor(m/60)+'h'+(m%60?' '+m%60+'m':'')):m+' min';
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function renderList(){const c=D.categories.find(x=>x.t===cat);if(!c)return;
 list.innerHTML=c.ids.map((id,i)=>{const s=D.services[id];const who=s.staff.filter(n=>/^[A-Z]/.test(n)).join(', ');
  return `<li class="svc" style="--i:${i}"><div class="svc-l"><h4>${esc(s.t)}</h4><p class="meta">${fmt(s.min)}${who?' · '+esc(who):''}${s.d?' · '+esc(s.d):''}</p></div><span class="price">$${s.p}</span><button class="bk" data-svc="${id}" data-cat="${c.id}" data-name="${esc(s.t)}">BOOK</button></li>`}).join('')}
function renderChips(){chips.innerHTML=GROUPS[door].c.map(t=>`<button class="${t===cat?'on':''}">${t}</button>`).join('');
 [...chips.children].forEach(b=>b.onclick=()=>{if(b.textContent===cat)return;cat=b.textContent;renderChips();renderList()})}
function wipe(cb){if(RM){cb();return}const w=sec.querySelector('.tile-wipe');w.innerHTML='';const n=40;for(let i=0;i<n;i++){const t=document.createElement('i');t.style.setProperty('--d',((i%8)+Math.floor(i/8))*35+'ms');w.appendChild(t)}
 w.className='tile-wipe in';setTimeout(()=>{cb();w.className='tile-wipe out'},520);setTimeout(()=>w.className='tile-wipe',1100)}
function setDoor(d,anim){const apply=()=>{door=d;cat=GROUPS[d].c[0];sec.dataset.theme=d;document.getElementById('svcKicker').textContent=GROUPS[d].k;
  document.querySelectorAll('.drawer').forEach(b=>b.setAttribute('aria-selected',b.dataset.door===d));renderChips();renderList()};
 anim?wipe(apply):apply()}
setDoor('cuts');
document.querySelectorAll('.drawer').forEach(b=>b.onclick=()=>b.dataset.door!==door&&setDoor(b.dataset.door,true));
// ticket booking
const sheet=document.getElementById('sheet'),frame=document.getElementById('bookFrame'),nt=document.getElementById('newtab'),title=document.getElementById('sheetTitle');
let num=43,lastFocus=null;
function openBook(url,label){lastFocus=document.activeElement;title.textContent=label||'Book · Hair 2 There';nt.href=url;
 num++;document.querySelectorAll('.tnum').forEach(t=>t.textContent=String(num).padStart(3,'0'));
 document.querySelector('.dispenser').classList.add('pull');setTimeout(()=>document.querySelector('.dispenser').classList.remove('pull'),700);
 sheet.querySelector('.loader').style.display='';frame.style.opacity=0;frame.onload=()=>{sheet.querySelector('.loader').style.display='none';frame.style.opacity=1};
 frame.src=url;sheet.classList.add('open');sheet.setAttribute('aria-hidden','false');document.documentElement.style.overflow='hidden';sheet.querySelector('.x').focus()}
function closeBook(){sheet.classList.remove('open');sheet.setAttribute('aria-hidden','true');document.documentElement.style.overflow='';lastFocus&&lastFocus.focus()}
document.addEventListener('click',e=>{
 if(e.target.closest('[data-book]')){openBook(BASE+'/book');return}
 const s=e.target.closest('[data-svc]');if(s){openBook(`${BASE}/book?step=staff&products=${s.dataset.svc}%7C${s.dataset.cat}&type=service`,'Book · '+s.dataset.name);return}
 const st=e.target.closest('[data-book-staff]');if(st){openBook(`${BASE}/team/${st.dataset.bookStaff}`,st.textContent);return}
 if(e.target.closest('[data-close]'))closeBook()});
addEventListener('keydown',e=>{if(e.key==='Escape'&&sheet.classList.contains('open'))closeBook()});
// before/after
const ba=document.getElementById('ba'),h=ba.querySelector('.ba-handle');
const setX=p=>{p=Math.max(0,Math.min(100,p));ba.style.setProperty('--x',p+'%');h.setAttribute('aria-valuenow',Math.round(p))};
let drag=false;const mv=e=>{const r=ba.getBoundingClientRect();setX((e.clientX-r.left)/r.width*100)};
ba.addEventListener('pointerdown',e=>{drag=true;ba.setPointerCapture(e.pointerId);mv(e)});ba.addEventListener('pointermove',e=>drag&&mv(e));ba.addEventListener('pointerup',()=>drag=false);ba.addEventListener('pointercancel',()=>drag=false);
h.addEventListener('keydown',e=>{const v=+h.getAttribute('aria-valuenow');if(e.key==='ArrowLeft')setX(v-5);if(e.key==='ArrowRight')setX(v+5)});
// stamps / slaps on scroll
const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('hit');io.unobserve(en.target)}}),{threshold:.25});
document.querySelectorAll('.stamp,.stamp-in,.polaroid,.flip,.tix li,.sticker,.pennant,.receipt,.decal h1 span,.neon-box,.mirror-wrap,.mini-board').forEach((el,i)=>{el.classList.add('slap');el.style.setProperty('--sd',(i%6)*70+'ms');RM?el.classList.add('hit'):io.observe(el)});
// cursor: comb-tooth ring
if(FINE&&!RM){const c=document.querySelector('.cursor');let x=-50,y=-50,cx=x,cy=y;addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY});
 document.addEventListener('pointerover',e=>{c.classList.toggle('big',!!e.target.closest('a,button,.ba-frame,[role=slider],.sticker,.flip,#chair'));c.style.opacity=e.target.closest('#hair,iframe')?0:1});
 (function l(){cx+=(x-cx)*.25;cy+=(y-cy)*.25;c.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(l)})()}
})();
