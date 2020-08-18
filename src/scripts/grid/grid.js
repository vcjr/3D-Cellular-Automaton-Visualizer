// import Cell from './cell';
// import MathUtils from './utils/math_utils';
const Cell = require('./cell');
const MathUtils = require('./utils/math_utils');

class Grid {
  constructor(size){
    this.size = size;

    this.cells = MathUtils.create3DGrid(Cell, 3);
  }

  size(){
    this.cells.
  }
}

// export default Grid;
module.export = Grid;