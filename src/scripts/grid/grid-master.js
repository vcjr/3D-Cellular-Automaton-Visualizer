import * as THREE from "three";
import Cell from "./cell";
import * as MathUtils from "./utils/math_utils";
import * as GraphicUtils from "./utils/3d_utils";
import { cloneDeep } from "lodash";
import { RULESETS, DEFAULT_RULESET } from "./automatons/automaton";

function colorForNeighborCount(count, colors) {
  if (count <= 1) return colors.color1;
  if (count === 2) return colors.color2;
  if (count === 3) return colors.color3;
  if (count === 4) return colors.color4;
  return colors.color5;
}

export default class MasterGrid {
  constructor(worldSize, cellOptions, cellSpacing, scene, ruleset) {
    this.worldSize = worldSize;
    this.scene = scene;
    this.ruleset = ruleset || RULESETS[DEFAULT_RULESET];
    this.colors = null;
    this.cells = MathUtils.create3DGrid(Cell, worldSize);

    const cellGeometry = GraphicUtils.basicGeoCube(
      cellOptions.cubeWidth,
      cellOptions.cubeHeight,
      cellOptions.cubeDepth
    );
    const count = Math.pow(worldSize, 3);
    this.material = new THREE.MeshPhongMaterial();
    this.cellMesh = new THREE.InstancedMesh(cellGeometry, this.material, count);
    this.scene.add(this.cellMesh);
  }

  destroy() {
    this.scene.remove(this.cellMesh);
    this.cellMesh.geometry.dispose();
    this.material.dispose();
  }

  setRuleset(ruleset) {
    this.ruleset = {
      survive: new Set(ruleset.survive),
      born: new Set(ruleset.born),
    };
  }

  cycle() {
    const snapshot = this.cells;
    const nextWorld = cloneDeep(this.cells);
    const allCells = MathUtils.flattenGrid(snapshot);

    allCells.forEach((cell) => {
      let aliveNeighbors = 0;

      for (let i = 0; i < MathUtils.compareArr.length; i++) {
        const { x, y, z } = MathUtils.compareArr[i];
        const newX = cell.x - x;
        const newY = cell.y - y;
        const newZ = cell.z - z;

        if (
          snapshot[newX] === undefined ||
          snapshot[newX][newY] === undefined ||
          snapshot[newX][newY][newZ] === undefined
        ) {
          continue;
        }

        if (snapshot[newX][newY][newZ].alive) {
          aliveNeighbors += 1;
        }
      }

      const staysAlive = cell.alive
        ? this.ruleset.survive.has(aliveNeighbors)
        : this.ruleset.born.has(aliveNeighbors);

      nextWorld[cell.x][cell.y][cell.z].neighborCount = aliveNeighbors;
      nextWorld[cell.x][cell.y][cell.z].alive = staysAlive;
    });

    this.cells = nextWorld;
  }

  populateGrid(colorOptions = null) {
    if (colorOptions) {
      this.colors = colorOptions;
    }
    if (!this.colors) return;

    const aliveMatrix = new THREE.Matrix4();
    const hiddenMatrix = new THREE.Matrix4().makeScale(0, 0, 0);
    const color = new THREE.Color();

    MathUtils.flattenGrid(this.cells).forEach((cell, idx) => {
      if (cell.alive) {
        this.setCellPositionMatrix(aliveMatrix, cell);
        this.cellMesh.setMatrixAt(idx, aliveMatrix);
        color.set(colorForNeighborCount(cell.neighborCount, this.colors));
        this.cellMesh.setColorAt(idx, color);
      } else {
        this.cellMesh.setMatrixAt(idx, hiddenMatrix);
      }
    });

    this.cellMesh.instanceMatrix.needsUpdate = true;
    if (this.cellMesh.instanceColor) {
      this.cellMesh.instanceColor.needsUpdate = true;
    }
  }

  setCellPositionMatrix(matrix, cell) {
    const position = new THREE.Vector3(cell.x, cell.y, cell.z);
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3(1, 1, 1);
    matrix.compose(position, quaternion, scale);
  }
}
