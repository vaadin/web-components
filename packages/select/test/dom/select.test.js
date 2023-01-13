import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import '../../src/vaadin-select.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-select', () => {
  let select;

  beforeEach(async () => {
    resetUniqueId();
    select = fixtureSync('<vaadin-select></vaadin-select>');
    select.items = [
      { label: 'Option 1', value: 'Option 1' },
      { label: 'Option 2', value: 'Option 2' },
    ];
    await nextFrame();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(select).dom.to.equalSnapshot();
    });

    it('label', async () => {
      select.label = 'Label';
      await expect(select).dom.to.equalSnapshot();
    });

    it('placeholder', async () => {
      select.placeholder = 'Placeholder';
      await expect(select).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      select.disabled = true;
      await expect(select).dom.to.equalSnapshot();
    });

    it('required', async () => {
      select.required = true;
      await expect(select).dom.to.equalSnapshot();
    });

    it('value', async () => {
      select.value = 'Option 1';
      await expect(select).dom.to.equalSnapshot();
    });

    it('helper', async () => {
      select.helperText = 'Helper';
      await expect(select).dom.to.equalSnapshot();
    });

    it('error', async () => {
      select.errorMessage = 'Error';
      select.invalid = true;
      await aTimeout(0);
      await expect(select).dom.to.equalSnapshot();
    });

    describe('opened', () => {
      let overlay;

      const SNAPSHOT_CONFIG = {
        // Some inline CSS styles related to the overlay's position
        // may slightly change depending on the environment, so ignore them.
        ignoreAttributes: ['style'],
      };

      beforeEach(async () => {
        overlay = select.shadowRoot.querySelector('vaadin-select-overlay');
        select.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
      });

      it('default', async () => {
        await expect(select).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
      });

      it('overlay', async () => {
        await expect(overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
      });

      it('overlay class', async () => {
        select.overlayClass = 'custom select-overlay';
        await expect(overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
      });
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(select).shadowDom.to.equalSnapshot();
    });

    it('disabled', async () => {
      select.disabled = true;
      await expect(select).shadowDom.to.equalSnapshot();
    });

    it('readonly', async () => {
      select.readonly = true;
      await expect(select).shadowDom.to.equalSnapshot();
    });

    it('invalid', async () => {
      select.invalid = true;
      await expect(select).shadowDom.to.equalSnapshot();
    });

    it('theme', async () => {
      select.setAttribute('theme', 'align-right');
      await expect(select).shadowDom.to.equalSnapshot();
    });
  });
});
