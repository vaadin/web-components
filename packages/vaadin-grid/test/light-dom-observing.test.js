import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { aTimeout, fixtureSync, nextFrame } from '@open-wc/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-bind.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import {
  flushGrid,
  getCellContent,
  getHeaderCellContent,
  getRows,
  getRowCells,
  infiniteDataProvider,
  scrollToEnd
} from './helpers.js';
import '../vaadin-grid.js';
import '../vaadin-grid-column-group.js';
import '../vaadin-grid-selection-column.js';

class XBooleanToggle extends PolymerElement {
  static get template() {
    return html`[[value]]`;
  }

  static get properties() {
    return {
      value: { type: Boolean, notify: true }
    };
  }
}

customElements.define('x-boolean-toggle', XBooleanToggle);

class GridWrapper extends PolymerElement {
  static get template() {
    return html`
      <vaadin-grid id="grid" size="10">
        <slot name="grid"></slot>
        <vaadin-grid-column-group>
          <template class="header">wrapper group header</template>
          <template class="footer">wrapper group footer</template>
          <slot name="group"></slot>
          <vaadin-grid-column>
            <template class="header">wrapper column header</template>
            <template class="footer">wrapper column footer</template>
            <template>wrapper column body [[item.value]]</template>
          </vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `;
  }
}

customElements.define('grid-wrapper', GridWrapper);

const createColumn = () => {
  const column = document.createElement('vaadin-grid-column');
  column.innerHTML = `
    <template class="header">some header</template>
    <template class="footer">some footer</template>
    <template>some body [[item.value]]</template>
  `;
  return column;
};

const createGroup = () => {
  const group = document.createElement('vaadin-grid-column-group');
  group.innerHTML = `
    <template class="header">some group header</template>
    <template class="footer">some group footer</template>
    <vaadin-grid-column>
      <template class="header">some foo header</template>
      <template class="footer">some foo footer</template>
      <template>some foo body [[item.value]]</template>
    </vaadin-grid-column>
    <vaadin-grid-column>
      <template class="header">some bar header</template>
      <template class="footer">some bar footer</template>
      <template>some bar body [[item.value]]</template>
    </vaadin-grid-column>
  `;
  return group;
};

