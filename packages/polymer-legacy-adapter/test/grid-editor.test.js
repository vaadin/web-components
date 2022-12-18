import { expect } from '@esm-bundle/chai';
import { enter, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/grid-pro';
import '../template-renderer.js';
import './fixtures/mock-grid-pro-host.js';
import { GridTemplatizer } from '../src/template-renderer-grid-templatizer.js';

describe('grid editor template', () => {
  function fixtureGrid() {
    return fixtureSync(`
      <vaadin-grid-pro>
        <vaadin-grid-pro-edit-column>
          <template class="editor"></template>
        </vaadin-grid-pro-edit-column>
      </vaadin-grid-pro>
    `);
  }

  it('should process the template', () => {
    const grid = fixtureGrid();
    const template = grid.querySelector('template.editor');

    expect(template.__templatizer).to.be.an.instanceof(GridTemplatizer);
  });

  it('should throw when using both a template and a renderer', () => {
    const stub = sinon.stub(window.Vaadin, 'templateRendererCallback');
    const grid = fixtureGrid();
    const column = grid.firstElementChild;
    stub.restore();

    column.editModeRenderer = () => {};

    expect(() => window.Vaadin.templateRendererCallback(column)).to.throw(
      /^Cannot use both a template and a renderer for <vaadin-grid-pro-edit-column \/>\.$/u,
    );
  });
});

describe('grid editor template', () => {
  let host, grid;
  let cell0, cell1, input;

  function getCell({ row, col }) {
    const items = grid.$.items.children;

    return items[row].querySelectorAll('[part~="cell"]')[col];
  }

  beforeEach(async () => {
    host = fixtureSync(`<mock-grid-pro-host></mock-grid-pro-host>`);
    grid = host.$.grid;

    await nextRender(grid);

    cell0 = getCell({ row: 0, col: 0 });
    cell1 = getCell({ row: 1, col: 0 });

    enter(cell0._content);

    input = cell0._content.querySelector('input');
  });

  it('should render the editor template', () => {
    expect(cell0._content.children).to.have.lengthOf(1);
    expect(cell0._content.children[0]).to.equal(input);
    expect(cell1._content.textContent).to.equal('item1');
  });

  it('should render the body template when finishing editing', () => {
    enter(cell0._content);

    expect(cell0._content.children[0]).not.to.equal(input);
    expect(cell0._content.textContent).to.equal('item0');
    expect(cell1._content.textContent).to.equal('item1');
  });

  it('should re-render the body template after changing the value', () => {
    input.value = 'new0';

    enter(cell0._content);

    expect(cell0._content.children[0]).not.to.equal(input);
    expect(cell0._content.textContent).to.equal('new0');
    expect(cell1._content.textContent).to.equal('item1');
  });
});
