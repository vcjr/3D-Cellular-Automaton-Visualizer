# Controls, Color Themes & Pluggable Rulesets — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a control bar below the canvas with color theme presets + per-color customization, pluggable rulesets with toggle-button editing, and neighbor-count-based cell coloring.

**Architecture:** Ruleset data lives in a new `automaton.js` module. `MasterGrid` accepts a ruleset at construction and exposes `setRuleset()` for live swaps. `populateGrid()` gains per-cell `setColorAt` calls driven by `neighborCount`. All UI is generated and wired in `src/index.js` — no framework, no state management, just DOM events writing directly into `main.grid` and `main.colors`.

**Tech Stack:** Three.js (InstancedMesh setColorAt), vanilla JS ES modules, Webpack 5, plain CSS.

> **Note:** This project has no test runner. Verification steps use `npm run build` for compile-time correctness and manual browser inspection for runtime behavior.

---

### Task 1: Ruleset data module

**Files:**
- Create: `src/scripts/grid/automatons/automaton.js`

- [ ] **Step 1: Create the ruleset module**

```js
// src/scripts/grid/automatons/automaton.js
export const RULESETS = {
  '3D Life': { survive: new Set([3, 4]), born: new Set([3]) },
  'Conway':  { survive: new Set([2, 3]), born: new Set([3]) },
  'Sparse':  { survive: new Set([4, 5]), born: new Set([4]) },
  'Dense':   { survive: new Set([2, 3, 4, 5]), born: new Set([2, 3]) },
};

export const DEFAULT_RULESET = '3D Life';
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```
Expected: compiled with 0 errors (warnings about bundle size are fine).

- [ ] **Step 3: Commit**

```bash
git add src/scripts/grid/automatons/automaton.js
git commit -m "feat: add pluggable ruleset data module"
```

---

### Task 2: MasterGrid — pluggable ruleset in cycle()

**Files:**
- Modify: `src/scripts/grid/grid-master.js`

- [ ] **Step 1: Replace grid-master.js with the updated version**

Replace the entire file content:

```js
import * as THREE from "three";
import Cell from "./cell";
import * as MathUtils from "./utils/math_utils";
import * as GraphicUtils from "./utils/3d_utils";
import { cloneDeep } from "lodash";

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
    this.ruleset = ruleset;
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

  setRuleset(ruleset) {
    this.ruleset = ruleset;
  }

  cycle() {
    let nextWorld = cloneDeep(this.cells);
    let allCells = MathUtils.flattenGrid(nextWorld);

    allCells.forEach((cell) => {
      let aliveNeighbors = 0;

      for (let i = 0; i < MathUtils.compareArr.length; i++) {
        const { x, y, z } = MathUtils.compareArr[i];
        let newX = cell.x - x;
        let newY = cell.y - y;
        let newZ = cell.z - z;

        if (
          nextWorld[newX] === undefined ||
          nextWorld[newX][newY] === undefined ||
          nextWorld[newX][newY][newZ] === undefined
        ) {
          continue;
        }

        if (nextWorld[newX][newY][newZ].alive) {
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
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/scripts/grid/grid-master.js
git commit -m "feat: pluggable rulesets and neighbor-count coloring in MasterGrid"
```

---

### Task 3: Thread ruleset through Main and index.js

**Files:**
- Modify: `src/scripts/main.js`
- Modify: `src/index.js`

- [ ] **Step 1: Update main.js to pass ruleset to MasterGrid**

In `src/scripts/main.js`, find the MasterGrid constructor call and add `options.ruleset` as the 5th argument:

```js
this.grid = new MasterGrid(
  options.worldSize,
  options.cubeGeometry,
  options.cellSpacing,
  this.scene,
  options.ruleset
);
```

- [ ] **Step 2: Update src/index.js to import ruleset data and add to options**

Replace the entire `src/index.js`:

