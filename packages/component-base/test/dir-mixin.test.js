import { expect } from '@vaadin/chai-plugins';
import { nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { LitElement } from 'lit';
import { DirMixin } from '../src/dir-mixin.js';
import { PolylitMixin } from '../src/polylit-mixin.js';

class DirMixinLitElement extends DirMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'dir-mixin-lit-element';
  }
}

customElements.define(DirMixinLitElement.is, DirMixinLitElement);

describe('DirMixin', () => {
  const tag = `dir-mixin-lit-element`;

  describe('Native HTMLElement.dir API', () => {
    let element;

    beforeEach(async () => {
      element = document.createElement(tag);
      document.body.appendChild(element);
      await nextRender();
    });

    afterEach(() => {
      document.body.removeChild(element);
    });

    it('should match native behavior for initial values of property and attribute', () => {
      expect(element.dir).to.equal('');
      expect(element.hasAttribute('dir')).to.be.false;
    });

    it('should match native behavior when setting property', async () => {
      element.dir = 'rtl';
      await nextUpdate(element);
      expect(element.dir).to.equal('rtl');
      expect(element.getAttribute('dir')).to.equal('rtl');
    });

    it('should match native behavior when setting attribute', async () => {
      element.setAttribute('dir', 'rtl');
      await nextUpdate(element);
      expect(element.dir).to.equal('rtl');
      expect(element.getAttribute('dir')).to.equal('rtl');
    });

    it('should match native behavior when clearing property', async () => {
      element.dir = 'rtl';
      await nextUpdate(element);

      element.dir = '';
      await nextUpdate(element);
      expect(element.dir).to.equal('');
      expect(element.hasAttribute('dir')).to.be.false;
    });

    it('should match native behavior when clearing attribute', async () => {
      element.setAttribute('dir', 'rtl');
      await nextUpdate(element);

      element.removeAttribute('dir');
      await nextUpdate(element);
      expect(element.dir).to.equal('');
      expect(element.hasAttribute('dir')).to.be.false;
    });

    it('should not call removeAttribute twice when clearing value', async () => {
      element.dir = 'rtl';
      await nextUpdate(element);

      const spy = sinon.spy(element, 'removeAttribute');
      element.removeAttribute('dir');
      await nextUpdate(element);
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('Document dir sync', () => {
    const element = document.createElement(tag);

    before(async () => {
      document.body.appendChild(element);
      await nextRender();
    });

    after(() => {
      document.body.removeChild(element);
      document.documentElement.removeAttribute('dir');
    });

    beforeEach(async () => {
      // Clean up the dir attribute
      document.documentElement.removeAttribute('dir');
      element.removeAttribute('dir');
      await nextUpdate(element);
    });

    // Toggle document dir attribute value
    function setDir(direction) {
      if (direction) {
        document.documentElement.setAttribute('dir', direction);
      } else {
        document.documentElement.removeAttribute('dir');
      }
    }

    // Check that for each `documentDirections` value set, `element` dir
    // attribute value equals to the corresponding `elementDirections` value.
    async function expectDirections(documentDirections, elementDirections) {
      for (let index = 0; index < documentDirections.length; index++) {
        setDir(documentDirections[index]);
        await Promise.resolve();
        expect(element.getAttribute('dir')).to.equal(elementDirections[index]);
      }
    }

    it('should propagate direction as dir attribute to the element from the documentElement', async () => {
      await expectDirections(['rtl', 'ltr', '', 'rtl', null], ['rtl', 'ltr', null, 'rtl', null]);
    });

    it('should preserve direction if was set by the user with setAttribute', async () => {
      element.setAttribute('dir', 'ltr');
      await nextUpdate(element);

      await expectDirections(['rtl', 'ltr', '', 'rtl', null], ['ltr', 'ltr', 'ltr', 'ltr', 'ltr']);
    });

    it('should preserve direction if was set by the user with property', async () => {
      element.dir = 'ltr';
      await nextUpdate(element);

      await expectDirections(['rtl', 'ltr', '', 'rtl', null], ['ltr', 'ltr', 'ltr', 'ltr', 'ltr']);
    });

    it('should subscribe to the changes if set to equal the document direction using setAttribute', async () => {
      element.setAttribute('dir', 'ltr');
      await nextUpdate(element);

      await expectDirections(['rtl', 'ltr', 'rtl'], ['ltr', 'ltr', 'ltr']);

      element.setAttribute('dir', 'rtl');
      await nextUpdate(element);

      await expectDirections(['ltr', 'rtl', ''], ['ltr', 'rtl', null]);
    });

    it('should subscribe to the changes if set to equal the document direction using property', async () => {
      element.dir = 'ltr';
      await nextUpdate(element);

      await expectDirections(['rtl', 'ltr', 'rtl'], ['ltr', 'ltr', 'ltr']);

      element.dir = 'rtl';
      await nextUpdate(element);

      await expectDirections(['ltr', 'rtl', ''], ['ltr', 'rtl', null]);
    });

    it('should subscribe to the changes if attribute removed', async () => {
      element.setAttribute('dir', 'ltr');
      await nextUpdate(element);

      await expectDirections(['rtl', 'ltr', 'rtl'], ['ltr', 'ltr', 'ltr']);

      element.removeAttribute('dir');
      await nextUpdate(element);

      await expectDirections(['ltr', 'rtl', ''], ['ltr', 'rtl', null]);
    });

    it('should subscribe to the changes if property cleared', async () => {
      element.dir = 'ltr';
      await nextUpdate(element);

      await expectDirections(['rtl', 'ltr', 'rtl'], ['ltr', 'ltr', 'ltr']);

      element.dir = '';
      await nextUpdate(element);

      await expectDirections(['ltr', 'rtl', ''], ['ltr', 'rtl', null]);
    });

    it('should unsubscribe if attribute set by the user with setAttribute', async () => {
      await expectDirections(['rtl', 'ltr', 'rtl'], ['rtl', 'ltr', 'rtl']);

      element.setAttribute('dir', 'ltr');
      await nextUpdate(element);

      await expectDirections(['ltr', 'rtl', ''], ['ltr', 'ltr', 'ltr']);
    });

    it('should unsubscribe if attribute set by the user with property', async () => {
      await expectDirections(['rtl', 'ltr', 'rtl'], ['rtl', 'ltr', 'rtl']);

      element.dir = 'ltr';
      await nextUpdate(element);

      await expectDirections(['ltr', 'rtl', ''], ['ltr', 'ltr', 'ltr']);
    });

    it('should clean up the changes after unsubscribing', async () => {
      // Emulating overlay behavior
      setDir('rtl');
      await Promise.resolve();
      document.body.appendChild(element);

      setDir('ltr');
      await Promise.resolve();
      expect(element.getAttribute('dir')).to.eql('ltr');
    });

    it('should keep custom direction when disconnecting and reconnecting', async () => {
      element.setAttribute('dir', 'ltr');
      setDir('rtl');
      await Promise.resolve();
      // Disconnect + reconnect
      document.body.appendChild(element);
      expect(element.getAttribute('dir')).to.eql('ltr');
    });
  });
});
