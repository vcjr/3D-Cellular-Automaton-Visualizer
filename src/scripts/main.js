import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as GraphicUtils from "../scripts/grid/utils/3d_utils";
import Grid from "./grid/grid";
import MasterGrid from './grid/grid-master';
import { cloneDeep } from "lodash";

class Main {
  constructor(element, options) {
    const canvas = document.getElementById(element);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    this.camera = this.createCamera(options.camera, options.worldSize);
    this.colors = options.colors;
    this.grid = new MasterGrid(options.worldSize, options.cubeGeometry, options.cellSpacing, this.scene);
    this.grid.populateGrid(this.colors);
    
    GraphicUtils.directionalLight({ scene: this.scene });
    GraphicUtils.ambientLight({ scene: this.scene, color: 0xffffff });

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.autoRotate = true;
    const halfWorldSize = options.worldSize / 2;
    this.controls.target.set(halfWorldSize, halfWorldSize, halfWorldSize);
    this.clock = new THREE.Clock();
    this.ticks = 0;
    this.timePeriod = 0.0;
  }

  // Function to initialize a perspective camera
  createCamera(options, worldSize) {
    const { posX, posY, posZ } = options;
    const camera = GraphicUtils.makeCamera(options);
    camera.position.x = posX;
    camera.position.y = posY;
    camera.position.z = worldSize * 2;//posZ ;//+ options.worldSize * 2.5;

    return camera;
  }

  grid(worldSize, cubeGeometry, cellSpacing, scene) {
    return new Grid(worldSize, cubeGeometry, cellSpacing, scene);
  }

  render(time) {
    // time *= 0.001; 
    this.delta = this.clock.getDelta();
    // this.ticks = Math.round(this.delta / 60);
    // this.ticks = this.delta;
    // if ((this.clock.elapsedTime % 0.5 === 0)){
      this.grid.cycle();
      this.grid.populateGrid(this.colors);

      this.ticks += 1;
      // debugger
    // }
    // debugger
    document.getElementById("ticks-span").textContent = `Ticks: ${this.ticks} | `;
    document.getElementById("delta-span").textContent = `Old Time: ${this.clock.oldTime }`;
    document.getElementById("time-span").textContent = ` Time: ${this.clock.getElapsedTime()}`;
    // document.getElementById("delta-span").textContent = `Delta: ${this.delta}`;

    // if
    // debugger
    if (GraphicUtils.resizeviewportToDisplaySize(this.renderer)) {
      const viewport = this.renderer.domElement;
      this.camera.aspect = viewport.clientWidth / viewport.clientHeight;
      this.camera.updateProjectionMatrix();
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  update(){
    
    this.render();
    
  }

  play() {
    this.renderer.setAnimationLoop( () => {
      this.update();
    });
  }

  stop(){
    this.renderer.setAnimationLoop(null);
  }
}

export default Main;
