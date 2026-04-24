import { AuraControl } from './aura-abstract-control.js';

class AuraThemeSchemeControl extends AuraControl {
  static get is() {
    return 'aura-theme-scheme-control';
  }

  static get observedAttributes() {
    return ['label'];
  }

  #group;
  #reset;
  #labelEl;
  #radioName;
  #presets = [
    { id: 'light', label: 'Light', main: 'light', content: 'light', notification: 'light' },
    { id: 'dark', label: 'Dark', main: 'dark', content: 'dark', notification: 'dark' },
    { id: 'auto', label: 'Auto', main: 'light dark', content: 'light dark', notification: 'light dark' },
    { id: 'mixed', label: 'Mixed', main: 'dark', content: 'light dark', notification: 'dark' },
  ];

  constructor() {
    super();
    this.#radioName = `aura-theme-scheme-${Math.random().toString(36).slice(2, 9)}`;
    this.initControl({
      label: 'Theme color-scheme',
      content: '<div class="segmented" role="radiogroup"></div>',
    });
    this.#group = this.querySelector('[role="radiogroup"]');
    this.#reset = this.resetButton;
    this.#labelEl = this.labelElement;
  }

  attributeChangedCallback(name, _old, val) {
    if (name === 'label') {
      this.#labelEl.textContent = val || 'Theme color-scheme';
    }
  }

  connectedCallback() {
    if (this.hasAttribute('label')) {
      this.#labelEl.textContent = this.getAttribute('label');
    }

    this.#renderRadios();
    this.#initialize();

    this.#group.addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || target.name !== this.#radioName) {
        return;
      }

      const preset = this.#presets.find((entry) => entry.id === target.value);
      if (!preset) {
        return;
      }

      this.#applyPreset(preset, { persist: true, source: 'user' });
    });

    this.#reset.addEventListener('click', () => this.#resetToComputed());
  }

  #renderRadios() {
    this.#group.innerHTML = '';

    this.#presets.forEach((preset) => {
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = this.#radioName;
      input.value = preset.id;

      const label = document.createElement('label');
      label.textContent = preset.label;
      label.append(input);

      this.#group.append(label);
    });
  }

  #initialize() {
    const storedPreset = localStorage.getItem(this.#storageKey());
    if (storedPreset) {
      const preset = this.#presets.find((entry) => entry.id === storedPreset);
      if (preset) {
        this.#applyPreset(preset, { persist: true, source: 'storage' });
        return;
      }
    }

    const matched = this.#matchFromComputed();
    if (matched) {
      this.#select(matched.id);
      return;
    }

    this.#select('light');
  }

  #resetToComputed() {
    localStorage.removeItem(this.#storageKey());
    for (const prop of this.#propertyNames()) {
      localStorage.removeItem(this.#propertyStorageKey(prop));
      document.documentElement.style.removeProperty(prop);
    }

    const matched = this.#matchFromComputed();
    const next = matched?.id || 'light';
    this.#select(next);

    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: {
          preset: next,
          source: 'reset',
          values: matched || null,
        },
      }),
    );
  }

  #applyPreset(preset, { persist, source }) {
    this.#select(preset.id);

    if (preset.id === 'light') {
      for (const prop of this.#propertyNames()) {
        document.documentElement.style.removeProperty(prop);
        if (persist) {
          localStorage.removeItem(this.#propertyStorageKey(prop));
        }
      }

      if (persist) {
        localStorage.removeItem(this.#storageKey());
      }

      this.dispatchEvent(
        new CustomEvent('value-change', {
          detail: {
            preset: preset.id,
            source,
            values: {
              main: preset.main,
              content: preset.content,
              notification: preset.notification,
            },
          },
        }),
      );

      return;
    }

    const values = [
      ['color-scheme', preset.main],
      ['--aura-content-color-scheme', preset.content],
      ['--aura-notification-color-scheme', preset.notification],
    ];

    values.forEach(([prop, value]) => {
      document.documentElement.style.setProperty(prop, value);
      if (persist) {
        localStorage.setItem(this.#propertyStorageKey(prop), value);
      }
    });

    if (persist) {
      localStorage.setItem(this.#storageKey(), preset.id);
    }

    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: {
          preset: preset.id,
          source,
          values: {
            main: preset.main,
            content: preset.content,
            notification: preset.notification,
          },
        },
      }),
    );
  }

  #matchFromComputed() {
    const current = {
      main: this.#readComputed('color-scheme'),
      content: this.#readComputed('--aura-content-color-scheme'),
      notification: this.#readComputed('--aura-notification-color-scheme'),
    };

    return (
      this.#presets.find(
        (preset) =>
          preset.main === current.main &&
          preset.content === current.content &&
          preset.notification === current.notification,
      ) || null
    );
  }

  #readComputed(prop) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(prop).trim();
    if (raw === 'light' || raw === 'dark' || raw === 'light dark') {
      return raw;
    }

    return null;
  }

  #select(id) {
    const inputs = this.#group.querySelectorAll(`input[name="${this.#radioName}"]`);
    inputs.forEach((input) => {
      input.checked = input.value === id;
    });
  }

  #propertyNames() {
    return ['color-scheme', '--aura-content-color-scheme', '--aura-notification-color-scheme'];
  }

  #storageKey() {
    return 'aura:theme-scheme:preset';
  }

  #propertyStorageKey(prop) {
    return `aura:scheme:${prop}`;
  }
}

customElements.define(AuraThemeSchemeControl.is, AuraThemeSchemeControl);
