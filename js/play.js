(()=>{
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,D=window.H2T;
function find(title){for(const c of D.categories)for(const id of c.ids)if(D.services[id].t===title)return{id,cat:c.id,s:D.services[id]};return null}
const fmt=m=>m>=60?(Math.floor(m/60)+'h'+(m%60?' '+m%60+'m':'')):m+'m';
// NEON
const neon=document.getElementById('neon'),sw=document.getElementById('neonSw');
sw.addEventListener('click',()=>{const on=neon.dataset.on!=='true';sw.setAttribute('aria-checked',on);
 if(on){neon.dataset.on='flicker';setTimeout(()=>neon.dataset.on='true',RM?0:900)}else{neon.dataset.on='false'}});
// LETTER BOARD
const board=document.getElementById('board');
const picks=['Standard Haircut (Adults 13 & Up)','Haircut & Beard',"Kid's Haircut (12 & Under)",'Shave on Face','Facials','Two Strand Twist','Loc Maintenance (Retwist)','Medium Knotless','Box Braid Medium','Wash & Curl'];
const short={'Standard Haircut (Adults 13 & Up)':'Haircut','Haircut & Beard':'Cut + Beard',"Kid's Haircut (12 & Under)":'Kids Cut','Shave on Face':'Shave','Loc Maintenance (Retwist)':'Loc Retwist','Medium Knotless':'Knotless Med','Box Braid Medium':'Box Braids'};
const tiles=s=>[...s].map(ch=>`<span class="t" data-c="${ch===' '?'&nbsp;':ch}"><b>${ch===' '?'&nbsp;':ch}</b></span>`).join('');
board.innerHTML=picks.map(t=>{const f=find(t);if(!f)return'';return`<button class="row" data-p="$${f.s.p}" data-m="${fmt(f.s.min)}"><span class="nm">${tiles((short[t]||t).toUpperCase())}</span><span class="pr">${tiles('····')}</span></button>`}).join('');
board.querySelectorAll('.row').forEach(row=>row.addEventListener('click',()=>{
 const st=(+row.dataset.st||0)+1;row.dataset.st=st%3;const val=[ '····',row.dataset.p,row.dataset.m][st%3].padStart(4,' ');
 const pr=row.querySelector('.pr');pr.innerHTML=tiles(val);[...pr.children].forEach((t,i)=>{t.style.animationDelay=i*70+'ms';t.classList.add('fl')});
 }));
// FLIP CARDS
document.querySelectorAll('.flip').forEach(f=>{const go=()=>{f.classList.toggle('flipped');};
 f.addEventListener('click',e=>{if(e.target.closest('a,button'))return;go()});f.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target===f){e.preventDefault();go()}})});
// STICKERS
const wrap=document.getElementById('stickers');let z=10;
wrap.querySelectorAll('.sticker').forEach((s,i)=>{let sx,sy,ox=0,oy=0,d=false;const rot=[-6,4,-3,7,-2][i];s.style.setProperty('--r',rot+'deg');
 s.addEventListener('pointerdown',e=>{d=true;s.setPointerCapture(e.pointerId);sx=e.clientX-ox;sy=e.clientY-oy;s.style.zIndex=++z;s.classList.add('lift');});
 s.addEventListener('pointermove',e=>{if(!d)return;const W=wrap.getBoundingClientRect(),b=s.getBoundingClientRect();ox=e.clientX-sx;oy=e.clientY-sy;
  s.style.translate=`${ox}px ${oy}px`});
 const end=()=>{if(!d)return;d=false;s.classList.remove('lift');s.classList.add('boing');setTimeout(()=>s.classList.remove('boing'),700);};s.addEventListener('pointerup',end);s.addEventListener('pointercancel',end)});
