import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/menu-bar/src/vaadin-menu-bar.js';

// TODO: --vaadin-overlay-shadow fails because Aura theme combines it with
// --aura-overlay-outline-shadow in overlay.css:32, so the computed box-shadow
// doesn't match the custom property value alone.
//
// TODO: --vaadin-item-padding fails because Aura theme overrides padding-inline-start
// directly on vaadin-menu-bar-item in item-overlay.css:29 with
// max(0px, var(--vaadin-padding-inline-container) - var(--aura-item-overlay-padding-inline)),
// so setting --vaadin-item-padding alone results in a different padding-inline-start.
//
// TODO: --vaadin-icon-visual-size fails because Aura theme overrides it to 75%
// on ::part(checkmark) in item-overlay.css:34, so the developer-set value
// is superseded by the theme's higher-specificity rule.
//
// TODO: --vaadin-menu-bar-gap is not documented but is used in
// vaadin-menu-bar-base-styles.js:23 to set the gap between menu bar buttons.
//
// TODO: --vaadin-item-overlay-padding is not documented but is used in
// vaadin-menu-overlay-base-styles.js:28 to set the content padding of the overlay.

/**
 * Opens the submenu of the given menu-bar by clicking its first button
 * that has children. Returns a reference to the overlay element.
 */
async function openMenu(menuBar) {
  const button = menuBar._buttons[0];
  button.click();
  const overlay = menuBar._subMenu._overlayElement;
  await oneEvent(overlay, 'vaadin-overlay-open');
  await nextRender();
  return overlay;
}

/**
 * Returns the first vaadin-menu-bar-item inside the overlay.
 */
function getItem(overlay) {
  const listBox = overlay._contentRoot.querySelector('vaadin-menu-bar-list-box');
  return listBox.querySelector('vaadin-menu-bar-item');
}

export const props = [
  // === Menu Bar Layout ===
  {
    name: '--vaadin-menu-bar-gap',
    value: '20px',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="container"]');
      return getComputedStyle(container).getPropertyValue('gap').trim();
    },
  },

  // === Overlay Content Padding ===
  {
    name: '--vaadin-item-overlay-padding',
    value: '20px',
    async setup(element) {
      await openMenu(element);
    },
    compute(element) {
      const overlay = element._subMenu._overlayElement;
      const content = overlay.shadowRoot.querySelector('[part="content"]');
      return getComputedStyle(content).getPropertyValue('padding').trim();
    },
  },

  // === Overlay Surface ===
  {
    name: '--vaadin-overlay-background',
    value: 'rgb(255, 0, 0)',
    async setup(element) {
      await openMenu(element);
    },
    compute(element) {
      const overlay = element._subMenu._overlayElement;
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-overlay-border-color',
    value: 'rgb(0, 255, 0)',
    async setup(element) {
      element.style.setProperty('--vaadin-overlay-border-width', '2px');
      await openMenu(element);
    },
    compute(element) {
      const overlay = element._subMenu._overlayElement;
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-overlay-border-radius',
    value: '20px',
    async setup(element) {
      await openMenu(element);
    },
    compute(element) {
      const overlay = element._subMenu._overlayElement;
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-overlay-border-width',
    value: '5px',
    async setup(element) {
      await openMenu(element);
    },
    compute(element) {
      const overlay = element._subMenu._overlayElement;
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-overlay-shadow',
    value: '0 0 10px rgb(255, 0, 0)',
    async setup(element) {
      await openMenu(element);
    },
    compute(element) {
      const overlay = element._subMenu._overlayElement;
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('box-shadow').trim();
    },
  },

  // === Item Properties ===
  {
    name: '--vaadin-item-border-radius',
    value: '20px',
    async setup(element) {
      await openMenu(element);
    },
    compute(element) {
      const overlay = element._subMenu._overlayElement;
      const item = getItem(overlay);
      return getComputedStyle(item).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-item-checkmark-color',
    value: 'rgb(0, 0, 255)',
    async setup(element) {
      await openMenu(element);
    },
    compute(element) {
      const overlay = element._subMenu._overlayElement;
      const item = getItem(overlay);
      const checkmark = item.shadowRoot.querySelector('[part="checkmark"]');
      return getComputedStyle(checkmark).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-icon-size',
    value: '30px',
    async setup(element) {
      await openMenu(element);
    },
    compute(element) {
      const overlay = element._subMenu._overlayElement;
      const item = getItem(overlay);
      const checkmark = item.shadowRoot.querySelector('[part="checkmark"]');
      return getComputedStyle(checkmark, '::before').getPropertyValue('width').trim();
    },
  },
  {
    name: '--vaadin-icon-visual-size',
    value: '50%',
    async setup(element) {
      await openMenu(element);
    },
    compute(element) {
      const overlay = element._subMenu._overlayElement;
      const item = getItem(overlay);
      const checkmark = item.shadowRoot.querySelector('[part="checkmark"]');
      return getComputedStyle(checkmark, '::before').getPropertyValue('mask-size').trim();
    },
  },
  {
    name: '--vaadin-item-gap',
    value: '30px',
    async setup(element) {
      await openMenu(element);
    },
    compute(element) {
      const overlay = element._subMenu._overlayElement;
      const item = getItem(overlay);
      const content = item.shadowRoot.querySelector('[part="content"]');
      return getComputedStyle(content).getPropertyValue('gap').trim();
    },
  },
  {
    name: '--vaadin-item-height',
    value: '60px',
    async setup(element) {
      await openMenu(element);
    },
    compute(element) {
      const overlay = element._subMenu._overlayElement;
      const item = getItem(overlay);
      return getComputedStyle(item).getPropertyValue('height').trim();
    },
  },
  {
    name: '--vaadin-item-padding',
    value: '20px',
    async setup(element) {
      await openMenu(element);
    },
    compute(element) {
      const overlay = element._subMenu._overlayElement;
      const item = getItem(overlay);
      return getComputedStyle(item).getPropertyValue('padding').trim();
    },
  },

  // === Focus Ring ===
  {
    name: '--vaadin-focus-ring-width',
    value: '5px',
    async setup(element) {
      await openMenu(element);
      const overlay = element._subMenu._overlayElement;
      const item = getItem(overlay);
      item.setAttribute('focus-ring', '');
    },
    compute(element) {
      const overlay = element._subMenu._overlayElement;
      const item = getItem(overlay);
      return getComputedStyle(item).getPropertyValue('outline-width').trim();
    },
  },
  {
    name: '--vaadin-focus-ring-color',
    value: 'rgb(0, 0, 255)',
    async setup(element) {
      await openMenu(element);
      const overlay = element._subMenu._overlayElement;
      const item = getItem(overlay);
      item.setAttribute('focus-ring', '');
    },
    compute(element) {
      const overlay = element._subMenu._overlayElement;
      const item = getItem(overlay);
      return getComputedStyle(item).getPropertyValue('outline-color').trim();
    },
  },
];

describe('menu-bar', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>');
    element.items = [
      {
        text: 'File',
        children: [{ text: 'Open', checked: true }, { text: 'Save' }, { text: 'Close' }],
      },
      { text: 'Edit' },
      { text: 'View' },
    ];
    await nextUpdate(element);
  });

  afterEach(() => {
    element._subMenu._overlayElement.opened = false;
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
