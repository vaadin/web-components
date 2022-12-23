import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/grid';
import '../template-renderer.js';
import './fixtures/mock-grid-host.js';
import { Templatizer } from '../src/template-renderer-templatizer.js';

describe('grid footer template', () => {
  function fixtureGrid() {
    return fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column>
          <template class="footer">footer</template>
        </vaadin-grid-column>
      </vaadin-grid>
    `);
  }

  it('should process the template', () => {
    const grid = fixtureGrid();
    const template = grid.querySelector('template.footer');

    expect(template.__templatizer).to.be.an.instanceof(Templatizer);
  });

  it('should render the template', async () => {
    const grid = await fixtureGrid();
    const column = grid.firstElementChild;

    await nextRender(grid);

    expect(column._footerCell._content.textContent).to.equal('footer');
  });

  it('should throw when using both a template and a renderer', () => {
    const stub = sinon.stub(window.Vaadin, 'templateRendererCallback');
    const grid = fixtureGrid();
    const column = grid.firstElementChild;
    stub.restore();

    column.footerRenderer = () => {};

    expect(() => window.Vaadin.templateRendererCallback(column)).to.throw(
      /^Cannot use both a template and a renderer for <vaadin-grid-column \/>\.$/u,
    );
  });
});
