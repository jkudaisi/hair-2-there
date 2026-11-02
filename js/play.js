(()=>{
const sfx=n=>window.SFX&&SFX.play(n),RM=matchMedia('(prefers-reduced-motion: reduce)').matches,D=window.H2T;
function find(title){for(const c of D.categories)for(const id of c.ids)if(D.services[id].t===title)return{id,cat:c.id,s:D.services[id]};return null}
const fmt=m=>m>=60?(Math.floor(m/60)+'h'+(m%60?' '+m%60+'m':'')):m+'m';
// NEON
const neon=document.getElementById('neon'),sw=document.getElementById('neonSw');
sw.addEventListener('click',()=>{const on=neon.dataset.on!=='true';sw.setAttribute('aria-checked',on);
 if(on){sfx('neon');neon.dataset.on='flicker';setTimeout(()=>neon.dataset.on='true',RM?0:900)}else{sfx('click');neon.dataset.on='false'}});
// LETTER BOARD
const board=document.getElementById('board');
const picks=['Standard Haircut (Adults 13 & Up)','Haircut & Beard',"Kid's Haircut (12 & Under)",'Shave on Face','Facials','Two Strand Twist','Loc Maintenance (Retwist)','Medium Knotless','Box Braid Medium','Wash & Curl'];
const short={'Standard Haircut (Adults 13 & Up)':'Haircut','Haircut & Beard':'Cut + Beard',"Kid's Haircut (12 & Under)":'Kids Cut','Shave on Face':'Shave','Loc Maintenance (Retwist)':'Loc Retwist','Medium Knotless':'Knotless Med','Box Braid Medium':'Box Braids'};
const tiles=s=>[...s].map(ch=>`<span class="t" data-c="${ch===' '?'&nbsp;':ch}"><b>${ch===' '?'&nbsp;':ch}</b></span>`).join('');
board.innerHTML=picks.map(t=>{const f=find(t);if(!f)return'';return`<button class="row" data-p="$${f.s.p}" data-m="${fmt(f.s.min)}"><span class="nm">${tiles((short[t]||t).toUpperCase())}</span><span class="pr">${tiles('····')}</span></button>`}).join('');
board.querySelectorAll('.row').forEach(row=>row.addEventListener('click',()=>{
 const st=(+row.dataset.st||0)+1;row.dataset.st=st%3;const val=[ '····',row.dataset.p,row.dataset.m][st%3].padStart(4,' ');
 const pr=row.querySelector('.pr');pr.innerHTML=tiles(val);[...pr.children].forEach((t,i)=>{t.style.animationDelay=i*70+'ms';t.classList.add('fl')});
 [...pr.children].forEach((t,i)=>setTimeout(()=>sfx('flip'),i*70));}));
// FLIP CARDS
document.querySelectorAll('.flip').forEach(f=>{const go=()=>{f.classList.toggle('flipped');sfx('flip')};
 f.addEventListener('click',e=>{if(e.target.closest('a,button'))return;go()});f.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target===f){e.preventDefault();go()}})});
// STICKERS
const wrap=document.getElementById('stickers');let z=10;
wrap.querySelectorAll('.sticker').forEach((s,i)=>{let sx,sy,ox=0,oy=0,d=false;const rot=[-6,4,-3,7,-2][i];s.style.setProperty('--r',rot+'deg');
 s.addEventListener('pointerdown',e=>{d=true;s.setPointerCapture(e.pointerId);sx=e.clientX-ox;sy=e.clientY-oy;s.style.zIndex=++z;s.classList.add('lift');sfx('pop')});
 s.addEventListener('pointermove',e=>{if(!d)return;const W=wrap.getBoundingClientRect(),b=s.getBoundingClientRect();ox=e.clientX-sx;oy=e.clientY-sy;
  s.style.translate=`${ox}px ${oy}px`});
 const end=()=>{if(!d)return;d=false;s.classList.remove('lift');sfx('click')};s.addEventListener('pointerup',end);s.addEventListener('pointercancel',end)});
