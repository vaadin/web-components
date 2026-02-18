import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/grid/src/vaadin-grid.js';
import '@vaadin/grid/src/vaadin-grid-column.js';
import '@vaadin/grid/src/vaadin-grid-tree-column.js';
import { flushGrid, getContainerCell, getRowCells, getRows } from '../../packages/grid/test/helpers.js';

// TODO: --vaadin-grid-row-hover-background-color - applied inside @media (any-hover: hover)
// on .body-row:hover, cannot be reliably triggered in automated tests.

export const props = [
  // === Grid Surface ===
  {
    name: '--vaadin-grid-background',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-grid-border-width',
    value: '5px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-grid-border-color',
    value: 'rgb(0, 255, 0)',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-grid-border-radius',
    value: '20px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('border-radius').trim();
    },
  },

  // === Row Borders ===
  {
    name: '--vaadin-grid-row-border-width',
    value: '5px',
    compute(element) {
      const cell = getContainerCell(element.$.items, 0, 0);
      return getComputedStyle(cell).getPropertyValue('border-top-width').trim();
    },
  },
  {
    name: '--vaadin-grid-column-border-width',
    value: '3px',
    compute(element) {
      // Column borders are applied to non-first-column cells
      const cell = getContainerCell(element.$.items, 0, 1);
      return getComputedStyle(cell).getPropertyValue('border-inline-start-width').trim();
    },
  },

  // === Header ===
  {
    name: '--vaadin-grid-header-font-size',
    value: '20px',
    compute(element) {
      const cell = getContainerCell(element.$.header, 0, 0);
      return getComputedStyle(cell).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-grid-header-font-weight',
    value: '700',
    compute(element) {
      const cell = getContainerCell(element.$.header, 0, 0);
      return getComputedStyle(cell).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-grid-header-text-color',
    value: 'rgb(0, 0, 255)',
    compute(element) {
      const cell = getContainerCell(element.$.header, 0, 0);
      return getComputedStyle(cell).getPropertyValue('color').trim();
    },
  },

  // === Row Background ===
  {
    name: '--vaadin-grid-row-background-color',
    value: 'rgb(200, 100, 50)',
    compute(element) {
      const rows = getRows(element.$.items);
      return getComputedStyle(rows[0]).getPropertyValue('background-color').trim();
    },
  },

  // === Cell Background (gradient layer) ===
  {
    name: '--vaadin-grid-cell-background-color',
    value: 'rgb(100, 200, 50)',
    compute(element) {
      // This property is used as a gradient layer: linear-gradient(value, value)
      const cell = getContainerCell(element.$.items, 0, 0);
      const bgImage = getComputedStyle(cell).getPropertyValue('background-image');
      // The gradient layer should contain the set color
      return bgImage.includes('rgb(100, 200, 50)') ? 'rgb(100, 200, 50)' : bgImage;
    },
  },

  // === Row Highlight Background (gradient layer) ===
  {
    name: '--vaadin-grid-row-highlight-background-color',
    value: 'rgb(50, 100, 200)',
    compute(element) {
      // This property is used as a gradient layer in body cells
      const cell = getContainerCell(element.$.items, 0, 0);
      const bgImage = getComputedStyle(cell).getPropertyValue('background-image');
      return bgImage.includes('rgb(50, 100, 200)') ? 'rgb(50, 100, 200)' : bgImage;
    },
  },

  // === Selected Row Background (gradient layer) ===
  {
    name: '--vaadin-grid-row-selected-background-color',
    value: 'rgb(150, 50, 200)',
    setup(element) {
      element.selectedItems = [element.items[0]];
    },
    compute(element) {
      // This property is used as a gradient layer on selected rows
      const rows = getRows(element.$.items);
      const selectedRow = Array.from(rows).find((r) => r.classList.contains('selected-row'));
      if (selectedRow) {
        const cells = getRowCells(selectedRow);
        const bgImage = getComputedStyle(cells[0]).getPropertyValue('background-image');
        return bgImage.includes('rgb(150, 50, 200)') ? 'rgb(150, 50, 200)' : bgImage;
      }
      return '';
    },
  },

  // === Odd Row Background (gradient layer, requires row-stripes theme) ===
  {
    name: '--vaadin-grid-row-odd-background-color',
    value: 'rgb(100, 150, 200)',
    setup(element) {
      element.setAttribute('theme', 'row-stripes');
      flushGrid(element);
    },
    compute(element) {
      // This property is used as a gradient layer on odd rows with row-stripes theme
      const rows = getRows(element.$.items);
      const oddRow = Array.from(rows).find((r) => r.classList.contains('odd-row'));
      if (oddRow) {
        const cells = getRowCells(oddRow);
        const bgImage = getComputedStyle(cells[0]).getPropertyValue('background-image');
        return bgImage.includes('rgb(100, 150, 200)') ? 'rgb(100, 150, 200)' : bgImage;
      }
      return '';
    },
  },

  // === Cell Content ===
  {
    name: '--vaadin-grid-cell-text-overflow',
    value: 'clip',
    compute(element) {
      const cell = getContainerCell(element.$.items, 0, 0);
      const content = cell.querySelector('slot').assignedNodes()[0];
      return getComputedStyle(content).getPropertyValue('text-overflow').trim();
    },
  },
  {
    name: '--vaadin-grid-cell-padding',
    value: '20px',
    compute(element) {
      const cell = getContainerCell(element.$.items, 0, 0);
      const content = cell.querySelector('slot').assignedNodes()[0];
      return getComputedStyle(content).getPropertyValue('padding').trim();
    },
  },

  // === Resize Handle ===
  {
    name: '--vaadin-grid-column-resize-handle-color',
    value: 'rgb(255, 100, 0)',
    setup(element) {
      // Enable column resizing to make resize handles exist
      const columns = element.querySelectorAll('vaadin-grid-column');
      columns.forEach((col) => {
        col.resizable = true;
      });
      flushGrid(element);
    },
    compute(element) {
      const cell = getContainerCell(element.$.header, 0, 0);
      const handle = cell.querySelector('.resize-handle');
      return getComputedStyle(handle).getPropertyValue('background-color').trim();
    },
  },

  // === Tree Toggle ===
  {
    name: '--vaadin-grid-tree-toggle-level-offset',
    value: '30px',
    async setup(element) {
      // Replace columns with a tree column
      element.innerHTML = '';
      const treeCol = document.createElement('vaadin-grid-tree-column');
      treeCol.path = 'name';
      treeCol.header = 'Name';
      element.appendChild(treeCol);

      // Set hierarchical data
      element.itemHasChildrenPath = 'children';
      element.dataProvider = (params, callback) => {
        const items = Array.from({ length: 3 }, (_, i) => ({
          name: `Item ${params.parentItem ? `${params.parentItem.name}-` : ''}${i}`,
          children: params.page === 0,
        }));
        callback(items, 3);
      };
      flushGrid(element);
      await nextFrame();
    },
    compute(element) {
      const toggle = element.querySelector('vaadin-grid-tree-toggle');
      if (toggle) {
        const spacer = toggle.shadowRoot.querySelector('#level-spacer');
        return getComputedStyle(spacer).getPropertyValue('--vaadin-grid-tree-toggle-level-offset').trim();
      }
      return getComputedStyle(element).getPropertyValue('--vaadin-grid-tree-toggle-level-offset').trim();
    },
  },
];

describe('grid', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-grid style="width: 400px; height: 300px;">
        <vaadin-grid-column path="name" header="Name"></vaadin-grid-column>
        <vaadin-grid-column path="value" header="Value"></vaadin-grid-column>
      </vaadin-grid>
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
