import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/grid';
import '../template-renderer.js';
import './fixtures/mock-grid-host.js';
import { GridTemplatizer } from '../src/template-renderer-grid-templatizer.js';

describe('row details template', () => {
  function fixtureGrid() {
    return fixtureSync(`
      <vaadin-grid>
        <template class="row-details"></template>
      </vaadin-grid>
    `);
  }

  it('should process the template', () => {
    const grid = fixtureGrid();
    const template = grid.querySelector('template.row-details');

    expect(template.__templatizer).to.be.an.instanceof(GridTemplatizer);
  });

  it('should throw when using both a template and a renderer', () => {
    const stub = sinon.stub(window.Vaadin, 'templateRendererCallback');
    const grid = fixtureGrid();
    stub.restore();

    grid.rowDetailsRenderer = () => {};

    expect(() => window.Vaadin.templateRendererCallback(grid)).to.throw(
      /^Cannot use both a template and a renderer for <vaadin-grid \/>\.$/,
    );
  });
});

describe('row details template', () => {
  let host, grid;

  function getCell({ row, col }) {
    const items = grid.$.items.children;

    return items[row].querySelectorAll('[part~="cell"]')[col];
  }

  function queryDetailsCellContent(selector) {
    return getCell({ row: 0, col: 3 })._content.querySelector(selector);
  }

  beforeEach(async () => {
    host = fixtureSync(`<mock-grid-host></mock-grid-host>`);
    grid = host.$.grid;

    await nextRender(grid);

    grid.openItemDetails(grid.items[0]);
  });

  it('should render model.index', () => {
    const index = queryDetailsCellContent('div.index');

    expect(index.textContent).to.equal('0');
  });

  it('should render model.detailsOpened', () => {
    const checkbox = queryDetailsCellContent('vaadin-checkbox.details-opened');

    expect(checkbox.checked).to.equal(true);
  });

  it('should render model.selected', () => {
    const checkbox = queryDetailsCellContent('vaadin-checkbox.selected');

    expect(checkbox.checked).to.equal(false);
  });

  it('should render model.expanded', () => {
    const checkbox = queryDetailsCellContent('vaadin-checkbox.expanded');

    expect(checkbox.checked).to.equal(false);
  });

  it('should render model.item.title', () => {
    const input = queryDetailsCellContent('input.title');

    expect(input.value).to.equal('item0');
  });

  describe('changing model.detailsOpened', () => {
    let checkbox;

    beforeEach(() => {
      checkbox = queryDetailsCellContent('vaadin-checkbox.details-opened');
    });

    describe('upwards', () => {
      beforeEach(() => {
        checkbox.checked = false;
      });

      it('should close the details when unchecking the checkbox', () => {
        expect(grid._isDetailsOpened(grid.items[0])).to.be.false;
        expect(grid._isDetailsOpened(grid.items[1])).to.be.false;
      });
    });

    describe('downwards', () => {
      beforeEach(() => {
        grid.closeItemDetails(grid.items[0]);
      });

      it('should uncheck the checkbox when closing the details', () => {
        expect(checkbox.checked).to.equal(false);
      });

      it('should check the checkbox when opening the details', () => {
        grid.openItemDetails(grid.items[0]);

        expect(checkbox.checked).to.equal(true);
      });
    });
  });

  describe('changing model.expanded', () => {
    let checkbox;

    beforeEach(() => {
      checkbox = queryDetailsCellContent('vaadin-checkbox.expanded');

      // Expanding items only works with custom data providers.
      grid.dataProvider = (_params, cb) => {
        const items = [
          { title: 'item1', hasChildren: true },
          { title: 'item2', hasChildren: true },
        ];

        cb(items, 1);
      };
    });

    describe('upwards', () => {
      beforeEach(() => {
        checkbox.checked = true;
      });

      it('should expand the item when checking the checkbox', () => {
        expect(grid._isExpanded(grid._cache.items[0])).to.be.true;
        expect(grid._isExpanded(grid._cache.items[1])).to.be.false;
      });

      it('should collapse the item when unchecking the checkbox', () => {
        checkbox.checked = false;

        expect(grid._isExpanded(grid._cache.items[0])).to.be.false;
        expect(grid._isExpanded(grid._cache.items[1])).to.be.false;
      });
    });

    describe('downwards', () => {
      beforeEach(() => {
        grid.expandItem(grid._cache.items[0]);
      });

      it('should check the checkbox when expanding the item', () => {
        expect(checkbox.checked).to.equal(true);
      });

      it('should uncheck the checkbox when collapsing the item', () => {
        grid.collapseItem(grid._cache.items[0]);

        expect(checkbox.checked).to.equal(false);
      });
    });
  });

  describe('changing model.selected', () => {
    let checkbox;

    beforeEach(() => {
      checkbox = queryDetailsCellContent('vaadin-checkbox.selected');
    });

    describe('upwards', () => {
      beforeEach(() => {
        checkbox.checked = true;
      });

      it('should select the item when checking the checkbox', () => {
        expect(grid._isSelected(grid.items[0])).to.be.true;
        expect(grid._isSelected(grid.items[1])).to.be.false;
      });

      it('should deselect the item when unchecking the checkbox', () => {
        checkbox.checked = false;

        expect(grid._isSelected(grid.items[0])).to.be.false;
        expect(grid._isSelected(grid.items[1])).to.be.false;
      });
    });

    describe('downwards', () => {
      beforeEach(() => {
        grid.selectItem(grid.items[0]);
      });

      it('should check the checkbox when selecting the item', () => {
        expect(checkbox.checked).to.equal(true);
      });

      it('should uncheck the checkbox when deselecting the item', () => {
        grid.deselectItem(grid.items[0]);

        expect(checkbox.checked).to.equal(false);
      });
    });
  });

  describe('chaging model.item.title', () => {
    let input;

    beforeEach(() => {
      input = queryDetailsCellContent('input.title');
    });

    it('should update the grid item when changing upwards', () => {
      input.value = 'new0';
      fire(input, 'input');

      expect(grid.items[0].title).to.equal('new0');
      expect(grid.items[1].title).to.equal('item1');
    });

    it('should update the input value when changing downwards', () => {
      grid.items[0].title = 'new0';
      grid.notifyPath('items.0.title');

      expect(input.value).to.equal('new0');
    });
  });
});
