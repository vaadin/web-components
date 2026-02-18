import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/rich-text-editor/src/vaadin-rich-text-editor.js';

// TODO: --vaadin-rich-text-editor-toolbar-button-background fails because Aura theme sets
// this property to transparent in :where(:root), :where(:host) in rich-text-editor.css:6,
// which overrides custom values set on the host.
//
// TODO: --vaadin-rich-text-editor-toolbar-button-text-color fails because Aura theme sets
// it to var(--vaadin-text-color-disabled) on vaadin-rich-text-editor:not(:focus-within)
// in rich-text-editor.css:20, which overrides custom values set on the host.

/**
 * Opens the color popup and returns the popup overlay element.
 */
async function openColorPopup(element) {
  const colorBtn = element.shadowRoot.querySelector('[part~="toolbar-button-color"]');
  colorBtn.click();
  const popup = element.querySelector('[slot="color-popup"]');
  const overlay = popup.shadowRoot.querySelector('vaadin-rich-text-editor-popup-overlay');
  await oneEvent(overlay, 'vaadin-overlay-open');
  await nextRender();
  return { popup, overlay };
}

export const props = [
  // === Editor Background ===
  {
    name: '--vaadin-rich-text-editor-background',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      const container = element.shadowRoot.querySelector('.vaadin-rich-text-editor-container');
      return getComputedStyle(container).getPropertyValue('background-color').trim();
    },
  },

  // === Content Area ===
  {
    name: '--vaadin-rich-text-editor-content-color',
    value: 'rgb(0, 255, 0)',
    compute(element) {
      const editor = element.shadowRoot.querySelector('.ql-editor');
      return getComputedStyle(editor).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-rich-text-editor-content-font-size',
    value: '24px',
    compute(element) {
      const editor = element.shadowRoot.querySelector('.ql-editor');
      return getComputedStyle(editor).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-rich-text-editor-content-line-height',
    value: '40px',
    compute(element) {
      const editor = element.shadowRoot.querySelector('.ql-editor');
      return getComputedStyle(editor).getPropertyValue('line-height').trim();
    },
  },
  {
    name: '--vaadin-rich-text-editor-content-padding',
    value: '20px',
    compute(element) {
      const editor = element.shadowRoot.querySelector('.ql-editor');
      return getComputedStyle(editor).getPropertyValue('padding').trim();
    },
  },

  // === Toolbar ===
  {
    name: '--vaadin-rich-text-editor-toolbar-background',
    value: 'rgb(0, 0, 255)',
    compute(element) {
      const toolbar = element.shadowRoot.querySelector('[part="toolbar"]');
      return getComputedStyle(toolbar).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-rich-text-editor-toolbar-gap',
    value: '30px',
    compute(element) {
      const toolbar = element.shadowRoot.querySelector('[part="toolbar"]');
      return getComputedStyle(toolbar).getPropertyValue('gap').trim();
    },
  },
  {
    name: '--vaadin-rich-text-editor-toolbar-padding',
    value: '20px',
    compute(element) {
      const toolbar = element.shadowRoot.querySelector('[part="toolbar"]');
      return getComputedStyle(toolbar).getPropertyValue('padding').trim();
    },
  },

  // === Toolbar Buttons ===
  {
    name: '--vaadin-rich-text-editor-toolbar-button-background',
    value: 'rgb(100, 150, 200)',
    compute(element) {
      const button = element.shadowRoot.querySelector('[part~="toolbar-button"]');
      return getComputedStyle(button).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-rich-text-editor-toolbar-button-border-color',
    value: 'rgb(255, 100, 0)',
    compute(element) {
      const button = element.shadowRoot.querySelector('[part~="toolbar-button"]');
      return getComputedStyle(button).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-rich-text-editor-toolbar-button-border-radius',
    value: '20px',
    compute(element) {
      const button = element.shadowRoot.querySelector('[part~="toolbar-button"]');
      return getComputedStyle(button).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-rich-text-editor-toolbar-button-border-width',
    value: '5px',
    compute(element) {
      const button = element.shadowRoot.querySelector('[part~="toolbar-button"]');
      return getComputedStyle(button).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-rich-text-editor-toolbar-button-padding',
    value: '15px',
    compute(element) {
      const button = element.shadowRoot.querySelector('[part~="toolbar-button"]');
      return getComputedStyle(button).getPropertyValue('padding').trim();
    },
  },
  {
    name: '--vaadin-rich-text-editor-toolbar-button-text-color',
    value: 'rgb(50, 100, 150)',
    compute(element) {
      const button = element.shadowRoot.querySelector('[part~="toolbar-button"]');
      return getComputedStyle(button).getPropertyValue('color').trim();
    },
  },

  // === Overlay ===
  {
    name: '--vaadin-rich-text-editor-overlay-padding',
    value: '20px',
    async setup(element) {
      await openColorPopup(element);
    },
    compute(element) {
      const popup = element.querySelector('[slot="color-popup"]');
      const overlay = popup.shadowRoot.querySelector('vaadin-rich-text-editor-popup-overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('padding').trim();
    },
  },
  {
    name: '--vaadin-rich-text-editor-overlay-gap',
    value: '15px',
    async setup(element) {
      await openColorPopup(element);
    },
    compute(element) {
      const popup = element.querySelector('[slot="color-popup"]');
      const overlay = popup.shadowRoot.querySelector('vaadin-rich-text-editor-popup-overlay');
      const content = overlay.shadowRoot.querySelector('[part="content"]');
      return getComputedStyle(content).getPropertyValue('gap').trim();
    },
  },
  {
    name: '--vaadin-rich-text-editor-overlay-color-option-border-color',
    value: 'rgb(255, 0, 255)',
    async setup(element) {
      await openColorPopup(element);
    },
    compute(element) {
      const popup = element.querySelector('[slot="color-popup"]');
      const button = popup.querySelector('button:nth-of-type(2)');
      return getComputedStyle(button).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-rich-text-editor-overlay-color-option-border-radius',
    value: '5px',
    async setup(element) {
      await openColorPopup(element);
    },
    compute(element) {
      const popup = element.querySelector('[slot="color-popup"]');
      const button = popup.querySelector('button:nth-of-type(2)');
      return getComputedStyle(button).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-rich-text-editor-overlay-color-option-border-width',
    value: '3px',
    async setup(element) {
      await openColorPopup(element);
    },
    compute(element) {
      const popup = element.querySelector('[slot="color-popup"]');
      const button = popup.querySelector('button:nth-of-type(2)');
      return getComputedStyle(button).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-rich-text-editor-overlay-color-option-height',
    value: '30px',
    async setup(element) {
      await openColorPopup(element);
    },
    compute(element) {
      const popup = element.querySelector('[slot="color-popup"]');
      const button = popup.querySelector('button:nth-of-type(2)');
      return getComputedStyle(button).getPropertyValue('height').trim();
    },
  },
  {
    name: '--vaadin-rich-text-editor-overlay-color-option-width',
    value: '30px',
    async setup(element) {
      await openColorPopup(element);
    },
    compute(element) {
      const popup = element.querySelector('[slot="color-popup"]');
      const button = popup.querySelector('button:nth-of-type(2)');
      return getComputedStyle(button).getPropertyValue('width').trim();
    },
  },
];

describe('rich-text-editor', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
    await nextRender(element);
  });

  afterEach(() => {
    // Close any open popups
    const colorPopup = element.querySelector('[slot="color-popup"]');
    if (colorPopup) {
      colorPopup.opened = false;
    }
    const bgPopup = element.querySelector('[slot="background-popup"]');
    if (bgPopup) {
      bgPopup.opened = false;
    }
  });

  props.forEach(({ name, value, setup, compute }) => {
    it(`should apply ${name} property`, async () => {
      element.style.setProperty(name, value);
      await nextUpdate(element);
      if (setup) {
        await setup(element);
        await nextUpdate(element);
      }
      const actual = await compute(element);
      expect(actual).to.equal(value);
    });
  });
});
