import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-crud.js';
import { getHeaderCellContent } from './helpers.js';

const ITEMS = [{ name: 'John' }, { name: 'Anna' }];

describe('crud grid properties', () => {
  let crud, grid;

  describe('no-sort', () => {
    describe('set before items', () => {
      beforeEach(async () => {
        crud = fixtureSync('<vaadin-crud></vaadin-crud>');
        crud.noSort = true;
        crud.items = ITEMS;
        grid = crud.querySelector('vaadin-crud-grid');
        await nextRender();
      });

      it('should not have sorters but filters', () => {
        expect(getHeaderCellContent(grid, 0, 0).firstChild.localName).to.be.equal('vaadin-grid-filter');
        expect(getHeaderCellContent(grid, 1, 0)).to.not.be.ok;
      });
    });

    describe('set after items', () => {
      beforeEach(async () => {
        crud = fixtureSync('<vaadin-crud></vaadin-crud>');
        crud.items = ITEMS;
        crud.noSort = true;
        grid = crud.querySelector('vaadin-crud-grid');
        await nextRender();
      });

      it('should not have sorters but filters', () => {
        expect(getHeaderCellContent(grid, 0, 0).firstChild.localName).to.be.equal('vaadin-grid-filter');
        expect(getHeaderCellContent(grid, 1, 0)).to.not.be.ok;
      });
    });

    describe('set with include', () => {
      beforeEach(async () => {
        crud = fixtureSync('<vaadin-crud></vaadin-crud>');
        crud.items = ITEMS;
        crud.noSort = true;
        crud.include = 'name';
        grid = crud.querySelector('vaadin-crud-grid');
        await nextRender();
      });

      it('should not have sorters but filters', () => {
        expect(getHeaderCellContent(grid, 0, 0).firstChild.localName).to.be.equal('vaadin-grid-filter');
        expect(getHeaderCellContent(grid, 1, 0)).to.not.be.ok;
      });
    });
  });

  describe('no-filter', () => {
    describe('set before items', () => {
      beforeEach(async () => {
        crud = fixtureSync('<vaadin-crud></vaadin-crud>');
        crud.noFilter = true;
        crud.items = ITEMS;
        grid = crud.querySelector('vaadin-crud-grid');
        await nextRender();
      });

      it('should not have filters but sorters', () => {
        expect(getHeaderCellContent(grid, 0, 0).firstChild.localName).to.be.equal('vaadin-grid-sorter');
        expect(getHeaderCellContent(grid, 1, 0)).to.not.be.ok;
      });
    });

    describe('set after items', () => {
      beforeEach(async () => {
        crud = fixtureSync('<vaadin-crud></vaadin-crud>');
        crud.items = ITEMS;
        crud.noFilter = true;
        grid = crud.querySelector('vaadin-crud-grid');
        await nextRender();
      });

      it('should not have filters but sorters', () => {
        expect(getHeaderCellContent(grid, 0, 0).firstChild.localName).to.be.equal('vaadin-grid-sorter');
        expect(getHeaderCellContent(grid, 1, 0)).to.not.be.ok;
      });
    });

    describe('set with include', () => {
      beforeEach(async () => {
        crud = fixtureSync('<vaadin-crud></vaadin-crud>');
        crud.items = ITEMS;
        crud.noFilter = true;
        crud.include = 'name';
        grid = crud.querySelector('vaadin-crud-grid');
        await nextRender();
      });

      it('should not have filters but sorters', () => {
        expect(getHeaderCellContent(grid, 0, 0).firstChild.localName).to.be.equal('vaadin-grid-sorter');
        expect(getHeaderCellContent(grid, 1, 0)).to.not.be.ok;
      });
    });
  });

  describe('no-head', () => {
    describe('set before items', () => {
      beforeEach(async () => {
        crud = fixtureSync('<vaadin-crud></vaadin-crud>');
        crud.noHead = true;
        crud.items = ITEMS;
        grid = crud.querySelector('vaadin-crud-grid');
        await nextRender();
      });

      it('should not have headers', () => {
        expect(getHeaderCellContent(grid, 0, 0).childElementCount).to.equal(0);
        expect(getHeaderCellContent(grid, 1, 0).childElementCount).to.equal(0);
      });
    });

    describe('set after items', () => {
      beforeEach(async () => {
        crud = fixtureSync('<vaadin-crud></vaadin-crud>');
        crud.items = ITEMS;
        crud.noHead = true;
        grid = crud.querySelector('vaadin-crud-grid');
        await nextRender();
      });

      it('should not have headers', () => {
        expect(getHeaderCellContent(grid, 0, 0).childElementCount).to.equal(0);
        expect(getHeaderCellContent(grid, 1, 0).childElementCount).to.equal(0);
      });
    });

    describe('set with include', () => {
      beforeEach(async () => {
        crud = fixtureSync('<vaadin-crud></vaadin-crud>');
        crud.items = ITEMS;
        crud.noHead = true;
        crud.include = 'name';
        grid = crud.querySelector('vaadin-crud-grid');
        await nextRender();
      });

      it('should not have headers', () => {
        expect(getHeaderCellContent(grid, 0, 0).childElementCount).to.equal(0);
        expect(getHeaderCellContent(grid, 1, 0).childElementCount).to.equal(0);
      });
    });
  });
});
