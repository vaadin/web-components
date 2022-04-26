import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '../vaadin-grid.js';
import '../vaadin-grid-column-group.js';
import {
  flushGrid,
  getCellContent,
  getContainerCellContent,
  getRowCells,
  getRows,
  infiniteDataProvider,
  nextResize,
  scrollToEnd,
} from './helpers.js';

const createColumn = () => {
  const column = document.createElement('vaadin-grid-column');
  column.innerHTML = '<template class="footer">Foobar</template></vaadin-grid-column>';
  return column;
};

const fixtures = {
  'no-headers': `
    <vaadin-grid size="10">
      <vaadin-grid-column>
        <template>body-0</template>
      </vaadin-grid-column>
      <vaadin-grid-column-group>
        <vaadin-grid-column>
          <template>body-1</template>
        </vaadin-grid-column>
        <vaadin-grid-column>
          <template>body-2</template>
        </vaadin-grid-column>
      </vaadin-grid-column-group>
    </vaadin-grid>
  `,
  '1-column-1-group': `
    <vaadin-grid size="10">
      <vaadin-grid-column frozen>
        <template class="header">header-0</template>
        <template>body-0</template>
      </vaadin-grid-column>

      <vaadin-grid-column-group frozen>
        <template class="header">group-0</template>

        <vaadin-grid-column>
          <template class="header">header-1</template>
          <template>body-1</template>
        </vaadin-grid-column>
        <vaadin-grid-column>
          <template class="header">header-2</template>
          <template>body-2</template>
        </vaadin-grid-column>
      </vaadin-grid-column-group>
    </vaadin-grid>
  `,
  nested: `
    <vaadin-grid size="100">
      <vaadin-grid-column-group>
        <template class="header">group-0</template>
        <template class="footer">group-0</template>
        <vaadin-grid-column>
          <template>body-0</template>
        </vaadin-grid-column>
        <vaadin-grid-column>
          <template>body-1</template>
        </vaadin-grid-column>
      </vaadin-grid-column-group>

      <vaadin-grid-column-group>
        <template class="header">group-1</template>
        <template class="footer">group-1</template>
        <vaadin-grid-column-group>
          <template class="header">group-2</template>
          <template class="footer">group-2</template>
          <vaadin-grid-column>
            <template>body-2</template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template>body-3</template>
          </vaadin-grid-column>
        </vaadin-grid-column-group>

        <vaadin-grid-column-group frozen>
          <template class="header">group-3</template>
          <template class="footer">group-3</template>
          <vaadin-grid-column>
            <template>body-4</template>
            <template class="header">header-4</template>
            <template class="footer">footer-4</template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template>body-5</template>
            <template class="header">header-5</template>
            <template class="footer">footer-5</template>
          </vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid-column-group>
      <vaadin-grid-column>
        <template>body-6</template>
        <template class="header">header-6</template>
        <template class="footer">footer-6</template>
      </vaadin-grid-column>
    </vaadin-grid>
  `,
  'hidden-group': `
    <vaadin-grid>
      <vaadin-grid-column-group hidden>
        <vaadin-grid-column>
          <template></template>
        </vaadin-grid-column>
        <vaadin-grid-column>
          <template></template>
        </vaadin-grid-column>
      </vaadin-grid-column-group>
    </vaadin-grid>
  `,
  'hidden-column': `
    <vaadin-grid>
      <vaadin-grid-column-group>
        <vaadin-grid-column hidden>
          <template></template>
        </vaadin-grid-column>
        <vaadin-grid-column>
          <template></template>
        </vaadin-grid-column>
      </vaadin-grid-column-group>
    </vaadin-grid>
  `,
};

