import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { Templatizer } from '../src/vaadin-template-renderer-templatizer.js';

import '../vaadin-template-renderer.js';

import './fixtures/mock-grid-host.js';

describe('grid header template', () => {
  let host, grid, headerCell;

  function getHeaderCell({ row, col }) {
    const header = grid.$.header.children;

    return header[row].querySelectorAll('[part~="cell"]')[col];
  }

  beforeEach(async () => {
    host = fixtureSync(`<mock-grid-host></mock-grid-host>`);
    grid = host.$.grid;

    await nextRender(grid);

    headerCell = getHeaderCell({ row: 0, col: 0 });
  });

  it('should process the template', () => {
    const template = grid.querySelector('template.header');

    expect(template.__templatizer).to.be.an.instanceof(Templatizer);
  });

  it('should render the template', () => {
    expect(headerCell._content.textContent).to.equal('header');
  });
});
