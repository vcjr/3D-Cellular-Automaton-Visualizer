import * as THREE from "three";
import * as GraphicUtils from "./scripts/grid/utils/3d_utils";
// import Main from './scripts/main';
import "./styles/index.css";

document.addEventListener("DOMContentLoaded", () => {
    const viewport = () => {

    // Scene Setup
    const canvas = document.getElementById("visualizer-viewport");
    const renderer = new THREE.WebGLRenderer({ canvas });

    const scene = new THREE.Scene();

    // Camera Setup
    const camera = GraphicUtils.makeCamera();
    camera.position.z = 10;

    // Basic Cube Geometry Setup
    const cubeGeometry = GraphicUtils.basicGeoCube();

    // Initial Cell Setup
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