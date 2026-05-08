import './aura-color-preset-control.js';
import './aura-font-family-control.js';
import './aura-number-control.js';
import './aura-preset-thumbnail.js';
import './aura-segmented-control.js';
import './aura-theme-scheme-control.js';
import '@vaadin/accordion';
import '@vaadin/details';
import '@vaadin/dialog';
import '@vaadin/text-area';
import { html, nothing, render } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { toHex } from './aura-color-utils.js';
import { DEFAULT_PRESET_ID, getThemeEditorPresetById, THEME_EDITOR_PRESETS } from './aura-theme-editor-presets.js';

const EXTRA_RULES_STORAGE_KEY = 'aura-theme-editor:extra-rules';
const PRESET_RUNTIME_STYLE_ID = 'aura-theme-editor-runtime-preset-rules';
const DEFAULT_PRESET = {
  id: DEFAULT_PRESET_ID,
  label: 'Default',
  thumbnail: {
    base: '#f4f5f7',
    accent: '#3266e4',
    surface: '#ffffff',
    glow: '#dbe6ff',
  },
};
const FONT_FAMILY_IMPORTS = {
  Inter: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap',
  Roboto: 'https://fonts.googleapis.com/css2?family=Roboto:wght@100..900&display=swap',
  'Public Sans': 'https://fonts.googleapis.com/css2?family=Public+Sans:wght@100..900&display=swap',
  Geist: 'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap',
  Manrope: 'https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap',
  'Atkinson Hyperlegible Next':
    'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;500;600;700&display=swap',
  'Geist Mono': 'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap',
  'JetBrains Mono': 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap',
  'Atkinson Hyperlegible Mono':
    'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Mono:wght@400;500;600;700&display=swap',
};

const ACCENT_COLOR_LIGHT_PRESETS = [
  { value: '#3266e4', name: 'Default', default: true },
  { value: '#222222', name: 'Neutral' },
  { value: '#e7000b', name: 'Red' },
  { value: '#ff8904', name: 'Orange' },
  { value: '#ffba00', name: 'Amber' },
  { value: '#ffdf20', name: 'Yellow' },
  { value: '#7ccf00', name: 'Lime' },
  { value: '#00a138', name: 'Green' },
  { value: '#009966', name: 'Emerald' },
  { value: '#009689', name: 'Teal' },
  { value: '#0092b8', name: 'Cyan' },
  { value: '#0084d1', name: 'Sky' },
  { value: '#155dfc', name: 'Blue' },
  { value: '#4f39f6', name: 'Indigo' },
  { value: '#7f22fe', name: 'Violet' },
  { value: '#9810fa', name: 'Purple' },
  { value: '#a800b7', name: 'Fuchsia' },
  { value: '#e60076', name: 'Pink' },
  { value: '#ec003f', name: 'Rose' },
];

const BACKGROUND_COLOR_LIGHT_PRESETS = [
  { value: '#F4F5F7', name: 'Default', default: true },
  { value: '#ffffff', name: 'White' },
  { value: '#f1f5f9', name: 'Slate' },
  { value: '#e5e7eb', name: 'Gray' },
  { value: '#f4f4f5', name: 'Zinc' },
  { value: '#f5f5f5', name: 'Neutral' },
  { value: '#f5f5f4', name: 'Stone' },
  { value: '#f3f1f1', name: 'Taupe' },
  { value: '#f3f1f3', name: 'Mauve' },
  { value: '#f1f3f3', name: 'Mist' },
  { value: '#f4f4f0', name: 'Olive' },
  { value: 'oklch(from var(--aura-accent-color-light) 0.9 calc(c * 0.3) h)', name: 'Accent' },
];

const ACCENT_COLOR_DARK_PRESETS = [
  { value: '#3266e4', name: 'Default', default: true },
  { value: '#eeeeee', name: 'Neutral' },
  { value: '#fb2c36', name: 'Red' },
  { value: '#ff8904', name: 'Orange' },
  { value: '#fbbf24', name: 'Amber' },
  { value: '#ffdf20', name: 'Yellow' },
  { value: '#a3e635', name: 'Lime' },
  { value: '#00c950', name: 'Green' },
  { value: '#34d399', name: 'Emerald' },
  { value: '#2dd4bf', name: 'Teal' },
  { value: '#22d3ee', name: 'Cyan' },
  { value: '#00a6f4', name: 'Sky' },
  { value: '#2b7fff', name: 'Blue' },
  { value: '#615fff', name: 'Indigo' },
  { value: '#8e51ff', name: 'Violet' },
  { value: '#c27aff', name: 'Purple' },
  { value: '#e879f9', name: 'Fuchsia' },
  { value: '#f6339a', name: 'Pink' },
  { value: '#ff2056', name: 'Rose' },
];