// HAIR STUDIO
const cv=document.getElementById('hair'),ctx=cv.getContext('2d'),hint=document.getElementById('hairHint');
let W=0,H=0,dpr=1,strands=[],falling=[],tool='comb',style='natural';
const STY={natural:{n:70,seg:6,len:9,w:9,col:'#2a1a12',kind:'curl',lift:.9,svc:'Wash & Curl'},
 box:{n:26,seg:16,len:14,w:9,col:'#1d130e',kind:'braid',lift:.05,svc:'Box Braid Medium'},
 knotless:{n:34,seg:18,len:14,w:7,col:'#3b2416',tip:'#c98b3a',kind:'braid',lift:.04,svc:'Medium Knotless'},
 locs:{n:22,seg:14,len:13,w:12,col:'#2b1b12',kind:'loc',lift:.06,svc:'Loc Maintenance (Retwist)'},
 twists:{n:30,seg:10,len:12,w:9,col:'#24170f',kind:'twist',lift:.25,svc:'Two Strand Twist'}};
function head(){const s=Math.min(W,H*1.1);return{x:W/2,y:H*.36,rx:s*.2,ry:s*.24}}
function grow(){strands=[];const S=STY[style],h=head(),sc=Math.min(W,H)/520;
 for(let i=0;i<S.n;i++){const a=Math.PI*(1.06+.88*(i/(S.n-1)))+(Math.random()-.5)*.05;
  const rx=Math.cos(a)*h.rx*.92,ry=Math.sin(a)*h.ry*.92,root={x:h.x+rx,y:h.y+ry};
  const nx=Math.cos(a),ny=Math.sin(a);const pts=[];const L=S.len*sc*(style==='natural'?1+Math.random()*.4:1+Math.random()*.15);
  for(let j=0;j<S.seg;j++){const out=S.lift*j*L,down=(1-S.lift)*j*L;pts.push({x:root.x+nx*out+(Math.random()-.5),y:root.y+ny*out+down,px:0,py:0})}
  pts.forEach(p=>{p.px=p.x;p.py=p.y});strands.push({pts,L,nx,ny,ph:Math.random()*6})}
 const f=find(S.svc);document.getElementById('stylePrice').textContent=f?`${f.s.t} · $${f.s.p} · ${fmt(f.s.min)}`:'';
 const b=document.getElementById('styleBook');if(f){b.dataset.svc=f.id;b.dataset.cat=f.cat;b.dataset.name=f.s.t}}
function size(){const r=cv.getBoundingClientRect();dpr=Math.min(devicePixelRatio,2);W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;grow()}
document.getElementById('styles').addEventListener('click',e=>{const b=e.target.closest('[data-style]');if(!b)return;style=b.dataset.style;
 document.querySelectorAll('#styles button').forEach(x=>x.setAttribute('aria-checked',x===b));sfx('pop');grow()});
document.querySelectorAll('[data-tool]').forEach(b=>b.addEventListener('click',()=>{tool=b.dataset.tool;document.querySelectorAll('[data-tool]').forEach(x=>x.classList.toggle('on',x===b));cv.dataset.tool=tool;sfx('click')}));
document.getElementById('regrow').addEventListener('click',()=>{grow();falling=[];sfx('pop')});
// pointer
let P=null,last=null,combT=0;
function pos(e){const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);P=last=pos(e);hint.style.opacity=0});
cv.addEventListener('pointermove',e=>{const p=pos(e);if(e.pointerType==='mouse'&&!e.buttons&&tool==='comb'){last=P=p;return}if(!P&&e.pointerType!=='mouse')return;last=P||p;P=p;act(last,P)});
const up=()=>{P=null};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);cv.addEventListener('pointerleave',up);
function segX(a,b,c,d){const r=(b.x-a.x)*(d.y-c.y)-(b.y-a.y)*(d.x-c.x);if(!r)return false;const t=((c.x-a.x)*(d.y-c.y)-(c.y-a.y)*(d.x-c.x))/r,u=((c.x-a.x)*(b.y-a.y)-(c.y-a.y)*(b.x-a.x))/r;return t>=0&&t<=1&&u>=0&&u<=1}
function act(a,b){const vx=b.x-a.x,vy=b.y-a.y;if(!vx&&!vy)return;
 if(tool==='comb'){let hit=false;const R=28;for(const s of strands)for(let j=1;j<s.pts.length;j++){const p=s.pts[j],dx=p.x-b.x,dy=p.y-b.y;if(dx*dx+dy*dy<R*R){p.x+=vx*.6;p.y+=vy*.6;hit=true}}
  if(hit&&performance.now()-combT>90){combT=performance.now();sfx('comb')}}
 else{for(const s of strands){for(let j=1;j<s.pts.length;j++){if(segX(a,b,s.pts[j-1],s.pts[j])){const cut=s.pts.splice(j);
   if(cut.length>1)falling.push({pts:cut,L:s.L,s,born:performance.now()});sfx('snip');break}}}}}
