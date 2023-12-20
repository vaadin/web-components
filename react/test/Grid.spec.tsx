import { expect, use as useChaiPlugin } from '@esm-bundle/chai';
import chaiDom from 'chai-dom';
import { cleanup, render } from '@testing-library/react/pure.js';
import { Grid, type GridDataProvider } from '../src/Grid.js';
import { GridColumn, GridColumnElement } from '../src/GridColumn.js';
import { GridFilterColumn } from '../src/GridFilterColumn.js';
import { GridProEditColumn } from '../src/GridProEditColumn.js';
import { GridSelectionColumn } from '../src/GridSelectionColumn.js';
import { GridSortColumn } from '../src/GridSortColumn.js';
import { GridTreeColumn } from '../src/GridTreeColumn.js';
import type { GridBodyReactRendererProps } from '../src/renderers/grid.js';
import catchRender from './utils/catchRender.js';
import { GridColumnGroup } from '../src/GridColumnGroup.js';
import { findByQuerySelector } from './utils/findByQuerySelector.js';

useChaiPlugin(chaiDom);

async function until(predicate: () => boolean) {
  while (!predicate()) {
    await new Promise((r) => setTimeout(r, 10));
  }
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

  function isGridCellContentNodeRendered(node: Node) {
    return (
      node instanceof Text &&
      node.parentNode instanceof HTMLElement &&
      node.parentNode.localName === 'vaadin-grid-cell-content'
    );
  }

  async function getGridMeaningfulParts(columnElementName: string) {
    const grid = document.querySelector('vaadin-grid')!;
    expect(grid).to.exist;

    await catchRender(grid, isGridCellContentNodeRendered);

    const columns = document.querySelectorAll(columnElementName);

    // Filter cells that don't have any textContent. Grid creates empty cells for some calculations,
    // but we don't need them.
    const cells = Array.from(grid!.querySelectorAll('vaadin-grid-cell-content')).filter(
      ({ textContent }) => textContent,
    );

    return [columns, cells] as const;
  }

  afterEach(cleanup);

  describe('GridColumn', () => {
    it('should render correctly', async () => {
      render(
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

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-column');

      expect(columns).to.have.length(3);
      expect(cells).to.have.length(15);

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
        render(
          <Grid<Item> items={items}>
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
          </Grid>,
        );

        const grid = await findByQuerySelector('vaadin-grid');
        const columns = Array.from(grid.children).filter((c): c is GridColumnElement => c.localName.includes('column'));
        expect(columns.length).to.be.above(0);

        for (const column of columns) {
          await until(() => parseFloat(String(column.width)) > 300);
        }
      });
    });

    it(`should consider custom renderer content with column auto-width: GridColumnGroup`, async () => {
      render(
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
      render(
        <Grid<Item> items={items}>
          <GridColumnGroup header={<i>Group Header</i>} footer={<i>Group Footer</i>}>
            <GridColumn<Item> path="name" header={<b>Name</b>} footer={<b>Name Footer</b>} />
          </GridColumnGroup>
        </Grid>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-column');

      expect(columns).to.have.length(1);
      expect(cells).to.have.length(6);

      const [groupHeaderCell, nameHeaderCell, nameFooterCell, groupFooterCell] = cells;

      expect(groupHeaderCell).to.have.text('Group Header');
      expect(nameHeaderCell).to.have.text('Name');
      expect(nameFooterCell).to.have.text('Name Footer');
      expect(groupFooterCell).to.have.text('Group Footer');
    });
  });

  describe('GridFilterColumn', () => {
    it('should render correctly', async () => {
      render(
        <Grid<Item> items={items}>
          <GridFilterColumn<Item> footerRenderer={DefaultFooterRenderer}>{DefaultBodyRenderer}</GridFilterColumn>
        </Grid>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-filter-column');
      expect(columns).to.have.length(1);
      expect(cells).to.have.length(3);

      const [footerCell, bodyCell1, bodyCell2] = cells;

      expect(footerCell).to.have.text('Name Footer');
      expect(bodyCell1).to.have.text('John');
      expect(bodyCell2).to.have.text('Ringo');
    });

    it('should support setting footer component', async () => {
      render(
        <Grid<Item> items={items}>
          <GridFilterColumn<Item> path="name" footer={<i>Name Footer</i>} />
        </Grid>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-filter-column');
      expect(columns).to.have.length(1);
      expect(cells).to.have.length(4);

      const footerCell = cells[1];

      expect(footerCell).to.have.text('Name Footer');
    });
  });

  describe('GridSelectionColumn', () => {
    it('should render correctly', async () => {
      render(
        <Grid<Item> items={items}>
          <GridSelectionColumn<Item> headerRenderer={DefaultHeaderRenderer} footerRenderer={DefaultFooterRenderer}>
            {DefaultBodyRenderer}
          </GridSelectionColumn>
        </Grid>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-selection-column');
      expect(columns).to.have.length(1);
      expect(cells).to.have.length(4);

      const [headerCell, footerCell, bodyCell1, bodyCell2] = cells;

      expect(headerCell).to.have.text('Name');
      expect(footerCell).to.have.text('Name Footer');
      expect(bodyCell1).to.have.text('John');
      expect(bodyCell2).to.have.text('Ringo');
    });

    it('should support setting footer component', async () => {
      render(
        <Grid<Item> items={items}>
          <GridSelectionColumn footer={<i>Footer</i>}>{DefaultBodyRenderer}</GridSelectionColumn>
        </Grid>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-selection-column');
      expect(columns).to.have.length(1);
      expect(cells).to.have.length(3);

      const footerCell = cells[0];

      expect(footerCell).to.have.text('Footer');
    });
  });

  describe('GridSortColumn', () => {
    it('should render correctly', async () => {
      render(
        <Grid<Item> items={items}>
          <GridSortColumn<Item> footerRenderer={DefaultFooterRenderer}>{DefaultBodyRenderer}</GridSortColumn>
        </Grid>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-sort-column');
      expect(columns).to.have.length(1);
      expect(cells).to.have.length(3);

      const [footerCell, bodyCell1, bodyCell2] = cells;

      expect(footerCell).to.have.text('Name Footer');
      expect(bodyCell1).to.have.text('John');
      expect(bodyCell2).to.have.text('Ringo');
    });

    it('should support setting footer component', async () => {
      render(
        <Grid<Item> items={items}>
          <GridSortColumn<Item> path="name" footer={<i>Name Footer</i>}></GridSortColumn>
        </Grid>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-sort-column');
      expect(columns).to.have.length(1);
      expect(cells).to.have.length(4);

      const footerCell = cells[1];

      expect(footerCell).to.have.text('Name Footer');
    });
  });

  describe('GridProEditColumn', () => {
    it('should render correctly', async () => {
      render(
        <Grid<Item> items={items}>
          <GridProEditColumn<Item> headerRenderer={DefaultHeaderRenderer} footerRenderer={DefaultFooterRenderer}>
            {DefaultBodyRenderer}
          </GridProEditColumn>
        </Grid>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-pro-edit-column');
      expect(columns).to.have.length(1);
      expect(cells).to.have.length(4);

      const [headerCell, footerCell, bodyCell1, bodyCell2] = cells;

      expect(headerCell).to.have.text('Name');
      expect(footerCell).to.have.text('Name Footer');
      expect(bodyCell1).to.have.text('John');
      expect(bodyCell2).to.have.text('Ringo');
    });

    it('should support setting header and footer components', async () => {
      render(
        <Grid<Item> items={items}>
          <GridProEditColumn<Item> path="name" header={<b>Name</b>} footer={<b>Name Footer</b>} />
        </Grid>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-pro-edit-column');
      expect(columns).to.have.length(1);
      expect(cells).to.have.length(4);

      const [headerCell, footerCell] = cells;

      expect(headerCell).to.have.text('Name');
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
      render(
        <Grid<TreeItem> dataProvider={dataProvider}>
          <GridTreeColumn path="name" headerRenderer={DefaultHeaderRenderer} footerRenderer={DefaultFooterRenderer} />
          <GridColumn path="name"></GridColumn>
        </Grid>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-tree-column');
      expect(columns).to.have.length(1);
      expect(cells).to.have.length(7);

      const [treeHeaderCell, nameHeaderCell, treeFooterCell] = cells;

      expect(treeHeaderCell).to.have.text('Name');
      expect(nameHeaderCell).to.have.text('Name');
      expect(treeFooterCell).to.have.text('Name Footer');
    });

    it('should support setting header and footer components', async () => {
      render(
        <Grid<TreeItem> dataProvider={dataProvider}>
          <GridTreeColumn path="name" header={<b>Name</b>} footer={<b>Name Footer</b>} />
          <GridColumn path="name"></GridColumn>
        </Grid>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-tree-column');
      expect(columns).to.have.length(1);
      expect(cells).to.have.length(7);

      const [treeHeaderCell, nameHeaderCell, treeFooterCell] = cells;

      expect(treeHeaderCell).to.have.text('Name');
      expect(nameHeaderCell).to.have.text('Name');
      expect(treeFooterCell).to.have.text('Name Footer');
    });
  });
});
