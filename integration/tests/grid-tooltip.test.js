import { expect } from '@esm-bundle/chai';
import {
  arrowDown,
  enter,
  escKeyDown,
  fixtureSync,
  focusin,
  focusout,
  mousedown,
  nextFrame,
  tabKeyDown,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/grid/vaadin-grid.js';
import '@vaadin/tooltip/vaadin-tooltip.js';
import { flushGrid, getCell, getContainerCell } from '@vaadin/grid/test/helpers.js';
import { mouseenter, mouseleave } from '@vaadin/tooltip/test/helpers.js';

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

  it('should hide tooltip on cell mousedown', () => {
    const cell = getCell(grid, 0);
    mouseenter(cell);
    mousedown(cell);
    expect(tooltip.opened).to.be.false;
  });

  it('should show tooltip on cell keyboard focus', () => {
    const cell = getCell(grid, 0);
    tabKeyDown(document.body);
    focusin(cell);
    expect(tooltip.opened).to.be.true;
  });

  it('should set tooltip target on cell keyboard focus', () => {
    const cell = getCell(grid, 0);
    tabKeyDown(document.body);
    focusin(cell);
    expect(tooltip.target).to.be.equal(cell);
  });

  it('should set tooltip context on cell keyboard focus', () => {
    const cell = getCell(grid, 0);
    tabKeyDown(document.body);
    focusin(cell);
    expect(tooltip.context).to.be.instanceOf(Object);
    expect(tooltip.context.item.firstName).to.equal('John');
    expect(tooltip.context.item.lastName).to.equal('Doe');
  });

  it('should hide tooltip on cell content keyboard focus', () => {
    // Make the first column render inputs
    grid.firstElementChild.renderer = (root) => {
      root.innerHTML = '<input>';
    };

    // Navigate to the first cell of second row
    const cell = getCell(grid, 0);
    tabKeyDown(document.body);
    focusin(cell);
    arrowDown(cell);

    expect(tooltip.opened).to.be.true;

    // Enter interaction mode (the input gets focus)
    const focusedCell = getContainerCell(grid.$.items, 1, 0);
    enter(focusedCell);

    expect(tooltip.opened).to.be.false;
  });

  it('should hide tooltip on grid focusout', () => {
    const cell = getCell(grid, 0);
    tabKeyDown(document.body);
    focusin(cell);
    focusout(grid);
    expect(tooltip.opened).to.be.false;
  });

  it('should hide tooltip on grid cell content Esc', () => {
    const cell = getCell(grid, 0);
    tabKeyDown(document.body);
    focusin(cell._content);
    escKeyDown(cell._content);
    expect(tooltip.opened).to.be.false;
  });

  it('should set tooltip opened to false when the grid is removed', () => {
    const cell = getCell(grid, 0);
    mouseenter(cell);

    grid.remove();

    expect(tooltip.opened).to.be.false;
  });

  it('should not set tooltip target if there is no tooltip', async () => {
    const spy = sinon.spy(grid._tooltipController, 'setTarget');

    tooltip.remove();
    await nextFrame();

    const cell = getCell(grid, 0);
    mouseenter(cell);

    expect(spy.calledOnce).to.be.false;
  });

  it('should not set tooltip context if there is no tooltip', async () => {
    const spy = sinon.spy(grid._tooltipController, 'setContext');

    tooltip.remove();
    await nextFrame();

    const cell = getCell(grid, 0);
    mouseenter(cell);

    expect(spy.calledOnce).to.be.false;
  });

  it('should not set tooltip opened if there is no tooltip', async () => {
    const spy = sinon.spy(grid._tooltipController, 'setOpened');

    tooltip.remove();
    await nextFrame();

    const cell = getCell(grid, 0);
    mouseenter(cell);

    expect(spy.calledOnce).to.be.false;
  });
});
