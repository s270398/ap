import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export let heartMesh = null;

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
    bevelThickness: 0.2,
  });

  const heartMaterial = new THREE.MeshPhongMaterial({ color: 0xff3333 });
  heartMesh = new THREE.Mesh(heartGeometry, heartMaterial);
  heartMesh.position.set(0, 1, 0); // Move heart up slightly
  scene.add(heartMesh);

  return heartMesh;
}

// Load text with given parameters and add to parent (e.g., heartMesh)
export function loadText(scene, parentMesh) {
  const loader = new FontLoader();

  // Load "SG60"
  loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
    const textGeometrySG60 = new TextGeometry('SG60', {
      font: font,
      size: 1,
      height: 0.3,
      bevelEnabled: true,
      bevelSize: 0.05,
      bevelThickness: 0.05,
      bevelSegments: 3,
    });

    textGeometrySG60.center();

    const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const textMeshSG60 = new THREE.Mesh(textGeometrySG60, textMaterial);

    textMeshSG60.scale.set(0.6, 1, 0.02);
    parentMesh.add(textMeshSG60);
    textMeshSG60.position.set(0, 0.2, 0.6); // Position inside heart
  });

  // Load "AsiaPac"
  loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
    const textGeometryAsiaPac = new TextGeometry('AsiaPac', {
      font: font,
      size: 1,
      height: 0.3,
      bevelEnabled: true,
      bevelSize: 0.05,
      bevelThickness: 0.05,
      bevelSegments: 3,
    });

    textGeometryAsiaPac.center();

    const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const textMeshAsiaPac = new THREE.Mesh(textGeometryAsiaPac, textMaterial);

    textMeshAsiaPac.scale.set(0.6, 1, 0.02);
    parentMesh.add(textMeshAsiaPac);
    textMeshAsiaPac.position.set(0, -1.1, 0.6); // Below SG60 text
  });
}

// Load models (Merlion and Marina Bay Sands)
export function loadModels(scene) {
  const merlionLoader = new GLTFLoader();
  merlionLoader.load('/models/merlion.glb', (gltf) => {
    const merlion = gltf.scene;
    merlion.scale.set(0.003, 0.003, 0.003);
    merlion.position.set(5, -10, -10);
    merlion.rotation.x = 0.1;
    merlion.rotation.y = 2.2;
    merlion.rotation.z = 0;
    scene.add(merlion);
  }, undefined, (error) => {
    console.error('Error loading Merlion model:', error);
  });

  const marinaBaySandsLoader = new GLTFLoader();
  marinaBaySandsLoader.load('/models/marina_bay_sands.glb', (gltf) => {
    const marinaBaySands = gltf.scene;
    marinaBaySands.scale.set(1, 1, 1);
    marinaBaySands.position.set(-8, -7, 0);
    marinaBaySands.rotation.y = 1;
    scene.add(marinaBaySands);
  }, undefined, (error) => {
    console.error('Error loading Marina Bay Sands model:', error);
  });
}

// Main loader to add everything
export function loadObjects(scene) {
  createHeart(scene);
  loadText(scene, heartMesh);
  loadModels(scene);
}
