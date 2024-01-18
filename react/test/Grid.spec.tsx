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
import { GridPro } from '../src/GridPro.js';
import { useEffect, useState } from 'react';
import sinon from 'sinon';

useChaiPlugin(chaiDom);

async function until<T = boolean>(predicate: () => T) {
  while (!predicate()) {
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

  function isGridCellContentNodeRendered(node: Node) {
    return (
      node instanceof Text &&
      node.parentNode instanceof HTMLElement &&
      node.parentNode.localName === 'vaadin-grid-cell-content'
    );
  }

  async function getGridMeaningfulParts(columnElementName: string) {
    const grid = document.querySelector('vaadin-grid, vaadin-grid-pro')!;
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
        render(<GridWithAutoWidthColumns></GridWithAutoWidthColumns>);

        const grid = await findByQuerySelector('vaadin-grid');
        const columns = Array.from(grid.children).filter((c): c is GridColumnElement => c.localName.includes('column'));
        expect(columns.length).to.be.above(0);

        for (const column of columns) {
          await until(() => parseFloat(String(column.width)) > 300);
        }

        error.restore();
        expect(error.called).to.be.false;
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
        <GridPro<Item> items={items}>
          <GridProEditColumn<Item> headerRenderer={DefaultHeaderRenderer} footerRenderer={DefaultFooterRenderer}>
            {DefaultBodyRenderer}
          </GridProEditColumn>
        </GridPro>,
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
        <GridPro<Item> items={items}>
          <GridProEditColumn<Item> path="name" header={<b>Name</b>} footer={<b>Name Footer</b>} />
        </GridPro>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-pro-edit-column');
      expect(columns).to.have.length(1);
      expect(cells).to.have.length(4);

      const [headerCell, footerCell] = cells;

      expect(headerCell).to.have.text('Name');
      expect(footerCell).to.have.text('Name Footer');
    });

    describe('custom renderers', () => {
      type GridProItem = { name: string };

      let items: GridProItem[];

      function doubleClick(element: Element) {
        element.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      }

      function focusOut(element: Element) {
        element.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
      }

      beforeEach(() => {
        items = Array.from(new Array(1)).map((_, i) => ({ name: `name-${i}` }));
      });

      it('should render a custom editor', async () => {
        render(
          <GridPro<GridProItem> items={items}>
            <GridProEditColumn<Item>
              path="name"
              renderer={({ item }) => <span className="content">{item.name}</span>}
              editModeRenderer={() => <input className="editor" />}
            />
          </GridPro>,
        );
        // Get the cell content
        const cellContent = await until(() => document.querySelector('.content'));
        expect(cellContent.isConnected).to.be.true;

        // Double-click the cell content to enter edit mode
        doubleClick(cellContent);

        // Get the cell editor
        const cellEditor = await until(() => document.querySelector('.editor'));
        expect(cellEditor).to.exist;
        expect(cellContent.isConnected).to.be.false;
      });

      it('should support using column child as the renderer function', async () => {
        render(
          <GridPro<GridProItem> items={items}>
            <GridProEditColumn<Item> path="name" editModeRenderer={() => <input className="editor" />}>
              {({ item }) => <span className="content">{item.name}</span>}
            </GridProEditColumn>
          </GridPro>,
        );
        // Get the cell content
        const cellContent = await until(() => document.querySelector('.content'));
        expect(cellContent.isConnected).to.be.true;

        // Double-click the cell content to enter edit mode
        doubleClick(cellContent);

        // Get the cell editor
        const cellEditor = await until(() => document.querySelector('.editor'));
        expect(cellEditor).to.exist;
        expect(cellContent.isConnected).to.be.false;
      });

      it('should have updated content', async () => {
        render(
          <GridPro<GridProItem> items={items}>
            <GridProEditColumn<Item>
              path="name"
              renderer={({ item }) => <span className="content">{item.name}</span>}
              editModeRenderer={() => <input className="editor" />}
            />
          </GridPro>,
        );
        // Get the cell content
        let cellContent = await until(() => document.querySelector('.content'));
        doubleClick(cellContent);
        const cellEditor = await until(() => document.querySelector<HTMLInputElement>('.editor'));
        // Set a new value
        cellEditor.value = 'foo';
        // Exit edit mode
        focusOut(cellEditor);
        // Wait for the editor to close
        await until(() => !document.querySelector('.editor'));
        // Expect the cell content to be connected and have the new value
        cellContent = await until(() => document.querySelector('.content'));
        expect(cellContent).to.have.text('foo');
      });

      it('should update the content without a custom editor', async () => {
        render(
          <GridPro<GridProItem> items={items}>
            <GridProEditColumn<Item>
              path="name"
              renderer={({ item }) => <span className="content">{item.name}</span>}
            />
          </GridPro>,
        );

        let cellContent = await until(() => document.querySelector('.content'));
        doubleClick(cellContent);

        const cellEditor = await until(() =>
          document.querySelector<HTMLInputElement>('vaadin-grid-pro-edit-text-field'),
        );
        cellEditor.value = 'foo';
        focusOut(cellEditor);

        await until(() => !document.querySelector('input'));
        cellContent = await until(() => document.querySelector('.content'));

        expect(cellContent).to.have.text('foo');
      });

      it('should update the content without a custom renderer', async () => {
        render(
          <GridPro<GridProItem> items={items}>
            <GridProEditColumn<Item> path="name" editModeRenderer={() => <input className="editor" />} />
          </GridPro>,
        );

        let cellContent = await until(() =>
          Array.from(document.querySelectorAll('vaadin-grid-cell-content')).find((c) => c.textContent === 'name-0'),
        );
        doubleClick(cellContent!);

        const cellEditor = await until(() => document.querySelector<HTMLInputElement>('.editor'));
        cellEditor.value = 'foo';
        focusOut(cellEditor);

        await until(() => !document.querySelector('.editor'));
        await until(() =>
          Array.from(document.querySelectorAll('vaadin-grid-cell-content')).find((c) => c.textContent === 'foo'),
        );
      });

      it('should update the content dynamically', async () => {
        function DynamicTemplatesGridPro() {
          const [showMessage, setShowMessage] = useState(false);

          return (
            <GridPro<GridProItem> items={items}>
              <GridProEditColumn<Item>
                path="name"
                renderer={({ item }) => (
                  <button onClick={() => setShowMessage(true)}>{showMessage ? 'Clicked' : item.name}</button>
                )}
              />
            </GridPro>
          );
        }

        render(<DynamicTemplatesGridPro />);
        const warn = sinon.stub(console, 'error');

        // Click the button
        let button = await until(() => document.querySelector('button'));
        expect(button).to.have.text('name-0');
        const cellContent = button.parentElement!;
        button.click();

        // Expect the updated button to say "Clicked"
        await until(() => Array.from(document.querySelectorAll('button')).find((c) => c.textContent === 'Clicked'));
        expect(cellContent).to.have.text('Clicked');

        // Expect no warnings to have been logged
        expect(warn.called).to.be.false;
        warn.restore();

        // Visit edit mode
        doubleClick(cellContent);
        focusOut(document.querySelector('vaadin-grid-pro-edit-text-field')!);

        // Expect the button to still say "Clicked"
        button = await until(() => document.querySelector('button'));
        expect(button).to.have.text('Clicked');
      });
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
