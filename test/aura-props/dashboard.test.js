import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/dashboard/src/vaadin-dashboard-layout.js';
import '@vaadin/dashboard/src/vaadin-dashboard-widget.js';
import '@vaadin/dashboard/src/vaadin-dashboard-section.js';

// TODO: --vaadin-dashboard-widget-padding cannot be customized
// widgets because the base styles override --vaadin-dashboard-widget-shadow with internal values
// (vaadin-dashboard-widget-base-styles.js:75,79), which take precedence over the inherited
// custom property. The test below verifies it works in the default (non-editable) state.
//
// TODO: --vaadin-dashboard-widget-shadow cannot be customized for [editable] or [selected]
// widgets because the base styles override --vaadin-dashboard-widget-shadow with internal values
// (vaadin-dashboard-widget-base-styles.js:75,79), which take precedence over the inherited
// custom property. The test below verifies it works in the default (non-editable) state.
//
// TODO: --vaadin-dashboard-button-text-color is not documented but is used in
// vaadin-dashboard-button-base-styles.js:20 to set the color on tertiary-themed buttons.
// It fails because the Aura theme overrides the move/remove/resize button colors directly
// with color: var(--vaadin-text-color-disabled) in dashboard.css:104, which has higher
// specificity than the custom property fallback in the base button styles.

export const props = [
  // === Dashboard Layout ===
  {
    name: '--vaadin-dashboard-padding',
    value: '30px',
    compute(element) {
      const grid = element.shadowRoot.querySelector('#grid');
      return getComputedStyle(grid).getPropertyValue('padding').trim();
    },
  },
  {
    name: '--vaadin-dashboard-gap',
    value: '20px',
    compute(element) {
      const grid = element.shadowRoot.querySelector('#grid');
      return getComputedStyle(grid).getPropertyValue('gap').trim();
    },
  },
  {
    name: '--vaadin-dashboard-col-min-width',
    value: '100px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('--vaadin-dashboard-col-min-width').trim();
    },
  },
  {
    name: '--vaadin-dashboard-col-max-width',
    value: '200px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('--vaadin-dashboard-col-max-width').trim();
    },
  },
  {
    name: '--vaadin-dashboard-col-max-count',
    value: '3',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('--vaadin-dashboard-col-max-count').trim();
    },
  },
  {
    name: '--vaadin-dashboard-row-min-height',
    value: '100px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('--vaadin-dashboard-row-min-height').trim();
    },
  },

  // === Widget Surface ===
  {
    name: '--vaadin-dashboard-widget-background',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      const widget = element.querySelector('vaadin-dashboard-widget');
      return getComputedStyle(widget).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-dashboard-widget-padding',
    value: '20px',
    compute(element) {
      const widget = element.querySelector('vaadin-dashboard-widget');
      const content = widget.shadowRoot.querySelector('[part="content"]');
      return getComputedStyle(content).getPropertyValue('padding-left').trim();
    },
  },
  {
    name: '--vaadin-dashboard-widget-border-radius',
    value: '20px',
    compute(element) {
      const widget = element.querySelector('vaadin-dashboard-widget');
      return getComputedStyle(widget, '::before').getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-dashboard-widget-border-width',
    value: '5px',
    compute(element) {
      const widget = element.querySelector('vaadin-dashboard-widget');
      return getComputedStyle(widget, '::before').getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-dashboard-widget-border-color',
    value: 'rgb(0, 255, 0)',
    compute(element) {
      const widget = element.querySelector('vaadin-dashboard-widget');
      return getComputedStyle(widget).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-dashboard-widget-shadow',
    value: 'rgb(255, 0, 0) 0px 0px 10px 0px',
    compute(element) {
      const widget = element.querySelector('vaadin-dashboard-widget');
      return getComputedStyle(widget).getPropertyValue('box-shadow').trim();
    },
  },

  // === Widget Title ===
  {
    name: '--vaadin-dashboard-widget-title-color',
    value: 'rgb(0, 0, 255)',
    compute(element) {
      const widget = element.querySelector('vaadin-dashboard-widget');
      const title = widget.shadowRoot.querySelector('[part="title"]');
      return getComputedStyle(title).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-dashboard-widget-title-font-size',
    value: '30px',
    compute(element) {
      const widget = element.querySelector('vaadin-dashboard-widget');
      const title = widget.shadowRoot.querySelector('[part="title"]');
      return getComputedStyle(title).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-dashboard-widget-title-font-weight',
    value: '800',
    compute(element) {
      const widget = element.querySelector('vaadin-dashboard-widget');
      const title = widget.shadowRoot.querySelector('[part="title"]');
      return getComputedStyle(title).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-dashboard-widget-title-line-height',
    value: '40px',
    compute(element) {
      const widget = element.querySelector('vaadin-dashboard-widget');
      const title = widget.shadowRoot.querySelector('[part="title"]');
      return getComputedStyle(title).getPropertyValue('line-height').trim();
    },
  },
  {
    name: '--vaadin-dashboard-widget-title-wrap',
    value: 'nowrap',
    compute(element) {
      const widget = element.querySelector('vaadin-dashboard-widget');
      const title = widget.shadowRoot.querySelector('[part="title"]');
      return getComputedStyle(title).getPropertyValue('white-space').trim();
    },
  },

  // === Widget Header ===
  {
    name: '--vaadin-dashboard-widget-header-padding',
    value: '20px',
    compute(element) {
      const widget = element.querySelector('vaadin-dashboard-widget');
      const header = widget.shadowRoot.querySelector('[part="header"]');
      return getComputedStyle(header).getPropertyValue('padding').trim();
    },
  },
  {
    name: '--vaadin-dashboard-widget-header-gap',
    value: '30px',
    compute(element) {
      const widget = element.querySelector('vaadin-dashboard-widget');
      const header = widget.shadowRoot.querySelector('[part="header"]');
      return getComputedStyle(header).getPropertyValue('gap').trim();
    },
  },

  // === Button (undocumented) ===
  {
    name: '--vaadin-dashboard-button-text-color',
    value: 'rgb(100, 50, 200)',
    setup(element) {
      const widget = element.querySelector('vaadin-dashboard-widget');
      widget.setAttribute('editable', '');
    },
    compute(element) {
      const widget = element.querySelector('vaadin-dashboard-widget');
      const moveButton = widget.shadowRoot.querySelector('[part="move-button"]');
      return getComputedStyle(moveButton).getPropertyValue('color').trim();
    },
  },

  // === Section ===
  {
    name: '--vaadin-dashboard-section-border-radius',
    value: '20px',
    compute(element) {
      const section = element.querySelector('vaadin-dashboard-section');
      return getComputedStyle(section).getPropertyValue('border-radius').trim();
    },
  },
];

describe('dashboard', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-dashboard-layout style="width: 600px">
        <vaadin-dashboard-widget widget-title="Widget Title">
          <div>Content</div>
        </vaadin-dashboard-widget>
        <vaadin-dashboard-section section-title="Section Title">
          <vaadin-dashboard-widget widget-title="Section Widget">
            <div>Section Content</div>
          </vaadin-dashboard-widget>
        </vaadin-dashboard-section>
      </vaadin-dashboard-layout>
    `);
    await nextFrame();
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
