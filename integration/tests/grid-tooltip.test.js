import { expect } from '@esm-bundle/chai';
import {
  arrowDown,
  aTimeout,
  enter,
  escKeyDown,
  fire,
  fixtureSync,
  focusin,
  focusout,
  mousedown,
  nextFrame,
  nextRender,
  tabKeyDown,
} from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '@vaadin/grid/vaadin-grid.js';
import { flushGrid, getCell, getContainerCell } from '@vaadin/grid/test/helpers.js';
import { Tooltip } from '@vaadin/tooltip';
import { mouseenter, mouseleave } from '@vaadin/tooltip/test/helpers.js';

function getHeaderCell(grid, index = 0) {
  return grid.$.header.querySelectorAll('[part~="cell"]')[index];
}

describe('tooltip', () => {
  let grid, tooltip;

  beforeEach(async () => {
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
    tooltip.generator = ({ column, item }) => {
      return column && column.path && item ? `${column.path}: ${item[column.path]}` : '';
    };
    await nextRender();
  });

  describe('properties', () => {
    it('should set manual on the tooltip to true', () => {
      expect(tooltip.manual).to.be.true;
    });

    it('should set tooltip opened to false when the grid is removed', () => {
      tooltip.opened = true;

      grid.remove();

      expect(tooltip.opened).to.be.false;
    });
  });

  describe('mouse', () => {
    const DEFAULT_DELAY = 500;

    let cell, clock;

    beforeEach(() => {
      cell = getCell(grid, 0);

      clock = sinon.useFakeTimers({
        shouldClearNativeTimers: true,
      });
    });

    afterEach(() => {
      // Wait for cooldown
      clock.tick(DEFAULT_DELAY);
      clock.restore();
    });

    it('should show tooltip on cell mouseenter', () => {
      mouseenter(cell);
      clock.tick(DEFAULT_DELAY);

      expect(tooltip.opened).to.be.true;
    });

    it('should hide tooltip on cell mouseleave', () => {
      mouseenter(cell);
      clock.tick(DEFAULT_DELAY);

      mouseleave(cell);
      clock.tick(DEFAULT_DELAY);

      expect(tooltip.opened).to.be.false;
    });

    it('should set tooltip target on cell mouseenter', () => {
      mouseenter(cell);
      clock.tick(DEFAULT_DELAY);

      expect(tooltip.target).to.be.equal(cell);
    });

    it('should set tooltip context on cell mouseenter', () => {
      mouseenter(cell);
      clock.tick(DEFAULT_DELAY);

      expect(tooltip.context).to.be.instanceOf(Object);
      expect(tooltip.context.item.firstName).to.equal('John');
      expect(tooltip.context.item.lastName).to.equal('Doe');
    });

    it('should change tooltip context on header cell mouseenter', () => {
      mouseenter(cell);
      clock.tick(DEFAULT_DELAY);

      mouseleave(cell);
      clock.tick(DEFAULT_DELAY);

      mouseenter(getHeaderCell(grid, 0));
      clock.tick(DEFAULT_DELAY);

      expect(tooltip.context.item).to.be.not.ok;
    });

    it('should hide tooltip on cell mousedown', () => {
      mouseenter(cell);
      clock.tick(DEFAULT_DELAY);

      mousedown(cell);
      expect(tooltip.opened).to.be.false;
    });
  });

  describe('focus', () => {
    const DEFAULT_DELAY = 500;

    let cell, clock;

    beforeEach(() => {
      cell = getCell(grid, 0);

      clock = sinon.useFakeTimers({
        shouldClearNativeTimers: true,
      });
    });

    afterEach(() => {
      // Wait for cooldown
      clock.tick(DEFAULT_DELAY);
      clock.restore();
    });

    it('should show tooltip on cell keyboard focus', () => {
      tabKeyDown(document.body);
      focusin(cell);
      clock.tick(DEFAULT_DELAY);

      expect(tooltip.opened).to.be.true;
    });

    it('should set tooltip target on cell keyboard focus', () => {
      tabKeyDown(document.body);
      focusin(cell);
      clock.tick(DEFAULT_DELAY);

      expect(tooltip.target).to.be.equal(cell);
    });

    it('should set tooltip context on cell keyboard focus', () => {
      tabKeyDown(document.body);
      focusin(cell);
      clock.tick(DEFAULT_DELAY);

      expect(tooltip.context).to.be.instanceOf(Object);
      expect(tooltip.context.item.firstName).to.equal('John');
      expect(tooltip.context.item.lastName).to.equal('Doe');
    });

    it('should hide tooltip on cell content keyboard focus', () => {
      // Make the first column render inputs
      grid.firstElementChild.renderer = (root) => {
        root.innerHTML = '<input>';
      };

      tabKeyDown(document.body);
      focusin(cell);
      clock.tick(DEFAULT_DELAY);

      arrowDown(cell);
      expect(tooltip.opened).to.be.true;

      // Enter interaction mode (the input gets focus)
      const focusedCell = getContainerCell(grid.$.items, 1, 0);
      enter(focusedCell);

      clock.tick(DEFAULT_DELAY);

      expect(tooltip.opened).to.be.false;
    });

    it('should hide tooltip on grid focusout', () => {
      tabKeyDown(document.body);
      focusin(cell);
      clock.tick(DEFAULT_DELAY);

      focusout(grid);
      clock.tick(DEFAULT_DELAY);

      expect(tooltip.opened).to.be.false;
    });

    it('should hide tooltip on grid cell content Esc', () => {
      tabKeyDown(document.body);
      focusin(cell._content);
      clock.tick(DEFAULT_DELAY);

      escKeyDown(cell._content);
      expect(tooltip.opened).to.be.false;
    });
  });

  describe('no tooltip', () => {
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

  describe('delay', () => {
    before(() => {
      Tooltip.setDefaultFocusDelay(0);
      Tooltip.setDefaultHoverDelay(0);
      Tooltip.setDefaultHideDelay(0);
    });

    let cell;

    beforeEach(() => {
      cell = getCell(grid, 0);
    });

    afterEach(async () => {
      // Wait for cooldown
      await aTimeout(1);
    });

    it('should use hover delay on cell mouseenter', async () => {
      tooltip.hoverDelay = 1;

      mouseenter(cell);
      expect(tooltip.opened).to.be.false;

      await aTimeout(1);
      expect(tooltip.opened).to.be.true;
    });

    it('should use hide delay on cell mouseleave', async () => {
      tooltip.hideDelay = 1;

      mouseenter(cell);

      mouseleave(cell);
      expect(tooltip.opened).to.be.true;

      await aTimeout(1);
      expect(tooltip.opened).to.be.false;
    });

    it('should not use hide delay on cell mousedown', () => {
      tooltip.hideDelay = 1;

      mouseenter(cell);

      mousedown(cell);
      expect(tooltip.opened).to.be.false;
    });

    it('should use focus delay on cell keyboard focus', async () => {
      tooltip.focusDelay = 1;

      tabKeyDown(document.body);
      focusin(cell);
      expect(tooltip.opened).to.be.false;

      await aTimeout(1);
      expect(tooltip.opened).to.be.true;
    });

    it('should not use hide delay on grid cell content Esc', () => {
      tooltip.hideDelay = 1;

      tabKeyDown(document.body);
      focusin(cell._content);

      escKeyDown(cell._content);
      expect(tooltip.opened).to.be.false;
    });
  });

  describe('scrolling', () => {
    before(() => {
      Tooltip.setDefaultFocusDelay(0);
      Tooltip.setDefaultHoverDelay(0);
      Tooltip.setDefaultHideDelay(0);
    });

    let cell;

    beforeEach(() => {
      cell = getCell(grid, 0);
    });

    afterEach(async () => {
      // Wait for cooldown
      await aTimeout(1);
    });

    it('should hide the tooltip when starting scrolling', () => {
      mouseenter(cell);
      expect(tooltip.opened).to.be.true;

      fire(grid.$.table, 'scroll');

      expect(tooltip.opened).to.be.false;
    });

    it('should not hide the tooltip when scrolling using keyboard navigation', async () => {
      tabKeyDown(document.body);
      focusin(cell);
      expect(tooltip.opened).to.be.true;

      await sendKeys({ press: 'ArrowDown' });
      fire(grid.$.table, 'scroll');
      await nextFrame();

      expect(tooltip.opened).to.be.true;
    });

    it('should not show the tooltip on mouseenter while scrolling', async () => {
      fire(grid.$.table, 'scroll');
      await nextFrame();

      const cell = getCell(grid, 0);
      mouseenter(cell);

      expect(tooltip.opened).to.be.false;
    });
  });
});
