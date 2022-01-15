import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '../vaadin-grid.js';
import '../vaadin-grid-column-group.js';
import { flush } from '@polymer/polymer/lib/utils/flush.js';
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

  it('should sum child column flex-grow', async () => {
    expect(group.flexGrow).to.eql(3);
  });

  it('should sum child column widths', () => {
    expect(group.width).to.eql('calc(20% + 200px)');
  });

  it('should strip nested `calc` keywords', async () => {
    columns[0].width = 'calc(50% + 10px)';
    await nextFrame();

    expect(group.width).to.eql('calc((50% + 10px) + 200px)');
  });

  it('should react to child column flex-grow changes', async () => {
    columns[0].flexGrow = 3;
    await nextFrame();

    expect(group.flexGrow).to.eql(5);
  });

  it('should react to child column width changes', async () => {
    columns[0].width = '10%';
    await nextFrame();

    expect(group.width).to.eql('calc(10% + 200px)');
  });

  it('should get frozen when child column freezes', async () => {
    columns[0].frozen = true;
    await nextFrame();

    expect(group.frozen).to.be.true;
  });

  // this test is aimed for Safari 9, see #552
  it('should propagate frozen from children when attached', async () => {
    const parent = group.parentElement;
    parent.removeChild(group);

    columns[0].frozen = true;

    parent.appendChild(group);
    flush();
    await nextFrame();

    expect(group.frozen).to.be.true;
  });

  it('should propagate frozen to child columns', () => {
    columns[0].frozen = false;
    group.frozen = true;

    expect(columns[0].frozen).to.be.true;
    expect(columns[1].frozen).to.be.true;
  });

  it('should hide group column', async () => {
    columns[0].hidden = true;
    columns[1].hidden = true;
    await nextFrame();

    expect(group.hidden).to.be.true;
  });

  it('should unhide group column', async () => {
    group.hidden = true;
    columns[0].hidden = false;
    await nextFrame();

    expect(group.hidden).to.be.false;
  });

  it('should not unhide other columns', () => {
    group.hidden = true;
    columns[0].hidden = false;

    expect(columns[1].hidden).to.be.true;
  });

  it('should propagate hidden to child columns', () => {
    columns[0].hidden = false;
    group.hidden = true;

    expect(columns[0].hidden).to.be.true;
    expect(columns[1].hidden).to.be.true;
    expect(group.hidden).to.be.true;
  });

  it('should propagate hidden to child columns 2', () => {
    group.hidden = true;
    group.hidden = false;

    expect(columns[0].hidden).to.be.false;
    expect(columns[1].hidden).to.be.false;
    expect(group.hidden).to.be.false;
  });

  it('should hide the group', () => {
    group.removeChild(columns[0]);
    group.removeChild(columns[1]);
    flush();
    group._observer.flush();

    expect(group.hidden).to.be.true;
  });

  it('should unhide the group', () => {
    group.removeChild(columns[0]);
    group.removeChild(columns[1]);
    group._observer.flush();

    group.appendChild(columns[0]);
    group._observer.flush();

    expect(group.hidden).to.be.false;
  });

  it('should not unhide the group', () => {
    group.removeChild(columns[0]);
    group.removeChild(columns[1]);
    group._observer.flush();

    columns[0].hidden = true;
    group.appendChild(columns[0]);
    group._observer.flush();

    expect(group.hidden).to.be.true;
  });

  it('should calculate column group width after hiding a column', async () => {
    columns[0].hidden = true;
    await nextFrame();

    expect(group.width).to.eql('calc(200px)');
  });

  it('should calculate column group flexGrow after hiding a column', async () => {
    columns[0].hidden = true;
    await nextFrame();

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
});
