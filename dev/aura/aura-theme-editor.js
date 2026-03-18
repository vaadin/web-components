import './aura-color-preset-control.js';
import './aura-font-family-control.js';
import './aura-number-control.js';
import './aura-segmented-control.js';
import './aura-theme-scheme-control.js';
import '@vaadin/dialog';
import '@vaadin/text-area';
import { toHexColor } from './aura-color-control.js';

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

function clearLocalStorage() {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (/^aura/u.test(key)) {
      localStorage.removeItem(key);
    }
  }
}

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

function buildExportCssCode(editorRoot) {
  const style = document.documentElement.style;
  const lines = [];

  Array.from(getExportableCustomProperties(editorRoot))
    .sort((a, b) => a.localeCompare(b))
    .forEach((prop) => {
      const value = style.getPropertyValue(prop).trim();
      if (value) {
        const shouldConvertColor = prop.includes('color') && prop !== 'color-scheme';
        const exportedValue = shouldConvertColor ? toHexColor(value) || value : value;
        lines.push(`  ${prop}: ${exportedValue};`);
      }
    });

  const fontImport = getFontImportRule(style.getPropertyValue('--aura-font-family'));

  if (!lines.length) {
    return '/* No modified custom properties found on html. */';
  }

  const imports = fontImport ? `${fontImport}\n\n` : '';
  return `${imports}html {\n${lines.join('\n')}\n}`;
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
      this._exportValue = buildExportCssCode(this);
      dialog.requestContentUpdate();

      if (this._exportTextArea) {
        this._exportTextArea.value = this._exportValue;
      }

      if (this._copyButton) {
        this._copyButton.textContent = 'Copy';
      }

      dialog.opened = true;
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
            --aura-base-font-size: 13; --aura-base-size: 14;

            &::part(content) {
              display: grid;
              gap: var(--vaadin-gap-l);
              padding: var(--vaadin-padding-l);
              --grid-cols: repeat(auto-fill, minmax(150px, 1fr));
              grid-template-columns: var(--grid-cols);
              width: 400px;
              max-width: 100%;
              align-items: baseline;
              --lock-button-display: inline-flex;
            }

            fieldset {
              grid-column: 1 / -1;
              border: 0;
              padding: 0;
              margin: 0;
              display: grid;
              grid-template-columns: var(--grid-cols);
              gap: var(--vaadin-gap-l);

              label {
                font-weight: var(--aura-font-weight-regular) !important;
                color: var(--vaadin-text-color-secondary);
              }
            }

            legend {
              padding: 0;
              font-weight: var(--aura-font-weight-medium);
            }

            vaadin-button:is(.lock, .reset) {
              transition: opacity 80ms;
            }

            .aura-theme-control:not(:hover, :has(:focus-visible), [data-locked]) vaadin-button.lock,
            .aura-theme-control:not(:hover, :has(:focus-visible)) vaadin-button.reset {
              opacity: 0;
            }
          }
        </style>
        <vaadin-button theme="primary" id="theme-editor-btn" aria-label="Edit Theme" class="aura-accent-color">
          <vaadin-icon src="./assets/lucide-icons/paint-brush.svg"></vaadin-icon>
          <vaadin-tooltip slot="tooltip" text="Edit Theme"></vaadin-tooltip>
        </vaadin-button>
        <vaadin-popover opened for="theme-editor-btn" id="theme-editor" position="top-start" theme="arrow">
          <div style="display: flex; align-items: baseline; gap: 0.5em;">
            <h4>Theme</h4>
            <vaadin-button id="shuffleAll" theme="tertiary" aria-label="Shuffle">
              <vaadin-icon src="./assets/lucide-icons/shuffle.svg"></vaadin-icon>
              <vaadin-tooltip text="Shuffle unlocked controls" slot="tooltip"></vaadin-tooltip>
            </vaadin-button>
            <vaadin-button id="resetAll" theme="tertiary" aria-label="Reset">
              <vaadin-icon src="./assets/lucide-icons/rotate-ccw.svg"></vaadin-icon>
              <vaadin-tooltip text="Reset all back to default" slot="tooltip"></vaadin-tooltip>
            </vaadin-button>
            <vaadin-button id="exportTheme" theme="tertiary" aria-label="Export">
              <vaadin-icon src="./assets/lucide-icons/file-down.svg"></vaadin-icon>
              <vaadin-tooltip text="Export CSS" slot="tooltip"></vaadin-tooltip>
            </vaadin-button>
          </div>
          <vaadin-checkbox label="Use Navbar" id="useNavbar"></vaadin-checkbox>
          <aura-theme-scheme-control label="Color Scheme" class="span"></aura-theme-scheme-control>
          <fieldset>
            <legend>Accent Color</legend>
            <aura-color-preset-control
              id="accent-color-light-presets"
              property="--aura-accent-color-light"
              label="Light"
            ></aura-color-preset-control>
            <aura-color-preset-control
            id="accent-color-dark-presets"
            property="--aura-accent-color-dark"
            label="Dark"
            ></aura-color-preset-control>
            </fieldset>
            <fieldset>
            <legend>Background Color</legend>
            <aura-color-preset-control
              id="background-color-light-presets"
              property="--aura-background-color-light"
              label="Light"
            ></aura-color-preset-control>
            <aura-color-preset-control
              id="background-color-dark-presets"
              property="--aura-background-color-dark"
              label="Dark"
            ></aura-color-preset-control>
          </fieldset>
          <aura-segmented-control id="contrast-control" property="--aura-contrast-level" label="Contrast"></aura-segmented-control>
          <aura-segmented-control id="surface-level-control" property="--aura-surface-level" label="Surface Level"></aura-segmented-control>
          <aura-segmented-control id="overlay-opacity-control" property="--aura-overlay-surface-opacity" label="Overlays"></aura-segmented-control>
          <aura-segmented-control id="app-layout-inset-control" property="--aura-app-layout-inset" label="Layout Inset"></aura-segmented-control>
          <aura-segmented-control id="base-radius-control" property="--aura-base-radius" label="Border Radius"></aura-segmented-control>
          <aura-segmented-control id="base-size-control" property="--aura-base-size" label="Density"></aura-segmented-control>
          <aura-segmented-control id="base-font-size-control" property="--aura-base-font-size" label="Font Size"></aura-segmented-control>
          <aura-font-family-control label="Font Family"></aura-font-family-control>
        </vaadin-popover>
    `;

      this.querySelector('#resetAll').addEventListener('click', () => {
        clearLocalStorage();
        window.location.reload();
      });

      this.querySelector('#shuffleAll').addEventListener('click', () => {
        shuffleThemeControls(this);
      });

      this.querySelector('#exportTheme').addEventListener('click', () => {
        this.#openExportDialog();
      });

      const useNavbarToggle = this.querySelector('#useNavbar');
      useNavbarToggle.addEventListener('change', (e) => {
        useNavbar(e.target.checked);
      });

      useNavbarToggle.checked = localStorage.getItem('aura-navbar') !== null;

      this.querySelector('#accent-color-light-presets').presets = [
        { value: '#3266e4', name: 'Default', default: true },
        { value: '#222222', name: 'Neutral' },
        { value: '#e7000b', name: 'Red' },
        { value: '#ca3500', name: 'Orange' },
        { value: '#e17100', name: 'Amber' },
        { value: '#efb100', name: 'Yellow' },
        { value: '#497d00', name: 'Lime' },
        { value: '#008236', name: 'Green' },
        { value: '#009966', name: 'Emerald' },
        { value: '#009689', name: 'Teal' },
        { value: '#0092b8', name: 'Cyan' },
        { value: '#0084d1', name: 'Sky' },
        { value: '#155dfc', name: 'Blue' },
        { value: '#4f39f6', name: 'Indigo' },
        { value: '#7f22fe', name: 'Violet' },
        { value: '#9810fa', name: 'Purple' },
        { value: '#a800b7', name: 'Fuchsia' },
        { value: '#c6005c', name: 'Pink' },
        { value: '#ec003f', name: 'Rose' },
      ];

      this.querySelector('#background-color-light-presets').presets = [
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

      this.querySelector('#accent-color-dark-presets').presets = [
        { value: '#3266e4', name: 'Default', default: true },
        { value: '#eeeeee', name: 'Neutral' },
        { value: '#F87171', name: 'Red' },
        { value: '#FB923C', name: 'Orange' },
        { value: '#FBBF24', name: 'Amber' },
        { value: '#FACC15', name: 'Yellow' },
        { value: '#A3E635', name: 'Lime' },
        { value: '#4ADE80', name: 'Green' },
        { value: '#34D399', name: 'Emerald' },
        { value: '#2DD4BF', name: 'Teal' },
        { value: '#22D3EE', name: 'Cyan' },
        { value: '#38BDF8', name: 'Sky' },
        { value: '#60A5FA', name: 'Blue' },
        { value: '#818CF8', name: 'Indigo' },
        { value: '#A78BFA', name: 'Violet' },
        { value: '#C084FC', name: 'Purple' },
        { value: '#E879F9', name: 'Fuchsia' },
        { value: '#F472B6', name: 'Pink' },
        { value: '#FB7185', name: 'Rose' },
      ];

      this.querySelector('#background-color-dark-presets').presets = [
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

      this.querySelector('#contrast-control').options = [
        { value: '0.25', label: 'Low' },
        { value: '1', label: 'Mid', default: true },
        { value: '2', label: 'High' },
      ];

      this.querySelector('#surface-level-control').options = [
        { value: '-0.5', label: 'Low' },
        { value: '1', label: 'Mid', default: true },
        { value: '2', label: 'High' },
      ];

      this.querySelector('#base-radius-control').options = [
        { value: '0', label: '', icon: './assets/rect.svg' },
        { value: '3', label: '', icon: './assets/round-rect.svg', default: true },
        { value: '4', label: '', icon: './assets/round-rect2.svg' },
        { value: '7', label: '', icon: './assets/round.svg' },
      ];

      this.querySelector('#base-size-control').options = [
        { value: '12', label: 'S' },
        { value: '16', label: 'M', default: true },
        { value: '20', label: 'L' },
      ];

      this.querySelector('#base-font-size-control').options = [
        { value: '13', label: 'XS' },
        { value: '14', label: 'S', default: true },
        { value: '15', label: 'M' },
        { value: '16', label: 'L' },
      ];

      this.querySelector('#overlay-opacity-control').options = [
        { value: '0.85', label: 'Translucent', default: true },
        { value: '1', label: 'Opaque' },
      ];

      this.querySelector('#app-layout-inset-control').options = [
        { value: '0px', label: 'Off' },
        { value: '1.5vmin', label: 'On', default: true },
      ];
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
