import '@vaadin/select';
import { AuraControl } from './aura-abstract-control.js';

class AuraFontFamilyControl extends AuraControl {
  static get is() {
    return 'aura-font-family-control';
  }

  static get observedAttributes() {
    return ['property', 'label'];
  }

  #prop = '--aura-font-family';
  #fontLinkId = 'aura-font-family-runtime-import';
  #select;
  #labelEl;
  #resetBtn;

  // UI options with font stack values and optional Google Fonts imports.
  #opts = [
    { label: 'Instrument Sans (local)', value: "'Instrument Sans', var(--aura-font-family-system)", default: true },
    { label: 'System (local)', value: 'var(--aura-font-family-system)' },
    {
      label: 'Inter',
      value: "'Inter', var(--aura-font-family-system)",
      importUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap',
    },
    {
      label: 'Roboto',
      value: "'Roboto', var(--aura-font-family-system)",
      importUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@100..900&display=swap',
    },
    {
      label: 'Public Sans',
      value: "'Public Sans', var(--aura-font-family-system)",
      importUrl: 'https://fonts.googleapis.com/css2?family=Public+Sans:wght@100..900&display=swap',
    },
    {
      label: 'Geist',
      value: "'Geist', var(--aura-font-family-system)",
      importUrl: 'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap',
    },
    {
      label: 'Manrope',
      value: "'Manrope', var(--aura-font-family-system)",
      importUrl: 'https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap',
    },
    {
      label: 'Atkinson Hyperlegible Next',
      value: "'Atkinson Hyperlegible Next', var(--aura-font-family-system)",
      importUrl:
        'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;500;600;700&display=swap',
    },
    {
      label: 'Geist Mono',
      value: "'Geist Mono', var(--aura-font-family-system)",
      importUrl: 'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap',
    },
    {
      label: 'Jetbrains Mono',
      value: "'JetBrains Mono', var(--aura-font-family-system)",
      importUrl: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap',
    },
    {
      label: 'Atkinson Hyperlegible Mono',
      value: "'Atkinson Hyperlegible Mono', var(--aura-font-family-system)",
      importUrl:
        'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Mono:wght@400;500;600;700&display=swap',
    },
  ];

  constructor() {
    super();
    this.initControl({
      label: 'Font family',
      content: '<vaadin-select></vaadin-select>',
    });
    this.#select = this.querySelector('vaadin-select');
    this.#labelEl = this.labelElement;
    this.#resetBtn = this.resetButton;

    this.#select.renderer = (root) => {
      this.#renderOptions(root);
    };
  }

  get optionValues() {
    return this.#opts.map((opt) => this.#normalizeToken(opt.value)).filter(Boolean);
  }

  get defaultValue() {
    return this.#defaultValue();
  }

  get value() {
    return this.#normalizeToken(this.#select?.value) || this.#defaultValue();
  }

  set value(token) {
    const normalized = this.#normalizeToken(token);
    const allowed = this.optionValues;
    this.#select.value = allowed.includes(normalized) ? normalized : this.#defaultValue();
  }

  applyValue(token, { source = 'user' } = {}) {
    this.value = token;
    const selected = this.value;
    if (selected === this.#defaultValue()) {
      document.documentElement.style.removeProperty(this.#prop);
      localStorage.removeItem(this.#storageKey());
      this.#ensureFontImport(selected);
    } else {
      this.#setVar(selected);
      this.#persist(selected);
    }
    this.#emit(selected, { source });
    this.#updateComputedReadout();
  }

  attributeChangedCallback(name, _old, val) {
    if (name === 'property') {
      this.#prop = (val && val.trim()) || this.#prop;
      if (this.isConnected) this.#initialize();
    } else if (name === 'label') {
      this.#labelEl.textContent = val || 'Font family';
    }
  }

  connectedCallback() {
    // Set label if provided
    if (this.hasAttribute('label')) {
      this.#labelEl.textContent = this.getAttribute('label');
    }

    if (typeof this.#select.requestContentUpdate === 'function') {
      this.#select.requestContentUpdate();
    }

    this.#initialize();

    // User change → set var + persist
    this.#select.addEventListener('value-changed', (event) => {
      const token = this.#normalizeToken(event.detail.value);
      if (!token) return;
      this.applyValue(token, { source: 'user' });
    });

    // Reset → clear storage, remove inline override, reselect by stylesheet
    this.#resetBtn.addEventListener('click', () => {
      localStorage.removeItem(this.#storageKey());
      document.documentElement.style.removeProperty(this.#prop);
      this.#selectByComputed(); // UI only
      this.#ensureFontImport(this.value);
      this.#emit(this.value, { source: 'reset' });
      this.#updateComputedReadout();
    });

    this.#updateComputedReadout();
  }

  // ----- Initialization -----------------------------------------------------
  #initialize() {
    // 1) If stored, apply it (override + UI)
    const stored = localStorage.getItem(this.#storageKey());
    if (stored) {
      const token = this.#normalizeToken(stored) || this.#defaultValue();
      this.applyValue(token, { source: 'storage' });
      return;
    }

    // 2) Otherwise, select based on stylesheet-computed value (UI only)
    this.#selectByComputed();
  }

  #selectByComputed() {
    const computed = this.#normalizeToken(getComputedStyle(document.documentElement).getPropertyValue(this.#prop));
    // Try matching against current values and old var(--...) tokens.
    let matched = null;

    for (const opt of this.#opts) {
      const refValue = this.#normalizeToken(opt.value);
      if (computed && computed === refValue) {
        matched = refValue;
        break;
      }

      const legacyToken = this.#legacyTokenForOption(opt);
      if (computed && legacyToken && computed === legacyToken) {
        matched = refValue;
        break;
      }

      const legacyResolved = this.#legacyResolvedValueForOption(opt);
      if (computed && legacyResolved && computed === legacyResolved) {
        matched = refValue;
        break;
      }
    }

    this.value = matched ?? this.#defaultValue();
  }

  // ----- Actions ------------------------------------------------------------
  #setVar(token) {
    const normalized = this.#normalizeToken(token) || this.#defaultValue();
    document.documentElement.style.setProperty(this.#prop, normalized);
    this.#ensureFontImport(normalized);
  }

  #persist(token) {
    localStorage.setItem(this.#storageKey(), this.#normalizeToken(token));
  }

  #emit(token, extra = {}) {
    const label =
      this.#opts.find((o) => this.#normalizeToken(o.value) === this.#normalizeToken(token))?.label ?? 'Custom';
    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: { property: this.#prop, token, label, ...extra },
      }),
    );
  }

  // ----- Helpers ------------------------------------------------------------
  #storageKey() {
    return `aura:font-family:${this.#prop}`;
  }

  #renderOptions(root) {
    root.textContent = '';
    const listBox = document.createElement('vaadin-select-list-box');

    this.#opts.forEach((opt) => {
      const item = document.createElement('vaadin-select-item');
      item.value = this.#normalizeToken(opt.value);
      item.textContent = opt.label;
      listBox.appendChild(item);
    });

    root.appendChild(listBox);
  }

  #defaultValue() {
    return this.#normalizeToken(this.#opts.find((opt) => opt.default)?.value || this.#opts[0]?.value);
  }

  #ensureFontImport(token) {
    const option = this.#opts.find((opt) => this.#normalizeToken(opt.value) === this.#normalizeToken(token));
    const url = option?.importUrl || null;
    let link = document.getElementById(this.#fontLinkId);

    if (!url) {
      link?.remove();
      return;
    }

    if (!link) {
      link = document.createElement('link');
      link.id = this.#fontLinkId;
      link.rel = 'stylesheet';
      document.head.append(link);
    }

    if (link.getAttribute('href') !== url) {
      link.setAttribute('href', url);
    }
  }

  #legacyTokenForOption(opt) {
    if (opt.label.startsWith('Instrument Sans')) {
      return this.#normalizeToken('var(--aura-font-family-instrument-sans)');
    }
    if (opt.label.startsWith('System')) {
      return this.#normalizeToken('var(--aura-font-family-system)');
    }
    return null;
  }

  #legacyResolvedValueForOption(opt) {
    if (opt.label.startsWith('Instrument Sans')) {
      return this.#normalizeToken(
        getComputedStyle(document.documentElement).getPropertyValue('--aura-font-family-instrument-sans'),
      );
    }
    if (opt.label.startsWith('System')) {
      return this.#normalizeToken(
        getComputedStyle(document.documentElement).getPropertyValue('--aura-font-family-system'),
      );
    }
    return null;
  }

  #normalizeToken(s) {
    // Trim, collapse internal whitespace, standardize commas. Return null for empty.
    if (s == null) return null;
    const t = String(s).trim();
    if (!t) return null;
    return t
      .replace(/\s*,\s*/gu, ', ') // normalize comma spacing
      .replace(/\s+/gu, ' ');
  }

  #updateComputedReadout() {
    const ro = document.getElementById('ff-readout');
    if (!ro) return;
    const v = getComputedStyle(document.documentElement).getPropertyValue(this.#prop).trim();
    ro.textContent = v || '(unset)';
  }
}

customElements.define(AuraFontFamilyControl.is, AuraFontFamilyControl);
