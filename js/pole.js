import * as THREE from 'three';
const cv=document.getElementById('pole');
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
r.setPixelRatio(Math.min(devicePixelRatio,2));r.outputColorSpace=THREE.SRGBColorSpace;r.toneMapping=THREE.ACESFilmicToneMapping;
const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(32,1,.1,100);cam.position.set(0,0,12.5);
// braided stripe texture
function braidTex(){
 const W=512,H=1024,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
 g.fillStyle='#f4ead8';g.fillRect(0,0,W,H);
 const cols=['#c81f24','#f7f1e6','#1a1411','#d6a24a'];const bands=8,bw=W/bands;
 g.save();g.translate(W/2,H/2);g.rotate(-Math.PI/6);g.translate(-W,-H);
 for(let b=0;b<bands*4;b++){const x0=b*bw/1.0;const col=cols[b%4];
  // a braid = stacked chevron "plaits"
  for(let y=0;y<H*3;y+=bw*.55){
   for(const s of[-1,1]){g.beginPath();const cx=x0+bw/2;g.moveTo(cx,y);g.quadraticCurveTo(cx+s*bw*.55,y+bw*.1,cx+s*bw*.48,y+bw*.5);g.quadraticCurveTo(cx+s*bw*.12,y+bw*.42,cx,y+bw*.62);g.closePath();
    const gr=g.createLinearGradient(cx-bw/2,y,cx+bw/2,y+bw*.6);gr.addColorStop(0,col);gr.addColorStop(.55,shade(col,s>0?-28:18));gr.addColorStop(1,shade(col,-45));g.fillStyle=gr;g.fill();
    g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=1.2;g.stroke();}
  }}
 g.restore();const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2,1.2);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t}
function shade(h,a){const n=parseInt(h.slice(1),16);const f=v=>Math.max(0,Math.min(255,v+a));return`rgb(${f(n>>16)},${f(n>>8&255)},${f(n&255)})`}
const tex=braidTex();
const pole=new THREE.Group();scene.add(pole);
const core=new THREE.Mesh(new THREE.CylinderGeometry(.82,.82,5.2,96,1,true),new THREE.MeshStandardMaterial({map:tex,roughness:.55,metalness:.05,bumpMap:tex,bumpScale:.04}));pole.add(core);
const glass=new THREE.Mesh(new THREE.CylinderGeometry(.95,.95,5.3,96,1,true),new THREE.MeshPhysicalMaterial({color:0xffffff,transmission:.95,roughness:.05,thickness:.3,transparent:true,opacity:.25,clearcoat:1}));pole.add(glass);
const chrome=new THREE.MeshStandardMaterial({color:0xd8d2c8,metalness:1,roughness:.22});
const gold=new THREE.MeshStandardMaterial({color:0xd6a24a,metalness:1,roughness:.3});
for(const s of[1,-1]){const cap=new THREE.Mesh(new THREE.CylinderGeometry(1.08,1.08,.36,64),chrome);cap.position.y=s*2.83;pole.add(cap);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(1.02,.06,16,64),gold);ring.rotation.x=Math.PI/2;ring.position.y=s*2.62;pole.add(ring);}
const dome=new THREE.Mesh(new THREE.SphereGeometry(.9,48,24,0,Math.PI*2,0,Math.PI/2),chrome);dome.position.y=3.01;pole.add(dome);
const knob=new THREE.Mesh(new THREE.SphereGeometry(.22,24,16),gold);knob.position.y=3.98;pole.add(knob);
const base=new THREE.Mesh(new THREE.CylinderGeometry(.75,1.1,.5,64),chrome);base.position.y=-3.26;pole.add(base);
// environment-ish lighting
scene.add(new THREE.HemisphereLight(0xfff0dc,0x1a0e08,1.1));
const key=new THREE.DirectionalLight(0xffe2b8,2.4);key.position.set(4,5,6);scene.add(key);
const rim=new THREE.PointLight(0xd42a2a,25,20);rim.position.set(-4,1,-2);scene.add(rim);
const fill=new THREE.PointLight(0xd6a24a,18,20);fill.position.set(3,-3,3);scene.add(fill);
// steam wisps
function steamTex(){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');const gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'rgba(255,255,255,.55)');gr.addColorStop(.5,'rgba(255,255,255,.15)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);return new THREE.CanvasTexture(c)}
const sTex=steamTex(),wisps=[];
for(let i=0;i<34;i++){const m=new THREE.Sprite(new THREE.SpriteMaterial({map:sTex,transparent:true,depthWrite:false,opacity:0,color:0xfff3e0}));
 m.userData={t:Math.random(),sp:.04+Math.random()*.05,x:(Math.random()-.5)*3,ph:Math.random()*6};scene.add(m);wisps.push(m)}
let scrollV=0,lastY=scrollY,spin=0,mx=0,my=0;
addEventListener('scroll',()=>{scrollV+=(scrollY-lastY)*.004;lastY=scrollY},{passive:true});
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
function size(){const w=cv.clientWidth,h=cv.clientHeight;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();
 const mob=w<640;pole.position.set(mob?0:2.6*Math.min(1,w/h),mob?1.6:0,0);pole.scale.setScalar(mob?.68:1);}
size();addEventListener('resize',size);
let vis=true;new IntersectionObserver(([e])=>vis=e.isIntersecting).observe(cv);
const clock=new THREE.Clock();
function frame(){requestAnimationFrame(frame);if(!vis)return;const dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime;
 scrollV*=.92;spin=(RM?0:.35)+scrollV*6;
 tex.offset.y-=dt*spin*.25;core.rotation.y+=dt*spin*.4;
 pole.rotation.z=-.12+mx*.08;pole.rotation.x=my*.1;pole.position.y+=((innerWidth<640?1.6:0)+Math.sin(t*.8)*.08-pole.position.y)*.05;
 for(const w of wisps){const u=w.userData;u.t+=dt*u.sp*(RM?0:1);if(u.t>1)u.t=0;
  w.position.set(pole.position.x+u.x+Math.sin(t*.7+u.ph)*.5*u.t,pole.position.y-2+u.t*6,.8+Math.cos(u.ph)*.6);
  const s=.8+u.t*2.6;w.scale.set(s,s,1);w.material.opacity=Math.sin(u.t*Math.PI)*.22;}
 r.render(scene,cam)}
frame();
