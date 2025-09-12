import { AuraControl } from './aura-abstract-control.js';

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
    const shadow = this.shadowRoot;
    shadow.innerHTML = `
      <style>
        .control {
          gap: .2rem;
        }

        .row {
          display: flex;
          align-items: center;
          gap: .75rem;
        }

        input[type="color"] {
          width: 3rem;
          height: 2rem;
          border: none;
          background: transparent;
        }

        output {
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        }
      </style>
      <div class="control" part="control">
        <label id="lbl" for="picker">Color</label>
        <div class="row">
          <input id="picker" type="color" />
          <output id="val" for="picker">#000000</output>
          <vaadin-button id="reset" aria-label="reset"></vaadin-button>
        </div>
      </div>
    `;
    this.#input = shadow.getElementById('picker');
    this.#output = shadow.getElementById('val');
    this.#labelEl = shadow.getElementById('lbl');
    this.#resetBtn = shadow.getElementById('reset');
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

    const ld = this.#parseLightDark(raw);
    if (ld) {
      const scheme = this.#effectiveScheme();
      const chosen = scheme === 'dark' ? ld.dark : ld.light;
      return this.#toHex(chosen);
    }
    return this.#toHex(raw);
  }

  // Convert any supported CSS color → #RRGGBB
  #toHex(cssColor) {
    if (!cssColor) return null;
    const value = String(cssColor).trim();

    // light-dark(...)
    const ld = this.#parseLightDark(value);
    if (ld) {
      const scheme = this.#effectiveScheme();
      const chosen = scheme === 'dark' ? ld.dark : ld.light;
      return this.#toHex(chosen); // recurse
    }

    // Hex
    if (/^#([0-9a-f]{3})$/iu.test(value)) {
      return `#${value
        .slice(1)
        .split('')
        .map((c) => c + c)
        .join('')
        .toUpperCase()}`;
    }
    if (/^#([0-9a-f]{6})$/iu.test(value)) return value.toUpperCase();

    // rgb/rgba() (comma- or space-separated, optional slash alpha)
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

    // hsl/hsla()
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
      let r1 = 0,
        g1 = 0,
        b1 = 0;
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

    // Direct oklch()/oklab()
    if (/^oklch\(/iu.test(value)) {
      const hex = this.#oklchStringToHex(value);
      if (hex) return hex;
    }
    if (/^oklab\(/iu.test(value)) {
      const hex = this.#oklabStringToHex(value);
      if (hex) return hex;
    }

    // Probe the browser (may return rgb() OR oklch()/oklab())
    const probe = document.createElement('span');
    probe.style.color = value;
    document.body.appendChild(probe);
    const resolved = getComputedStyle(probe).color.trim();
    document.body.removeChild(probe);

    const rr = resolved.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/iu);
    if (rr) {
      const r = Number(rr[1]),
        g = Number(rr[2]),
        b = Number(rr[3]);
      return `#${[r, g, b]
        .map((n) => n.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase()}`;
    }
    if (/^oklch\(/iu.test(resolved)) {
      const hex = this.#oklchStringToHex(resolved);
      if (hex) return hex;
    }
    if (/^oklab\(/iu.test(resolved)) {
      const hex = this.#oklabStringToHex(resolved);
      if (hex) return hex;
    }

    return null;
  }

  // ----- light-dark() + scheme helpers ------------------------------------
  #parseLightDark(v) {
    if (!v) return null;
    const s = String(v).trim();
    if (!/^light-dark\s*\(/iu.test(s) || !s.endsWith(')')) return null;
    const inner = s.slice(s.indexOf('(') + 1, -1).trim();
    let depth = 0,
      splitAt = -1;
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
    const left = inner.slice(0, splitAt).trim();
    const right = inner.slice(splitAt + 1).trim();
    if (!left || !right) return null;
    return { light: left, dark: right };
  }

  #effectiveScheme() {
    const cs = getComputedStyle(document.documentElement).getPropertyValue('color-scheme').toLowerCase();
    const hasLight = /\blight\b/u.test(cs);
    const hasDark = /\bdark\b/u.test(cs);
    if (hasLight && hasDark) {
      return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if (hasDark) return 'dark';
    return 'light';
  }

  // ----- OKLCH/OKLAB → HEX ------------------------------------------------
  #clamp01(x) {
    return Math.min(1, Math.max(0, x));
  }
  #linToSrgb(u) {
    return u <= 0.0031308 ? 12.92 * u : 1.055 * u ** (1 / 2.4) - 0.055;
  }
  #oklabToRgbHex(L, a, b) {
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.291485548 * b;
    const l = l_ * l_ * l_,
      m = m_ * m_ * m_,
      s = s_ * s_ * s_;
    let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    let b2 = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
    r = this.#clamp01(this.#linToSrgb(r));
    g = this.#clamp01(this.#linToSrgb(g));
    b2 = this.#clamp01(this.#linToSrgb(b2));
    const toHex = (x) =>
      Math.round(x * 255)
        .toString(16)
        .padStart(2, '0')
        .toUpperCase();
    return `#${toHex(r)}${toHex(g)}${toHex(b2)}`;
  }
  #angleToDeg(token) {
    const s = String(token).trim().toLowerCase();
    if (s.endsWith('deg')) return parseFloat(s);
    if (s.endsWith('rad')) return (parseFloat(s) * 180) / Math.PI;
    if (s.endsWith('turn')) return parseFloat(s) * 360;
    return parseFloat(s);
  }
  #oklchStringToHex(v) {
    const m = String(v)
      .trim()
      .match(/^oklch\(\s*([-\d.]+%?)\s+([-\d.]+)\s+([-\d.]+(?:deg|rad|turn)?)\s*(?:\/\s*([-\d.]+%?))?\s*\)$/iu);
    if (!m) return null;
    const L = m[1].endsWith('%') ? parseFloat(m[1]) / 100 : parseFloat(m[1]);
    const C = parseFloat(m[2]);
    const h = this.#angleToDeg(m[3]);
    if (![L, C, h].every(Number.isFinite)) return null;
    const hr = ((h % 360) * Math.PI) / 180;
    const a = C * Math.cos(hr),
      b = C * Math.sin(hr);
    return this.#oklabToRgbHex(L, a, b);
  }
  #oklabStringToHex(v) {
    const m = String(v)
      .trim()
      .match(/^oklab\(\s*([-\d.]+%?)\s+([-\d.]+)\s+([-\d.]+)\s*(?:\/\s*([-\d.]+%?))?\s*\)$/iu);
    if (!m) return null;
    const L = m[1].endsWith('%') ? parseFloat(m[1]) / 100 : parseFloat(m[1]);
    const a = parseFloat(m[2]),
      b = parseFloat(m[3]);
    if (![L, a, b].every(Number.isFinite)) return null;
    return this.#oklabToRgbHex(L, a, b);
  }
}

customElements.define(AuraColorControl.is, AuraColorControl);