describe('column groups', () => {
  let grid, header, body, footer, headerRows, footerRows, bodyRows;

  function getFooterCellContent(row, col) {
    return getCellContent(getFooterCell(row, col)).textContent.trim();
  }

  function getHeaderCellContent(row, col) {
    return getCellContent(getHeaderCell(row, col)).textContent.trim();
  }

  function getHeaderCell(row, col) {
    return getRowCells(headerRows[row])[col];
  }

  function getFooterCell(row, col) {
    return getRowCells(footerRows[row])[col];
  }

  function getBodyCellContent(row, col) {
    return getCellContent(getRowCells(bodyRows[row])[col]).innerHTML.trim();
  }

  function init(fixture) {
    grid = fixtureSync(fixtures[fixture]);
    header = grid.$.header;
    body = grid.$.items;
    footer = grid.$.footer;
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);

    headerRows = getRows(header);
    footerRows = getRows(footer);
    bodyRows = getRows(body);

    flushGrid(grid);
  }

  describe('No templates', () => {
    beforeEach(() => {
      init('no-headers');
    });

    it('should have empty header', () => {
      const cells = header.querySelectorAll('[part~="cell"]');
      expect(cells).not.to.be.empty;
      cells.forEach((cell) => expect(cell._content.__templateInstance).to.be.not.ok);
    });

    it('should have empty footer', () => {
      const cells = footer.querySelectorAll('[part~="cell"]');
      expect(cells).not.to.be.empty;

      cells.forEach((cell) => expect(cell._content.__templateInstance).to.be.not.ok);
    });

    it('should have no visible header rows', () => {
      expect(headerRows).not.to.be.empty;

      headerRows.forEach((row) => expect(row.hidden).to.be.true);
    });

    describe('header', () => {
      let emptyGroup;

      beforeEach(() => {
        emptyGroup = grid.querySelector('vaadin-grid-column-group');
        emptyGroup.header = 'Header';
      });

      it('should show the `header` property value in the header cell', () => {
        expect(getHeaderCellContent(0, 1).trim()).to.equal('Header');
      });

      it('should not override header renderer content', () => {
        emptyGroup.headerRenderer = (root) => (root.textContent = 'foo');
        emptyGroup.header = 'Bar';
        expect(getHeaderCellContent(0, 1).trim()).to.equal('foo');
      });

      it('should not override header template content', async () => {
        const template = document.createElement('template');
        template.innerHTML = 'foo';
        template.classList.add('header');
        emptyGroup.appendChild(template);
        await nextRender();
        emptyGroup.header = 'Bar';
        expect(getHeaderCellContent(0, 1).trim()).to.equal('foo');
      });
    });

    describe('Text align', () => {
      let emptyGroup;

      beforeEach(() => {
        emptyGroup = grid.querySelector('vaadin-grid-column-group');
        emptyGroup.headerRenderer = (root) => (root.textContent = 'header');
        emptyGroup.footerRenderer = (root) => (root.textContent = 'footer');
      });

      it('should align visually to right', () => {
        emptyGroup.textAlign = 'end';
        expect(getComputedStyle(getContainerCellContent(grid.$.header, 0, 1)).textAlign).to.be.oneOf(['end', 'right']);
        expect(getComputedStyle(getContainerCellContent(grid.$.footer, 1, 1)).textAlign).to.be.oneOf(['end', 'right']);
      });

      it('should align visually to left', () => {
        grid.style.direction = 'rtl';
        emptyGroup.textAlign = 'end';
        expect(getComputedStyle(getContainerCellContent(grid.$.header, 0, 1)).textAlign).to.be.oneOf(['end', 'left']);
        expect(getComputedStyle(getContainerCellContent(grid.$.footer, 1, 1)).textAlign).to.be.oneOf(['end', 'left']);
      });

      it('should align visually to center', () => {
        emptyGroup.textAlign = 'center';
        expect(getComputedStyle(getContainerCellContent(grid.$.header, 0, 1)).textAlign).to.equal('center');
        expect(getComputedStyle(getContainerCellContent(grid.$.footer, 1, 1)).textAlign).to.equal('center');
      });
    });
  });

  describe('1 column 1 group', () => {
    let extraColumn;

    beforeEach(() => {
      //  |          | group-0             |
      //  | header-0 | header-1 | header-2 |
      init('1-column-1-group');

      extraColumn = createColumn();
      if (grid._observer.flush) {
        grid._observer.flush();
      }
    });

    it('the group header cell should adapt to changes of child columns', () => {
      const cellGroup0 = getHeaderCell(0, 1);
      const cellHeader1 = getHeaderCell(1, 1);

      expect(cellGroup0.style.flexGrow).to.equal('2');
      cellHeader1._column.flexGrow = 3;
      expect(cellGroup0.style.flexGrow).to.equal('4');
    });

    it('should set colSpan to spanned header cells', () => {
      const cell = getHeaderCell(0, 1);

      expect(cell.colSpan).to.eql(2);
    });

    it('should not set colSpan to non-spanned header cells', () => {
      const cell = getHeaderCell(0, 0);

      expect(cell.hasAttribute('colspan')).to.be.false;
    });

    it('should have right amount of rows', () => {
      expect(headerRows).to.have.length(2);
    });

    it('should have right amount of columns', () => {
      expect(getRowCells(headerRows[0])).to.have.length(2);
      expect(getRowCells(headerRows[1])).to.have.length(3);
    });

    it('should have the right content', () => {
      [0, 1, 2].forEach((index) => expect(getHeaderCellContent(1, index)).to.equal(`header-${index}`));
      expect(getHeaderCellContent(0, 1)).to.equal('group-0');
    });

    it('should have the right body template', () => {
      [0, 1, 2].forEach((index) => expect(getBodyCellContent(0, index)).to.equal(`body-${index}`));
    });

    it('should have a frozen column', () => {
      expect(getHeaderCell(0, 0).hasAttribute('frozen')).to.be.true;
      expect(getHeaderCell(1, 0).hasAttribute('frozen')).to.be.true;
    });

    it('should have a frozen group', () => {
      expect(getHeaderCell(0, 1).hasAttribute('frozen')).to.be.true;
      expect(getHeaderCell(1, 1).hasAttribute('frozen')).to.be.true;
      expect(getHeaderCell(1, 2).hasAttribute('frozen')).to.be.true;
    });

    it('should have a column frozen to end', () => {
      const col = grid.querySelector('vaadin-grid-column');
      col.frozen = false;
      col.frozenToEnd = true;
      expect(getHeaderCell(0, 0).hasAttribute('frozen-to-end')).to.be.true;
      expect(getHeaderCell(1, 0).hasAttribute('frozen-to-end')).to.be.true;
    });

    it('should have a group frozen to end', () => {
      const group = grid.querySelector('vaadin-grid-column-group');
      group.frozen = false;
      group.frozenToEnd = true;
      expect(getHeaderCell(0, 1).hasAttribute('frozen-to-end')).to.be.true;
      expect(getHeaderCell(1, 1).hasAttribute('frozen-to-end')).to.be.true;
      expect(getHeaderCell(1, 2).hasAttribute('frozen-to-end')).to.be.true;
    });

    it('should have no hidden header rows', () => {
      headerRows.forEach((row) => expect(row.hidden).to.be.false);
    });

    it('should have no visible footer rows', () => {
      footerRows.forEach((row) => expect(row.hidden).to.be.true);
    });

    it('should have visible footer rows after adding extra column', () => {
      grid.appendChild(extraColumn);
      flushGrid(grid);

      expect(getRows(footer)[0].hidden).to.be.false;
      expect(getRows(footer)[1].hidden).to.be.true;
    });

    it('should not have visible footer rows after removing extra column', async () => {
      grid.appendChild(extraColumn);
      await nextFrame();
      grid.removeChild(extraColumn);
      await nextFrame();
      expect(getRows(footer)[0].hidden).to.be.true;
    });
  });

  describe('Nested groups', () => {
    beforeEach(async () => {
      //  | group-0             | group-1                                  |          |
      //  |           |         | group-2            | group-3             |          |
      //  |           |         |          |         | header-4 | header-5 | header-6 |
      //  -----------------------------------------------------------------------------
      //  |           |         |          |         | footer-4 | footer-5 | footer-6 |
      //  |           |         | group-2            | group-3             |          |
      //  | group-0             | group-1                                  |          |
      init('nested');
      await nextResize(grid);
    });

    it('should have right content in header', () => {
      expect(getHeaderCellContent(0, 0)).to.equal('group-0');
      expect(getHeaderCellContent(0, 1)).to.equal('group-1');
      expect(getHeaderCellContent(1, 2)).to.equal('group-2');
      expect(getHeaderCellContent(1, 3)).to.equal('group-3');
      expect(getHeaderCellContent(2, 4)).to.equal('header-4');
      expect(getHeaderCellContent(2, 5)).to.equal('header-5');
      expect(getHeaderCellContent(2, 6)).to.equal('header-6');
    });

    it('should have right content in footer but reversed', () => {
      expect(getFooterCellContent(0, 4)).to.equal('footer-4');
      expect(getFooterCellContent(0, 5)).to.equal('footer-5');
      expect(getFooterCellContent(0, 6)).to.equal('footer-6');
      expect(getFooterCellContent(1, 2)).to.equal('group-2');
      expect(getFooterCellContent(1, 3)).to.equal('group-3');
      expect(getFooterCellContent(2, 0)).to.equal('group-0');
      expect(getFooterCellContent(2, 1)).to.equal('group-1');
    });

    it('should have cell content wrappers in all header cells', () => {
      header.querySelectorAll('[part~="cell"]').forEach((a) => {
        const content = getCellContent(a);
        expect(content.localName).to.equal('vaadin-grid-cell-content');
      });
    });

    it('should have cell content wrappers in all footer cells', () => {
      footer.querySelectorAll('[part~="cell"]').forEach((a) => {
        const content = getCellContent(a);
        expect(content.localName).to.equal('vaadin-grid-cell-content');
      });
    });

    it('frozen in a group should propagate frozen attribute up and down in headers', () => {
      [
        [0, 1],
        [1, 2],
        [1, 3],
        [2, 2],
        [2, 3],
        [2, 4],
        [2, 5],
      ].forEach((a) => expect(getHeaderCell(a[0], a[1]).hasAttribute('frozen')).to.be.true);
    });

    it('frozen in a group should propagate frozen attribute up and down in footers', () => {
      [
        [0, 2],
        [0, 3],
        [0, 4],
        [0, 5],
        [1, 2],
        [1, 3],
        [2, 1],
      ].forEach((a) => expect(getFooterCell(a[0], a[1]).hasAttribute('frozen')).to.be.true);
    });

    it('should have last row fully visible when scrolled to end', async () => {
      scrollToEnd(grid);
      await nextFrame();
      bodyRows = getRows(body);
      const lastRowBottom = bodyRows[bodyRows.length - 1].getBoundingClientRect().bottom;
      const footerTop = footer.getBoundingClientRect().top;
      expect(lastRowBottom).to.be.closeTo(footerTop, 2);
    });
  });

  describe('Nested groups with frozen to end', () => {
    before(() => {
      fixtures['nested-2'] = fixtures.nested.replace('frozen', 'frozen-to-end');
    });

    beforeEach(async () => {
      init('nested-2');
      await nextResize(grid);
    });

    it('frozen-to-end in a group should propagate frozen-to-end attribute up and down in headers', () => {
      [
        [0, 1],
        [1, 2],
        [1, 3],
        [2, 2],
        [2, 3],
        [2, 4],
        [2, 5],
      ].forEach((a) => expect(getHeaderCell(a[0], a[1]).hasAttribute('frozen-to-end')).to.be.true);
    });

    it('frozen-to-end in a group should propagate frozen-to-end attribute up and down in footers', () => {
      [
        [0, 2],
        [0, 3],
        [0, 4],
        [0, 5],
        [1, 2],
        [1, 3],
        [2, 1],
      ].forEach((a) => expect(getFooterCell(a[0], a[1]).hasAttribute('frozen-to-end')).to.be.true);
    });
  });

  describe('hidden group', () => {
    it('should hide children', async () => {
      init('hidden-group');
      await nextFrame();
      expect(grid.querySelector('vaadin-grid-column').hidden).to.be.true;
      expect(grid.querySelector('vaadin-grid-column-group').hidden).to.be.true;
    });

    it('should hide self', async () => {
      init('hidden-column');
      await nextFrame();
      expect(grid.querySelector('vaadin-grid-column-group').hidden).not.to.be.true;
      const columns = grid.querySelectorAll('vaadin-grid-column');
      expect(columns[0].hidden).to.be.true;
      expect(columns[1].hidden).not.to.be.true;
    });
  });

  describe('Large nested groups', () => {
    let grid;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-column-group header="groupA">
            ${Array.from(Array(13).keys())
              .slice(1)
              .map((group) => {
                const col = (group - 1) * 2;
                return `
                  <vaadin-grid-column-group header="group${group - 1}">
                    <vaadin-grid-column id="col${col}" header="Col ${col}"></vaadin-grid-column>
                    <vaadin-grid-column id="col${col + 1}" header="Col ${col + 1}"></vaadin-grid-column>
                  </vaadin-grid-column-group>
                `;
              })
              .join('')}
          </vaadin-grid-column-group>
        </vaadin-grid>
      `);
    });

    it('should correctly set column order', async () => {
      const col19 = grid.querySelector('#col19');
      const col20 = grid.querySelector('#col20');
      await nextFrame();
      expect(col19._order).to.be.lessThan(col20._order);
    });
  });

  describe('More than 100 columns', () => {
    let grid;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid>
          ${Array.from(Array(101).keys())
            .map(
              (col) => `
              <vaadin-grid-column-group>
                <vaadin-grid-column id="col${col}" header="Col ${col}"></vaadin-grid-column>
              </vaadin-grid-column-group>
              `,
            )
            .join('')}
        </vaadin-grid>
      `);
    });

    it('should correctly set column order when we have more than 100 columns', async () => {
      const col99 = grid.querySelector('#col99');
      const col100 = grid.querySelector('#col100');
      await nextFrame();
      expect(col99._order).to.be.lessThan(col100._order);
    });
  });
});
