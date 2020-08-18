import * as THREE from "three";
import * as GraphicUtils from "./scripts/3d_utils";
import Grid from './grid/grid';

const options = {
  camera: {
    posX: 0,
    posY: 0,
    posZ: 10
  },
  cubeGeometry: {
    cubeWidth: 1,
    cubeHeight: 1,
    cubeDepth: 1
  },
  worldSize: 10
};

class Main {
  constructor(options){
    //NOTE: I need the three basic things a Scene, a Camera, and objects to render
    const {posX, posY, posZ} = options.camera;

    const canvas = document.getElementById(element);
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.scene = new THREE.scene();

    this.camera = this.createCamera({ x: posX, y: posY, z: posZ });

    this.world = this.grid(options.worldSize, options.cubeGeometry);
    // this.cells(options.cubeGeometry);

  }

  // Function to initialize a perspective camera
  createCamera(startingPos) {
    const {x, y, z} = startingPos;
    this.camera = GraphicUtils.makeCamera();
    this.camera.position.x = x;
    this.camera.position.y = y;
    this.camera.position.z = z;
  }

  grid(worldSize){
    return new Grid(worldSize);
  }

  run(){

  }

}

export default Main;

const viewport = () => {

  // Scene Setup -> Main's Job
  const canvas = document.getElementById("visualizer-viewport"); // DONE
  const renderer = new THREE.WebGLRenderer({ canvas }); // DONE

  const scene = new THREE.Scene();

  // Camera Setup -> Main's Job
  const camera = GraphicUtils.makeCamera();
  camera.position.z = 10;

  // Basic Cube Geometry Setup -> Grids Job
  const cubeGeometry = GraphicUtils.basicGeoCube();

  // Initial Cell Setup -> Grids Job
  const cells = [
    GraphicUtils.makeInstance(cubeGeometry, 0x9900FF, 0, scene),
    GraphicUtils.makeInstance(cubeGeometry, 0x76A5AF, -1.5, scene),
    GraphicUtils.makeInstance(cubeGeometry, 0xFF0000, 1.5, scene)
  ];

  // Scene & Camera being attached to scene
  renderer.render(scene, camera);

  // Responsive viewport setup
  const resizeviewportToDisplaySize = (renderer) => {
    const viewport = renderer.domElement;
    const width = viewport.clientWidth;
    const height = viewport.clientHeight;

    const forceResize = viewport.width !== width || viewport.height !== height;

    if (forceResize) {
      renderer.setSize(width, height, false);
    }

    return forceResize;
  };

  // Render Function
  const render = time => {
    time *= 0.002;
    
    if (resizeviewportToDisplaySize(renderer)) {
      const viewport = renderer.domElement;
      camera.aspect = viewport.clientWidth / viewport.clientHeight;
      camera.updateProjectionMatrix();
    }
    
    cells.forEach((cube, ndx) => {

      const speed = 1 + ndx * 0.1;
      const rot = time * speed;

      // cube.rotation.x = rot;
      // cube.rotation.y = rot;
    });

    renderer.render(scene, camera);
  
    requestAnimationFrame(render);
  };
  
  // Inital Light Steup
  GraphicUtils.directionalLight({scene: scene});
  requestAnimationFrame(render);

};

// Calling and Running it all
viewport();
});