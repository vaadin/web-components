import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/dialog/src/vaadin-dialog.js';

// TODO: --vaadin-dialog-min-width fails because the base styles wrap it in
// min(var(--vaadin-dialog-min-width, 4em), 100%) in vaadin-dialog-overlay-base-styles.js:39,
// so the computed min-width value includes the min() function rather than the raw value.
//
// TODO: --vaadin-dialog-max-width fails for the same reason as min-width — it is
// wrapped in min(var(--vaadin-dialog-max-width, 100%), 100%) in vaadin-dialog-overlay-base-styles.js:40.
//
// TODO: --vaadin-dialog-shadow fails because Aura theme combines it with --aura-overlay-outline-shadow
// in overlay.css:32, so the computed box-shadow doesn't match the custom property value alone.

export const props = [
  // === Dialog Dimensions ===
  {
    name: '--vaadin-dialog-min-width',
    value: '400px',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('min-width').trim();
    },
  },
  {
    name: '--vaadin-dialog-max-width',
    value: '500px',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('max-width').trim();
    },
  },

  // === Dialog Surface ===
  {
    name: '--vaadin-dialog-background',
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
    name: '--vaadin-dialog-border-color',
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
    name: '--vaadin-dialog-border-radius',
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
    name: '--vaadin-dialog-border-width',
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
  {
    name: '--vaadin-dialog-padding',
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
  {
    name: '--vaadin-dialog-shadow',
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

  // === Dialog Title ===
  {
    name: '--vaadin-dialog-title-color',
    value: 'rgb(0, 0, 255)',
    async setup(element) {
      element.headerTitle = 'Test Title';
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const title = overlay.shadowRoot.querySelector('[part="title"]');
      return getComputedStyle(title).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-dialog-title-font-size',
    value: '30px',
    async setup(element) {
      element.headerTitle = 'Test Title';
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const title = overlay.shadowRoot.querySelector('[part="title"]');
      return getComputedStyle(title).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-dialog-title-font-weight',
    value: '800',
    async setup(element) {
      element.headerTitle = 'Test Title';
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const title = overlay.shadowRoot.querySelector('[part="title"]');
      return getComputedStyle(title).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-dialog-title-line-height',
    value: '40px',
    async setup(element) {
      element.headerTitle = 'Test Title';
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const title = overlay.shadowRoot.querySelector('[part="title"]');
      return getComputedStyle(title).getPropertyValue('line-height').trim();
    },
  },

  // === Overlay ===
  {
    name: '--vaadin-overlay-backdrop-background',
    value: 'rgb(100, 0, 0)',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const backdrop = overlay.shadowRoot.querySelector('[part="backdrop"]');
      return getComputedStyle(backdrop).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-overlay-viewport-inset',
    value: '20px',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      return getComputedStyle(overlay).getPropertyValue('top').trim();
    },
  },
];

describe('dialog', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-dialog></vaadin-dialog>');
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
