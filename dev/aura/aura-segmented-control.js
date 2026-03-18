import '@vaadin/icon';
import { AuraControl } from './aura-abstract-control.js';

class AuraSegmentedControl extends AuraControl {
  static get is() {
    return 'aura-segmented-control';
  }

  static get observedAttributes() {
    return ['property', 'label', 'options'];
  }

  #prop = '--segmented';
  #labelText = 'Segmented value';
  #value = '';
  #options = [];
  #group;
  #labelEl;
  #reset;

  constructor() {
    super();
    this.initControl({
      label: 'Segmented value',
      content: '<div class="segmented" role="radiogroup"></div>',
    });

    this.#group = this.querySelector('[role="radiogroup"]');
    this.#labelEl = this.labelElement;
    this.#reset = this.resetButton;
  }

  get property() {
    return this.#prop;
  }

  set property(value) {
    this.setAttribute('property', value ?? '--segmented');
  }

  get label() {
    return this.#labelText;
  }

  set label(value) {
    this.setAttribute('label', value ?? 'Segmented value');
  }

  get options() {
    return [...this.#options];
  }

  set options(value) {
    const normalized = this.#normalizeOptions(value);
    this.#options = normalized;
    this.#renderOptions();
    if (this.isConnected) {
      this.#initialize();
    } else {
      this.#syncSelection(this.#coerceValue(this.#value));
    }
  }

  get value() {
    return this.#value;
  }

  set value(value) {
    this.#applyValue(value);
  }

  attributeChangedCallback(name, _old, val) {
    switch (name) {
      case 'property':
        this.#prop = (val && val.trim()) || '--segmented';
        if (this.isConnected) {
          this.#renderOptions();
          this.#initialize();
        }
        break;
      case 'label':
        this.#labelText = val || 'Segmented value';
        this.#labelEl.textContent = this.#labelText;
        break;
      case 'options':
        // If options are provided as JSON, they override any child option markup.
        this.#options = this.#parseOptionsAttribute(val);
        if (this.isConnected) {
          this.#renderOptions();
          this.#initialize();
        }
        break;
      default:
        break;
    }
  }

  connectedCallback() {
    if (this.hasAttribute('property')) {
      this.#prop = this.getAttribute('property').trim();
    }

    if (this.hasAttribute('label')) {
      this.#labelText = this.getAttribute('label');
    } else {
      this.#labelText = this.#prop;
    }

    this.#labelEl.textContent = this.#labelText;

    if (this.hasAttribute('options')) {
      this.#options = this.#parseOptionsAttribute(this.getAttribute('options'));
    } else if (this.#options.length === 0) {
      this.#options = this.#parseChildOptions();
    }

    this.#renderOptions();
    this.#initialize();

    this.#group.addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || target.name !== this.#prop) {
        return;
      }
      this.#applyValue(target.value);
    });

    this.#reset.addEventListener('click', () => this.#resetToComputed());
  }

  #storageKey() {
    return `aura-segmented:${this.#prop}`;
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
        document.documentElement.style.setProperty(this.#prop, normalized);
        return;
      }
    }

    const computed = getComputedStyle(document.documentElement).getPropertyValue(this.#prop).trim();
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

  #applyValue(rawValue) {
    const normalized = this.#coerceValue(rawValue);
    if (normalized == null) {
      return;
    }

    this.#syncSelection(normalized);
    if (normalized === this.#defaultValue()) {
      // Default option means no explicit override: fall back to stylesheet value.
      document.documentElement.style.removeProperty(this.#prop);
      localStorage.removeItem(this.#storageKey());
    } else {
      document.documentElement.style.setProperty(this.#prop, normalized);
      localStorage.setItem(this.#storageKey(), normalized);
    }
    this.dispatchEvent(new CustomEvent('value-change', { detail: { property: this.#prop, value: normalized } }));
  }

  #resetToComputed() {
    localStorage.removeItem(this.#storageKey());
    document.documentElement.style.removeProperty(this.#prop);

    const computed = getComputedStyle(document.documentElement).getPropertyValue(this.#prop).trim();
    const value = this.#coerceValue(computed) ?? this.#defaultValue();

    this.#syncSelection(value);
    this.dispatchEvent(new CustomEvent('value-change', { detail: { property: this.#prop, value, source: 'reset' } }));
  }

  #syncSelection(value) {
    this.#value = value == null ? '' : String(value);

    this.#group.querySelectorAll('input[type="radio"]').forEach((input) => {
      input.checked = input.value === this.#value;
    });
  }

  #renderOptions() {
    this.#group.innerHTML = '';
    if (!this.#options.length) {
      return;
    }

    this.#group.setAttribute('aria-label', this.#labelText);

    this.#options.forEach((option) => {
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = this.#prop;
      input.value = option.value;
      input.checked = option.value === this.#value;

      const label = document.createElement('label');
      label.title = option.label;

      if (option.icon) {
        const icon = document.createElement('vaadin-icon');
        icon.setAttribute('src', option.icon);
        icon.setAttribute('aria-hidden', 'true');
        label.append(icon);
      }

      if (option.label) {
        const text = document.createElement('span');
        text.textContent = option.label;
        label.append(text);
      }

      label.append(input);

      this.#group.append(label);
    });
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
}

customElements.define(AuraSegmentedControl.is, AuraSegmentedControl);
