import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import '../not-animated-styles.css';
import '../helpers.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import type { DropdownMenu } from '../../vaadin-dropdown-menu.js';

describe('vaadin-dropdown-menu', () => {
  let menu: DropdownMenu;

  const SNAPSHOT_CONFIG = {
    // Overlay position styles may slightly change depending on the environment.
    ignoreAttributes: ['style'],
  };

  beforeEach(async () => {
    resetUniqueId();
    menu = fixtureSync('<vaadin-dropdown-menu label="Actions"></vaadin-dropdown-menu>');
    await nextRender();
  });

  afterEach(() => {
    menu.close();
  });

  async function open() {
    const overlay = menu.shadowRoot!.querySelector('[id="overlay"]')!;
    const opened = oneEvent(overlay, 'vaadin-overlay-open');
    menu.querySelector<HTMLElement>(':scope > [slot="button"]')!.click();
    await opened;
  }

  describe('host', () => {
    it('default', async () => {
      await expect(menu).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      menu.disabled = true;
      await nextUpdate(menu);
      await expect(menu).dom.to.equalSnapshot();
    });

    it('opened with items', async () => {
      menu.items = [{ text: 'Item 1' }, { component: 'hr' }, { text: 'Item 2', disabled: true }];
      await open();
      await expect(menu).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(menu).shadowDom.to.equalSnapshot();
    });

    it('disabled', async () => {
      menu.disabled = true;
      await nextUpdate(menu);
      await expect(menu).shadowDom.to.equalSnapshot();
    });

    it('opened', async () => {
      menu.items = [{ text: 'Item 1' }];
      await open();
      await expect(menu).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });
  });

  describe('button', () => {
    it('default', async () => {
      const button = menu.querySelector(':scope > [slot="button"]')!;
      await expect(button).shadowDom.to.equalSnapshot();
    });
  });
});
