import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-tooltip.js';

describe('vaadin-tooltip', () => {
  let tooltip, overlay;

  beforeEach(() => {
    tooltip = fixtureSync('<vaadin-tooltip></vaadin-tooltip>');
    overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = tooltip.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('overlay', () => {
    it('should not have tabindex on the overlay part', () => {
      expect(overlay.$.overlay.hasAttribute('tabindex')).to.be.false;
    });

    it('should propagate theme attribute to overlay', () => {
      tooltip.setAttribute('theme', 'foo');
      expect(overlay.getAttribute('theme')).to.equal('foo');
    });
  });

  describe('target', () => {
    let target;

    beforeEach(() => {
      target = document.createElement('div');
      target.textContent = 'Target';
      document.body.appendChild(target);
    });

    afterEach(() => {
      document.body.removeChild(target);
    });

    it('should set target as overlay positionTarget', () => {
      tooltip.target = target;
      expect(overlay.positionTarget).to.eql(target);
    });

    it('should set aria-describedby on the target element', () => {
      tooltip.target = target;
      expect(target.getAttribute('aria-describedby')).to.equal(overlay.id);
    });

    it('should retain existing aria-describedby attribute', () => {
      target.setAttribute('aria-describedby', 'foo');
      tooltip.target = target;

      expect(target.getAttribute('aria-describedby')).to.contain('foo');
      expect(target.getAttribute('aria-describedby')).to.contain(overlay.id);
    });

    it('should restore aria-describedby when clearing target', () => {
      target.setAttribute('aria-describedby', 'foo');
      tooltip.target = target;

      tooltip.target = null;
      expect(target.getAttribute('aria-describedby')).to.equal('foo');
    });
  });

  describe('for', () => {
    let target;

    beforeEach(() => {
      target = document.createElement('div');
      target.textContent = 'Target';
      document.body.appendChild(target);
    });

    afterEach(() => {
      document.body.removeChild(target);
    });

    describe('element found', () => {
      it('should use for attribute to link target using ID', () => {
        target.setAttribute('id', 'foo');
        tooltip.for = 'foo';
        expect(tooltip.target).to.eql(target);
      });
    });

    describe('element not found', () => {
      beforeEach(() => {
        sinon.stub(console, 'warn');
      });

      afterEach(() => {
        console.warn.restore();
      });

      it('should warn when element with given ID is not found', () => {
        tooltip.for = 'bar';
        expect(console.warn.called).to.be.true;
      });

      it('should keep the target when providing incorrect for', () => {
        tooltip.target = target;
        tooltip.for = 'bar';
        expect(tooltip.target).to.eql(target);
      });
    });
  });
});
