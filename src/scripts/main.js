// import * as THREE from "three";
import * as THREE from 'three';
// import * as GraphicUtils from "./scripts/3d_utils";
import * as GraphicUtils from '../scripts/grid/utils/3d_utils';
import Grid from './grid/grid';

// Options that will be passed inside the index.js file
class Main {
  constructor(element, options){
    //NOTE: I need the three basic things a Scene, a Camera, and objects to render
    const {posX, posY, posZ} = options.camera;

    const canvas = document.getElementById(element);
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.scene = new THREE.Scene();
    this.camera = this.createCamera({ x: posX, y: posY, z: posZ });
    this.world = this.grid(options.worldSize, options.cubeGeometry, this.scene);
    // debugger // this.world shoud have created a matrix of cube cells 

    GraphicUtils.directionalLight({scene: this.scene});
    // No full render cycle yet but should display the cubes based on their positions
    // this.renderer.render(this.scene, this.camera);
    // debugger
  }

  // Function to initialize a perspective camera
  createCamera(startingPos) {
    const {x, y, z} = startingPos;
    const camera = GraphicUtils.makeCamera();
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;

    return camera;
  }

  grid(worldSize, cubeGeometry, scene){
    return new Grid(worldSize, cubeGeometry, scene);
  }

  run(){
    this.renderer.render(this.scene, this.camera);
    // Will be a run function to excute render
  }

}

export default Main;