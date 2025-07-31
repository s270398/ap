import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Exported heart mesh reference
export let heartMesh = null;
let billboardGroup = null; // To rotate towards camera
let serviceGroups = []; // To rotate toward camera

// Create and add the heart shape to the scene
export function createHeart(scene) {
  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, 0);
  heartShape.bezierCurveTo(0, 2, -2, 2, -2, 0);
  heartShape.bezierCurveTo(-2, -2, 0, -2.5, 0, -4);
  heartShape.bezierCurveTo(0, -2.5, 2, -2, 2, 0);
  heartShape.bezierCurveTo(2, 2, 0, 2, 0, 0);

  const heartGeometry = new THREE.ExtrudeGeometry(heartShape, {
    depth: 0.5,
    bevelEnabled: true,
    bevelSegments: 4,
    bevelSize: 0.2,
    bevelThickness: 0.2
  });

  const heartMaterial = new THREE.MeshPhongMaterial({ color: 0xff3333 });

  heartMesh = new THREE.Mesh(heartGeometry, heartMaterial);
  heartMesh.position.set(0, 1, 0);
  heartMesh.rotation.y = 7;
  scene.add(heartMesh);

  return heartMesh;
}

// Load and add text to the scene with optional scaling and parent
export function loadText(scene, fontUrl, text, position, size = 1, scale = { x: 0.6, y: 1, z: 0.02 }, parent = null) {
  const loader = new FontLoader();
  loader.load(fontUrl, (font) => {
    const textGeometry = new TextGeometry(text, {
      font: font,
      size: size,
      height: 0.1,
      bevelEnabled: false
    });

    textGeometry.center();
    const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(position.x, position.y, position.z);
    textMesh.scale.set(scale.x, scale.y, scale.z);

    if (parent) {
      parent.add(textMesh);
    } else {
      scene.add(textMesh);
    }
  });
}

// Load 3D models (Merlion, Marina Bay Sands, SIA)
export function loadModels(scene) {
  const merlionLoader = new GLTFLoader();
  merlionLoader.load('/models/merlion.glb', (gltf) => {
    const merlion = gltf.scene;
    merlion.scale.set(0.003, 0.003, 0.003);
    merlion.position.set(5, -10, -10);
    merlion.rotation.set(0, 2.2, 0);
    scene.add(merlion);
  });

  const marinaBaySandsLoader = new GLTFLoader();
  marinaBaySandsLoader.load('/models/marina_bay_sands.glb', (gltf) => {
    const marinaBaySands = gltf.scene;
    marinaBaySands.scale.set(2, 2, 2);
    marinaBaySands.position.set(-8, -5, -2);
    marinaBaySands.rotation.y = 1;
    scene.add(marinaBaySands);
  });

  const siaLoader = new GLTFLoader();
  siaLoader.load('/models/sia.glb', (gltf) => {
    const sia = gltf.scene;
    sia.scale.set(0.09, 0.09, 0.09);
    sia.position.set(-6, 1, 3);
    sia.rotation.y = -2;
    scene.add(sia);
  });
}

export function createBillboard(scene) {
  const loader = new FontLoader();
  loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
    const textGeometry = new TextGeometry('United & Unstoppable', {
      font: font,
      size: 1.2,
      height: 0.05,
      bevelEnabled: false
    });

    textGeometry.center();

    const textMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      metalness: 0.4,
      roughness: 0.1
    });

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(0, 0, 0);
    textMesh.scale.set(0.6, 1, 0.02);

    const billboardGeometry = new THREE.PlaneGeometry(15, 5);
    const billboardMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0
    });

    const planeMesh = new THREE.Mesh(billboardGeometry, billboardMaterial);
    planeMesh.position.z = -0.1;

    billboardGroup = new THREE.Group();
    billboardGroup.add(planeMesh);
    billboardGroup.add(textMesh);
    billboardGroup.position.set(0, 5, -10);
    scene.add(billboardGroup);
  });
}

export function updateBillboard(camera) {
  if (billboardGroup) {
    billboardGroup.lookAt(camera.position);
  }
  serviceGroups.forEach(group => group.lookAt(camera.position));
}

export function loadObjects(scene) {
  createHeart(scene);
  const scale = { x: 0.6, y: 1, z: 0.02 };

  loadText(
    scene,
    'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
    'SG60',
    { x: 0, y: 0.2, z: 0.6 },
    1,
    scale,
    heartMesh
  );

  loadText(
    scene,
    'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
    'AsiaPac',
    { x: 0, y: -1.1, z: 0.6 },
    1,
    scale,
    heartMesh
  );

  loadModels(scene);
  createBillboard(scene);
}
