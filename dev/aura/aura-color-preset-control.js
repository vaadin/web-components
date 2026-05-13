import '@vaadin/select';
import { html, render } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { AuraControl } from './aura-abstract-control.js';
import { resolveVarColor, toComparableColor } from './aura-color-utils.js';

class AuraColorPresetControl extends AuraControl {
  static get is() {
    return 'aura-color-preset-control';
  }

  static get observedAttributes() {
    return ['property', 'label'];
  }

  #prop = '--accent-color';
  #select;
  #labelEl;
  #resetBtn;
  #presets = [];

  constructor() {
    super();
    this.initControl({
      label: 'Color preset',
      content: '<vaadin-select></vaadin-select>',
      controlPart: 'control',
    });

    this.#select = this.querySelector('vaadin-select');
    this.#labelEl = this.labelElement;
    this.#resetBtn = this.resetButton;

    this.#select.renderer = (root) => {
      this.#renderOptions(root);
    };

    this.#select.addEventListener('value-changed', (event) => {
      const value = event.detail.value;
      if (!value) return;

      const preset = this.#presets.find((entry) => entry.id === value);
      if (!preset) return;

      if (preset.isDefault) {
        this.#applyDefaultPreset(preset, { source: 'user', emit: true });
      } else {
        this.#applyPreset(preset, { source: 'user', persist: true, setVar: true, emit: true });
      }
    });

    this.#resetBtn.addEventListener('click', () => {
      const defaultPreset = this.#getDefaultPreset();
      if (defaultPreset) {
        this.#applyDefaultPreset(defaultPreset, { source: 'reset', emit: true });
        return;
      }

      localStorage.removeItem(this.#storageKey());
      document.documentElement.style.removeProperty(this.#prop);
      const matched = this.#matchComputedPreset();
      this.#setSelection(matched?.id ?? '');
      this.#emit(matched?.value ?? null, matched?.name ?? null, { source: 'reset' });
    });
  }

  get presets() {
    return this.#presets.map(({ id, ...entry }) => ({ ...entry }));
  }

  set presets(value) {
    this.#presets = this.#normalizePresets(value);
    this.#refreshOptions();
    if (this.isConnected) {
      this.#initialize();
    }
  }

  attributeChangedCallback(name, _old, value) {
    if (name === 'property') {
      this.#prop = value?.trim() || '--accent-color';
      if (this.isConnected) {
        this.#initialize();
      }
      return;
    }

    if (name === 'label') {
      this.#labelEl.textContent = value || 'Color preset';
    }
  }

  connectedCallback() {
    if (this.hasAttribute('property')) {
      this.#prop = this.getAttribute('property').trim();
    }

    if (this.hasAttribute('label')) {
      this.#labelEl.textContent = this.getAttribute('label');
    } else {
      this.#labelEl.textContent = `${this.#prop.replace(/^--/u, '')} preset`;
    }

    this.#refreshOptions();
    this.#initialize();
  }

  #normalizePresets(value) {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((entry, index) => {
        if (typeof entry === 'string') {
          const raw = entry.trim();
          if (!raw) return null;
          return {
            id: `preset-${index}`,
            value: raw,
            name: raw,
            preview: this.#getPreviewColor(raw),
            isDefault: false,
          };
        }

        if (!entry || typeof entry !== 'object') {
          return null;
        }

        const isDefault = entry.default === true;
        const rawValue = String(entry.value ?? '').trim();
        if (!isDefault && !rawValue) {
          return null;
        }

        const rawName = String(entry.name ?? '').trim();
        const rawPreview = String(entry.preview ?? '').trim();
        return {
          id: `preset-${index}`,
          value: rawValue,
          name: rawName || rawValue || 'Theme default',
          preview: this.#getPreviewColor(rawPreview || rawValue),
          isDefault,
        };
      })
      .filter(Boolean);
  }

  #refreshOptions() {
    if (typeof this.#select.requestContentUpdate === 'function') {
      this.#select.requestContentUpdate();
    }

    if (this.#presets.length === 0) {
      this.#setSelection('');
      return;
    }

    const hasSelectedPreset = this.#presets.some((entry) => entry.id === this.#select.value);
    if (!hasSelectedPreset) {
      this.#setSelection('');
    }
  }

  #renderOptions(root) {
    render(
      html`
        <vaadin-select-list-box>
          ${this.#presets.map(
            (preset) => html`
              <vaadin-select-item .value=${preset.id}>
                <span
                  style=${styleMap({
                    width: '1lh',
                    height: '1lh',
                    borderRadius: '999px',
                    border: '1px solid color-mix(in srgb, currentColor 25%, transparent)',
                    boxSizing: 'border-box',
                    flexShrink: '0',
                    ...(preset.preview ? { background: preset.preview } : {}),
                  })}
                ></span>
                <span>${preset.name}</span>
              </vaadin-select-item>
            `,
          )}
        </vaadin-select-list-box>
      `,
      root,
    );
  }

  #initialize() {
    if (this.#presets.length === 0) {
      this.#setSelection('');
      return;
    }

    const storedValue = localStorage.getItem(this.#storageKey());
    if (storedValue) {
      const matchedFromStored = this.#matchPreset(storedValue);
      if (matchedFromStored) {
        if (matchedFromStored.isDefault) {
          this.#applyDefaultPreset(matchedFromStored, { source: 'storage', emit: true });
        } else {
          this.#applyPreset(matchedFromStored, { source: 'storage', persist: true, setVar: true, emit: true });
        }
      } else {
        document.documentElement.style.setProperty(this.#prop, storedValue);
        this.#setSelection('');
        this.#emit(storedValue, null, { source: 'storage' });
      }
      return;
    }

    const matchedComputed = this.#matchComputedPreset();
    this.#setSelection(matchedComputed?.id ?? this.#getDefaultPreset()?.id ?? '');
  }

  #applyPreset(preset, opts) {
    this.#setSelection(preset.id);

    if (opts.setVar) {
      document.documentElement.style.setProperty(this.#prop, preset.value);
    }

    if (opts.persist) {
      localStorage.setItem(this.#storageKey(), preset.value);
    }

    if (opts.emit) {
      this.#emit(preset.value, preset.name, { source: opts.source });
    }
  }

  #applyDefaultPreset(preset, opts) {
    this.#setSelection(preset.id);
    localStorage.removeItem(this.#storageKey());
    document.documentElement.style.removeProperty(this.#prop);

    if (opts.emit) {
      this.#emit(null, preset.name, { source: opts.source, cleared: true });
    }

    if (typeof this.#select.requestContentUpdate === 'function') {
      this.#select.requestContentUpdate();
    }
  }

  #setSelection(id) {
    const next = id || '';
    if (this.#select.value !== next) {
      this.#select.value = next;
    }
  }

  #storageKey() {
    return `aura-color-preset:${this.#prop}`;
  }

  #matchComputedPreset() {
    const computed = getComputedStyle(document.documentElement).getPropertyValue(this.#prop).trim();
    if (!computed) {
      return null;
    }

    return this.#matchPreset(computed);
  }

  #matchPreset(value) {
    const targetToken = this.#normalizeToken(value);
    const targetColor = toComparableColor(value);

    for (const preset of this.#presets) {
      if (preset.isDefault) {
        continue;
      }

      const presetToken = this.#normalizeToken(preset.value);
      if (targetToken && presetToken && targetToken === presetToken) {
        return preset;
      }

      const presetComparable = toComparableColor(preset.value);
      if (targetColor && presetComparable && targetColor === presetComparable) {
        return preset;
      }

      if (targetColor && !presetComparable) {
        const resolved = resolveVarColor(preset.value);
        if (resolved && resolved === targetColor) {
          return preset;
        }
      }
    }

    return null;
  }

  #getDefaultPreset() {
    return this.#presets.find((preset) => preset.isDefault) || null;
  }

  #emit(value, name, extra = {}) {
    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: {
          property: this.#prop,
          value,
          name,
          ...extra,
        },
      }),
    );
  }

  #getPreviewColor(rawValue) {
    if (!rawValue) {
      return null;
    }

    const resolved = resolveVarColor(rawValue);
    if (resolved) {
      return resolved;
    }

    return toComparableColor(rawValue);
  }

  #normalizeToken(value) {
    const token = String(value || '').trim();
    if (!token) {
      return null;
    }

    if (!/^var\(/u.test(token)) {
      return null;
    }

    return token.replace(/\s+/gu, '');
  }
}

customElements.define(AuraColorPresetControl.is, AuraColorPresetControl);
