export const actions=[
 {id:'cook',icon:'♨',jp:'お料理',name:'Cook a little soup',status:'A pinch of this, a taste of that…',target:[-2.05,-1.25],face:Math.PI,duration:14},
 {id:'eat',icon:'◒',jp:'おやつ',name:'Nibble some cheese',status:'A very important cheese break.',target:[1.55,.65],face:.25,duration:12},
 {id:'read',icon:'▤',jp:'読書',name:'Read a story',status:'Just one more tiny chapter.',target:[-2.2,1.5],face:.5,duration:16},
 {id:'nap',icon:'☾',jp:'おひるね',name:'Take a cozy nap',status:'Dreaming of a bigger piece of cheese.',target:[2.3,-1.35],face:.3,duration:18},
 {id:'clean',icon:'✧',jp:'おそうじ',name:'Tidy the burrow',status:'Making a little room for happiness.',target:[0,1.1],face:-.5,duration:12},
];
export function createDirector(dog,onChange){
 let active=null,queued=null,elapsed=0,walking=false,auto=true,last=null;
 function choose(id){const a=actions.find(a=>a.id===id);if(!a)return; queued=a;walking=true;elapsed=0;onChange(a,true);}
 function tick(dt){if(!active&&!queued){choose(actions[0].id);}if(queued){const dx=queued.target[0]-dog.root.position.x,dz=queued.target[1]-dog.root.position.z,dist=Math.hypot(dx,dz);if(dist>.06){dog.root.position.x+=dx/dist*Math.min(dist,dt*.9);dog.root.position.z+=dz/dist*Math.min(dist,dt*.9);dog.root.rotation.y=Math.atan2(dx,dz);}else{active=queued;queued=null;walking=false;elapsed=0;dog.root.rotation.y=active.face;onChange(active,false);}}else{elapsed+=dt;if(auto&&elapsed>active.duration){const options=actions.filter(a=>a.id!==active.id);choose(options[Math.floor(Math.random()*options.length)].id);}}return {active,walking,elapsed};}
 return {choose,tick,setAuto(v){auto=v;},get auto(){return auto;}};
}
