import * as THREE from 'three';
import { setupScene } from './setupScene.js';
import { createFirework, updateFireworks, fireworks } from './fireworks.js';
import { loadObjects, heartMesh, updateBillboard } from './objects.js';

const { scene, camera, renderer, controls } = setupScene();
loadObjects(scene);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const popup = document.getElementById('popup');

window.addEventListener('click', event => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([heartMesh]);

  if (intersects.length > 0) {
    popup.style.display = 'block';
  } else {
    popup.style.display = 'none';
  }

  // 🔄 Convert mouse click to 3D world coordinates
  const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
  vector.unproject(camera);

  const dir = vector.sub(camera.position).normalize();
  const distance = -camera.position.z / dir.z;
  const pos = camera.position.clone().add(dir.multiplyScalar(distance));

  console.log('Creating firework at:', pos); // Debug log

  createFirework(scene, pos.x, pos.y, pos.z); // 🎆 Firework appears at proper 3D spot
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  updateFireworks();

  // Billboard faces camera
  updateBillboard(camera);

  // Animate floating elements
  const time = Date.now() * 0.002;
  scene.traverse((child) => {
    if (child.userData.float) {
      child.position.y += Math.sin(time) * 0.01; // gentle bobbing
    }
  });

  renderer.render(scene, camera);
}

animate();
