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

  describe('host', () => {
    it('default', async () => {
      await expect(dialog).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('headerTitle', async () => {
      dialog.headerTitle = 'Title';
      await nextUpdate(dialog);
      await expect(dialog).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('headerRenderer', async () => {
      dialog.headerRenderer = (root) => {
        root.textContent = 'Header';
      };
      await nextUpdate(dialog);
      await expect(dialog).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('footerRenderer', async () => {
      dialog.footerRenderer = (root) => {
        root.textContent = 'Footer';
      };
      await nextUpdate(dialog);
      await expect(dialog).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(dialog).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('modeless', async () => {
      dialog.modeless = true;
      await nextUpdate(dialog);
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
});
