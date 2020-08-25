"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Cell =
/*#__PURE__*/
function () {
  function Cell(x, y, z) {
    var alive = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    _classCallCheck(this, Cell);

    this.x = x;
    this.y = y;
    this.z = z;
    this.alive = alive;
    this.neighborCount = null;
    var luck = this.randomLife();
  }

  _createClass(Cell, [{
    key: "randomLife",
    value: function randomLife() {
      var coin = Math.random();
      this.alive = coin > 0.99;
    }
  }, {
    key: "toggleLife",
    value: function toggleLife() {
      this.alive = !this.alive;
    }
  }, {
    key: "printInfo",
    value: function printInfo() {
      console.log("I am located at X:".concat(this.x, ", Y:").concat(this.y, " Z:").concat(this.z));
    }
  }]);

  return Cell;
}();

var _default = Cell;
exports["default"] = _default;