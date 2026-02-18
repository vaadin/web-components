import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/popover/src/vaadin-popover.js';

// TODO: --vaadin-popover-background fails because Aura theme sets background on
// ::part(overlay) in overlay.css:29 using var(--vaadin-overlay-background, var(--aura-surface-color)),
// which overrides the internal style that uses --vaadin-popover-background.
//
// TODO: --vaadin-popover-shadow fails because Aura theme sets box-shadow on
// ::part(overlay) in overlay.css:32 using var(--aura-overlay-outline-shadow) and
// var(--vaadin-overlay-shadow), which overrides the internal style that uses --vaadin-popover-shadow.
//
// TODO: --vaadin-popover-arrow-inset is not documented but is used
// in vaadin-popover-overlay-base-styles.js:12 to set the arrow position offset.

export const props = [
  // === Arrow ===
  {
    name: '--vaadin-popover-arrow-border-radius',
    value: '4px',
    async setup(element) {
      element.setAttribute('theme', 'arrow');
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const arrow = overlay.shadowRoot.querySelector('[part="arrow"]');
      return getComputedStyle(arrow).getPropertyValue('border-start-start-radius').trim();
    },
  },
  {
    name: '--vaadin-popover-arrow-size',
    value: '12px',
    async setup(element) {
      element.setAttribute('theme', 'arrow');
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const arrow = overlay.shadowRoot.querySelector('[part="arrow"]');
      return getComputedStyle(arrow).getPropertyValue('width').trim();
    },
  },

  // === Popover Surface ===
  {
    name: '--vaadin-popover-background',
    value: 'rgb(255, 0, 0)',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-popover-border-color',
    value: 'rgb(0, 255, 0)',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-popover-border-radius',
    value: '20px',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-popover-border-width',
    value: '5px',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('border-width').trim();
    },
  },

  // === Offsets ===
  {
    name: '--vaadin-popover-offset-top',
    value: '20px',
    async setup(element) {
      element.opened = true;
      await nextRender();
      const overlay = element.shadowRoot.querySelector('#overlay');
      overlay.setAttribute('position', 'bottom');
      overlay.setAttribute('top-aligned', '');
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('margin-top').trim();
    },
  },
  {
    name: '--vaadin-popover-offset-bottom',
    value: '20px',
    async setup(element) {
      element.opened = true;
      await nextRender();
      const overlay = element.shadowRoot.querySelector('#overlay');
      overlay.setAttribute('position', 'top');
      overlay.setAttribute('bottom-aligned', '');
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('margin-bottom').trim();
    },
  },
  {
    name: '--vaadin-popover-offset-start',
    value: '20px',
    async setup(element) {
      element.opened = true;
      await nextRender();
      const overlay = element.shadowRoot.querySelector('#overlay');
      overlay.setAttribute('position', 'end');
      overlay.setAttribute('start-aligned', '');
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('margin-inline-start').trim();
    },
  },
  {
    name: '--vaadin-popover-offset-end',
    value: '20px',
    async setup(element) {
      element.opened = true;
      await nextRender();
      const overlay = element.shadowRoot.querySelector('#overlay');
      overlay.setAttribute('position', 'start');
      overlay.setAttribute('end-aligned', '');
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('margin-inline-end').trim();
    },
  },

  // === Content ===
  {
    name: '--vaadin-popover-padding',
    value: '30px',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const content = overlay.shadowRoot.querySelector('[part="content"]');
      return getComputedStyle(content).getPropertyValue('padding').trim();
    },
  },

  // === Shadow ===
  {
    name: '--vaadin-popover-shadow',
    value: '0 0 10px rgb(255, 0, 0)',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('box-shadow').trim();
    },
  },

  // === Overlay ===
  {
    name: '--vaadin-overlay-backdrop-background',
    value: 'rgb(100, 0, 0)',
    async setup(element) {
      element.withBackdrop = true;
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const backdrop = overlay.shadowRoot.querySelector('[part="backdrop"]');
      return getComputedStyle(backdrop).getPropertyValue('background-color').trim();
    },
  },
];

describe('popover', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-popover></vaadin-popover>');
    await nextUpdate(element);
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
