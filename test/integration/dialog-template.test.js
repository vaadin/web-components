import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
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
    await nextUpdate(dialog);
    overlay = dialog.$.overlay;
  });

  it('should render the template', async () => {
    dialog.opened = true;
    await oneEvent(overlay, 'vaadin-overlay-open');
    expect(overlay.textContent).to.equal('foo');
  });
});
