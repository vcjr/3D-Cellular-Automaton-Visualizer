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

  const sizeInput = document.getElementById("size-input");
  let pendingSize = options.worldSize;

  sizeInput.addEventListener("input", () => {
    const val = parseInt(sizeInput.value, 10);
    if (val >= 5 && val <= 100) {
      pendingSize = val;
      sizeInput.classList.toggle("pending", pendingSize !== main.worldSize);
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target.matches("#play-button")) {
      main.play();
    }
    if (event.target.matches("#stop-button")) {
      main.stop();
    }
    if (event.target.matches("#reset-button")) {
      main.reset(pendingSize);
      sizeInput.classList.remove("pending");
    }
  });
});