// HAIR STUDIO
const cv=document.getElementById('hair'),ctx=cv.getContext('2d'),hint=document.getElementById('hairHint');
let W=0,H=0,dpr=1,strands=[],falling=[],tool='clip',style='natural';
const STY={natural:{n:70,seg:6,len:9,w:9,col:'#2a1a12',kind:'curl',lift:.9,svc:'Wash & Curl'},
 box:{n:26,seg:16,len:14,w:9,col:'#1d130e',kind:'braid',lift:.05,svc:'Box Braid Medium'},
 knotless:{n:34,seg:18,len:14,w:7,col:'#3b2416',tip:'#c98b3a',kind:'braid',lift:.04,svc:'Medium Knotless'},
 locs:{n:22,seg:14,len:13,w:12,col:'#2b1b12',kind:'loc',lift:.06,svc:'Loc Maintenance (Retwist)'},
 twists:{n:30,seg:10,len:12,w:9,col:'#24170f',kind:'twist',lift:.25,svc:'Two Strand Twist'}};
const CUTS={lowfade:{l:'Low fade',top:24,side:1.5,f0:-.1,f1:.25,svc:'Standard Haircut (Adults 13 & Up)'},
 midfade:{l:'Mid fade',top:24,side:1,f0:.2,f1:.5,svc:'Standard Haircut (Adults 13 & Up)'},
 highfade:{l:'High fade',top:22,side:.6,f0:.5,f1:.8,svc:'Standard Haircut (Adults 13 & Up)'},
 taper:{l:'Taper',top:20,side:7,f0:-.25,f1:.15,svc:'Temple fade'},
 buzz:{l:'Buzz cut',top:5,side:4,f0:0,f1:1,svc:'Standard Haircut (Adults 13 & Up)'},
 lineup:{l:'Line-up',top:13,side:9,f0:0,f1:1,line:1,svc:'Shape Up'},
 twisttop:{l:'Twist top',top:42,side:1.2,f0:.25,f1:.55,curl:1,svc:'Two Strand Twist'},
 bald:{l:'Headshave',top:0,side:0,f0:0,f1:1,svc:'Headshave'}};
const BRAIDS={natural:'Natural',box:'Box braids',knotless:'Knotless',locs:'Locs',twists:'Twists'};
let mode='cuts',cut='midfade',band=[],clips=[];const NB=90,A0=Math.PI*.9,A1=Math.PI*2.1;
const sm=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
function growCut(){const C=CUTS[cut],sc=Math.min(W,H)/520;band=[];for(let i=0;i<NB;i++){const a=A0+(A1-A0)*i/(NB-1),up=-Math.sin(a);band.push({a,t:(C.side+(C.top-C.side)*sm(C.f0,C.f1,up))*sc})}}
function setInfo(name){const f=find(name);document.getElementById('stylePrice').textContent=f?`${f.s.t} · $${f.s.p} · ${fmt(f.s.min)}`:'';
 const b=document.getElementById('styleBook');if(f){b.dataset.svc=f.id;b.dataset.cat=f.cat;b.dataset.name=f.s.t}}
