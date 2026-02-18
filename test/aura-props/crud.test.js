import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/crud/src/vaadin-crud.js';

// TODO: --vaadin-crud-form-padding fails because base styles override
// padding-top to 0 on ::slotted([slot='form']) (vaadin-crud-base-styles.js:150),
// so the computed padding is "0px 35px 35px" instead of the custom property value.

async function openInlineEditor(element, position) {
  element.editorPosition = position;
  element._fullscreen = false;
  await nextUpdate(element);
  await nextRender();
  element.editedItem = element.items[0];
  await nextUpdate(element);
  await nextRender();
}

export const props = [
  // === Host Surface ===
  {
    name: '--vaadin-crud-background',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-crud-border-color',
    value: 'rgb(0, 255, 0)',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-crud-border-width',
    value: '5px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-crud-border-radius',
    value: '20px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('border-radius').trim();
    },
  },

  // === Toolbar ===
  {
    name: '--vaadin-crud-toolbar-background',
    value: 'rgb(0, 0, 255)',
    compute(element) {
      const toolbar = element.shadowRoot.querySelector('[part="toolbar"]');
      return getComputedStyle(toolbar).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-crud-toolbar-padding',
    value: '30px',
    compute(element) {
      const toolbar = element.shadowRoot.querySelector('[part="toolbar"]');
      return getComputedStyle(toolbar).getPropertyValue('padding').trim();
    },
  },

  // === Editor Dimensions ===
  {
    name: '--vaadin-crud-editor-max-height',
    value: '200px',
    async setup(element) {
      await openInlineEditor(element, 'bottom');
    },
    compute(element) {
      const editor = element.shadowRoot.querySelector('[part="editor"]');
      return getComputedStyle(editor).getPropertyValue('max-height').trim();
    },
  },
  {
    name: '--vaadin-crud-editor-max-width',
    value: '300px',
    async setup(element) {
      await openInlineEditor(element, 'aside');
    },
    compute(element) {
      const editor = element.shadowRoot.querySelector('[part="editor"]');
      return getComputedStyle(editor).getPropertyValue('max-width').trim();
    },
  },

  // === Header ===
  {
    name: '--vaadin-crud-header-color',
    value: 'rgb(100, 50, 0)',
    async setup(element) {
      await openInlineEditor(element, 'aside');
    },
    compute(element) {
      const header = element.shadowRoot.querySelector('[part="header"]');
      return getComputedStyle(header).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-crud-header-font-size',
    value: '30px',
    async setup(element) {
      await openInlineEditor(element, 'aside');
    },
    compute(element) {
      const header = element.shadowRoot.querySelector('[part="header"]');
      return getComputedStyle(header).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-crud-header-font-weight',
    value: '800',
    async setup(element) {
      await openInlineEditor(element, 'aside');
    },
    compute(element) {
      const header = element.shadowRoot.querySelector('[part="header"]');
      return getComputedStyle(header).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-crud-header-line-height',
    value: '50px',
    async setup(element) {
      await openInlineEditor(element, 'aside');
    },
    compute(element) {
      const header = element.shadowRoot.querySelector('[part="header"]');
      return getComputedStyle(header).getPropertyValue('line-height').trim();
    },
  },
  {
    name: '--vaadin-crud-header-padding',
    value: '25px',
    async setup(element) {
      await openInlineEditor(element, 'aside');
    },
    compute(element) {
      const header = element.shadowRoot.querySelector('[part="header"]');
      return getComputedStyle(header).getPropertyValue('padding').trim();
    },
  },

  // === Form ===
  {
    name: '--vaadin-crud-form-padding',
    value: '35px',
    async setup(element) {
      await openInlineEditor(element, 'aside');
    },
    compute(element) {
      const form = element.querySelector('[slot="form"]');
      return getComputedStyle(form).getPropertyValue('padding').trim();
    },
  },

  // === Footer ===
  {
    name: '--vaadin-crud-footer-background',
    value: 'rgb(50, 100, 150)',
    async setup(element) {
      await openInlineEditor(element, 'aside');
    },
    compute(element) {
      const footer = element.shadowRoot.querySelector('[part="footer"]');
      return getComputedStyle(footer).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-crud-footer-gap',
    value: '20px',
    async setup(element) {
      await openInlineEditor(element, 'aside');
    },
    compute(element) {
      const footer = element.shadowRoot.querySelector('[part="footer"]');
      return getComputedStyle(footer).getPropertyValue('gap').trim();
    },
  },
  {
    name: '--vaadin-crud-footer-padding',
    value: '28px',
    async setup(element) {
      await openInlineEditor(element, 'aside');
    },
    compute(element) {
      const footer = element.shadowRoot.querySelector('[part="footer"]');
      return getComputedStyle(footer).getPropertyValue('padding').trim();
    },
  },
];

describe('crud', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-crud></vaadin-crud>');
    element.items = [{ name: 'John' }, { name: 'Jane' }];
    await nextRender();
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
