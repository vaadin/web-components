import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-grid.js';
import '../vaadin-grid-column-group.js';
import '../vaadin-grid-selection-column.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import {
  attributeRenderer,
  flushGrid,
  getBodyCellContent,
  getContainerCellContent,
  getHeaderCellContent,
  getRows,
  infiniteDataProvider,
  scrollToEnd,
} from './helpers.js';

class GridWrapper extends PolymerElement {
  static get template() {
    return html`
      <vaadin-grid id="grid" size="10">
        <slot name="grid"></slot>
        <vaadin-grid-column-group header="wrapper group header" footerRenderer="[[groupFooterRenderer]]">
          <slot name="group"></slot>

          <vaadin-grid-column
            header="wrapper column header"
            footerRenderer="[[columnFooterRenderer]]"
            renderer="[[columnRenderer]]"
          ></vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `;
  }

  groupFooterRenderer(root) {
    root.textContent = 'wrapper group footer';
  }

  columnFooterRenderer(root, _column) {
    root.textContent = 'wrapper column footer';
  }

  columnRenderer(root, _column, model) {
    root.textContent = `wrapper column body${model.item.value}`;
  }
}

customElements.define('grid-wrapper', GridWrapper);

function createColumn() {
  const column = document.createElement('vaadin-grid-column');
  column.header = 'some header';
  column.footerRenderer = (root) => {
    root.textContent = 'some footer';
  };
  column.renderer = (root, _column, model) => {
    root.textContent = `some body ${model.item.value}`;
  };
  return column;
}

function createGroup() {
  const group = document.createElement('vaadin-grid-column-group');
  group.innerHTML = `
    <vaadin-grid-column header="some foo header" footer="some foo footer" prefix="some foo body"></vaadin-grid-column>
    <vaadin-grid-column header="some bar header" footer="some bar footer" prefix="some bar body"></vaadin-grid-column>
  `;
  group.header = 'some group header';
  group.footerRenderer = (root) => {
    root.textContent = 'some group footer';
  };

  group.querySelectorAll('vaadin-grid-column').forEach((column) => {
    column.renderer = attributeRenderer('prefix');
    column.footerRenderer = attributeRenderer('footer');
  });
  return group;
}

function expectNumberOfColumns(grid, number) {
  const lastLevel = getRows(grid.$.header).length - 1;
  expect(getRows(grid.$.header)[lastLevel].cells.length).to.be.equal(number);
  expect(getRows(grid.$.items)[0].cells.length).to.be.equal(number);
  expect(getRows(grid.$.footer)[0].cells.length).to.be.equal(number);
}

function getFooterCellContent(grid, row, column) {
  return getContainerCellContent(grid.$.footer, row, column);
}