function sim(list,pinned){for(const s of list){const pts=s.pts,S=STY[style];
 for(let j=pinned?1:0;j<pts.length;j++){const p=pts[j],vx=(p.x-p.px)*.96,vy=(p.y-p.py)*.96;p.px=p.x;p.py=p.y;p.x+=vx;p.y+=vy+(pinned?.35*(1-S.lift):.5);
  if(!pinned&&p.y>H-6){p.y=H-6;p.px=p.x+(p.x-p.px)*.3}}
 for(let k=0;k<(pinned?6:3);k++){for(let j=1;j<pts.length;j++){const a=pts[j-1],b=pts[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,df=(d-s.L)/d;
   if(pinned&&j===1){b.x-=dx*df;b.y-=dy*df}else{a.x+=dx*df*.5;a.y+=dy*df*.5;b.x-=dx*df*.5;b.y-=dy*df*.5}}
  if(pinned&&S.lift>.2){for(let j=1;j<pts.length;j++){const r=pts[0];const tx=r.x+s.nx*s.L*j*S.lift,ty=r.y+s.ny*s.L*j*S.lift+(1-S.lift)*s.L*j;pts[j].x+=(tx-pts[j].x)*.08;pts[j].y+=(ty-pts[j].y)*.08}}
  // keep out of head
  const h=head();for(let j=1;j<pts.length;j++){const p=pts[j],ex=(p.x-h.x)/h.rx,ey=(p.y-h.y)/h.ry,dd=ex*ex+ey*ey;if(dd<.85&&p.y<h.y+h.ry*.5){const f=Math.sqrt(.85/dd);p.x=h.x+(p.x-h.x)*f;p.y=h.y+(p.y-h.y)*f}}}}}
function drawStrand(s,S,alpha){const pts=s.pts;if(pts.length<2)return;ctx.globalAlpha=alpha;const sc=Math.min(W,H)/520,w=S.w*sc;
 if(S.kind==='curl'){ctx.strokeStyle=S.col;ctx.lineWidth=w*.9;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);
  for(let j=1;j<pts.length;j++){const a=pts[j-1],b=pts[j];for(let t=.25;t<=1;t+=.25){const x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t,o=Math.sin((j+t)*5+s.ph)*w*.7;ctx.lineTo(x+o,y-o*.5)}}ctx.stroke();
  ctx.fillStyle='#3a2518';for(let j=1;j<pts.length;j+=2){ctx.beginPath();ctx.arc(pts[j].x,pts[j].y,w*.7,0,7);ctx.fill()}}
 else if(S.kind==='braid'){for(let j=1;j<pts.length;j++){const a=pts[j-1],b=pts[j],ang=Math.atan2(b.y-a.y,b.x-a.x),tw=j/pts.length;
   for(const side of[-1,1]){ctx.save();ctx.translate((a.x+b.x)/2,(a.y+b.y)/2);ctx.rotate(ang+side*.5);
    ctx.fillStyle=S.tip&&tw>.65?S.tip:(side>0?S.col:'#3d281b');ctx.beginPath();ctx.ellipse(side*w*.12,0,s.L*.62,w*.5*(S.tip?(1-tw*.25):1),0,0,7);ctx.fill();ctx.restore()}}
  const e=pts[pts.length-1];ctx.fillStyle='#d6a24a';ctx.beginPath();ctx.arc(e.x,e.y,w*.35,0,7);ctx.fill()}
 else if(S.kind==='loc'){ctx.lineCap='round';ctx.strokeStyle=S.col;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);pts.forEach(p=>ctx.lineTo(p.x,p.y));ctx.stroke();
  ctx.strokeStyle='rgba(255,220,180,.12)';ctx.lineWidth=w*.3;ctx.setLineDash([2,4]);ctx.stroke();ctx.setLineDash([])}
 else{for(const k of[0,Math.PI]){ctx.strokeStyle=k?'#4a2f1f':S.col;ctx.lineWidth=w*.55;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);
  for(let j=1;j<pts.length;j++){const a=pts[j-1],b=pts[j],nx=-(b.y-a.y)/s.L,ny=(b.x-a.x)/s.L;for(let t=.2;t<=1;t+=.2){const o=Math.sin((j+t)*Math.PI*1.4+k)*w*.32;ctx.lineTo(a.x+(b.x-a.x)*t+nx*o,a.y+(b.y-a.y)*t+ny*o)}}ctx.stroke()}}
 ctx.globalAlpha=1}
