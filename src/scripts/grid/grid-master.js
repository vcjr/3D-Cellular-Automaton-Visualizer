import * as THREE from "three";
import Cell from "./cell";

import * as MathUtils from "./utils/math_utils";
import * as GraphicUtils from "./utils/3d_utils";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";

import Stats from "three/examples/jsm/libs/stats.module";

import { cloneDeep } from "lodash";

(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})();

export default class MasterGrid {
  constructor(worldSize, cellOptions, cellSpacing, scene){
    this.cellOptions = cellOptions;
    this.cellSpacing = cellSpacing;
    this.worldSize = worldSize;
    this.scene = scene;

    // This will setup the cells to be created
    this.cells = MathUtils.create3DGrid(Cell, worldSize);
    // this.cells = MathUtils.flattenGrid(MathUtils.create3DGrid(Cell, worldSize));
  }

  cycle(){
    // We will populate the grid
    // We then want to run the algorithm to check for the cell neigbors
    let nextWorld = cloneDeep(this.cells);

    // debugger // Check is nextWorld is same as allCells
    let allCells = MathUtils.flattenGrid(nextWorld);
    // this.cells.forEach((cell, i) => {
    allCells.forEach((cell, i) => {
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
      let staysAlive = false;
      if (cell.alive) {
        staysAlive =
          aliveNeighbors > 17 ? false : aliveNeighbors < 10 ? false : true;
      } else {
        staysAlive = aliveNeighbors === 2 ? true : false;
      }
    //  debugger // compare this.cell to nextworld alive status
      nextWorld[cell.x][cell.y][cell.z].alive = staysAlive;
      // nextWorld[i].alive = staysAlive;
      
    });

    this.cells = nextWorld;
    debugger
    // this.populateGrid();
    // return this.cells;
    // After we want to re-introduce the populateGrid() method since this.cells will have been updated with a new branch of cells
  }

  populateGrid(){
    this.resetGrid();

    const color = 0x00a878;
    // Can use Matrix3 to store all the locations of the cells which are the cubes
    const cellGeometry = GraphicUtils.basicGeoCube(
      this.cellOptions.cubeWidth,
      this.cellOptions.cubeHeight,
      this.cellOptions.cubeDepth
    );

    const material = new THREE.MeshPhongMaterial({ color });
    
    const cellMatrix = new THREE.Matrix4();

    let count = Math.pow(this.worldSize, 3);

    const cellMesh = new THREE.InstancedMesh(cellGeometry, material, count);

    // this.cells.forEach((cell, idx) => {
    this.cubes = MathUtils.flattenGrid(this.cells);
    this.cubes.forEach((cell, idx) => {

      // Will only add the cell to the grid matrix if alive
      if(cell.alive) {
        this.setCellPositionMatrix(cellMatrix, cell);
        cellMesh.setMatrixAt(idx, cellMatrix);
      }
    });

    this.scene.add(cellMesh);
  }

  setCellPositionMatrix(matrix, cell){
    let position = new THREE.Vector3();
    let rotation = new THREE.Euler();
    let quaternion = new THREE.Quaternion();
    let scale = new THREE.Vector3();

    rotation.x, rotation.y, rotation.z = 0;

    position.x = cell.x;
    position.y = cell.y;
    position.z = cell.z;

    quaternion.setFromEuler( rotation );
    // Hard coded for now set to 1;
    scale.x = scale.y = scale.z = 1;

    matrix.compose( position, quaternion, scale );
  }

  resetGrid(){
    const cellMeshes = [];

    this.scene.traverse(cellMesh => {
      if (cellMesh.isMesh) cellMeshes.push( cellMesh );
    });

    cellMeshes.forEach(cellMesh => {
      cellMesh.material.dispose();
      cellMesh.geometry.dispose();

      this.scene.remove(cellMesh);
    });
  }
}