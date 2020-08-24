"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var THREE = _interopRequireWildcard(require("three"));

var _OrbitControls = require("three/examples/jsm/controls/OrbitControls");

var GraphicUtils = _interopRequireWildcard(require("../scripts/grid/utils/3d_utils"));

var _grid = _interopRequireDefault(require("./grid/grid"));

var _gridMaster = _interopRequireDefault(require("./grid/grid-master"));

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Main =
/*#__PURE__*/
function () {
  function Main(element, options) {
    _classCallCheck(this, Main);

    var canvas = document.getElementById(element);
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true
    });
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    this.camera = this.createCamera(options.camera, options.worldSize); // this.world = this.grid(
    //   options.worldSize,
    //   options.cubeGeometry,
    //   options.cellSpacing,
    //   this.scene
    // );

    this.grid = new _gridMaster["default"](options.worldSize, options.cubeGeometry, options.cellSpacing, this.scene);
    this.grid.populateGrid();
    GraphicUtils.directionalLight({
      scene: this.scene
    });
    GraphicUtils.ambientLight({
      scene: this.scene,
      color: 0xffffff
    });
    this.controls = new _OrbitControls.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.autoRotate = true;
    var halfWorldSize = options.worldSize / 2;
    this.controls.target.set(halfWorldSize, halfWorldSize, halfWorldSize);
    this.clock = new THREE.Clock();
  } // Function to initialize a perspective camera


  _createClass(Main, [{
    key: "createCamera",
    value: function createCamera(options, worldSize) {
      var posX = options.posX,
          posY = options.posY,
          posZ = options.posZ;
      var camera = GraphicUtils.makeCamera(options);
      camera.position.x = posX;
      camera.position.y = posY;
      camera.position.z = worldSize * 2; //posZ ;//+ options.worldSize * 2.5;

      return camera;
    }
  }, {
    key: "grid",
    value: function grid(worldSize, cubeGeometry, cellSpacing, scene) {
      return new _grid["default"](worldSize, cubeGeometry, cellSpacing, scene);
    }
  }, {
    key: "render",
    value: function render(time) {
      time *= 0.001;
      this.delta = this.clock.getDelta();
      this.ticks = Math.round(this.delta); // document.getElementById("ticks-span").innerText = `Ticks: ${this.ticks}`;

      if (GraphicUtils.resizeviewportToDisplaySize(this.renderer)) {
        var viewport = this.renderer.domElement;
        this.camera.aspect = viewport.clientWidth / viewport.clientHeight;
        this.camera.updateProjectionMatrix();
      }

      this.grid.populateGrid();
      this.grid.cycle();
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }
  }, {
    key: "update",
    value: function update() {
      // let ticks = Math.round( this.delta / 60);
      this.render();
    }
  }, {
    key: "play",
    value: function play() {
      var _this = this;

      this.renderer.setAnimationLoop(function () {
        _this.update(); // requestAnimationFrame(this.render.bind(this));

      });
    }
  }, {
    key: "stop",
    value: function stop() {
      this.renderer.setAnimationLoop(null);
    }
  }]);

  return Main;
}();

var _default = Main;
exports["default"] = _default;