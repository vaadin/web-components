class AuraSchemeControl extends HTMLElement {
  static get is() {
    return 'aura-scheme-control';
  }
  static get observedAttributes() {
    return ['property', 'label'];
  }

  #prop = '--aura-color-scheme';
  #group;
  #reset;
  #labelEl;
  #values = ['light', 'dark', 'light dark']; // UI: Light, Dark, Auto

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

              .segmented {
                display: inline-grid;
                grid-auto-flow: column;
                gap: 0;
                border: 1px solid var(--vaadin-border-color);
                border-radius: 10px;
                overflow: hidden;
              }
              .segmented input {
                position: absolute;
                opacity: 0;
                pointer-events: none;
              }
              .segmented label {
                padding: var(--vaadin-padding-xs) var(--vaadin-padding-m);
                cursor: pointer;
                user-select: none;
                display: inline-block;
                border-right: 1px solid var(--vaadin-border-color-subtle);
              }
              .segmented label:last-of-type { border-right: none; }

              /* Selected state */
              .segmented input:checked + label {
                background: var(--vaadin-border-color-subtle);
                color: var(--vaadin-color);
                background-clip: padding-box;
                font-weight: 600;
              }

              .row { display: flex; align-items: center; gap: .75rem; flex-wrap: wrap; }
              .sr-only { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
              label.header { font-weight: 600; }

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
              <label class="header" id="hdr">Color scheme</label>
              <div class="row">
                <div class="segmented" role="radiogroup" aria-labelledby="hdr" id="group">
                  <!-- Radios will be populated in connectedCallback -->
                </div>
                <vaadin-button id="reset" type="button" aria-label="reset"></vaadin-button>
              </div>
            </div>
          `;
    this.#group = shadow.getElementById('group');
    this.#reset = shadow.getElementById('reset');
    this.#labelEl = shadow.getElementById('hdr');
  }

  attributeChangedCallback(name, _old, val) {
    if (name === 'property') {
      this.#prop = (val && val.trim()) || this.#prop;
      if (this.isConnected) this.#initialize();
    } else if (name === 'label') {
      this.#labelEl.textContent = val || 'Color scheme';
    }
  }

  connectedCallback() {
    if (this.hasAttribute('label')) {
      this.#labelEl.textContent = this.getAttribute('label');
    }
    this.#renderRadios();
    this.#initialize();

    this.#group.addEventListener('change', (e) => {
      const target = e.target;
      if (target && target.name === 'aura-scheme') {
        const value = target.value;
        this.#apply(value); // sets var + persists + event
      }
    });

    this.#reset.addEventListener('click', () => this.#resetToComputed());

    // Demo-only: mirror to readout
    const ro = document.getElementById('scheme-readout');
    this.addEventListener('value-change', (e) => {
      if (ro) ro.textContent = e.detail.value;
    });
  }

  // ----- UI setup -----
  #renderRadios() {
    // Clear and rebuild radios (Light / Dark / Auto)
    this.#group.innerHTML = '';
    const ids = ['light', 'dark', 'auto'];
    const labels = ['Light', 'Dark', 'Auto'];
    this.#values.forEach((val, idx) => {
      const id = `opt-${ids[idx]}-${Math.random().toString(36).slice(2, 8)}`;
      const input = document.createElement('input');
      input.type = 'radio';
      input.id = id;
      input.name = 'aura-scheme';
      input.value = val; // "light", "dark", "light dark"
      const label = document.createElement('label');
      label.htmlFor = id;
      label.textContent = labels[idx];
      this.#group.appendChild(input);
      this.#group.appendChild(label);
    });
  }

  // ----- Init / Reset -----
  #initialize() {
    // 1) localStorage wins if present
    const stored = localStorage.getItem(this.#storageKey());
    if (stored && this.#isValid(stored)) {
      this.#select(stored);
      this.#setVar(stored); // ensure :root reflects stored
      return;
    }

    // 2) Else read from computed CSS on :root
    const computed = getComputedStyle(document.documentElement).getPropertyValue(this.#prop).trim(); // "light" | "dark" | "light dark" | ""
    const initial = this.#isValid(computed) ? computed : 'light dark';
    this.#select(initial);
    // Don’t override stylesheet on load; only reflect the choice in UI.
  }

  #resetToComputed() {
    // Clear storage and remove inline override
    localStorage.removeItem(this.#storageKey());
    document.documentElement.style.removeProperty(this.#prop);

    // Re-read stylesheet-driven value; default to "light dark"
    const token = getComputedStyle(document.documentElement).getPropertyValue(this.#prop).trim();
    const value = this.#isValid(token) ? token : 'light dark';

    // Update UI (no persist, no inline set)
    this.#select(value);

    // Notify listeners we’re back to stylesheet value
    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: { property: this.#prop, value, source: 'reset' },
      }),
    );
  }

  // ----- Core apply -----
  #apply(value) {
    if (!this.#isValid(value)) return;
    this.#setVar(value);
    localStorage.setItem(this.#storageKey(), value);
    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: { property: this.#prop, value },
      }),
    );
  }

  #setVar(value) {
    document.documentElement.style.setProperty(this.#prop, value);
  }

  // ----- Helpers -----
  #storageKey() {
    return `aura:scheme:${this.#prop}`;
  }

  #isValid(v) {
    return this.#values.includes(String(v).trim());
  }

  #select(value) {
    // Set the correct radio as checked
    const inputs = this.#group.querySelectorAll('input[name="aura-scheme"]');
    inputs.forEach((i) => {
      i.checked = i.value === value;
    });
  }
}

customElements.define(AuraSchemeControl.is, AuraSchemeControl);
