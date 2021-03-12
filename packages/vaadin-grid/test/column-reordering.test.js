import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { aTimeout, fixtureSync, nextFrame } from '@open-wc/testing-helpers';
import { flush } from '@polymer/polymer/lib/utils/flush.js';
import {
  dragAndDropOver,
  dragOver,
  dragStart,
  flushGrid,
  getContainerCell,
  getRows,
  getRowCells,
  infiniteDataProvider,
  makeSoloTouchEvent
} from './helpers.js';
import '../vaadin-grid.js';
import '../vaadin-grid-column-group.js';

function getVisualCellContent(section, row, col) {
  let cell = Array.from(section.querySelectorAll('[part~="cell"]:not([part~="details-cell"])')).pop();
  if (section.id === 'footer') {
    cell = section.querySelector('[part~="cell"]');
  }
  const sectionRect = section.getBoundingClientRect();
  const sectionBorder = parseInt(section.style.borderTopWidth || 0);
  const cellWidth = cell.offsetWidth;
  const cellHeight = cell.offsetHeight;
  const x = sectionRect.left + col * cellWidth + cellWidth / 2;
  const y = sectionRect.top + sectionBorder + row * cellHeight + cellHeight / 2;
  const grid = section.parentNode.parentNode.parentNode.host;
  return grid._cellFromPoint(x, y)._content;
}

function getVisualHeaderCellContent(grid, row, col) {
  return getVisualCellContent(grid.$.header, row, col);
}

function getVisualColumnCellContents(grid, col) {
  const headerContent = getVisualCellContent(grid.$.header, getRows(grid.$.header).length - 1, col);
  const footerContent = getVisualCellContent(grid.$.footer, 0, col);
  const bodyContent = Array.from(grid.$.items.children).map((row, rowIndex) =>
    getVisualCellContent(grid.$.items, rowIndex, col)
  );
  return bodyContent.concat(headerContent).concat(footerContent);
}

function expectVisualOrder(grid, order) {
  order.forEach((order, index) => {
    getVisualColumnCellContents(grid, index).forEach((content) => expect(parseInt(content.innerText)).to.equal(order));
  });
}

function getCellByCellContent(cellContent) {
  return cellContent.assignedSlot.parentNode;
}

