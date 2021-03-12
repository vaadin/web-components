import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import { click, flushGrid, getContainerCell } from './helpers.js';
import '../vaadin-grid.js';
import '../vaadin-grid-column-group.js';

describe('event context', () => {
  let grid, column, columnGroup;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid items='[{"foo": "bar"}]'>
        <vaadin-grid-column-group header="column group header">
          <template class="footer">
            column group footer
          </template>
          <vaadin-grid-column path="foo" header="column header">
            <template class="footer">
              column footer
            </template>
          </vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `);
    column = grid.querySelector('vaadin-grid-column');
    columnGroup = grid.querySelector('vaadin-grid-column-group');

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
        column: column,
        section: 'body',
        index: 0,
        selected: false,
        detailsOpened: true,
        expanded: false,
        level: 0
      },
      done
    );
  });

  it('should include properties when targeting header', (done) => {
    const headerCell = getContainerCell(grid.$.header, 1, 0);
    testEventContext(
      headerCell,
      {
        column: column,
        section: 'header'
      },
      done
    );
  });

  it('should include properties when targeting footer', (done) => {
    const footerCell = getContainerCell(grid.$.footer, 0, 0);
    testEventContext(
      footerCell,
      {
        column: column,
        section: 'footer'
      },
      done
    );
  });

  it('should include properties when targeting column-group header', (done) => {
    const columnGroupHeader = getContainerCell(grid.$.header, 0, 0);
    testEventContext(
      columnGroupHeader,
      {
        column: columnGroup,
        section: 'header'
      },
      done
    );
  });

  it('should include properties when targeting column-group footer', (done) => {
    const columnGroupFooter = getContainerCell(grid.$.footer, 1, 0);
    testEventContext(
      columnGroupFooter,
      {
        column: columnGroup,
        section: 'footer'
      },
      done
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
        level: 0
      },
      done
    );
  });

  it('should return empty object when targeting empty body', (done) => {
    testEventContext(grid.$.table, {}, done);
  });

  it('should return empty object when targeting grid element', (done) => {
    testEventContext(grid, {}, done);
  });
});
