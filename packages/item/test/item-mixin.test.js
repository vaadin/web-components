import { expect } from '@esm-bundle/chai';
import {
  enterKeyDown,
  fixtureSync,
  focusin,
  focusout,
  mousedown,
  mouseup,
  space,
  spaceKeyDown,
  spaceKeyUp,
  tabKeyDown,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ItemMixin } from '../src/vaadin-item-mixin.js';

class TestItem extends ItemMixin(PolymerElement) {
  static get template() {
    return html`<slot></slot>`;
  }
}

customElements.define('test-item', TestItem);

describe('vaadin-item-mixin', () => {
  let item;

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

      it('should have focused attribute on focusin', () => {
        focusin(item);
        expect(item.hasAttribute('focused')).to.be.true;
      });

      it('should not have focused attribute on focusout', () => {
        focusin(item);
        focusout(item);
        expect(item.hasAttribute('focused')).to.be.false;
      });

      it('should set focused attribute on programmatic focus', () => {
        item.focus();
        expect(item.hasAttribute('focused')).to.be.true;
      });

      it('should not set focused on programmatic focus when disabled', () => {
        item.disabled = true;
        item.focus();
        expect(item.hasAttribute('focused')).to.be.false;
      });
    });

    describe('active', () => {
      it('should set active attribute on mousedown', () => {
        mousedown(item);
        expect(item.hasAttribute('active')).to.be.true;
      });

      it('should remove active attribute on mouseup', () => {
        mousedown(item);
        mouseup(item);
        expect(item.hasAttribute('active')).to.be.false;
      });

      it('should not set active attribute on mousedown when disabled', () => {
        item.disabled = true;
        mousedown(item);
        expect(item.hasAttribute('active')).to.be.false;
      });

      it('should have active attribute on space down', () => {
        spaceKeyDown(item);
        expect(item.hasAttribute('active')).to.be.true;
      });

      it('should not have active attribute after space up', () => {
        spaceKeyDown(item);
        spaceKeyUp(item);
        expect(item.hasAttribute('active')).to.be.false;
      });

      it('should not have active attribute when disconnected from the DOM', () => {
        spaceKeyDown(item);
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
        tabKeyDown(item);
        focusin(item);
        expect(item.hasAttribute('focus-ring')).to.be.true;
      });

      it('should not have focus-ring after focusout', () => {
        tabKeyDown(item);
        focusin(item);
        focusout(item);
        expect(item.hasAttribute('focus-ring')).to.be.false;
      });

      it('should set focus-ring on programmatic focus after keydown', () => {
        tabKeyDown(item);
        item.focus();
        expect(item.hasAttribute('focus-ring')).to.be.true;
      });

      it('should not set focus-ring on programmatic focus after mousedown', () => {
        tabKeyDown(item);
        mousedown(item);
        item.focus();
        expect(item.hasAttribute('focus-ring')).to.be.false;
      });
    });

    describe('click', () => {
      it('should fire click event on Enter keydown', () => {
        const clickSpy = sinon.spy();
        item.addEventListener('click', clickSpy);
        enterKeyDown(item);
        expect(clickSpy.calledOnce).to.be.true;
      });

      it('should fire click event on Space keydown', () => {
        const clickSpy = sinon.spy();
        item.addEventListener('click', clickSpy);
        spaceKeyDown(item);
        expect(clickSpy.calledOnce).to.be.true;
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
      spaceKeyDown(button);
      expect(item.hasAttribute('active')).to.be.false;
    });

    it('should not call click method if keydown was prevented', () => {
      const button = item.querySelector('button');
      button.addEventListener('keydown', (e) => {
        e.preventDefault();
      });
      const spy = sinon.spy(item, 'click');
      spaceKeyDown(button);
      expect(spy.called).to.be.false;
    });
  });
});
