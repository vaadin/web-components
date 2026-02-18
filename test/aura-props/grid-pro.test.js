import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/grid-pro/src/vaadin-grid-pro.js';
import '@vaadin/grid-pro/src/vaadin-grid-pro-edit-column.js';
import '@vaadin/grid/src/vaadin-grid-column.js';
import { flushGrid, getContainerCell } from '../../packages/grid/test/helpers.js';

export const props = [
  // === Editable Cell Background ===
  {
    name: '--vaadin-grid-pro-editable-cell-background-color',
    value: 'rgb(255, 0, 0)',
    setup(element) {
      element.setAttribute('theme', 'highlight-editable-cells');
      flushGrid(element);
    },
    compute(element) {
      // This property is used as a gradient layer via --vaadin-grid-row-highlight-background-color
      // on editable cells when highlight-editable-cells theme is active
      const cell = getContainerCell(element.$.items, 0, 0);
      const bgImage = getComputedStyle(cell).getPropertyValue('background-image');
      return bgImage.includes('rgb(255, 0, 0)') ? 'rgb(255, 0, 0)' : bgImage;
    },
  },
];

describe('grid-pro', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-grid-pro style="width: 400px; height: 300px;">
        <vaadin-grid-pro-edit-column path="name" header="Name"></vaadin-grid-pro-edit-column>
        <vaadin-grid-column path="value" header="Value"></vaadin-grid-column>
      </vaadin-grid-pro>
    `);
    element.items = [
      { name: 'Item 1', value: 'foo' },
      { name: 'Item 2', value: 'bar' },
      { name: 'Item 3', value: 'baz' },
    ];
    flushGrid(element);
    await nextFrame();
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
