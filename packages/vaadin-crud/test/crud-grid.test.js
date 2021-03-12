import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@open-wc/testing-helpers';
import { flushGrid, getBodyCellContent, getHeaderCellContent, listenOnce, nextRender } from './helpers.js';
import '../src/vaadin-crud-grid.js';

describe('crud grid', () => {
  let grid;

  const items = [
    {
      _id: 1,
      name: {
        first: 'Grant',
        last: 'Andrews'
      },
      password: 'lorem',
      role: 'operator'
    }
  ];

  describe('basic', () => {
    beforeEach(() => {
      grid = fixtureSync('<vaadin-crud-grid style="width: 500px;" exclude="_id,password"></vaadin-crud-grid>');
    });

    it('should have a version number', () => {
      expect(customElements.get('vaadin-crud-grid').version).to.be.ok;
    });

    it('should not generate any column when providing an empty item list', () => {
      expect(grid.querySelectorAll('vaadin-grid-column')).to.be.empty;
    });

    it('should generate one column when providing list of primitives', () => {
      grid.items = ['foo', 'bar'];
      expect(grid.querySelectorAll('vaadin-grid-column').length).to.be.equal(1);
    });

    describe('include exclude', () => {
      it('should ignore excluded fields', () => {
        grid.items = items;
        flushGrid(grid);
        expect(grid.querySelectorAll('vaadin-grid-column').length).to.be.equal(3);
      });

      it('should configure include fields in the provided order', async () => {
        grid.include = 'role,password,name.first,name.last';
        flushGrid(grid);
        await aTimeout(100);
        expect(getHeaderCellContent(grid, 0, 2).textContent.trim()).to.be.equal('Name');
        expect(getHeaderCellContent(grid, 1, 0).textContent.trim()).to.be.equal('Role');
        expect(getHeaderCellContent(grid, 1, 1).textContent.trim()).to.be.equal('Password');
        expect(getHeaderCellContent(grid, 1, 2).textContent.trim()).to.be.equal('First');
        expect(getHeaderCellContent(grid, 1, 3).textContent.trim()).to.be.equal('Last');
      });

      it('should configure include fields in the provided order when items is provided', () => {
        grid.include = 'a, b, c';
        grid.items = [{ d: 1 }];
        flushGrid(grid);
        expect(grid.querySelectorAll('vaadin-grid-column').length).to.be.equal(3);
        expect(getHeaderCellContent(grid, 0, 0).textContent.trim()).to.be.equal('A');
        expect(getHeaderCellContent(grid, 0, 1).textContent.trim()).to.be.equal('B');
        expect(getHeaderCellContent(grid, 0, 2).textContent.trim()).to.be.equal('C');
      });
    });

    ['items', 'dataProvider'].forEach((type) => {
      describe(type, () => {
        beforeEach(async () => {
          if (type == 'items') {
            grid.items = items;
          } else {
            grid.dataProvider = (_, callback) => {
              callback(items, items.length);
            };
          }
          flushGrid(grid);
          await nextRender(grid);
        });

        it('should ignore excluded fields', () => {
          expect(grid.querySelectorAll('vaadin-grid-column').length).to.be.equal(3);
        });

        it('should automatically group columns from nested properties', async () => {
          await aTimeout(100);
          expect(getHeaderCellContent(grid, 0, 0).textContent).to.be.equal('Name');
          expect(getHeaderCellContent(grid, 0, 1).textContent).to.be.empty;
        });

        it('should automatically map columns from items', () => {
          expect(getHeaderCellContent(grid, 1, 0).textContent.trim()).to.be.equal('First');
          expect(getHeaderCellContent(grid, 1, 1).textContent.trim()).to.be.equal('Last');
          expect(getHeaderCellContent(grid, 1, 2).textContent.trim()).to.be.equal('Role');
        });

        it('should automatically add the edit column', () => {
          expect(getBodyCellContent(grid, 0, 3).firstElementChild.localName).to.be.equal('vaadin-crud-edit');
        });

        it('should automatically add sorters to columns', () => {
          [0, 1, 2].forEach((c) => {
            expect(getHeaderCellContent(grid, 1, c).firstElementChild.localName).to.be.equal('vaadin-grid-sorter');
          });
        });

        it('should automatically add filters to columns', () => {
          [0, 1, 2].forEach((c) => {
            expect(getHeaderCellContent(grid, 1, c).lastElementChild.localName).to.be.equal('vaadin-grid-filter');
          });
        });

        it('should automatically create body template for data', () => {
          expect(getBodyCellContent(grid, 0, 0).textContent).to.be.equal('Grant');
          expect(getBodyCellContent(grid, 0, 1).textContent).to.be.equal('Andrews');
          expect(getBodyCellContent(grid, 0, 2).textContent).to.be.equal('operator');
        });

        it('should fire edit event when the button in the edit column is clicked', (done) => {
          listenOnce(grid, 'edit', (e) => {
            expect(e.detail.item).to.be.equal(items[0]);
            expect(e.detail.index).to.be.equal(0);
            done();
          });
          getBodyCellContent(grid, 0, 3).firstElementChild.click();
        });

        it('should capitalize correctly', () => {
          expect(grid.__capitalize('aa.bb cc-dd FF')).to.be.equal('Aa bb cc dd ff');
        });
      });
    });
  });

  describe('no-sort no-filter', () => {
    beforeEach(async () => {
      grid = fixtureSync(`
        <vaadin-crud-grid style="width: 500px;" no-sort no-filter>
          <vaadin-crud-edit-column></vaadin-crud-edit-column>
        </vaadin-crud-grid>
      `);
      grid.items = items;
      flushGrid(grid);
      await nextRender(grid);
    });

    it('should not add sorters and filters if disabled', () => {
      expect(getHeaderCellContent(grid, 1, 0).firstElementChild).not.to.be.ok;
      expect(getHeaderCellContent(grid, 1, 0).textContent).to.be.equal('First');
    });
  });

  describe('no-head', () => {
    beforeEach(async () => {
      grid = fixtureSync('<vaadin-crud-grid style="width: 500px;" no-head></vaadin-crud-grid>');
      grid.items = items;
      flushGrid(grid);
      await nextRender(grid);
    });

    it('should not add headers', () => {
      expect(getHeaderCellContent(grid, 0, 0).firstElementChild).not.to.be.ok;
    });
  });

  describe('theme', () => {
    beforeEach(async () => {
      grid = fixtureSync(`
        <vaadin-grid style="width: 500px;">
          <vaadin-crud-edit-column theme="foo"></vaadin-crud-edit-column>
        </vaadin-grid>
      `);
      grid.items = items;
      flushGrid(grid);
      await nextRender(grid);
    });

    it('should theme edit icon element', () => {
      const editElem = getBodyCellContent(grid, 0, 0).firstElementChild;
      expect(editElem.localName).to.be.equal('vaadin-crud-edit');
      expect(editElem.getAttribute('theme')).to.be.equal('foo');
    });
  });
});
