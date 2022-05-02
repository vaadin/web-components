import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '../vaadin-grid.js';
import '../vaadin-grid-column-group.js';
import { flushGrid, getContainerCell } from './helpers.js';

describe('column group', () => {
  let group, columns;

  beforeEach(() => {
    group = fixtureSync(`
      <vaadin-grid-column-group>
        <template class="header"></template>
        <template class="footer"></template>
        <vaadin-grid-column flex-grow="1" width="20%">
          <template class="header"></template>
          <template></template>
        </vaadin-grid-column>
        <vaadin-grid-column flex-grow="2" width="200px">
          <template class="header"></template>
          <template></template>
        </vaadin-grid-column>
      </vaadin-grid-column-group>
    `);
    columns = group.querySelectorAll('vaadin-grid-column');
  });

  it('should sum child column flex-grow', () => {
    expect(group.flexGrow).to.eql(3);
  });

  it('should sum child column widths', () => {
    expect(group.width).to.eql('calc(20% + 200px)');
  });

  it('should strip nested `calc` keywords', () => {
    columns[0].width = 'calc(50% + 10px)';

    expect(group.width).to.eql('calc((50% + 10px) + 200px)');
  });

  it('should react to child column flex-grow changes', () => {
    columns[0].flexGrow = 3;

    expect(group.flexGrow).to.eql(5);
  });

  it('should react to child column width changes', () => {
    columns[0].width = '10%';

    expect(group.width).to.eql('calc(10% + 200px)');
  });

  it('should get frozen when child column freezes', () => {
    columns[0].frozen = true;

    expect(group.frozen).to.be.true;
  });

  // this test is aimed for Safari 9, see #552
  it('should propagate frozen from children when attached', () => {
    const parent = group.parentElement;
    parent.removeChild(group);

    columns[0].frozen = true;

    parent.appendChild(group);

    expect(group.frozen).to.be.true;
  });

  it('should propagate frozen to child columns', () => {
    columns[0].frozen = false;
    group.frozen = true;

    expect(columns[0].frozen).to.be.true;
    expect(columns[1].frozen).to.be.true;
  });

  it('should calculate column group width after hiding a column', () => {
    columns[0].hidden = true;

    expect(group.width).to.eql('calc(200px)');
  });

  it('should calculate column group flexGrow after hiding a column', () => {
    columns[0].hidden = true;

    expect(group.flexGrow).to.eql(2);
  });

  describe('dom observing', () => {
    let grid, column;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-column-group>
            <vaadin-grid-column></vaadin-grid-column>
          </vaadin-grid-column-group>
        </vaadin-grid>
      `);

      grid.items = ['item1', 'item2'];
      column = grid.firstElementChild;

      flushGrid(grid);
    });

    ['header', 'footer'].forEach((templateName) => {
      let cell;

      beforeEach(() => {
        if (templateName === 'header') {
          cell = getContainerCell(grid.$.header, 0, 0);
        }
        if (templateName === 'footer') {
          cell = getContainerCell(grid.$.footer, 1, 0);
        }
      });

      it(`should observe for adding ${templateName} templates`, async () => {
        const template = fixtureSync(`
          <template class="${templateName}">content</template>
        `);

        column.appendChild(template);
        await nextRender();

        expect(cell._content.textContent).to.equal('content');
      });

      it(`should observe for replacing ${templateName} templates`, async () => {
        const template1 = fixtureSync(`
          <template class="${templateName}">content1</template>
        `);
        const template2 = fixtureSync(`
          <template class="${templateName}">content2</template>
        `);

        column.appendChild(template1);
        await nextRender();

        expect(cell._content.textContent).to.equal('content1');

        column.removeChild(template1);
        column.appendChild(template2);
        await nextRender();

        expect(cell._content.textContent).to.equal('content2');
      });
    });
  });

  describe('inheritance', () => {
    it('both, class and super observers, should be called', () => {
      const superSpy = sinon.spy(group, '_resizableChanged');
      const thisSpy = sinon.spy(group, '_groupResizableChanged');
      group.resizable = true;
      expect(superSpy.called).to.be.true;
      expect(thisSpy.called).to.be.true;
    });
  });

  describe('hidden', () => {
    it('should propagate hidden to child columns', () => {
      group.hidden = true;
      expect(columns[0].hidden).to.be.true;
      expect(columns[1].hidden).to.be.true;
      expect(group.hidden).to.be.true;

      group.hidden = false;
      expect(columns[0].hidden).to.be.false;
      expect(columns[1].hidden).to.be.false;
      expect(group.hidden).to.be.false;
    });

    it('should propagate hidden to added column when group is set to hidden', () => {
      group.hidden = true;

      const visibleColumn = document.createElement('vaadin-grid-column');
      visibleColumn.hidden = false;
      group.appendChild(visibleColumn);
      group._observer.flush();

      expect(visibleColumn.hidden).to.be.true;
    });

    it('should not propagate hidden to added column when group is visible', () => {
      const hiddenColumn = document.createElement('vaadin-grid-column');
      hiddenColumn.hidden = true;
      group.appendChild(hiddenColumn);
      group._observer.flush();

      expect(hiddenColumn.hidden).to.be.true;
    });

    it('should not unhide when adding a visible column', () => {
      group.hidden = true;

      const visibleColumn = document.createElement('vaadin-grid-column');
      visibleColumn.hidden = false;
      group.appendChild(visibleColumn);
      group._observer.flush();

      expect(columns[1].hidden).to.be.true;
    });

    it('should not unhide when column is made visible', () => {
      group.hidden = true;
      columns[0].hidden = false;

      expect(group.hidden).to.be.true;
    });

    it('should not unhide other columns when a column is made visible', () => {
      group.hidden = true;
      columns[0].hidden = false;

      expect(columns[1].hidden).to.be.true;
    });
  });

  describe('auto-hide', () => {
    it('should auto-hide group when all columns are hidden', () => {
      columns[0].hidden = true;
      columns[1].hidden = true;

      expect(group.hidden).to.be.true;
      expect(group._autoHidden).to.be.true;
    });

    it('should auto-hide the group when removing all columns', () => {
      group.removeChild(columns[0]);
      group.removeChild(columns[1]);
      group._observer.flush();

      expect(group.hidden).to.be.true;
      expect(group._autoHidden).to.be.true;
    });

    it('should unhide when column is made visible while auto-hidden', () => {
      columns[0].hidden = true;
      columns[1].hidden = true;
      expect(group.hidden).to.be.true;
      expect(group._autoHidden).to.be.true;

      columns[0].hidden = false;
      expect(group.hidden).to.be.false;
      expect(group._autoHidden).to.be.false;
    });

    it('should unhide when adding a visible column while auto-hidden', () => {
      group.removeChild(columns[0]);
      group.removeChild(columns[1]);
      group._observer.flush();

      group.appendChild(columns[0]);
      group._observer.flush();

      expect(group.hidden).to.be.false;
    });

    it('should not unhide the group when adding a hidden column while auto-hidden', () => {
      group.removeChild(columns[0]);
      group.removeChild(columns[1]);
      group._observer.flush();

      columns[0].hidden = true;
      group.appendChild(columns[0]);
      group._observer.flush();

      expect(group.hidden).to.be.true;
    });

    it('should not propagate hidden to added columns while auto-hidden', () => {
      // auto-hide group
      columns[0].hidden = true;
      columns[1].hidden = true;
      expect(group.hidden).to.be.true;
      expect(group._autoHidden).to.be.true;

      // add a visible and a hidden column
      const visibleColumn = document.createElement('vaadin-grid-column');
      const hiddenColumn = document.createElement('vaadin-grid-column');
      hiddenColumn.hidden = true;

      group.appendChild(visibleColumn);
      group.appendChild(hiddenColumn);
      group._observer.flush();

      // group becomes visible because it was only auto-hidden, and now has a visible column
      expect(group.hidden).to.be.false;
      // visible column is still visible
      expect(visibleColumn.hidden).to.be.false;
      // hidden column is still hidden
      expect(hiddenColumn.hidden).to.be.true;
    });
  });
});
