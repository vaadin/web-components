import { expect } from '@esm-bundle/chai';
import {
  arrowDownKeyDown,
  enterKeyDown,
  enterKeyUp,
  fire,
  fixtureSync,
  isIOS,
  mousedown,
  mouseup,
  spaceKeyDown,
  spaceKeyUp,
  touchend,
  touchstart
} from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ActiveMixin } from '../src/active-mixin.js';

customElements.define(
  'active-mixin-element',
  class extends ActiveMixin(PolymerElement) {
    static get template() {
      return html`<div></div>`;
    }
  }
);

describe('active-mixin', () => {
  let element;

  beforeEach(() => {
    element = fixtureSync(`<active-mixin-element></active-mixin-element>`);
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
    it('should set active attribute when Enter is pressed', async () => {
      enterKeyDown(element);
      expect(element.hasAttribute('active')).to.be.true;
    });

    it('should remove active attribute when Enter is released', () => {
      enterKeyDown(element);
      enterKeyUp(element);
      expect(element.hasAttribute('active')).to.be.false;
    });

    it('should not set active attribute when disabled and Enter is pressed', () => {
      element.disabled = true;
      enterKeyDown(element);
      expect(element.hasAttribute('active')).to.be.false;
    });

    it('should set active attribute when Space is pressed', () => {
      spaceKeyDown(element);
      expect(element.hasAttribute('active')).to.be.true;
    });

    it('should remove active attribute when Space is released', () => {
      spaceKeyDown(element);
      spaceKeyUp(element);
      expect(element.hasAttribute('active')).to.be.false;
    });

    it('should not set active attribute when disabled and Space is pressed', () => {
      element.disabled = true;
      spaceKeyDown(element);
      expect(element.hasAttribute('active')).to.be.false;
    });

    it('should not set active attribute when ArrowDown is pressed', () => {
      arrowDownKeyDown(element);
      expect(element.hasAttribute('active')).to.be.false;
    });

    describe('custom activation keys', () => {
      beforeEach(() => {
        Object.defineProperty(element, 'activeKeys', {
          get() {
            return ['ArrowDown'];
          }
        });
      });

      it('should set active attribute when ArrowDown is pressed', () => {
        arrowDownKeyDown(element);
        expect(element.hasAttribute('active')).to.be.true;
      });
    });
  });

  it('should not preserve active attribute when disconnecting from the DOM', () => {
    spaceKeyDown(element);
    element.parentNode.removeChild(element);
    expect(element.hasAttribute('active')).to.be.false;
  });

  it('should remove active attribute on blur', () => {
    spaceKeyDown(element);
    fire(element, 'blur');
    expect(element.hasAttribute('active')).to.be.false;
  });
});
