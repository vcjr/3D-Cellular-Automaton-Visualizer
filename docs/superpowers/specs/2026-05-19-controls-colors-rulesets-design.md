# Design: Controls, Color Themes & Pluggable Rulesets

**Date:** 2026-05-19  
**Status:** Approved

---

## Summary

Implement three long-planned but never-built features:

1. A control bar below the canvas with Color Theme and Ruleset panels
2. Neighbor-count-based cell coloring using the existing 5-color system
3. A pluggable ruleset architecture replacing hardcoded survive/born logic

---

## Layout

A horizontal control bar sits below the canvas, beneath the existing play/stop buttons. It contains two panels side by side — Color Theme (left) and Ruleset (right) — plus the tick/time counters relocated from their current standalone position.

No changes to the canvas, heading, modal, social links, or resize behavior.

---

## Feature 1: Neighbor-Count Cell Coloring

### What changes

`MasterGrid.populateGrid()` currently renders all alive cells with a single flat color (`color5`). It will be updated to color each alive cell based on its `neighborCount` value:

| neighborCount | color used |
|---|---|
| 1 | color1 |
| 2 | color2 |
| 3 | color3 |
| 4 | color4 |
| 5+ (or 0) | color5 |

`populateGrid` will call `this.cellMesh.setColorAt(idx, threeColor)` per alive cell and set `this.cellMesh.instanceColor.needsUpdate = true` after the loop. The `InstancedMesh` must be constructed with a count argument so Three.js allocates the `instanceColor` buffer — this is already the case.

Dead cells are hidden (scale = 0 matrix), so their color is irrelevant.

### Color resolution

A helper `colorForNeighborCount(count, colors)` maps a neighbor count to the correct hex from the colors object. Called inside `populateGrid` per alive cell.

---

## Feature 2: Color Theme Panel

### UI structure

Located in the left half of the control bar.

**Preset row** — 5 named palette chips. Each chip shows 5 small color swatches. Clicking loads all 5 colors at once.

| Name | color1 | color2 | color3 | color4 | color5 |
|---|---|---|---|---|---|
| Neon (default) | `#00faff` | `#9936b7` | `#aa65bf` | `#ad5071` | `#ff4787` |
| Matrix | `#00ff88` | `#00cc66` | `#009944` | `#006622` | `#003311` |
| Fire | `#ff6b35` | `#ff8c42` | `#ffb347` | `#ffd700` | `#fff176` |
| Ocean | `#4fc3f7` | `#29b6f6` | `#039be5` | `#0277bd` | `#01579b` |
| Void | `#e040fb` | `#ab47bc` | `#7b1fa2` | `#4a148c` | `#1a0030` |

**Customize row** — 5 `<input type="color">` elements styled as color swatches, labeled 1–5+. Changing any swatch updates the live color immediately. Loading a preset fills these inputs.

### State

Colors live in `src/index.js` as the existing `options.colors` object. The control bar reads and writes this object directly. On change, it calls `main.grid.populateGrid(currentColors)` to apply immediately (no cycle needed).

---

## Feature 3: Pluggable Rulesets

### Data layer — `src/scripts/grid/automatons/automaton.js`

Rebuilt as a plain data module:

```js
export const RULESETS = {
  '3D Life': { survive: new Set([3, 4]), born: new Set([3]) },
  'Conway':  { survive: new Set([2, 3]), born: new Set([3]) },
  'Sparse':  { survive: new Set([4, 5]), born: new Set([4]) },
  'Dense':   { survive: new Set([2, 3, 4, 5]), born: new Set([2, 3]) },
};

export const DEFAULT_RULESET = '3D Life';
```

### MasterGrid changes

`MasterGrid` gains a `setRuleset(ruleset)` method accepting `{ survive: Set, born: Set }`.

`cycle()` replaces its hardcoded survive/born conditions with:

```js
staysAlive = cell.alive
  ? this.ruleset.survive.has(aliveNeighbors)
  : this.ruleset.born.has(aliveNeighbors);
```

Constructor receives the initial ruleset and stores it as `this.ruleset`.

### UI structure

Located in the right half of the control bar.

**Preset chips** — four pill buttons (3D Life, Conway, Sparse, Dense). Clicking one loads its survive/born sets into the toggle buttons and calls `main.grid.setRuleset(ruleset)`.

**Toggle buttons** — two rows of numbered buttons 1–10:
- Row 1: **SURVIVE** — buttons toggle membership in the survive set
- Row 2: **BORN** — buttons toggle membership in the born set

Active numbers are highlighted. Toggling a button immediately updates the live ruleset. Editing toggles manually deselects any active preset chip.

---

## Cleanup

Remove from `src/scripts/grid/utils/3d_utils.js`:
- `makeInstance` function (never imported anywhere)
- `// export const updateCube =` stub

---

## Files Changed

| File | Change |
|---|---|
| `src/scripts/grid/automatons/automaton.js` | New — ruleset data module |
| `src/scripts/grid/grid-master.js` | Add `setRuleset()`, update `cycle()`, update `populateGrid()` for per-cell color |
| `src/scripts/grid/utils/3d_utils.js` | Remove `makeInstance` and `updateCube` stub |
| `src/index.js` | Pass ruleset to MasterGrid constructor, wire control bar events |
| `index.html` | Add control bar markup |
| `src/styles/index.css` | Style control bar, panels, chips, toggles, swatches |

---

## Out of Scope

- Speed/tick rate control
- World size control
- Saving/loading custom rulesets
- Mobile layout