function bandPt(h,a,t){const ex=Math.cos(a)*h.rx,ey=Math.sin(a)*h.ry,n=Math.hypot(Math.cos(a)/h.rx,Math.sin(a)/h.ry),nx=Math.cos(a)/h.rx/n,ny=Math.sin(a)/h.ry/n;return{x:h.x+ex+nx*t,y:h.y+ey+ny*t}}
function hairline(h){const k=h.rx;return[[h.x-k*1.0,h.y+h.ry*.02],[h.x-k*.86,h.y-h.ry*.2],[h.x-k*.62,h.y-h.ry*.36],[h.x-k*.6,h.y-h.ry*.42],[h.x+k*.6,h.y-h.ry*.42],[h.x+k*.62,h.y-h.ry*.36],[h.x+k*.86,h.y-h.ry*.2],[h.x+k*1.0,h.y+h.ry*.02]]}
function drawCut(){const h=head(),C=CUTS[cut],sc=Math.min(W,H)/520,col='#1a120d';
 // scalp cap above crisp hairline, shaded by local length (fade)
 ctx.save();ctx.beginPath();ctx.ellipse(h.x,h.y,h.rx,h.ry,0,0,7);ctx.clip();
 const hl=hairline(h);ctx.beginPath();ctx.moveTo(hl[0][0],hl[0][1]);hl.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.lineTo(h.x+h.rx*1.2,h.y-h.ry*1.3);ctx.lineTo(h.x-h.rx*1.2,h.y-h.ry*1.3);ctx.closePath();
 const topT=band[NB>>1].t,sideT=(band[8].t+band[NB-9].t)/2,cap=Math.min(1,.25+topT/(10*sc)),side=Math.min(1,.12+sideT/(10*sc));
 const g=ctx.createLinearGradient(0,h.y-h.ry,0,h.y+h.ry*.05);g.addColorStop(0,`rgba(26,18,13,${cap})`);g.addColorStop(.55,`rgba(26,18,13,${(cap+side)/2})`);g.addColorStop(1,`rgba(26,18,13,${side})`);
 ctx.fillStyle=g;ctx.fill();
 // stubble speckle for fades
 ctx.fillStyle='rgba(26,18,13,.18)';for(let i=0;i<120;i++){const a=A0+(A1-A0)*((i*37)%120)/120,r=.75+((i*13)%10)/45,p={x:h.x+Math.cos(a)*h.rx*r,y:h.y+Math.sin(a)*h.ry*r};if(p.y<h.y+h.ry*.02)ctx.fillRect(p.x,p.y,1.4*sc,1.4*sc)}
 ctx.restore();
 // crisp line-up edge
 ctx.strokeStyle=col;ctx.lineJoin='miter';ctx.lineWidth=(C.line?2.6:1.6)*sc;ctx.globalAlpha=C.top?1:.25;ctx.beginPath();hl.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.globalAlpha=1;
 // outer volume band: per-segment alpha = density (fade)
 for(let i=0;i<NB-1;i++){const b0=band[i],b1=band[i+1];if(b0.t<.3&&b1.t<.3)continue;const p0=bandPt(h,b0.a,0),p1=bandPt(h,b1.a,0),q1=bandPt(h,b1.a,b1.t),q0=bandPt(h,b0.a,b0.t);
  ctx.fillStyle=`rgba(26,18,13,${Math.min(1,.2+(b0.t+b1.t)/(14*sc))})`;ctx.beginPath();ctx.moveTo(p0.x,p0.y);ctx.lineTo(p1.x,p1.y);ctx.lineTo(q1.x,q1.y);ctx.lineTo(q0.x,q0.y);ctx.closePath();ctx.fill()}
 if(C.curl){ctx.fillStyle='#2a1a12';for(let i=2;i<NB-2;i+=2){const b=band[i];if(b.t<8*sc)continue;const q=bandPt(h,b.a,b.t-3*sc);ctx.beginPath();ctx.arc(q.x,q.y,4.2*sc,0,7);ctx.fill();ctx.strokeStyle='rgba(255,220,180,.18)';ctx.lineWidth=1;ctx.stroke()}}
 // clippings
 for(const c of clips){ctx.globalAlpha=Math.min(1,c.life/1.2);ctx.strokeStyle=col;ctx.lineWidth=1.3*sc;ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(c.x+Math.cos(c.r)*c.l,c.y+Math.sin(c.r)*c.l);ctx.stroke()}ctx.globalAlpha=1}
function spawn(x,y,n,sc){for(let i=0;i<n&&clips.length<900;i++)clips.push({x:x+(Math.random()-.5)*10,y:y+(Math.random()-.5)*10,vx:(Math.random()-.5)*2.4,vy:-Math.random()*1.5,r:Math.random()*6,l:(2+Math.random()*4)*sc,life:5})}
function stepClips(){for(const c of clips){c.vy+=.25;c.x+=c.vx;c.y+=c.vy;c.vx*=.98;if(c.y>H-8){c.y=H-8;c.vy=0;c.vx*=.6}c.life-=1/60}clips=clips.filter(c=>c.life>0)}
function actCut(b){const h=head(),sc=Math.min(W,H)/520,R=30*sc+14;let hit=0;
 for(const s of band){const q=bandPt(h,s.a,s.t*.5);const d=Math.hypot(q.x-b.x,q.y-b.y);if(d>R+s.t*.5)continue;
  const nt=tool==='clip'?Math.min(s.t,1.2*sc*(Math.sin(s.a)>-.55?.5:1)):s.t*.6;if(s.t-nt>.4){spawn(q.x,q.y,Math.ceil((s.t-nt)/(2*sc))+1,sc);s.t=nt;hit++}}}
