import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-stepper.js';
import type { Stepper } from '../../src/vaadin-stepper.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.stepperComponent = true;

describe('vaadin-stepper', () => {
  let stepper: Stepper;

  beforeEach(async () => {
    stepper = fixtureSync('<vaadin-stepper></vaadin-stepper>');
    await nextUpdate(stepper);
  });

  describe('host', () => {
    it('default', async () => {
      await expect(stepper).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(stepper).shadowDom.to.equalSnapshot();
    });
  });
});