const BACKGROUND_COLOR_DARK_PRESETS = [
  { value: '#151922', name: 'Default', default: true },
  { value: '#000000', name: 'Black' },
  { value: '#131822', name: 'Slate' },
  { value: '#15181f', name: 'Gray' },
  { value: '#18181b', name: 'Zinc' },
  { value: '#171717', name: 'Neutral' },
  { value: '#1c1917', name: 'Stone' },
  { value: '#1d1816', name: 'Taupe' },
  { value: '#1d161e', name: 'Mauve' },
  { value: '#161b1d', name: 'Mist' },
  { value: '#1d1d16', name: 'Olive' },
  { value: 'oklch(from var(--aura-accent-color-dark) 0.18 calc(c * 0.3) h)', name: 'Accent' },
];

const CONTRAST_OPTIONS = [
  { value: '0.25', label: 'Low' },
  { value: '1', label: 'Mid', default: true },
  { value: '2', label: 'High' },
];

const SURFACE_LEVEL_OPTIONS = [
  { value: '-0.5', label: 'Low' },
  { value: '1', label: 'Mid', default: true },
  { value: '2', label: 'High' },
];

const BASE_RADIUS_OPTIONS = [
  { value: '0', label: '', icon: './assets/rect.svg' },
  { value: '3', label: '', icon: './assets/round-rect.svg', default: true },
  { value: '4', label: '', icon: './assets/round-rect2.svg' },
  { value: '7', label: '', icon: './assets/round.svg' },
];

const BASE_SIZE_OPTIONS = [
  { value: '12', label: 'S' },
  { value: '16', label: 'M', default: true },
  { value: '20', label: 'L' },
];

const BASE_FONT_SIZE_OPTIONS = [
  { value: '13', label: 'XS' },
  { value: '14', label: 'S', default: true },
  { value: '15', label: 'M' },
  { value: '16', label: 'L' },
];

const OVERLAY_OPACITY_OPTIONS = [
  { value: '0.85', label: 'Translucent', default: true },
  { value: '1', label: 'Opaque' },
];

const APP_LAYOUT_INSET_OPTIONS = [
  { value: '0px', label: 'Off' },
  { value: '1.5vmin', label: 'On', default: true },
];

const getFontImportRule = (fontFamilyValue) => {
  const value = fontFamilyValue?.trim();
  if (!value) {
    return '';
  }

  const match = value.match(/['"]([^'"]+)['"]/u);
  const family = match?.[1] ?? '';
  const url = FONT_FAMILY_IMPORTS[family];
  if (!url) {
    return '';
  }

  return `@import url('${url}');`;
};

function useNavbar(useNavbar) {
  const drawerToggle = document.querySelector('vaadin-app-layout > header[slot] vaadin-drawer-toggle');
  if (useNavbar) {
    localStorage.setItem('aura-navbar', useNavbar);
    document.querySelector('vaadin-app-layout > header[slot]').setAttribute('slot', 'navbar');
    document.querySelector('vaadin-app-layout > footer[slot]').setAttribute('slot', 'navbar');
    document.querySelector('vaadin-app-layout > header[slot]').prepend(drawerToggle);
  } else {
    localStorage.removeItem('aura-navbar');
    document.querySelector('vaadin-app-layout > header[slot]').setAttribute('slot', 'drawer');
    document.querySelector('vaadin-app-layout > footer[slot]').setAttribute('slot', 'drawer');
    document.querySelector('vaadin-app-layout > header[slot]').append(drawerToggle);
  }
}

function randomFrom(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return null;
  }
  return values[Math.floor(Math.random() * values.length)];
}

function countDecimals(value) {
  const text = String(value);
  if (text.includes('e-')) {
    return Number(text.split('e-')[1]) || 0;
  }
  const index = text.indexOf('.');
  return index === -1 ? 0 : text.length - index - 1;
}

function randomSteppedValue(min, max, step) {
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) ? max : safeMin;
  const safeStep = Number.isFinite(step) && step > 0 ? step : 1;
  const steps = Math.max(0, Math.floor((safeMax - safeMin) / safeStep));
  const offset = Math.floor(Math.random() * (steps + 1));
  const decimals = countDecimals(safeStep);
  return Number((safeMin + offset * safeStep).toFixed(decimals));
}

function randomHexColor() {
  const value = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0');
  return `#${value}`;
}

function randomizeControl(control) {
  if (!control || control.isLocked) {
    return;
  }

  const vaadinSelect = control.querySelector('vaadin-select');
  if (vaadinSelect) {
    const presets = Array.isArray(control.presets) ? control.presets : [];
    if (presets.length) {
      const randomIndex = Math.floor(Math.random() * presets.length);
      vaadinSelect.dispatchEvent(
        new CustomEvent('value-changed', {
          detail: { value: `preset-${randomIndex}` },
          bubbles: true,
          composed: true,
        }),
      );
      return;
    }

    const values = Array.isArray(control.optionValues) ? control.optionValues : [];
    if (values.length) {
      const selected = randomFrom(values);
      if (selected != null) {
        vaadinSelect.dispatchEvent(
          new CustomEvent('value-changed', {
            detail: { value: selected },
            bubbles: true,
            composed: true,
          }),
        );
      }
    }
    return;
  }

  const range = control.querySelector('input[type="range"]');
  if (range) {
    const min = Number(range.min);
    const max = Number(range.max);
    const step = Number(range.step);
    range.value = String(randomSteppedValue(min, max, step));
    range.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    return;
  }

  const colorInput = control.querySelector('input[type="color"]');
  if (colorInput) {
    colorInput.value = randomHexColor();
    colorInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    return;
  }

  const select = control.querySelector('select');
  if (select && select.options.length) {
    const values = Array.from(select.options)
      .map((option) => option.value)
      .filter(Boolean);
    const selected = randomFrom(values);
    if (selected != null) {
      select.value = selected;
      select.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }
    return;
  }

  const radios = Array.from(control.querySelectorAll('input[type="radio"]'));
  if (radios.length) {
    const radio = randomFrom(radios);
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }
  }
}