function drawHead(){const h=head();
 // shoulders / cape
 ctx.fillStyle='#d42a2a';ctx.beginPath();ctx.moveTo(h.x-h.rx*2.6,H);ctx.quadraticCurveTo(h.x-h.rx*2.2,h.y+h.ry*1.5,h.x,h.y+h.ry*1.35);ctx.quadraticCurveTo(h.x+h.rx*2.2,h.y+h.ry*1.5,h.x+h.rx*2.6,H);ctx.fill();
 ctx.fillStyle='rgba(255,255,255,.9)';for(let i=-3;i<=3;i++){ctx.fillRect(h.x+i*h.rx*.7-3,h.y+h.ry*1.55,6,H)}
 ctx.fillStyle='#7a4a2e';ctx.fillRect(h.x-h.rx*.38,h.y+h.ry*.6,h.rx*.76,h.ry*.85);
 ctx.fillStyle='#8b5636';ctx.beginPath();ctx.ellipse(h.x,h.y,h.rx,h.ry,0,0,7);ctx.fill();
 ctx.fillStyle='#7a4a2e';for(const s of[-1,1]){ctx.beginPath();ctx.ellipse(h.x+s*h.rx*.98,h.y+h.ry*.1,h.rx*.14,h.ry*.2,0,0,7);ctx.fill()}
 ctx.fillStyle=STY[style].col;ctx.beginPath();ctx.ellipse(h.x,h.y-h.ry*.12,h.rx*1.0,h.ry*.92,0,Math.PI*1.02,Math.PI*1.98);ctx.fill()}
function frame(){requestAnimationFrame(frame);if(!vis||!W)return;
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
 ctx.fillStyle='rgba(244,234,216,.06)';ctx.fillRect(0,H-6,W,6);
 sim(strands,true);sim(falling,false);
 const now=performance.now();falling=falling.filter(f=>now-f.born<6000);
 drawHead();const back=strands.filter(s=>s.ny<-.2),side=strands.filter(s=>s.ny>=-.2);
 for(const s of side)drawStrand(s,STY[style],1);for(const s of back)drawStrand(s,STY[style],1);
 for(const f of falling)drawStrand(f,STY[style],Math.min(1,(6000-(now-f.born))/1500));

 if(P&&tool==='cut'){ctx.font='28px serif';ctx.fillText('✂️',P.x-14,P.y+10)}}
let vis=false;new IntersectionObserver(([e])=>{vis=e.isIntersecting;if(vis&&!W)size()}).observe(cv);
addEventListener('resize',()=>{const r=cv.getBoundingClientRect();if(Math.abs(r.width-W)>2||Math.abs(r.height-H)>2)size()});
size();frame();window.__hair=()=>({strands:strands.reduce((a,s)=>a+s.pts.length,0),falling:falling.length});
})();
