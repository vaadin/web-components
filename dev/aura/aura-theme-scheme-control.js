import { html } from 'lit';
import { AuraLitControl } from './aura-lit-control.js';

const SCHEME_PRESETS = [
  { id: 'light', label: 'Light', main: 'light', content: 'light', notification: 'light' },
  { id: 'dark', label: 'Dark', main: 'dark', content: 'dark', notification: 'dark' },
  { id: 'auto', label: 'Auto', main: 'light dark', content: 'light dark', notification: 'light dark' },
  { id: 'mixed', label: 'Mixed', main: 'dark', content: 'light dark', notification: 'dark' },
];

const PROPERTY_NAMES = ['color-scheme', '--aura-content-color-scheme', '--aura-notification-color-scheme'];

class AuraThemeSchemeControl extends AuraLitControl {
  static get is() {
    return 'aura-theme-scheme-control';
  }

  static get properties() {
    return {
      value: {
        type: String,
        state: true,
      },
    };
  }

  #radioName;

  constructor() {
    super();
    this.label = 'Theme color-scheme';
    this.value = 'light';
    this.#radioName = `aura-theme-scheme-${Math.random().toString(36).slice(2, 9)}`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.#initialize();
  }

  renderContent() {
    return html`
      <div class="segmented" role="radiogroup">
        ${SCHEME_PRESETS.map(
          (preset) => html`
            <label>
              ${preset.label}
              <input
                type="radio"
                name=${this.#radioName}
                .value=${preset.id}
                .checked=${this.value === preset.id}
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
    for (const prop of PROPERTY_NAMES) {
      localStorage.removeItem(this.#propertyStorageKey(prop));
      document.documentElement.style.removeProperty(prop);
    }

    const matched = this.#matchFromComputed();
    const next = matched?.id || 'light';
    this.value = next;

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

  #onChange(event) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    const preset = SCHEME_PRESETS.find((entry) => entry.id === target.value);
    if (!preset) {
      return;
    }
    this.#applyPreset(preset, { persist: true, source: 'user' });
  }

  #applyPreset(preset, { persist, source }) {
    this.value = preset.id;

    if (preset.id === 'light') {
      for (const prop of PROPERTY_NAMES) {
        document.documentElement.style.removeProperty(prop);
        if (persist) {
          localStorage.removeItem(this.#propertyStorageKey(prop));
        }
      }
      if (persist) {
        localStorage.removeItem(this.#storageKey());
      }
    } else {
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

  #initialize() {
    const storedPreset = localStorage.getItem(this.#storageKey());
    if (storedPreset) {
      const preset = SCHEME_PRESETS.find((entry) => entry.id === storedPreset);
      if (preset) {
        this.#applyPreset(preset, { persist: true, source: 'storage' });
        return;
      }
    }

    const matched = this.#matchFromComputed();
    this.value = matched?.id || 'light';
  }

  #matchFromComputed() {
    const current = {
      main: this.#readComputed('color-scheme'),
      content: this.#readComputed('--aura-content-color-scheme'),
      notification: this.#readComputed('--aura-notification-color-scheme'),
    };

    return (
      SCHEME_PRESETS.find(
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

  #storageKey() {
    return 'aura:theme-scheme:preset';
  }

  #propertyStorageKey(prop) {
    return `aura:scheme:${prop}`;
  }
}

customElements.define(AuraThemeSchemeControl.is, AuraThemeSchemeControl);
