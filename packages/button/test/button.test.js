import { expect } from '@esm-bundle/chai';
import { sendKeys } from '@web/test-runner-commands';
import {
  arrowDownKeyDown,
  enterKeyDown,
  enterKeyUp,
  fixtureSync,
  isIOS,
  mousedown,
  mouseup,
  spaceKeyDown,
  spaceKeyUp,
  touchend,
  touchstart
} from '@vaadin/testing-helpers';
import '../vaadin-button.js';

describe('vaadin-button', () => {
  let element;

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      element = fixtureSync('<vaadin-button></vaadin-button>');
      tagName = element.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('role', () => {
    describe('default', () => {
      beforeEach(() => {
        element = fixtureSync('<vaadin-button>Press me</vaadin-button>');
      });

      it('should set role attribute to button by default', () => {
        expect(element.getAttribute('role')).to.equal('button');
      });
    });

    describe('custom', () => {
      beforeEach(() => {
        element = fixtureSync('<vaadin-button role="menuitem">Press me</vaadin-button>');
      });

      it('should not override custom role attribute', () => {
        expect(element.getAttribute('role')).to.equal('menuitem');
      });
    });
  });

  describe('mixins', () => {
    beforeEach(() => {
      element = fixtureSync('<vaadin-button>Press me</vaadin-button>');
    });

    // TODO: Remove when it would be possible for an element:
    // – to detect if it inherits DisabledMixin.
    // – or to run a suit of the tests defined in DisabledMixin.
    describe('DisabledMixin', () => {
      it('should set disabled property to false by default', () => {
        expect(element.disabled).to.be.false;
      });

      it('should reflect disabled property to attribute', () => {
        element.disabled = true;
        expect(element.hasAttribute('disabled')).to.be.true;
      });

      it('should set the aria-disabled attribute when disabled', () => {
        element.disabled = true;
        expect(element.getAttribute('aria-disabled')).to.equal('true');
      });
    });

    // TODO: Remove when it would be possible for an element:
    // – to detect if it inherits ActiveMixin.
    // – or to run a suit of the tests defined in ActiveMixin.
    describe('ActiveMixin', () => {
      (isIOS ? it.skip : it)('should have active attribute on mousedown', () => {
        mousedown(element);
        expect(element.hasAttribute('active')).to.be.true;
      });

      (isIOS ? it.skip : it)('should not have active attribute after mouseup', () => {
        mousedown(element);
        mouseup(element);
        expect(element.hasAttribute('active')).to.be.false;
      });

      it('should have active attribute on touchstart', () => {
        touchstart(element);
        expect(element.hasAttribute('active')).to.be.true;
      });

      it('should not have active attribute after touchend', () => {
        touchstart(element);
        touchend(element);
        expect(element.hasAttribute('active')).to.be.false;
      });

      it('should have active attribute on enter', () => {
        enterKeyDown(element);
        expect(element.hasAttribute('active')).to.be.true;
      });

      it('should not have active attribute after enter', () => {
        enterKeyDown(element);
        enterKeyUp(element);
        expect(element.hasAttribute('active')).to.be.false;
      });

      it('should have active attribute on space', () => {
        spaceKeyDown(element);
        expect(element.hasAttribute('active')).to.be.true;
      });

      it('should not have active attribute after space', () => {
        spaceKeyDown(element);
        spaceKeyUp(element);
        expect(element.hasAttribute('active')).to.be.false;
      });

      it('should not have active attribute on arrow key', () => {
        arrowDownKeyDown(element);
        expect(element.hasAttribute('active')).to.be.false;
      });

      it('should not have active attribute when disabled', () => {
        element.disabled = true;
        mousedown(element);
        enterKeyDown(element);
        spaceKeyDown(element);
        expect(element.hasAttribute('active')).to.be.false;
      });

      it('should not have active attribute when disconnected from the DOM', () => {
        spaceKeyDown(element);
        element.parentNode.removeChild(element);
        expect(element.hasAttribute('active')).to.be.false;
      });

      it('should not have active attribute after blur', () => {
        spaceKeyDown(element);
        element.dispatchEvent(new CustomEvent('blur'));
        expect(element.hasAttribute('active')).to.be.false;
      });
    });

    // TODO: Remove when it would be possible for an element:
    // – to detect if it inherits TabindexMixin.
    // – or to run a suit of the tests defined in TabindexMixin.
    describe('TabindexMixin', () => {
      it('should set tabindex attribute to 0 by default', () => {
        expect(element.getAttribute('tabindex')).to.be.equal('0');
      });

      it('should reflect tabindex property to the attribute', () => {
        element.tabindex = 1;
        expect(element.getAttribute('tabindex')).to.be.equal('1');
      });

      it('should reflect native tabIndex property to the attribute', () => {
        element.tabIndex = 1;
        expect(element.getAttribute('tabindex')).to.be.equal('1');
      });

      it('should set tabindex attribute to -1 when disabled', () => {
        element.tabIndex = 1;
        element.disabled = true;
        expect(element.getAttribute('tabindex')).to.be.equal('-1');
      });

      it('should restore tabindex attribute when enabled', () => {
        element.tabIndex = 1;
        element.disabled = true;
        element.disabled = false;
        expect(element.getAttribute('tabindex')).to.be.equal('1');
      });

      it('should restore tabindex attribute with the last known value when enabled', () => {
        element.tabIndex = 1;
        element.disabled = true;
        element.tabIndex = 2;
        expect(element.getAttribute('tabindex')).to.be.equal('-1');

        element.disabled = false;
        expect(element.getAttribute('tabindex')).to.be.equal('2');
      });
    });

    // TODO: Remove when it would be possible for an element:
    // – to detect if it inherits FocusMixin.
    // – or to run a suit of the tests defined in FocusMixin.
    describe('FocusMixin', () => {
      describe('focusing with Tab', () => {
        beforeEach(async () => {
          // Focus on the button
          await sendKeys({ press: 'Tab' });
        });

        it('should set focused attribute', () => {
          expect(element.hasAttribute('focused')).to.be.true;
        });

        it('should set focus-ring attribute', () => {
          expect(element.hasAttribute('focus-ring')).to.be.true;
        });
      });

      describe('loosing focus with Shift+Tab', () => {
        beforeEach(async () => {
          // Focus on the button
          await sendKeys({ press: 'Tab' });

          // Focus out of the button
          await sendKeys({ down: 'Shift' });
          await sendKeys({ press: 'Tab' });
          await sendKeys({ up: 'Shift' });
        });

        it('should remove focused attribute', () => {
          expect(element.hasAttribute('focused')).to.be.false;
        });

        it('should remove focus-ring attribute', () => {
          expect(element.hasAttribute('focus-ring')).to.be.false;
        });
      });
    });
  });
});
