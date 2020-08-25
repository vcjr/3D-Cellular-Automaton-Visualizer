"use strict";

var _main = _interopRequireDefault(require("./scripts/main"));

require("./scripts/modal/modal");

require("./styles/index.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

document.addEventListener("DOMContentLoaded", function () {
  var options = {
    camera: {
      posX: 5,
      posY: 5,
      posZ: 10,
      fov: 75,
      aspect: 2,
      near: 0.1,
      far: 200
    },
    cubeGeometry: {
      cubeWidth: 0.99,
      cubeHeight: 0.99,
      cubeDepth: 0.99
    },
    worldSize: 25,
    cellSpacing: {
      spacingX: 0,
      spacingY: 0,
      spacingZ: 0
    },
    colors: {
      color1: 0x00faff,
      color2: 0x9936b7,
      color3: 0xaa65bf,
      color4: 0xad5071,
      color5: 0xff4787
    }
  };
  var main = new _main["default"]("visualizer-viewport", options);
  document.addEventListener("click", function (event) {
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