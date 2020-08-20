import Cell from "./cell";
import * as MathUtils from './utils/math_utils';
import * as GraphicUtils from "./utils/3d_utils";
import { cloneDeep } from "lodash";


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
    // Based on a live or not we will change that individual's cell's material to reflect it's dead or alive status. Transparent if it's there other wise blue;

    let nextWorld = cloneDeep(this.cells);

    let allCells = MathUtils.flattenGrid(this.cells);

    allCells.forEach((cell) => {
      let aliveNeighbors = 0;

      // This will return other cell cordinates to later compare
      for (let i = 0; i < MathUtils.compareArr.length; i++) {
        const offSet = MathUtils.compareArr[i];
        const { x, y, z } = offSet;

        let newX = cell.x - x;
        let newY = cell.y - y;
        let newZ = cell.z - z;

        
        if (nextWorld[newX] === undefined || nextWorld[newX][newY] === undefined ||  nextWorld[newX][newY][newZ] === undefined) {
          continue;
        }

        let neighbor = nextWorld[newX][newY][newZ];

        if (neighbor.alive){
          aliveNeighbors += 1;
        }
      }

      // Hardcode the automaton ruleset here for now
      let staysAlive = null;
      if (cell.alive) {
        staysAlive =
          aliveNeighbors > 3 ? false : aliveNeighbors < 2 ? false : true;
      } else {
        staysAlive = aliveNeighbors === 3 ? true : false;
      }
    //  debugger // compare this.cell to nextworld alive status
      nextWorld[cell.x][cell.y][cell.z].alive = staysAlive;
      
    });

    this.cells = nextWorld;
    return this.cells;
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