const fixtures = {
  columns: `
    <vaadin-grid size="10">
      <vaadin-grid-column>
        <template class="header">first header</template>
        <template class="footer">first footer</template>
        <template>first body [[item.value]]</template>
      </vaadin-grid-column>
      <vaadin-grid-column>
        <template class="header">second header</template>
        <template class="footer">second footer</template>
        <template>second body [[item.value]]</template>
      </vaadin-grid-column>
    </vaadin-grid>
  `,
  'plain-groups': `
    <vaadin-grid size="10">
      <vaadin-grid-column-group>
        <template class="header">first group header</template>
        <template class="footer">first group footer</template>
        <vaadin-grid-column>
          <template class="header">first foo header</template>
          <template class="footer">first foo footer</template>
          <template>first foo body [[item.value]]</template>
        </vaadin-grid-column>
        <vaadin-grid-column>
          <template class="header">first bar header</template>
          <template class="footer">first bar footer</template>
          <template>first bar body [[item.value]]</template>
        </vaadin-grid-column>
      </vaadin-grid-column-group>
      <vaadin-grid-column-group>
        <template class="header">second group header</template>
        <template class="footer">second group footer</template>
        <vaadin-grid-column>
          <template class="header">second foo header</template>
          <template class="footer">second foo footer</template>
          <template>second foo body [[item.value]]</template>
        </vaadin-grid-column>
        <vaadin-grid-column>
          <template class="header">second bar header</template>
          <template class="footer">second bar footer</template>
          <template>second bar body [[item.value]]</template>
        </vaadin-grid-column>
      </vaadin-grid-column-group>
    </vaadin-grid>
  `,
  'nested-groups': `
    <vaadin-grid size="10">
      <vaadin-grid-column-group>
        <template class="header">group header</template>
        <template class="footer">group footer</template>
        <vaadin-grid-column-group>
          <template class="header">first nested group header</template>
          <template class="footer">first nested group footer</template>
          <vaadin-grid-column>
            <template class="header">first foo header</template>
            <template class="footer">first foo footer</template>
            <template>first foo body [[item.value]]</template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template class="header">first bar header</template>
            <template class="footer">first bar footer</template>
            <template>first bar body [[item.value]]</template>
          </vaadin-grid-column>
        </vaadin-grid-column-group>
        <vaadin-grid-column-group>
          <template class="header">second nested group header</template>
          <template class="footer">second nested group footer</template>
          <vaadin-grid-column>
            <template class="header">second foo header</template>
            <template class="footer">second foo footer</template>
            <template>second foo body [[item.value]]</template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template class="header">second bar header</template>
            <template class="footer">second bar footer</template>
            <template>second bar body [[item.value]]</template>
          </vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid-column-group>
    </vaadin-grid>
  `,
  'dom-repeat-columns': `
    <vaadin-grid id="grid" size="10">
      <dom-repeat as="column">
        <template is="dom-repeat" as="column">
          <vaadin-grid-column>
            <template class="header">grid repeats column [[column]] header</template>
            <template class="footer">grid repeats column [[column]] footer</template>
            <template>grid repeats column [[column]] body [[item.value]]</template>
          </vaadin-grid-column>
        </template>
      </dom-repeat>
    </vaadin-grid>
  `,
  'dom-repeat-columns-in-group': `
    <vaadin-grid size="10">
      <vaadin-grid-column-group>
        <dom-repeat as="column">
          <template is="dom-repeat" as="column">
            <vaadin-grid-column>
              <template class="header">group repeats column [[column]] header</template>
              <template class="footer">group repeats column [[column]] footer</template>
              <template>group repeats column [[column]] body [[item.value]]</template>
            </vaadin-grid-column>
          </template>
        </dom-repeat>
      </vaadin-grid-column-group>
    </vaadin-grid>
  `,
  'dom-repeat-groups': `
    <vaadin-grid size="10">
      <dom-repeat as="column">
        <template is="dom-repeat" as="column">
          <vaadin-grid-column-group>
            <vaadin-grid-column>
              <template class="header">grid repeats group [[column]] header</template>
              <template class="footer">grid repeats group [[column]] footer</template>
              <template>grid repeats group [[column]] body [[item.value]]</template>
            </vaadin-grid-column>
          </vaadin-grid-column-group>
        </template>
      </dom-repeat>
    </vaadin-grid>
  `,
  'dom-repeat-groups-in-group': `
    <vaadin-grid size="10">
      <vaadin-grid-column-group>
        <dom-repeat as="column">
          <template is="dom-repeat" as="column">
            <vaadin-grid-column-group>
              <vaadin-grid-column>
                <template class="header">group repeats group [[column]] header</template>
                <template class="footer">group repeats group [[column]] footer</template>
                <template>group repeats group [[column]] body [[item.value]]</template>
              </vaadin-grid-column>
            </vaadin-grid-column-group>
          </template>
        </dom-repeat>
      </vaadin-grid-column-group>
    </vaadin-grid>
  `,
  'dom-repeat-columns-detailed': `
    <dom-bind>
      <template>
        <vaadin-grid id="grid" size="10">
          <template class="row-details">
            <div class="details">grid repeats column with detail detail [[item.value]]</div>
          </template>
          <vaadin-grid-column frozen width="20px">
            <template><x-boolean-toggle value="{{detailsOpened}}"></x-boolean-toggle></template>
            <template class="header">detail toggle</template>
          </vaadin-grid-column>
          <dom-repeat as="column">
            <template is="dom-repeat" as="column">
              <vaadin-grid-column>
                <template class="header">grid repeats column with detail [[column]] header</template>
                <template>grid repeats column with detail [[column]] body [[item.value]]</template>
              </vaadin-grid-column>
            </template>
          </dom-repeat>
        </vaadin-grid>
      </template>
    </dom-bind>
  `,
  'effective-children-columns': `
    <grid-wrapper>
      <vaadin-grid-column>
        <template class="header">foo header</template>
        <template class="footer">foo footer</template>
        <template>foo body [[item.value]]</template>
      </vaadin-grid-column>
      <vaadin-grid-column>
        <template class="header">bar header</template>
        <template class="footer">bar footer</template>
        <template>bar body [[item.value]]</template>
      </vaadin-grid-column>
    </grid-wrapper>
  `,
  'effective-children-groups': `
    <grid-wrapper>
      <vaadin-grid-column-group>
        <template class="header">first group header</template>
        <template class="footer">first group footer</template>
        <vaadin-grid-column>
          <template class="header">first foo header</template>
          <template class="footer">first foo footer</template>
          <template>first foo body [[item.value]]</template>
        </vaadin-grid-column>
        <vaadin-grid-column>
          <template class="header">first bar header</template>
          <template class="footer">first bar footer</template>
          <template>first bar body [[item.value]]</template>
        </vaadin-grid-column>
      </vaadin-grid-column-group>
      <vaadin-grid-column-group>
        <template class="header">second group header</template>
        <template class="footer">second group footer</template>
        <vaadin-grid-column>
          <template class="header">second foo header</template>
          <template class="footer">second foo footer</template>
          <template>second foo body [[item.value]]</template>
        </vaadin-grid-column>
        <vaadin-grid-column>
          <template class="header">second bar header</template>
          <template class="footer">second bar footer</template>
          <template>second bar body [[item.value]]</template>
        </vaadin-grid-column>
      </vaadin-grid-column-group>
    </grid-wrapper>
  `
};

