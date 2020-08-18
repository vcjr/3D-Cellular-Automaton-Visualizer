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
    // debugger // this.world shoud have created a matrix of cube cells 

    // remember to abstract this later on to a light we can manipuate inside the main class
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

  // resizeviewportToDisplaySize() {
  //   const viewport = this.renderer.domElement;
  //   const width = viewport.clientWidth;
  //   const height = viewport.clientHeight;

  //   const forceResize = viewport.width !== width || viewport.height !== height;

  //   if (forceResize) {
  //     this.renderer.setSize(width, height, false);
  //   }

  //   return forceResize;
  // }

  render(time){
    time *= 0.001;
    
    const resizeviewportToDisplaySize = (renderer) => {
      const viewport = renderer.domElement;
      const width = viewport.clientWidth;
      const height = viewport.clientHeight;
  
      const forceResize = viewport.width !== width || viewport.height !== height;
  
      if (forceResize) {
        this.renderer.setSize(width, height, false);
      }
      // debugger
      return forceResize;
    };

    // debugger // check what this.renderer is
    if (resizeviewportToDisplaySize(this.renderer)) {
      const viewport = this.renderer.domElement;
      this.camera.aspect = viewport.clientWidth / viewport.clientHeight;
      this.camera.updateProjectionMatrix();
    }
    
    this.world.cubes.forEach((cube, ndx) => {

      const speed = 1 + ndx * 0.1;
      const rot = time * speed;

      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    this.renderer.render(this.scene, this.camera);
  
    requestAnimationFrame(this.render.bind(this));
  }

  run(){
    // this.renderer.render(this.scene, this.camera);
    // Will be a run function to excute render
    // debugger
    this.render();
  }

}

export default Main;