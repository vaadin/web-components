import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
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
    overlay = dialog.$.overlay;
    dialog.opened = true;
    await oneEvent(overlay, 'vaadin-overlay-open');
  });

  it('host', async () => {
    await expect(dialog).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('shadow', async () => {
    await expect(dialog).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('theme', async () => {
    dialog.setAttribute('theme', 'custom');
    await nextUpdate(dialog);
    await expect(dialog).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('overlay', async () => {
    await expect(overlay).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });
});
