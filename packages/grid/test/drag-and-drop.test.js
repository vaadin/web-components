import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { aTimeout, fixtureSync, listenOnce, nextFrame, nextResize } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './grid-test-styles.js';
import '../src/vaadin-grid.js';
import { flushGrid, getBodyCellContent, getFirstCell, getRowBodyCells, getRows } from './helpers.js';

describe('drag and drop', () => {
  let grid, dragData;

  const getTestItems = () => [
    { first: 'foo', last: 'bar' },
    { first: 'baz', last: 'qux' },
  ];

  const getDraggable = (grid, rowIndex = 0) => {
    const row = Array.from(grid.$.items.children).find((row) => row.index === rowIndex);
    const cellContent = row.querySelector('slot').assignedNodes()[0];
    return [row, cellContent].find((node) => node.getAttribute('draggable') === 'true');
  };

  const fireDragStart = (draggable = getDraggable(grid)) => {
    const event = new Event('dragstart', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    event.dataTransfer = {
      setDragImage: sinon.spy(),
      setData: (type, data) => {
        dragData[type] = data;
      },
    };
    const draggableRect = draggable.getBoundingClientRect();
    event.clientX = draggableRect.left + draggableRect.width / 2;
    event.clientY = draggableRect.top + draggableRect.height / 2;
    draggable.dispatchEvent(event);
    return event;
  };

  const fireDragEnd = (draggable = getDraggable(grid)) => {
    const event = new Event('dragend', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    draggable.dispatchEvent(event);
    return event;
  };

  const fireDragLeave = (draggable = getDraggable(grid)) => {
    const event = new Event('dragleave', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    draggable.dispatchEvent(event);
  };

  const fireDragEnter = (draggable = getDraggable(grid)) => {
    const event = new Event('dragenter', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    draggable.dispatchEvent(event);
    return event;
  };

  const fireDrop = (draggable = getDraggable(grid)) => {
    const event = new Event('drop', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    event.dataTransfer = {
      getData: (type) => dragData[type],
      types: Object.keys(dragData),
    };
    draggable.dispatchEvent(event);
    return event;
  };

  const fireDragOver = (row, location) => {
    const event = new Event('dragover', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    event.dataTransfer = { dropEffect: 'move' };
    if (row) {
      const rect = row.getBoundingClientRect();
      if (location === 'on-top') {
        event.clientY = rect.top + rect.height / 2;
      } else if (location === 'above') {
        event.clientY = rect.top;
      } else if (location === 'below') {
        event.clientY = rect.bottom;
      } else if (location === 'under') {
        event.clientY = rect.bottom + rect.height / 2;
      }
      row.dispatchEvent(event);
    } else {
      const draggable = getDraggable(grid);
      draggable.dispatchEvent(event);
    }
    return event;
  };

  const isDropAllowed = (e) => {
    return e.dataTransfer.dropEffect !== 'none' && e.defaultPrevented;
  };

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid hidden>
        <vaadin-grid-column path="first" header="First name"></vaadin-grid-column>
        <vaadin-grid-column path="last" header="Last name"></vaadin-grid-column>
      </vaadin-grid>
    `);
    await nextResize(grid);
    grid.hidden = false;
    await nextResize(grid);
    await aTimeout(1);

    dragData = {};
    grid.items = getTestItems();
    flushGrid(grid);
    if (grid._safari) {
      await aTimeout();
    }
  });

  it('should not be draggable by default', () => {
    expect(getDraggable(grid)).not.to.be.ok;
  });

  describe('draggable', () => {
    beforeEach(() => {
      grid.rowsDraggable = true;
      flushGrid(grid);
    });

    it('should be draggable', () => {
      expect(getDraggable(grid)).to.be.ok;
    });

    it('should not be draggable', () => {
      grid.rowsDraggable = false;
      expect(getDraggable(grid)).not.to.be.ok;
    });

    describe('dragstart', () => {
      let dragStartSpy;
      let dropSpy;

      beforeEach(() => {
        dragStartSpy = sinon.spy();
        dropSpy = sinon.spy();
        grid.addEventListener('grid-dragstart', dragStartSpy);
        grid.addEventListener('grid-drop', dropSpy);
        grid.rowsDraggable = true;
        grid.dropMode = 'on-top';
      });

      it('should stop the native event', () => {
        const spy = sinon.spy();
        listenOnce(grid, 'dragstart', spy);
        fireDragStart();
        expect(spy.called).to.be.false;
      });

      it('should not stop the native event', () => {
        const spy = sinon.spy();
        listenOnce(grid, 'dragstart', spy);
        fireDragStart(getFirstCell(grid));
        expect(spy.called).to.be.true;
      });

      it('should not stop the native event when not draggable', () => {
        const spy = sinon.spy();
        listenOnce(grid, 'dragstart', spy);
        grid.rowsDraggable = false;
        const event = new Event('dragstart', {
          bubbles: true,
          cancelable: true,
          composed: true,
        });
        getBodyCellContent(grid, 0, 0).dispatchEvent(event);
        expect(spy.called).to.be.true;
      });

      it('should only use visible items for the row count state attribute', async () => {
        grid.style.height = '80px';
        flushGrid(grid);
        grid.selectedItems = grid.items;

        await aTimeout(0);
        flushGrid(grid);
        fireDragStart();
        const row = getRows(grid.$.items)[0];
        expect(row.getAttribute('dragstart')).to.equal('');
      });

      it('should add dragging state attribute', () => {
        fireDragStart();
        expect(grid.hasAttribute('dragging-rows')).to.be.true;
      });

      it('should add dragged row count state attribute for drag image', async () => {
        grid.selectedItems = grid.items;
        fireDragStart();
        const row = getRows(grid.$.items)[0];
        expect(row.getAttribute('dragstart')).to.equal('2');
        await nextFrame();
        expect(row.hasAttribute('dragstart')).to.be.false;
      });

      it('should add position properties to grid', () => {
        grid.selectedItems = grid.items;
        fireDragStart();
        expect(grid.style.getPropertyValue('--_grid-drag-start-x')).to.be.ok;
        expect(grid.style.getPropertyValue('--_grid-drag-start-y')).to.be.ok;
      });

      it('should override row count state attribute', () => {
        grid.style.height = '80px';
        listenOnce(grid, 'grid-dragstart', (e) => {
          e.detail.setDraggedItemsCount(2);
        });
        grid.selectedItems = grid.items;
        fireDragStart();
        const row = getRows(grid.$.items)[0];
        expect(row.getAttribute('dragstart')).to.equal('2');
      });

      it('should not add count to dragstart attribute on single row drag', () => {
        fireDragStart();
        const row = getRows(grid.$.items)[0];
        expect(row.getAttribute('dragstart')).to.equal('');
      });

      it('should add dragstart to row part attribute', async () => {
        fireDragStart();
        const row = getRows(grid.$.items)[0];
        expect(row.getAttribute('part')).to.contain('dragstart-row');
        await nextFrame();
        expect(row.getAttribute('part')).to.not.contain('dragstart-row');
      });

      it('should add dragstart to cells part attribute', async () => {
        fireDragStart();
        const row = getRows(grid.$.items)[0];
        const cells = getRowBodyCells(row);
        cells.forEach((cell) => {
          expect(cell.getAttribute('part')).to.contain('dragstart-row-cell');
        });
        await nextFrame();
        cells.forEach((cell) => {
          expect(cell.getAttribute('part')).to.not.contain('dragstart-row-cell');
        });
      });

      it('should add drag-source- part to all dragged rows', async () => {
        grid.selectItem(grid.items[0]);
        grid.selectItem(grid.items[1]);
        fireDragStart();
        await nextFrame();
        for (const row of getRows(grid.$.items)) {
          for (const cell of getRowBodyCells(row)) {
            expect(cell.getAttribute('part')).to.contain('drag-source-row-cell');
          }
        }
      });

      it('should add drag-source- part to dragged rows', async () => {
        fireDragStart();
        await nextFrame();
        for (const cell of getRowBodyCells(getRows(grid.$.items)[0])) {
          expect(cell.getAttribute('part')).to.contain('drag-source-row-cell');
        }
      });

      it('should remove drag-source- part from dragged rows', async () => {
        fireDragStart();
        await nextFrame();

        fireDragEnd();
        await nextFrame();
        for (const cell of getRowBodyCells(getRows(grid.$.items)[0])) {
          expect(cell.getAttribute('part')).to.not.contain('drag-source-row-cell');
        }
      });

      // The test only concerns Safari
      const isSafari = /^((?!chrome|android).)*safari/iu.test(navigator.userAgent);
      (isSafari ? it : it.skip)('should use top on Safari for drag image', async () => {
        const row = getRows(grid.$.items)[0];
        const originalTransform = row.style.transform;
        fireDragStart();

        expect(row.style.top).to.be.ok;
        expect(row.style.transform).to.equal('none');
        await nextFrame();

        expect(row.style.top).not.to.be.ok;
        expect(row.style.transform).to.equal(originalTransform);
      });

      it('should dispatch a grid specific event', () => {
        fireDragStart();
        expect(dragStartSpy.calledOnce).to.be.true;
      });

      it('should have the original event', () => {
        const originalEvent = fireDragStart();
        const event = dragStartSpy.getCall(0).args[0];
        expect(event.originalEvent).to.equal(originalEvent);
      });

      it('should reference the dragged item', () => {
        fireDragStart();
        const event = dragStartSpy.getCall(0).args[0];
        expect(event.detail.draggedItems).to.eql([grid.items[0]]);
      });

      it('should reference the dragged item only', () => {
        grid.selectItem(grid.items[1]);
        fireDragStart();
        const event = dragStartSpy.getCall(0).args[0];
        expect(event.detail.draggedItems).to.eql([grid.items[0]]);
      });

      it('should reference all the selected items', () => {
        grid.selectedItems = grid.items;
        fireDragStart();
        const event = dragStartSpy.getCall(0).args[0];
        expect(event.detail.draggedItems).to.eql(grid.items);
      });

      it('should only include visible rows in the event items', async () => {
        grid.style.height = '80px';
        grid.selectedItems = grid.items;

        await aTimeout(0);
        flushGrid(grid);
        fireDragStart();
        const event = dragStartSpy.getCall(0).args[0];
        expect(event.detail.draggedItems).to.eql([grid.items[0]]);
      });

      it('should auto generate data transfer text data', () => {
        grid.selectedItems = grid.items;
        fireDragStart();
        fireDrop();
        const event = dropSpy.getCall(0).args[0];
        const textData = event.detail.dragData.find((d) => d.type === 'text').data;
        expect(textData).to.eql('foo\tbar\nbaz\tqux');
      });

      it('should only use visible rows for the transfer data', async () => {
        grid.style.height = '80px';
        grid.selectedItems = grid.items;

        await aTimeout(0);
        flushGrid(grid);
        fireDragStart();
        fireDrop();
        const event = dropSpy.getCall(0).args[0];
        const textData = event.detail.dragData.find((d) => d.type === 'text').data;
        expect(textData).to.eql('foo\tbar');
      });

      it('should auto generate data transfer text data in order', () => {
        grid.selectedItems = grid.items;
        const columns = grid.querySelectorAll('vaadin-grid-column');
        grid._swapColumnOrders(columns[0], columns[1]);
        fireDragStart();
        fireDrop();
        const event = dropSpy.getCall(0).args[0];
        const textData = event.detail.dragData.find((d) => d.type === 'text').data;
        expect(textData).to.eql('bar\tfoo\nqux\tbaz');
        grid._swapColumnOrders(columns[0], columns[1]);
      });

      it('should generate custom data transfer text data', () => {
        grid.selectedItems = grid.items;
        listenOnce(grid, 'grid-dragstart', (e) => {
          e.detail.setDragData('text/plain', e.detail.draggedItems.map((item) => item.last).join(','));
        });
        fireDragStart();
        fireDrop();
        const event = dropSpy.getCall(0).args[0];
        const dragData = event.detail.dragData.find((d) => d.type === 'text/plain');
        expect(dragData.data).to.eql('bar,qux');
        expect(dragData.type).to.eql('text/plain');
      });

      it('should generate drag image with offset', () => {
        const event = fireDragStart();
        expect(event.dataTransfer.setDragImage.getCall(0).args.length).to.equal(3);
      });
    });

    describe('dragend', () => {
      let dragEndSpy;

      beforeEach(() => {
        dragEndSpy = sinon.spy();
        listenOnce(grid, 'grid-dragend', dragEndSpy);
        grid.selectedItems = grid.items;
        fireDragStart();
      });

      it('should stop the native event', () => {
        const spy = sinon.spy();
        listenOnce(grid, 'dragend', spy);
        fireDragEnd();
        expect(spy.called).to.be.false;
      });

      it('should not stop the native event on grid itself', () => {
        fireDragEnd();

        const spy = sinon.spy();
        listenOnce(grid, 'dragend', spy);
        fireDragEnd(grid);
        expect(spy.called).to.be.true;
      });

      it('should remove dragging state attribute', () => {
        fireDragEnd();
        expect(grid.hasAttribute('dragging-rows')).to.be.false;
      });

      it('should dispatch a grid specific event', () => {
        fireDragEnd();
        expect(dragEndSpy.calledOnce).to.be.true;
      });

      it('should have the original event', () => {
        const originalEvent = fireDragEnd();
        const event = dragEndSpy.getCall(0).args[0];
        expect(event.originalEvent).to.equal(originalEvent);
      });
    });

    describe('dragover', () => {
      it('should not stop the native event', () => {
        const spy = sinon.spy();
        listenOnce(grid, 'dragover', spy);
        fireDragOver();
        expect(spy.called).to.be.true;
      });

      it('should stop the native event', () => {
        grid.dropMode = 'between';

        const spy = sinon.spy();
        listenOnce(grid, 'dragover', spy);
        fireDragOver();
        expect(spy.called).to.be.false;
      });

      it('should not cancel the native event', () => {
        const e = fireDragOver();
        expect(e.defaultPrevented).to.be.false;
      });

      it('should cancel the native event', () => {
        grid.dropMode = 'between';

        const e = fireDragOver();
        expect(e.defaultPrevented).to.be.true;
      });

      it('should indicate drop over an empty grid', () => {
        grid.dropMode = 'between';
        grid.items = [];
        fireDragOver();
        expect(grid.hasAttribute('dragover')).to.be.true;
      });

      it('should indicate drop below the last row when dragging over body', () => {
        grid.dropMode = 'between';
        const row = grid.$.items.children[1];
        fireDragOver(grid.$.items);
        expect(row.getAttribute('dragover')).to.equal('below');
      });

      it('should not indicate drop when dragging over body on on-top mode', () => {
        grid.dropMode = 'on-top';
        const row = grid.$.items.children[1];
        const e = fireDragOver(grid.$.items);
        expect(grid.hasAttribute('dragover')).to.be.false;
        expect(row.hasAttribute('dragover')).to.be.false;
        expect(e.defaultPrevented).to.be.false;
      });

      it('should not allow drop over header when there are items', () => {
        grid.dropMode = 'between';
        const row = grid.$.items.children[1];
        const e = fireDragOver(grid.$.header.children[0]);
        expect(grid.hasAttribute('dragover')).to.be.false;
        expect(row.hasAttribute('dragover')).to.be.false;
        expect(isDropAllowed(e)).to.be.false;
      });

      it('should allow drop over header when there are no items', () => {
        grid.dropMode = 'between';
        grid.items = [];
        const e = fireDragOver(grid.$.header.children[0]);
        expect(grid.hasAttribute('dragover')).to.be.true;
        expect(isDropAllowed(e)).to.be.true;
      });

      it('should set dragover attribute to grid on on-grid dropmode', () => {
        grid.dropMode = 'on-grid';
        fireDragOver();
        expect(grid.hasAttribute('dragover')).to.be.true;
      });

      it('should not set dragover attribute to the grid', () => {
        grid.dropMode = 'on-top';
        const row = grid.$.items.children[0];
        fireDragOver(row, 'above');
        expect(grid.hasAttribute('dragover')).to.be.false;
      });

      it('should set dragover=on-top attribute to the row', () => {
        grid.dropMode = 'on-top';
        const row = grid.$.items.children[0];
        fireDragOver(row, 'above');
        expect(row.getAttribute('dragover')).to.equal('on-top');
      });

      it('should add dragover-on-top to row part attribute', () => {
        grid.dropMode = 'on-top';
        const row = grid.$.items.children[0];
        fireDragOver(row, 'above');
        expect(row.getAttribute('part')).to.contain('dragover-on-top-row');
      });

      it('should add dragover-on-top to cells part attribute', () => {
        grid.dropMode = 'on-top';
        const row = grid.$.items.children[0];
        fireDragOver(row, 'above');
        const cells = getRowBodyCells(row);
        cells.forEach((cell) => {
          expect(cell.getAttribute('part')).to.contain('dragover-on-top-row-cell');
        });
      });

      it('should set dragover=on-top attribute to the row 2', () => {
        grid.dropMode = 'on-top-or-between';
        const row = grid.$.items.children[0];
        fireDragOver(row, 'on-top');
        expect(row.getAttribute('dragover')).to.equal('on-top');
      });

      it('should set dragover=above attribute to the row', () => {
        grid.dropMode = 'between';
        const row = grid.$.items.children[0];
        fireDragOver(row, 'above');
        expect(row.getAttribute('dragover')).to.equal('above');
      });

      it('should add dragover-above to row part attribute', () => {
        grid.dropMode = 'between';
        const row = grid.$.items.children[0];
        fireDragOver(row, 'above');
        expect(row.getAttribute('part')).to.contain('dragover-above-row');
      });

      it('should add dragover-above to cells part attribute', () => {
        grid.dropMode = 'between';
        const row = grid.$.items.children[0];
        fireDragOver(row, 'above');
        const cells = getRowBodyCells(row);
        cells.forEach((cell) => {
          expect(cell.getAttribute('part')).to.contain('dragover-above-row-cell');
        });
      });

      it('should set dragover=below attribute to the row', () => {
        grid.dropMode = 'between';
        const row = grid.$.items.children[0];
        fireDragOver(row, 'below');
        expect(row.getAttribute('dragover')).to.equal('below');
      });

      it('should add dragover-below to row part attribute', () => {
        grid.dropMode = 'between';
        const row = grid.$.items.children[0];
        fireDragOver(row, 'below');
        expect(row.getAttribute('part')).to.contain('dragover-below-row');
      });

      it('should add dragover-below to cells part attribute', () => {
        grid.dropMode = 'between';
        const row = grid.$.items.children[0];
        fireDragOver(row, 'below');
        const cells = getRowBodyCells(row);
        cells.forEach((cell) => {
          expect(cell.getAttribute('part')).to.contain('dragover-below-row-cell');
        });
      });

      it('should set dragover=above attribute to the row 2', () => {
        grid.dropMode = 'on-top-or-between';
        const row = grid.$.items.children[0];
        fireDragOver(row, 'above');
        expect(row.getAttribute('dragover')).to.equal('above');
      });

      it('should set dragover=below attribute to the row 2', () => {
        grid.dropMode = 'on-top-or-between';
        const row = grid.$.items.children[0];
        fireDragOver(row, 'below');
        expect(row.getAttribute('dragover')).to.equal('below');
      });

      it('should set dragover=below attribute to the last row', () => {
        grid.dropMode = 'on-top-or-between';
        const row = grid.$.items.children[1];
        fireDragOver(row, 'under');
        expect(row.getAttribute('dragover')).to.equal('below');
      });

      it('should clear previous dragover row part attribute on dragover change', () => {
        grid.dropMode = 'between';
        const row = grid.$.items.children[0];
        fireDragOver(row, 'above');
        fireDragOver(row, 'below');
        expect(row.getAttribute('part')).to.not.contain('dragover-above-row');
        expect(row.getAttribute('part')).to.contain('dragover-below-row');
      });

      it('should clear previous dragover cells part attribute on dragover change', () => {
        grid.dropMode = 'between';
        const row = grid.$.items.children[0];
        fireDragOver(row, 'above');
        fireDragOver(row, 'below');
        const cells = getRowBodyCells(row);
        cells.forEach((cell) => {
          expect(cell.getAttribute('part')).to.not.contain('dragover-above-row-cell');
          expect(cell.getAttribute('part')).to.contain('dragover-below-row-cell');
        });
      });

      describe('header and footer input', () => {
        beforeEach(() => {
          const inputRenderer = (root) => {
            if (root.firstChild) {
              return;
            }
            const input = document.createElement('input');
            root.appendChild(input);
          };
          const column = grid.querySelector('vaadin-grid-column');
          column.headerRenderer = inputRenderer;
          column.footerRenderer = inputRenderer;
          flushGrid(grid);
        });

        const isDropAllowedOnInput = (e) => e.dataTransfer.dropEffect !== 'none';

        it('should not allow drop over header input on grid with drop mode', () => {
          grid.dropMode = 'between';
          fireDragStart();
          const e = fireDragOver(grid.$.header.children[0]);
          expect(isDropAllowedOnInput(e)).to.be.false;
        });

        it('should not allow drop over header input on grid without drop mode', () => {
          grid.dropMode = null;
          fireDragStart();
          const e = fireDragOver(grid.$.header.children[0]);
          expect(isDropAllowedOnInput(e)).to.be.false;
        });

        it('should not allow drop over footer input on grid with drop mode', () => {
          grid.dropMode = 'between';
          fireDragStart();
          const e = fireDragOver(grid.$.footer.children[0]);
          expect(isDropAllowedOnInput(e)).to.be.false;
        });

        it('should not allow drop over footer input on grid without drop mode', () => {
          grid.dropMode = null;
          fireDragStart();
          const e = fireDragOver(grid.$.footer.children[0]);
          expect(isDropAllowedOnInput(e)).to.be.false;
        });
      });
    });

    describe('dragleave', () => {
      it('should stop the native event', () => {
        grid.dropMode = 'on-grid';
        const spy = sinon.spy();
        listenOnce(grid, 'dragleave', spy);
        fireDragLeave();
        expect(spy.called).to.be.false;
      });

      it('should not stop the native event if grid has no drop mode', () => {
        const spy = sinon.spy();
        listenOnce(grid, 'dragleave', spy);
        fireDragLeave();
        expect(spy.called).to.be.true;
      });

      it('should clear the grid dragover attribute', () => {
        grid.dropMode = 'on-grid';
        fireDragOver();
        expect(grid.hasAttribute('dragover')).to.be.true;
        fireDragLeave();
        expect(grid.hasAttribute('dragover')).to.be.false;
      });

      it('should clear the row dragover attribute', () => {
        grid.dropMode = 'on-top';
        fireDragOver();
        const row = grid.$.items.children[0];
        expect(row.hasAttribute('dragover')).to.be.true;
        fireDragLeave();
        expect(row.hasAttribute('dragover')).to.be.false;
      });

      it('should clear the row dragover parts', () => {
        grid.dropMode = 'on-top';
        fireDragOver();
        const row = grid.$.items.children[0];
        expect(row.getAttribute('part')).to.contain('dragover-');
        fireDragLeave();
        expect(row.getAttribute('part')).to.not.contain('dragover-');
      });

      it('should clear the cells dragover parts', () => {
        grid.dropMode = 'on-top';
        fireDragOver();
        const row = grid.$.items.children[0];
        const cells = getRowBodyCells(row);
        cells.forEach((cell) => {
          expect(cell.getAttribute('part')).to.contain('dragover-');
        });
        fireDragLeave();
        cells.forEach((cell) => {
          expect(cell.getAttribute('part')).to.not.contain('dragover-');
        });
      });
    });

    describe('dragenter', () => {
      // The dragenter event needs to be cancelled to enable the mobile polyfill
      it('should stop and cancel the native event', () => {
        grid.dropMode = 'between';
        const spy = sinon.spy();
        listenOnce(grid, 'dragenter', spy);
        const event = fireDragEnter();
        expect(spy.called).to.be.false;
        expect(event.defaultPrevented).to.be.true;
      });

      it('should not stop and cancel the native event', () => {
        const spy = sinon.spy();
        listenOnce(grid, 'dragenter', spy);
        const event = fireDragEnter();
        expect(spy.called).to.be.true;
        expect(event.defaultPrevented).to.be.false;
      });
    });

    describe('drop', () => {
      let dropSpy;

      beforeEach(() => {
        grid.dropMode = 'on-top';
        dropSpy = sinon.spy();
        listenOnce(grid, 'grid-drop', dropSpy);
      });

      it('should stop the native event', () => {
        const spy = sinon.spy();
        listenOnce(grid, 'drop', spy);
        fireDrop();
        expect(spy.called).to.be.false;
      });

      it('should cancel the native event', () => {
        const event = fireDrop();
        expect(event.defaultPrevented).to.be.true;
      });

      it('should clear the grid drag styles', () => {
        grid.dropMode = 'on-grid';
        fireDragOver();
        expect(grid.hasAttribute('dragover')).to.be.true;
        fireDrop();
        expect(grid.hasAttribute('dragover')).to.be.false;
      });

      it('should clear the row drag styles', () => {
        grid.dropMode = 'on-top';
        fireDragOver();
        const row = grid.$.items.children[0];
        expect(row.hasAttribute('dragover')).to.be.true;
        fireDrop();
        expect(row.hasAttribute('dragover')).to.be.false;
      });

      it('should clear the row dragover parts', () => {
        grid.dropMode = 'on-top';
        fireDragOver();
        const row = grid.$.items.children[0];
        expect(row.getAttribute('part')).to.contain('dragover-');
        fireDrop();
        expect(row.getAttribute('part')).to.not.contain('dragover-');
      });

      it('should clear the cells dragover parts', () => {
        grid.dropMode = 'on-top';
        fireDragOver();
        const row = grid.$.items.children[0];
        const cells = getRowBodyCells(row);
        cells.forEach((cell) => {
          expect(cell.getAttribute('part')).to.contain('dragover-');
        });
        fireDrop();
        cells.forEach((cell) => {
          expect(cell.getAttribute('part')).to.not.contain('dragover-');
        });
      });

      it('should dispatch a grid specific event', () => {
        fireDrop();
        expect(dropSpy.calledOnce).to.be.true;
      });

      it('should bubble and be cancelable', () => {
        fireDrop();
        const event = dropSpy.getCall(0).args[0];
        expect(event.bubbles).to.be.true;
        expect(event.cancelable).to.be.true;
      });

      it('should reference the drop target item', () => {
        grid.dropMode = 'on-top';
        fireDragOver();
        fireDrop();
        const event = dropSpy.getCall(0).args[0];
        expect(event.detail.dropTargetItem).to.eql(grid.items[0]);
      });

      it('should have the drop location', () => {
        grid.dropMode = 'between';
        const row = grid.$.items.children[0];
        fireDragOver(row, 'above');
        fireDrop();
        const event = dropSpy.getCall(0).args[0];
        expect(event.detail.dropLocation).to.eql('above');
      });

      it('should have the payload data', () => {
        grid.rowsDraggable = true;
        grid.dropMode = 'on-top';
        fireDragStart();
        fireDragOver();
        fireDrop();
        const event = dropSpy.getCall(0).args[0];
        expect(event.detail.dragData).to.eql([{ type: 'text', data: 'foo\tbar' }]);
      });

      it('should have the original event', () => {
        const originalEvent = fireDrop();
        const event = dropSpy.getCall(0).args[0];
        expect(event.originalEvent).to.equal(originalEvent);
      });
    });
  });

  describe('filtering row drag', () => {
    beforeEach(() => {
      grid.dragFilter = ({ item }) => item.first !== 'foo';
      grid.rowsDraggable = true;
    });

    it('should not disable row drag', () => {
      expect(getDraggable(grid, 1)).to.be.ok;
      expect(grid.$.items.children[1].hasAttribute('drag-disabled')).to.be.false;
    });

    it('should disable row drag', () => {
      expect(getDraggable(grid, 0)).not.to.be.ok;
      expect(grid.$.items.children[0].hasAttribute('drag-disabled')).to.be.true;
    });

    it('should re-run the row drag filter', () => {
      grid.items[1].first = 'foo';
      grid.filterDragAndDrop();
      expect(getDraggable(grid, 1)).not.to.be.ok;
    });

    it('should re-enable row drag', () => {
      grid.dragFilter = ({ item }) => item.first === 'foo';
      expect(getDraggable(grid, 0)).to.be.ok;
    });

    it('should re-enable row drag 2', () => {
      grid.dragFilter = undefined;
      expect(getDraggable(grid, 0)).to.be.ok;
    });

    it('should exclude non-draggable items from dragged items', () => {
      grid.dragFilter = ({ item }) => item.first === 'foo';
      grid.selectedItems = grid.items;
      const dragStartSpy = sinon.spy();
      listenOnce(grid, 'grid-dragstart', dragStartSpy);
      fireDragStart();
      const event = dragStartSpy.getCall(0).args[0];
      expect(event.detail.draggedItems).to.eql([grid.items[0]]);
    });

    it('should exclude non-draggable items from dragged row count', () => {
      grid.dragFilter = ({ item }) => item.first === 'foo';
      grid.selectedItems = grid.items;
      fireDragStart();
      const row = getRows(grid.$.items)[0];
      expect(row.getAttribute('dragstart')).to.equal('');
    });

    describe('filtering row drag - lazy loading', () => {
      let finishLoadingItems;

      beforeEach(() => {
        grid.dataProvider = (_params, callback) => {
          finishLoadingItems = (items) => callback(items || getTestItems());
        };
      });

      it('should disable row drag while loading items', () => {
        expect(getDraggable(grid, 1)).not.to.be.ok;
        expect(grid.$.items.children[1].hasAttribute('drag-disabled')).to.be.true;
      });

      it('should add drag-disabled to row part attribute', () => {
        expect(grid.$.items.children[1].getAttribute('part')).to.contain('drag-disabled-row');
      });

      it('should add drag-disabled to cells part attribute', () => {
        const cells = getRowBodyCells(grid.$.items.children[1]);
        cells.forEach((cell) => {
          expect(cell.getAttribute('part')).to.contain('drag-disabled-row-cell');
        });
      });

      it('should enable row drag once loading has finished', () => {
        finishLoadingItems();
        expect(getDraggable(grid, 1)).to.be.ok;
        expect(grid.$.items.children[1].hasAttribute('drag-disabled')).to.be.false;
      });

      it('should not run drag filter while loading items', () => {
        grid.dragFilter = sinon.spy();
        expect(grid.dragFilter.called).to.be.false;
      });

      it('should disable row drag for rows without an item', () => {
        finishLoadingItems([getTestItems()[0], undefined]);
        expect(getDraggable(grid, 1)).not.to.be.ok;
        expect(grid.$.items.children[1].hasAttribute('drag-disabled')).to.be.true;
      });

      it('should enable row drag once items are available', () => {
        finishLoadingItems([getTestItems()[0], undefined]);
        // Manually trigger a content update to re-request the first page.
        grid.requestContentUpdate();
        finishLoadingItems();
        expect(getDraggable(grid, 1)).to.be.ok;
        expect(grid.$.items.children[1].hasAttribute('drag-disabled')).to.be.false;
      });
    });
  });

  describe('filtering row drop', () => {
    beforeEach(() => {
      grid.dropFilter = ({ item }) => item.first !== 'foo';
      grid.dropMode = 'on-top';
    });

    it('should not disable drop on row', () => {
      const row = grid.$.items.children[1];
      fireDragOver(row, 'above');
      expect(row.hasAttribute('dragover')).to.be.true;
      expect(row.hasAttribute('drop-disabled')).to.be.false;
    });

    it('should disable drop on row', () => {
      const row = grid.$.items.children[0];
      fireDragOver(row, 'above');
      expect(row.hasAttribute('dragover')).to.be.false;
      expect(row.hasAttribute('drop-disabled')).to.be.true;
    });

    it('should add drop-disabled to row part attribute', () => {
      const row = grid.$.items.children[0];
      fireDragOver(row, 'above');
      expect(row.getAttribute('part')).to.contain('drop-disabled-row');
    });

    it('should add drop-disabled to cells part attribute', () => {
      const row = grid.$.items.children[0];
      fireDragOver(row, 'above');
      const cells = getRowBodyCells(row);
      cells.forEach((cell) => {
        expect(cell.getAttribute('part')).to.contain('drop-disabled-row-cell');
      });
    });

    it('should re-enable drop on row', () => {
      grid.dropFilter = ({ item }) => item.first === 'foo';
      const row = grid.$.items.children[0];
      fireDragOver(row, 'above');
      expect(row.hasAttribute('dragover')).to.be.true;
      expect(row.hasAttribute('drop-disabled')).to.be.false;
    });

    it('should re-enable drop on row 2', () => {
      grid.dropFilter = undefined;
      const row = grid.$.items.children[0];
      fireDragOver(row, 'above');
      expect(row.hasAttribute('dragover')).to.be.true;
      expect(row.hasAttribute('drop-disabled')).to.be.false;
    });

    it('should emit a grid-drop event for non drop disabled row', () => {
      const spy = sinon.spy();
      listenOnce(grid, 'grid-drop', spy);
      fireDrop(grid.$.items.children[1]);
      expect(spy.called).to.be.true;
    });

    it('should cancel dragover on a row with drop enabled', () => {
      const row = grid.$.items.children[1];
      const e = fireDragOver(row, 'above');
      expect(e.defaultPrevented).to.be.true;
    });

    it('should not cancel dragover on a row with drop disabled', () => {
      const row = grid.$.items.children[0];
      const e = fireDragOver(row, 'above');
      expect(e.defaultPrevented).to.be.false;
    });

    describe('filtering row drop - lazy loading', () => {
      let finishLoadingItems;

      beforeEach(() => {
        grid.dataProvider = (_params, callback) => {
          finishLoadingItems = (items) => callback(items || getTestItems());
        };
      });

      it('should disable drop on row while loading items', () => {
        const row = grid.$.items.children[1];
        fireDragOver(row, 'above');
        expect(row.hasAttribute('dragover')).to.be.false;
        expect(row.hasAttribute('drop-disabled')).to.be.true;
      });

      it('should enable drop on row once loading has finished', () => {
        finishLoadingItems();
        const row = grid.$.items.children[1];
        fireDragOver(row, 'above');
        expect(row.hasAttribute('dragover')).to.be.true;
        expect(row.hasAttribute('drop-disabled')).to.be.false;
      });

      it('should not run drop filter while loading items', () => {
        grid.dropFilter = sinon.spy();
        expect(grid.dropFilter.called).to.be.false;
      });

      it('should disable drop on row for rows without an item', () => {
        finishLoadingItems([getTestItems()[0], undefined]);
        const row = grid.$.items.children[1];
        fireDragOver(row, 'above');
        expect(row.hasAttribute('dragover')).to.be.false;
        expect(row.hasAttribute('drop-disabled')).to.be.true;
      });

      it('should enable drop on row once items are available', () => {
        finishLoadingItems([getTestItems()[0], undefined]);
        // Manually trigger a content update to re-request the first page.
        grid.requestContentUpdate();
        finishLoadingItems();
        const row = grid.$.items.children[1];
        fireDragOver(row, 'above');
        expect(row.hasAttribute('dragover')).to.be.true;
        expect(row.hasAttribute('drop-disabled')).to.be.false;
      });
    });
  });

  describe('auto scroll', () => {
    beforeEach(async () => {
      grid.dropMode = 'between';
      grid.items = new Array(100).fill().map((_, idx) => ({ value: idx }));

      grid.$.table.scrollTop = 0;
      flushGrid(grid);
      await nextFrame();
      await aTimeout(0);
    });

    it('should auto scroll down', () => {
      const scrollTop = grid.$.table.scrollTop;
      fireDragOver(grid.__getViewportRows().pop(), 'above');
      expect(grid.$.table.scrollTop).to.be.within(scrollTop + 20, scrollTop + 100);
    });

    it('should auto scroll down fast', () => {
      const scrollTop = grid.$.table.scrollTop;
      fireDragOver(grid.__getViewportRows().pop(), 'below');
      expect(grid.$.table.scrollTop).to.be.within(scrollTop + 100, scrollTop + 200);
    });

    it('should auto scroll up', () => {
      grid.scrollToIndex(50);
      const scrollTop = grid.$.table.scrollTop;
      fireDragOver(grid.__getViewportRows()[0], 'below');
      expect(grid.$.table.scrollTop).to.be.within(scrollTop - 100, scrollTop - 20);
    });

    it('should auto scroll up fast', () => {
      grid.scrollToIndex(50);
      const scrollTop = grid.$.table.scrollTop;
      fireDragOver(grid.__getViewportRows()[0], 'above');
      expect(grid.$.table.scrollTop).to.be.within(scrollTop - 200, scrollTop - 100);
    });

    it('should add/remove drag-source- part when scrolling', () => {
      grid.rowsDraggable = true;
      grid.selectItem(grid.items[0]);
      fireDragStart();

      // Scroll down so that the drag source cell leaves the viewport
      grid.scrollToIndex(50);
      // Expect no cells with drag-source-row-cell part in the DOM
      expect(grid.$.items.querySelector('tr:not([hidden]) [part~="drag-source-row-cell"]')).to.be.null;

      grid.scrollToIndex(0);
      expect(getFirstCell(grid).getAttribute('part')).to.contain('drag-source-row-cell');
    });
  });

  describe('draggable grid', () => {
    let container;

    beforeEach(async () => {
      container = fixtureSync(`
        <div style="width: 400px; height: 400px;">
          <vaadin-grid draggable="true" style="width: 300px; height: 300px;">
            <vaadin-grid-column path="value"></vaadin-grid-column>
          </vaadin-grid>
        </div>
      `);
      grid = container.querySelector('vaadin-grid');
      document.body.appendChild(container);
      flushGrid(grid);
      await nextFrame();
    });

    async function setGridItems(count) {
      grid.items = Array.from({ length: count }, (_, i) => ({ value: `Item ${i + 1}` }));
      await nextFrame();
    }

    async function dragElement(element) {
      await resetMouse();
      await sendMouseToElement({ type: 'move', element });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [100, 100] });
      await sendMouse({ type: 'up' });
    }

    async function assertDragSucceeds(draggedElement) {
      await dragElement(draggedElement);
      await nextFrame();
      expect(grid.$.scroller.style.display).to.equal('');
    }

    ['5000', '50000'].forEach((count) => {
      it(`should not crash when dragging a grid with ${count} items`, async () => {
        await setGridItems(count);
        await assertDragSucceeds(grid);
      });

      it(`should not crash when dragging a container that has a grid with ${count} items`, async () => {
        grid.removeAttribute('draggable');
        container.setAttribute('draggable', true);
        await setGridItems(count);
        await assertDragSucceeds(container);
      });
    });
  });
});