function renderPegs(){const el=document.getElementById('styles');const src=mode==='cuts'?Object.fromEntries(Object.entries(CUTS).map(([k,v])=>[k,v.l])):BRAIDS;const cur=mode==='cuts'?cut:style;
 el.innerHTML=Object.entries(src).map(([k,v])=>`<button data-style="${k}" role="radio" aria-checked="${k===cur}">${v}</button>`).join('')}
function setTool(t){tool=t;document.querySelectorAll('[data-tool]').forEach(x=>x.classList.toggle('on',x.dataset.tool===t));cv.dataset.tool=t}
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{if(mode===b.dataset.mode)return;mode=b.dataset.mode;
 document.querySelectorAll('[data-mode]').forEach(x=>x.setAttribute('aria-checked',x===b));const t1=document.getElementById('tool1');
 if(mode==='cuts'){t1.dataset.tool='clip';t1.textContent='Clippers';setTool('clip')}else{t1.dataset.tool='comb';t1.textContent='Comb';setTool('comb')}
 renderPegs();clips=[];falling=[];grow()}));
function head(){const s=Math.min(W,H*1.1);return{x:W/2,y:H*.36,rx:s*.2,ry:s*.24}}
function grow(){if(mode==='cuts'){strands=[];growCut();setInfo(CUTS[cut].svc);return}strands=[];const S=STY[style],h=head(),sc=Math.min(W,H)/520;
 for(let i=0;i<S.n;i++){const a=Math.PI*(1.06+.88*(i/(S.n-1)))+(Math.random()-.5)*.05;
  const rx=Math.cos(a)*h.rx*.92,ry=Math.sin(a)*h.ry*.92,root={x:h.x+rx,y:h.y+ry};
  const nx=Math.cos(a),ny=Math.sin(a);const pts=[];const L=S.len*sc*(style==='natural'?1+Math.random()*.4:1+Math.random()*.15);
  for(let j=0;j<S.seg;j++){const out=S.lift*j*L,down=(1-S.lift)*j*L;pts.push({x:root.x+nx*out+(Math.random()-.5),y:root.y+ny*out+down,px:0,py:0})}
  pts.forEach(p=>{p.px=p.x;p.py=p.y});strands.push({pts,L,nx,ny,ph:Math.random()*6})}
 setInfo(S.svc)}
function size(){const r=cv.getBoundingClientRect();dpr=Math.min(devicePixelRatio,2);W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;grow()}
document.getElementById('styles').addEventListener('click',e=>{const b=e.target.closest('[data-style]');if(!b)return;if(mode==='cuts')cut=b.dataset.style;else style=b.dataset.style;
 document.querySelectorAll('#styles button').forEach(x=>x.setAttribute('aria-checked',x===b));grow()});
