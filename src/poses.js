import * as THREE from 'three';

const down = new THREE.Vector3(0, -1, 0);
const direction = new THREE.Vector3();
const grip = new THREE.Vector3();

export function sweepPose(dog, broom, time) {
  const stroke = Math.sin(time * 2.6);
  const tilt = stroke * .23;
  dog.body.position.y = 0;
  broom.position.set(stroke * .32, .765 * Math.cos(tilt) - .04, .52);
  broom.rotation.set(0, 0, tilt);
  broom.updateMatrix();
  // Both paw targets are points on the same handle, in body space.
  dog.arms.forEach((arm, i) => {
    grip.set(0, i === 0 ? .06 : -.17, 0).applyMatrix4(broom.matrix);
    direction.copy(grip).sub(arm.position);
    arm.quaternion.setFromUnitVectors(down, direction.clone().normalize());
    arm.scale.set(1, direction.length() / .32, 1);
    arm.children[0].position.x = 0;
  });
  dog.head.rotation.x = .13;
  dog.head.rotation.y = stroke * .12;
}

export function napPose(dog, time) {
  // Align the body's long axis with the bed, feet toward its front edge.
  dog.root.position.set(2.4, 1.16, -1.13);
  dog.root.rotation.y = 0;
  dog.body.rotation.x = -Math.PI / 2;
  dog.body.position.y = Math.sin(time * 1.6) * .008;
  dog.head.position.z = .13;
  dog.head.rotation.set(0, 0, .045);
  dog.arms.forEach((arm, i) => arm.rotation.set(-.35, 0, i ? -.15 : .15));
  dog.eyes.forEach(eye => eye.scale.y = .07);
  dog.tail.rotation.z = Math.sin(time) * .04;
}
