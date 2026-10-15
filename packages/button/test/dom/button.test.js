import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown } from '@vaadin/testing-helpers';
import '../../src/vaadin-button.js';

describe('vaadin-button', () => {
  let button;

  beforeEach(() => {
    button = fixtureSync('<vaadin-button>Confirm</vaadin-button>');
  });

  describe('host', () => {
    it('default', async () => {
      await expect(button).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      button.tabIndex = 1;
      button.disabled = true;
      await expect(button).dom.to.equalSnapshot();
    });

    it('tabIndex', async () => {
      button.tabIndex = 1;
      await expect(button).dom.to.equalSnapshot();
    });

    it('tabindex', async () => {
      button.tabindex = 1;
      await expect(button).dom.to.equalSnapshot();
    });

    it('focused', async () => {
      button.focus({ focusVisible: false });
      await expect(button).dom.to.equalSnapshot();
    });

    it('focus-ring', async () => {
      await sendKeys({ press: 'Tab' });
      await expect(button).dom.to.equalSnapshot();
    });

    it('active', async () => {
      mousedown(button);
      await expect(button).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(button).shadowDom.to.equalSnapshot();
    });
  });
});
