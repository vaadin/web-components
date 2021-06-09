import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { Templatizer } from '../src/vaadin-template-renderer-templatizer.js';

import '../vaadin-template-renderer.js';

import './fixtures/mock-grid-host.js';

describe('grid footer template', () => {
  let host, grid, footerCell;

  function getFooterCell({ row, col }) {
    const footer = grid.$.footer.children;

    return footer[row].querySelectorAll('[part~="cell"]')[col];
  }

  beforeEach(async () => {
    host = fixtureSync(`<mock-grid-host></mock-grid-host>`);
    grid = host.$.grid;

    await nextRender(grid);

    footerCell = getFooterCell({ row: 0, col: 0 });
  });

  it('should process the template', () => {
    const template = grid.querySelector('template.footer');

    expect(template.__templatizer).to.be.an.instanceof(Templatizer);
  });

  it('should render the template', () => {
    expect(footerCell._content.textContent).to.equal('footer');
  });
});
