import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as GraphicUtils from "../scripts/grid/utils/3d_utils";
import Grid from "./grid/grid";




class Main {
  constructor(element, options) {
    const canvas = document.getElementById(element);

    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.scene = new THREE.Scene();
    this.camera = this.createCamera(options.camera);
    this.world = this.grid(
      options.worldSize,
      options.cubeGeometry,
      options.cellSpacing,
      this.scene
    );

    GraphicUtils.directionalLight({ scene: this.scene });
    GraphicUtils.ambientLight({ scene: this.scene, color: 0xffffff });

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    const halfWorldSize = options.worldSize / 2;
    this.controls.target.set(halfWorldSize, halfWorldSize, halfWorldSize);

    // debugger // Check what this.world has
  }

  // Function to initialize a perspective camera
  createCamera(options) {
    const { posX, posY, posZ } = options;
    const camera = GraphicUtils.makeCamera(options);
    camera.position.x = posX;
    camera.position.y = posY;
    camera.position.z = posZ;

    return camera;
  }

  grid(worldSize, cubeGeometry, cellSpacing, scene) {
    return new Grid(worldSize, cubeGeometry, cellSpacing, scene);
  }

  render(time) {
    time *= 0.001;

    const resizeviewportToDisplaySize = (renderer) => {
      const viewport = renderer.domElement;
      const width = viewport.clientWidth;
      const height = viewport.clientHeight;

      const forceResize =
        viewport.width !== width || viewport.height !== height;

      if (forceResize) {
        this.renderer.setSize(width, height, false);
      }
      return forceResize;
    };

    if (resizeviewportToDisplaySize(this.renderer)) {
      const viewport = this.renderer.domElement;
      this.camera.aspect = viewport.clientWidth / viewport.clientHeight;
      this.camera.updateProjectionMatrix();
    }
    
    // We will use this cloneo of the world to run comparisons and check for how many valid neighbors each cell has to then change the dead or alive status to then render a new set of cubes
    this.world.update();
    
    // debugger
    // this.world.cubes.forEach((cube, cubeIndex) => {
      // const speed = 1 + cubeIndex * 0.1;
      // const speed = 0.1;
      // const rot = time * speed;
      // if (cube.position) {
        // cube.rotation.x = rot;
        // cube.rotation.y = rot;
        // cube.rotation.z = rot;
      // }
    // });

    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.render.bind(this));
  }

  run() {
    this.render();
  }
}

export default Main;
