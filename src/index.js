import Main from './scripts/main';
import "./styles/index.css";

document.addEventListener("DOMContentLoaded", () => {

  const options = {
    camera: {
      posX: 5,
      posY: 5,
      posZ: 25,
      fov: 75, 
      aspect: 2, 
      near: 0.1, 
      far: 10000
    },
    cubeGeometry: {
      cubeWidth: 1,
      cubeHeight: 1,
      cubeDepth: 1
    },
    worldSize: 25,
    cellSpacing: {
      spacingX: 0,
      spacingY: 0,
      spacingZ: 0
    }
  };

  const main = new Main("visualizer-viewport", options);

  // Make this a UI button
  main.run();

});

