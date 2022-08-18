import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '@vaadin/tooltip/vaadin-tooltip.js';
import '../vaadin-grid.js';
import { mouseenter, mouseleave } from '@vaadin/tooltip/test/helpers.js';
import { flushGrid, getCell } from './helpers.js';

function getHeaderCell(grid, index = 0) {
  return grid.$.header.querySelectorAll('[part~="cell"]')[index];
}

describe('tooltip', () => {
  let grid, tooltip;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column path="firstName"></vaadin-grid-column>
        <vaadin-grid-column path="lastName"></vaadin-grid-column>
        <vaadin-tooltip slot="tooltip"></vaadin-tooltip>
      </vaadin-grid>
    `);
    grid.items = [
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'Jane', lastName: 'Doe' },
    ];
    flushGrid(grid);

    tooltip = grid.querySelector('vaadin-tooltip');
    tooltip.textGenerator = ({ column, item }) => {
      return column && column.path && item ? `${column.path}: ${item[column.path]}` : '';
    };
  });

  it('should set manual on the tooltip to true', () => {
    expect(tooltip.manual).to.be.true;
  });

  it('should show tooltip on cell mouseenter', () => {
    const cell = getCell(grid, 0);
    mouseenter(cell);
    expect(tooltip.opened).to.be.true;
  });

  it('should hide tooltip on cell mouseleave', () => {
    const cell = getCell(grid, 0);
    mouseenter(cell);
    mouseleave(cell);
    expect(tooltip.opened).to.be.false;
  });

  it('should set tooltip target on cell mouseenter', () => {
    const cell = getCell(grid, 0);
    mouseenter(cell);
    expect(tooltip.target).to.be.equal(cell);
  });

  it('should set tooltip context on cell mouseenter', () => {
    const cell = getCell(grid, 0);
    mouseenter(cell);
    expect(tooltip.context).to.be.instanceOf(Object);
    expect(tooltip.context.item.firstName).to.equal('John');
    expect(tooltip.context.item.lastName).to.equal('Doe');
  });

  it('should change tooltip context on header cell mouseenter', () => {
    const cell = getCell(grid, 0);
    mouseenter(cell);

    mouseleave(cell);
    mouseenter(getHeaderCell(grid, 0));

    expect(tooltip.context.item).to.be.not.ok;
  });
});
