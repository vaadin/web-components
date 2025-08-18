import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import '../../src/vaadin-popover.js';

describe('vaadin-popover', () => {
  let popover, overlay;

  const SNAPSHOT_CONFIG = {
    // Some inline CSS styles related to the overlay's position
    // may slightly change depending on the environment, so ignore them.
    ignoreAttributes: ['style'],
  };

  beforeEach(async () => {
    popover = fixtureSync('<vaadin-popover>content</vaadin-popover>');
    await nextRender();
    overlay = popover.$.overlay;
    popover.opened = true;
    await oneEvent(overlay, 'vaadin-overlay-open');
  });

  it('host', async () => {
    await expect(popover).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('shadow', async () => {
    await expect(popover).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('modal host', async () => {
    popover.modal = true;
    await nextUpdate(popover);
    await expect(popover).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('modal shadow', async () => {
    popover.modal = true;
    await nextUpdate(popover);
    await expect(popover).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('theme', async () => {
    popover.setAttribute('theme', 'arrow');
    await nextUpdate(popover);
    await expect(popover).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('overlay', async () => {
    await expect(overlay).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('backdrop', async () => {
    popover.withBackdrop = true;
    await nextUpdate(popover);
    await expect(overlay).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });
});
