import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
export const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.85,...extra});
export const colors={cream:mat('#fff3d9'),black:mat('#29292e'),pink:mat('#ed9cab'),wood:mat('#bb7945'),gold:mat('#e3b46e'),green:mat('#82977a')};
export function mesh(parent,geo,material,x=0,y=0,z=0){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
export function ball(p,m,x,y,z,sx,sy=sx,sz=sx){const o=mesh(p,new THREE.SphereGeometry(1,24,16),m,x,y,z);o.scale.set(sx,sy,sz);return o;}
export function box(p,m,x,y,z,w,h,d,r=.06){return mesh(p,new RoundedBoxGeometry(w,h,d,3,r),m,x,y,z);}
export function cyl(p,m,x,y,z,r,h){return mesh(p,new THREE.CylinderGeometry(r,r,h,40),m,x,y,z);}
export function group(p,x=0,y=0,z=0){const g=new THREE.Group();g.position.set(x,y,z);p.add(g);return g;}
export function makeStormi(parent){
 const root=group(parent),body=group(root),head=group(body,0,1.28,0); const c=colors;
 ball(body,c.cream,0,.66,0,.35,.46,.27);ball(body,c.pink,0,.67,-.01,.355,.3,.28);
 const legs=[-1,1].map(s=>{const l=group(body,s*.2,.32,0);ball(l,c.cream,0,-.13,.065,.145,.23,.18);return l;});
 const arms=[-1,1].map(s=>{const a=group(body,s*.33,.91,0);ball(a,c.cream,s*.035,-.19,0,.13,.24,.13);return a;});
 ball(head,c.black,0,0,0,.5,.46,.39);
 ball(head,c.cream,0,.1,.359,.075,.31,.045);
 ball(head,c.cream,0,-.2,.3,.36,.23,.21);
 ball(head,c.cream,-.17,-.12,.38,.2,.16,.13);ball(head,c.cream,.17,-.12,.38,.2,.16,.13);
 const eyes=[-1,1].map(s=>{const e=group(head,s*.205,.025,.351);ball(e,c.black,0,0,0,.085,.1,.05);ball(e,c.cream,-.025,.031,.044,.022);return e;});
 ball(head,c.black,0,-.1,.52,.1,.075,.065);
 const mouth=group(head); // No protruding brown mouth piece on her white muzzle.
 const ears=[-1,1].map(s=>{const e=group(head,s*.4,.18,0);ball(e,c.black,s*.04,-.22,0,.19,.37,.19);for(let i=0;i<4;i++)ball(e,c.black,s*.045+(i-1.5)*.06,-.44,.03,.075,.14,.13);const b=group(e,s*.025,.05,.16);ball(b,c.pink,-.075,0,0,.09,.055,.045);ball(b,c.pink,.075,0,0,.09,.055,.045);ball(b,c.pink,0,0,.02,.038);return e;});
 const tail=group(body,0,.53,-.23);ball(tail,c.cream,0,.1,-.19,.11,.12,.28);tail.rotation.x=-.6;
 // Her pink collar and flower are taken from the supplied photograph.
 const collar=mesh(body,new THREE.TorusGeometry(.245,.038,8,32),c.pink,0,1.01,0);collar.rotation.x=Math.PI/2;
 for(let i=0;i<5;i++){const a=i*Math.PI*2/5;ball(body,c.pink,.18+Math.cos(a)*.065,.98+Math.sin(a)*.065,.245,.044);}
 ball(body,c.gold,.18,.98,.28,.027);
 const prop=group(body,0,.85,.42);
 return {root,body,head,arms,legs,ears,tail,eyes,mouth,prop};
}

