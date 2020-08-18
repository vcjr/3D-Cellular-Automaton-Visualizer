// const array = require('lodash/array');
import { flattenDeep } from "lodash";

export const create3DGrid = (Cell, gridSize) => {
  let objectGrid = new Array(new Array(new Array()));
  // debugger
  for (let x = 0; x < gridSize; x++) {
    objectGrid[x] = [];
    for (let y = 0; y < gridSize; y++) {
      objectGrid[x][y] = [];
      for (let z = 0; z < gridSize; z++) {
        let cell = new Cell(x, y, z);

        objectGrid[x][y][z] = cell;
      }
    }
  }

  return objectGrid;
};

export const cellsInGrid = (grid) => {
  // return array.flattenDeep(grid).length;
  return flattenDeep(grid.cubes).length;
};

export const flattenGrid = (grid) => {
  return flattenDeep(grid);
};
