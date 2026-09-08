import assert from 'node:assert/strict';
import {actions,createDirector} from './actions.js';
const dog={root:{position:{x:0,z:0},rotation:{y:0}}};
let current;
const director=createDirector(dog,(a,walking)=>{current={a,walking};});
director.setAuto(false);
for(const a of actions){
 director.choose(a.id);
 assert.equal(current.walking,true);
 for(let i=0;i<1000;i++)director.tick(.02);
 assert.equal(current.a.id,a.id);
 assert.equal(current.walking,false);
 assert.ok(Math.hypot(dog.root.position.x-a.target[0],dog.root.position.z-a.target[1])<.061);
 assert.equal(dog.root.rotation.y,a.face);
 for(let i=0;i<1500;i++)director.tick(.02);
 assert.equal(current.a.id,a.id,'manual activity must remain selected');
}
director.setAuto(true);
director.tick(30);
assert.equal(current.walking,true);
assert.notEqual(current.a.id,'clean','automatic routine must pick a different activity');
console.log('All five destinations, manual persistence, and automatic transitions passed.');