```js
import Main from "./scripts/main";
import "./scripts/modal/modal";
import "./styles/index.css";
import { RULESETS, DEFAULT_RULESET } from "./scripts/grid/automatons/automaton";

const COLOR_PALETTES = {
  'Neon':   { color1: 0x00faff, color2: 0x9936b7, color3: 0xaa65bf, color4: 0xad5071, color5: 0xff4787 },
  'Matrix': { color1: 0x00ff88, color2: 0x00cc66, color3: 0x009944, color4: 0x006622, color5: 0x003311 },
  'Fire':   { color1: 0xff6b35, color2: 0xff8c42, color3: 0xffb347, color4: 0xffd700, color5: 0xfff176 },
  'Ocean':  { color1: 0x4fc3f7, color2: 0x29b6f6, color3: 0x039be5, color4: 0x0277bd, color5: 0x01579b },
  'Void':   { color1: 0xe040fb, color2: 0xab47bc, color3: 0x7b1fa2, color4: 0x4a148c, color5: 0x1a0030 },
};

function toHex(num) {
  return '#' + num.toString(16).padStart(6, '0');
}

function initColorPanel(main) {
  const presetsEl = document.getElementById('color-presets');
  const swatchesEl = document.getElementById('color-swatches');

  Object.entries(COLOR_PALETTES).forEach(([name, palette]) => {
    const chip = document.createElement('button');
    chip.className = 'palette-chip' + (name === 'Neon' ? ' active' : '');
    chip.dataset.palette = name;
    const dotRow = document.createElement('span');
    dotRow.className = 'palette-dot-row';
    Object.values(palette).forEach(hex => {
      const dot = document.createElement('span');
      dot.className = 'palette-dot';
      dot.style.background = toHex(hex);
      dotRow.appendChild(dot);
    });
    chip.appendChild(dotRow);
    const label = document.createElement('span');
    label.className = 'palette-name';
    label.textContent = name;
    chip.appendChild(label);
    presetsEl.appendChild(chip);
  });

  ['color1', 'color2', 'color3', 'color4', 'color5'].forEach((key, i) => {
    const wrapper = document.createElement('label');
    wrapper.className = 'swatch-wrapper';

    const lbl = document.createElement('span');
    lbl.className = 'swatch-label';
    lbl.textContent = ['1', '2', '3', '4', '5+'][i];

    const input = document.createElement('input');
    input.type = 'color';
    input.className = 'color-swatch';
    input.id = `swatch-${key}`;
    input.value = toHex(main.colors[key]);

    wrapper.appendChild(lbl);
    wrapper.appendChild(input);
    swatchesEl.appendChild(wrapper);
  });

  presetsEl.addEventListener('click', (e) => {
    const chip = e.target.closest('.palette-chip');
    if (!chip) return;
    const palette = COLOR_PALETTES[chip.dataset.palette];
    main.colors = { ...palette };
    ['color1', 'color2', 'color3', 'color4', 'color5'].forEach(key => {
      document.getElementById(`swatch-${key}`).value = toHex(palette[key]);
    });
    presetsEl.querySelectorAll('.palette-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    main.grid.populateGrid(main.colors);
  });

  swatchesEl.addEventListener('input', (e) => {
    if (!e.target.matches('.color-swatch')) return;
    const key = e.target.id.replace('swatch-', '');
    main.colors[key] = parseInt(e.target.value.slice(1), 16);
    presetsEl.querySelectorAll('.palette-chip').forEach(c => c.classList.remove('active'));
    main.grid.populateGrid(main.colors);
  });
}

function initRulesetPanel(main) {
  const presetsEl = document.getElementById('ruleset-presets');
  const surviveEl = document.getElementById('survive-toggles');
  const bornEl = document.getElementById('born-toggles');

  const activeRuleset = {
    survive: new Set(RULESETS[DEFAULT_RULESET].survive),
    born: new Set(RULESETS[DEFAULT_RULESET].born),
  };

  Object.keys(RULESETS).forEach(name => {
    const chip = document.createElement('button');
    chip.className = 'ruleset-chip' + (name === DEFAULT_RULESET ? ' active' : '');
    chip.dataset.ruleset = name;
    chip.textContent = name;
    presetsEl.appendChild(chip);
  });

  function createToggles(container, type) {
    for (let i = 1; i <= 10; i++) {
      const btn = document.createElement('button');
      btn.className = 'toggle-btn' + (activeRuleset[type].has(i) ? ' active' : '');
      btn.dataset.value = i;
      btn.dataset.type = type;
      btn.textContent = i;
      container.appendChild(btn);
    }
  }
  createToggles(surviveEl, 'survive');
  createToggles(bornEl, 'born');

  function syncToggles() {
    surviveEl.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.classList.toggle('active', activeRuleset.survive.has(Number(btn.dataset.value)));
    });
    bornEl.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.classList.toggle('active', activeRuleset.born.has(Number(btn.dataset.value)));
    });
  }

  presetsEl.addEventListener('click', (e) => {
    const chip = e.target.closest('.ruleset-chip');
    if (!chip) return;
    const preset = RULESETS[chip.dataset.ruleset];
    activeRuleset.survive = new Set(preset.survive);
    activeRuleset.born = new Set(preset.born);
    main.grid.setRuleset(activeRuleset);
    presetsEl.querySelectorAll('.ruleset-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    syncToggles();
  });

  [surviveEl, bornEl].forEach(container => {
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.toggle-btn');
      if (!btn) return;
      const type = btn.dataset.type;
      const value = Number(btn.dataset.value);
      if (activeRuleset[type].has(value)) {
        activeRuleset[type].delete(value);
      } else {
        activeRuleset[type].add(value);
      }
      main.grid.setRuleset(activeRuleset);
      presetsEl.querySelectorAll('.ruleset-chip').forEach(c => c.classList.remove('active'));
      btn.classList.toggle('active');
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const options = {
    camera: {
      posX: 5,
      posY: 5,
      posZ: 10,
      fov: 75,
      aspect: 2,
      near: 0.1,
      far: 200,
    },
    cubeGeometry: {
      cubeWidth: 0.99,
      cubeHeight: 0.99,
      cubeDepth: 0.99,
    },
    worldSize: 25,
    cellSpacing: {
      spacingX: 0,
      spacingY: 0,
      spacingZ: 0,
    },
    colors: { ...COLOR_PALETTES['Neon'] },
    ruleset: {
      survive: new Set(RULESETS[DEFAULT_RULESET].survive),
      born: new Set(RULESETS[DEFAULT_RULESET].born),
    },
  };

  const main = new Main("visualizer-viewport", options);

  initColorPanel(main);
  initRulesetPanel(main);

  document.addEventListener("click", (event) => {
    if (event.target.matches("#play-button")) {
      main.play();
    }
    if (event.target.matches("#stop-button")) {
      main.stop();
    }
  });
});
```

