export const create3DGrid = (Object, gridSize) => {
  let objectGrid = new Array(new Array(new Array()));

  for (x = 0; x < gridSize; x++) {
    objectGrid[x] = [];
    for (y = 0; y < gridSize; y++) {
      objectGrid[x][y] = [];
      for (z = 0; z < gridSize; z++) {
        let cell = new Object(x, y, z);

        objectGrid[x][y][z] = cell;
      }
    }
  }

  return objectGrid;
};
