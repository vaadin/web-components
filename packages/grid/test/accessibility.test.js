import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../all-imports.js';
import { flushGrid } from './helpers.js';

describe('accessibility', () => {
  let grid;

  function initGridRenderer(grouped) {
    grid = fixtureSync('<vaadin-grid></vaadin-grid>');
    const col1 = document.createElement('vaadin-grid-column');
    const col2 = document.createElement('vaadin-grid-column');
    const col3 = document.createElement('vaadin-grid-column');
    col3.setAttribute('row-header', '');
    if (grouped) {
      const grp = document.createElement('vaadin-grid-column-group');
      grp.headerRenderer = (root) => {
        root.textContent = 'Group header';
      };
      grp.footerRenderer = (root) => {
        root.textContent = 'Group footer';
      };
      grp.appendChild(col1);
      grp.appendChild(col2);
      grp.appendChild(col3);
      grid.appendChild(grp);
    } else {
      grid.appendChild(col1);
      grid.appendChild(col2);
      grid.appendChild(col3);
    }

    col1.headerRenderer = col2.headerRenderer = (root) => {
      root.textContent = 'header';
    };
    col1.footerRenderer = col2.footerRenderer = (root) => {
      root.textContent = 'footer';
    };
    col1.renderer = (root, _col, model) => {
      root.textContent = model.index;
    };
    col2.renderer = (root, _col, model) => {
      root.textContent = model.item;
    };
    grid.items = ['foo', 'bar'];
    flushGrid(grid);
  }

  function initFixture(fixtureName) {
    initGridRenderer(fixtureName === 'group');
    if (fixtureName === 'details') {
      grid.rowDetailsRenderer = (root) => {
        root.textContent = 'details';
      };
    }
  }

  function uniqueAttrValues(elements, attr) {
    const unique = [],
      valuesSet = new Set();
    Array.from(elements).forEach((el) => valuesSet.add(el.getAttribute(attr)));
    valuesSet.forEach((v) => unique.push(v));
    return unique;
  }

  describe('default', () => {
    beforeEach(async () => {
      initFixture('default');
      await nextFrame();
    });

    describe('structural roles', () => {
      it('should have role treegrid on table', () => {
        expect(grid.$.table.getAttribute('role')).to.equal('treegrid');
      });

      it('should have role rowgroup on row groups', () => {
        expect(grid.$.header.getAttribute('role')).to.equal('rowgroup');
        expect(grid.$.items.getAttribute('role')).to.equal('rowgroup');
        expect(grid.$.footer.getAttribute('role')).to.equal('rowgroup');
      });

      it('should have role row on rows', () => {
        expect(grid.$.header.children[0].getAttribute('role')).to.equal('row');
        expect(grid.$.items.children[0].getAttribute('role')).to.equal('row');
        expect(grid.$.items.children[1].getAttribute('role')).to.equal('row');
        expect(grid.$.footer.children[0].getAttribute('role')).to.equal('row');
      });

      it('should have role columnheader on header cells', () => {
        expect(grid.$.header.children[0].children[0].getAttribute('role')).to.equal('columnheader');
        expect(grid.$.header.children[0].children[1].getAttribute('role')).to.equal('columnheader');
      });

      it('should have role gridcell on body cells by default', () => {
        expect(grid.$.items.children[0].children[0].getAttribute('role')).to.equal('gridcell');
        expect(grid.$.items.children[0].children[1].getAttribute('role')).to.equal('gridcell');
      });

      it('should have role rowheader on body cells when `rowHeader` is set to true', () => {
        expect(grid.$.items.children[0].children[2].getAttribute('role')).to.equal('rowheader');
        expect(grid.$.items.children[1].children[2].getAttribute('role')).to.equal('rowheader');
      });

      it('should change role from rowheader to gridcell when `rowHeader` is set to false', () => {
        const columns = grid.querySelectorAll('vaadin-grid-column');
        columns[2].rowHeader = false;
        expect(grid.$.items.children[0].children[2].getAttribute('role')).to.equal('gridcell');
        expect(grid.$.items.children[1].children[2].getAttribute('role')).to.equal('gridcell');
      });
    });

    describe('selection', () => {
      it('should have aria-multiselectable on table', () => {
        expect(grid.$.table.getAttribute('aria-multiselectable')).to.equal('true');
      });

      it('should have aria-selected defined on body rows', () => {
        expect(uniqueAttrValues(grid.$.items.querySelectorAll('tr'), 'aria-selected')).to.eql(['false']);
      });

      it('should have aria-selected defined on body cells', () => {
        expect(uniqueAttrValues(grid.$.items.querySelectorAll('td'), 'aria-selected')).to.eql(['false']);
      });

      it('should set aria-selected true for selected items', () => {
        grid.selectedItems = grid.items.slice(1);

        expect(grid.$.items.children[0].getAttribute('aria-selected')).to.equal('false');
        expect(uniqueAttrValues(grid.$.items.children[0].children, 'aria-selected')).to.eql(['false']);
        expect(grid.$.items.children[1].getAttribute('aria-selected')).to.equal('true');
        expect(uniqueAttrValues(grid.$.items.children[1].children, 'aria-selected')).to.eql(['true']);
      });

      it('should set aria-selected false for deselected items', () => {
        grid.selectedItems = grid.items.slice(1);
        grid.selectedItems = [];

        expect(grid.$.items.children[0].getAttribute('aria-selected')).to.equal('false');
        expect(uniqueAttrValues(grid.$.items.children[0].children, 'aria-selected')).to.eql(['false']);
        expect(grid.$.items.children[1].getAttribute('aria-selected')).to.equal('false');
        expect(uniqueAttrValues(grid.$.items.children[1].children, 'aria-selected')).to.eql(['false']);
      });
    });

    describe('row details not in use', () => {
      it('should not have aria-controls on body cells', () => {
        expect(uniqueAttrValues(grid.$.items.querySelectorAll('td'), 'aria-controls')).to.eql([null]);
      });
    });
  });

  describe('treegrid', () => {
    function hierarchicalDataProvider({ parentItem }, callback) {
      // Let's use a count lower than pageSize so we can ignore page + pageSize for now
      const itemsOnEachLevel = 5;

      const items = [...Array(itemsOnEachLevel)].map((_, i) => {
        return {
          name: `${parentItem ? `${parentItem.name}-` : ''}${i}`,
          // Let's only have child items on every second item
          children: i % 2 === 0,
        };
      });

      callback(items, itemsOnEachLevel);
    }

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid item-id-path="name">
          <vaadin-grid-column path="name" width="200px" flex-shrink="0"></vaadin-grid-column>
        </vaadin-grid>
      `);
      grid.dataProvider = hierarchicalDataProvider;
      flushGrid(grid);
    });

    it('should have aria-expanded false on expandable rows', () => {
      expect(grid.$.items.children[0].getAttribute('aria-expanded')).to.equal('false');
    });

    it('should have aria-expanded true on expanded rows', () => {
      grid.expandItem({ name: '0' });
      expect(grid.$.items.children[0].getAttribute('aria-expanded')).to.equal('true');
    });

    it('should not have aria-expanded on non expandable rows', () => {
      expect(grid.$.items.children[1].getAttribute('aria-expanded')).to.be.null;
    });

    it('should add aria-expanded to a row that becomes expandable', () => {
      grid.expandItem({ name: '0' });
      expect(grid.$.items.children[1].getAttribute('aria-expanded')).to.equal('false');
    });

    it('should remove aria-expanded from a row that becomes non expandable', () => {
      grid.expandItem({ name: '0' });
      grid.collapseItem({ name: '0' });
      expect(grid.$.items.children[1].getAttribute('aria-expanded')).to.be.null;
    });

    it('should have aria-level on expandable rows', () => {
      expect(grid.$.items.children[0].getAttribute('aria-level')).to.equal('1');
    });

    it('should not have aria-level on non expandable rows', () => {
      expect(grid.$.items.children[1].getAttribute('aria-level')).to.be.null;
    });

    it('should add aria-level to a row that becomes expandable', () => {
      grid.expandItem({ name: '0' });
      expect(grid.$.items.children[1].getAttribute('aria-level')).to.equal('2');
    });

    it('should remove aria-expanded from a row that becomes non expandable', () => {
      grid.expandItem({ name: '0' });
      grid.collapseItem({ name: '0' });
      expect(grid.$.items.children[1].getAttribute('aria-level')).to.be.null;
    });

    describe('toggle cell', () => {
      function setupTreeGrid(additionalColumns = []) {
        grid = fixtureSync(`
        <vaadin-grid item-id-path="name">
          ${additionalColumns.join('')}
          <vaadin-grid-tree-column path="name" width="200px" header="Name" flex-shrink="0"></vaadin-grid-tree-column>
          <vaadin-grid-column path="value" header="Value"></vaadin-grid-column>
        </vaadin-grid>
      `);
        grid.dataProvider = ({ parentItem }, callback) => {
          const itemsOnEachLevel = 5;
          const items = [...Array(itemsOnEachLevel)].map((_, i) => {
            return {
              name: `${parentItem ? `${parentItem.name}-` : ''}${i}`,
              value: `value-${i}`,
              children: i % 2 === 0,
              id: `${parentItem ? `${parentItem.id}-` : ''}${i}`,
            };
          });
          callback(items, itemsOnEachLevel);
        };
        flushGrid(grid);
        return grid;
      }

      function getToggleCell(row) {
        for (const cell of row.querySelectorAll('td')) {
          if (cell._content && cell._content.querySelector('vaadin-grid-tree-toggle')) {
            return cell;
          }
        }
        return null;
      }

      function getExpandableRows() {
        return Array.from(grid.$.items.children).filter((row) => row.getAttribute('aria-expanded') !== null);
      }

      describe('aria-expanded', () => {
        beforeEach(() => {
          setupTreeGrid();
        });

        it('should reflect aria-expanded state of rows', () => {
          Array.from(grid.$.items.children).forEach((row) => {
            const toggleCell = getToggleCell(row);
            expect(toggleCell).to.exist;
            expect(toggleCell.getAttribute('aria-expanded')).to.equal(row.getAttribute('aria-expanded'));
          });
        });

        it('should update cell aria-expanded when row expanded state changes', () => {
          const row = getExpandableRows()[0];
          const toggleCell = getToggleCell(row);
          const itemName = row._item.name;

          expect(row.getAttribute('aria-expanded')).to.equal('false');
          expect(toggleCell.getAttribute('aria-expanded')).to.equal('false');

          grid.expandItem({ name: itemName });
          expect(row.getAttribute('aria-expanded')).to.equal('true');
          expect(toggleCell.getAttribute('aria-expanded')).to.equal('true');

          grid.collapseItem({ name: itemName });
          expect(row.getAttribute('aria-expanded')).to.equal('false');
          expect(toggleCell.getAttribute('aria-expanded')).to.equal('false');
        });

        it('should handle expansion via keyboard interaction', async () => {
          const toggleCell = getToggleCell(getExpandableRows()[0]);
          toggleCell.focus();
          await sendKeys({ press: 'Space' });
          expect(toggleCell.getAttribute('aria-expanded')).to.equal('true');
          await sendKeys({ press: 'Space' });
          expect(toggleCell.getAttribute('aria-expanded')).to.equal('false');
        });
      });

      describe('with selection column', () => {
        beforeEach(() => {
          setupTreeGrid(['<vaadin-grid-selection-column></vaadin-grid-selection-column>']);
        });

        it('should update correct cell when selection column is present', () => {
          const expandableRows = getExpandableRows();
          expect(expandableRows.length).to.be.above(0);
          expandableRows.forEach((row) => {
            const toggleCell = getToggleCell(row);
            expect(toggleCell).to.exist;
            expect(toggleCell).to.not.equal(row.querySelector('td'));
            expect(toggleCell._content.querySelector('vaadin-grid-tree-toggle')).to.exist;
            expect(toggleCell.getAttribute('aria-expanded')).to.equal(row.getAttribute('aria-expanded'));
          });
        });
      });
    });
  });

  describe('details', () => {
    beforeEach(() => {
      initFixture('details');
    });

    describe('column count', () => {
      it('should have aria-colcount on the table', () => {
        expect(grid.$.table.getAttribute('aria-colcount')).to.equal('3');
      });

      it('should update aria-colcount when column is added', async () => {
        const column = document.createElement('vaadin-grid-column');
        column.renderer = (root, _, model) => {
          root.textContent = model.item;
        };
        grid.appendChild(column);
        await nextFrame();
        expect(grid.$.table.getAttribute('aria-colcount')).to.equal('4');
      });

      it('should update aria-colcount when grid is empty with empty-state and no header/footer rendered', async () => {
        const emptyStateText = document.createElement('span');
        emptyStateText.setAttribute('slot', 'empty-state');
        grid.appendChild(emptyStateText);
        grid.querySelectorAll('vaadin-grid-column').forEach((col) => {
          col.headerRenderer = null;
          col.footerRenderer = null;
        });
        grid.items = [];
        await nextFrame();
        expect(grid.$.table.getAttribute('aria-colcount')).to.equal('1');
      });
    });

    describe('row details in use', () => {
      it('should have aria-controls referencing detail cell id on body cells', () => {
        Array.from(grid.$.items.children).forEach((row) => {
          const detailsCell = row.querySelector('td[part~="details-cell"]');

          expect(detailsCell.id).to.be.ok;
          expect(detailsCell.getAttribute('aria-controls')).to.equal(null);
          expect(uniqueAttrValues(row.querySelectorAll('td:not([part~="details-cell"])'), 'aria-controls')).to.eql([
            detailsCell.id,
          ]);
        });
      });
    });
  });

  describe('path and header', () => {
    let col;

    beforeEach(() => {
      grid = fixtureSync('<vaadin-grid></vaadin-grid>');
      col = document.createElement('vaadin-grid-column');
      grid.appendChild(col);
      grid.items = [{ value: 'foo' }, { value: 'bar' }];
    });

    it('should have aria-rowcount on the table (path)', () => {
      col.path = 'value';
      flushGrid(grid);

      const rowCount = Array.from(grid.$.table.querySelectorAll('tr:not(#emptystaterow)')).filter(
        (tr) => !tr.hidden,
      ).length;
      expect(grid.$.table.getAttribute('aria-rowcount')).to.equal(String(rowCount));
      expect(grid.$.table.getAttribute('aria-rowcount')).to.equal('3');
    });

    it('should not count a column with a path and null header in aria-rowcount', () => {
      col.path = 'value';
      col.header = null;
      flushGrid(grid);

      const rowCount = Array.from(grid.$.table.querySelectorAll('tr:not(#emptystaterow)')).filter(
        (tr) => !tr.hidden,
      ).length;
      expect(grid.$.table.getAttribute('aria-rowcount')).to.equal(String(rowCount));
      expect(grid.$.table.getAttribute('aria-rowcount')).to.equal('2');
    });

    it('should have aria-rowcount on the table (header)', () => {
      col.header = 'Foo';
      flushGrid(grid);

      expect(grid.$.table.getAttribute('aria-rowcount')).to.equal('3');
    });
  });

  describe('size', () => {
    beforeEach(() => {
      initFixture('default');
    });

    it('should have aria-rowcount on the table', () => {
      // 2 item rows + header row + footer row = 4 in total
      expect(grid.$.table.getAttribute('aria-rowcount')).to.equal('4');
    });

    it('should update aria-rowcount on after size change', () => {
      grid.items = new Array(10).fill('foo');

      // 10 item rows + header row + footer row = 12 in total
      expect(grid.$.table.getAttribute('aria-rowcount')).to.equal('12');
    });

    it('should count the footer rows correctly as part of the aria-rowcount', async () => {
      // Remove the header renderers
      grid.querySelectorAll('vaadin-grid-column').forEach((col) => {
        col.headerRenderer = null;
      });

      await nextFrame();
      expect(grid.$.table.getAttribute('aria-rowcount')).to.equal('3');
    });

    it('should count the header rows correctly as part of the aria-rowcount', async () => {
      // Remove the footer renderers
      grid.querySelectorAll('vaadin-grid-column').forEach((col) => {
        col.footerRenderer = null;
      });

      await nextFrame();
      expect(grid.$.table.getAttribute('aria-rowcount')).to.equal('3');
    });
  });

  describe('group', () => {
    beforeEach(async () => {
      initFixture('group');
      await nextFrame();
    });

    describe('row numbers', () => {
      function setANumberOfItems(grid, number) {
        grid.items = Array.from({ length: number }, (_, i) => `item ${i}`);
        flushGrid(grid);
      }

      it('should have aria-rowindex on rows', () => {
        Array.from(grid.$.table.querySelectorAll('tr:not(#emptystaterow)')).forEach((row, index) => {
          expect(row.getAttribute('aria-rowindex')).to.equal((index + 1).toString());
        });
      });

      it('should update aria-rowindex on size change', () => {
        setANumberOfItems(grid, 100);
        expect(
          Array.from(grid.$.items.children)
            .slice(0, 5) // Assuming at least five body rows are visible
            .map((row) => row.getAttribute('aria-rowindex')),
        ).to.eql(['3', '4', '5', '6', '7']);
        expect(grid.$.footer.children[0].getAttribute('aria-rowindex')).to.equal('103');
      });

      it('should update aria-rowindex on scroll', () => {
        setANumberOfItems(grid, 1000);
        // Scroll to end
        grid.scrollToIndex(1000);

        const ariaRowindexValues = Array.from(grid.$.items.children).map((row) => row.getAttribute('aria-rowindex'));
        expect(ariaRowindexValues).to.include.members(['1000', '1001', '1002']);
        expect(ariaRowindexValues).to.not.include.members(['3', '4', '1003']);
      });
    });

    describe('column groups', () => {
      it('should have aria-colspan on group header cell', () => {
        expect(grid.$.header.children[0].children[0].getAttribute('aria-colspan')).to.equal('3');
      });
    });
  });

  describe('accessibleName', () => {
    beforeEach(() => {
      initFixture('default');
    });

    it('should not define aria-label on the table when accessibleName is not set', async () => {
      await nextFrame();
      expect(grid.$.table.getAttribute('aria-label')).to.be.null;
    });

    it('should define aria-label on the table when accessibleName is set', async () => {
      grid.accessibleName = 'Grid accessible name';
      await nextFrame();
      expect(grid.$.table.getAttribute('aria-label')).to.equal('Grid accessible name');
    });

    it('should update aria-label on the table when accessibleName is updated', async () => {
      grid.accessibleName = 'Grid accessible name';
      await nextFrame();
      grid.accessibleName = 'Updated accessible name';
      await nextFrame();
      expect(grid.$.table.getAttribute('aria-label')).to.equal('Updated accessible name');
    });

    it('should remove aria-label on the table when accessibleName is removed', async () => {
      grid.accessibleName = 'Grid accessible name';
      await nextFrame();
      grid.accessibleName = null;
      await nextFrame();
      expect(grid.$.table.getAttribute('aria-label')).to.be.null;
    });
  });
});
