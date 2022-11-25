import { expect } from '@esm-bundle/chai';
import { render } from '@testing-library/react';
import filterEmptyItems from '../scripts/utils/filterEmptyItems.js';
import { Grid } from '../src/Grid.js';
import { GridColumn } from '../src/GridColumn.js';
import { GridFilterColumn } from '../src/GridFilterColumn.js';
import { GridProEditColumn } from '../src/GridProEditColumn.js';
import { GridSelectionColumn } from '../src/GridSelectionColumn.js';
import { GridSortColumn } from '../src/GridSortColumn.js';
import type { GridBodyReactRendererProps } from '../src/renderers/grid.js';
import catchRender from './utils/catchRender.js';

describe('Grid', () => {
  type Item = Readonly<{ name: string; surname: string; role: string }>;

  const items = [
    { name: 'John', surname: 'Lennon', role: 'singer' },
    { name: 'Ringo', surname: 'Starr', role: 'drums' },
  ];

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
    expect(grid).not.to.be.undefined;

    await catchRender(grid, isGridCellContentNodeRendered);

    const columns = document.querySelectorAll(columnElementName);

    // Filter cells that don't have any textContent. Grid creates empty cells for some calculations,
    // but we don't need them.
    const cells = filterEmptyItems(
      Array.from(grid!.querySelectorAll('vaadin-grid-cell-content'), ({ textContent }) => textContent),
    );

    return [columns, cells] as const;
  }

  describe('GridColumn', () => {
    it('should render correctly', async () => {
      render(
        <Grid<Item> items={items}>
          <GridColumn<Item> headerRenderer={DefaultHeaderRenderer} footerRenderer={DefaultFooterRenderer}>
            {DefaultBodyRenderer}
          </GridColumn>
          <GridColumn<Item> headerRenderer={() => <>Surname</>} footerRenderer={() => <>Surname Footer</>}>
            {({ item }) => <>{item.surname}</>}
          </GridColumn>
          <GridColumn<Item> headerRenderer={() => <>Role</>} footerRenderer={() => <>Role Footer</>}>
            {({ item }) => <>{item.role}</>}
          </GridColumn>
        </Grid>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-column');

      expect(columns.length).to.equal(3);
      expect(cells.length).to.equal(12);

      const [nameHeaderCellContent, surnameHeaderCellContent, roleHeaderCellContent] = cells.slice(0, 3);
      const [nameFooterCellContent, surnameFooterCellContent, roleFooterCellContent] = cells.slice(3, 6);
      const [nameBodyCellContent1, surnameBodyCellContent1, roleBodyCellContent1] = cells.slice(6, 9);
      const [nameBodyCellContent2, surnameBodyCellContent2, roleBodyCellContent2] = cells.slice(9, 12);

      expect(nameHeaderCellContent).to.equal('Name');
      expect(surnameHeaderCellContent).to.equal('Surname');
      expect(roleHeaderCellContent).to.equal('Role');

      expect(nameFooterCellContent).to.equal('Name Footer');
      expect(surnameFooterCellContent).to.equal('Surname Footer');
      expect(roleFooterCellContent).to.equal('Role Footer');

      expect(nameBodyCellContent1).to.equal('John');
      expect(surnameBodyCellContent1).to.equal('Lennon');
      expect(roleBodyCellContent1).to.equal('singer');

      expect(nameBodyCellContent2).to.equal('Ringo');
      expect(surnameBodyCellContent2).to.equal('Starr');
      expect(roleBodyCellContent2).to.equal('drums');
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
      expect(columns.length).to.equal(1);
      expect(cells.length).to.equal(3);

      const [footerCellContent, bodyCellContent1, bodyCellContent2] = cells;

      expect(footerCellContent).to.equal('Name Footer');
      expect(bodyCellContent1).to.equal('John');
      expect(bodyCellContent2).to.equal('Ringo');
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
      expect(columns.length).to.equal(1);
      expect(cells.length).to.equal(4);

      const [headerCellContent, footerCellContent, bodyCellContent1, bodyCellContent2] = cells;

      expect(headerCellContent).to.equal('Name');
      expect(footerCellContent).to.equal('Name Footer');
      expect(bodyCellContent1).to.equal('John');
      expect(bodyCellContent2).to.equal('Ringo');
    });
  });

  describe('GridSortColumn', () => {
    it('should render correctly', async () => {
      render(
        <Grid<Item> items={items}>
          <GridSortColumn<Item> headerRenderer={DefaultHeaderRenderer} footerRenderer={DefaultFooterRenderer}>
            {DefaultBodyRenderer}
          </GridSortColumn>
        </Grid>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-sort-column');
      expect(columns.length).to.equal(1);
      expect(cells.length).to.equal(3);

      const [footerCellContent, bodyCellContent1, bodyCellContent2] = cells;

      expect(footerCellContent).to.equal('Name Footer');
      expect(bodyCellContent1).to.equal('John');
      expect(bodyCellContent2).to.equal('Ringo');
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
      expect(columns.length).to.equal(1);
      expect(cells.length).to.equal(4);

      const [headerCellContent, footerCellContent, bodyCellContent1, bodyCellContent2] = cells;

      expect(headerCellContent).to.equal('Name');
      expect(footerCellContent).to.equal('Name Footer');
      expect(bodyCellContent1).to.equal('John');
      expect(bodyCellContent2).to.equal('Ringo');
    });
  });
});
