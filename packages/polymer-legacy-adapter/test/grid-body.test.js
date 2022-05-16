import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/grid';
import '../template-renderer.js';
import './fixtures/mock-grid-host.js';
import { GridTemplatizer } from '../src/template-renderer-grid-templatizer.js';

describe('grid body template', () => {
  function fixtureGrid() {
    return fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column>
          <template></template>
        </vaadin-grid-column>
      </vaadin-grid>
    `);
  }

  it('should process the template', () => {
    const grid = fixtureGrid();
    const template = grid.querySelector('template');

    expect(template.__templatizer).to.be.an.instanceof(GridTemplatizer);
  });

  it('should throw when using both a template and a renderer', () => {
    const stub = sinon.stub(window.Vaadin, 'templateRendererCallback');
    const grid = fixtureGrid();
    const column = grid.firstElementChild;
    stub.restore();

    column.renderer = () => {};

    expect(() => window.Vaadin.templateRendererCallback(column)).to.throw(
      /^Cannot use both a template and a renderer for <vaadin-grid-column \/>\.$/,
    );
  });
});

describe('grid body template', () => {
  let host, grid;

  function getCell({ row, col }) {
    const items = grid.$.items.children;

    return items[row].querySelectorAll('[part~="cell"]')[col];
  }

  function queryCellContent({ row, col }, selector) {
    return getCell({ row, col })._content.querySelector(selector);
  }

  beforeEach(async () => {
    host = fixtureSync(`<mock-grid-host></mock-grid-host>`);
    grid = host.$.grid;

    await nextRender(grid);
  });

  it('should render parentProperty', () => {
    const parentProperty0 = queryCellContent({ row: 0, col: 1 }, 'div.parent-property');
    const parentProperty1 = queryCellContent({ row: 1, col: 1 }, 'div.parent-property');

    expect(parentProperty0.textContent).to.equal('parentValue');
    expect(parentProperty1.textContent).to.equal('parentValue');
  });

  it('should render model.index', () => {
    const index0 = queryCellContent({ row: 0, col: 1 }, 'div.index');
    const index1 = queryCellContent({ row: 1, col: 1 }, 'div.index');

    expect(index0.textContent).to.equal('0');
    expect(index1.textContent).to.equal('1');
  });

  it('should render model.selected', () => {
    const selected0 = queryCellContent({ row: 0, col: 1 }, 'div.selected');
    const selected1 = queryCellContent({ row: 1, col: 1 }, 'div.selected');

    expect(selected0.textContent).to.equal('false');
    expect(selected1.textContent).to.equal('false');
  });

  it('should render model.expanded', () => {
    const expanded0 = queryCellContent({ row: 0, col: 1 }, 'div.expanded');
    const expanded1 = queryCellContent({ row: 1, col: 1 }, 'div.expanded');

    expect(expanded0.textContent).to.equal('false');
    expect(expanded1.textContent).to.equal('false');
  });

  it('should render model.detailsOpened', () => {
    const detailsOpened0 = queryCellContent({ row: 0, col: 1 }, 'div.details-opened');
    const detailsOpened1 = queryCellContent({ row: 1, col: 1 }, 'div.details-opened');

    expect(detailsOpened0.textContent).to.equal('false');
    expect(detailsOpened1.textContent).to.equal('false');
  });

  it('should render model.item.title', () => {
    const title0 = queryCellContent({ row: 0, col: 1 }, 'div.title');
    const title1 = queryCellContent({ row: 1, col: 1 }, 'div.title');

    expect(title0.textContent).to.equal('item0');
    expect(title1.textContent).to.equal('item1');
  });

  describe('changing parentProperty', () => {
    beforeEach(() => {
      const input = queryCellContent({ row: 0, col: 0 }, 'input.parent-property');

      input.value = 'new';
      fire(input, 'input');
    });

    it('should update the host property', () => {
      expect(host.parentProperty).to.equal('new');
    });

    it('should re-render the property in other rows', () => {
      const parentProperty0 = queryCellContent({ row: 0, col: 1 }, 'div.parent-property');
      const parentProperty1 = queryCellContent({ row: 1, col: 1 }, 'div.parent-property');

      expect(parentProperty0.textContent).to.equal('new');
      expect(parentProperty1.textContent).to.equal('new');
    });
  });

  describe('changing model.item.title', () => {
    beforeEach(() => {
      const input = queryCellContent({ row: 0, col: 0 }, 'input.title');

      input.value = 'new0';
      fire(input, 'input');
    });

    it('should update the grid items', () => {
      expect(grid.items[0].title).to.equal('new0');
      expect(grid.items[1].title).to.equal('item1');
    });

    it('should re-render the row', () => {
      const title0 = queryCellContent({ row: 0, col: 1 }, 'div.title');
      const title1 = queryCellContent({ row: 1, col: 1 }, 'div.title');

      expect(title0.textContent).to.equal('new0');
      expect(title1.textContent).to.equal('item1');
    });
  });

  describe('changing model.expanded', () => {
    let checkbox, expanded0, expanded1;

    beforeEach(() => {
      // Expanding items only works with custom data providers.
      grid.dataProvider = (params, cb) => {
        const items = [
          { title: 'item1', hasChildren: true },
          { title: 'item2', hasChildren: true },
        ];

        cb(items, 1);
      };

      checkbox = getCell({ row: 0, col: 0 })._content.querySelector('vaadin-checkbox.expanded');
      expanded0 = getCell({ row: 0, col: 1 })._content.querySelector('div.expanded');
      expanded1 = getCell({ row: 1, col: 1 })._content.querySelector('div.expanded');
    });

    beforeEach(() => {
      checkbox.checked = true;
    });

    it('should expand the item when checking', () => {
      expect(grid._isExpanded(grid._cache.items[0])).to.be.true;
      expect(grid._isExpanded(grid._cache.items[1])).to.be.false;
    });

    it('should re-render the row when checking', () => {
      expect(expanded0.textContent).to.equal('true');
      expect(expanded1.textContent).to.equal('false');
    });

    it('should collapse the item when unchecking', () => {
      checkbox.checked = false;

      expect(grid._isExpanded(grid._cache.items[0])).to.be.false;
      expect(grid._isExpanded(grid._cache.items[1])).to.be.false;
    });

    it('should re-render the row when unchecking', () => {
      checkbox.checked = false;

      expect(expanded0.textContent).to.equal('false');
      expect(expanded1.textContent).to.equal('false');
    });
  });

  describe('changing model.selected', () => {
    let checkbox, selected0, selected1;

    beforeEach(() => {
      checkbox = queryCellContent({ row: 0, col: 0 }, 'vaadin-checkbox.selected');
      selected0 = queryCellContent({ row: 0, col: 1 }, 'div.selected');
      selected1 = queryCellContent({ row: 1, col: 1 }, 'div.selected');
    });

    beforeEach(() => {
      checkbox.checked = true;
    });

    it('should select the item when checking', () => {
      expect(grid._isSelected(grid.items[0])).to.be.true;
      expect(grid._isSelected(grid.items[1])).to.be.false;
    });

    it('should re-render the row when checking', () => {
      expect(selected0.textContent).to.equal('true');
      expect(selected1.textContent).to.equal('false');
    });

    it('should deselect the item when unchecking', () => {
      checkbox.checked = false;

      expect(grid._isSelected(grid.items[0])).to.be.false;
      expect(grid._isSelected(grid.items[1])).to.be.false;
    });

    it('should re-render the row when unchecking', () => {
      checkbox.checked = false;

      expect(selected0.textContent).to.equal('false');
      expect(selected1.textContent).to.equal('false');
    });
  });

  describe('changing model.detailsOpened', () => {
    let checkbox, detailsOpened0, detailsOpened1;

    beforeEach(() => {
      checkbox = queryCellContent({ row: 0, col: 0 }, 'vaadin-checkbox.details-opened');
      detailsOpened0 = queryCellContent({ row: 0, col: 1 }, 'div.details-opened');
      detailsOpened1 = queryCellContent({ row: 1, col: 1 }, 'div.details-opened');
    });

    beforeEach(() => {
      checkbox.checked = true;
    });

    it('should open the details when checking', () => {
      expect(grid._isDetailsOpened(grid.items[0])).to.be.true;
      expect(grid._isDetailsOpened(grid.items[1])).to.be.false;
    });

    it('should re-render the row when checking', () => {
      expect(detailsOpened0.textContent).to.equal('true');
      expect(detailsOpened1.textContent).to.equal('false');
    });

    it('should close the details when unchecking', () => {
      checkbox.checked = false;

      expect(grid._isDetailsOpened(grid.items[0])).to.be.false;
      expect(grid._isDetailsOpened(grid.items[1])).to.be.false;
    });

    it('should re-render the row when unchecking', () => {
      checkbox.checked = false;

      expect(detailsOpened0.textContent).to.equal('false');
      expect(detailsOpened1.textContent).to.equal('false');
    });
  });
});
