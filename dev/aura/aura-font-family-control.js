class AuraFontFamilyControl extends HTMLElement {
  static get is() {
    return 'aura-font-family-control';
  }
  static get observedAttributes() {
    return ['property', 'label'];
  }

  #prop = '--aura-font-family';
  #select;
  #labelEl;
  #resetBtn;

  // UI options → mapping variables
  #opts = [
    { label: 'Instrument Sans', varName: '--aura-font-family-instrument-sans' },
    { label: 'Inter', varName: '--aura-font-family-inter' },
    { label: 'System', varName: '--aura-font-family-system' },
  ];

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
          <style>
            :host { display: block; }
            .control {
              display: grid;
              gap: .6rem;
              padding: 1rem 1.25rem;
              max-width: 560px;
            }
            label { font-weight: 600; }
            .row { display: flex; align-items: center; gap: .75rem; flex-wrap: wrap; }
            select { padding: .4rem .6rem; border-radius: 10px; }
            #reset {
              background: transparent;
              border: 0;
            }

            #reset:not(:hover, :focus-visible) {
              opacity: 0.6;
            }

            #reset::before {
              content: "";
              width: 1lh;
              height: 1lh;
              mask-image: var(--lucide-icon-rotate-ccw);
              background: currentColor;
            }
          </style>
          <div class="control">
            <label id="hdr">Font family</label>
            <div class="row">
              <select id="sel" aria-labelledby="hdr"></select>
              <vaadin-button id="reset" type="button" aria-label="reset"></vaadin-button>
            </div>
          </div>
        `;
    this.#select = shadow.getElementById('sel');
    this.#labelEl = shadow.getElementById('hdr');
    this.#resetBtn = shadow.getElementById('reset');
  }

  attributeChangedCallback(name, _old, val) {
    if (name === 'property') {
      this.#prop = (val && val.trim()) || this.#prop;
      if (this.isConnected) this.#initialize();
    } else if (name === 'label') {
      this.#labelEl.textContent = val || 'Font family';
    }
  }

  connectedCallback() {
    // Set label if provided
    if (this.hasAttribute('label')) {
      this.#labelEl.textContent = this.getAttribute('label');
    }

    // Render options (value = "var(--...)" token)
    this.#select.innerHTML = '';
    this.#opts.forEach((opt) => {
      const el = document.createElement('option');
      el.textContent = opt.label;
      el.value = `var(${opt.varName})`;
      this.#select.appendChild(el);
    });

    this.#initialize();

    // User change → set var + persist
    this.#select.addEventListener('change', () => {
      const token = this.#select.value; // e.g., var(--aura-font-family-inter)
      this.#setVar(token);
      this.#persist(token);
      this.#emit(token, { source: 'user' });
      this.#updateComputedReadout();
    });

    // Reset → clear storage, remove inline override, reselect by stylesheet
    this.#resetBtn.addEventListener('click', () => {
      localStorage.removeItem(this.#storageKey());
      document.documentElement.style.removeProperty(this.#prop);
      this.#selectByComputed(); // UI only
      this.#emit(this.#select.value, { source: 'reset' });
      this.#updateComputedReadout();
    });

    this.#updateComputedReadout();
  }

  // ----- Initialization -----------------------------------------------------
  #initialize() {
    // 1) If stored, apply it (override + UI)
    const stored = localStorage.getItem(this.#storageKey());
    if (stored) {
      const token = this.#normalizeToken(stored) || `var(${this.#opts[2].varName})`;
      this.#select.value = token;
      this.#setVar(token); // apply because it came from storage
      this.#persist(token); // normalize storage
      this.#emit(token, { source: 'storage' });
      return;
    }

    // 2) Otherwise, select based on stylesheet-computed value (UI only)
    this.#selectByComputed();
  }

  #selectByComputed() {
    const computed = this.#normalizeToken(getComputedStyle(document.documentElement).getPropertyValue(this.#prop));
    // Try matching against reference tokens or resolved values
    let matched = null;

    for (const opt of this.#opts) {
      const refToken = this.#normalizeToken(`var(${opt.varName})`);
      if (computed && computed === refToken) {
        matched = refToken;
        break;
      }

      const resolved = this.#normalizeToken(getComputedStyle(document.documentElement).getPropertyValue(opt.varName));
      if (computed && resolved && computed === resolved) {
        matched = refToken;
        break;
      }
    }

    this.#select.value = matched ?? this.#normalizeToken(`var(${this.#opts[2].varName})`); // default System
  }

  // ----- Actions ------------------------------------------------------------
  #setVar(token) {
    // Set the custom property to the chosen var(--...) token
    document.documentElement.style.setProperty(this.#prop, token);
  }

  #persist(token) {
    localStorage.setItem(this.#storageKey(), this.#normalizeToken(token));
  }

  #emit(token, extra = {}) {
    const label =
      this.#opts.find((o) => this.#normalizeToken(`var(${o.varName})`) === this.#normalizeToken(token))?.label ??
      'Custom';
    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: { property: this.#prop, token, label, ...extra },
      }),
    );
  }

  // ----- Helpers ------------------------------------------------------------
  #storageKey() {
    return `aura:font-family:${this.#prop}`;
  }

  #normalizeToken(s) {
    // Trim, collapse internal whitespace, standardize commas. Return null for empty.
    if (s == null) return null;
    const t = String(s).trim();
    if (!t) return null;
    return t
      .replace(/\s*,\s*/gu, ', ') // normalize comma spacing
      .replace(/\s+/gu, ' ');
  }

  #updateComputedReadout() {
    const ro = document.getElementById('ff-readout');
    if (!ro) return;
    const v = getComputedStyle(document.documentElement).getPropertyValue(this.#prop).trim();
    ro.textContent = v || '(unset)';
  }
}

customElements.define(AuraFontFamilyControl.is, AuraFontFamilyControl);
