// import * as THREE from "three";
import * as THREE from 'three';
// import * as GraphicUtils from "./scripts/3d_utils";
import * as GraphicUtils from '../scripts/grid/utils/3d_utils';
import Grid from './grid/grid';

// Options that will be passed inside the index.js file
class Main {
  constructor(element, options){
    // const {posX, posY, posZ} = options.camera;
    const canvas = document.getElementById(element);

    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.scene = new THREE.Scene();
    this.camera = this.createCamera(options.camera);
    this.world = this.grid(options.worldSize, options.cubeGeometry, this.scene);
    debugger // this.world shoud have created a matrix of cube cells 

    GraphicUtils.directionalLight({scene: this.scene});
    // No full render cycle yet but should display the cubes based on their positions
    // this.renderer.render(this.scene, this.camera);
    // debugger
  }

  // Function to initialize a perspective camera
  createCamera(options) {
    const {posX, posY, posZ} = options;
    const camera = GraphicUtils.makeCamera(options);
    camera.position.x = posX;
    camera.position.y = posY;
    camera.position.z = posZ;

    return camera;
  }

  grid(worldSize, cubeGeometry, scene){
    return new Grid(worldSize, cubeGeometry, scene);
  }

  resizeviewportToDisplaySize(renderer) {
    const viewport = renderer.domElement;
    const width = viewport.clientWidth;
    const height = viewport.clientHeight;

    const forceResize = viewport.width !== width || viewport.height !== height;

    if (forceResize) {
      renderer.setSize(width, height, false);
    }

    return forceResize;
  }

  render(time){
    time *= 0.002;
    
    if (this.resizeviewportToDisplaySize(renderer)) {
      const viewport = renderer.domElement;
      camera.aspect = viewport.clientWidth / viewport.clientHeight;
      camera.updateProjectionMatrix();
    }
    
    this.world.cubes.forEach((cube, ndx) => {

      const speed = 1 + ndx * 0.1;
      const rot = time * speed;

      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    this.renderer.render(this.scene, this.camera);
  
    requestAnimationFrame(render);
  }

  run(){
    this.renderer.render(this.scene, this.camera);
    // Will be a run function to excute render
  }

}

export default Main;