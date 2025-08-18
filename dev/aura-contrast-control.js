class AuraContrastControl extends HTMLElement {
  static get is() {
    return 'aura-contrast-control';
  }
  static get storageKey() {
    return 'aura-contrast';
  }

  #root;
  #input;
  #output;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
            <style>
              :host { display: block; }
              .control {
                display: grid;
                gap: .5rem;
                padding: 1rem 1.25rem;
                border-radius: 14px;
                background: color-mix(in oklab, white 3%, transparent);
                border: 1px solid color-mix(in oklab, white 15%, transparent);
              }
              label { font-weight: 600; }
              .row { display: flex; align-items: center; gap: .75rem; }
              input[type="range"] { flex: 1; }
              output {
                min-width: 3ch;
                text-align: right;
                font-variant-numeric: tabular-nums;
              }
              button.reset { justify-self: start; border-radius: 10px; padding: .4rem .6rem; }
            </style>
            <div class="control" part="control">
              <label for="slider">--aura-contrast</label>
              <div class="row">
                <input id="slider" type="range" min="-1" max="2" step="0.1" />
                <output id="val" for="slider">1.5</output>
              </div>
              <button class="reset" type="button">Reset</button>
            </div>
          `;
    this.#root = shadow;
    this.#input = shadow.getElementById('slider');
    this.#output = shadow.getElementById('val');
  }

  connectedCallback() {
    // Load value from storage or computed style; default to 1.5
    const stored = localStorage.getItem(AuraContrastControl.storageKey);
    const fromStorage = stored != null ? parseFloat(stored) : NaN;
    const computed = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--aura-contrast'));
    const initial = this.#clamp(isFinite(fromStorage) ? fromStorage : isFinite(computed) ? computed : 1);

    this.#setValue(initial, { persist: false });

    // Wire up events
    this.#input.addEventListener('input', () => {
      const v = parseFloat(this.#input.value);
      this.#setValue(v);
    });

    this.#root.querySelector('button.reset')?.addEventListener('click', () => {
      this.#setValue(1.5);
    });
  }

  #clamp(v) {
    return Math.min(2, Math.max(1, Math.round(v * 10) / 10));
  }

  #setValue(v, opts = { persist: true }) {
    const value = this.#clamp(v);
    this.#input.value = String(value);
    this.#output.textContent = value.toFixed(1);
    document.documentElement.style.setProperty('--aura-contrast', String(value));
    if (opts.persist) {
      localStorage.setItem(AuraContrastControl.storageKey, String(value));
    }
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value } }));
  }
}

customElements.define(AuraContrastControl.is, AuraContrastControl);
