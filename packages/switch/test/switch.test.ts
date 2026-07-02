import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-switch.js';
import type { Switch } from '../src/vaadin-switch.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.switchComponent = true;

describe('vaadin-switch', () => {
  let element: Switch;

  beforeEach(async () => {
    element = fixtureSync('<vaadin-switch></vaadin-switch>');
    await nextRender();
  });

  describe('custom element definition', () => {
    let tagName: string;

    beforeEach(() => {
      tagName = element.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect((customElements.get(tagName) as any).is).to.equal(tagName);
    });
  });
});
