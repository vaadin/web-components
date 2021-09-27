import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { DirMixin } from '../src/dir-mixin.js';

class DirMixinElement extends DirMixin(PolymerElement) {
  static get is() {
    return 'dir-mixin-element';
  }
}

customElements.define(DirMixinElement.is, DirMixinElement);

describe('DirMixin', () => {
  describe('Native HTMLElement.dir API', () => {
    let element;

    beforeEach(() => {
      element = document.createElement('dir-mixin-element');
      document.body.appendChild(element);
    });

    afterEach(() => {
      document.body.removeChild(element);
    });

    it('should match native behavior for initial values of property and attribute', () => {
      expect(element.dir).to.equal('');
      expect(element.hasAttribute('dir')).to.be.false;
    });

    it('should match native behavior when setting property', () => {
      element.dir = 'rtl';
      expect(element.dir).to.equal('rtl');
      expect(element.getAttribute('dir')).to.equal('rtl');
    });

    it('should match native behavior when setting attribute', () => {
      element.setAttribute('dir', 'rtl');
      expect(element.dir).to.equal('rtl');
      expect(element.getAttribute('dir')).to.equal('rtl');
    });

    it('should match native behavior when clearing property', () => {
      element.dir = 'rtl';
      element.dir = '';
      expect(element.dir).to.equal('');
      expect(element.hasAttribute('dir')).to.be.false;
    });

    it('should match native behavior when clearing attribute', () => {
      element.setAttribute('dir', 'rtl');
      element.removeAttribute('dir');
      expect(element.dir).to.equal('');
      expect(element.hasAttribute('dir')).to.be.false;
    });

    it('should not call removeAttribute twice when clearing value', () => {
      element.dir = 'rtl';
      const spy = sinon.spy(element, 'removeAttribute');
      element.removeAttribute('dir');
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('Document dir sync', () => {
    const element = document.createElement('dir-mixin-element');

    before(() => {
      document.body.appendChild(element);
    });

    after(() => {
      document.body.removeChild(element);
    });

    beforeEach(() => {
      // Clean up the dir attribute
      document.documentElement.removeAttribute('dir');
      element.removeAttribute('dir');
    });

    // Check that for each `documentDirections` value set, `element` dir
    // attribute value equals to the corresponding `elementDirections` value.
    async function expectDirections(documentDirections, elementDirections) {
      for (let index = 0; index < documentDirections.length; index++) {
        setDir(documentDirections[index]);
        await Promise.resolve();
        expect(element.getAttribute('dir')).to.equal(elementDirections[index]);
      }
    }

    // Toggle document dir attribute value
    function setDir(direction) {
      if (direction) {
        document.documentElement.setAttribute('dir', direction);
      } else {
        document.documentElement.removeAttribute('dir');
      }
    }

    it('should propagate direction as dir attribute to the element from the documentElement', async () => {
      await expectDirections(['rtl', 'ltr', '', 'rtl', null], ['rtl', 'ltr', null, 'rtl', null]);
    });

    it('should preserve direction if was set by the user with setAttribute', async () => {
      element.setAttribute('dir', 'ltr');

      await expectDirections(['rtl', 'ltr', '', 'rtl', null], ['ltr', 'ltr', 'ltr', 'ltr', 'ltr']);
    });

    it('should preserve direction if was set by the user with property', async () => {
      element.dir = 'ltr';

      await expectDirections(['rtl', 'ltr', '', 'rtl', null], ['ltr', 'ltr', 'ltr', 'ltr', 'ltr']);
    });

    it('should subscribe to the changes if set to equal the document direction using setAttribute', async () => {
      element.setAttribute('dir', 'ltr');

      await expectDirections(['rtl', 'ltr', 'rtl'], ['ltr', 'ltr', 'ltr']);

      element.setAttribute('dir', 'rtl');

      await expectDirections(['ltr', 'rtl', ''], ['ltr', 'rtl', null]);
    });

    it('should subscribe to the changes if set to equal the document direction using property', async () => {
      element.dir = 'ltr';

      await expectDirections(['rtl', 'ltr', 'rtl'], ['ltr', 'ltr', 'ltr']);

      element.dir = 'rtl';

      await expectDirections(['ltr', 'rtl', ''], ['ltr', 'rtl', null]);
    });

    it('should subscribe to the changes if attribute removed', async () => {
      element.setAttribute('dir', 'ltr');

      await expectDirections(['rtl', 'ltr', 'rtl'], ['ltr', 'ltr', 'ltr']);

      element.removeAttribute('dir');

      await expectDirections(['ltr', 'rtl', ''], ['ltr', 'rtl', null]);
    });

    it('should subscribe to the changes if property cleared', async () => {
      element.dir = 'ltr';

      await expectDirections(['rtl', 'ltr', 'rtl'], ['ltr', 'ltr', 'ltr']);

      element.dir = '';

      await expectDirections(['ltr', 'rtl', ''], ['ltr', 'rtl', null]);
    });

    it('should unsubscribe if attribute set by the user with setAttribute', async () => {
      await expectDirections(['rtl', 'ltr', 'rtl'], ['rtl', 'ltr', 'rtl']);

      element.setAttribute('dir', 'ltr');

      await expectDirections(['ltr', 'rtl', ''], ['ltr', 'ltr', 'ltr']);
    });

    it('should unsubscribe if attribute set by the user with property', async () => {
      await expectDirections(['rtl', 'ltr', 'rtl'], ['rtl', 'ltr', 'rtl']);

      element.dir = 'ltr';

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
  });
});
