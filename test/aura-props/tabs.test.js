import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/tabs/src/vaadin-tabs.js';
import '@vaadin/tabsheet/src/vaadin-tabsheet.js';

// TODO: --vaadin-tab-background fails because the Aura surface system (surface.css)
// sets color-related custom properties directly on vaadin-tab, which interferes with
// inline custom property resolution in the shadow DOM :host rule. Setting the property
// via parent inheritance or a global stylesheet works, but inline style on the element
// does not produce the expected computed value.
//
// TODO: --vaadin-tab-border-color fails for the same reason as --vaadin-tab-background.
// The Aura global CSS (tabs.css:75) applies border using the custom property, but inline
// custom property values on the element are affected by the Aura surface system.
//
// TODO: --vaadin-tab-text-color fails for the same reason as --vaadin-tab-background.
// The Aura color system (color.css) sets scoped color properties on vaadin-tab that
// interfere with inline custom property resolution for color in the shadow DOM.

export const props = [
  // === vaadin-tabs ===
  {
    name: '--vaadin-tabs-background',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-tabs-border-color',
    value: 'rgb(0, 255, 0)',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-tabs-border-radius',
    value: '20px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-tabs-border-width',
    value: '5px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-tabs-gap',
    value: '20px',
    compute(element) {
      const tabs = element.shadowRoot.querySelector('[part="tabs"]');
      return getComputedStyle(tabs).getPropertyValue('gap').trim();
    },
  },
  {
    name: '--vaadin-tabs-padding',
    value: '20px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('padding').trim();
    },
  },
];

export const tabProps = [
  // === vaadin-tab ===
  {
    name: '--vaadin-tab-background',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      const tab = element.querySelector('vaadin-tab:last-child');
      return getComputedStyle(tab).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-tab-border-color',
    value: 'rgb(0, 255, 0)',
    compute(element) {
      const tab = element.querySelector('vaadin-tab:last-child');
      return getComputedStyle(tab).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-tab-border-radius',
    value: '20px',
    compute(element) {
      const tab = element.querySelector('vaadin-tab:last-child');
      return getComputedStyle(tab).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-tab-border-width',
    value: '5px',
    compute(element) {
      const tab = element.querySelector('vaadin-tab:last-child');
      return getComputedStyle(tab).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-tab-font-size',
    value: '24px',
    compute(element) {
      const tab = element.querySelector('vaadin-tab:last-child');
      return getComputedStyle(tab).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-tab-font-weight',
    value: '800',
    compute(element) {
      const tab = element.querySelector('vaadin-tab:last-child');
      return getComputedStyle(tab).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-tab-gap',
    value: '20px',
    compute(element) {
      const tab = element.querySelector('vaadin-tab:last-child');
      return getComputedStyle(tab).getPropertyValue('gap').trim();
    },
  },
  {
    name: '--vaadin-tab-line-height',
    value: '40px',
    compute(element) {
      const tab = element.querySelector('vaadin-tab:last-child');
      return getComputedStyle(tab).getPropertyValue('line-height').trim();
    },
  },
  {
    name: '--vaadin-tab-padding',
    value: '20px',
    compute(element) {
      const tab = element.querySelector('vaadin-tab:last-child');
      return getComputedStyle(tab).getPropertyValue('padding').trim();
    },
  },
  {
    name: '--vaadin-tab-text-color',
    value: 'rgb(0, 0, 255)',
    compute(element) {
      const tab = element.querySelector('vaadin-tab:last-child');
      return getComputedStyle(tab).getPropertyValue('color').trim();
    },
  },
];

export const tabsheetProps = [
  // === vaadin-tabsheet ===
  {
    name: '--vaadin-tabsheet-border-color',
    value: 'rgb(0, 255, 0)',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-tabsheet-border-radius',
    value: '20px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-tabsheet-border-width',
    value: '5px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-tabsheet-gap',
    value: '20px',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="tabs-container"]');
      return getComputedStyle(container).getPropertyValue('gap').trim();
    },
  },
  {
    name: '--vaadin-tabsheet-padding',
    value: '30px',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="tabs-container"]');
      return getComputedStyle(container).getPropertyValue('padding').trim();
    },
  },
];

describe('tabs', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-tabs>
        <vaadin-tab>Tab 1</vaadin-tab>
        <vaadin-tab>Tab 2</vaadin-tab>
      </vaadin-tabs>
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

describe('tab', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-tabs>
        <vaadin-tab>Tab 1</vaadin-tab>
        <vaadin-tab>Tab 2</vaadin-tab>
      </vaadin-tabs>
    `);
    await nextUpdate(element);
  });

  tabProps.forEach(({ name, value, setup, compute }) => {
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

describe('tabsheet', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-tabsheet>
        <vaadin-tabs slot="tabs">
          <vaadin-tab id="tab-1">Tab 1</vaadin-tab>
          <vaadin-tab id="tab-2">Tab 2</vaadin-tab>
        </vaadin-tabs>
        <div tab="tab-1">Content 1</div>
        <div tab="tab-2">Content 2</div>
      </vaadin-tabsheet>
    `);
    await nextUpdate(element);
  });

  tabsheetProps.forEach(({ name, value, setup, compute }) => {
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