describe('light dom observing', () => {
  let wrapper, grid;

  describe('generic operations', () => {
    describe('columns inside grid', () => {
      beforeEach(async () => {
        grid = fixtureSync(`
          <vaadin-grid size="10">
            <vaadin-grid-column header="first header"></vaadin-grid-column>
            <vaadin-grid-column header="second header"></vaadin-grid-column>
          </vaadin-grid>
        `);
        grid.dataProvider = infiniteDataProvider;

        flushGrid(grid);
        await nextFrame();
      });

      it('should support adding late', async () => {
        const column = createColumn();
        grid.insertBefore(column, grid.firstChild);
        await nextRender();
        flushGrid(grid);

        expect(getHeaderCellContent(grid, 0, 0).textContent).to.equal('some header');
        expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('some body foo0');
        expect(getFooterCellContent(grid, 0, 0).textContent).to.equal('some footer');
      });

      it('should support adding selection column late', async () => {
        const column = document.createElement('vaadin-grid-selection-column');
        column.header = 'some header';
        column.renderer = attributeRenderer('some body');
        column.footerRenderer = attributeRenderer('some footer');
        grid.insertBefore(column, grid.firstChild);
        await nextRender();
        flushGrid(grid);

        expect(getHeaderCellContent(grid, 0, 0).textContent).to.equal('some header');
        expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('some body foo0');
        expect(getFooterCellContent(grid, 0, 0).textContent).to.equal('some footer');
      });

      it('should support removing late', async () => {
        const column = grid.querySelector('vaadin-grid-column');
        grid.removeChild(column);
        await nextRender();
        flushGrid(grid);
        expect(getHeaderCellContent(grid, 0, 0).textContent).to.equal('second header');
      });

      it('should invoke node observer twice when adding columns', async () => {
        const column = createColumn();
        const spy = sinon.spy(grid._observer, 'callback');
        grid.insertBefore(column, grid.firstChild);
        flushGrid(grid);

        // Once the column is added
        expect(spy.callCount).to.equal(1);

        await nextFrame();

        // Once the column cells are added
        expect(spy.callCount).to.equal(2);
      });

      it('should invoke node observer twice when removing columns', async () => {
        const column = grid.querySelector('vaadin-grid-column');
        const spy = sinon.spy(grid._observer, 'callback');
        grid.removeChild(column);
        flushGrid(grid);

        // Once the column is removed
        expect(spy.callCount).to.equal(1);

        await nextFrame();

        // Once the column cells are removed
        expect(spy.callCount).to.equal(2);
      });

      it('should not invoke on row reorder', (done) => {
        grid.size = 100;
        flushGrid(grid);
        requestAnimationFrame(() => {
          const spy = sinon.spy(grid._observer, 'callback');
          scrollToEnd(grid, () => {
            expect(spy.called).to.be.false;
            done();
          });
        });
      });

      it('should reuse column cells', () => {
        const content = getHeaderCellContent(grid, 0, 0);
        grid.appendChild(grid._columnTree[0][0]);
        flushGrid(grid);
        expect(getHeaderCellContent(grid, 0, 1)).to.equal(content);
      });

      it('should not create new cells', () => {
        const spy = sinon.spy(grid, '_createCell');
        grid.appendChild(grid._columnTree[0][0]);
        flushGrid(grid);
        expect(spy.called).to.be.false;
      });
    });

    describe('columns inside group', () => {
      let firstGroup;

      beforeEach(async () => {
        grid = fixtureSync(`
          <vaadin-grid size="10">
            <vaadin-grid-column-group header="first group header" footer="first group footer">
              <vaadin-grid-column header="first foo header" footer="first foo footer" prefix="first foo body"></vaadin-grid-column>
              <vaadin-grid-column header="first bar header" footer="first bar footer" prefix="first bar body"></vaadin-grid-column>
            </vaadin-grid-column-group>

            <vaadin-grid-column-group header="second group header" footer="second group footer">
              <vaadin-grid-column header="second foo header" footer="second foo footer" prefix="second foo body"></vaadin-grid-column>
              <vaadin-grid-column header="second bar header" footer="second bar footer" prefix="second bar body"></vaadin-grid-column>
            </vaadin-grid-column-group>
          </vaadin-grid>
        `);
        firstGroup = grid.querySelector('vaadin-grid-column-group');

        grid.querySelectorAll('vaadin-grid-column').forEach((column) => {
          column.renderer = attributeRenderer('prefix');
          column.footerRenderer = attributeRenderer('footer');
        });

        grid.querySelectorAll('vaadin-grid-column-group').forEach((group) => {
          group.footerRenderer = attributeRenderer('footer');
        });

        grid.dataProvider = infiniteDataProvider;
        await nextFrame();
      });

      it('should support adding late', async () => {
        const column = createColumn();
        firstGroup.insertBefore(column, firstGroup.firstChild);
        await nextFrame();
        expect(getHeaderCellContent(grid, 1, 0).textContent).to.equal('some header');
        expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('some body foo0');
        expect(getFooterCellContent(grid, 0, 0).textContent).to.equal('some footer');
      });

      it('should support removing late', async () => {
        const column = firstGroup.querySelector('vaadin-grid-column');
        firstGroup.removeChild(column);
        await nextFrame();
        expect(getHeaderCellContent(grid, 1, 0).textContent).to.equal('first bar header');
        expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('first bar body foo0');
        expect(getFooterCellContent(grid, 0, 0).textContent).to.equal('first bar footer');
      });

      it('should support adding group late', async () => {
        const group = createGroup();
        grid.insertBefore(group, grid.firstChild);

        await nextRender();
        flushGrid(grid);

        expect(getHeaderCellContent(grid, 0, 0).textContent).to.equal('some group header');
        expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('some foo body foo0');
        expect(getFooterCellContent(grid, 1, 0).textContent).to.equal('some group footer');
      });

      it('should support removing group late', async () => {
        const group = grid.querySelector('vaadin-grid-column-group');
        grid.removeChild(group);

        await nextRender();
        flushGrid(grid);

        expect(getHeaderCellContent(grid, 0, 0).textContent).to.equal('second group header');
        expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('second foo body foo0');
        expect(getFooterCellContent(grid, 1, 0).textContent).to.equal('second group footer');
      });
    });

    describe('groups inside group', () => {
      let firstGroup;

      beforeEach(async () => {
        grid = fixtureSync(`
          <vaadin-grid size="10">
            <vaadin-grid-column-group header="group header" footer="group footer">
              <vaadin-grid-column-group header="first nested group header" footer="first nested group footer">
                <vaadin-grid-column header="first foo header" footer="first foo footer" prefix="first foo body"></vaadin-grid-column>
                <vaadin-grid-column header="first bar header" footer="first bar footer" prefix="first bar body"></vaadin-grid-column>
              </vaadin-grid-column-group>

              <vaadin-grid-column-group header="second nested group header" footer="second nested group footer">
                <vaadin-grid-column header="second foo header" footer="second foo footer" prefix="second foo body"></vaadin-grid-column>
                <vaadin-grid-column header="second bar header" footer="second bar footer" prefix="second bar body"></vaadin-grid-column>
              </vaadin-grid-column-group>
            </vaadin-grid-column-group>
          </vaadin-grid>
        `);

        firstGroup = grid.querySelector('vaadin-grid-column-group');

        grid.querySelectorAll('vaadin-grid-column').forEach((column) => {
          column.renderer = attributeRenderer('prefix');
          column.footerRenderer = attributeRenderer('footer');
        });

        grid.querySelectorAll('vaadin-grid-column-group').forEach((group) => {
          group.footerRenderer = attributeRenderer('footer');
        });

        grid.dataProvider = infiniteDataProvider;
        await nextFrame();
      });

      it('should support adding late', async () => {
        const group = createGroup();
        firstGroup.insertBefore(group, firstGroup.firstChild);

        await nextRender();
        flushGrid(grid);

        expect(getHeaderCellContent(grid, 1, 0).textContent).to.equal('some group header');
        expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('some foo body foo0');
        expect(getFooterCellContent(grid, 1, 0).textContent).to.equal('some group footer');
      });

      it('should support removing late', async () => {
        const group = firstGroup.querySelector('vaadin-grid-column-group');
        firstGroup.removeChild(group);

        await nextRender();

        expect(getHeaderCellContent(grid, 1, 0).textContent).to.equal('second nested group header');
        expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('second foo body foo0');
        expect(getFooterCellContent(grid, 1, 0).textContent).to.equal('second nested group footer');
      });
    });
  });

  describe('effective children', () => {
    function shouldSupportEffectiveChildren(inGroup) {
      describe('children mutations', () => {
        describe('with columns', () => {
          beforeEach(() => {
            const slot = inGroup ? 'group' : 'grid';
            wrapper = fixtureSync(`
              <grid-wrapper>
                <vaadin-grid-column slot="${slot}" header="foo header" footer="foo footer" prefix="foo body"></vaadin-grid-column>
                <vaadin-grid-column slot="${slot}" header="bar header" footer="bar footer" prefix="bar body"></vaadin-grid-column>
              </grid-wrapper>
            `);

            wrapper.querySelectorAll('vaadin-grid-column').forEach((column) => {
              column.renderer = attributeRenderer('prefix');
              column.footerRenderer = attributeRenderer('footer');
            });

            grid = wrapper.$.grid;

            grid.dataProvider = infiniteDataProvider;
          });

          it('should provide initial state', async () => {
            await nextFrame();
            expect(getHeaderCellContent(grid, 1, 0).textContent).to.equal('foo header');
            expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('foo body foo0');
            expect(getFooterCellContent(grid, 0, 0).textContent).to.equal('foo footer');
            expectNumberOfColumns(grid, 3);
          });

          it('should support adding late', async () => {
            const column = createColumn();
            column.setAttribute('slot', inGroup ? 'group' : 'grid');
            wrapper.insertBefore(column, wrapper.firstChild);
            await nextFrame();
            flushGrid(grid);
            expect(getHeaderCellContent(grid, 1, 0).textContent).to.equal('some header');
            expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('some body foo0');
            expect(getFooterCellContent(grid, 0, 0).textContent).to.equal('some footer');
            expectNumberOfColumns(grid, 4);
          });

          it('should support removing late', async () => {
            const column = wrapper.querySelector('vaadin-grid-column');
            wrapper.removeChild(column);
            await nextFrame();
            flushGrid(grid);
            expect(getHeaderCellContent(grid, 1, 0).textContent).to.equal('bar header');
            expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('bar body foo0');
            expect(getFooterCellContent(grid, 0, 0).textContent).to.equal('bar footer');
            expectNumberOfColumns(grid, 2);
          });
        });

        describe('with groups', () => {
          beforeEach(async () => {
            const slot = inGroup ? 'group' : 'grid';
            wrapper = fixtureSync(`
              <grid-wrapper>
                <vaadin-grid-column-group header="first group header" footer="first group footer" slot="${slot}">
                  <vaadin-grid-column header="first foo header" footer="first foo footer" prefix="first foo body"></vaadin-grid-column>
                  <vaadin-grid-column header="first bar header" footer="first bar footer" prefix="first bar body"></vaadin-grid-column>
                </vaadin-grid-column-group>

                <vaadin-grid-column-group header="second group header" footer="second group footer" slot="${slot}">
                  <vaadin-grid-column header="second foo header" footer="second foo footer" prefix="second foo body"></vaadin-grid-column>
                  <vaadin-grid-column header="second bar header" footer="second bar footer" prefix="second bar body"></vaadin-grid-column>
                </vaadin-grid-column-group>
              </grid-wrapper>
            `);

            wrapper.querySelectorAll('vaadin-grid-column').forEach((column) => {
              column.renderer = attributeRenderer('prefix');
              column.footerRenderer = attributeRenderer('footer');
            });

            wrapper.querySelectorAll('vaadin-grid-column-group').forEach((group) => {
              group.footerRenderer = attributeRenderer('footer');
            });

            grid = wrapper.$.grid;

            grid.dataProvider = infiniteDataProvider;

            flushGrid(grid);
            await nextFrame();
          });

          it('should provide initial state', async () => {
            expect(getHeaderCellContent(grid, inGroup ? 2 : 1, 0).textContent).to.equal('first foo header');
            expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('first foo body foo0');
            expect(getFooterCellContent(grid, 0, 0).textContent).to.equal('first foo footer');
            expectNumberOfColumns(grid, 5);
          });

          it('should support adding late', async () => {
            const group = createGroup();
            group.setAttribute('slot', inGroup ? 'group' : 'grid');
            wrapper.insertBefore(group, wrapper.firstChild);
            await nextFrame();
            flushGrid(grid);
            expect(getHeaderCellContent(grid, inGroup ? 2 : 1, 0).textContent).to.equal('some foo header');
            expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('some foo body foo0');
            expect(getFooterCellContent(grid, 0, 0).textContent).to.equal('some foo footer');
            expectNumberOfColumns(grid, 7);
          });

          it('should support removing late', async () => {
            const firstGroup = wrapper.querySelector('vaadin-grid-column-group');
            wrapper.removeChild(firstGroup);
            await nextFrame();
            flushGrid(grid);
            expect(getHeaderCellContent(grid, inGroup ? 2 : 1, 0).textContent).to.equal('second foo header');
            expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('second foo body foo0');
            expect(getFooterCellContent(grid, 0, 0).textContent).to.equal('second foo footer');
            expectNumberOfColumns(grid, 3);
          });

          describe('nested group mutations', () => {
            let firstGroup;

            beforeEach(() => {
              firstGroup = wrapper.querySelector('vaadin-grid-column-group');
            });

            describe('with columns', () => {
              it('should support adding late', async () => {
                const column = createColumn();
                firstGroup.insertBefore(column, firstGroup.firstChild);
                await nextFrame();
                expect(getHeaderCellContent(grid, inGroup ? 2 : 1, 0).textContent).to.equal('some header');
                expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('some body foo0');
                expect(getFooterCellContent(grid, 0, 0).textContent).to.equal('some footer');
                expectNumberOfColumns(grid, 6);
              });

              it('should support removing late', async () => {
                const column = firstGroup.querySelector('vaadin-grid-column');
                firstGroup.removeChild(column);
                await nextFrame();
                expect(getHeaderCellContent(grid, inGroup ? 2 : 1, 0).textContent).to.equal('first bar header');
                expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('first bar body foo0');
                expect(getFooterCellContent(grid, 0, 0).textContent).to.equal('first bar footer');
                expectNumberOfColumns(grid, 4);
              });
            });

            describe('with groups', () => {
              it('should support adding late', async () => {
                const group = createGroup();
                firstGroup.insertBefore(group, firstGroup.firstChild);
                await nextFrame();
                expect(getHeaderCellContent(grid, inGroup ? 3 : 2, 0).textContent).to.equal('some foo header');
                expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('some foo body foo0');
                expect(getFooterCellContent(grid, 0, 0).textContent).to.equal('some foo footer');
                expectNumberOfColumns(grid, 7);
              });

              it('should support removing late', async () => {
                const group = createGroup();
                firstGroup.insertBefore(group, firstGroup.firstChild);
                await nextFrame();
                expectNumberOfColumns(grid, 7);
                group.remove();
                await nextFrame();
                expect(getHeaderCellContent(grid, inGroup ? 2 : 1, 0).textContent).to.equal('first foo header');
                expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('first foo body foo0');
                expect(getFooterCellContent(grid, 0, 0).textContent).to.equal('first foo footer');
                expectNumberOfColumns(grid, 5);
              });
            });
          });
        });
      });
    }

    describe('of grid', () => shouldSupportEffectiveChildren(false));

    describe('of group', () => shouldSupportEffectiveChildren(true));
  });
});
