import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, listenOnce, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-crud-grid.js';
import { flushGrid, getBodyCellContent, getHeaderCellContent } from './helpers.js';

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

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      grid = fixtureSync('<vaadin-crud-grid></vaadin-crud-grid>');
      tagName = grid.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('basic', () => {
    beforeEach(() => {
      grid = fixtureSync('<vaadin-crud-grid style="width: 500px;" exclude="_id,password"></vaadin-crud-grid>');
    });

    it('should not generate any column when providing an empty item list', () => {
      expect(grid.querySelectorAll('vaadin-grid-column')).to.be.empty;
    });

    it('should generate one column when providing list of primitives', () => {
      grid.items = ['foo', 'bar'];
      expect(grid.querySelectorAll('vaadin-grid-column').length).to.be.equal(1);
    });

    it('should generate a header structure for deep item hierarchy', async () => {
      grid.items = [
        {
          foo: 'foo',
          bar: {
            baz: {
              qux: 'qux'
            }
          }
        }
      ];
      flushGrid(grid);
      await nextRender(grid);

      // First column
      expect(getHeaderCellContent(grid, 2, 0).textContent.trim()).to.be.equal('Foo');
      // Second column
      expect(getHeaderCellContent(grid, 0, 1).textContent.trim()).to.be.equal('Bar');
      expect(getHeaderCellContent(grid, 1, 1).textContent.trim()).to.be.equal('Baz');
      expect(getHeaderCellContent(grid, 2, 1).textContent.trim()).to.be.equal('Qux');
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
        await nextRender(grid);
        expect(getHeaderCellContent(grid, 0, 2).textContent.trim()).to.be.equal('Name');
        expect(getHeaderCellContent(grid, 1, 0).textContent.trim()).to.be.equal('Role');
        expect(getHeaderCellContent(grid, 1, 1).textContent.trim()).to.be.equal('Password');
        expect(getHeaderCellContent(grid, 1, 2).textContent.trim()).to.be.equal('First');
        expect(getHeaderCellContent(grid, 1, 3).textContent.trim()).to.be.equal('Last');
      });

      it('should convert camelCase fields label into sentence field label', async () => {
        grid.include = 'passwordField,name.firstName';
        flushGrid(grid);
        await nextRender(grid);
        expect(getHeaderCellContent(grid, 1, 0).textContent.trim()).to.be.equal('Password field');
        expect(getHeaderCellContent(grid, 1, 1).textContent.trim()).to.be.equal('First name');
      });

      it('should configure include fields in the provided order when items is provided', async () => {
        grid.include = 'a, b, c';
        grid.items = [{ d: 1 }];
        flushGrid(grid);
        await nextRender(grid);

        expect(grid.querySelectorAll('vaadin-grid-column').length).to.be.equal(3);
        expect(getHeaderCellContent(grid, 0, 0).textContent.trim()).to.be.equal('A');
        expect(getHeaderCellContent(grid, 0, 1).textContent.trim()).to.be.equal('B');
        expect(getHeaderCellContent(grid, 0, 2).textContent.trim()).to.be.equal('C');
      });

      it('should not generate groups for excluded fields', async () => {
        // password is in the exclude list so it shouldn't affect the group depth
        grid.items = [
          {
            name: 'foo',
            password: {
              hash: '###'
            }
          }
        ];
        flushGrid(grid);
        await nextRender(grid);

        // The filter column should end up with only one parent group (the sorter group column)
        // which in turn should be a direct child of the grid
        const column = grid.querySelector('vaadin-grid-column');
        const sorterGroup = column.parentElement;
        expect(sorterGroup.parentElement).to.equal(grid);
      });
    });

    ['items', 'dataProvider'].forEach((type) => {
      describe(type, () => {
        beforeEach(async () => {
          if (type === 'items') {
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
            expect(getHeaderCellContent(grid, 2, c).lastElementChild.localName).to.be.equal('vaadin-grid-filter');
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

        it('should only render one control in a cell', async () => {
          grid.requestContentUpdate();
          await nextRender(grid);
          expect(getHeaderCellContent(grid, 1, 0).childElementCount).to.equal(1);
          expect(getHeaderCellContent(grid, 2, 0).childElementCount).to.equal(1);
        });
      });
    });
  });

  describe('no-sort', () => {
    beforeEach(async () => {
      grid = fixtureSync(`
        <vaadin-crud-grid style="width: 500px;" no-sort>
          <vaadin-crud-edit-column></vaadin-crud-edit-column>
        </vaadin-crud-grid>
      `);
      grid.items = items;
      flushGrid(grid);
      await nextRender(grid);
    });

    it('should add filters but no sorters', () => {
      [0, 1, 2].forEach((c) => {
        expect(getHeaderCellContent(grid, 1, c).firstElementChild.localName).to.be.equal('vaadin-grid-filter');
      });
    });
  });

  describe('no-filter', () => {
    beforeEach(async () => {
      grid = fixtureSync(`
        <vaadin-crud-grid style="width: 500px;" no-filter>
          <vaadin-crud-edit-column></vaadin-crud-edit-column>
        </vaadin-crud-grid>
      `);
      grid.items = items;
      flushGrid(grid);
      await nextRender(grid);
    });

    it('should add sorters but no filters', () => {
      [0, 1, 2].forEach((c) => {
        expect(getHeaderCellContent(grid, 1, c).firstElementChild.localName).to.be.equal('vaadin-grid-sorter');
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
