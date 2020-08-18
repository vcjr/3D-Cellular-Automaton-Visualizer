import Main from './scripts/main';
import "./styles/index.css";

document.addEventListener("DOMContentLoaded", () => {

  const options = {
    camera: {
      posX: 0,
      posY: 0,
      posZ: 10,
      fov: 75, 
      aspect: 2, 
      near: 0.1, 
      far: 1000
    },
    cubeGeometry: {
      cubeWidth: 0.5,
      cubeHeight: 0.5,
      cubeDepth: 0.5
    },
    worldSize: 3
  };

  const main = new Main("visualizer-viewport", options);
  // debugger
  main.run();

});

