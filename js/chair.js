import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
const cv=document.getElementById('chair');if(cv){
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,sfx=n=>window.SFX&&SFX.play(n);
const r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});r.setPixelRatio(Math.min(devicePixelRatio,2));r.outputColorSpace=THREE.SRGBColorSpace;r.toneMapping=THREE.ACESFilmicToneMapping;r.shadowMap.enabled=true;
const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(34,1,.1,100);cam.position.set(0,3,12);cam.lookAt(0,1.9,0);
scene.add(new THREE.HemisphereLight(0xfff1e0,0x20120a,1.2));
const key=new THREE.DirectionalLight(0xffe6c4,2.6);key.position.set(4,8,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);scene.add(key);
const rim=new THREE.PointLight(0xd42a2a,30,20);rim.position.set(-5,3,-3);scene.add(rim);
const leather=new THREE.MeshStandardMaterial({color:0x9e1b1f,roughness:.42,metalness:.05});
const chrome=new THREE.MeshStandardMaterial({color:0xe6e1d8,metalness:1,roughness:.18});
const black=new THREE.MeshStandardMaterial({color:0x151110,roughness:.5});
const gold=new THREE.MeshStandardMaterial({color:0xd6a24a,metalness:1,roughness:.3});
const floor=new THREE.Mesh(new THREE.CircleGeometry(6,64),new THREE.ShadowMaterial({opacity:.35}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
// checker floor ring
const chk=document.createElement('canvas');chk.width=chk.height=256;const g=chk.getContext('2d');for(let i=0;i<8;i++)for(let j=0;j<8;j++){g.fillStyle=(i+j)%2?'#efe6d6':'#141010';g.fillRect(i*32,j*32,32,32)}
const ct=new THREE.CanvasTexture(chk);ct.wrapS=ct.wrapT=THREE.RepeatWrapping;ct.repeat.set(3,3);ct.colorSpace=THREE.SRGBColorSpace;
const tiles=new THREE.Mesh(new THREE.CircleGeometry(3.4,64),new THREE.MeshStandardMaterial({map:ct,roughness:.35,metalness:.1}));tiles.rotation.x=-Math.PI/2;tiles.position.y=.001;tiles.receiveShadow=true;scene.add(tiles);
const chair=new THREE.Group();scene.add(chair);
const base=new THREE.Mesh(new THREE.CylinderGeometry(1.25,1.4,.22,64),chrome);base.position.y=.11;base.castShadow=true;chair.add(base);
const piston=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,1,32),chrome);chair.add(piston);
const sleeve=new THREE.Mesh(new THREE.CylinderGeometry(.34,.4,.7,32),black);sleeve.position.y=.55;chair.add(sleeve);
const top=new THREE.Group();chair.add(top);
const mk=(geo,mat,x,y,z,rx=0)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.rotation.x=rx;m.castShadow=true;top.add(m);return m};
mk(new THREE.CylinderGeometry(.9,.9,.12,48),chrome,0,0,0);
mk(new RoundedBoxGeometry(2,.42,1.9,6,.18),leather,0,.35,0);
mk(new RoundedBoxGeometry(2,2.3,.4,6,.18),leather,0,1.6,-.85,-.12);
mk(new RoundedBoxGeometry(1.1,.5,.36,6,.16),leather,0,3.05,-1.02,-.12);
mk(new THREE.CylinderGeometry(.05,.05,.5,12),chrome,0,2.75,-1.0);
for(const s of[-1,1]){mk(new RoundedBoxGeometry(.32,.18,1.7,4,.08),leather,s*1.2,1.05,.05);
 mk(new THREE.CylinderGeometry(.05,.05,.7,12),chrome,s*1.2,.65,.7);mk(new THREE.CylinderGeometry(.05,.05,.7,12),chrome,s*1.2,.65,-.6);
 // stitched piping
 const p=mk(new THREE.TorusGeometry(.09,.025,8,24),gold,s*1.37,1.05,.85);p.rotation.y=Math.PI/2;}
mk(new RoundedBoxGeometry(1.7,.14,.7,4,.06),chrome,0,-.55,1.25,-.25);
mk(new THREE.BoxGeometry(.1,.7,.1),chrome,-.6,-.2,1.05,.4);mk(new THREE.BoxGeometry(.1,.7,.1),chrome,.6,-.2,1.05,.4);
// pump pedal handle
const ph=mk(new THREE.CylinderGeometry(.05,.05,1,12),chrome,1.3,-.2,.3);ph.rotation.z=.9;
let H=0,targetH=0,rotY=-.5,vel=RM?0:.004,drag=false,lx=0;
function lift(){piston.scale.y=1+H*.25;piston.position.y=.22+(1+H*.25)/2;top.position.y=.22+1+H*.25+.06}
function size(){const w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;r.setSize(w,h,false);cam.aspect=w/h;cam.fov=w<500?42:34;cam.updateProjectionMatrix()}
size();addEventListener('resize',size);
cv.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;cv.setPointerCapture(e.pointerId);vel=0;cv.classList.add('grab')});
cv.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-lx;lx=e.clientX;rotY+=dx*.012;vel=dx*.012;if(Math.abs(dx)>14)sfx('whoosh')});
const up=()=>{drag=false;cv.classList.remove('grab')};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
// lever
const lev=document.getElementById('lever'),arm=lev.querySelector('.lever-arm');let ly=0,ld=false,pumped=false;
const pump=()=>{if(targetH<5){targetH++;sfx('pump')}lev.setAttribute('aria-valuenow',targetH)};
lev.addEventListener('pointerdown',e=>{ld=true;ly=e.clientY;pumped=false;lev.setPointerCapture(e.pointerId)});
lev.addEventListener('pointermove',e=>{if(!ld)return;const d=Math.max(0,Math.min(60,e.clientY-ly));arm.style.transform=`rotate(${d*.9}deg)`;if(d>45&&!pumped){pumped=true;pump()}if(d<10)pumped=false});
const lu=()=>{if(!ld)return;ld=false;if(!pumped)pump();arm.style.transform=''};lev.addEventListener('pointerup',lu);lev.addEventListener('pointercancel',lu);
lev.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='Enter'||e.key===' '){e.preventDefault();pump();arm.style.transform='rotate(50deg)';setTimeout(()=>arm.style.transform='',150)}});
document.getElementById('drop').addEventListener('click',()=>{if(targetH>0){targetH=0;sfx('hiss');lev.setAttribute('aria-valuenow',0)}});
let vis=false;new IntersectionObserver(([e])=>vis=e.isIntersecting).observe(cv);
lift();
(function f(){requestAnimationFrame(f);if(!vis)return;
 if(!drag){rotY+=vel;vel*=.96;if(Math.abs(vel)<.003&&!RM)vel=.003*Math.sign(vel||1)}
 H+=(targetH-H)*(RM?1:.12);lift();chair.rotation.y=rotY;r.render(scene,cam)})();
}
