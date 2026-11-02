(()=>{
const D=window.H2T, BASE='https://hair2there9800.setmore.com';
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
const hasG=typeof gsap!=='undefined';
if(hasG&&window.ScrollTrigger)gsap.registerPlugin(ScrollTrigger);
// smooth scroll
let lenis=null;
if(!RM&&window.Lenis){lenis=new Lenis({lerp:.1});lenis.on('scroll',()=>window.ScrollTrigger&&ScrollTrigger.update());
 if(hasG){gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0)}else{const r=t=>{lenis.raf(t);requestAnimationFrame(r)};requestAnimationFrame(r)}}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(!t)return;e.preventDefault();const off=-parseInt(getComputedStyle(document.querySelector('.top')).height);lenis?lenis.scrollTo(t,{offset:off}):window.scrollTo({top:t.getBoundingClientRect().top+scrollY+off,behavior:RM?'auto':'smooth'})}));
// services
const GROUPS={braids:{k:'Braids & Natural Hair',t:'The braid menu.',c:['Braiding & Micros','Cornrow','Twist & Dreads','Weaves','Ladies','Children','Relaxers','Color']},
 cuts:{k:'Cuts & Shaves',t:'The barber menu.',c:['Gentlemen','Children','Parts & Designs','Dye','Specials']}};
