import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/split-layout/src/vaadin-split-layout.js';

export const props = [
  // === Splitter ===
  {
    name: '--vaadin-split-layout-splitter-background',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      const splitter = element.shadowRoot.querySelector('[part="splitter"]');
      return getComputedStyle(splitter).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-split-layout-splitter-size',
    value: '20px',
    compute(element) {
      const splitter = element.shadowRoot.querySelector('[part="splitter"]');
      return getComputedStyle(splitter).getPropertyValue('width').trim();
    },
  },
  {
    name: '--vaadin-split-layout-splitter-target-size',
    value: '40px',
    compute(element) {
      const splitter = element.shadowRoot.querySelector('[part="splitter"]');
      return getComputedStyle(splitter).getPropertyValue('--_splitter-target-size').trim();
    },
  },

  // === Handle ===
  {
    name: '--vaadin-split-layout-handle-background',
    value: 'rgb(0, 255, 0)',
    compute(element) {
      const handle = element.shadowRoot.querySelector('[part="handle"]');
      return getComputedStyle(handle).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-split-layout-handle-size',
    value: '10px',
    compute(element) {
      const handle = element.shadowRoot.querySelector('[part="handle"]');
      return getComputedStyle(handle).getPropertyValue('width').trim();
    },
  },
  {
    name: '--vaadin-split-layout-handle-target-size',
    value: '50px',
    compute(element) {
      const handle = element.shadowRoot.querySelector('[part="handle"]');
      return getComputedStyle(handle).getPropertyValue('height').trim();
    },
  },
];

describe('split-layout', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-split-layout style="width: 400px; height: 200px;">
        <div>First</div>
        <div>Second</div>
      </vaadin-split-layout>
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
