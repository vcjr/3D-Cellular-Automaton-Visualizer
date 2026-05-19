import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as GraphicUtils from "./grid/utils/3d_utils";
import MasterGrid from "./grid/grid-master";

class Main {
  constructor(element, options) {
    const canvas = document.getElementById(element);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    this.camera = this.createCamera(options.camera, options.worldSize);
    this.colors = options.colors;
    this.cubeGeometry = options.cubeGeometry;
    this.cellSpacing = options.cellSpacing;
    this.worldSize = options.worldSize;
    this.grid = new MasterGrid(
      options.worldSize,
      options.cubeGeometry,
      options.cellSpacing,
      this.scene,
      options.ruleset
    );
    this.grid.populateGrid(this.colors);

    GraphicUtils.directionalLight({ scene: this.scene });
    GraphicUtils.ambientLight({ scene: this.scene, color: 0xffffff });

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.autoRotate = true;
    const halfWorldSize = options.worldSize / 2;
    this.controls.target.set(halfWorldSize, halfWorldSize, halfWorldSize);
    this.clock = new THREE.Clock();
    this.ticks = 0;
    this.ticksEl = document.getElementById("ticks-span");
    this.timeEl = document.getElementById("time-span");
  }

  createCamera(options, worldSize) {
    const { posX, posY } = options;
    const camera = GraphicUtils.makeCamera(options);
    camera.position.x = posX;
    camera.position.y = posY;
    camera.position.z = worldSize * 2;

    return camera;
  }

  render() {
    const elapsedTime = this.clock.getElapsedTime();
    const rounded = Math.round(elapsedTime * 10) / 10;

    const viewport = this.renderer.domElement;
    const width = viewport.clientWidth;
    const height = viewport.clientHeight;

    const forceResize = viewport.width !== width || viewport.height !== height;

    if (forceResize) {
      this.renderer.setSize(width, height, false);
      this.camera.aspect = viewport.clientWidth / viewport.clientHeight;
      this.camera.updateProjectionMatrix();
    }

    if (rounded % 0.5 === 0) {
      this.grid.cycle();
      this.grid.populateGrid(this.colors);
      this.ticks += 1;
    }

    if (this.ticksEl) this.ticksEl.textContent = `Ticks: ${this.ticks} | `;
    if (this.timeEl) this.timeEl.textContent = ` Time: ${Math.round(elapsedTime)}`;

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  update() {
    this.render();
  }

  reset(newSize) {
    this.stop();
    const currentRuleset = this.grid.ruleset;
    this.grid.destroy();
    this.worldSize = newSize;
    this.grid = new MasterGrid(
      newSize,
      this.cubeGeometry,
      this.cellSpacing,
      this.scene,
      currentRuleset
    );
    this.grid.populateGrid(this.colors);
    this.camera.position.z = newSize * 2;
    const half = newSize / 2;
    this.controls.target.set(half, half, half);
    this.controls.update();
    this.ticks = 0;
    this.clock = new THREE.Clock();
  }

  play() {
    this.renderer.setAnimationLoop(() => {
      this.update();
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }
}

export default Main;
