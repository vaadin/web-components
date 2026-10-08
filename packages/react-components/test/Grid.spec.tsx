import sinon from 'sinon';
import { useEffect, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { findByQuerySelector } from '../../../react/test/utils/findByQuerySelector.js';
import { Grid, type GridDataProvider } from '../src/Grid.js';
import { GridColumn, type GridColumnElement } from '../src/GridColumn.js';
import { GridColumnGroup } from '../src/GridColumnGroup.js';
import { GridFilterColumn } from '../src/GridFilterColumn.js';
import { GridSelectionColumn } from '../src/GridSelectionColumn.js';
import { GridSortColumn } from '../src/GridSortColumn.js';
import { GridTreeColumn } from '../src/GridTreeColumn.js';
import type { GridBodyReactRendererProps } from '../src/renderers/grid.js';

// Bounded below the 2 s test timeout, so a predicate that never holds fails with a clear message.
async function until<T = boolean>(predicate: () => T, timeout = 1500) {
  const start = Date.now();
  while (!predicate()) {
    if (Date.now() - start > timeout) {
      throw new Error(`Condition not met within ${timeout} ms: ${predicate}`);
    }
    await new Promise((r) => setTimeout(r, 10));
  }
  return predicate()!;
}

describe('Grid', () => {
  type Item = Readonly<{ name: string; surname: string; role: string }>;

  type TreeItem = { name: string; children: boolean };

  const items = [
    { name: 'John', surname: 'Lennon', role: 'singer' },
    { name: 'Ringo', surname: 'Starr', role: 'drums' },
  ];

  function HeaderGroupRenderer() {
    return <>Group header</>;
  }

  function FooterGroupRenderer() {
    return <>Group footer</>;
  }

  function DefaultHeaderRenderer() {
    return <>Name</>;
  }

  function DefaultFooterRenderer() {
    return <>Name Footer</>;
  }

  function DefaultBodyRenderer({ item }: GridBodyReactRendererProps<Item>) {
    return <>{item.name}</>;
  }

  function getGridMeaningfulParts(
    columnElementName: string,
    assertions: { expectedColumnCount: number; expectedCellCount: number },
  ) {
    return vi.waitFor(async () => {
      const grid = document.querySelector('vaadin-grid, vaadin-grid-pro')!;
      expect(grid).to.exist;

      const columns = document.querySelectorAll(columnElementName);

      // Filter cells that don't have any textContent. Grid creates empty cells for some calculations,
      // but we don't need them.
      const cells = Array.from(grid!.querySelectorAll('vaadin-grid-cell-content')).filter(
        ({ textContent }) => textContent,
      );

      const { expectedColumnCount, expectedCellCount } = assertions;
      expect(columns).to.have.lengthOf(expectedColumnCount);
      expect(cells).to.have.lengthOf(expectedCellCount);

      return [columns, cells] as const;
    });
  }

  describe('GridColumn', () => {
    it('should render correctly', async () => {
      await render(
        <Grid<Item> items={items}>
          <GridColumnGroup headerRenderer={HeaderGroupRenderer} footerRenderer={FooterGroupRenderer}>
            <GridColumn<Item> headerRenderer={DefaultHeaderRenderer} footerRenderer={DefaultFooterRenderer}>
              {DefaultBodyRenderer}
            </GridColumn>
          </GridColumnGroup>
          <GridColumnGroup header="Header using header">
            <GridColumn<Item> headerRenderer={() => <>Surname</>} footerRenderer={() => <>Surname Footer</>}>
              {({ item }) => <>{item.surname}</>}
            </GridColumn>
          </GridColumnGroup>
          <GridColumn<Item> headerRenderer={() => <>Role</>} footerRenderer={() => <>Role Footer</>}>
            {({ item }) => <>{item.role}</>}
          </GridColumn>
        </Grid>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-column', {
        expectedColumnCount: 3,
        expectedCellCount: 15,
      });

      const [headerRendererCell, headerInlineCell, nameHeaderCell, surnameHeaderCell, roleHeaderCell] = cells.slice(
        0,
        5,
      );
      const [nameFooterCell, surnameFooterCell, roleFooterCell, groupFooterCell] = cells.slice(5, 9);
      const [nameBodyCell1, surnameBodyCell1, roleBodyCell1] = cells.slice(9, 12);
      const [nameBodyCell2, surnameBodyCell2, roleBodyCell2] = cells.slice(12, 15);

      expect(headerRendererCell).to.have.text('Group header');
      expect(headerInlineCell).to.have.text('Header using header');
      expect(nameHeaderCell).to.have.text('Name');
      expect(surnameHeaderCell).to.have.text('Surname');
      expect(roleHeaderCell).to.have.text('Role');

      expect(groupFooterCell).to.have.text('Group footer');
      expect(nameFooterCell).to.have.text('Name Footer');
      expect(surnameFooterCell).to.have.text('Surname Footer');
      expect(roleFooterCell).to.have.text('Role Footer');

      expect(nameBodyCell1).to.have.text('John');
      expect(surnameBodyCell1).to.have.text('Lennon');
      expect(roleBodyCell1).to.have.text('singer');

      expect(nameBodyCell2).to.have.text('Ringo');
      expect(surnameBodyCell2).to.have.text('Starr');
      expect(roleBodyCell2).to.have.text('drums');
    });

    [
      [GridColumn<Item>, 'GridColumn'],
      [GridFilterColumn<Item>, 'GridFilterColumn'],
      [GridSelectionColumn<Item>, 'GridSelectionColumn'],
      [GridSortColumn<Item>, 'GridSortColumn'],
      [GridTreeColumn<Item>, 'GridTreeColumn'],
    ].forEach(([ColumnType, columnName]) => {
      it(`should consider custom renderer content with column auto-width: ${columnName}`, async () => {
        function GridWithAutoWidthColumns() {
          const [gridItems, setGridItems] = useState<Item[] | undefined>();

          useEffect(() => {
            setTimeout(() => setGridItems(items));
          }, []);

          return (
            <Grid<Item> items={gridItems}>
              {ColumnType !== GridFilterColumn<Item> &&
              ColumnType !== GridSelectionColumn<Item> &&
              ColumnType !== GridSortColumn<Item> ? (
                // @ts-expect-error not all column types have header prop
                <ColumnType header={<button style={{ width: '300px' }}>header</button>} autoWidth flexGrow={0} />
              ) : null}

              {ColumnType !== GridTreeColumn<Item> ? (
                <ColumnType autoWidth flexGrow={0}>
                  {({ item }) => <button style={{ width: '300px' }}>{item.name}</button>}
                </ColumnType>
              ) : null}

              <ColumnType footer={<button style={{ width: '300px' }}>footer</button>} autoWidth flexGrow={0} />
            </Grid>
          );
        }

        const error = sinon.stub(console, 'error');
        try {
          await render(<GridWithAutoWidthColumns />);

          const grid = await findByQuerySelector('vaadin-grid');
          const columns = Array.from(grid.children).filter((c): c is GridColumnElement =>
            c.localName.includes('column'),
          );
          expect(columns.length).to.be.above(0);

          for (const column of columns) {
            await until(() => parseFloat(String(column.width)) > 300);
          }
        } finally {
          // Restore even on failure, or the next parameterized case fails with "already wrapped".
          error.restore();
        }
        expect(error.called).to.be.false;
      });
    });

    it(`should consider custom renderer content with column auto-width: GridColumnGroup`, async () => {
      await render(
        <Grid<Item> items={items}>
          <GridColumnGroup header={<button style={{ width: '300px' }}>header</button>}>
            <GridColumn autoWidth flexGrow={0} />
          </GridColumnGroup>

          <GridColumnGroup footer={<button style={{ width: '300px' }}>footer</button>}>
            <GridColumn autoWidth flexGrow={0} />
          </GridColumnGroup>
        </Grid>,
      );

      const grid = await findByQuerySelector('vaadin-grid');
      const columns = Array.from(grid.querySelectorAll<GridColumnElement>('vaadin-grid-column'));
      expect(columns.length).to.be.above(0);

      for (const column of columns) {
        await until(() => parseFloat(String(column.width)) > 300);
      }
    });

    it('should support setting header and footer components', async () => {
      await render(
        <Grid<Item> items={items}>
          <GridColumnGroup header={<i>Group Header</i>} footer={<i>Group Footer</i>}>
            <GridColumn<Item> path="name" header={<b>Name</b>} footer={<b>Name Footer</b>} />
          </GridColumnGroup>
        </Grid>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-column', {
        expectedColumnCount: 1,
        expectedCellCount: 6,
      });

      const [groupHeaderCell, nameHeaderCell, nameFooterCell, groupFooterCell] = cells;

      expect(groupHeaderCell).to.have.text('Group Header');
      expect(nameHeaderCell).to.have.text('Name');
      expect(nameFooterCell).to.have.text('Name Footer');
      expect(groupFooterCell).to.have.text('Group Footer');
    });
  });

  describe('GridFilterColumn', () => {
    it('should render correctly', async () => {
      await render(
        <Grid<Item> items={items}>
          <GridFilterColumn<Item> footerRenderer={DefaultFooterRenderer}>{DefaultBodyRenderer}</GridFilterColumn>
        </Grid>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-filter-column', {
        expectedColumnCount: 1,
        expectedCellCount: 3,
      });

      const [footerCell, bodyCell1, bodyCell2] = cells;

      expect(footerCell).to.have.text('Name Footer');
      expect(bodyCell1).to.have.text('John');
      expect(bodyCell2).to.have.text('Ringo');
    });

    it('should support setting footer component', async () => {
      await render(
        <Grid<Item> items={items}>
          <GridFilterColumn<Item> path="name" footer={<i>Name Footer</i>} />
        </Grid>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-filter-column', {
        expectedColumnCount: 1,
        expectedCellCount: 4,
      });

      const footerCell = cells[1];

      expect(footerCell).to.have.text('Name Footer');
    });
  });

  describe('GridSelectionColumn', () => {
    it('should render correctly', async () => {
      await render(
        <Grid<Item> items={items}>
          <GridSelectionColumn<Item> headerRenderer={DefaultHeaderRenderer} footerRenderer={DefaultFooterRenderer}>
            {DefaultBodyRenderer}
          </GridSelectionColumn>
        </Grid>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-selection-column', {
        expectedColumnCount: 1,
        expectedCellCount: 4,
      });

      const [headerCell, footerCell, bodyCell1, bodyCell2] = cells;

      expect(headerCell).to.have.text('Name');
      expect(footerCell).to.have.text('Name Footer');
      expect(bodyCell1).to.have.text('John');
      expect(bodyCell2).to.have.text('Ringo');
    });

    it('should support setting header and footer component', async () => {
      await render(
        <Grid<Item> items={items}>
          <GridSelectionColumn header={<i>Header</i>} footer={<i>Footer</i>}>
            {DefaultBodyRenderer}
          </GridSelectionColumn>
        </Grid>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-selection-column', {
        expectedColumnCount: 1,
        expectedCellCount: 4,
      });

      const [headerCell, footerCell] = cells;

      expect(footerCell).to.have.text('Footer');
      expect(headerCell).to.have.text('Header');
    });
  });

  describe('GridSortColumn', () => {
    it('should render correctly', async () => {
      await render(
        <Grid<Item> items={items}>
          <GridSortColumn<Item> footerRenderer={DefaultFooterRenderer}>{DefaultBodyRenderer}</GridSortColumn>
        </Grid>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-sort-column', {
        expectedColumnCount: 1,
        expectedCellCount: 3,
      });

      const [footerCell, bodyCell1, bodyCell2] = cells;

      expect(footerCell).to.have.text('Name Footer');
      expect(bodyCell1).to.have.text('John');
      expect(bodyCell2).to.have.text('Ringo');
    });

    it('should support setting footer component', async () => {
      await render(
        <Grid<Item> items={items}>
          <GridSortColumn<Item> path="name" footer={<i>Name Footer</i>} />
        </Grid>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-sort-column', {
        expectedColumnCount: 1,
        expectedCellCount: 4,
      });

      const footerCell = cells[1];

      expect(footerCell).to.have.text('Name Footer');
    });
  });

  describe('GridTreeColumn', () => {
    const dataProvider: GridDataProvider<TreeItem> = ({ parentItem, page, pageSize }, cb) => {
      const levelSize = 2;

      const pageItems = [...Array(Math.min(levelSize, pageSize))].map((_, i) => {
        const indexInLevel = page * pageSize + i;

        return {
          name: `${parentItem ? parentItem.name + '-' : ''}${indexInLevel}`,
          children: true,
        };
      });

      cb(pageItems, levelSize);
    };

    it('should render correctly', async () => {
      await render(
        <Grid<TreeItem> dataProvider={dataProvider}>
          <GridTreeColumn path="name" headerRenderer={DefaultHeaderRenderer} footerRenderer={DefaultFooterRenderer} />
          <GridColumn path="name" />
        </Grid>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-tree-column', {
        expectedColumnCount: 1,
        expectedCellCount: 7,
      });

      const [treeHeaderCell, nameHeaderCell, treeFooterCell] = cells;

      expect(treeHeaderCell).to.have.text('Name');
      expect(nameHeaderCell).to.have.text('Name');
      expect(treeFooterCell).to.have.text('Name Footer');
    });

    it('should support setting header and footer components', async () => {
      await render(
        <Grid<TreeItem> dataProvider={dataProvider}>
          <GridTreeColumn path="name" header={<b>Name</b>} footer={<b>Name Footer</b>} />
          <GridColumn path="name" />
        </Grid>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-tree-column', {
        expectedColumnCount: 1,
        expectedCellCount: 7,
      });

      const [treeHeaderCell, nameHeaderCell, treeFooterCell] = cells;

      expect(treeHeaderCell).to.have.text('Name');
      expect(nameHeaderCell).to.have.text('Name');
      expect(treeFooterCell).to.have.text('Name Footer');
    });
  });
});
