import { expect } from '@vaadin/chai-plugins';
import { fire, fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/context-menu/src/vaadin-context-menu.js';

// TODO: --vaadin-overlay-shadow fails because Aura theme combines it with
// --aura-overlay-outline-shadow in overlay.css:32, so the computed box-shadow
// doesn't match the custom property value alone.
//
// TODO: --vaadin-item-padding fails because Aura theme overrides padding-inline-start
// directly on vaadin-context-menu-item in item-overlay.css:29 with
// max(0px, var(--vaadin-padding-inline-container) - var(--aura-item-overlay-padding-inline)),
// so setting --vaadin-item-padding alone results in a different padding-inline-start.
//
// TODO: --vaadin-icon-visual-size cannot be reliably tested because it controls
// the mask-size CSS property on the checkmark pseudo-element, which is not
// directly readable via getComputedStyle.

/**
 * Opens the context menu by firing a contextmenu event on its target.
 * Returns a reference to the overlay element.
 */
async function openMenu(menu) {
  const target = menu.querySelector('div');
  fire(target, 'vaadin-contextmenu');
  const overlay = menu._overlayElement;
  await oneEvent(overlay, 'vaadin-overlay-open');
  await nextRender();
  return overlay;
}

/**
 * Returns the first vaadin-context-menu-item inside the overlay.
 */
function getItem(overlay) {
  const listBox = overlay._contentRoot.querySelector('vaadin-context-menu-list-box');
  return listBox.querySelector('vaadin-context-menu-item');
}

export const props = [
  // === Context Menu Offsets ===
  {
    name: '--vaadin-context-menu-offset-top',
    value: '20px',
    async setup(element) {
      element.position = 'bottom';
      const overlay = await openMenu(element);
      // Ensure the overlay has the required attributes for the CSS selector
      overlay.setAttribute('position', 'bottom');
      overlay.setAttribute('top-aligned', '');
    },
    compute(element) {
      const overlay = element._overlayElement;
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('margin-top').trim();
    },
  },
  {
    name: '--vaadin-context-menu-offset-bottom',
    value: '20px',
    async setup(element) {
      element.position = 'top';
      const overlay = await openMenu(element);
      overlay.setAttribute('position', 'top');
      overlay.setAttribute('bottom-aligned', '');
    },
    compute(element) {
      const overlay = element._overlayElement;
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('margin-bottom').trim();
    },
  },
  {
    name: '--vaadin-context-menu-offset-start',
    value: '20px',
    async setup(element) {
      element.position = 'end';
      const overlay = await openMenu(element);
      overlay.setAttribute('position', 'end');
      overlay.setAttribute('start-aligned', '');
    },
    compute(element) {
      const overlay = element._overlayElement;
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('margin-inline-start').trim();
    },
  },
  {
    name: '--vaadin-context-menu-offset-end',
    value: '20px',
    async setup(element) {
      element.position = 'start';
      const overlay = await openMenu(element);
      overlay.setAttribute('position', 'start');
      overlay.setAttribute('end-aligned', '');
    },
    compute(element) {
      const overlay = element._overlayElement;
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('margin-inline-end').trim();
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
      const overlay = element._overlayElement;
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
      const overlay = element._overlayElement;
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
      const overlay = element._overlayElement;
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
      const overlay = element._overlayElement;
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
      const overlay = element._overlayElement;
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
      const overlay = element._overlayElement;
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
      const overlay = element._overlayElement;
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
      const overlay = element._overlayElement;
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
      const overlay = element._overlayElement;
      const item = getItem(overlay);
      const checkmark = item.shadowRoot.querySelector('[part="checkmark"]');
      return getComputedStyle(checkmark, '::before').getPropertyValue('width').trim();
    },
  },
  {
    name: '--vaadin-item-gap',
    value: '30px',
    async setup(element) {
      await openMenu(element);
    },
    compute(element) {
      const overlay = element._overlayElement;
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
      const overlay = element._overlayElement;
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
      const overlay = element._overlayElement;
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
      const overlay = element._overlayElement;
      const item = getItem(overlay);
      item.setAttribute('focus-ring', '');
    },
    compute(element) {
      const overlay = element._overlayElement;
      const item = getItem(overlay);
      return getComputedStyle(item).getPropertyValue('outline-width').trim();
    },
  },
  {
    name: '--vaadin-focus-ring-color',
    value: 'rgb(0, 0, 255)',
    async setup(element) {
      await openMenu(element);
      const overlay = element._overlayElement;
      const item = getItem(overlay);
      item.setAttribute('focus-ring', '');
    },
    compute(element) {
      const overlay = element._overlayElement;
      const item = getItem(overlay);
      return getComputedStyle(item).getPropertyValue('outline-color').trim();
    },
  },
];

describe('context-menu', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-context-menu>
        <div style="padding: 10px">Target</div>
      </vaadin-context-menu>
    `);
    element.items = [{ text: 'Item 1', checked: true }, { text: 'Item 2' }, { text: 'Item 3' }];
    await nextUpdate(element);
  });

  afterEach(() => {
    element._overlayElement.opened = false;
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
