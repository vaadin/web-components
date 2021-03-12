import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, nextFrame } from '@open-wc/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import {
  flushColumns,
  flushGrid,
  getBodyCellContent,
  getCellContent,
  getContainerCell,
  getContainerCellContent,
  getHeaderCellContent,
  infiniteDataProvider
} from './helpers.js';
import '../vaadin-grid.js';
import '../vaadin-grid-column-group.js';

class GridContainer extends PolymerElement {
  static get template() {
    return html`
      <vaadin-grid id="grid" size="10">
        <vaadin-grid-column-group>
          <template class="header">group header1</template>
          <vaadin-grid-column>
            <template class="header">header1</template>
            <template>cell</template>
            <template class="footer">footer1</template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template class="header">header2</template>
            <template>cell</template>
            <template class="footer">footer2</template>
          </vaadin-grid-column>
        </vaadin-grid-column-group>

        <vaadin-grid-column id="emptycolumn"></vaadin-grid-column>
      </vaadin-grid>
    `;
  }
}

customElements.define('grid-container', GridContainer);

describe('column', () => {
  let container, column, grid, emptyColumn;

  beforeEach(() => {
    container = fixtureSync('<grid-container></grid-container>');
    grid = container.$.grid;
    grid.dataProvider = infiniteDataProvider;
    column = grid.querySelector('vaadin-grid-column');
    emptyColumn = grid.querySelector('#emptycolumn');
    flushGrid(grid);
  });

  describe('properties', () => {
    describe('flex', () => {
      it('should have default value', () => {
        expect(column.flexGrow).to.eql(1);
      });

      it('should be bound to header cells', () => {
        column.flexGrow = 2;

        const header = grid.$.header;

        expect(getContainerCell(header, 0, 0).style.flexGrow).to.eql('3'); // colspan 2 + 1
        expect(getContainerCell(header, 1, 0).style.flexGrow).to.eql('2');
      });

      it('should be bound to row cells', () => {
        column.flexGrow = 2;

        expect(getContainerCell(grid.$.items, 0, 0).style.flexGrow).to.eql('2');
      });

      it('should be bound to footer cells', () => {
        column.flexGrow = 2;

        expect(getContainerCell(grid.$.footer, 0, 0).style.flexGrow).to.eql('2');
      });
    });

    describe('width', () => {
      it('should have default width', () => {
        expect(column.width).to.eql('100px');
      });

      it('should be bound to header cells', () => {
        column.width = '20%';

        const width = getContainerCell(grid.$.header, 0, 0).style.width;
        expect(width).to.be.oneOf(['calc(20% + 100px)', 'calc(100px + 20%)']);
      });

      it('should be bound to row cells', () => {
        column.width = '200px';

        expect(getContainerCell(grid.$.items, 0, 0).style.width).to.eql('200px');
      });

      it('should be bound to footer cells', () => {
        column.width = '200px';

        expect(getContainerCell(grid.$.footer, 0, 0).style.width).to.eql('200px');
      });
    });

    describe('hidden', () => {
      it('should default to undefined', () => {
        expect(column.hidden).to.eql(undefined);
      });

      it('should not be bound to column-group header cells', () => {
        column.hidden = true;

        expect(getContainerCell(grid.$.header, 0, 0).style.display).to.eql('');
      });

      it('should bind colSpan to column-group header cells', () => {
        expect(getContainerCell(grid.$.header, 0, 0).colSpan).to.eql(2);

        column.hidden = true;

        expect(getContainerCell(grid.$.header, 0, 0).colSpan).to.eql(1);
      });

      it('should not be bound to column header cells', () => {
        column.hidden = true;
        flushGrid(grid);

        expect(column._headerCell.parentElement).to.be.not.ok;
      });

      it('should be bound to row cells', () => {
        column.hidden = true;
        flushGrid(grid);

        expect(column._cells[0].parentElement).to.be.not.ok;
      });

      it('should be bound to footer cells', () => {
        column.hidden = true;
        flushGrid(grid);

        expect(column._footerCell.parentElement).to.be.not.ok;
      });

      it('should notify resize', () => {
        const spy = sinon.spy(grid, 'notifyResize');
        column.hidden = true;
        expect(spy.callCount).to.equal(1);
        column.hidden = false;
        expect(spy.callCount).to.equal(2);
      });

      it('should not notify resize', () => {
        const spy = sinon.spy(grid, 'notifyResize');
        expect(column.hidden).to.be.undefined;
        column.hidden = false;
        expect(spy.called).to.be.false;
      });

      it('should detach cells from a hidden column', () => {
        const childCountBefore = grid.childElementCount;
        column.hidden = true;
        const childCountAfter = grid.childElementCount;
        expect(childCountAfter).to.be.below(childCountBefore);
      });

      it('should not throw on render with initially hidden columns with header/footerRenderer', () => {
        const newColumn = document.createElement('vaadin-grid-column');
        newColumn.hidden = true;
        newColumn.headerRenderer = () => {};
        newColumn.footerRenderer = () => {};
        grid.appendChild(newColumn);
        flushGrid(grid);
        expect(() => grid.render()).not.to.throw(Error);
      });

      it('should not remove details row when a column is hidden', () => {
        grid.rowDetailsRenderer = (root) => (root.textContent = 'row-details');
        grid.detailsOpenedItems = [grid._cache.items[0]];
        column.hidden = true;
        flushGrid(grid);
        const details = grid.shadowRoot.querySelector('#items [part~="details-cell"]')._content;
        expect(details.textContent).to.equal('row-details');
      });

      it('should not throw error when adding a new row with a hidden column', () => {
        column.hidden = true;
        flushGrid(grid);
        expect(() => (grid.size = 11)).to.not.throw(Error);
      });
    });

    describe('path', () => {
      beforeEach(() => {
        emptyColumn.path = 'value';
      });

      it('should use path as the header', () => {
        expect(getHeaderCellContent(grid, 1, 2).textContent.trim()).to.equal('Value');
      });

      it('should format proper header from the last path token', () => {
        emptyColumn.path = 'foo.barBaz';
        expect(getHeaderCellContent(grid, 1, 2).textContent.trim()).to.equal('Bar baz');
      });

      it('should format three part header text', () => {
        emptyColumn.path = 'fooBarBaz';
        expect(getHeaderCellContent(grid, 1, 2).textContent.trim()).to.equal('Foo bar baz');
      });

      it('should not override header renderer content', () => {
        emptyColumn.headerRenderer = (root) => (root.textContent = 'foo');
        emptyColumn.path = 'foo';
        expect(getHeaderCellContent(grid, 1, 2).textContent.trim()).to.equal('foo');
      });

      it('should not override header template content', () => {
        const template = document.createElement('template');
        template.innerHTML = 'foo';
        template.classList.add('header');
        emptyColumn.appendChild(template);
        flushColumns(grid);
        emptyColumn.path = 'bar';
        expect(getHeaderCellContent(grid, 1, 2).textContent.trim()).to.equal('foo');
      });

      it('should use path generated header if header renderer is removed', () => {
        emptyColumn.headerRenderer = (root) => (root.textContent = 'foo');
        emptyColumn.headerRenderer = null;
        expect(getHeaderCellContent(grid, 1, 2).textContent.trim()).to.equal('Value');
      });

      it('should use path as the content cell identifier', () => {
        expect(getBodyCellContent(grid, 0, 2).textContent.trim()).to.equal('foo0');
      });

      it('should only render text in the cell', () => {
        expect(getBodyCellContent(grid, 0, 2).firstElementChild).not.to.be.ok;
      });

      it('should not override renderer content', () => {
        emptyColumn.renderer = (root) => (root.textContent = 'foo');
        emptyColumn.path = 'foo';
        expect(getBodyCellContent(grid, 0, 2).textContent.trim()).to.equal('foo');
      });

      it('should not override template content', () => {
        const template = document.createElement('template');
        template.innerHTML = 'foo';
        emptyColumn.path = 'foo';
        emptyColumn.appendChild(template);
        flushColumns(grid);
        expect(getBodyCellContent(grid, 0, 2).textContent.trim()).to.equal('foo');
      });

      it('should use path if renderer is removed', () => {
        emptyColumn.renderer = (root) => (root.textContent = 'foo');
        emptyColumn.renderer = null;
        expect(getBodyCellContent(grid, 0, 2).textContent.trim()).to.equal('foo0');
      });

      it('should not invoke body renderers of other columns', () => {
        const newColumn = document.createElement('vaadin-grid-column');
        grid.appendChild(newColumn);
        flushGrid(grid);
        emptyColumn.renderer = sinon.spy();
        emptyColumn.renderer.resetHistory();
        newColumn.path = 'foo';
        expect(emptyColumn.renderer.called).to.be.false;
      });

      it('should not reapply the existing text content', async () => {
        emptyColumn.path = '';
        const content = getBodyCellContent(grid, 0, 2);
        const spy = sinon.spy();
        Object.defineProperty(content, 'textContent', {
          set: spy,
          get: () => {
            return spy.called ? spy.getCalls().pop().args[0] : '';
          }
        });
        emptyColumn.path = 'value';
        await nextFrame();
        expect(spy.callCount).to.equal(1);
      });

      it('should not reapply the existing header text content', async () => {
        const content = getHeaderCellContent(grid, 1, 2);
        const spy = sinon.spy();
        Object.defineProperty(content, 'textContent', {
          set: spy,
          get: () => {
            return spy.called ? spy.getCalls().pop().args[0] : '';
          }
        });
        emptyColumn.path = 'header';
        const callCount = spy.callCount;
        emptyColumn.header = undefined;
        await nextFrame();
        expect(spy.callCount).to.equal(callCount);
      });
    });

    describe('header', () => {
      beforeEach(() => {
        emptyColumn.header = 'Header';
      });

      it('should show the header text in the header cell', () => {
        expect(getHeaderCellContent(grid, 1, 2).textContent.trim()).to.equal('Header');
      });

      it('should not override header renderer text content', () => {
        emptyColumn.headerRenderer = (root) => (root.textContent = 'foo');
        emptyColumn.header = 'Bar';
        expect(getHeaderCellContent(grid, 1, 2).textContent.trim()).to.equal('foo');
      });

      it('should not override header template text content', () => {
        const template = document.createElement('template');
        template.innerHTML = 'foo';
        template.classList.add('header');
        emptyColumn.appendChild(template);
        flushColumns(grid);
        emptyColumn.header = 'Bar';
        expect(getHeaderCellContent(grid, 1, 2).textContent.trim()).to.equal('foo');
      });

      it('should override path generated header', () => {
        emptyColumn.path = 'foo';
        expect(getHeaderCellContent(grid, 1, 2).textContent.trim()).to.equal('Header');
      });

      it('should use path generated header if header is removed', () => {
        emptyColumn.path = 'foo';
        emptyColumn.header = undefined;
        expect(getHeaderCellContent(grid, 1, 2).textContent.trim()).to.equal('Foo');
      });

      it('should not hide the header row', () => {
        grid.removeChild(grid.querySelector('vaadin-grid-column-group'));
        flushGrid(grid);
        expect(grid.$.header.children[0].hidden).not.to.be.ok;
      });

      it('should not hide the header row with empty header', () => {
        emptyColumn.header = '';
        grid.removeChild(grid.querySelector('vaadin-grid-column-group'));
        flushGrid(grid);
        expect(grid.$.header.children[0].hidden).not.to.be.ok;
      });

      it('should hide the header row with null header', () => {
        emptyColumn.path = 'foo';
        emptyColumn.header = null;
        grid.removeChild(grid.querySelector('vaadin-grid-column-group'));
        flushGrid(grid);
        expect(grid.$.header.children[0].hidden).to.be.ok;
      });

      it('should produce an empty header cell', () => {
        emptyColumn.path = 'foo';
        emptyColumn.header = '';
        expect(getHeaderCellContent(grid, 1, 2).textContent.trim()).to.equal('');
      });

      it('should hide the header', () => {
        emptyColumn.header = undefined;
        grid.removeChild(grid.querySelector('vaadin-grid-column-group'));
        flushGrid(grid);
        expect(getContainerCell(grid.$.header, 0, 0).parentElement.hidden).to.be.true;
      });

      it('should not reapply the existing header text content', async () => {
        const content = getHeaderCellContent(grid, 1, 2);
        const spy = sinon.spy();
        Object.defineProperty(content, 'textContent', {
          set: spy,
          get: () => {
            return spy.called ? spy.getCalls().pop().args[0] : '';
          }
        });
        emptyColumn.header = undefined;
        emptyColumn.path = 'foo';
        const callCount = spy.callCount;
        emptyColumn.header = 'Foo';
        await nextFrame();
        expect(spy.callCount).to.equal(callCount);
      });
    });

    describe('Text align', () => {
      it('should align visually to right', () => {
        emptyColumn.textAlign = 'end';
        expect(getComputedStyle(getHeaderCellContent(grid, 1, 2)).textAlign).to.be.oneOf(['end', 'right']);
        expect(getComputedStyle(getBodyCellContent(grid, 0, 2)).textAlign).to.be.oneOf(['end', 'right']);
        expect(getComputedStyle(getContainerCellContent(grid.$.footer, 0, 2)).textAlign).to.be.oneOf(['end', 'right']);
      });

      it('should align visually to left', () => {
        grid.style.direction = 'rtl';
        emptyColumn.textAlign = 'end';
        expect(getComputedStyle(getHeaderCellContent(grid, 1, 2)).textAlign).to.be.oneOf(['end', 'left']);
        expect(getComputedStyle(getBodyCellContent(grid, 0, 2)).textAlign).to.be.oneOf(['end', 'left']);
        expect(getComputedStyle(getContainerCellContent(grid.$.footer, 0, 2)).textAlign).to.be.oneOf(['end', 'left']);
      });

      it('should align visually to center', () => {
        emptyColumn.textAlign = 'center';
        expect(getComputedStyle(getHeaderCellContent(grid, 1, 2)).textAlign).to.equal('center');
        expect(getComputedStyle(getBodyCellContent(grid, 0, 2)).textAlign).to.equal('center');
        expect(getComputedStyle(getContainerCellContent(grid.$.footer, 0, 2)).textAlign).to.equal('center');
      });

      describe('warnings', () => {
        beforeEach(() => {
          sinon.stub(console, 'warn');
        });

        afterEach(() => {
          console.warn.restore();
        });

        it('should warn about invalid text-align value', () => {
          emptyColumn.textAlign = 'right';
          expect(console.warn.callCount).to.equal(1);
        });

        it('should not warn about valid text-align value', () => {
          emptyColumn.textAlign = 'center';
          expect(console.warn.callCount).to.equal(0);
        });

        it('invalid value should not change the effective value', () => {
          emptyColumn.textAlign = 'right';
          expect(getComputedStyle(getBodyCellContent(grid, 0, 2)).textAlign).not.to.equal('right');
        });
      });
    });
  });

  describe('cell template', () => {
    it('should read template from light DOM', () => {
      expect(getCellContent(getContainerCell(grid.$.items, 0, 0)).textContent).to.contain('cell');
    });
  });

  describe('header templates', () => {
    it('should read templates from light DOM', () => {
      expect(getHeaderCellContent(grid, 0, 0).textContent).to.contain('group header1');
      expect(getHeaderCellContent(grid, 1, 0).textContent).to.contain('header1');
    });
  });

  describe('dom observing', () => {
    it('should pickup header template', () => {
      const column = document.createElement('vaadin-grid-column');
      const template = document.createElement('template');
      template.classList.add('header');

      column.appendChild(template);
      column._templateObserver.flush();

      expect(column._headerTemplate).to.eql(template);
    });

    it('should pickup footer template', () => {
      const column = document.createElement('vaadin-grid-column');
      const template = document.createElement('template');
      template.classList.add('footer');

      column.appendChild(template);
      column._templateObserver.flush();

      expect(column._footerTemplate).to.eql(template);
    });

    it('should pickup body template', () => {
      const column = document.createElement('vaadin-grid-column');
      const template = document.createElement('template');

      column.appendChild(template);
      column._templateObserver.flush();

      expect(column._bodyTemplate).to.eql(template);
    });

    it('should re-pickup header template', () => {
      const column = document.createElement('vaadin-grid-column');
      const template = document.createElement('template');
      template.classList.add('header');
      const template2 = document.createElement('template');
      template2.classList.add('header');

      column.appendChild(template);
      column._templateObserver.flush();
      column.removeChild(template);
      column.appendChild(template2);
      column._templateObserver.flush();
      expect(column._headerTemplate).to.eql(template2);
    });

    it('should pickup new body template', () => {
      const column = document.createElement('vaadin-grid-column');
      const template = document.createElement('template');
      const template2 = document.createElement('template');

      column.appendChild(template);
      column._templateObserver.flush();
      column.removeChild(template);
      column.appendChild(template2);
      column._templateObserver.flush();

      expect(column._bodyTemplate).to.eql(template2);
    });

    it('should prepare template when added lazily', () => {
      const column = document.createElement('vaadin-grid-column');
      const template = document.createElement('template');

      column.appendChild(template);
      column._templateObserver.flush();

      grid.appendChild(column);
      grid._observer.flush();

      expect(template.templatizer.template).to.eql(template);
      expect(column._bodyTemplate).to.eql(template);
    });

    it('should prepare a new template when added lazily', () => {
      const column = document.createElement('vaadin-grid-column');
      const template = document.createElement('template');
      const template2 = document.createElement('template');

      column.appendChild(template);
      column._templateObserver.flush();

      grid.appendChild(column);
      grid._observer.flush();

      column.removeChild(template);
      column.appendChild(template2);
      column._templateObserver.flush();

      expect(template2.templatizer.template).to.eql(template2);
      expect(column._bodyTemplate).to.eql(template2);
    });
  });
});
