import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { keyDownOn, keyUpOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ItemMixin } from '../src/vaadin-item-mixin.js';

class TestItem extends ItemMixin(PolymerElement) {
  static get template() {
    return html`<slot></slot>`;
  }
}

customElements.define('test-item', TestItem);

describe('vaadin-item-mixin', () => {
  let item;

  function spaceDown(target) {
    keyDownOn(target, 32, [], ' ');
  }

  function spaceUp(target) {
    keyUpOn(target, 32, [], ' ');
  }

  function space(target) {
    spaceDown(target);
    spaceUp(target);
  }

  function enter(target) {
    keyDownOn(target, 13, [], 'Enter');
    keyUpOn(target, 13, [], 'Enter');
  }

  function fire(target, type) {
    target.dispatchEvent(new CustomEvent(type, { composed: true, bubbles: true }));
  }

  describe('properties', () => {
    beforeEach(() => {
      item = fixtureSync(`
        <test-item value="foo">
          text-content
        </test-item>
      `);
    });

    describe('selected', () => {
      it('should set selected to false by default', () => {
        expect(item.selected).to.be.false;
      });

      it('should reflect selected to attribute', () => {
        item.selected = true;
        expect(item.hasAttribute('selected')).to.be.true;
      });

      it('should set aria-selected attribute', () => {
        item.selected = true;
        expect(item.getAttribute('aria-selected')).to.equal('true');
      });
    });

    describe('disabled', () => {
      it('should set disabled to false by default', () => {
        expect(item.disabled).to.be.false;
      });

      it('should reflect disabled to attribute', () => {
        item.disabled = true;
        expect(item.hasAttribute('disabled')).to.be.true;
      });

      it('should set selected to false when disabled', () => {
        item.selected = true;
        space(item);
        item.disabled = true;
        expect(item.selected).to.be.false;
      });

      it('should have aria-disabled when disabled', () => {
        item.disabled = true;
        expect(item.getAttribute('aria-disabled')).to.equal('true');
        item.disabled = false;
        expect(item.getAttribute('aria-disabled')).to.be.null;
      });
    });

    describe('focused', () => {
      it('should not have focused attribute when not focused', () => {
        expect(item.hasAttribute('focused')).to.be.false;
      });

      it('should have focused attribute when focused', () => {
        fire(item, 'focus');
        expect(item.hasAttribute('focused')).to.be.true;
      });

      it('should not have focused attribute when blurred', () => {
        fire(item, 'focus');
        fire(item, 'blur');
        expect(item.hasAttribute('focused')).to.be.false;
      });
    });

    describe('active', () => {
      it('should have active attribute on mousedown', () => {
        fire(item, 'mousedown');
        expect(item.hasAttribute('active')).to.be.true;
        expect(item._mousedown).to.be.true;
      });

      it('should not have active attribute after mouseup', () => {
        fire(item, 'mousedown');
        fire(item, 'mouseup');
        expect(item.hasAttribute('active')).to.be.false;
        expect(item._mousedown).to.be.false;
      });

      it('should have active attribute on space down', () => {
        spaceDown(item);
        expect(item.hasAttribute('active')).to.be.true;
      });

      it('should not have active attribute after space up', () => {
        spaceDown(item);
        spaceUp(item);
        expect(item.hasAttribute('active')).to.be.false;
      });

      it('should not have active attribute when disconnected from the DOM', () => {
        spaceDown(item);
        item.parentNode.removeChild(item);
        expect(item.hasAttribute('active')).to.be.false;
      });
    });

    describe('focus-ring', () => {
      it('should not have focus-ring if not focused', () => {
        expect(item.hasAttribute('focus-ring')).to.be.false;
      });

      it('should not have focus-ring attribute when not focused with keyboard', () => {
        item.click();
        expect(item.hasAttribute('focus-ring')).to.be.false;
      });

      it('should have focus-ring attribute when focused with keyboard', () => {
        fire(item, 'focus');
        expect(item.hasAttribute('focus-ring')).to.be.true;
      });

      it('should not have focus-ring after blur', () => {
        fire(item, 'focus');
        fire(item, 'blur');
        expect(item.hasAttribute('focus-ring')).to.be.false;
      });
    });

    describe('interaction', () => {
      it('set this._mousedown to false if mouseup was outside', () => {
        fire(item, 'mousedown');
        expect(item._mousedown).to.be.true;
        fire(document, 'mouseup');
        expect(item._mousedown).to.be.false;
      });

      it('should fire click event when activated with Enter', () => {
        const clickSpy = sinon.spy();
        item.addEventListener('click', clickSpy);
        enter(item);
        expect(clickSpy.calledOnce).to.be.true;
      });

      it('should not fire click event if keyup does not happen after a keydown in the element', () => {
        const clickSpy = sinon.spy();
        item.addEventListener('click', clickSpy);
        spaceUp(item);
        expect(clickSpy.called).to.be.false;
      });
    });

    describe('value', () => {
      it('should have value property', () => {
        expect(item.value).to.be.equal('foo');
      });

      it('should not reflect value to attribute', () => {
        item.value = 'bar';
        expect(item.getAttribute('value')).to.be.equal('foo');
      });
    });
  });

  describe('default value', () => {
    beforeEach(() => {
      item = fixtureSync('<test-item>text-content</test-item>');
    });

    it('should use trimmed textContent', () => {
      expect(item.value).to.equal('text-content');
    });

    it('should reflect changes of content', () => {
      item.innerHTML = 'foo';
      expect(item.value).to.equal('foo');
    });
  });

  describe('with clickable child', () => {
    beforeEach(() => {
      item = fixtureSync(`
        <test-item>
          <button>Clickable</button>
        </test-item>
      `);
    });

    it('should not set active attribute if keydown was prevented', () => {
      const button = item.querySelector('button');
      button.addEventListener('keydown', (e) => {
        e.preventDefault();
      });
      spaceDown(button);
      expect(item.hasAttribute('active')).to.be.false;
    });
  });
});
