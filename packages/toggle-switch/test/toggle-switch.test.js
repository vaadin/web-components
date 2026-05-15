import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-toggle-switch.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.toggleSwitchComponent = true;

describe('toggle-switch', () => {
  describe('custom element definition', () => {
    let toggleSwitch, tagName;

    beforeEach(() => {
      toggleSwitch = fixtureSync('<vaadin-toggle-switch></vaadin-toggle-switch>');
      tagName = toggleSwitch.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });
});
