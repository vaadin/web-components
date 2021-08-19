import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
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
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { Button } from '../vaadin-button.js';

customElements.define(Button.is, Button);

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

    it('should have a valid version number', () => {
      expect(customElements.get(tagName).version).to.match(/^(\d+\.)?(\d+\.)?(\d+)(-(alpha|beta|rc)\d+)?$/);
    });
  });

  describe('default', () => {
    let button, label;

    beforeEach(() => {
      element = fixtureSync('<vaadin-button>Vaadin <i>Button</i></vaadin-button>');
      button = element.shadowRoot.querySelector('button');
      label = element.shadowRoot.querySelector('[part=label]');
    });

    it('should have [type=button] on the native button', () => {
      expect(button.getAttribute('type')).to.be.eql('button');
    });

    it('should define the button label using light DOM', () => {
      const children = FlattenedNodesObserver.getFlattenedNodes(label);
      expect(children[1].textContent).to.be.equal('Vaadin ');
      expect(children[2].outerHTML).to.be.equal('<i>Button</i>');
    });

    describe('disabled', () => {
      beforeEach(() => {
        element.disabled = true;
      });

      it('should disable the native button', () => {
        expect(button.hasAttribute('disabled')).to.be.eql(true);
      });

      it('should not fire the click event', () => {
        const spy = sinon.spy();
        element.addEventListener('click', spy);
        element.click();
        expect(spy.called).to.be.false;
      });
    });

    // TODO: Remove when it will be possible to detect whether the button element inherits ActiveMixin.
    // A related issue: https://github.com/vaadin/web-components/issues/2357
    describe('active', () => {
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
  });
});
