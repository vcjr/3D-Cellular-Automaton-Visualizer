import Main from "./scripts/main";
import "./scripts/modal/modal";
import "./styles/index.css";

document.addEventListener("DOMContentLoaded", () => {
  const options = {
    camera: {
      posX: 5,
      posY: 5,
      posZ: 10,
      fov: 75,
      aspect: 2,
      near: 0.1,
      far: 200,
    },
    cubeGeometry: {
      cubeWidth: 0.99,
      cubeHeight: 0.99,
      cubeDepth: 0.99,
    },
    worldSize: 15,
    cellSpacing: {
      spacingX: 0,
      spacingY: 0,
      spacingZ: 0,
    },
  };

  const main = new Main("visualizer-viewport", options);

  document.addEventListener("click", (event) => {
    if (event.target.matches("#play-button")) {
      console.log("You Clicked Play");
      main.play();
    }

    if (event.target.matches("#stop-button")) {
      console.log("You Clicked Stop");
      main.stop();
    }
  });
});