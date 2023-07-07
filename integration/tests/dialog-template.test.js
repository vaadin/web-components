import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '@vaadin/dialog';

describe('vaadin-dialog template', () => {
  let dialog, overlay;

  beforeEach(async () => {
    dialog = fixtureSync(`
      <vaadin-dialog>
        <template>foo</template>
      </vaadin-dialog>
    `);
    await nextRender();
    overlay = dialog.$.overlay;
  });

  it('should render the template', async () => {
    dialog.opened = true;
    await nextRender();
    expect(overlay.textContent).to.equal('foo');
  });
});
