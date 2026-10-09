import sinon from 'sinon';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { nextRender } from '../../../react/test/utils/nextRender.js';
import { until } from '../../../react/test/utils/until.js';
import type { GridBodyReactRendererProps } from '../../react-components/src/renderers/grid.js';
import { GridPro } from '../src/GridPro.js';
import { GridProEditColumn } from '../src/GridProEditColumn.js';

describe('GridPro', () => {
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

  describe('GridProEditColumn', () => {
    it('should render correctly', async () => {
      await render(
        <GridPro<Item> items={items}>
          <GridProEditColumn<Item> headerRenderer={DefaultHeaderRenderer} footerRenderer={DefaultFooterRenderer}>
            {DefaultBodyRenderer}
          </GridProEditColumn>
        </GridPro>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-pro-edit-column', {
        expectedColumnCount: 1,
        expectedCellCount: 4,
      });

      const [headerCell, footerCell, bodyCell1, bodyCell2] = cells;

      expect(headerCell).to.have.text('Name');
      expect(footerCell).to.have.text('Name Footer');
      expect(bodyCell1).to.have.text('John');
      expect(bodyCell2).to.have.text('Ringo');
    });

    it('should support setting header and footer components', async () => {
      await render(
        <GridPro<Item> items={items}>
          <GridProEditColumn<Item> path="name" header={<b>Name</b>} footer={<b>Name Footer</b>} />
        </GridPro>,
      );

      const [columns, cells] = await getGridMeaningfulParts('vaadin-grid-pro-edit-column', {
        expectedColumnCount: 1,
        expectedCellCount: 4,
      });

      const [headerCell, footerCell] = cells;

      expect(headerCell).to.have.text('Name');
      expect(footerCell).to.have.text('Name Footer');
    });

    describe('default renderers', () => {
      type GridProItem = { name: string };

      let items: GridProItem[];

      function doubleClick(element: Element) {
        element.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      }

      beforeEach(async () => {
        items = [{ name: 'name-0' }];
      });

      it('should toggle edit mode on double click', async () => {
        await render(
          <GridPro<GridProItem> items={items}>
            <GridProEditColumn<Item> path="name" />
          </GridPro>,
        );

        const cellContent = await until(() =>
          Array.from(document.querySelectorAll('vaadin-grid-cell-content')).find(
            (cellContent) => cellContent.textContent === 'name-0',
          ),
        );

        for (let i = 0; i < 2; i++) {
          expect(cellContent.textContent?.trim()).to.equal('name-0');
          doubleClick(cellContent);

          const cellEditor = await until(() =>
            cellContent.querySelector<HTMLInputElement>('vaadin-grid-pro-edit-text-field'),
          );
          await nextRender();
          expect(cellContent.textContent?.trim()).to.be.empty;
          cellEditor.blur();

          await until(() => !cellContent.contains(cellEditor));
        }
      });

      it('should update the content', async () => {
        await render(
          <GridPro<GridProItem> items={items}>
            <GridProEditColumn<Item> path="name" />
          </GridPro>,
        );

        // Get the cell content
        const cellContent = await until(() =>
          Array.from(document.querySelectorAll('vaadin-grid-cell-content')).find(
            (cellContent) => cellContent.textContent === 'name-0',
          ),
        );
        doubleClick(cellContent);
        const cellEditor = await until(() =>
          cellContent.querySelector<HTMLInputElement>('vaadin-grid-pro-edit-text-field'),
        );
        await nextRender();
        // Set a new value
        cellEditor.value = 'foo';
        // Exit edit mode
        cellEditor.blur();
        // Wait for the editor to close
        await until(() => !cellContent.contains(cellEditor));
        // Expect the cell content to be connected and have the new value
        await until(() => cellContent.textContent === 'foo');
      });
    });

    describe('custom renderers', () => {
      type GridProItem = { name: string };

      let items: GridProItem[];

      function doubleClick(element: Element) {
        element.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      }

      function focusOut(element: HTMLElement) {
        element.blur();
      }

      beforeEach(async () => {
        items = Array.from(new Array(1)).map((_, i) => ({ name: `name-${i}` }));
      });

      it('should render a custom editor', async () => {
        await render(
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
        await render(
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

      it('should toggle edit mode on double click', async () => {
        await render(
          <GridPro<GridProItem> items={items}>
            <GridProEditColumn<Item> path="name" editModeRenderer={() => <input className="editor" />}>
              {({ item }) => <span className="content">{item.name}</span>}
            </GridProEditColumn>
          </GridPro>,
        );

        const cellContent = await until(() =>
          Array.from(document.querySelectorAll('vaadin-grid-cell-content')).find((cellContent) =>
            cellContent.querySelector('.content'),
          ),
        );

        for (let i = 0; i < 2; i++) {
          expect(cellContent.textContent?.trim()).to.equal('name-0');
          doubleClick(cellContent);

          const cellEditor = await until(() => cellContent.querySelector<HTMLInputElement>('.editor'));
          expect(cellContent.textContent?.trim()).to.be.empty;
          cellEditor.blur();

          await until(() => !cellContent.contains(cellEditor));
        }
      });

      it('should have updated content', async () => {
        await render(
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

      it('should toggle edit mode on double click without a custom editor', async () => {
        await render(
          <GridPro<GridProItem> items={items}>
            <GridProEditColumn<Item>
              path="name"
              renderer={({ item }) => <span className="content">{item.name}</span>}
            />
          </GridPro>,
        );

        const cellContent = await until(() =>
          Array.from(document.querySelectorAll('vaadin-grid-cell-content')).find((cellContent) =>
            cellContent.querySelector('.content'),
          ),
        );

        for (let i = 0; i < 2; i++) {
          expect(cellContent.textContent?.trim()).to.equal('name-0');
          doubleClick(cellContent);

          const cellEditor = await until(() =>
            cellContent.querySelector<HTMLInputElement>('vaadin-grid-pro-edit-text-field'),
          );
          await nextRender();
          expect(cellContent.textContent?.trim()).to.be.empty;
          cellEditor.blur();

          await until(() => !cellContent.contains(cellEditor));
        }
      });

      it('should update the content without a custom editor', async () => {
        await render(
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
        await nextRender();
        cellEditor.value = 'foo';
        focusOut(cellEditor);

        await until(() => !document.querySelector('input'));
        cellContent = await until(() => document.querySelector('.content'));

        expect(cellContent).to.have.text('foo');
      });

      it('should toggle edit mode on double click without a custom renderer', async () => {
        await render(
          <GridPro<GridProItem> items={items}>
            <GridProEditColumn<Item> path="name" editModeRenderer={() => <input className="editor" />} />
          </GridPro>,
        );

        const cellContent = await until(() =>
          Array.from(document.querySelectorAll('vaadin-grid-cell-content')).find(
            (cellContent) => cellContent.textContent === 'name-0',
          ),
        );

        for (let i = 0; i < 2; i++) {
          expect(cellContent.textContent?.trim()).to.equal('name-0');
          doubleClick(cellContent);

          const cellEditor = await until(() => cellContent.querySelector<HTMLInputElement>('.editor'));
          expect(cellContent.textContent?.trim()).to.equal('');
          cellEditor.blur();

          await until(() => !cellContent.contains(cellEditor));
        }
      });

      it('should update the content without a custom renderer', async () => {
        await render(
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

        await render(<DynamicTemplatesGridPro />);
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
        await nextRender();
        focusOut(document.querySelector('vaadin-grid-pro-edit-text-field')!);

        // Expect the button to still say "Clicked"
        button = await until(() => document.querySelector('button'));
        expect(button).to.have.text('Clicked');
      });
    });
  });
});
