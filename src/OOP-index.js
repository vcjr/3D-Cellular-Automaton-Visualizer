import Main from './scripts/main';
import "./styles/index.css";

document.addEventListener("DOMContentLoaded", () => {

  const options = {
    camera: {
      posX: 0,
      posY: 0,
      posZ: 10
    },
    cubeGeometry: {
      cubeWidth: 1,
      cubeHeight: 1,
      cubeDepth: 1
    },
    worldSize: 10
  };

  const main = new Main("visualizer-viewport", options);
  
  // main();

});

