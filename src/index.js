import Main from './scripts/main';
import "./styles/index.css";

document.addEventListener("DOMContentLoaded", () => {

  const options = {
    camera: {
      posX: 0,
      posY: 0,
      posZ: 10,
      fov: 100, 
      aspect: 2, 
      near: 0.1, 
      far: 1000
    },
    cubeGeometry: {
      cubeWidth: 1,
      cubeHeight: 1,
      cubeDepth: 1
    },
    worldSize: 3
  };

  const main = new Main("visualizer-viewport", options);
  // debugger
  main.run();

});

