import '@vaadin/icon';
import { html, nothing } from 'lit';
import { AuraLitControl } from './aura-lit-control.js';

class AuraSegmentedControl extends AuraLitControl {
  static get is() {
    return 'aura-segmented-control';
  }

  static get properties() {
    return {
      property: {
        type: String,
      },
    };
  }

  #value = '';
  #options = [];

  constructor() {
    super();
    this.label = 'Segmented value';
    this.property = '--segmented';
  }

  get value() {
    return this.#value;
  }

  set value(rawValue) {
    this.#applyValue(rawValue);
  }

  get options() {
    return [...this.#options];
  }

  set options(value) {
    this.#options = this.#normalizeOptions(value);
    this.requestUpdate();
    if (this.isConnected) {
      this.#initialize();
    } else {
      this.#syncSelection(this.#coerceValue(this.#value));
    }
  }

  connectedCallback() {
    super.connectedCallback();

    if (this.hasAttribute('options')) {
      this.#options = this.#parseOptionsAttribute(this.getAttribute('options'));
    } else if (this.#options.length === 0) {
      this.#options = this.#parseChildOptions();
    }

    this.#initialize();
  }

  willUpdate(props) {
    if (props.has('property')) {
      this.#initialize();
    }
  }

  renderContent() {
    if (!this.#options.length) {
      return nothing;
    }
    return html`
      <div class="segmented" role="radiogroup" aria-label=${this.label}>
        ${this.#options.map(
          (option) => html`
            <label title=${option.label}>
              ${option.icon ? html`<vaadin-icon src=${option.icon} aria-hidden="true"></vaadin-icon>` : nothing}
              ${option.label ? html`<span>${option.label}</span>` : nothing}
              <input
                type="radio"
                name=${this.property}
                .value=${option.value}
                .checked=${option.value === this.#value}
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

    const computed = getComputedStyle(document.documentElement).getPropertyValue(this.property).trim();
    const value = this.#coerceValue(computed) ?? this.#defaultValue();

    this.#syncSelection(value);
    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: { property: this.property, value, source: 'reset' },
      }),
    );
  }

  #onChange(event) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    this.#applyValue(target.value);
  }

  #applyValue(rawValue) {
    const normalized = this.#coerceValue(rawValue);
    if (normalized == null) {
      return;
    }

    this.#syncSelection(normalized);
    if (normalized === this.#defaultValue()) {
      document.documentElement.style.removeProperty(this.property);
      localStorage.removeItem(this.#storageKey());
    } else {
      document.documentElement.style.setProperty(this.property, normalized);
      localStorage.setItem(this.#storageKey(), normalized);
    }
    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: { property: this.property, value: normalized },
      }),
    );
  }

  #syncSelection(value) {
    this.#value = value == null ? '' : String(value);
    this.requestUpdate();
  }

  #initialize() {
    if (!this.#options.length) {
      return;
    }

    const stored = localStorage.getItem(this.#storageKey());
    if (stored != null && stored !== '') {
      const normalized = this.#coerceValue(stored);
      if (normalized != null) {
        this.#syncSelection(normalized);
        document.documentElement.style.setProperty(this.property, normalized);
        return;
      }
    }

    const computed = getComputedStyle(document.documentElement).getPropertyValue(this.property).trim();
    const fallback = this.#coerceValue(computed);
    if (fallback != null) {
      this.#syncSelection(fallback);
      return;
    }

    const defaultValue = this.#defaultValue();
    if (defaultValue != null) {
      this.#syncSelection(defaultValue);
      return;
    }

    this.#syncSelection(null);
  }

  #parseOptionsAttribute(value) {
    if (!value) {
      return [];
    }

    try {
      const parsed = JSON.parse(value);
      return this.#normalizeOptions(parsed);
    } catch (_error) {
      return [];
    }
  }

  #parseChildOptions() {
    const children = Array.from(this.children).filter((node) => node instanceof HTMLElement);
    if (!children.length) {
      return [];
    }

    return this.#normalizeOptions(
      children.map((el) => ({
        value: el.getAttribute('value') ?? el.dataset.value,
        label: el.getAttribute('label') ?? el.textContent,
        icon: el.getAttribute('icon') ?? undefined,
        default: el.hasAttribute('default'),
      })),
    );
  }

  #normalizeOptions(options) {
    if (!Array.isArray(options)) {
      return [];
    }

    return options
      .map((option) => {
        if (option == null || typeof option !== 'object') {
          return null;
        }

        const value = option.value == null ? '' : String(option.value).trim();
        if (!value) {
          return null;
        }

        const label = option.label == null ? value : String(option.label);
        const icon = option.icon == null ? undefined : String(option.icon);
        const isDefault = option.default === true || option.default === 'true';
        return { value, label, icon, default: isDefault };
      })
      .filter(Boolean);
  }

  #defaultValue() {
    const defaultOption = this.#options.find((option) => option.default);
    return defaultOption ? defaultOption.value : null;
  }

  #coerceValue(value) {
    if (!this.#options.length) {
      return null;
    }

    const stringValue = String(value ?? '').trim();
    const exact = this.#options.find((option) => option.value === stringValue);
    return exact ? exact.value : null;
  }

  #storageKey() {
    return `aura-segmented:${this.property}`;
  }
}

customElements.define(AuraSegmentedControl.is, AuraSegmentedControl);
