import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/side-nav/src/vaadin-side-nav.js';
import '@vaadin/side-nav/src/vaadin-side-nav-item.js';

// TODO: --vaadin-side-nav-items-gap is not documented but is used
// in vaadin-side-nav-shared-base-styles.js to set the gap between items on :host and [part='children'].

export const props = [
  // === Side Nav Label ===
  {
    name: '--vaadin-side-nav-label-color',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      const label = element.shadowRoot.querySelector('[part="label"]');
      return getComputedStyle(label).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-side-nav-label-font-size',
    value: '20px',
    compute(element) {
      const label = element.shadowRoot.querySelector('[part="label"]');
      return getComputedStyle(label).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-side-nav-label-font-weight',
    value: '800',
    compute(element) {
      const label = element.shadowRoot.querySelector('[part="label"]');
      return getComputedStyle(label).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-side-nav-label-line-height',
    value: '40px',
    compute(element) {
      const label = element.shadowRoot.querySelector('[part="label"]');
      return getComputedStyle(label).getPropertyValue('line-height').trim();
    },
  },

  // === Side Nav Child Indent ===
  {
    name: '--vaadin-side-nav-child-indent',
    value: '30px',
    setup(element) {
      // Need a nested item at level 1 so --_level is 1 and indent is applied
      const parent = element.querySelector('vaadin-side-nav-item');
      const child = document.createElement('vaadin-side-nav-item');
      child.textContent = 'Nested';
      child.slot = 'children';
      parent.appendChild(child);
      parent.expanded = true;
    },
    compute(element) {
      const parent = element.querySelector('vaadin-side-nav-item');
      const child = parent.querySelector('vaadin-side-nav-item');
      const content = child.shadowRoot.querySelector('[part="content"]');
      return getComputedStyle(content, '::before').getPropertyValue('width').trim();
    },
  },

  // === Side Nav Spacing (undocumented) ===
  {
    name: '--vaadin-side-nav-items-gap',
    value: '20px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('gap').trim();
    },
  },

  // === Side Nav Item ===
  {
    name: '--vaadin-side-nav-item-background',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      const item = element.querySelector('vaadin-side-nav-item');
      const content = item.shadowRoot.querySelector('[part="content"]');
      return getComputedStyle(content).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-side-nav-item-border-color',
    value: 'rgb(0, 255, 0)',
    compute(element) {
      const item = element.querySelector('vaadin-side-nav-item');
      const content = item.shadowRoot.querySelector('[part="content"]');
      return getComputedStyle(content).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-side-nav-item-border-radius',
    value: '20px',
    compute(element) {
      const item = element.querySelector('vaadin-side-nav-item');
      const content = item.shadowRoot.querySelector('[part="content"]');
      return getComputedStyle(content).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-side-nav-item-border-width',
    value: '5px',
    compute(element) {
      const item = element.querySelector('vaadin-side-nav-item');
      const content = item.shadowRoot.querySelector('[part="content"]');
      return getComputedStyle(content).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-side-nav-item-font-size',
    value: '24px',
    compute(element) {
      const item = element.querySelector('vaadin-side-nav-item');
      const content = item.shadowRoot.querySelector('[part="content"]');
      return getComputedStyle(content).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-side-nav-item-font-weight',
    value: '700',
    compute(element) {
      const item = element.querySelector('vaadin-side-nav-item');
      const content = item.shadowRoot.querySelector('[part="content"]');
      return getComputedStyle(content).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-side-nav-item-line-height',
    value: '40px',
    compute(element) {
      const item = element.querySelector('vaadin-side-nav-item');
      const content = item.shadowRoot.querySelector('[part="content"]');
      return getComputedStyle(content).getPropertyValue('line-height').trim();
    },
  },
  {
    name: '--vaadin-side-nav-item-gap',
    value: '20px',
    compute(element) {
      const item = element.querySelector('vaadin-side-nav-item');
      const content = item.shadowRoot.querySelector('[part="content"]');
      return getComputedStyle(content).getPropertyValue('gap').trim();
    },
  },
  {
    name: '--vaadin-side-nav-item-padding',
    value: '20px',
    compute(element) {
      const item = element.querySelector('vaadin-side-nav-item');
      const content = item.shadowRoot.querySelector('[part="content"]');
      return getComputedStyle(content).getPropertyValue('padding').trim();
    },
  },
  {
    name: '--vaadin-side-nav-item-text-color',
    value: 'rgb(0, 0, 255)',
    compute(element) {
      const item = element.querySelector('vaadin-side-nav-item');
      const content = item.shadowRoot.querySelector('[part="content"]');
      return getComputedStyle(content).getPropertyValue('color').trim();
    },
  },
];

describe('side-nav', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-side-nav>
        <span slot="label">Navigation</span>
        <vaadin-side-nav-item>Item 1</vaadin-side-nav-item>
      </vaadin-side-nav>
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
