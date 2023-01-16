import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '../../src/vaadin-confirm-dialog.js';

describe('vaadin-confirm-dialog', () => {
  let dialog, overlay;

  const SNAPSHOT_CONFIG = {
    // Some inline CSS styles related to the overlay's position
    // may slightly change depending on the environment, so ignore them.
    ignoreAttributes: ['style'],
  };

  beforeEach(async () => {
    dialog = fixtureSync(`
      <vaadin-confirm-dialog header="Unsaved changes">
        Do you want to save or discard the changes?
      </vaadin-confirm-dialog>
    `);
    await nextRender();
    overlay = dialog.$.dialog._overlayElement;
    dialog.opened = true;
    await oneEvent(overlay, 'vaadin-overlay-open');
  });

  it('overlay', async () => {
    await expect(overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('overlay theme', async () => {
    dialog.setAttribute('theme', 'custom');
    await expect(overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });
});