- [ ] **Step 3: Verify build passes**

```bash
npm run build
```
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/scripts/main.js src/index.js
git commit -m "feat: thread ruleset through Main, wire color and ruleset panel logic"
```

---

### Task 4: Control bar HTML

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace the play-buttons div and add control bar**

In `index.html`, replace:

```html
  <div class="play-buttons">
    <button id="play-button">PLAY</button>
    <button id="stop-button">STOP</button>
    <button id="open-modal">INSTRUCTIONS</button>
    <ul>
      <li id="ticks-span">Ticks: 0</li>
      <li id="time-span">Time: 0</li>
    </ul>
  </div>
```

with:

```html
  <div class="control-bar">
    <div class="control-row">
      <button id="play-button">PLAY</button>
      <button id="stop-button">STOP</button>
      <button id="open-modal">INSTRUCTIONS</button>
      <span id="ticks-span">Ticks: 0 |</span>
      <span id="time-span"> Time: 0</span>
    </div>
    <div class="control-panels">
      <div class="panel" id="color-panel">
        <div class="panel-title">COLOR THEME</div>
        <div class="preset-row" id="color-presets"></div>
        <div class="swatch-row" id="color-swatches"></div>
      </div>
      <div class="panel" id="ruleset-panel">
        <div class="panel-title">RULESET</div>
        <div class="preset-row" id="ruleset-presets"></div>
        <div class="toggle-section">
          <span class="toggle-label">SURVIVE</span>
          <div class="toggle-row" id="survive-toggles"></div>
          <span class="toggle-label">BORN</span>
          <div class="toggle-row" id="born-toggles"></div>
        </div>
      </div>
    </div>
  </div>
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add control bar HTML structure"
```

---

### Task 5: Control bar CSS

**Files:**
- Modify: `src/styles/index.css`

- [ ] **Step 1: Remove old .play-buttons block and add control bar styles**

In `src/styles/index.css`, remove the entire `.play-buttons` block (lines starting at `.play-buttons {` through the closing `}`), then append these styles at the end of the file:

```css
/* ── Control Bar ─────────────────────────────── */

.control-bar {
  padding: 12px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.control-row button {
  font-family: 'BP Dots Square Bold';
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.15s;
}

.control-row button:hover {
  background: rgba(255, 71, 135, 0.25);
  border-color: #ff4787;
}

#ticks-span,
#time-span {
  color: #aaa;
  font-family: 'BP Dots Diamond Regular';
  font-size: 13px;
}

