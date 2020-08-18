import * as THREE from 'three';

// 3d Utility file to create Three.js functions
export const makeInstance = (geometry, color, x, scene) => {
  const material = new THREE.MeshPhongMaterial({color});

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.x = x;

  return cube;
};

export const makeCube = (geometry, color, object, scene) => {

};

export const makeCamera = (fov = 75, aspect = 2, near = 0.1, far = 1000) => {
  return new THREE.PerspectiveCamera(fov, aspect, near, far);
};

export const basicGeoCube = (cubeWidth = 1, cubeHeight = 1, cubeDepth = 1) => {
  return new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeDepth);
};

export const directionalLight = ({color = 0xFFFFFF, intensity = 1, position = [-1, 2, 4], scene}) => {
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(...position);
  scene.add(light);
};
