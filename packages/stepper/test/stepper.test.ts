import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-stepper.js';
import type { Stepper } from '../src/vaadin-stepper.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.stepperComponent = true;

describe('vaadin-stepper', () => {
  let stepper: Stepper;

  describe('custom element definition', () => {
    let tagName: string;

    beforeEach(() => {
      stepper = fixtureSync('<vaadin-stepper></vaadin-stepper>');
      tagName = stepper.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect((customElements.get(tagName) as any).is).to.equal(tagName);
    });
  });

  describe('default', () => {
    beforeEach(async () => {
      stepper = fixtureSync('<vaadin-stepper></vaadin-stepper>');
      await nextRender();
    });

    it('should have a default slot', () => {
      const slot = stepper.shadowRoot!.querySelector('slot:not([name])');
      expect(slot).to.be.ok;
    });
  });
});
