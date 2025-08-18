import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { definePolymer, fixtureSync, mousedown, mouseup, touchend, touchstart } from '@vaadin/testing-helpers';
import { ActiveMixin } from '../src/active-mixin.js';

describe('ActiveMixin', () => {
  const tag = definePolymer('active-mixin', '<slot></slot>', (Base) => class extends ActiveMixin(Base) {});

  let element;

  beforeEach(() => {
    // Sets tabindex to 0 in order to make the element focusable for the time of testing.
    element = fixtureSync(`<${tag} tabindex="0"></{tag}>`);
    element.focus();
  });

  describe('mouse', () => {
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
    afterEach(async () => {
      for (const key of ['Space', 'Enter']) {
        await sendKeys({ up: key });
      }
    });

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