function shuffleThemeControls(editorRoot) {
  const controls = editorRoot.querySelectorAll('#theme-editor .aura-theme-control');
  controls.forEach((control) => {
    randomizeControl(control);
  });
}

function getExportableCustomProperties(editorRoot) {
  const properties = new Set();

  editorRoot.querySelectorAll('#theme-editor [property]').forEach((el) => {
    const prop = el.getAttribute('property')?.trim();
    if (prop?.startsWith('--')) {
      properties.add(prop);
    }
  });

  properties.add('--aura-font-family');
  properties.add('--aura-content-color-scheme');
  properties.add('--aura-notification-color-scheme');
  properties.add('color-scheme');

  return properties;
}

function normalizePresetCssRules(rules) {
  if (typeof rules !== 'string') {
    return '';
  }

  return rules.trim();
}

function buildExportCssCode(editorRoot, presetRules = '') {
  const style = document.documentElement.style;
  const lines = [];

  Array.from(getExportableCustomProperties(editorRoot))
    .sort((a, b) => a.localeCompare(b))
    .forEach((prop) => {
      const value = style.getPropertyValue(prop).trim();
      if (value) {
        const shouldConvertColor = prop.includes('color') && prop !== 'color-scheme';
        const exportedValue = shouldConvertColor ? toHex(value) || value : value;
        lines.push(`  ${prop}: ${exportedValue};`);
      }
    });

  const fontImport = getFontImportRule(style.getPropertyValue('--aura-font-family'));
  const presetCssRules = normalizePresetCssRules(presetRules);

  if (!lines.length && !presetCssRules) {
    return '/* No modified custom properties found on html. */';
  }

  const imports = fontImport ? [fontImport] : [];
  const htmlBlock = lines.length ? [`html {\n${lines.join('\n')}\n}`] : [];
  const rulesBlock = presetCssRules ? [presetCssRules] : [];
  const blocks = [...imports, ...htmlBlock, ...rulesBlock];
  return blocks.join('\n\n');
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return true;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '-1000px';
  document.body.append(textarea);
  textarea.select();

  const copied = document.execCommand('copy');
  textarea.remove();
  return copied;
}

useNavbar(localStorage.getItem('aura-navbar') !== null);