describe('reordering simple grid', () => {
  let grid, headerContent;

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 400px; height: 200px;" size="1" column-reordering-allowed>
        ${[1, 2, 3, 4].map((col) => {
          return `
            <vaadin-grid-column resizable index="${col}">
              <template class="header"><span hidden>0</span><span>${col}</span></template>
              <template>${col}</template>
              <template class="footer">${col}</template>
            </vaadin-grid-column>
          `;
        })}
        <template class="row-details">
          foo
        </template>
      </vaadin-grid>
    `);
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
    await aTimeout(0);
    const colCount = getRowCells(getRows(grid.$.header)[0]).length;
    headerContent = [];
    for (let i = 0; i < colCount; i++) {
      headerContent.push(getVisualHeaderCellContent(grid, 0, i));
    }
    flushGrid(grid);
  });

  it('should have initial visual order', () => {
    expectVisualOrder(grid, [1, 2, 3, 4]);
  });

  it('should indicate dragged cells', () => {
    dragStart(headerContent[0]);
    const cell = getCellByCellContent(headerContent[0]);
    expect(cell.getAttribute('reorder-status')).to.equal('dragging');
  });

  it('should clear reorder status on dragend', () => {
    dragAndDropOver(headerContent[0], headerContent[1]);
    const cell = getCellByCellContent(headerContent[0]);
    expect(cell.getAttribute('reorder-status')).to.equal('');
    expect(grid.hasAttribute('reordering')).to.be.false;
  });

  it('should prevent text selection while reordering', () => {
    dragStart(headerContent[0]);
    const style = window.getComputedStyle(grid);
    const userSelect = style['user-select'] || style['-moz-user-select'] || style['-webkit-user-select'];
    expect(userSelect).to.equal('none');
  });

  it('should have a reorder ghost', () => {
    dragStart(headerContent[0]);
    expect(grid._reorderGhost.style.visibility).to.equal('visible');
  });

  it('should have header cell content', () => {
    dragStart(headerContent[0]);
    const ghost = grid._reorderGhost;
    expect(ghost.innerHTML).to.equal('1');
  });

  it('should not be accessible', () => {
    dragStart(headerContent[0]);

    const ghost = grid._reorderGhost;
    expect(window.getComputedStyle(ghost).pointerEvents).to.equal('none');
  });

  it('should position ghost', () => {
    const cellRect = getCellByCellContent(headerContent[1]).getBoundingClientRect();

    const ghost = grid._reorderGhost;
    dragOver(headerContent[0], headerContent[1]);

    const ghostRect = ghost.getBoundingClientRect();
    expect(ghostRect.left).to.be.closeTo(cellRect.left, 1);
    expect(ghostRect.top).to.be.closeTo(cellRect.top, 1);
  });

  it('should have the ghost visible again', () => {
    dragAndDropOver(headerContent[0], headerContent[1]);
    dragStart(headerContent[0]);
    flush();
    expect(grid._reorderGhost.style.visibility).to.equal('visible');
  });

  it('should prevent contextmenu while reordering', () => {
    dragStart(headerContent[0]);
    const e = new CustomEvent('contextmenu', { cancelable: true, bubbles: true });
    headerContent[0].dispatchEvent(e);
    expect(e.defaultPrevented).to.be.true;
  });

  it('should prevent activating column resize while reordering', () => {
    const resize = getCellByCellContent(headerContent[0]).querySelector('[part~="resize-handle"]');
    dragOver(headerContent[0], resize);
    expect(window.getComputedStyle(resize).pointerEvents).to.equal('none');
  });

  it('should cancel touchmove', () => {
    dragStart(headerContent[0]);
    const e = makeSoloTouchEvent('touchmove', { x: 0, y: 0 }, headerContent[0]);
    expect(e.defaultPrevented).to.be.true;
  });

  it('should not cancel touchmove', () => {
    const e = makeSoloTouchEvent('touchmove', { x: 0, y: 0 }, headerContent[0]);
    expect(e.defaultPrevented).to.be.false;
  });

  it('should not cancel touchmove on resizer', () => {
    const e = makeSoloTouchEvent(
      'touchmove',
      { x: 0, y: 0 },
      getCellByCellContent(headerContent[0]).querySelector('[part~="resize-handle"]')
    );
    expect(e.defaultPrevented).to.be.false;
  });

  describe('touch gesture delay', () => {
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should start reordering after 300ms after touchstart', () => {
      const rect = headerContent[0].getBoundingClientRect();
      makeSoloTouchEvent('touchstart', { x: rect.left, y: rect.top }, headerContent[0]);
      clock.tick(500);
      expect(grid.hasAttribute('reordering')).to.be.true;
    });

    it('should not start reordering after 300ms after touchend', () => {
      const rect = headerContent[0].getBoundingClientRect();
      makeSoloTouchEvent('touchstart', { x: rect.left, y: rect.top }, headerContent[0]);
      makeSoloTouchEvent('touchend', { x: 0, y: 0 }, headerContent[0]);
      clock.tick(500);
      expect(grid.hasAttribute('reordering')).to.be.false;
    });
  });

  it('should not start reordering on resize handle move', () => {
    const handle = getCellByCellContent(headerContent[0]).querySelector('[part~="resize-handle"]');
    dragStart(handle);
    expect(grid.hasAttribute('reordering')).to.be.false;
  });

  it('should not start reordering on grid with no reorder allowed', () => {
    grid.columnReorderingAllowed = false;
    dragStart(headerContent[0]);
    expect(grid.hasAttribute('reordering')).to.be.false;
  });

  describe('basic reordering', () => {
    it('should reorder the columns', () => {
      dragAndDropOver(headerContent[0], headerContent[1]);
      expectVisualOrder(grid, [2, 1]);
    });

    it('should allow dropping over body cell of another column', () => {
      dragAndDropOver(headerContent[0], getVisualCellContent(grid.$.items, 0, 1));
      expectVisualOrder(grid, [2, 1]);
    });

    it('should reorder the columns while dragging', () => {
      dragOver(headerContent[0], headerContent[1]);
      expectVisualOrder(grid, [2, 1]);
    });

    it('should reorder multiple columns while dragging', () => {
      dragOver(headerContent[0], headerContent[1]);
      dragOver(headerContent[0], headerContent[3]);
      flushGrid(grid);
      expectVisualOrder(grid, [2, 4, 3, 1]);
    });

    it('should update first-column attribute', () => {
      let cell = getCellByCellContent(headerContent[0]);
      expect(cell.hasAttribute('first-column')).to.be.true;
      cell = getContainerCell(grid.$.items, 0, 0);
      expect(cell.hasAttribute('first-column')).to.be.true;
    });

    it('should update first-column attribute', () => {
      dragOver(headerContent[2], headerContent[0]);
      const cell = getCellByCellContent(headerContent[2]);
      expect(cell.hasAttribute('first-column')).to.be.true;
    });

    it('should update first-column attribute (details open)', () => {
      grid.openItemDetails(getRows(grid.$.items)[0].item);
      dragOver(headerContent[2], headerContent[0]);
      const cell = getCellByCellContent(headerContent[2]);
      expect(cell.hasAttribute('first-column')).to.be.true;
    });

    it('should update last-column attribute', () => {
      let cell = getCellByCellContent(headerContent[3]);
      expect(cell.hasAttribute('last-column')).to.be.true;
      cell = getContainerCell(grid.$.items, 0, 3);
      expect(cell.hasAttribute('last-column')).to.be.true;
    });

    it('should update last-column attribute', () => {
      dragOver(headerContent[2], headerContent[3]);
      const cell = getCellByCellContent(headerContent[2]);
      expect(cell.hasAttribute('last-column')).to.be.true;
    });

    it('should update last-column attribute (details open)', () => {
      grid.openItemDetails(getRows(grid.$.items)[0].item);
      dragOver(headerContent[2], headerContent[3]);
      const cell = getCellByCellContent(headerContent[2]);
      expect(cell.hasAttribute('last-column')).to.be.true;
    });

    it('should set order to new column', async () => {
      dragAndDropOver(headerContent[0], headerContent[1]);
      const col = document.createElement('vaadin-grid-column');
      col.innerHTML = '<template>[[index]]</template>';
      grid.appendChild(col);
      await nextFrame();
      expect(col._order).to.equal(50000000);
    });

    it('should not toggle last-column for cells on existing rows', () => {
      const attributeSpy = sinon.spy(grid, '_toggleAttribute');
      grid.size++;
      flushGrid(grid);

      const calls = attributeSpy.getCalls().filter((f) => f.args[0] === 'last-column');
      const columnCount = grid.querySelectorAll('vaadin-grid-column').length;
      expect(calls.length).to.equal(columnCount);
    });

    it('should fire `column-reorder` event with columns', () => {
      const spy = sinon.spy();
      grid.addEventListener('column-reorder', spy);
      dragAndDropOver(headerContent[0], headerContent[1]);
      expect(spy.calledOnce).to.be.true;
      const e = spy.firstCall.args[0];
      expect(e.detail.columns.map((column) => column.getAttribute('index'))).to.eql(['2', '1', '3', '4']);
    });
  });

  describe('frozen columns', () => {
    beforeEach(() => {
      const columns = grid.querySelectorAll('vaadin-grid-column');
      columns[0].frozen = true;
      columns[1].frozen = true;
    });

    it('should allow reordering frozen columns', () => {
      dragAndDropOver(headerContent[0], headerContent[1]);
      expectVisualOrder(grid, [2, 1]);
    });

    it('should not allow reordering frozen and non-frozen columns', () => {
      dragAndDropOver(headerContent[1], headerContent[2]);
      expectVisualOrder(grid, [1, 2, 3, 4]);
    });

    it('should not allow reordering non-frozen and frozen columns', () => {
      dragAndDropOver(headerContent[3], headerContent[0]);
      expectVisualOrder(grid, [1, 2, 3, 4]);
    });

    it('should update last-frozen while dragging', () => {
      const cell = getCellByCellContent(headerContent[0]);
      expect(cell.hasAttribute('last-frozen')).to.be.false;
      dragOver(headerContent[0], headerContent[1]);
      expect(cell.hasAttribute('last-frozen')).to.be.true;
    });

    it('should not start reordering on frozen column resize handle move', () => {
      const handle = getCellByCellContent(headerContent[0]).querySelector('[part~="resize-handle"]');
      const cell = getCellByCellContent(headerContent[1]);
      dragOver(handle, cell);
      expect(grid.hasAttribute('reordering')).to.be.false;
    });
  });
});

describe('reordering grid with columns groups', () => {
  let grid;

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 400px; height: 200px;" size="1" column-reordering-allowed>
        ${[1, 2].map((colgroup) => {
          return `
            <vaadin-grid-column-group>
              <template class="header">${colgroup}</template>
              <template class="footer">${colgroup}</template>
              ${[1, 2].map((col) => {
                return `
                  <vaadin-grid-column>
                    <template class="header">${colgroup}${col}</template>
                    <template>${colgroup}${col}</template>
                    <template class="footer">${colgroup}${col}</template>
                  </vaadin-grid-column>
                `;
              })}
            </vaadin-grid-column-group>
          `;
        })}
      </vaadin-grid>
    `);
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
    await nextFrame();
    await aTimeout(0);
  });

  it('should have initial visual order', () => {
    expectVisualOrder(grid, [11, 12, 21, 22]);
  });

  it('should reorder the sub-columns', () => {
    dragAndDropOver(getVisualHeaderCellContent(grid, 1, 0), getVisualHeaderCellContent(grid, 1, 1));
    expectVisualOrder(grid, [12, 11]);
  });

  it('should not allow dragging columns between groups', () => {
    dragAndDropOver(getVisualHeaderCellContent(grid, 1, 1), getVisualHeaderCellContent(grid, 1, 2));
    expectVisualOrder(grid, [11, 12, 21, 22]);
  });

  it('should reorder the groups', () => {
    dragAndDropOver(getVisualHeaderCellContent(grid, 0, 0), getVisualHeaderCellContent(grid, 0, 3));
    const firstGroupCell = getVisualHeaderCellContent(grid, 0, 0);
    expect(firstGroupCell.innerText).to.equal('2');
    expectVisualOrder(grid, [21, 22, 11, 12]);
  });

  it('should allow dropping group over other groups column header', () => {
    dragAndDropOver(getVisualHeaderCellContent(grid, 0, 0), getVisualHeaderCellContent(grid, 1, 3));
    expectVisualOrder(grid, [21, 22, 11, 12]);
  });

  it('should allow dropping group over body cell of another group', () => {
    dragAndDropOver(getVisualHeaderCellContent(grid, 0, 0), getVisualCellContent(grid.$.items, 0, 3));
    expectVisualOrder(grid, [21, 22, 11, 12]);
  });

  it('should maintain order of child columns on parent reorder', () => {
    dragAndDropOver(getVisualHeaderCellContent(grid, 1, 0), getVisualHeaderCellContent(grid, 1, 1));
    dragAndDropOver(getVisualHeaderCellContent(grid, 0, 0), getVisualHeaderCellContent(grid, 0, 3));
    expectVisualOrder(grid, [21, 22, 12, 11]);
  });

  describe('physical reordering', () => {
    let groups;

    beforeEach(() => {
      groups = Array.from(grid.querySelectorAll('vaadin-grid-column-group'));
    });

    it('should reflect the physically reordered columns order', () => {
      grid.insertBefore(groups[1], groups[0]);
      flushGrid(grid);
      expectVisualOrder(grid, [21, 22, 11, 12]);
    });

    it('should reflect the physically reordered child columns order', async () => {
      const columns = groups[0].querySelectorAll('vaadin-grid-column');
      groups[0].insertBefore(columns[1], columns[0]);
      await nextFrame();
      expectVisualOrder(grid, [12, 11, 21, 22]);
    });

    it('should reset drag orders on physical order', async () => {
      dragAndDropOver(getVisualHeaderCellContent(grid, 1, 2), getVisualHeaderCellContent(grid, 1, 3));
      expectVisualOrder(grid, [11, 12, 22, 21]);
      const columns = groups[0].querySelectorAll('vaadin-grid-column');

      groups[0].insertBefore(columns[1], columns[0]);
      await nextFrame();
      expectVisualOrder(grid, [12, 11, 21, 22]);
    });
  });
});

