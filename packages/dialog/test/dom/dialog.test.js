import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import '../../src/vaadin-dialog.js';

describe('vaadin-dialog', () => {
  let dialog, overlay;

  const SNAPSHOT_CONFIG = {
    // Some inline CSS styles related to the overlay's position
    // may slightly change depending on the environment, so ignore them.
    ignoreAttributes: ['style'],
  };

  beforeEach(async () => {
    dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
    await nextRender();
    overlay = dialog.$.overlay;
    dialog.renderer = (root) => {
      root.textContent = 'content';
    };
    dialog.opened = true;
    await oneEvent(overlay, 'vaadin-overlay-open');
  });

  it('host', async () => {
    await expect(dialog).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('overlay', async () => {
    await expect(overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('overlay modeless', async () => {
    dialog.modeless = true;
    await nextUpdate(dialog);
    await expect(overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('overlay theme', async () => {
    dialog.setAttribute('theme', 'custom');
    await nextUpdate(dialog);
    await expect(overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('overlay class', async () => {
    dialog.overlayClass = 'custom dialog-overlay';
    await nextUpdate(dialog);
    await expect(overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('overlay role', async () => {
    dialog.overlayRole = 'alertdialog';
    await nextUpdate(dialog);
    await expect(overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });
});
