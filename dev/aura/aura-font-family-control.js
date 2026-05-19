import '@vaadin/select';
import { html } from 'lit';
import { AURA_GOOGLE_FONTS } from './aura-fonts.js';
import { AuraLitControl } from './aura-lit-control.js';

const FONT_OPTIONS = [
  { label: 'Instrument Sans (local)', value: "'Instrument Sans', var(--aura-font-family-system)", default: true },
  { label: 'System (local)', value: 'var(--aura-font-family-system)' },
  ...AURA_GOOGLE_FONTS.map(({ family, importUrl }) => ({
    label: family,
    value: `'${family}', var(--aura-font-family-system)`,
    importUrl,
  })),
];

const FONT_LINK_ID = 'aura-font-family-runtime-import';

function normalizeToken(value) {
  if (value == null) {
    return null;
  }
  const trimmed = String(value).trim();
  if (!trimmed) {
    return null;
  }
  return trimmed.replace(/\s*,\s*/gu, ', ').replace(/\s+/gu, ' ');
}

const FONT_ITEMS = FONT_OPTIONS.map((opt) => ({
  label: opt.label,
  value: normalizeToken(opt.value),
}));

class AuraFontFamilyControl extends AuraLitControl {
  static get is() {
    return 'aura-font-family-control';
  }

  static get properties() {
    return {
      property: {
        type: String,
      },
      _selectValue: {
        type: String,
        state: true,
      },
    };
  }

  constructor() {
    super();
    this.label = 'Font family';
    this.property = '--aura-font-family';
    this._selectValue = '';
  }

  get optionValues() {
    return FONT_ITEMS.map((item) => item.value).filter(Boolean);
  }

  get defaultValue() {
    return this.#defaultValue();
  }

  get value() {
    return this._selectValue || this.#defaultValue();
  }

  set value(token) {
    const normalized = normalizeToken(token);
    this._selectValue = this.optionValues.includes(normalized) ? normalized : this.#defaultValue();
  }

  applyValue(token, { source = 'user' } = {}) {
    this.value = token;
    const selected = this.value;
    if (selected === this.#defaultValue()) {
      document.documentElement.style.removeProperty(this.property);
      localStorage.removeItem(this.#storageKey());
      this.#ensureFontImport(selected);
    } else {
      this.#setVar(selected);
      this.#persist(selected);
    }
    this.#emit(selected, { source });
    this.#updateComputedReadout();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#updateComputedReadout();
  }

  renderContent() {
    return html`
      <vaadin-select
        .items=${FONT_ITEMS}
        .value=${this._selectValue}
        @value-changed=${this.#onValueChanged}
      ></vaadin-select>
    `;
  }

  firstUpdated() {
    this.#initialize();
  }

  onReset() {
    localStorage.removeItem(this.#storageKey());
    document.documentElement.style.removeProperty(this.property);
    this.#selectByComputed();
    this.#ensureFontImport(this.value);
    this.#emit(this.value, { source: 'reset' });
    this.#updateComputedReadout();
  }

  #onValueChanged(event) {
    const token = normalizeToken(event.detail.value);
    if (!token || token === this._selectValue) {
      return;
    }
    this.applyValue(token, { source: 'user' });
  }

  #initialize() {
    const stored = localStorage.getItem(this.#storageKey());
    if (stored) {
      const token = normalizeToken(stored) || this.#defaultValue();
      this.applyValue(token, { source: 'storage' });
      return;
    }
    this.#selectByComputed();
  }

  #selectByComputed() {
    const computed = normalizeToken(getComputedStyle(document.documentElement).getPropertyValue(this.property));
    const matched = this.optionValues.find((value) => value === computed) ?? null;
    this.value = matched ?? this.#defaultValue();
  }

  #setVar(token) {
    const normalized = normalizeToken(token) || this.#defaultValue();
    document.documentElement.style.setProperty(this.property, normalized);
    this.#ensureFontImport(normalized);
  }

  #persist(token) {
    localStorage.setItem(this.#storageKey(), normalizeToken(token));
  }

  #emit(token, extra = {}) {
    const label = FONT_OPTIONS.find((o) => normalizeToken(o.value) === normalizeToken(token))?.label ?? 'Custom';
    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: { property: this.property, token, label, ...extra },
      }),
    );
  }

  #storageKey() {
    return `aura:font-family:${this.property}`;
  }

  #defaultValue() {
    return normalizeToken(FONT_OPTIONS.find((opt) => opt.default)?.value || FONT_OPTIONS[0]?.value);
  }

  #ensureFontImport(token) {
    const option = FONT_OPTIONS.find((opt) => normalizeToken(opt.value) === normalizeToken(token));
    const url = option?.importUrl || null;
    let link = document.getElementById(FONT_LINK_ID);

    if (!url) {
      link?.remove();
      return;
    }

    if (!link) {
      link = document.createElement('link');
      link.id = FONT_LINK_ID;
      link.rel = 'stylesheet';
      document.head.append(link);
    }

    if (link.getAttribute('href') !== url) {
      link.setAttribute('href', url);
    }
  }

  #updateComputedReadout() {
    const readout = document.getElementById('ff-readout');
    if (!readout) {
      return;
    }
    const value = getComputedStyle(document.documentElement).getPropertyValue(this.property).trim();
    readout.textContent = value || '(unset)';
  }
}

customElements.define(AuraFontFamilyControl.is, AuraFontFamilyControl);
