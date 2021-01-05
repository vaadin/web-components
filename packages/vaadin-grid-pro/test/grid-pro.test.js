import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { GridElement } from '@vaadin/vaadin-grid/src/vaadin-grid.js';
import { GridColumnElement } from '@vaadin/vaadin-grid/src/vaadin-grid-column.js';
import { fixtureSync } from '@open-wc/testing-helpers';
import { flushGrid, infiniteDataProvider } from './helpers.js';
import '../vaadin-grid-pro.js';

describe('basic features', () => {
  let grid, column;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid-pro style="width: 200px; height: 300px;" size="1000">
        <vaadin-grid-column>
          <template>[[index]]</template>
        </vaadin-grid-column>
      </vaadin-grid-pro>
    `);
    column = grid.querySelector('vaadin-grid-column');
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
  });

  it('should not expose class name globally', function () {
    expect(window.GridProElement).not.to.be.ok;
  });

  it('should extend GridElement', () => {
    expect(grid instanceof GridElement).to.be.true;
  });

  it('should be possible to use grid modules for defining content and layout', () => {
    expect(column instanceof GridColumnElement).to.be.true;
    expect(grid.querySelectorAll('vaadin-grid-cell-content').length).to.above(0);
  });

  it('should properly define host grid', () => {
    expect(column._findHostGrid().localName).to.be.equal('vaadin-grid-pro');
  });
});

describe('missing imports', () => {
  let grid;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid-pro style="width: 200px; height: 300px;" size="1000"></vaadin-grid-pro>
    `);
  });

  const flushDebouncers = () => {
    grid._observer && grid._observer.flush && grid._observer.flush();
    grid._debouncerCheckImports && grid._debouncerCheckImports.flush();
  };

  const describeMissingImportWarning = (elementName) => {
    describe(`import warning for ${elementName}`, () => {
      beforeEach(() => {
        sinon.stub(console, 'warn');
      });

      afterEach(() => {
        console.warn.restore();
      });

      it('should not warn if not in use', () => {
        flushDebouncers();
        expect(console.warn.called).to.be.false;
      });

      it('should warn once if in use', () => {
        grid.appendChild(document.createElement(elementName));
        grid.appendChild(document.createElement(elementName));
        flushDebouncers();
        expect(console.warn.callCount).to.equal(1);
      });

      it('should warn and not throw after adding', () => {
        grid.appendChild(document.createElement(elementName));
        flushDebouncers();

        let error;
        try {
          grid.dataProvider = infiniteDataProvider;
          flushGrid(grid);
        } catch (e) {
          error = e;
        } finally {
          expect(console.warn.called).to.be.true;
        }

        expect(error).to.not.be.instanceOf(Error);
      });

      it('should not warn for present import', async () => {
        await import(`../${elementName}.js`);
        grid.appendChild(document.createElement(elementName));
        flushDebouncers();
        expect(console.warn.called).to.be.false;
      });
    });
  };

  describeMissingImportWarning('vaadin-grid-pro-edit-column');
});
