"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var THREE = _interopRequireWildcard(require("three"));

var _cell = _interopRequireDefault(require("./cell"));

var MathUtils = _interopRequireWildcard(require("./utils/math_utils"));

var GraphicUtils = _interopRequireWildcard(require("./utils/3d_utils"));

var _OrbitControls = require("three/examples/jsm/controls/OrbitControls");

var _BufferGeometryUtils = require("three/examples/jsm/utils/BufferGeometryUtils");

var _datGui = require("three/examples/jsm/libs/dat.gui.module");

var _stats = _interopRequireDefault(require("three/examples/jsm/libs/stats.module"));

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function () {
  var script = document.createElement('script');

  script.onload = function () {
    var stats = new _stats["default"]();
    document.body.appendChild(stats.dom);
    requestAnimationFrame(function loop() {
      stats.update();
      requestAnimationFrame(loop);
    });
  };

  script.src = '//mrdoob.github.io/stats.js/build/stats.min.js';
  document.head.appendChild(script);
})();

var MasterGrid =
/*#__PURE__*/
function () {
  function MasterGrid(worldSize, cellOptions, cellSpacing, scene) {
    _classCallCheck(this, MasterGrid);

    this.cellOptions = cellOptions;
    this.cellSpacing = cellSpacing;
    this.worldSize = worldSize;
    this.scene = scene;
    this.cells = MathUtils.create3DGrid(_cell["default"], worldSize);
  }

  _createClass(MasterGrid, [{
    key: "cycle",
    value: function cycle() {
      var nextWorld = (0, _lodash.cloneDeep)(this.cells);
      var allCells = MathUtils.flattenGrid(nextWorld);
      allCells.forEach(function (cell, i) {
        var aliveNeighbors = 0;

        for (var _i = 0; _i < MathUtils.compareArr.length; _i++) {
          var offSet = MathUtils.compareArr[_i];
          var x = offSet.x,
              y = offSet.y,
              z = offSet.z;
          var newX = cell.x - x;
          var newY = cell.y - y;
          var newZ = cell.z - z;

          if (nextWorld[newX] === undefined || nextWorld[newX][newY] === undefined || nextWorld[newX][newY][newZ] === undefined) {
            continue;
          }

          var neighbor = nextWorld[newX][newY][newZ];

          if (neighbor.alive) {
            aliveNeighbors += 1;
          }
        }

        var staysAlive = false;

        if (cell.alive) {
          staysAlive = aliveNeighbors > 4 ? false : aliveNeighbors < 3 ? false : true;
        } else {
          staysAlive = aliveNeighbors === 3 ? true : false;
        } // Set neighborCount to it's current cycle Count


        nextWorld[cell.x][cell.y][cell.z].neighborCount = aliveNeighbors;
        nextWorld[cell.x][cell.y][cell.z].alive = staysAlive;
      });
      this.cells = nextWorld;
    }
  }, {
    key: "populateGrid",
    value: function populateGrid() {
      var _this = this;

      var colorOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.resetGrid();
      var color1 = colorOptions.color1,
          color2 = colorOptions.color2,
          color3 = colorOptions.color3,
          color4 = colorOptions.color4,
          color5 = colorOptions.color5;
      var color = 0x00a878;
      var cellGeometry = GraphicUtils.basicGeoCube(this.cellOptions.cubeWidth, this.cellOptions.cubeHeight, this.cellOptions.cubeDepth);
      debugger; // check the path to the meshmaterial's color

      color = color5;
      var material = new THREE.MeshPhongMaterial({
        color: color
      });
      var cellMatrix = new THREE.Matrix4();
      var count = Math.pow(this.worldSize, 3); // const cellMesh = new THREE.InstancedBufferGeometry(cellGeometry, material, count);

      var cellMesh = new THREE.InstancedMesh(cellGeometry, material, count);
      this.cubes = MathUtils.flattenGrid(this.cells); // cellMesh.material.color = color5;

      this.cubes.forEach(function (cell, idx) {
        debugger; //Check cell.neigborCount

        if (cell.alive) {
          _this.setCellPositionMatrix(cellMatrix, cell);

          cellMesh.setMatrixAt(idx, cellMatrix);
        }
      });
      this.scene.add(cellMesh);
    }
  }, {
    key: "setCellPositionMatrix",
    value: function setCellPositionMatrix(matrix, cell) {
      var position = new THREE.Vector3();
      var rotation = new THREE.Euler();
      var quaternion = new THREE.Quaternion();
      var scale = new THREE.Vector3();
      rotation.x, rotation.y, rotation.z = 0;
      position.x = cell.x;
      position.y = cell.y;
      position.z = cell.z;
      quaternion.setFromEuler(rotation);
      scale.x = scale.y = scale.z = 1;
      matrix.compose(position, quaternion, scale);
    }
  }, {
    key: "resetGrid",
    value: function resetGrid() {
      var _this2 = this;

      var cellMeshes = [];
      this.scene.traverse(function (cellMesh) {
        if (cellMesh.isMesh) cellMeshes.push(cellMesh);
      });
      cellMeshes.forEach(function (cellMesh) {
        cellMesh.material.dispose();
        cellMesh.geometry.dispose();

        _this2.scene.remove(cellMesh);
      });
    }
  }]);

  return MasterGrid;
}();

exports["default"] = MasterGrid;