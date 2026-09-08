import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {makeStormi,mat,box,ball,group,cyl,colors} from './model.js';
import {makeRoom} from './furniture.js';
import {actions,createDirector} from './actions.js';
import './style.css';

document.querySelector('#app').innerHTML=`
 <header><a class="brand" href="./"><span class="brand-mark">✿</span><div><strong>stormi<span>のおうち</span></strong><small>A LITTLE LIFE, A LOT OF JOY</small></div></a><div class="weather"><span>☀</span> こもれびの日 <i></i> A cozy afternoon</div><button id="help" class="round" aria-label="Show controls">?</button></header>
 <main><div class="intro"><div class="eyebrow">WELCOME TO HER LITTLE WORLD</div><h1>Small paws.<br>Simple pleasures.</h1><p>ストーミーの、のんびりな毎日。</p></div>
 <div id="world" role="img" aria-label="Interactive 3D dollhouse of Stormi's burrow. Choose activities with the buttons below."></div>
 <div class="name-tag"><span>✿</span> stormi’s burrow <small>est. with love</small></div>
 <div class="profile"><img src="./stormi-reference.png" alt="Stormi, the black and white dog who inspired this world"><div><strong>stormi <span>ストーミー</span></strong><small><i></i> Happy to be home</small></div><span class="heart">♡</span></div>
 <div class="view-controls"><button id="zoom-in" class="round" aria-label="Zoom in">＋</button><button id="zoom-out" class="round" aria-label="Zoom out">−</button><button id="reset" class="round" aria-label="Reset view">⌂</button><span></span><button id="pause" class="round" aria-label="Pause" aria-pressed="false">Ⅱ</button></div>
 <div class="hint">↔ Drag to rotate <b>·</b> Scroll to get closer <b>·</b> Click a tiny thing</div>
 <div class="status" aria-live="polite"><span id="status-icon">♨</span><div><strong id="activity">Settling in…</strong><small id="thought">Make yourself at home.</small></div><span class="status-dots">•••</span></div>
 </main><footer><div class="tray-label"><span>今日は、なにしよう？</span><small>What shall we do?</small></div><div class="actions">${actions.map(a=>`<button class="action" data-action="${a.id}" aria-label="${a.name}" aria-pressed="false"><span>${a.icon}</span><strong>${a.name.split(' ')[0]}</strong></button>`).join('')}</div><div class="auto-control"><button id="auto" role="switch" aria-checked="true"><span></span></button><div><strong>おまかせ</strong><small>Let Stormi choose</small></div></div></footer>
 <dialog id="help-dialog"><button id="close-help" class="round" aria-label="Close controls">×</button><h2>Make yourself at home.</h2><p>Drag to orbit the burrow. Scroll or pinch to zoom.</p><p>Click furniture or choose an activity below. Stormi walks over and gets to work. Turn off おまかせ to stay with your chosen routine.</p><p>Press Space to pause, + / − to zoom, or R to reset the view.</p></dialog><div id="error" hidden></div>`;

