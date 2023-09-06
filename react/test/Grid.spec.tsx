import { expect, use as useChaiPlugin } from '@esm-bundle/chai';
import chaiDom from 'chai-dom';
import { cleanup, render } from '@testing-library/react/pure.js';
import { Grid } from '../src/Grid.js';
import { GridColumn } from '../src/GridColumn.js';
import { GridFilterColumn } from '../src/GridFilterColumn.js';
import { GridProEditColumn } from '../src/GridProEditColumn.js';
import { GridSelectionColumn } from '../src/GridSelectionColumn.js';
import { GridSortColumn } from '../src/GridSortColumn.js';
import type { GridBodyReactRendererProps } from '../src/renderers/grid.js';
import catchRender from './utils/catchRender.js';
import { GridColumnGroup } from '../src/GridColumnGroup.js';

useChaiPlugin(chaiDom);

describe('Grid', () => {
  type Item = Readonly<{ name: string; surname: string; role: string }>;

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
      expect(columns).to.have.length(1);
      expect(cells).to.have.length(3);

      const [footerCell, bodyCell1, bodyCell2] = cells;

      expect(footerCell).to.have.text('Name Footer');
      expect(bodyCell1).to.have.text('John');
      expect(bodyCell2).to.have.text('Ringo');
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
  });
});
