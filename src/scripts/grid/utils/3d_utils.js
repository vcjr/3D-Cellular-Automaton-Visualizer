import * as THREE from "three";

// 3d Utility file to create Three.js functions
export const makeInstance = (geometry, color, x, scene) => {
  const material = new THREE.MeshPhongMaterial({ color });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.x = x;

  return cube;
};

// Will take a gemetry, cell object and a scene and create a cube then place the cube based on their own positions
export const makeCube = (geometry, cell, cellSpacing, scene) => {
  // Later make an array of colors depending on how alive and how many neigbords are next to the cube
  let color = 0x00a878;

  if (cell.alive) {
    const material = new THREE.MeshPhongMaterial({ color });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = cell.x + cellSpacing.spacingX;
    cube.position.y = cell.y + cellSpacing.spacingY;
    cube.position.z = cell.z + cellSpacing.spacingZ;

    return cube;
  } else {
    const material = new THREE.MeshPhongMaterial({
      color,
      opacity: 0,
      transparent: true,
    });

    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);

    cube.position.x = cell.x + cellSpacing.spacingX;
    cube.position.y = cell.y + cellSpacing.spacingY;
    cube.position.z = cell.z + cellSpacing.spacingZ;

    return cube;
  }
};

// export const updateCube =

export const makeCamera = (options) => {
  const { fov, aspect, near, far } = options;
  return new THREE.PerspectiveCamera(fov, aspect, near, far);
};

export const basicGeoCube = (cubeWidth = 1, cubeHeight = 1, cubeDepth = 1) => {
  return new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeDepth);
};

export const directionalLight = ({
  color = 0xffffff,
  intensity = 1,
  position = [0, 10, 4],
  scene,
}) => {
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(...position);
  scene.add(light);
};

export const ambientLight = ({ color = 0x404040, intensity = 0.4, scene }) => {
  const light = new THREE.AmbientLight(color, intensity);
  scene.add(light);
};