const container=document.querySelector('#world');
let renderer;
try {renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch(e){document.querySelector('#error').hidden=false;document.querySelector('#error').textContent='Stormi needs WebGL to open her home. Enable hardware acceleration or try another browser.';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.28;container.append(renderer.domElement);
const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.set(9,8.3,12.6);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.8,0);controls.enableDamping=true;controls.minDistance=8;controls.maxDistance=23;controls.maxPolarAngle=Math.PI*.47;controls.minPolarAngle=.24;controls.enablePan=false;controls.maxAzimuthAngle=Math.PI*.65;controls.minAzimuthAngle=-Math.PI*.65;controls.saveState();
scene.add(new THREE.HemisphereLight('#fff4d7','#a7aa90',2.8));const sun=new THREE.DirectionalLight('#ffe9c7',4);sun.position.set(-3,8,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-7;sun.shadow.camera.right=7;sun.shadow.camera.top=7;sun.shadow.camera.bottom=-7;sun.shadow.normalBias=.03;sun.shadow.bias=-.0002;sun.shadow.radius=4;scene.add(sun);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.14}));ground.rotation.x=-Math.PI/2;ground.position.y=-.64;ground.receiveShadow=true;scene.add(ground);
const {interactables}=makeRoom(scene);const dog=makeStormi(scene);dog.root.position.set(0,.18,.5);
const props={};props.eat=group(dog.prop);box(props.eat,mat('#edc552'),0,0,0,.22,.17,.16);for(let i=0;i<3;i++)ball(props.eat,mat('#c59739'),-.065+i*.06,.035,.08,.018);
props.read=group(dog.prop);for(const s of [-1,1]){const cover=box(props.read,mat('#9b6a61'),s*.12,0,0,.24,.3,.025);cover.rotation.y=s*.2;box(props.read,colors.cream,s*.12,0,.025,.21,.27,.02);}
props.cook=group(dog.prop);box(props.cook,colors.wood,0,.08,0,.035,.42,.035);ball(props.cook,colors.gold,0,.3,0,.075,.025,.05);
// Anchor the broom to the end of her right paw so it cannot drift away during a sweep.
const broomGrip=group(dog.arms[1],.035,-.32,.06);
props.clean=group(broomGrip);ball(props.clean,colors.cream,0,0,0,.075,.085,.075);box(props.clean,colors.wood,0,-.12,0,.035,1.02,.035);box(props.clean,colors.gold,0,-.65,0,.29,.23,.07);
Object.values(props).forEach(prop=>prop.visible=false);
const steam=group(scene,-2,1.55,-2.2);for(let i=0;i<5;i++)ball(steam,mat('#fff8e6',{transparent:true,opacity:.22,depthWrite:false}),Math.sin(i)*.12,i*.13,0,.045);
const sleep=document.createElement('div');sleep.className='sleep';sleep.textContent='z z Z';sleep.hidden=true;container.append(sleep);
let paused=matchMedia('(prefers-reduced-motion: reduce)').matches;let time=0;
const director=createDirector(dog,(a,walking)=>{document.querySelector('#activity').textContent=walking?`On her way · ${a.jp}`:a.name;document.querySelector('#thought').textContent=walking?'Little paws, coming through.':a.status;document.querySelector('#status-icon').textContent=a.icon;document.querySelectorAll('[data-action]').forEach(b=>{const selected=b.dataset.action===a.id;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});});
document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>director.choose(b.dataset.action));
function updatePause(){const b=document.querySelector('#pause');b.textContent=paused?'▶':'Ⅱ';b.setAttribute('aria-label',paused?'Resume':'Pause');b.setAttribute('aria-pressed',String(paused));document.body.classList.toggle('paused',paused);}updatePause();
document.querySelector('#pause').onclick=()=>{paused=!paused;updatePause();};document.querySelector('#auto').onclick=e=>{director.setAuto(!director.auto);e.currentTarget.setAttribute('aria-checked',String(director.auto));};
function zoom(f){const v=camera.position.clone().sub(controls.target);v.setLength(THREE.MathUtils.clamp(v.length()*f,8,23));camera.position.copy(controls.target).add(v);controls.update();}
document.querySelector('#zoom-in').onclick=()=>zoom(.86);document.querySelector('#zoom-out').onclick=()=>zoom(1.16);document.querySelector('#reset').onclick=()=>controls.reset();
document.querySelector('#help').onclick=()=>document.querySelector('dialog').showModal();document.querySelector('#close-help').onclick=()=>document.querySelector('dialog').close();
addEventListener('keydown',e=>{if(e.target.closest('button,dialog,input'))return;if(e.code==='Space'){e.preventDefault();paused=!paused;updatePause();}if(e.key==='+')zoom(.86);if(e.key==='-')zoom(1.16);if(e.key.toLowerCase()==='r')controls.reset();});
const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let down;
function hit(e){const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);let o=ray.intersectObjects(interactables,true)[0]?.object;while(o&&!o.userData.action)o=o.parent;return o;}
renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];});renderer.domElement.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down[0],e.clientY-down[1])<5){const o=hit(e);if(o)director.choose(o.userData.action);}down=null;});renderer.domElement.addEventListener('pointermove',e=>{renderer.domElement.style.cursor=hit(e)?'pointer':'grab';});
function resize(){const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(container);resize();
const clock=new THREE.Clock();
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);if(!paused){time+=dt;const state=director.tick(dt),id=state.walking?null:state.active?.id,t=state.elapsed;
 dog.body.position.y=state.walking?Math.abs(Math.sin(time*8))*.055:Math.sin(time*2)*.009;
 dog.body.rotation.set(0,0,0);dog.head.rotation.set(0,Math.sin(time*.6)*.055,Math.sin(time*1.4)*.022);
 dog.root.position.y=.18;dog.tail.rotation.z=Math.sin(time*(state.walking?9:5))*.35;
 dog.ears.forEach((ear,i)=>ear.rotation.z=Math.sin(time*2+i)*.045+(Math.sin(time*1.7)> .97?Math.sin(time*24)*.12:0));
 dog.legs.forEach((leg,i)=>leg.rotation.x=state.walking?Math.sin(time*8+i*Math.PI)*.42:0);
 dog.arms.forEach((arm,i)=>{arm.rotation.set(state.walking?Math.sin(time*8+i*Math.PI)*.35:0,0,0);});
 const blink=Math.sin(time*.83)>.994;dog.eyes.forEach(e=>e.scale.y=blink?.08:1);dog.mouth.scale.y=1;
 Object.entries(props).forEach(([key,p])=>p.visible=key===id);dog.prop.position.set(0,.85,.42);dog.prop.rotation.set(0,0,0);
 if(id==='eat'){const nibble=Math.sin(t*10);dog.arms.forEach(a=>a.rotation.x=-1.05);dog.prop.position.y=1.02+nibble*.015;dog.head.rotation.x=.1;dog.mouth.scale.y=1.3+nibble*.5;}
 if(id==='read'){dog.arms.forEach(a=>a.rotation.x=-.9);dog.head.rotation.x=.15;dog.head.rotation.y=Math.sin(t*.8)*.08;dog.prop.rotation.y=Math.sin(t*.5)*.09;}
 if(id==='cook'){const taste=t%6>4;dog.arms[1].rotation.x=taste?-1.4:-.8;dog.arms[1].rotation.z=Math.sin(t*3)*.2;dog.prop.position.set(.28,taste?.8:.72,.6);dog.prop.rotation.z=Math.sin(t*3)*.3;dog.head.rotation.x=taste?.1:Math.sin(t*2)*.04;dog.mouth.scale.y=taste?1+Math.sin(t*9)*.5:1;}
 if(id==='clean'){dog.body.rotation.z=Math.sin(t*3)*.08;dog.arms[1].rotation.set(-.7,0,Math.sin(t*3)*.22);props.clean.quaternion.copy(dog.arms[1].quaternion).invert();dog.root.position.x=state.active.target[0]+Math.sin(t)*.28;}
 if(id==='nap'){dog.root.position.set(2.4,.9,-1.9);dog.body.rotation.z=-Math.PI/2;dog.head.rotation.x=.08;dog.eyes.forEach(e=>e.scale.y=.07);dog.tail.rotation.z=Math.sin(time)*.04;}
 sleep.hidden=id!=='nap';steam.children.forEach((s,i)=>{s.position.y=((time*.18+i*.13)%.8);s.position.x=Math.sin(time+i)*.1;s.scale.setScalar(.6+s.position.y);s.material.opacity=.24*(1-s.position.y/.8);});
 }
 if(!sleep.hidden){const p=dog.root.position.clone().add(new THREE.Vector3(.45,1.1,0)).project(camera);sleep.style.left=`${(p.x*.5+.5)*container.clientWidth}px`;sleep.style.top=`${(-p.y*.5+.5)*container.clientHeight}px`;}
 controls.update();renderer.render(scene,camera);
}animate();