describe('light dom observing', () => {
  let wrapper, grid, header, body, footer, repeater;

  function init(fixtureName, options) {
    grid = fixtureSync(fixtures[fixtureName]);

    if (grid.$.grid) {
      // unwrap the <grid-wrapper>
      wrapper = grid;
      grid = grid.$.grid || grid;
    }

    repeater = grid.querySelector('dom-repeat');
    if (repeater) {
      repeater.items = options.columns;
    }

    // Assign the slot to the <grid-wrapper> children.
    if (wrapper) {
      Array.from(wrapper.children).forEach((wrapperChild) =>
        wrapperChild.setAttribute('slot', options && options.inGroup ? 'group' : 'grid')
      );
    }

    header = grid.$.header;
    body = grid.$.items;
    footer = grid.$.footer;

    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
  }

  function expectFirstColumnHeader(columnName, level) {
    level = level || 0;
    expect(getCellContent(getRows(header)[level].cells[0]).textContent).to.contain(columnName + ' header');
  }

  function expectFirstColumnFooter(columnName, level) {
    level = level || 0;
    const lastLevel = getRows(header).length - 1;
    expect(getCellContent(getRows(footer)[lastLevel - level].cells[0]).textContent).to.contain(columnName + ' footer');
  }

  function expectFirstColumnBody(columnName) {
    expect(getCellContent(getRows(body)[0].cells[0]).textContent).to.contain(columnName + ' body foo0');
    expect(getCellContent(getRows(body)[1].cells[0]).textContent).to.contain(columnName + ' body foo1');
    expect(getCellContent(getRows(body)[2].cells[0]).textContent).to.contain(columnName + ' body foo2');
  }

  function expectFirstColumn(columnName, level) {
    expectFirstColumnHeader(columnName, level);
    expectFirstColumnFooter(columnName, level);
    expectFirstColumnBody(columnName);
  }

  function expectNumberOfColumns(number) {
    const lastLevel = getRows(header).length - 1;
    expect(getRows(header)[lastLevel].cells.length).to.be.equal(number);
    expect(getRows(body)[0].cells.length).to.be.equal(number);
    expect(getRows(footer)[0].cells.length).to.be.equal(number);
  }

  describe('generic operations', () => {
    describe('columns inside grid', () => {
      beforeEach(async () => {
        init('columns');
        flushGrid(grid);
        await nextFrame();
      });

      it('should support adding late', () => {
        const column = createColumn();
        grid.insertBefore(column, grid.firstChild);
        flushGrid(grid);
        expectFirstColumn('some');
      });

      it('should support adding selection column late', () => {
        const column = document.createElement('vaadin-grid-selection-column');
        column.innerHTML = `
          <template class="header">some header</template>
          <template>some body [[item.value]]</template>
          <template class="footer">some footer</template>
        `;
        grid.insertBefore(column, grid.firstChild);
        flushGrid(grid);
        expectFirstColumn('some');
      });

      it('should support removing late', () => {
        const column = grid.querySelector('vaadin-grid-column');
        grid.removeChild(column);
        flushGrid(grid);
        expectFirstColumn('second');
      });

      it('should invoke node observer twice when removing columns', async () => {
        const column = grid.querySelector('vaadin-grid-column');
        const spy = sinon.spy(grid._observer, 'callback');
        grid.removeChild(column);
        flushGrid(grid);
        await nextFrame();
        // Once for the column and in effect of that, once for the removed cell content elements
        expect(spy.callCount).to.gte(2);
      });

      it('should invoke node observer twice when adding columns', async () => {
        const column = createColumn();
        const spy = sinon.spy(grid._observer, 'callback');
        grid.insertBefore(column, grid.firstChild);
        flushGrid(grid);
        await nextFrame();
        // Once for the column and in effect of that, once for the added cell content elements
        expect(spy.callCount).to.gte(2);
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
        init('plain-groups');
        firstGroup = grid.querySelector('vaadin-grid-column-group');
        await nextFrame();
      });

      it('should support adding late', async () => {
        const column = createColumn();
        firstGroup.insertBefore(column, firstGroup.firstChild);
        await nextFrame();
        expectFirstColumn('some', 1);
      });

      it('should support removing late', async () => {
        const column = firstGroup.querySelector('vaadin-grid-column');
        firstGroup.removeChild(column);
        await nextFrame();
        expectFirstColumn('first bar', 1);
      });
    });

    describe('groups inside grid', () => {
      beforeEach(() => {
        init('plain-groups');
      });

      it('should support adding late', async () => {
        const group = createGroup();
        grid.insertBefore(group, grid.firstChild);
        flushGrid(grid);
        await nextFrame();
        expectFirstColumnHeader('some group', 0);
        expectFirstColumnFooter('some group', 0);
        expectFirstColumn('some foo', 1);
      });

      it('should support removing late', async () => {
        const group = grid.querySelector('vaadin-grid-column-group');
        grid.removeChild(group);
        flushGrid(grid);
        await nextFrame();
        expectFirstColumnHeader('second group', 0);
        expectFirstColumnFooter('second group', 0);
        expectFirstColumn('second foo', 1);
      });
    });

    describe('groups inside group', () => {
      let firstGroup;

      beforeEach(() => {
        init('nested-groups');
        firstGroup = grid.querySelector('vaadin-grid-column-group');
      });

      it('should support adding late', async () => {
        const group = createGroup();
        firstGroup.insertBefore(group, firstGroup.firstChild);

        flushGrid(grid);
        await nextFrame();

        expectFirstColumnHeader('some group', 1);
        expectFirstColumnFooter('some group', 1);
        expectFirstColumn('some foo', 2);
      });

      it('should support removing late', async () => {
        const group = firstGroup.querySelector('vaadin-grid-column-group');
        firstGroup.removeChild(group);
        await nextFrame();
        expectFirstColumnHeader('second nested group', 1);
        expectFirstColumnFooter('second nested group', 1);
        expectFirstColumn('second foo', 2);
      });
    });
  });

  function shouldSupportDomRepeat(prefix, columnsLevel) {
    it('should provide initial state', async () => {
      repeater.render();
      await nextFrame();
      expectFirstColumn(prefix + ' a', columnsLevel);
      expectFirstColumn('', columnsLevel);
      expectNumberOfColumns(3);
    });

    it('should add columns late', async () => {
      repeater.unshift('items', 'd');
      repeater.render();
      await nextFrame();
      expectFirstColumn(prefix + ' d', columnsLevel);
      expectFirstColumn('', columnsLevel);
      expectNumberOfColumns(4);
    });

    it('should remove columns late', async () => {
      repeater.shift('items');
      repeater.render();
      await nextFrame();
      expectFirstColumn(prefix + ' b', columnsLevel);
      expectFirstColumn('', columnsLevel);
      expectNumberOfColumns(2);
    });

    it('should remove cell content', async () => {
      const contentCount = grid.querySelectorAll('vaadin-grid-cell-content').length;
      repeater.shift('items');
      repeater.render();
      flushGrid(grid);
      await nextFrame();
      await aTimeout(0);
      expect(grid.querySelectorAll('vaadin-grid-cell-content').length).to.be.below(contentCount);
    });
  }

  describe('dom-repeat', () => {
    let columns;

    beforeEach(() => {
      columns = 'a b c'.split(' ');
    });

    describe('columns inside grid', () => {
      beforeEach(() => {
        init('dom-repeat-columns', { columns: columns });
      });

      shouldSupportDomRepeat('grid repeats column');
    });

    describe('columns inside group', () => {
      beforeEach(() => {
        init('dom-repeat-columns-in-group', { columns: columns });
      });

      shouldSupportDomRepeat('group repeats column', 1);
    });

    describe('groups inside grid', () => {
      beforeEach(() => {
        init('dom-repeat-groups', { columns: columns });
      });

      shouldSupportDomRepeat('grid repeats group', 1);
    });

    describe('groups inside group', () => {
      beforeEach(() => {
        init('dom-repeat-groups-in-group', { columns: columns });
      });

      shouldSupportDomRepeat('group repeats group', 2);
    });

    describe('with row detail', () => {
      beforeEach(() => {
        init('dom-repeat-columns-detailed', { columns: columns });
      });

      it('should obey the "detailsOpened" template property', async () => {
        repeater.render();
        await nextFrame();
        const row = getRows(grid.$.items)[0];
        const cell = getRowCells(row)[0];
        const toggle = getCellContent(cell).children[0];
        // open row details
        toggle.value = true;
        expect(grid.detailsOpenedItems).to.contain(row._item);
      });
    });
  });

  describe('effective children', () => {
    function shouldSupportEffectiveChildren(inGroup) {
      describe('children mutations', () => {
        describe('with columns', () => {
          beforeEach(() => {
            init('effective-children-columns', { inGroup: inGroup });
          });

          it('should provide initial state', async () => {
            await nextFrame();
            expectFirstColumn('foo', 1);
            expectNumberOfColumns(3);
          });

          it('should support adding late', async () => {
            const column = createColumn();
            column.setAttribute('slot', inGroup ? 'group' : 'grid');
            wrapper.insertBefore(column, wrapper.firstChild);
            await nextFrame();
            expectFirstColumn('some', 1);
            expectNumberOfColumns(4);
          });

          it('should support removing late', async () => {
            const column = wrapper.querySelector('vaadin-grid-column');
            wrapper.removeChild(column);
            await nextFrame();
            expectFirstColumn('bar', 1);
            expectNumberOfColumns(2);
          });
        });

        describe('with groups', () => {
          let firstGroup;

          beforeEach(() => {
            init('effective-children-groups', { inGroup: inGroup });
            firstGroup = wrapper.querySelector('vaadin-grid-column-group');
          });

          it('should provide initial state', async () => {
            await nextFrame();
            expectFirstColumn('first foo', inGroup ? 2 : 1);
            expectNumberOfColumns(5);
          });

          it('should support adding late', async () => {
            const group = createGroup();
            group.setAttribute('slot', inGroup ? 'group' : 'grid');
            wrapper.insertBefore(group, wrapper.firstChild);
            await nextFrame();
            expectFirstColumn('some foo', inGroup ? 2 : 1);
            expectNumberOfColumns(7);
          });

          it('should support removing late', async () => {
            wrapper.removeChild(firstGroup);
            await nextFrame();
            expectFirstColumn('second foo', inGroup ? 2 : 1);
            expectNumberOfColumns(3);
          });
        });
      });

      describe('nested group mutations', () => {
        let firstGroup;

        beforeEach(() => {
          init('effective-children-groups', { inGroup: inGroup });
          firstGroup = wrapper.querySelector('vaadin-grid-column-group');
        });

        describe('with columns', () => {
          it('should support adding late', async () => {
            const column = createColumn();
            firstGroup.insertBefore(column, firstGroup.firstChild);
            await nextFrame();
            expectFirstColumn('some', inGroup ? 2 : 1);
            expectNumberOfColumns(6);
          });

          it('should support removing late', async () => {
            const column = firstGroup.querySelector('vaadin-grid-column');
            firstGroup.removeChild(column);
            await nextFrame();
            expectFirstColumn('first bar', inGroup ? 2 : 1);
            expectNumberOfColumns(4);
          });
        });

        describe('with groups', () => {
          it('should support adding late', async () => {
            const group = createGroup();
            firstGroup.insertBefore(group, firstGroup.firstChild);
            await nextFrame();
            expectFirstColumn('some foo', inGroup ? 3 : 2);
            expectNumberOfColumns(7);
          });

          it('should support removing late', async () => {
            const group = createGroup();
            firstGroup.insertBefore(group, firstGroup.firstChild);
            await nextFrame();
            expectNumberOfColumns(7);
            firstGroup.removeChild(group);
            await nextFrame();
            expectFirstColumn('first foo', inGroup ? 2 : 1);
            expectNumberOfColumns(5);
          });
        });
      });
    }

    describe('of grid', () => shouldSupportEffectiveChildren(false));

    describe('of group', () => shouldSupportEffectiveChildren(true));
  });
});
