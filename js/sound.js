// Tiny WebAudio synth. Off by default; user toggles.
window.SFX=(()=>{let ctx=null,on=false;
const btn=document.getElementById('snd');
function ac(){if(!ctx)ctx=new (window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume();return ctx}
function env(g,t,a,d,v){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d)}
function noise(dur,f,q,v){const c=ac(),t=c.currentTime,b=c.createBuffer(1,c.sampleRate*dur,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
 const s=c.createBufferSource();s.buffer=b;const fl=c.createBiquadFilter();fl.type='bandpass';fl.frequency.value=f;fl.Q.value=q;const g=c.createGain();env(g,t,.003,dur,v);s.connect(fl).connect(g).connect(c.destination);s.start(t)}
function tone(f,dur,type,v,slide){const c=ac(),t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+dur);env(g,t,.005,dur,v||.15);o.connect(g).connect(c.destination);o.start(t);o.stop(t+dur+.05)}
const S={snip(){noise(.06,4200,4,.35);setTimeout(()=>noise(.04,6000,6,.2),40)},
 comb(){noise(.05,2500,1.5,.06)},click(){tone(900,.05,'square',.06)},flip(){noise(.08,1400,2,.15);tone(500,.06,'triangle',.06,900)},
 pump(){tone(110,.18,'sawtooth',.08,70);noise(.12,600,1,.12)},hiss(){noise(.5,900,.6,.12)},
 neon(){tone(120,.4,'sawtooth',.05);setTimeout(()=>tone(120,.6,'sawtooth',.04),180);noise(.15,3000,3,.08)},
 pop(){tone(300,.12,'sine',.18,900)},whoosh(){noise(.3,800,.7,.12)},drop(){tone(400,.25,'sine',.08,120)}};
function play(n){if(on&&S[n])try{S[n]()}catch(e){}}
btn&&btn.addEventListener('click',()=>{on=!on;btn.setAttribute('aria-pressed',on);btn.setAttribute('aria-label','Sound effects '+(on?'on':'off'));btn.firstChild.textContent=on?'🔊':'🔇';if(on){ac();play('pop')}});
return{play}})();
