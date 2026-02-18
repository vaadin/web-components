import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/tooltip/src/vaadin-tooltip.js';

// TODO: --vaadin-tooltip-background fails because Aura overlay.css:29 sets background directly on
// ::part(overlay) to var(--vaadin-overlay-background, var(--aura-surface-color)), which overrides the
// tooltip base style that uses var(--vaadin-tooltip-background, ...) in the shadow DOM.
//
// TODO: --vaadin-tooltip-shadow fails because Aura theme combines it with --aura-overlay-outline-shadow
// in tooltip.css:11, so the computed box-shadow doesn't match the custom property value alone.
//
// TODO: --vaadin-tooltip-offset-top, --vaadin-tooltip-offset-bottom, --vaadin-tooltip-offset-start,
// and --vaadin-tooltip-offset-end fail because the offset margins are only applied when specific
// position/alignment attributes are present on the overlay host (set by the position mixin during
// actual positioning against a target). Without a positioned target, the alignment attributes
// are not set and the margin rules don't match.

export const props = [
  // === Tooltip Surface ===
  {
    name: '--vaadin-tooltip-max-width',
    value: '200px',
    async setup(element) {
      element.text = 'Test tooltip';
      element.manual = true;
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('max-width').trim();
    },
  },
  {
    name: '--vaadin-tooltip-padding',
    value: '20px',
    async setup(element) {
      element.text = 'Test tooltip';
      element.manual = true;
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('padding').trim();
    },
  },
  {
    name: '--vaadin-tooltip-border-width',
    value: '5px',
    async setup(element) {
      element.text = 'Test tooltip';
      element.manual = true;
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
    name: '--vaadin-tooltip-border-color',
    value: 'rgb(0, 255, 0)',
    async setup(element) {
      element.text = 'Test tooltip';
      element.manual = true;
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
    name: '--vaadin-tooltip-border-radius',
    value: '20px',
    async setup(element) {
      element.text = 'Test tooltip';
      element.manual = true;
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
    name: '--vaadin-tooltip-background',
    value: 'rgb(255, 0, 0)',
    async setup(element) {
      element.text = 'Test tooltip';
      element.manual = true;
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
    name: '--vaadin-tooltip-text-color',
    value: 'rgb(0, 0, 255)',
    async setup(element) {
      element.text = 'Test tooltip';
      element.manual = true;
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('color').trim();
    },
  },

  // === Tooltip Typography ===
  {
    name: '--vaadin-tooltip-font-size',
    value: '20px',
    async setup(element) {
      element.text = 'Test tooltip';
      element.manual = true;
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-tooltip-font-weight',
    value: '800',
    async setup(element) {
      element.text = 'Test tooltip';
      element.manual = true;
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-tooltip-line-height',
    value: '30px',
    async setup(element) {
      element.text = 'Test tooltip';
      element.manual = true;
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('line-height').trim();
    },
  },
  {
    name: '--vaadin-tooltip-shadow',
    value: '0 0 10px rgb(255, 0, 0)',
    async setup(element) {
      element.text = 'Test tooltip';
      element.manual = true;
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('box-shadow').trim();
    },
  },

  // === Tooltip Offset ===
  {
    name: '--vaadin-tooltip-offset-top',
    value: '20px',
    async setup(element) {
      element.text = 'Test tooltip';
      element.position = 'bottom';
      element.manual = true;
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('margin-top').trim();
    },
  },
  {
    name: '--vaadin-tooltip-offset-bottom',
    value: '20px',
    async setup(element) {
      element.text = 'Test tooltip';
      element.position = 'top';
      element.manual = true;
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('margin-bottom').trim();
    },
  },
  {
    name: '--vaadin-tooltip-offset-start',
    value: '20px',
    async setup(element) {
      element.text = 'Test tooltip';
      element.position = 'end';
      element.manual = true;
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('margin-inline-start').trim();
    },
  },
  {
    name: '--vaadin-tooltip-offset-end',
    value: '20px',
    async setup(element) {
      element.text = 'Test tooltip';
      element.position = 'start';
      element.manual = true;
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('margin-inline-end').trim();
    },
  },
];

describe('tooltip', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-tooltip></vaadin-tooltip>');
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
