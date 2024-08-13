import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-dashboard.js';
import type { CustomElementType } from '@vaadin/component-base/src/define.js';
import type { Dashboard } from '../vaadin-dashboard.js';

describe('dashboard', () => {
  let dashboard: Dashboard;

  beforeEach(() => {
    dashboard = fixtureSync('<vaadin-dashboard></vaadin-dashboard>');
  });

  describe('custom element definition', () => {
    let tagName: string;

    beforeEach(() => {
      tagName = dashboard.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect((customElements.get(tagName) as CustomElementType).is).to.equal(tagName);
    });
  });
});