describe('reordering grid with different column widths', () => {
  let grid, headerContent0, headerContent1, content0rect, content1rect;

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 400px; height: 200px;" size="1" column-reordering-allowed>
        <vaadin-grid-column width="50px" flex-grow="0">
          <template class="header">1</template>
          <template>1</template>
        </vaadin-grid-column>
        <vaadin-grid-column width="100px" flex-grow="0">
          <template class="header">2</template>
          <template>2</template>
        </vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
    await aTimeout(0);
    headerContent0 = getContainerCell(grid.$.header, 0, 0);
    headerContent1 = getContainerCell(grid.$.header, 0, 1);
    content0rect = headerContent0.getBoundingClientRect();
    content1rect = headerContent1.getBoundingClientRect();
  });

  it('should not reorder', () => {
    dragOver(headerContent0, headerContent1, content1rect.right - content0rect.width);
    expect(headerContent1.getBoundingClientRect().left).to.equal(content1rect.left);
  });

  it('should reorder', () => {
    dragOver(headerContent0, headerContent1, content1rect.right - content0rect.width + 1);
    expect(headerContent1.getBoundingClientRect().left).not.to.equal(content1rect.left);
  });
});

describe('large column group', () => {
  let grid;

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 400px; height: 200px;" size="1" column-reordering-allowed>
        <vaadin-grid-column-group>
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((col) => {
            return `
              <vaadin-grid-column width="10px">
                <template class="header">${col}</template>
                <template>${col}</template>
                <template class="footer">${col}</template>
              </vaadin-grid-column>
            `;
          })}
        </vaadin-grid-column-group>
        <vaadin-grid-column width="10px">
          <template class="header">12</template>
          <template>12</template>
          <template class="footer">12</template>
        </vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
    await aTimeout(0);
  });

  it('should support over 10 child-columns in a group', () => {
    expectVisualOrder(grid, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });
});

