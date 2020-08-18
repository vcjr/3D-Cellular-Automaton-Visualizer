// import Cell from './cell';
// import MathUtils from './utils/math_utils';
const Cell = require("./cell");
const MathUtils = require("./utils/math_utils");
const GraphicUtils = require("./utils/3d_utils");

class Grid {
  constructor(size, cellOptions) {
    this.size = size;

    const cellGeometry = GraphicUtils.basicGeoCube(
      cellOptions.cubeWidth,
      cellOptions.cubeHeight,
      cellOptions.cubeDepth
    );

    let cells = MathUtils.create3DGrid(Cell, 3);
  }

  // Returns total size of grid
  size() {
    return MathUtils.cellsInGrid(this.grid);
  }

  // Returns Alive # of Cells
  aliveCount() {
    // return MathUtils.cellsInGrid(this.grid);
  }

  // Returns Dead # of Cells
  deadCount() {
    // return MathUtils.cellsInGrid(this.grid);
  }

}

// export default Grid;
module.export = Grid;