const sec=document.getElementById('services'),chips=document.getElementById('chips'),list=document.getElementById('svcList');
let door='braids',cat=null;
const fmt=m=>m>=60?(Math.floor(m/60)+'h'+(m%60?' '+m%60+'m':'')):m+' min';
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function renderList(){
 const c=D.categories.find(x=>x.t===cat);if(!c)return;
 list.innerHTML=c.ids.map(id=>{const s=D.services[id];const who=s.staff.filter(n=>/^[A-Z]/.test(n)).join(', ');
  return `<li class="svc"><div><h4>${esc(s.t)}</h4></div><span class="price">$${s.p}</span><p class="meta">${fmt(s.min)}${who?' · '+esc(who):''}${s.d?'<br>'+esc(s.d):''}</p><button class="bk" data-svc="${id}" data-cat="${c.id}" data-name="${esc(s.t)}">Book this</button></li>`}).join('');
 if(hasG&&!RM)gsap.from(list.children,{y:18,opacity:0,duration:.5,stagger:.025,ease:'power2.out'});
}
function renderChips(){
 chips.innerHTML=GROUPS[door].c.map(t=>`<button class="${t===cat?'on':''}">${t}</button>`).join('');
 [...chips.children].forEach(b=>b.onclick=()=>{cat=b.textContent;renderChips();renderList()});
}
function setDoor(d,anim){
 const apply=()=>{door=d;cat=GROUPS[d].c[0];sec.dataset.theme=d;
  document.getElementById('svcKicker').textContent=GROUPS[d].k;document.getElementById('svcTitle').textContent=GROUPS[d].t;
  sec.querySelectorAll('.toggle button').forEach(b=>b.setAttribute('aria-selected',b.dataset.door===d));renderChips();renderList()};
 if(!anim||!hasG||RM){apply();return}
 const w=sec.querySelector('.wipe');
 w.style.background=d==='cuts'?'repeating-linear-gradient(135deg,#d42a2a 0 40px,#fff 40px 80px,#111 80px 96px)':'linear-gradient(#f0cf8a,#d6a24a)';
 gsap.timeline().set(w,{transformOrigin:'top'}).to(w,{scaleY:1,duration:.45,ease:'power3.in'}).add(apply).set(w,{transformOrigin:'bottom'}).to(w,{scaleY:0,duration:.55,ease:'power3.out'});
}
setDoor('braids');
sec.querySelectorAll('.toggle button').forEach(b=>b.onclick=()=>b.dataset.door!==door&&setDoor(b.dataset.door,true));
document.querySelectorAll('.door').forEach(b=>b.onclick=()=>{setDoor(b.dataset.door,door!==b.dataset.door);const off=-70;lenis?lenis.scrollTo(sec,{offset:off}):sec.scrollIntoView()});
// booking sheet
const sheet=document.getElementById('sheet'),frame=document.getElementById('bookFrame'),nt=document.getElementById('newtab'),title=document.getElementById('sheetTitle');
let lastFocus=null;
function openBook(url,label){
 lastFocus=document.activeElement;title.textContent=label||'Book · Hair 2 There';nt.href=url;
 sheet.querySelector('.loader').style.display='';frame.style.opacity=0;
 frame.onload=()=>{sheet.querySelector('.loader').style.display='none';frame.style.opacity=1};
 frame.src=url;sheet.classList.add('open');sheet.setAttribute('aria-hidden','false');document.documentElement.style.overflow='hidden';lenis&&lenis.stop();
 sheet.querySelector('.x').focus();
}
function closeBook(){sheet.classList.remove('open');sheet.setAttribute('aria-hidden','true');document.documentElement.style.overflow='';lenis&&lenis.start();lastFocus&&lastFocus.focus()}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-book]');if(b){openBook(BASE+'/book','Book · Hair 2 There');return}
 const s=e.target.closest('[data-svc]');if(s){openBook(`${BASE}/book?step=staff&products=${s.dataset.svc}%7C${s.dataset.cat}&type=service`,'Book · '+s.dataset.name);return}
 const st=e.target.closest('[data-book-staff]');if(st){openBook(`${BASE}/team/${st.dataset.bookStaff}`,st.textContent);return}
 if(e.target.closest('[data-close]'))closeBook();
});
addEventListener('keydown',e=>{if(e.key==='Escape'&&sheet.classList.contains('open'))closeBook()});
// before/after
const ba=document.getElementById('ba'),h=ba.querySelector('.ba-handle');
const setX=p=>{p=Math.max(0,Math.min(100,p));ba.style.setProperty('--x',p+'%');h.setAttribute('aria-valuenow',Math.round(p))};
let drag=false;const mv=e=>{const r=ba.getBoundingClientRect();setX((e.clientX-r.left)/r.width*100)};
ba.addEventListener('pointerdown',e=>{drag=true;ba.setPointerCapture(e.pointerId);mv(e)});ba.addEventListener('pointermove',e=>drag&&mv(e));ba.addEventListener('pointerup',()=>drag=false);
h.addEventListener('keydown',e=>{const v=+h.getAttribute('aria-valuenow');if(e.key==='ArrowLeft')setX(v-5);if(e.key==='ArrowRight')setX(v+5)});
// reveals
if(hasG&&!RM){
 gsap.from('.hero .ln>span',{yPercent:110,duration:1.1,stagger:.12,ease:'power4.out',delay:.15});
 gsap.from('.hero .mono,.lede,.hero .cta',{y:20,opacity:0,duration:.8,stagger:.1,delay:.5});
 if(window.ScrollTrigger){
  gsap.utils.toArray('.reveal').forEach(el=>gsap.from(el,{y:40,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}}));
  gsap.utils.toArray('.door').forEach((el,i)=>gsap.from(el,{clipPath:'inset(100% 0 0 0)',duration:1.2,delay:i*.12,ease:'power4.out',scrollTrigger:{trigger:el,start:'top 85%'}}));
  gsap.from('.card',{y:60,opacity:0,stagger:.1,duration:.8,scrollTrigger:{trigger:'.cards',start:'top 85%'}});
  gsap.to('.ba-frame',{'--x':'30%',duration:1.4,ease:'power2.inOut',yoyo:true,repeat:1,scrollTrigger:{trigger:'.ba-frame',start:'top 70%'}});
 }
}
// cursor
if(FINE&&!RM){const c=document.querySelector('.cursor');let x=-50,y=-50,cx=x,cy=y;
 addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY});
 document.addEventListener('pointerover',e=>c.classList.toggle('big',!!e.target.closest('a,button,.ba-frame,[role=slider],.sticker,.flip,#chair')));
 document.addEventListener('pointerover',e=>c.style.opacity=e.target.closest('#hair')?0:1);
 (function l(){cx+=(x-cx)*.22;cy+=(y-cy)*.22;c.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(l)})();}
})();
