import { hslToRgb } from './utils.js';
import * as THREE from 'three';

export let fireworks = [];

export function createFirework(scene, x, y, z) {
  const numParticles = 100;
  const positions = new Float32Array(numParticles * 3);
  const velocities = new Float32Array(numParticles * 3);
  const colors = new Float32Array(numParticles * 3);

  const baseHue = Math.random();

  for (let i = 0; i < numParticles; i++) {
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const angle = Math.random() * Math.PI * 2;
    const elevation = (Math.random() - 0.5) * Math.PI;
    const speed = Math.random() * 1.5 + 1.0;

    velocities[i * 3] = Math.cos(angle) * Math.cos(elevation) * speed;
    velocities[i * 3 + 1] = Math.sin(elevation) * speed + 1.0;
    velocities[i * 3 + 2] = Math.sin(angle) * Math.cos(elevation) * speed;

    const hue = (baseHue + (Math.random() - 0.5) * 0.2) % 1;
    const saturation = 1.0;
    const lightness = 0.5 + Math.random() * 0.2;

    const rgb = hslToRgb(hue, saturation, lightness);

    colors[i * 3] = rgb[0];
    colors[i * 3 + 1] = rgb[1];
    colors[i * 3 + 2] = rgb[2];
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  fireworks.push({ points, velocities, age: 0 });

  setTimeout(() => {
    scene.remove(points);
    fireworks = fireworks.filter(fw => fw.points !== points);
  }, 2500);
}

export function updateFireworks() {
  fireworks.forEach((fw) => {
    const { points, velocities } = fw;
    const positions = points.geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
      velocities[i + 1] -= 0.01; // gravity
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];
    }

    points.geometry.attributes.position.needsUpdate = true;

    fw.age += 1;
    const fade = Math.max(1 - fw.age / 60, 0);
    points.material.opacity = fade;
  });
}
