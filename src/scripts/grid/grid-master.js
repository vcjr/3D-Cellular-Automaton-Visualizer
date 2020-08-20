import THREE from "three";
import Cell from "./cell";

import * as MathUtils from "./utils/math_utils";
import * as GraphicUtils from "./utils/3d_utils";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";

import Stats from "three/examples/jsm/libs/stats.module";

import { cloneDeep } from "lodash";

class GridMaster {
  constructor(worldSize, cellOptions, cellSpacing, scene){
    this.cellOptions = cellOptions;
    this.cellSpacing = cellSpacing;
    this.worldSize = worldSize;
    this.scene = scene;

    // This will setup the cells to be created
    this.cells = MathUtils.flattenGrid(MathUtils.create3DGrid(Cell, worldSize));

    // this.cells = MathUtils.create3DGrid(Cell, size);
    // this.cubes = MathUtils.flattenGrid(this.cells).map((cell) =>
    //   GraphicUtils.makeCube(cellGeometry, cell, cellSpacing, this.scene)
    // );

  
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


  populateGrid(){
    this.resetGrid();
    
    const color = 0x00a878;
    // Can use Matrix3 to store all the locations of the cells which are the cubes
    const cellGeometry = GraphicUtils.basicGeoCube(
      cellOptions.cubeWidth,
      cellOptions.cubeHeight,
      cellOptions.cubeDepth
    );

    const material = new THREE.MeshPhongMaterial({ color });
    
    this.world = new THREE.Matrix3();

    // Get a count of the worldSize^3
    let count = Math.pow(this.worldSize, 3);
    cellMesh = new THREE.InstancedMesh(cellGeometry, material, count)
    


  }
}
