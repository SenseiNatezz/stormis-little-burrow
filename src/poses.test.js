import assert from 'node:assert/strict';
import * as THREE from 'three';
import {makeStormi} from './model.js';
import {sweepPose,napPose} from './poses.js';
const scene=new THREE.Scene();
const dog=makeStormi(scene);
const broom=new THREE.Group();dog.body.add(broom);
for(let t=0;t<8;t+=.1){
 sweepPose(dog,broom,t);scene.updateMatrixWorld(true);
 dog.arms.forEach((arm,i)=>{
  const paw=arm.localToWorld(new THREE.Vector3(0,-.32,0));
  const handle=broom.localToWorld(new THREE.Vector3(0,i===0?.06:-.17,0));
  assert.ok(paw.distanceTo(handle)<1e-6,'Both paws stay on the handle through the full sweep');
 });
}
napPose(dog,0);scene.updateMatrixWorld(true);
const headBounds=new THREE.Box3().setFromObject(dog.head);
assert.ok(headBounds.min.x>=1.65 && headBounds.max.x<=3.15,'Head fits across bed width');
assert.ok(headBounds.min.z>=-3 && headBounds.max.z<=-1,'Head stays within bed length');
assert.ok(headBounds.min.y>.8,'Head rests above the mattress');
console.log('Two-paw grip and sleeping head placement passed.');
