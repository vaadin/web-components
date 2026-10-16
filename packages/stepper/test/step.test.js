import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import './enable-feature-flag.js';
import '../vaadin-step.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';

describe('vaadin-step', () => {
  let step;

  beforeEach(async () => {
    step = fixtureSync('<vaadin-step>Step</vaadin-step>');
    await nextRender();
  });

  describe('role', () => {
    it('should set role attribute to listitem by default', () => {
      expect(step.getAttribute('role')).to.equal('listitem');
    });

    it('should not override custom role', async () => {
      step = fixtureSync('<vaadin-step role="presentation"></vaadin-step>');
      await nextRender();
      expect(step.getAttribute('role')).to.equal('presentation');
    });
  });

  describe('current', () => {
    it('should toggle aria-current attribute on current change', async () => {
      const nolink = step.shadowRoot.querySelector('[part="nolink"]');
      expect(nolink.hasAttribute('aria-current')).to.be.false;

      step.current = true;
      await nextUpdate(step);
      expect(nolink.getAttribute('aria-current')).to.equal('step');

      step.path = '/shipping';
      await nextUpdate(step);
      expect(step.shadowRoot.querySelector('a').getAttribute('aria-current')).to.equal('step');
    });
  });

  describe('link', () => {
    let link;

    beforeEach(async () => {
      step.path = '/shipping';
      await nextUpdate(step);
      link = step.shadowRoot.querySelector('a');
    });

    it('should focus the link on focus()', () => {
      step.focus();
      expect(getDeepActiveElement()).to.equal(link);
    });

    it('should remove href and tab stop when disabled', async () => {
      step.disabled = true;
      await nextUpdate(step);
      expect(link.hasAttribute('href')).to.be.false;
      expect(link.getAttribute('tabindex')).to.equal('-1');

      step.focus();
      expect(getDeepActiveElement()).to.not.equal(link);
    });
  });
});
