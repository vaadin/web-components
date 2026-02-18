import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/item/src/vaadin-item.js';
import '@vaadin/list-box/src/vaadin-list-box.js';

// TODO: --vaadin-item-gap fails because Aura theme sets gap: 0 directly on
// vaadin-item in item-overlay.css:30, which overrides the custom property on :host.
// The property still works on [part="content"] via item-overlay.css:47.
//
// TODO: --vaadin-item-padding fails because Aura theme overrides padding-inline-start
// directly on vaadin-item in item-overlay.css:29, which takes precedence over the
// shorthand padding set via the custom property.

export const props = [
  // === Divider ===
  {
    name: '--vaadin-divider-color',
    value: 'rgb(255, 0, 0)',
    setup(element) {
      const hr = document.createElement('hr');
      element.appendChild(hr);
    },
    compute(element) {
      const hr = element.querySelector('hr');
      return getComputedStyle(hr).getPropertyValue('border-color').trim();
    },
  },

  // === Item Layout ===
  {
    name: '--vaadin-item-border-radius',
    value: '20px',
    compute(element) {
      const item = element.querySelector('vaadin-item');
      return getComputedStyle(item).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-item-gap',
    value: '20px',
    compute(element) {
      const item = element.querySelector('vaadin-item');
      return getComputedStyle(item).getPropertyValue('column-gap').trim();
    },
  },
  {
    name: '--vaadin-item-height',
    value: '60px',
    compute(element) {
      const item = element.querySelector('vaadin-item');
      return getComputedStyle(item).getPropertyValue('height').trim();
    },
  },
  {
    name: '--vaadin-item-padding',
    value: '20px',
    compute(element) {
      const item = element.querySelector('vaadin-item');
      return getComputedStyle(item).getPropertyValue('padding').trim();
    },
  },
  {
    name: '--vaadin-item-text-align',
    value: 'center',
    compute(element) {
      const item = element.querySelector('vaadin-item');
      const content = item.shadowRoot.querySelector('[part="content"]');
      return getComputedStyle(content).getPropertyValue('justify-content').trim();
    },
  },

  // === Item Checkmark ===
  {
    name: '--vaadin-item-checkmark-color',
    value: 'rgb(0, 255, 0)',
    setup(element) {
      element.selected = 0;
    },
    compute(element) {
      const item = element.querySelector('vaadin-item');
      const checkmark = item.shadowRoot.querySelector('[part="checkmark"]');
      return getComputedStyle(checkmark).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-item-checkmark-display',
    value: 'none',
    compute(element) {
      const item = element.querySelector('vaadin-item');
      const checkmark = item.shadowRoot.querySelector('[part="checkmark"]');
      return getComputedStyle(checkmark).getPropertyValue('display').trim();
    },
  },
];

describe('list-box', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-list-box>
        <vaadin-item>Item 1</vaadin-item>
        <vaadin-item>Item 2</vaadin-item>
        <vaadin-item>Item 3</vaadin-item>
      </vaadin-list-box>
    `);
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
