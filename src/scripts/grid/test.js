// import Cell from './cell';
const Cell = require('./cell');

// let cell1 = new Cell(0, 0, 1);
// cell1.printInfo();

// console.log(cell1);

// Grid creation
let gridSize = 10;

// let grid = [[[],[],[]],[],[]];
// let grid = {};

let objectGrid = new Array(new Array(new Array));
// let objectGrid = new Array();

for(x = 0; x < gridSize; x++) {
  objectGrid[x] = [];
  for(y = 0; y < gridSize; y++) {
    objectGrid[x][y] = [];
    for(z = 0; z < gridSize; z++) {
      let cell = new Cell(x, y, z);

      objectGrid[x][y][z] = cell;
    }
  }
}

// console.log(grid);

console.log(objectGrid[1][4][0]);