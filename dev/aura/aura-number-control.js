class AuraNumberControl extends HTMLElement {
  static get is() {
    return 'aura-number-control';
  }
  static get observedAttributes() {
    return ['property', 'min', 'max', 'step', 'label'];
  }

  #root;
  #input;
  #output;
  #resetBtn;
  #prop = '--numeric';
  #min = 0;
  #max = 100;
  #step = 1;
  #default;
  #initialComputed = null;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
            <style>
              :host { display: block; }
              .control {
                display: grid;
                gap: .2rem;
              }
              label { font-weight: 600; }
              .row { display: flex; align-items: center; gap: .75rem; }
              input[type="range"] { flex: 1; }
              output {
                min-width: 2ch;
                text-align: right;
                font-variant-numeric: tabular-nums;
              }

              .reset {
                background: transparent;
                border: 0;
              }

              .reset:not(:hover, :focus-visible) {
                opacity: 0.6;
              }

              .reset::before {
                content: "";
                width: 1lh;
                height: 1lh;
                mask-image: var(--lucide-icon-rotate-ccw);
                background: currentColor;
              }
            </style>
            <div class="control" part="control">
              <label id="lbl" for="slider">Numeric value</label>
              <div class="row">
                <input id="slider" type="range" />
                <output id="val" for="slider">0</output>
                <vaadin-button class="reset" aria-label="reset"></vaadin-button>
              </div>
            </div>
          `;
    this.#root = shadow;
    this.#input = shadow.getElementById('slider');
    this.#output = shadow.getElementById('val');
    this.#resetBtn = shadow.querySelector('vaadin-button.reset');
  }

  attributeChangedCallback(name, _old, val) {
    switch (name) {
      case 'property':
        this.#prop = val?.trim() || '--numeric';
        break;
      case 'min':
        this.#min = this.#toNumber(val, 0);
        break;
      case 'max':
        this.#max = this.#toNumber(val, 100);
        break;
      case 'step':
        this.#step = this.#toNumber(val, 1);
        break;
      case 'default':
        this.#default = this.#toNumber(val, -1);
        break;
      case 'label':
        this.#root.getElementById('lbl').textContent = val || 'Numeric value';
        break;
      default:
        break;
    }
    // if (this.isConnected) this.#configureAndInit();
  }

  connectedCallback() {
    // Defaults from attributes if present
    if (this.hasAttribute('property')) this.#prop = this.getAttribute('property').trim();
    if (this.hasAttribute('min')) this.#min = this.#toNumber(this.getAttribute('min'), this.#min);
    if (this.hasAttribute('max')) this.#max = this.#toNumber(this.getAttribute('max'), this.#max);
    if (this.hasAttribute('step')) this.#step = this.#toNumber(this.getAttribute('step'), this.#step);
    if (this.hasAttribute('default')) this.#default = this.#toNumber(this.getAttribute('default'), this.#default);
    if (this.hasAttribute('label')) {
      this.#root.getElementById('lbl').textContent = this.getAttribute('label');
    } else {
      this.#root.getElementById('lbl').textContent = this.#prop;
    }

    this.#configureAndInit();

    this.#input.addEventListener('input', () => {
      const v = Number(this.#input.value);
      this.#setValue(v);
    });

    this.#resetBtn.addEventListener('click', () => {
      if (this.#initialComputed != null) {
        this.#setValue(this.#initialComputed, { persist: null });
      } else {
        this.#initializeValue(); // recompute fallback
      }
    });
  }

  // ----- Internals -----

  #configureAndInit() {
    // Ensure min <= max; swap if needed
    if (this.#min > this.#max) [this.#min, this.#max] = [this.#max, this.#min];
    // Configure input element
    this.#input.min = String(this.#min);
    this.#input.max = String(this.#max);
    this.#input.step = String(this.#step > 0 ? this.#step : 1);
    this.#input.value = String(this.#default > 0 ? this.#default : undefined);
    // Initialize value from storage or computed
    this.#initializeValue();
  }

  #storageKey() {
    return `aura-number:${this.#prop}`;
  }

  #initializeValue() {
    // 1) Try localStorage
    const stored = localStorage.getItem(this.#storageKey());
    if (stored != null && stored !== '') {
      const num = this.#clamp(this.#snap(Number(stored)));
      this.#initialComputed = this.#getComputedNumber(); // track for reset
      this.#setValue(num, { persist: false });
      return;
    }

    // 2) Fallback to computed style
    const computed = this.#getComputedNumber();
    const initial = computed != null ? computed : this.#clamp(this.#snap((this.#min + this.#max) / 2));
    this.#initialComputed = computed ?? initial;
    this.#setValue(initial, { persist: false });
  }

  #getComputedNumber() {
    // Read computed value for the property on :root and parseFloat
    const raw = getComputedStyle(document.documentElement).getPropertyValue(this.#prop).trim();
    if (!raw) return null;
    const n = parseFloat(raw);
    return Number.isFinite(n) ? this.#clamp(this.#snap(n)) : null;
  }

  #clamp(v) {
    return Math.min(this.#max, Math.max(this.#min, v));
  }

  #snap(v) {
    // Snap to the nearest multiple of step from min
    const step = this.#step > 0 ? this.#step : 1;
    const k = Math.round((v - this.#min) / step);
    const snapped = this.#min + k * step;
    // Avoid floating point noise
    const decimals = this.#decimals(step);
    return Number(snapped.toFixed(decimals));
  }

  #decimals(n) {
    const s = String(n);
    if (s.includes('e-')) return parseInt(s.split('e-')[1], 10) || 0;
    const i = s.indexOf('.');
    return i === -1 ? 0 : s.length - i - 1;
  }

  #toNumber(val, fallback) {
    const n = Number(val);
    return Number.isFinite(n) ? n : fallback;
  }

  #setValue(v, opts = { persist: true }) {
    const value = this.#clamp(this.#snap(Number(v)));
    this.#input.value = String(value);
    this.#output.textContent = String(value);
    document.documentElement.style.setProperty(this.#prop, String(value));
    if (opts.persist) {
      localStorage.setItem(this.#storageKey(), String(value));
    } else if (opts.persist === null) {
      document.documentElement.style.removeProperty(this.#prop);
      localStorage.removeItem(this.#storageKey());
    }
    this.dispatchEvent(new CustomEvent('value-change', { detail: { property: this.#prop, value } }));
  }
}

customElements.define(AuraNumberControl.is, AuraNumberControl);
