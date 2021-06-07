import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, enter } from '@vaadin/testing-helpers';
import { GridTemplatizer } from '../src/vaadin-template-renderer-grid-templatizer.js';

import '../vaadin-template-renderer.js';

import './fixtures/mock-grid-pro-host.js';

describe('grid editor template', () => {
  let host, grid;

  function getCell({ row, col }) {
    const items = grid.$.items.children;

    return items[row].querySelectorAll('[part~="cell"]')[col];
  }

  beforeEach(async () => {
    host = fixtureSync(`<mock-grid-pro-host></mock-grid-pro-host>`);
    grid = host.$.grid;

    await nextRender(grid);
  });

  it('should process the template', () => {
    const template = grid.querySelector('template.editor');

    expect(template.__templatizer).to.be.an.instanceof(GridTemplatizer);
  });

  describe('editing', () => {
    let cell0, cell1, input;

    beforeEach(() => {
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
});
