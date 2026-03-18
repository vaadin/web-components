import { AuraControl } from './aura-abstract-control.js';

function parseLightDark(value) {
  if (!value) return null;
  const source = String(value).trim();
  if (!/^light-dark\s*\(/iu.test(source) || !source.endsWith(')')) return null;

  const inner = source.slice(source.indexOf('(') + 1, -1).trim();
  let depth = 0;
  let splitAt = -1;

  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (ch === '(') depth += 1;
    else if (ch === ')') depth = Math.max(0, depth - 1);
    else if (ch === ',' && depth === 0) {
      splitAt = i;
      break;
    }
  }

  if (splitAt === -1) return null;

  const light = inner.slice(0, splitAt).trim();
  const dark = inner.slice(splitAt + 1).trim();
  if (!light || !dark) return null;

  return { light, dark };
}

function resolveEffectiveScheme() {
  const cs = getComputedStyle(document.documentElement).getPropertyValue('color-scheme').toLowerCase();
  const hasLight = /\blight\b/u.test(cs);
  const hasDark = /\bdark\b/u.test(cs);
  if (hasLight && hasDark) {
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  if (hasDark) return 'dark';
  return 'light';
}

function clamp01(x) {
  return Math.min(1, Math.max(0, x));
}

function linToSrgb(u) {
  return u <= 0.0031308 ? 12.92 * u : 1.055 * u ** (1 / 2.4) - 0.055;
}

function oklabToRgbHex(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let b2 = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  r = clamp01(linToSrgb(r));
  g = clamp01(linToSrgb(g));
  b2 = clamp01(linToSrgb(b2));
  const toHex = (x) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b2)}`;
}

function angleToDeg(token) {
  const source = String(token).trim().toLowerCase();
  if (source.endsWith('deg')) return parseFloat(source);
  if (source.endsWith('rad')) return (parseFloat(source) * 180) / Math.PI;
  if (source.endsWith('turn')) return parseFloat(source) * 360;
  return parseFloat(source);
}

function oklchStringToHex(value) {
  const match = String(value)
    .trim()
    .match(/^oklch\(\s*([-\d.]+%?)\s+([-\d.]+)\s+([-\d.]+(?:deg|rad|turn)?)\s*(?:\/\s*([-\d.]+%?))?\s*\)$/iu);
  if (!match) return null;
  const L = match[1].endsWith('%') ? parseFloat(match[1]) / 100 : parseFloat(match[1]);
  const C = parseFloat(match[2]);
  const h = angleToDeg(match[3]);
  if (![L, C, h].every(Number.isFinite)) return null;
  const hr = ((h % 360) * Math.PI) / 180;
  const a = C * Math.cos(hr);
  const b = C * Math.sin(hr);
  return oklabToRgbHex(L, a, b);
}

function oklabStringToHex(value) {
  const match = String(value)
    .trim()
    .match(/^oklab\(\s*([-\d.]+%?)\s+([-\d.]+)\s+([-\d.]+)\s*(?:\/\s*([-\d.]+%?))?\s*\)$/iu);
  if (!match) return null;
  const L = match[1].endsWith('%') ? parseFloat(match[1]) / 100 : parseFloat(match[1]);
  const a = parseFloat(match[2]);
  const b = parseFloat(match[3]);
  if (![L, a, b].every(Number.isFinite)) return null;
  return oklabToRgbHex(L, a, b);
}

export function toHexColor(cssColor, options = {}) {
  if (!cssColor) return null;
  const value = String(cssColor).trim();
  const scheme = options.scheme || resolveEffectiveScheme();

  const lightDark = parseLightDark(value);
  if (lightDark) {
    const chosen = scheme === 'dark' ? lightDark.dark : lightDark.light;
    return toHexColor(chosen, { scheme });
  }

  if (/^#([0-9a-f]{3})$/iu.test(value)) {
    return `#${value
      .slice(1)
      .split('')
      .map((c) => c + c)
      .join('')
      .toUpperCase()}`;
  }
  if (/^#([0-9a-f]{6})$/iu.test(value)) return value.toUpperCase();

  const rgbMatch =
    value.match(
      /^rgba?\(\s*([0-9]{1,3})\s*[, ]\s*([0-9]{1,3})\s*[, ]\s*([0-9]{1,3})(?:\s*[/,]\s*(\d*\.?\d+))?\s*\)$/iu,
    ) || value.match(/^rgba?\(\s*([0-9]{1,3})\s+([0-9]{1,3})\s+([0-9]{1,3})(?:\s*\/\s*(\d*\.?\d+))?\s*\)$/iu);
  if (rgbMatch) {
    const r = Math.max(0, Math.min(255, Number(rgbMatch[1])));
    const g = Math.max(0, Math.min(255, Number(rgbMatch[2])));
    const b = Math.max(0, Math.min(255, Number(rgbMatch[3])));
    return `#${[r, g, b]
      .map((n) => n.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()}`;
  }

  const hslMatch =
    value.match(
      /^hsla?\(\s*(-?\d*\.?\d+)(deg|rad|turn)?\s*[, ]\s*(\d*\.?\d+)%\s*[, ]\s*(\d*\.?\d+)%(?:\s*[/,]\s*(\d*\.?\d+%?))?\s*\)$/iu,
    ) ||
    value.match(
      /^hsla?\(\s*(-?\d*\.?\d+)(deg|rad|turn)?\s+(\d*\.?\d+)%\s+(\d*\.?\d+)%(?:\s*\/\s*(\d*\.?\d+%?))?\s*\)$/iu,
    );
  if (hslMatch) {
    let h = parseFloat(hslMatch[1]);
    const unit = (hslMatch[2] || 'deg').toLowerCase();
    const s = Math.max(0, Math.min(100, parseFloat(hslMatch[3]))) / 100;
    const l = Math.max(0, Math.min(100, parseFloat(hslMatch[4]))) / 100;
    if (unit === 'rad') h = (h * 180) / Math.PI;
    else if (unit === 'turn') h *= 360;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = (((h % 360) + 360) % 360) / 60;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    let r1 = 0;
    let g1 = 0;
    let b1 = 0;
    if (hp >= 0 && hp < 1) [r1, g1, b1] = [c, x, 0];
    else if (hp >= 1 && hp < 2) [r1, g1, b1] = [x, c, 0];
    else if (hp >= 2 && hp < 3) [r1, g1, b1] = [0, c, x];
    else if (hp >= 3 && hp < 4) [r1, g1, b1] = [0, x, c];
    else if (hp >= 4 && hp < 5) [r1, g1, b1] = [x, 0, c];
    else if (hp >= 5 && hp < 6) [r1, g1, b1] = [c, 0, x];
    const m = l - c / 2;
    const r = Math.round((r1 + m) * 255);
    const g = Math.round((g1 + m) * 255);
    const b = Math.round((b1 + m) * 255);
    return `#${[r, g, b]
      .map((n) => n.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()}`;
  }

  if (/^oklch\(/iu.test(value)) {
    const hex = oklchStringToHex(value);
    if (hex) return hex;
  }
  if (/^oklab\(/iu.test(value)) {
    const hex = oklabStringToHex(value);
    if (hex) return hex;
  }

  const probe = document.createElement('span');
  probe.style.color = value;
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).color.trim();
  document.body.removeChild(probe);

  const resolvedRgb = resolved.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/iu);
  if (resolvedRgb) {
    const r = Number(resolvedRgb[1]);
    const g = Number(resolvedRgb[2]);
    const b = Number(resolvedRgb[3]);
    return `#${[r, g, b]
      .map((n) => n.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()}`;
  }
  if (/^oklch\(/iu.test(resolved)) {
    const hex = oklchStringToHex(resolved);
    if (hex) return hex;
  }
  if (/^oklab\(/iu.test(resolved)) {
    const hex = oklabStringToHex(resolved);
    if (hex) return hex;
  }

  return null;
}

class AuraColorControl extends AuraControl {
  static get is() {
    return 'aura-color-control';
  }

  static get observedAttributes() {
    return ['property', 'label'];
  }

  #input;
  #output;
  #labelEl;
  #resetBtn;
  #prop = '--accent-color';

  constructor() {
    super();
    this.initControl({
      label: 'Color',
      content: '<input type="color" /><output>#000000</output>',
    });
    this.#input = this.querySelector('input[type="color"]');
    this.#output = this.querySelector('output');
    this.#labelEl = this.labelElement;
    this.#resetBtn = this.resetButton;
  }

  attributeChangedCallback(name, _old, val) {
    if (name === 'property') {
      this.#prop = (val && val.trim()) || '--accent-color';
      if (this.isConnected) this.#initialize();
    }
    if (name === 'label') {
      this.#labelEl.textContent = val || 'Color';
    }
  }

  connectedCallback() {
    if (this.hasAttribute('label')) {
      this.#labelEl.textContent = this.getAttribute('label');
    } else {
      this.#labelEl.textContent = `${this.#prop.replace(/^--/u, '')} color`;
    }
    if (this.hasAttribute('property')) {
      this.#prop = this.getAttribute('property').trim();
    }
    this.#initialize();

    // User change → set var + persist
    this.#input.addEventListener('input', () => {
      const hex = this.#normalizeHex(this.#input.value) || '#000000';
      this.#setUI(hex);
      this.#setVar(hex); // set only on user action
      this.#persist(hex);
      this.#emit(hex);
      this.#updateComputedReadout();
    });

    // Reset → clear storage, remove inline var, UI from computed (no override)
    this.#resetBtn.addEventListener('click', () => {
      localStorage.removeItem(this.#storageKey());
      document.documentElement.style.removeProperty(this.#prop);
      const computedHex = this.#getComputedHex() || '#000000';
      this.#setUI(computedHex);
      this.#emit(computedHex, { source: 'reset' });
      this.#updateComputedReadout();
    });

    // Demo readout
    this.#updateComputedReadout();
  }

  // ----- Init: storage OR computed ----------------------------------------
  #initialize() {
    // From storage → set var + UI
    const stored = localStorage.getItem(this.#storageKey());
    if (stored) {
      const hex = this.#toHex(stored) || this.#getComputedHex() || '#000000';
      this.#setUI(hex);
      this.#setVar(hex); // set because it came from storage
      this.#persist(hex); // normalize storage to hex
      this.#emit(hex, { source: 'storage' });
      this.#updateComputedReadout();
      return;
    }

    // From computed CSS → UI only
    const hex = this.#getComputedHex() || '#000000';
    this.#setUI(hex);
    this.#updateComputedReadout();
  }

  // ----- UI helpers --------------------------------------------------------
  #setUI(hex) {
    const norm = this.#normalizeHex(hex) || '#000000';
    this.#input.value = norm;
    this.#output.textContent = norm;
  }

  #persist(hex) {
    localStorage.setItem(this.#storageKey(), this.#normalizeHex(hex));
  }

  #emit(hex, extra = {}) {
    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: { property: this.#prop, value: this.#normalizeHex(hex), ...extra },
      }),
    );
  }

  #setVar(hex) {
    document.documentElement.style.setProperty(this.#prop, this.#normalizeHex(hex));
  }

  #storageKey() {
    return `aura-color:${this.#prop}`;
  }

  #updateComputedReadout() {
    const ro = document.getElementById('computed-readout');
    if (!ro) return;
    ro.textContent = getComputedStyle(document.documentElement).getPropertyValue(this.#prop).trim() || '(unset)';
  }

  // ----- Color parsing / normalization ------------------------------------
  #normalizeHex(h) {
    const v = String(h || '').trim();
    if (/^#([0-9a-f]{3})$/iu.test(v)) {
      return `#${v
        .slice(1)
        .split('')
        .map((c) => c + c)
        .join('')
        .toUpperCase()}`;
    }
    if (/^#([0-9a-f]{6})$/iu.test(v)) return v.toUpperCase();
    return null;
  }

  #getComputedHex() {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(this.#prop).trim();
    if (!raw) return null;

    const ld = parseLightDark(raw);
    if (ld) {
      const scheme = resolveEffectiveScheme();
      const chosen = scheme === 'dark' ? ld.dark : ld.light;
      return this.#toHex(chosen);
    }
    return this.#toHex(raw);
  }

  // Convert any supported CSS color → #RRGGBB
  #toHex(cssColor) {
    return toHexColor(cssColor, { scheme: resolveEffectiveScheme() });
  }
}

customElements.define(AuraColorControl.is, AuraColorControl);