customElements.define(
  'aura-theme-editor',
  class extends HTMLElement {
    _exportDialog;
    _exportTextArea;
    _copyButton;
    _exportValue = '';
    _activePresetRules = '';
    _applyingPreset = false;

    #ensureExportDialog() {
      if (this._exportDialog) {
        return this._exportDialog;
      }

      const dialog = document.createElement('vaadin-dialog');
      dialog.setAttribute('aria-label', 'Export theme CSS');

      dialog.renderer = (root) => {
        if (root.firstChild) {
          return;
        }

        const textArea = document.createElement('vaadin-text-area');
        textArea.ariaLabel = 'Copy these styles to your app';
        textArea.readonly = true;
        textArea.style.maxWidth = '100%';
        textArea.style.width = 'min(42rem, 86vw)';
        textArea.style.maxHeight = '100%';
        textArea.style.fontFamily = 'monospace';
        textArea.style.fontSize = '0.8em';
        textArea.style.lineHeight = '1.3';
        textArea.value = this._exportValue;

        root.append(textArea);

        this._exportTextArea = textArea;
      };

      dialog.headerTitle = 'Export Theme CSS';

      dialog.headerRenderer = (root) => {
        if (root.firstChild) {
          return;
        }

        const closeButton = document.createElement('vaadin-button');
        closeButton.textContent = 'Close';
        closeButton.setAttribute('theme', 'tertiary');
        closeButton.addEventListener('click', () => {
          dialog.opened = false;
        });

        root.append(closeButton);
      };

      dialog.footerRenderer = (root) => {
        if (root.firstChild) {
          return;
        }

        const copyButton = document.createElement('vaadin-button');
        copyButton.textContent = 'Copy';
        copyButton.setAttribute('theme', 'primary');
        copyButton.addEventListener('click', async () => {
          if (!this._exportTextArea) {
            return;
          }

          const originalText = copyButton.textContent;
          try {
            const copied = await copyText(this._exportTextArea.value);
            copyButton.textContent = copied ? 'Copied' : 'Copy failed';
          } catch (_error) {
            copyButton.textContent = 'Copy failed';
          }

          setTimeout(() => {
            copyButton.textContent = originalText;
          }, 1200);
        });

        root.append(copyButton);
        this._copyButton = copyButton;
      };

      document.body.append(dialog);
      this._exportDialog = dialog;
      return dialog;
    }

    #openExportDialog() {
      const dialog = this.#ensureExportDialog();
      this._exportValue = buildExportCssCode(this, this._activePresetRules);
      dialog.requestContentUpdate();

      if (this._exportTextArea) {
        this._exportTextArea.value = this._exportValue;
      }

      if (this._copyButton) {
        this._copyButton.textContent = 'Copy';
      }

      dialog.opened = true;
    }

    #renderPresetCards() {
      const strip = this.querySelector('#preset-strip');
      if (!strip) {
        return;
      }

      const presets = [DEFAULT_PRESET, ...THEME_EDITOR_PRESETS];
      render(html`${presets.map((preset) => this.#presetCardTemplate(preset))}`, strip);
    }

    #presetCardTemplate(preset) {
      const advanced = preset.advanced;
      const colorScheme = advanced?.colorSchemePreset;
      const isDarkPrimary = colorScheme === 'dark' || colorScheme === 'mixed';
      const showsOverlay = Boolean(advanced) && colorScheme !== 'light';
      const contentScheme = colorScheme === 'dark' ? 'dark' : 'light';
      const thumbnailStyle = styleMap(this.#thumbnailVars(advanced, contentScheme));

      return html`
        <button type="button" class="preset-card aura-surface" data-preset-id=${preset.id} aria-label=${preset.label}>
          <aura-preset-thumbnail
            class="aura-surface aura-accent-color"
            scheme=${isDarkPrimary ? 'dark' : 'light'}
            style=${thumbnailStyle}
          ></aura-preset-thumbnail>
          ${showsOverlay
            ? html`<aura-preset-thumbnail
                class="aura-surface aura-accent-color"
                overlay
                style=${thumbnailStyle}
              ></aura-preset-thumbnail>`
            : nothing}
          <span class="label">${preset.label}</span>
        </button>
      `;
    }

    #thumbnailVars(advanced, contentScheme) {
      const a = advanced ?? {};
      return {
        '--aura-content-color-scheme': contentScheme,
        '--aura-accent-color-light': a.accentColorLight ?? 'oklch(0.55 0.2 264)',
        '--aura-accent-color-dark': a.accentColorDark ?? 'oklch(0.55 0.2 264)',
        '--aura-background-color-light': a.backgroundColorLight ?? 'oklch(0.95 0.005 248)',
        '--aura-background-color-dark': a.backgroundColorDark ?? 'oklch(0.2 0.01 260)',
        '--aura-app-layout-inset': a.appLayoutInset ?? '1.5vmin',
        '--aura-base-radius': a.baseRadius ?? '3',
        '--aura-base-size': a.baseSize ?? '16',
        '--aura-base-font-size': a.baseFontSize ?? '14',
        '--aura-contrast-level': a.contrastLevel ?? '1',
        '--aura-surface-level': a.surfaceLevel ?? '1',
      };
    }

    #applyRuntimePresetRules(rules) {
      const normalizedRules = normalizePresetCssRules(rules);
      this._activePresetRules = normalizedRules;

      let styleEl = document.getElementById(PRESET_RUNTIME_STYLE_ID);
      if (!normalizedRules) {
        styleEl?.remove();
        return;
      }

      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = PRESET_RUNTIME_STYLE_ID;
        document.head.append(styleEl);
      }

      styleEl.textContent = normalizedRules;
    }

    #setExtraRules(value, { persist = true } = {}) {
      const normalized = normalizePresetCssRules(value);
      const textArea = this.querySelector('#extraRules');
      if (textArea && textArea.value !== normalized) {
        textArea.value = normalized;
      }

      this.#applyRuntimePresetRules(normalized);

      if (persist) {
        if (normalized) {
          localStorage.setItem(EXTRA_RULES_STORAGE_KEY, normalized);
        } else {
          localStorage.removeItem(EXTRA_RULES_STORAGE_KEY);
        }
      }

      this.#updateExportButtonState();
    }

    #restoreExtraRules() {
      const stored = localStorage.getItem(EXTRA_RULES_STORAGE_KEY);
      this.#setExtraRules(stored || '', { persist: false });
    }

    #getDefaultColorPresetValue(selector) {
      const control = this.querySelector(selector);
      const presets = Array.isArray(control?.presets) ? control.presets : [];
      return presets.find((entry) => entry.isDefault || entry.default)?.value ?? presets[0]?.value ?? null;
    }

    #getDefaultSegmentedValue(selector) {
      const control = this.querySelector(selector);
      const options = Array.isArray(control?.options) ? control.options : [];
      return options.find((option) => option.default)?.value ?? options[0]?.value ?? null;
    }

    #getDefaultFontFamilyValue() {
      const control = this.querySelector('aura-font-family-control');
      if (!control) {
        return '';
      }

      if (typeof control.defaultValue === 'string') {
        return control.defaultValue;
      }

      const values = Array.isArray(control.optionValues) ? control.optionValues : [];
      return values[0] ?? '';
    }

    #getAdvancedDefaultValues() {
      return {
        colorSchemePreset: 'light',
        accentColorLight: this.#getDefaultColorPresetValue('#accent-color-light-presets'),
        accentColorDark: this.#getDefaultColorPresetValue('#accent-color-dark-presets'),
        backgroundColorLight: this.#getDefaultColorPresetValue('#background-color-light-presets'),
        backgroundColorDark: this.#getDefaultColorPresetValue('#background-color-dark-presets'),
        contrastLevel: this.#getDefaultSegmentedValue('#contrast-control'),
        surfaceLevel: this.#getDefaultSegmentedValue('#surface-level-control'),
        overlayOpacity: this.#getDefaultSegmentedValue('#overlay-opacity-control'),
        appLayoutInset: this.#getDefaultSegmentedValue('#app-layout-inset-control'),
        baseRadius: this.#getDefaultSegmentedValue('#base-radius-control'),
        baseSize: this.#getDefaultSegmentedValue('#base-size-control'),
        baseFontSize: this.#getDefaultSegmentedValue('#base-font-size-control'),
        fontFamily: this.#getDefaultFontFamilyValue(),
      };
    }

    #setThemeSchemePreset(value) {
      const control = this.querySelector('aura-theme-scheme-control');

      const targetValue = value || 'light';
      const input = control.querySelector(`input[type="radio"][value="${targetValue}"]`);
      if (!input) {
        return;
      }

      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }

    #setColorPresetValue(selector, value) {
      const control = this.querySelector(selector);

      const select = control?.querySelector('vaadin-select');
      const presets = Array.isArray(control?.presets) ? control.presets : [];
      if (!select || !presets.length) {
        return;
      }

      let index = -1;
      if (value == null) {
        index = presets.findIndex((entry) => entry.default);
      } else {
        index = presets.findIndex((entry) => entry.value === value);
      }

      if (index < 0) {
        index = presets.findIndex((entry) => entry.default);
      }
      if (index < 0) {
        index = 0;
      }

      select.dispatchEvent(
        new CustomEvent('value-changed', {
          detail: { value: `preset-${index}` },
          bubbles: true,
          composed: true,
        }),
      );
    }

    #setSegmentedControlValue(selector, value) {
      const control = this.querySelector(selector);

      control.value = String(value);
    }

    #setFontFamilyValue(value) {
      const control = this.querySelector('aura-font-family-control');

      if (typeof control.applyValue === 'function') {
        control.applyValue(value, { source: 'preset' });
        return;
      }

      const select = control.querySelector('vaadin-select');
      const allowedValues = Array.isArray(control.optionValues) ? control.optionValues : [];
      if (!select || !allowedValues.length) {
        return;
      }

      const defaultValue = typeof control.defaultValue === 'string' ? control.defaultValue : allowedValues[0];
      const target = allowedValues.includes(value) ? value : defaultValue;
      select.dispatchEvent(
        new CustomEvent('value-changed', {
          detail: { value: target },
          bubbles: true,
          composed: true,
        }),
      );
    }

    #applyAdvancedValues(values) {
      this.#setThemeSchemePreset(values.colorSchemePreset);
      this.#setColorPresetValue('#accent-color-light-presets', values.accentColorLight);
      this.#setColorPresetValue('#accent-color-dark-presets', values.accentColorDark);
      this.#setColorPresetValue('#background-color-light-presets', values.backgroundColorLight);
      this.#setColorPresetValue('#background-color-dark-presets', values.backgroundColorDark);
      this.#setSegmentedControlValue('#contrast-control', values.contrastLevel);
      this.#setSegmentedControlValue('#surface-level-control', values.surfaceLevel);
      this.#setSegmentedControlValue('#overlay-opacity-control', values.overlayOpacity);
      this.#setSegmentedControlValue('#app-layout-inset-control', values.appLayoutInset);
      this.#setSegmentedControlValue('#base-radius-control', values.baseRadius);
      this.#setSegmentedControlValue('#base-size-control', values.baseSize);
      this.#setSegmentedControlValue('#base-font-size-control', values.baseFontSize);
      this.#setFontFamilyValue(values.fontFamily);
    }

    #applyPreset(presetId) {
      if (presetId === DEFAULT_PRESET_ID) {
        this._applyingPreset = true;
        try {
          this.#applyAdvancedValues(this.#getAdvancedDefaultValues());
          this.#setExtraRules('', { persist: true });
        } finally {
          this._applyingPreset = false;
        }

        this.#updateExportButtonState();
        return;
      }

      const preset = getThemeEditorPresetById(presetId);
      if (!preset) {
        return;
      }

      this._applyingPreset = true;
      try {
        const nextValues = { ...this.#getAdvancedDefaultValues(), ...(preset.advanced || {}) };
        this.#applyAdvancedValues(nextValues);
        this.#setExtraRules(preset.extraRules || '', { persist: true });
      } finally {
        this._applyingPreset = false;
      }

      this.#updateExportButtonState();
    }

    #isColorPresetControlAtDefault(selector) {
      const control = this.querySelector(selector);
      if (!control) {
        return true;
      }

      const property = control.getAttribute('property')?.trim();
      if (!property) {
        return true;
      }

      return document.documentElement.style.getPropertyValue(property).trim() === '';
    }

    #isSegmentedControlAtDefault(selector) {
      const control = this.querySelector(selector);
      if (!control) {
        return true;
      }

      const options = Array.isArray(control.options) ? control.options : [];
      const defaultValue = options.find((option) => option.default)?.value ?? options[0]?.value;
      if (defaultValue == null) {
        return true;
      }

      return String(control.value ?? '') === String(defaultValue);
    }

    #isThemeSchemeDefault() {
      const control = this.querySelector('aura-theme-scheme-control');
      if (!control) {
        return true;
      }

      const lightRadio = control.querySelector('input[type="radio"][value="light"]');
      return lightRadio?.checked ?? localStorage.getItem('aura:theme-scheme:preset') == null;
    }

    #isFontFamilyDefault() {
      const control = this.querySelector('aura-font-family-control');
      if (!control) {
        return true;
      }

      const defaultValue = this.#getDefaultFontFamilyValue();
      const stored = localStorage.getItem('aura:font-family:--aura-font-family');
      const currentValue = typeof control.value === 'string' ? control.value : '';
      if (stored == null) {
        return currentValue === defaultValue;
      }

      return stored === defaultValue;
    }

    #areAdvancedControlsAtDefaults() {
      return (
        this.#isThemeSchemeDefault() &&
        this.#isColorPresetControlAtDefault('#accent-color-light-presets') &&
        this.#isColorPresetControlAtDefault('#accent-color-dark-presets') &&
        this.#isColorPresetControlAtDefault('#background-color-light-presets') &&
        this.#isColorPresetControlAtDefault('#background-color-dark-presets') &&
        this.#isSegmentedControlAtDefault('#contrast-control') &&
        this.#isSegmentedControlAtDefault('#surface-level-control') &&
        this.#isSegmentedControlAtDefault('#overlay-opacity-control') &&
        this.#isSegmentedControlAtDefault('#app-layout-inset-control') &&
        this.#isSegmentedControlAtDefault('#base-radius-control') &&
        this.#isSegmentedControlAtDefault('#base-size-control') &&
        this.#isSegmentedControlAtDefault('#base-font-size-control') &&
        this.#isFontFamilyDefault()
      );
    }

    #updateExportButtonState() {
      if (this._applyingPreset) {
        return;
      }

      const exportButton = this.querySelector('#exportTheme');
      if (!exportButton) {
        return;
      }

      const advancedDefaults = this.#areAdvancedControlsAtDefaults();
      exportButton.disabled = advancedDefaults && !this._activePresetRules;
    }

    connectedCallback() {
      this.innerHTML = `
        <style>
          aura-theme-editor {
            display: contents;
          }

          #theme-editor-btn {
            position: fixed;
            z-index: 100;
            bottom: 1rem;
            right: 1rem;
            width: 40px;
            height: 40px;
            font-size: 1rem;
            box-shadow: var(--aura-shadow-m);
          }

          #theme-editor {
            --aura-base-font-size: 13;
            --aura-base-size: 14;

            &::part(content) {
              display: flex;
              flex-direction: column;
              gap: var(--vaadin-gap-l);
              padding: var(--vaadin-padding-l);
              width: min(440px, 92vw);
              max-width: 100%;
            }

            #preset-strip {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
              gap: var(--vaadin-gap-s);
              flex: none;
              padding-block: var(--vaadin-padding-s);
            }

            .preset-card {
              all: unset;
              box-sizing: border-box;
              border-radius: 8px;
              border: 2px solid transparent;
              padding: var(--vaadin-padding-xs);
              display: grid;
              gap: var(--vaadin-gap-s);
              cursor: pointer;
              color: var(--vaadin-text-color-secondary);
              transition: border-color 120ms, box-shadow 120ms, color 120ms;
              --aura-surface-level: 9;
            }

            .preset-card:is(:hover, :focus-visible) {
              color: var(--vaadin-text-color);
              background: var(--aura-surface-color) padding-box;
              border-color: var(--vaadin-focus-ring-color);
              box-shadow: var(--aura-shadow-s);
            }

            .preset-card:focus-visible {
              outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
              outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
            }

            .preset-card::before {
              content: "";
              z-index: 1;
              grid-row: 1;
              grid-column: 1;
              width: 100%;
              height: 100%;
              outline: 1px solid var(--vaadin-border-color);
              outline-offset: -1px;
              border-radius: 5px;
            }

            .preset-card .label {
              font-size: 0.83rem;
              font-weight: var(--aura-font-weight-medium);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            vaadin-accordion {
              min-height: 0;
              display: flex;
              flex-direction: column;
              gap: var(--vaadin-gap-s);
            }

            vaadin-accordion-heading {
              font-size: var(--aura-font-size-l);
              font-weight: var(--aura-font-weight-semibold);
              padding-inline: var(--vaadin-padding-s);
              margin-inline: calc(var(--vaadin-padding-s) * -1);
            }

            vaadin-accordion-panel::part(content) {
              padding-inline: var(--vaadin-padding-l);
              margin-inline: calc(var(--vaadin-padding-l) * -1);
            }

            vaadin-accordion-panel,
            vaadin-details {
              display: grid;
              grid-template-rows: min-content 0fr;
              transition: grid-template-rows 300ms;
              min-height: 0;
              flex: none;
            }

            :is(vaadin-details, vaadin-accordion-panel)[opened] {
              grid-template-rows: min-content 1fr;
              flex: 1;
            }

            :is(vaadin-details, vaadin-accordion-panel)::part(content) {
              overflow: auto;
              min-height: 0;
              transition: display 300ms, opacity 300ms;
              transition-behavior: allow-discrete;
            }

            :is(vaadin-details, vaadin-accordion-panel):not([opened])::part(content) {
              opacity: 0;
            }

            #advanced-controls {
              display: grid;
              --grid-cols: repeat(auto-fill, minmax(150px, 1fr));
              grid-template-columns: var(--grid-cols);
              gap: var(--vaadin-gap-l);
              align-items: baseline;
              --lock-button-display: inline-flex;
              padding-bottom: var(--vaadin-padding-m);
            }

            #advanced-controls fieldset,
            #advanced-controls aura-theme-scheme-control .control {
              grid-column: 1 / -1;
            }

            .custom-css {
              margin-block: var(--vaadin-gap-s);

              &:not([opened]):has([has-value]) > vaadin-details-summary::part(content) {
                display: flex;
                gap: 1em;
              }

              &:not([opened]):has([has-value]) > vaadin-details-summary::part(content)::after {
                content: "Edited";
                color: var(--aura-accent-text-color);
                font-weight: var(--aura-font-weight-semibold);
              }
            }

            #extraRules {
              width: 100%;
              --vaadin-input-field-border-width: 0px;
              --vaadin-input-field-background: transparent;

              &::part(input-field) {
                outline-offset: -2px;
              }

              textarea {
                font-family: monospace;
                white-space: pre;
              }
            }

            vaadin-button:is(.lock, .reset) {
              transition: opacity 80ms;
            }

            .aura-theme-control:not(:hover, :has(:focus-visible), [data-locked]) vaadin-button.lock,
            .aura-theme-control:not(:hover, :has(:focus-visible)) vaadin-button.reset {
              opacity: 0;
            }

            #exportTheme {
              width: 100%;
            }

            .section-customize vaadin-accordion-heading::part(content) {
              width: 100%;
            }

            .section-customize:not([opened]) > vaadin-accordion-heading > vaadin-button {
              visibility: hidden;
            }

            .section-customize vaadin-button:first-of-type {
              margin-inline-start: auto;
            }
          }
        </style>
        <vaadin-button theme="primary" id="theme-editor-btn" aria-label="Edit Theme" class="aura-accent-color">
          <vaadin-icon src="./assets/lucide-icons/paint-brush.svg"></vaadin-icon>
          <vaadin-tooltip slot="tooltip" text="Edit Theme"></vaadin-tooltip>
        </vaadin-button>
        <vaadin-popover opened for="theme-editor-btn" id="theme-editor" position="top-start" theme="arrow">
          <vaadin-accordion>
            <vaadin-accordion-panel summary="Choose a Preset" theme="no-padding">
              <div id="preset-strip" aria-label="Theme presets"></div>
            </vaadin-accordion-panel>
            <vaadin-accordion-panel summary="Customize" theme="no-padding" class="section-customize">
              <vaadin-accordion-heading slot="summary">
                Customize
                <vaadin-button id="shuffleAll" theme="tertiary small">
                  <vaadin-icon slot="prefix" src="./assets/lucide-icons/shuffle.svg"></vaadin-icon>
                  Randomize
                  <vaadin-tooltip slot="tooltip" text="Randomize all unlocked controls"></vaadin-tooltip>
              </vaadin-button>
              <vaadin-button id="resetAll" theme="tertiary small">
                  <vaadin-icon slot="prefix" src="./assets/lucide-icons/rotate-ccw.svg"></vaadin-icon>
                  Reset
                  <vaadin-tooltip slot="tooltip" text="Reset all controls to defaults"></vaadin-tooltip>
              </vaadin-button>
              </vaadin-accordion-heading>
              <div id="advanced-controls">
                <aura-theme-scheme-control label="Color Scheme"></aura-theme-scheme-control>
                <aura-color-preset-control
                  id="accent-color-light-presets"
                  property="--aura-accent-color-light"
                  label="Accent - Light"
                ></aura-color-preset-control>
                <aura-color-preset-control
                  id="accent-color-dark-presets"
                  property="--aura-accent-color-dark"
                  label="Accent - Dark"
                ></aura-color-preset-control>
                <aura-color-preset-control
                  id="background-color-light-presets"
                  property="--aura-background-color-light"
                  label="Background - Light"
                ></aura-color-preset-control>
                <aura-color-preset-control
                  id="background-color-dark-presets"
                  property="--aura-background-color-dark"
                  label="Background - Dark"
                ></aura-color-preset-control>
                <aura-segmented-control id="contrast-control" property="--aura-contrast-level" label="Contrast"></aura-segmented-control>
                <aura-segmented-control id="surface-level-control" property="--aura-surface-level" label="Surface Level"></aura-segmented-control>
                <aura-segmented-control id="overlay-opacity-control" property="--aura-overlay-surface-opacity" label="Overlays"></aura-segmented-control>
                <aura-segmented-control id="app-layout-inset-control" property="--aura-app-layout-inset" label="Layout Inset"></aura-segmented-control>
                <aura-segmented-control id="base-radius-control" property="--aura-base-radius" label="Border Radius"></aura-segmented-control>
                <aura-segmented-control id="base-size-control" property="--aura-base-size" label="Density"></aura-segmented-control>
                <aura-segmented-control id="base-font-size-control" property="--aura-base-font-size" label="Font Size"></aura-segmented-control>
                <aura-font-family-control label="Font Family"></aura-font-family-control>
              </div>
              <vaadin-details summary="Additional CSS" theme="no-padding reverse filled" class="custom-css">
                <vaadin-text-area id="extraRules" aria-label="Custom CSS" placeholder="Write custom CSS rules"></vaadin-text-area>
              </vaadin-details>
            </vaadin-accordion-panel>
          </vaadin-accordion>
          <vaadin-button id="exportTheme" theme="primary" aria-label="Export theme CSS">Export Theme CSS</vaadin-button>
          <vaadin-checkbox label="Preview Navbar" id="useNavbar"></vaadin-checkbox>
        </vaadin-popover>
    `;

      this.querySelector('#exportTheme').addEventListener('click', () => {
        this.#openExportDialog();
      });

      this.querySelector('#extraRules').addEventListener('value-changed', (event) => {
        this.#setExtraRules(event.detail.value, { persist: true });
      });

      this.querySelector('#preset-strip').addEventListener('click', (event) => {
        const trigger = event.target.closest('.preset-card');
        if (!trigger) {
          return;
        }

        this.#applyPreset(trigger.dataset.presetId || '');
      });

      const useNavbarToggle = this.querySelector('#useNavbar');
      useNavbarToggle.addEventListener('change', (e) => {
        useNavbar(e.target.checked);
      });

      useNavbarToggle.checked = localStorage.getItem('aura-navbar') !== null;

      this.addEventListener(
        'value-change',
        (event) => {
          if (!(event.target instanceof HTMLElement)) {
            return;
          }

          if (event.target.closest('#advanced-controls')) {
            this.#updateExportButtonState();
          }
        },
        { capture: true },
      );

      this.querySelector('#accent-color-light-presets').presets = ACCENT_COLOR_LIGHT_PRESETS;

      this.querySelector('#background-color-light-presets').presets = BACKGROUND_COLOR_LIGHT_PRESETS;

      this.querySelector('#accent-color-dark-presets').presets = ACCENT_COLOR_DARK_PRESETS;

      this.querySelector('#background-color-dark-presets').presets = BACKGROUND_COLOR_DARK_PRESETS;

      this.querySelector('#contrast-control').options = CONTRAST_OPTIONS;

      this.querySelector('#surface-level-control').options = SURFACE_LEVEL_OPTIONS;

      this.querySelector('#base-radius-control').options = BASE_RADIUS_OPTIONS;

      this.querySelector('#base-size-control').options = BASE_SIZE_OPTIONS;

      this.querySelector('#base-font-size-control').options = BASE_FONT_SIZE_OPTIONS;

      this.querySelector('#overlay-opacity-control').options = OVERLAY_OPACITY_OPTIONS;

      this.querySelector('#app-layout-inset-control').options = APP_LAYOUT_INSET_OPTIONS;

      this.#renderPresetCards();
      this.#restoreExtraRules();
      this.#updateExportButtonState();

      this.querySelector('#shuffleAll').addEventListener('click', (e) => {
        shuffleThemeControls(this);
        this.#updateExportButtonState();
        e.stopPropagation();
      });

      this.querySelector('#resetAll').addEventListener('click', (e) => {
        this.#applyPreset(DEFAULT_PRESET_ID);
        this.#updateExportButtonState();
        e.stopPropagation();
      });
    }

    disconnectedCallback() {
      if (this._exportDialog) {
        this._exportDialog.remove();
        this._exportDialog = null;
        this._exportTextArea = null;
        this._copyButton = null;
      }
    }
  },
);
