import { expect } from '@esm-bundle/chai';
import { fixtureSync, isIOS, mousedown, mouseup, touchend, touchstart } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ActiveMixin } from '../src/active-mixin.js';

customElements.define(
  'active-mixin-element',
  class extends ActiveMixin(PolymerElement) {
    static get template() {
      return html`<div></div>`;
    }
  },
);

describe('active-mixin', () => {
  let element;

  beforeEach(() => {
    // Sets tabindex to 0 in order to make the element focusable for the time of testing.
    element = fixtureSync(`<active-mixin-element tabindex="0"></active-mixin-element>`);
    element.focus();
  });

  (isIOS ? describe.skip : describe)('mouse', () => {
    it('should set active attribute on mousedown', () => {
      mousedown(element);
      expect(element.hasAttribute('active')).to.be.true;
    });

    it('should remove active attribute on mouseup', () => {
      mousedown(element);
      mouseup(element);
      expect(element.hasAttribute('active')).to.be.false;
    });

    it('should not set active attribute on mousedown when disabled', () => {
      element.disabled = true;
      mousedown(element);
      expect(element.hasAttribute('active')).to.be.false;
    });
  });

  describe('touch', () => {
    it('should set active attribute on touchstart', () => {
      touchstart(element);
      expect(element.hasAttribute('active')).to.be.true;
    });

    it('should remove active attribute on touchend', () => {
      touchstart(element);
      touchend(element);
      expect(element.hasAttribute('active')).to.be.false;
    });

    it('should not set active attribute on touchstart when disabled', () => {
      element.disabled = true;
      touchstart(element);
      expect(element.hasAttribute('active')).to.be.false;
    });
  });

  describe('keyboard', () => {
    it('should set active attribute when Space is pressed', async () => {
      await sendKeys({ down: 'Space' });
      expect(element.hasAttribute('active')).to.be.true;
    });

    it('should remove active attribute when Space is released', async () => {
      await sendKeys({ down: 'Space' });
      await sendKeys({ up: 'Space' });
      expect(element.hasAttribute('active')).to.be.false;
    });

    it('should not set active attribute when disabled and Space is pressed', async () => {
      element.disabled = true;
      await sendKeys({ down: 'Space' });
      expect(element.hasAttribute('active')).to.be.false;
    });

    it('should not set active attribute when a non-activation key is pressed', async () => {
      await sendKeys({ down: 'ArrowDown' });
      expect(element.hasAttribute('active')).to.be.false;
    });

    it('should remove active attribute when element gets hidden on keydown', async () => {
      element.addEventListener('keydown', () => {
        element.setAttribute('hidden', '');
      });
      await sendKeys({ down: 'Space' });
      await sendKeys({ up: 'Space' });
      expect(element.hasAttribute('active')).to.be.false;
    });

    describe('custom activation keys', () => {
      beforeEach(() => {
        Object.defineProperty(element, '_activeKeys', {
          get() {
            return ['Enter'];
          },
        });
      });

      it('should set active attribute when Enter is pressed', async () => {
        await sendKeys({ down: 'Enter' });
        expect(element.hasAttribute('active')).to.be.true;
      });
    });
  });

  it('should not preserve active attribute when disconnecting from the DOM', async () => {
    await sendKeys({ down: 'Space' });
    element.parentNode.removeChild(element);
    expect(element.hasAttribute('active')).to.be.false;
  });
});