.control-panels {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.panel {
  flex: 1;
  min-width: 280px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.panel-title {
  font-family: 'BP Dots Square Bold';
  font-size: 11px;
  letter-spacing: 1.5px;
  color: #ff4787;
}

/* ── Preset rows (palette chips + ruleset chips) ─ */

.preset-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* ── Palette chips ───────────────────────────── */

.palette-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.palette-chip:hover {
  border-color: rgba(255, 71, 135, 0.5);
  background: rgba(255, 71, 135, 0.08);
}

.palette-chip.active {
  border-color: #ff4787;
  background: rgba(255, 71, 135, 0.15);
}

.palette-chip .palette-dot-row {
  display: flex;
  gap: 3px;
}

.palette-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.palette-name {
  font-family: 'BP Dots Diamond Regular';
  font-size: 9px;
  color: #aaa;
  white-space: nowrap;
}

/* ── Swatch row (color customization) ────────── */

.swatch-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.swatch-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  cursor: pointer;
}

.swatch-label {
  font-family: 'BP Dots Diamond Regular';
  font-size: 9px;
  color: #888;
}

.color-swatch {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  cursor: pointer;
  background: none;
}

.color-swatch:hover {
  border-color: #ff4787;
}

/* ── Ruleset chips ───────────────────────────── */

.ruleset-chip {
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  color: #aaa;
  font-family: 'BP Dots Diamond Regular';
  font-size: 11px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
  white-space: nowrap;
}

.ruleset-chip:hover {
  border-color: rgba(255, 71, 135, 0.5);
  color: #fff;
}

.ruleset-chip.active {
  border-color: #ff4787;
  background: rgba(255, 71, 135, 0.15);
  color: #ff4787;
}

/* ── Toggle buttons ──────────────────────────── */

.toggle-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.toggle-label {
  font-family: 'BP Dots Square Bold';
  font-size: 9px;
  letter-spacing: 1px;
  color: #666;
}

.toggle-row {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.toggle-btn {
  width: 26px;
  height: 26px;
  padding: 0;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  color: #555;
  font-family: 'BP Dots Diamond Regular';
  font-size: 11px;
  cursor: pointer;
  transition: border-color 0.12s, background 0.12s, color 0.12s;
}

.toggle-btn:hover {
  border-color: rgba(255, 71, 135, 0.4);
  color: #aaa;
}

.toggle-btn.active {
  border-color: #ff4787;
  background: rgba(255, 71, 135, 0.2);
  color: #ff4787;
}
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
```
Expected: 0 errors.

- [ ] **Step 3: Open index.html in browser and verify visually**

Open `index.html` directly in a browser (or run `npm start` for the dev server). Verify:
- Control bar appears below canvas with two panels side by side
- Color Theme panel shows 5 palette chips (Neon active) and 5 color swatches
- Ruleset panel shows 4 preset chips (3D Life active) and two rows of toggle buttons 1–10 (3 and 4 highlighted in survive, 3 highlighted in born)
- Clicking PLAY starts the simulation; cells appear with colors varying by neighbor count
- Clicking a color palette chip instantly recolors the simulation
- Adjusting an individual swatch updates color live
- Clicking a ruleset chip or toggling a number changes simulation behavior on next cycle

- [ ] **Step 4: Commit**

```bash
git add src/styles/index.css
git commit -m "feat: style control bar, panels, palette chips, swatches, and toggle buttons"
```

---

### Task 6: Cleanup — remove dead code from 3d_utils.js

**Files:**
- Modify: `src/scripts/grid/utils/3d_utils.js`

- [ ] **Step 1: Remove makeInstance function**

In `src/scripts/grid/utils/3d_utils.js`, delete the entire `makeInstance` export (lines 4–13):

```js
// DELETE THIS BLOCK:
export const makeInstance = (geometry, color, x, scene) => {
  const material = new THREE.MeshPhongMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  cube.position.x = x;
  return cube;
};
```

- [ ] **Step 2: Remove updateCube stub**

Also in `3d_utils.js`, delete line:

```js
// export const updateCube =
```

- [ ] **Step 3: Build and verify**

```bash
npm run build
```
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/scripts/grid/utils/3d_utils.js
git commit -m "chore: remove dead makeInstance function and updateCube stub"
```

---

### Task 7: Final integration commit

- [ ] **Step 1: Full build**

```bash
npm run build
```
Expected: 0 errors, output lists `main.js`, `main.css`, and font assets.

- [ ] **Step 2: Smoke test in browser**

Open `index.html`. Run through this checklist:

1. Page loads — canvas visible, control bar visible beneath it
2. PLAY button starts animation — alive cells appear, colored by neighbor density
3. STOP button pauses animation
4. Clicking **Matrix** palette — cells shift to green tones immediately
5. Changing a single color swatch — that neighbor tier changes color, preset chip deselects
6. Clicking **Conway** ruleset chip — survive/born toggles update to reflect `{2,3}` / `{3}`, simulation behavior changes within 1–2 ticks
7. Clicking **Dense** — toggles update to `{2,3,4,5}` / `{2,3}`, simulation becomes visibly more populated
8. Manually toggling a number — active preset chip deselects, simulation picks up the change
9. INSTRUCTIONS modal still opens and closes correctly

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: controls, color themes, pluggable rulesets, and neighbor-count coloring

- Control bar below canvas with Color Theme and Ruleset panels
- 5 palette presets + per-color customization via native color picker
- 4 named rulesets (3D Life, Conway, Sparse, Dense)
- Toggle-button rule editor for custom survive/born neighbor sets
- Alive cells colored by neighborCount using the 5-color palette
- Removed dead makeInstance and updateCube stub from 3d_utils.js

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```
