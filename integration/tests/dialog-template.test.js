import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '@vaadin/dialog';

describe('vaadin-dialog template', () => {
  let dialog, overlay;

  beforeEach(() => {
    dialog = fixtureSync(`
      <vaadin-dialog>
        <template>foo</template>
      </vaadin-dialog>
    `);
    overlay = dialog.$.overlay;
  });

  it('should render the template', () => {
    dialog.opened = true;
    expect(overlay.textContent).to.equal('foo');
  });
});
