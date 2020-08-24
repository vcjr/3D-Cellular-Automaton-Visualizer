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
    // this.world = this.grid(
    //   options.worldSize,
    //   options.cubeGeometry,
    //   options.cellSpacing,
    //   this.scene
    // );
    this.grid = new MasterGrid(options.worldSize, options.cubeGeometry, options.cellSpacing, this.scene);
    this.grid.populateGrid();

    GraphicUtils.directionalLight({ scene: this.scene });
    GraphicUtils.ambientLight({ scene: this.scene, color: 0xffffff });

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.autoRotate = true;
    const halfWorldSize = options.worldSize / 2;
    this.controls.target.set(halfWorldSize, halfWorldSize, halfWorldSize);
    this.clock = new THREE.Clock();
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
    time *= 0.001; 
    this.delta = this.clock.getDelta();
    this.ticks = Math.round(this.delta);

    // document.getElementById("ticks-span").innerText = `Ticks: ${this.ticks}`;
  
    if (GraphicUtils.resizeviewportToDisplaySize(this.renderer)) {
      const viewport = this.renderer.domElement;
      this.camera.aspect = viewport.clientWidth / viewport.clientHeight;
      this.camera.updateProjectionMatrix();
    }
    this.grid.populateGrid();
    this.grid.cycle();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  update(){
    
    // let ticks = Math.round( this.delta / 60);
    
    
    this.render();
  }

  play() {
    this.renderer.setAnimationLoop( () => {
      this.update();
      // requestAnimationFrame(this.render.bind(this));
    });
  }

  stop(){
    this.renderer.setAnimationLoop(null);
  }
}

export default Main;
