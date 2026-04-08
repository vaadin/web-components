import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-breadcrumb.js';

describe('vaadin-breadcrumb', () => {
  let element;

  beforeEach(() => {
    element = fixtureSync('<vaadin-breadcrumb>Label</vaadin-breadcrumb>');
  });

  describe('host', () => {
    it('default', async () => {
      await expect(element).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      element.disabled = true;
      await expect(element).dom.to.equalSnapshot();
    });

    it('focused', async () => {
      element.focus({ focusVisible: false });
      await expect(element).dom.to.equalSnapshot();
    });

    it('focus-ring', async () => {
      await sendKeys({ press: 'Tab' });
      await expect(element).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(element).shadowDom.to.equalSnapshot();
    });
  });
});
