import { AuraControl } from './aura-abstract-control.js';
import { normalizeHex, parseLightDark, resolveEffectiveScheme, toHex } from './aura-color-utils.js';

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
      const hex = normalizeHex(this.#input.value) || '#000000';
      this.#setUI(hex);
      this.#setVar(hex); // set only on user action
      this.#persist(hex);
      this.#emit(hex);
    });

    // Reset → clear storage, remove inline var, UI from computed (no override)
    this.#resetBtn.addEventListener('click', () => {
      localStorage.removeItem(this.#storageKey());
      document.documentElement.style.removeProperty(this.#prop);
      const computedHex = this.#getComputedHex() || '#000000';
      this.#setUI(computedHex);
      this.#emit(computedHex, { source: 'reset' });
    });
  }

  // ----- Init: storage OR computed ----------------------------------------
  #initialize() {
    // From storage → set var + UI
    const stored = localStorage.getItem(this.#storageKey());
    if (stored) {
      const hex = toHex(stored) || this.#getComputedHex() || '#000000';
      this.#setUI(hex);
      this.#setVar(hex); // set because it came from storage
      this.#persist(hex); // normalize storage to hex
      this.#emit(hex, { source: 'storage' });
      return;
    }

    // From computed CSS → UI only
    const hex = this.#getComputedHex() || '#000000';
    this.#setUI(hex);
  }

  // ----- UI helpers --------------------------------------------------------
  #setUI(hex) {
    const norm = normalizeHex(hex) || '#000000';
    this.#input.value = norm;
    this.#output.textContent = norm;
  }

  #persist(hex) {
    localStorage.setItem(this.#storageKey(), normalizeHex(hex));
  }

  #emit(hex, extra = {}) {
    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: { property: this.#prop, value: normalizeHex(hex), ...extra },
      }),
    );
  }

  #setVar(hex) {
    document.documentElement.style.setProperty(this.#prop, normalizeHex(hex));
  }

  #storageKey() {
    return `aura-color:${this.#prop}`;
  }

  #getComputedHex() {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(this.#prop).trim();
    if (!raw) return null;

    const ld = parseLightDark(raw);
    if (ld) {
      const scheme = resolveEffectiveScheme();
      const chosen = scheme === 'dark' ? ld.dark : ld.light;
      return toHex(chosen, { scheme });
    }
    return toHex(raw);
  }
}

customElements.define(AuraColorControl.is, AuraColorControl);
