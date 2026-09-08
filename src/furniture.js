import * as THREE from 'three';
import {mat,mesh,ball,box,cyl,group,colors as c} from './model.js';
export function woodTexture(){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const x=canvas.getContext('2d');x.fillStyle='#d6a26b';x.fillRect(0,0,512,128);let seed=41;const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};for(let i=0;i<65;i++){x.strokeStyle=`rgba(105,62,29,${random()*.14})`;x.lineWidth=random()*2+.4;x.beginPath();const y=random()*128;for(let j=0;j<=512;j+=8)x.lineTo(j,y+Math.sin(j/70+i)*3);x.stroke();}const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;return t;}
function label(p,text,x,y,z,w=1,color='#745239'){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=160;const ctx=canvas.getContext('2d');ctx.fillStyle=color;ctx.textAlign='center';ctx.font='bold 54px Georgia';ctx.fillText(text,256,95);const texture=new THREE.CanvasTexture(canvas);const o=mesh(p,new THREE.PlaneGeometry(w,w*.3125),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}),x,y,z);return o;}
function spool(p,x,y,z){const g=group(p,x,y,z);cyl(g,c.wood,0,.1,0,.44,.15);cyl(g,mat('#ba927a'),0,.38,0,.27,.5);for(let i=0;i<12;i++)cyl(g,mat(i%2?'#c4a089':'#d2b69e'),0,.17+i*.036,0,.28,.018);cyl(g,c.gold,0,.67,0,.45,.13);return g;}
function cap(p,x,y,z,r=.3){const g=group(p,x,y,z);cyl(g,mat('#8ea7a0'),0,0,0,r,.08);cyl(g,c.cream,0,.045,0,r*.83,.025);for(let i=0;i<20;i++){let a=i*Math.PI/10;box(g,mat('#78928b'),Math.cos(a)*r,0,Math.sin(a)*r,.04,.085,.04,.01);}return g;}
export const furnitureBuilders={
 cook(parent){const g=group(parent,-2,-2e-2,-2.2);box(g,mat('#93a49a'),0,.46,0,1.45,.9,.77);box(g,c.cream,0,.95,0,1.58,.12,.88);box(g,mat('#58665e'),0,.46,.399,.61,.49,.03);label(g,'SOUP',0,.8,.4,.65);for(const x of [-.48,.48])ball(g,c.gold,x,.73,.42,.065);cyl(g,c.black,0,1.03,0,.32,.03);cyl(g,mat('#c68460'),0,1.18,0,.28,.28);cyl(g,mat('#e9c77c'),0,1.329,0,.235,.015);for(const x of [-.32,.32])box(g,c.black,x,1.21,0,.17,.065,.08);const spoon=box(g,c.wood,.1,1.51,0,.045,.43,.045);spoon.rotation.z=-.4;return g;},
 eat(parent){const g=group(parent,1.45,0,1.6);cyl(g,c.wood,0,.45,0,.12,.85);cyl(g,c.wood,0,.09,0,.48,.12);cyl(g,c.gold,0,.91,0,.78,.16);cap(g,0,1.04,0,.3);const cheese=box(g,mat('#efc559'),.01,1.13,0,.3,.16,.23,.025);for(const x of [-.07,.07])ball(g,mat('#c79732'),x,1.15,.116,.025);cyl(g,mat('#d4a7a8'),.46,1.13,.07,.12,.23);return g;},
 read(parent){const g=group(parent,-2.75,0,1.55);spool(g,0,0,0);box(g,mat('#abb799'),0,.8,0,.7,.16,.6);const shelf=group(g,-.15,0,-1.1);box(shelf,c.wood,0,.4,0,1.05,.1,.4);box(shelf,c.wood,0,.07,0,1.05,.1,.4);for(const x of [-.49,.49])box(shelf,c.wood,x,.34,0,.08,.65,.4);for(let i=0;i<6;i++){const b=box(shelf,mat(['#b5766c','#e2bd80','#a0ada2'][i%3]),-.35+i*.14,.67,0,.11,.43+i%2*.07,.29,.01);b.rotation.z=(i-2)*.035;}return g;},
 nap(parent){const g=group(parent,2.4,0,-2);box(g,mat('#a85f53'),0,.25,0,1.5,.43,2);box(g,c.gold,0,.45,0,1.33,.09,1.85);box(g,c.cream,0,.57,0,1.26,.2,1.78);box(g,mat('#a7b1a0'),0,.73,.2,1.28,.18,1.26);for(let i=0;i<5;i++)box(g,mat('#c1c8b5'),-.49+i*.245,.83,.19,.035,.01,1.17,.005);box(g,c.cream,0,.77,-.57,.98,.25,.43,.12);label(g,'LITTLE MATCHES',0,.22,1.015,1.25,'#ffe4bb');return g;},
 clean(parent){const g=group(parent,3.4,0,.25);cyl(g,mat('#c69874'),0,.22,0,.24,.4);cyl(g,mat('#79614b'),0,.425,0,.2,.02);const broom=group(g,-.33,.03,.1);box(broom,c.wood,0,.7,0,.045,1.15,.045);box(broom,c.gold,0,.12,0,.34,.27,.1);broom.rotation.z=-.2;return g;}
};
export function makeRoom(scene){
 const room=group(scene);const floorMat=mat('#ffffff',{map:woodTexture()});
 cyl(room,mat('#927553'),0,-.3,0,4.35,.65);cyl(room,mat('#b3bc92'),0,-.015,0,4.39,.14);
 // Individually laid wooden planks follow the circular footprint.
 for(let i=-10;i<=10;i++){let z=i*.38;const width=2*Math.sqrt(4.15**2-z*z);box(room,floorMat,0,.065,z,width,.13,.365,.025);}
 const wallGeo=new THREE.CylinderGeometry(4.17,4.17,2.7,80,1,true,Math.PI/2,Math.PI);
 mesh(room,wallGeo,mat('#dfc9a3',{side:THREE.DoubleSide}),0,1.35,0);
 const rim=mesh(room,new THREE.TorusGeometry(4.19,.115,12,100,Math.PI),c.wood,0,2.7,0);rim.rotation.x=-Math.PI/2;rim.rotation.z=0;
 // Round hobbit door on the back wall.
 const door=group(room,-.1,1.18,-4.01);const d=mesh(door,new THREE.CylinderGeometry(.95,.95,.13,64),mat('#859781'));d.rotation.x=Math.PI/2;
 const ring=mesh(door,new THREE.TorusGeometry(.99,.11,12,64),c.wood);for(let i=-3;i<=3;i++){const x=i*.22,h=2*Math.sqrt(.9**2-x*x);box(door,mat('#6f836d'),x,0,.079,.018,h,.018,.005);}ball(door,c.gold,.53,-.1,.16,.085);label(door,'HOME',0,.28,.087,.65,'#e5e2bc');
 // A circular window, curtain, shelves, and salvaged decorations.
 const window=group(room,-2.8,1.87,-2.98);window.rotation.y=.5;mesh(window,new THREE.CircleGeometry(.51,48),mat('#c6dfdb',{emissive:'#a8c8b3',emissiveIntensity:.35}));mesh(window,new THREE.TorusGeometry(.53,.075,12,48),c.wood);box(window,c.wood,0,0,.03,.045,1,.06);box(window,c.wood,0,0,.03,1,.045,.06);
 const shelf=group(room,2.05,1.95,-3.28);box(shelf,c.wood,0,0,0,1.35,.11,.4);for(let i=0;i<3;i++){cyl(shelf,mat(['#d4b17d','#a5ae93','#d19989'][i]),-.4+i*.4,.22,0,.125,.34);cyl(shelf,c.wood,-.4+i*.4,.41,0,.135,.06);}
 // Braided oval rug at the heart of the room.
 for(let i=0;i<12;i++){const r=mesh(room,new THREE.TorusGeometry(.65+i*.045,.029,6,80),mat(i%2?'#d6b9a0':'#efe0c3'),-.1,.16,.6);r.rotation.x=-Math.PI/2;r.scale.y=.7;}
 const interactables=[];for(const [id,build] of Object.entries(furnitureBuilders)){const f=build(room);f.userData.action=id;interactables.push(f);}
 // Mushrooms, stones, and clover around the burrow's edge.
 for(let i=0;i<20;i++){const a=i*2.399,r=4.5+(i%3)*.16,x=Math.sin(a)*r,z=Math.cos(a)*r;ball(room,mat(i%2?'#9caa83':'#b4bf96'),x,-.15,z,.23,.14,.2);if(i%4===0){cyl(room,c.cream,x,.08,z,.055,.35);ball(room,mat('#c78f78'),x,.26,z,.2,.105,.2);}}
 const lamp=group(room,.2,2.64,-.8);cyl(lamp,c.black,0,.57,0,.023,1.2);mesh(lamp,new THREE.ConeGeometry(.48,.36,40,1,true),mat('#e8bd75',{side:THREE.DoubleSide}),0,0,0);ball(lamp,mat('#fff0bb',{emissive:'#ffcf7e',emissiveIntensity:1}),0,-.07,0,.14);const light=new THREE.PointLight('#ffd69b',12,8,2);light.position.set(.2,2.4,-.8);scene.add(light);
 return {room,interactables};
}
