import { html } from 'lit';
import { AuraLitControl } from './aura-lit-control.js';

const SCHEME_OPTIONS = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'Auto', value: 'light dark' },
];

class AuraSchemeControl extends AuraLitControl {
  static get is() {
    return 'aura-scheme-control';
  }

  static get properties() {
    return {
      property: {
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
    this.property = '--aura-color-scheme';
    this.label = 'Color scheme';
    this.value = '';
  }

  connectedCallback() {
    super.connectedCallback();

    this.#initialize();
  }

  renderContent() {
    return html`
      <div class="segmented" role="radiogroup">
        ${SCHEME_OPTIONS.map(
          (opt) => html`
            <label>
              ${opt.label}
              <input
                type="radio"
                name=${this.property}
                .value=${opt.value}
                .checked=${this.value === opt.value}
                @change=${this.#onChange}
              />
            </label>
          `,
        )}
      </div>
    `;
  }

  onReset() {
    localStorage.removeItem(this.#storageKey());
    document.documentElement.style.removeProperty(this.property);
    const token = getComputedStyle(document.documentElement).getPropertyValue(this.property).trim();
    const next = this.#isValid(token) ? token : 'normal';
    this.value = next;
    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: { property: this.property, value: next, source: 'reset' },
      }),
    );
  }

  #onChange(event) {
    const next = event.target.value;
    if (!this.#isValid(next)) {
      return;
    }
    this.value = next;
    document.documentElement.style.setProperty(this.property, next);
    localStorage.setItem(this.#storageKey(), next);
    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: { property: this.property, value: next },
      }),
    );
  }

  #initialize() {
    const stored = localStorage.getItem(this.#storageKey());
    if (stored && this.#isValid(stored)) {
      this.value = stored;
      document.documentElement.style.setProperty(this.property, stored);
      return;
    }
    const computed = getComputedStyle(document.documentElement).getPropertyValue(this.property).trim();
    this.value = this.#isValid(computed) ? computed : 'normal';
  }

  #storageKey() {
    return `aura:scheme:${this.property}`;
  }

  #isValid(v) {
    return SCHEME_OPTIONS.some((opt) => opt.value === String(v).trim());
  }
}

customElements.define(AuraSchemeControl.is, AuraSchemeControl);
