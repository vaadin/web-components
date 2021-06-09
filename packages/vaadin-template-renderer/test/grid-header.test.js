import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '@vaadin/vaadin-grid';
import { Templatizer } from '../src/vaadin-template-renderer-templatizer.js';

import '../vaadin-template-renderer.js';

import './fixtures/mock-grid-host.js';

describe('grid header template', () => {
  function fixtureGrid() {
    return fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column>
          <template class="header">header</template>
        </vaadin-grid-column>
      </vaadin-grid>
    `);
  }

  it('should process the template', () => {
    const grid = fixtureGrid();
    const template = grid.querySelector('template.header');

    expect(template.__templatizer).to.be.an.instanceof(Templatizer);
  });

  it('should render the template', async () => {
    const grid = await fixtureGrid();
    const column = grid.firstElementChild;

    await nextRender(grid);

    expect(column._headerCell._content.textContent).to.equal('header');
  });

  it('should throw when using both a template and a renderer', () => {
    const stub = sinon.stub(window.Vaadin, 'templateRendererCallback');
    const grid = fixtureGrid();
    const column = grid.firstElementChild;
    stub.restore();

    column.headerRenderer = () => {};

    expect(() => window.Vaadin.templateRendererCallback(column)).to.throw(
      /^Cannot use both a template and a renderer for <vaadin-grid-column \/>\.$/
    );
  });
});
