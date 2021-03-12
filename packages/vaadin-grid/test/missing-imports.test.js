import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { flushGrid, infiniteDataProvider } from './helpers.js';
import '../vaadin-grid.js';

describe('missing imports', () => {
  let grid;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 200px; height: 300px;" size="1000">
      </vaadin-grid>
    `);
  });

  [
    'vaadin-grid-column-group',
    'vaadin-grid-filter',
    'vaadin-grid-filter-column',
    'vaadin-grid-tree-toggle',
    'vaadin-grid-selection-column',
    'vaadin-grid-sort-column',
    'vaadin-grid-sorter'
  ].forEach((elementName) => {
    describe(`import warning for ${elementName}`, () => {
      beforeEach(() => {
        sinon.stub(console, 'warn');
      });

      afterEach(() => {
        console.warn.restore();
      });

      it('should not warn if not in use', () => {
        grid._observer && grid._observer.flush && grid._observer.flush();
        grid._debouncerCheckImports.flush();
        expect(console.warn.called).to.be.false;
      });

      it('should warn once if in use', () => {
        grid.appendChild(document.createElement(elementName));
        grid.appendChild(document.createElement(elementName));
        grid._observer && grid._observer.flush && grid._observer.flush();
        grid._debouncerCheckImports.flush();
        expect(console.warn.callCount).to.equal(1);
      });

      it('should warn and not throw after adding', () => {
        grid.appendChild(document.createElement(elementName));
        grid._observer && grid._observer.flush && grid._observer.flush();
        grid._debouncerCheckImports.flush();

        let error;
        try {
          grid.dataProvider = infiniteDataProvider;
          flushGrid(grid);
        } catch (e) {
          error = e;
        }
        expect(console.warn.called).to.be.true;
        expect(error).to.not.be.instanceOf(Error);
      });
    });
  });
});
