import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-grid-pro.js';
import { Grid } from '@vaadin/grid/src/vaadin-grid.js';
import { GridColumn } from '@vaadin/grid/src/vaadin-grid-column.js';
import { flushGrid, infiniteDataProvider } from './helpers.js';

describe('custom element definition', () => {
  let grid, tagName;

  beforeEach(() => {
    grid = fixtureSync('<vaadin-grid-pro></vaadin-grid-pro>');
    tagName = grid.tagName.toLowerCase();
  });

  it('should be defined in custom element registry', () => {
    expect(customElements.get(tagName)).to.be.ok;
  });

  it('should have a valid static "is" getter', () => {
    expect(customElements.get(tagName).is).to.equal(tagName);
  });
});

describe('basic features', () => {
  let grid, column;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid-pro style="width: 200px; height: 300px;" size="1000">
        <vaadin-grid-column></vaadin-grid-column>
      </vaadin-grid-pro>
    `);
    column = grid.querySelector('vaadin-grid-column');
    column.renderer = (root, _, { index }) => {
      root.textContent = index;
    };
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
  });

  it('should extend Grid', () => {
    expect(grid instanceof Grid).to.be.true;
  });

  it('should be possible to use grid modules for defining content and layout', () => {
    expect(column instanceof GridColumn).to.be.true;
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
    grid._observer?.flush?.();
    grid._debouncerCheckImports?.flush();
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
