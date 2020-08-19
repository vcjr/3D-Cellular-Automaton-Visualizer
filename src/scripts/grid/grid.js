import Cell from "./cell";
// import MathUtils from './utils/math_utils';
// const Cell = require("./cell");
const MathUtils = require("./utils/math_utils");
const GraphicUtils = require("./utils/3d_utils");

class Grid {
  constructor(size, cellOptions, cellSpacing, scene) {
    this.size = size;
    this.scene = scene;
    const cellGeometry = GraphicUtils.basicGeoCube(
      cellOptions.cubeWidth,
      cellOptions.cubeHeight,
      cellOptions.cubeDepth
    );

    this.cells = MathUtils.create3DGrid(Cell, size);

    // This will create instances of each cell and add them each to the scene
    // this.cubes is now an array of cells of cube that we have added to our scene and we can render
    this.cubes = MathUtils.flattenGrid(this.cells).map((cell) =>
      GraphicUtils.makeCube(cellGeometry, cell, cellSpacing, this.scene)
    );

    // debugger;
  }

  update() {
    // This function will run the Automaton logic and rule set. Will take in a grid with diffrent cells inside and run the ruleset.
    // this will return a new grid to re-render on the next cycle
    // Base on alive or not we will change that individual's cell's material to reflect it's dead or alive status. Transparent if it's there other wise blue;
    
  }

  // Returns total size of grid
  getSize() {
    return MathUtils.cellsInGrid(this);
  }

  // Returns Alive # of Cells
  aliveCount() {
    return MathUtils.cellsInGrid(this.grid);
  }

  // Returns Dead # of Cells
  deadCount() {
    // return MathUtils.cellsInGrid(this.grid);
  }
}

export default Grid;
