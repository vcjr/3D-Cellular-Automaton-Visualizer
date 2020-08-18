
class Cell {
  constructor(x, y, z){
    this.x = x; 
    this.y = y;
    this.z = z;
  }

  printInfo() {
    console.log(`I am located at X:${this.x}, Y:${this.y} Z:${this.z}`);
  }
}

// export default Cell;
module.exports = Cell;