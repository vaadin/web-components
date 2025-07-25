import { expect } from '@vaadin/chai-plugins';
import { click, fixtureSync } from '@vaadin/testing-helpers';
import './grid-test-styles.js';
import '../all-imports.js';
import { flushGrid, getContainerCell } from './helpers.js';

describe('event context', () => {
  let grid, column, columnGroup;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column-group header="column group header">
          <vaadin-grid-column path="foo" header="column header"></vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `);
    column = grid.querySelector('vaadin-grid-column');
    column.footerRenderer = (root) => {
      root.textContent = 'column footer';
    };
    columnGroup = grid.querySelector('vaadin-grid-column-group');
    columnGroup.footerRenderer = (root) => {
      root.textContent = 'column group footer';
    };
    grid.items = [{ foo: 'bar' }];
    grid.rowDetailsRenderer = (root) => {
      root.innerHTML = '<div>details</div>';
    };
    grid.openItemDetails(grid.items[0]);

    flushGrid(grid);
  });

  const testEventContext = (target, expectedContext, done) => {
    grid.addEventListener('click', (e) => {
      const context = grid.getEventContext(e);
      expect(context).to.deep.equal(expectedContext);
      done();
    });
    click(target);
  };

  it('should include properties when targeting body', (done) => {
    const cell = getContainerCell(grid.$.items, 0, 0);
    testEventContext(
      cell,
      {
        item: { foo: 'bar' },
        column,
        section: 'body',
        index: 0,
        selected: false,
        detailsOpened: true,
        expanded: false,
        level: 0,
      },
      done,
    );
  });

  it('should include properties when targeting header', (done) => {
    const headerCell = getContainerCell(grid.$.header, 1, 0);
    testEventContext(
      headerCell,
      {
        column,
        section: 'header',
      },
      done,
    );
  });

  it('should include properties when targeting footer', (done) => {
    const footerCell = getContainerCell(grid.$.footer, 0, 0);
    testEventContext(
      footerCell,
      {
        column,
        section: 'footer',
      },
      done,
    );
  });

  it('should include properties when targeting column-group header', (done) => {
    const columnGroupHeader = getContainerCell(grid.$.header, 0, 0);
    testEventContext(
      columnGroupHeader,
      {
        column: columnGroup,
        section: 'header',
      },
      done,
    );
  });

  it('should include properties when targeting column-group footer', (done) => {
    const columnGroupFooter = getContainerCell(grid.$.footer, 1, 0);
    testEventContext(
      columnGroupFooter,
      {
        column: columnGroup,
        section: 'footer',
      },
      done,
    );
  });

  it('should include properties when targeting row details', (done) => {
    const detailsCell = getContainerCell(grid.$.items, 0, 1);
    testEventContext(
      detailsCell,
      {
        item: { foo: 'bar' },
        section: 'details',
        index: 0,
        selected: false,
        detailsOpened: true,
        expanded: false,
        level: 0,
      },
      done,
    );
  });

  it('should return empty object when targeting empty body', (done) => {
    testEventContext(grid.$.table, {}, done);
  });

  it('should return empty object when targeting grid element', (done) => {
    testEventContext(grid, {}, done);
  });

  it('should use composedPath() stored on the event', (done) => {
    grid.addEventListener('click', (e) => {
      // Emulate the context-menu gesture
      e.__composedPath = e.composedPath();

      setTimeout(() => {
        const context = grid.getEventContext(e);
        expect(context.column).to.deep.equal(column);
        done();
      });
    });

    const cell = getContainerCell(grid.$.items, 0, 0);
    click(cell);
  });
});