describe('reordering with draggable contents', () => {
  let grid, visualColumnCellContents;

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 400px; height: 200px;" size="1" column-reordering-allowed>
        ${[1, 2].map((col) => {
          return `
            <vaadin-grid-column resizable>
              <template class="header">
                <div draggable="true">${col}</div>
              </template>
              <template>
                <div draggable="true">${col}</div>
              </template>
              <template class="footer">
                <div draggable="true">${col}</div>
              </template>
            </vaadin-grid-column>
          `;
        })}
      </vaadin-grid>
    `);
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
    await aTimeout(0);
    const colCount = getRowCells(getRows(grid.$.header)[0]).length;
    visualColumnCellContents = [];
    for (let i = 0; i < colCount; i++) {
      visualColumnCellContents.push(getVisualColumnCellContents(grid, i));
    }
  });

  it('should start reordering on header cell content', () => {
    dragStart(visualColumnCellContents[0][1]);
    expect(grid.hasAttribute('reordering')).to.be.true;
  });

  it('should not start reordering inside body cell content', () => {
    dragStart(visualColumnCellContents[0][0].children[0]);
    expect(grid.hasAttribute('reordering')).to.be.false;
  });

  it('should not start reordering inside draggable header cell content', () => {
    dragStart(visualColumnCellContents[0][1].children[0]);
    expect(grid.hasAttribute('reordering')).to.be.false;
  });

  it('should not start reordering inside draggable footer cell content', () => {
    dragStart(visualColumnCellContents[0][2].children[0]);
    expect(grid.hasAttribute('reordering')).to.be.false;
  });
});

describe('group with empty headers', () => {
  let grid;

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 400px; height: 200px;" size="1" column-reordering-allowed>
        <vaadin-grid-column-group>
          <vaadin-grid-column>
            <template class="header">1</template>
            <template>1</template>
            <template class="footer">1</template>
          </vaadin-grid-column>
        </vaadin-grid-column-group>

        <vaadin-grid-column>
          <template class="header">2</template>
          <template>2</template>
          <template class="footer">2</template>
        </vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
    await nextFrame();
  });

  it('should swap a column and a column of a group with empty header', () => {
    dragAndDropOver(getVisualHeaderCellContent(grid, 0, 1), getVisualHeaderCellContent(grid, 0, 0));
    expectVisualOrder(grid, [2, 1]);
  });

  it('should swap a column of a group with empty header and a column', () => {
    dragAndDropOver(getVisualHeaderCellContent(grid, 0, 0), getVisualHeaderCellContent(grid, 0, 1));
    expectVisualOrder(grid, [2, 1]);
  });
});
