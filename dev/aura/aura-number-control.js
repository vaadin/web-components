import { html } from 'lit';
import { AuraLitControl } from './aura-lit-control.js';

class AuraNumberControl extends AuraLitControl {
  static get is() {
    return 'aura-number-control';
  }

  static properties = {
    property: { type: String },
    min: { type: Number },
    max: { type: Number },
    step: { type: Number },
    defaultValue: { type: Number, attribute: 'default' },
    value: { type: Number, state: true },
  };

  #initialComputed = null;

  constructor() {
    super();
    this.property = '--numeric';
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.value = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.hasAttribute('property')) {
      this.property = this.getAttribute('property').trim() || '--numeric';
    }
    if (this.min > this.max) {
      [this.min, this.max] = [this.max, this.min];
    }
    if (!this.label) {
      this.label = this.property;
    }
    this.#initializeValue();
  }

  renderContent() {
    return html`
      <input
        type="range"
        min=${this.min}
        max=${this.max}
        step=${this.step > 0 ? this.step : 1}
        .value=${String(this.value)}
        @input=${this.#onInput}
      />
      <output>${this.value}</output>
    `;
  }

  onReset() {
    if (this.#initialComputed != null) {
      this.#setValue(this.#initialComputed, { persist: 'clear' });
    } else {
      this.#initializeValue();
    }
  }

  #onInput(event) {
    this.#setValue(Number(event.target.value));
  }

  #initializeValue() {
    const stored = localStorage.getItem(this.#storageKey());
    if (stored != null && stored !== '') {
      const num = this.#clamp(this.#snap(Number(stored)));
      this.#initialComputed = this.#getComputedNumber();
      this.#setValue(num, { persist: false });
      return;
    }

    const computed = this.#getComputedNumber();
    const initial =
      computed != null
        ? computed
        : Number.isFinite(this.defaultValue)
          ? this.#clamp(this.#snap(this.defaultValue))
          : this.#clamp(this.#snap((this.min + this.max) / 2));
    this.#initialComputed = computed ?? initial;
    this.#setValue(initial, { persist: 'clear' });
  }

  #setValue(v, opts = { persist: true }) {
    const value = this.#clamp(this.#snap(Number(v)));
    this.value = value;
    document.documentElement.style.setProperty(this.property, String(value));
    if (opts.persist === true) {
      localStorage.setItem(this.#storageKey(), String(value));
    } else if (opts.persist === 'clear') {
      document.documentElement.style.removeProperty(this.property);
      localStorage.removeItem(this.#storageKey());
    }
    this.dispatchEvent(new CustomEvent('value-change', { detail: { property: this.property, value } }));
  }

  #storageKey() {
    return `aura-number:${this.property}`;
  }

  #getComputedNumber() {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(this.property).trim();
    if (!raw) return null;
    const n = parseFloat(raw);
    return Number.isFinite(n) ? this.#clamp(this.#snap(n)) : null;
  }

  #clamp(v) {
    return Math.min(this.max, Math.max(this.min, v));
  }

  #snap(v) {
    const step = this.step > 0 ? this.step : 1;
    const k = Math.round((v - this.min) / step);
    const snapped = this.min + k * step;
    const decimals = this.#decimals(step);
    return Number(snapped.toFixed(decimals));
  }

  #decimals(n) {
    const s = String(n);
    if (s.includes('e-')) {
      return parseInt(s.split('e-')[1], 10) || 0;
    }
    const i = s.indexOf('.');
    return i === -1 ? 0 : s.length - i - 1;
  }
}

customElements.define(AuraNumberControl.is, AuraNumberControl);
