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

    this.cells = MathUtils.create3DGrid(Cell, worldSize);
  }

  cycle(){
    let nextWorld = cloneDeep(this.cells);

    let allCells = MathUtils.flattenGrid(nextWorld);
    allCells.forEach((cell, i) => {
      let aliveNeighbors = 0;

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

      let staysAlive = false;
      if (cell.alive) {
        staysAlive =
          aliveNeighbors > 4 ? false : aliveNeighbors < 3 ? false : true;
      } else {
        staysAlive = aliveNeighbors === 3 ? true : false;
      }
      // Set neighborCount to it's current cycle Count
      nextWorld[cell.x][cell.y][cell.z].neighborCount = aliveNeighbors;
      nextWorld[cell.x][cell.y][cell.z].alive = staysAlive;
      
    });

    this.cells = nextWorld;
  }

  populateGrid(colorOptions = null){
    this.resetGrid();
    const { color1, color2, color3, color4, color5 } = colorOptions;

    let color = 0x00a878;
    const cellGeometry = GraphicUtils.basicGeoCube(
      this.cellOptions.cubeWidth,
      this.cellOptions.cubeHeight,
      this.cellOptions.cubeDepth
    );

    debugger // check the path to the meshmaterial's color
    color = color5;
    const material = new THREE.MeshPhongMaterial({ color });
    
    const cellMatrix = new THREE.Matrix4();

    let count = Math.pow(this.worldSize, 3);

    // const cellMesh = new THREE.InstancedBufferGeometry(cellGeometry, material, count);
    const cellMesh = new THREE.InstancedMesh(cellGeometry, material, count);

    this.cubes = MathUtils.flattenGrid(this.cells);
    // cellMesh.material.color = color5;
    this.cubes.forEach((cell, idx) => {
      debugger //Check cell.neigborCount
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