document.querySelectorAll('[data-tool]').forEach(b=>b.addEventListener('click',()=>setTool(b.dataset.tool)));
document.getElementById('regrow').addEventListener('click',()=>{grow();falling=[];clips=[];});
// pointer
let P=null,last=null,combT=0;
function pos(e){const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);P=last=pos(e);hint.style.opacity=0});
cv.addEventListener('pointermove',e=>{const p=pos(e);if(e.pointerType==='mouse'&&!e.buttons&&(tool==='comb'||tool==='clip')){last=P=p;return}if(!P&&e.pointerType!=='mouse')return;last=P||p;P=p;act(last,P)});
const up=()=>{P=null};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);cv.addEventListener('pointerleave',up);
function segX(a,b,c,d){const r=(b.x-a.x)*(d.y-c.y)-(b.y-a.y)*(d.x-c.x);if(!r)return false;const t=((c.x-a.x)*(d.y-c.y)-(c.y-a.y)*(d.x-c.x))/r,u=((c.x-a.x)*(b.y-a.y)-(c.y-a.y)*(b.x-a.x))/r;return t>=0&&t<=1&&u>=0&&u<=1}
function act(a,b){const vx=b.x-a.x,vy=b.y-a.y;if(!vx&&!vy)return;if(mode==='cuts'){actCut(b);return}
 if(tool==='comb'){let hit=false;const R=28;for(const s of strands)for(let j=1;j<s.pts.length;j++){const p=s.pts[j],dx=p.x-b.x,dy=p.y-b.y;if(dx*dx+dy*dy<R*R){p.x+=vx*.6;p.y+=vy*.6;hit=true}}
  }
 else{for(const s of strands){for(let j=1;j<s.pts.length;j++){if(segX(a,b,s.pts[j-1],s.pts[j])){const cut=s.pts.splice(j);
   if(cut.length>1)falling.push({pts:cut,L:s.L,s,born:performance.now()});break}}}}}
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
function drawHead(bare){const h=head();
 // shoulders / cape
 ctx.fillStyle='#d42a2a';ctx.beginPath();ctx.moveTo(h.x-h.rx*2.6,H);ctx.quadraticCurveTo(h.x-h.rx*2.2,h.y+h.ry*1.5,h.x,h.y+h.ry*1.35);ctx.quadraticCurveTo(h.x+h.rx*2.2,h.y+h.ry*1.5,h.x+h.rx*2.6,H);ctx.fill();
 ctx.fillStyle='rgba(255,255,255,.9)';for(let i=-3;i<=3;i++){ctx.fillRect(h.x+i*h.rx*.7-3,h.y+h.ry*1.55,6,H)}
 ctx.fillStyle='#7a4a2e';ctx.fillRect(h.x-h.rx*.38,h.y+h.ry*.6,h.rx*.76,h.ry*.85);
 ctx.fillStyle='#8b5636';ctx.beginPath();ctx.ellipse(h.x,h.y,h.rx,h.ry,0,0,7);ctx.fill();
 ctx.fillStyle='#7a4a2e';for(const s of[-1,1]){ctx.beginPath();ctx.ellipse(h.x+s*h.rx*.98,h.y+h.ry*.1,h.rx*.14,h.ry*.2,0,0,7);ctx.fill()}
 if(bare)return;ctx.fillStyle=STY[style].col;ctx.beginPath();ctx.ellipse(h.x,h.y-h.ry*.12,h.rx*1.0,h.ry*.92,0,Math.PI*1.02,Math.PI*1.98);ctx.fill()}
function frame(){requestAnimationFrame(frame);if(!vis||!W)return;
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
 ctx.fillStyle='rgba(244,234,216,.06)';ctx.fillRect(0,H-6,W,6);
 if(mode==='cuts'){stepClips();drawHead(true);drawCut();if(P&&tool==='cut'){ctx.font='28px serif';ctx.fillText('✂️',P.x-14,P.y+10)}return}
 sim(strands,true);sim(falling,false);
 const now=performance.now();falling=falling.filter(f=>now-f.born<6000);
 drawHead();const back=strands.filter(s=>s.ny<-.2),side=strands.filter(s=>s.ny>=-.2);
 for(const s of side)drawStrand(s,STY[style],1);for(const s of back)drawStrand(s,STY[style],1);
 for(const f of falling)drawStrand(f,STY[style],Math.min(1,(6000-(now-f.born))/1500));

 if(P&&tool==='cut'){ctx.font='28px serif';ctx.fillText('✂️',P.x-14,P.y+10)}}
let vis=false;new IntersectionObserver(([e])=>{vis=e.isIntersecting;if(vis&&!W)size()}).observe(cv);
addEventListener('resize',()=>{const r=cv.getBoundingClientRect();if(Math.abs(r.width-W)>2||Math.abs(r.height-H)>2)size()});
renderPegs();size();frame();window.__hair=()=>({mode,cut,band:band.reduce((a,b)=>a+b.t,0)|0,clips:clips.length,strands:strands.reduce((a,s)=>a+s.pts.length,0),falling:falling.length});
})();
