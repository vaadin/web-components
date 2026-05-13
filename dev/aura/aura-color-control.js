import { html } from 'lit';
import { normalizeHex, parseLightDark, resolveEffectiveScheme, toHex } from './aura-color-utils.js';
import { AuraLitControl } from './aura-lit-control.js';

class AuraColorControl extends AuraLitControl {
  static get is() {
    return 'aura-color-control';
  }

  static get properties() {
    return {
      property: {
        type: String,
      },
      label: {
        type: String,
      },
      value: {
        type: String,
        state: true,
      },
    };
  }

  constructor() {
    super();
    this.property = '--accent-color';
    this.label = `${this.property.replace(/^--/u, '')} color`;
    this.value = '#000000';
  }

  willUpdate(props) {
    if (props.has('property')) {
      this.#initialize();
    }
  }

  renderContent() {
    return html`
      <input type="color" .value=${this.value} @input=${this.#onInput} />
      <output>${this.value}</output>
    `;
  }

  onReset() {
    localStorage.removeItem(this.#storageKey());
    document.documentElement.style.removeProperty(this.property);
    const computedHex = this.#getComputedHex() || '#000000';
    this.value = normalizeHex(computedHex) || '#000000';
    this.#emit(this.value, { source: 'reset' });
  }

  #onInput(event) {
    const hex = normalizeHex(event.target.value) || '#000000';
    this.value = hex;
    this.#setVar(hex);
    this.#persist(hex);
    this.#emit(hex);
  }

  #initialize() {
    const stored = localStorage.getItem(this.#storageKey());
    if (stored) {
      const hex = toHex(stored) || this.#getComputedHex() || '#000000';
      this.value = normalizeHex(hex) || '#000000';
      this.#setVar(this.value);
      this.#persist(this.value);
      this.#emit(this.value, { source: 'storage' });
      return;
    }
    const hex = this.#getComputedHex() || '#000000';
    this.value = normalizeHex(hex) || '#000000';
  }

  #persist(hex) {
    localStorage.setItem(this.#storageKey(), normalizeHex(hex));
  }

  #emit(hex, extra = {}) {
    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: { property: this.property, value: normalizeHex(hex), ...extra },
      }),
    );
  }

  #setVar(hex) {
    document.documentElement.style.setProperty(this.property, normalizeHex(hex));
  }

  #storageKey() {
    return `aura-color:${this.property}`;
  }

  #getComputedHex() {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(this.property).trim();
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
