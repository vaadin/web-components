import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { Overlay } from '../src/vaadin-overlay.js';

describe('renderer', () => {
  let overlay, content;

  describe('default', () => {
    beforeEach(async () => {
      overlay = fixtureSync('<vaadin-overlay></vaadin-overlay>');
      await nextRender();
      content = document.createElement('p');
      content.textContent = 'renderer-content';
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should use renderer when it is defined', () => {
      overlay.renderer = (root) => root.appendChild(content);
      overlay.opened = true;
      expect(overlay.textContent.trim()).to.equal('renderer-content');
    });

    it('should receive empty root, model and owner when they are defined', () => {
      const overlayOwner = document.createElement('div');
      const overlayModel = {};

      overlay.owner = overlayOwner;
      overlay.model = overlayModel;

      const renderer = sinon.spy();

      overlay.renderer = renderer;
      overlay.opened = true;

      const [root, owner, model] = renderer.firstCall.args;
      expect(root.firstChild).to.be.null;
      expect(owner).to.eql(overlayOwner);
      expect(model).to.eql(overlayModel);
    });

    it('should clean the root on renderer change', () => {
      overlay.renderer = (root) => root.appendChild(content);
      overlay.opened = true;
      expect(overlay.textContent.trim()).to.equal('renderer-content');

      const renderer = sinon.spy();
      overlay.renderer = renderer;

      const root = renderer.firstCall.args[0];
      expect(root.firstChild).to.be.null;
    });

    it('should not clean the root on model or owner change', () => {
      overlay.renderer = (root) => root.appendChild(content);
      overlay.opened = true;
      expect(overlay.textContent.trim()).to.equal('renderer-content');

      const overlayOwner = document.createElement('div');
      const overlayModel = {};

      overlay.owner = overlayOwner;
      overlay.model = overlayModel;

      expect(overlay.textContent.trim()).to.equal('renderer-content');
    });

    it('should pass owner as this to the renderer', () => {
      const owner = document.createElement('div');
      overlay.owner = owner;

      const renderer = sinon.spy();
      overlay.renderer = renderer;

      overlay.opened = true;

      expect(renderer.firstCall.thisValue).to.equal(owner);
    });

    it('should call renderer on model change', () => {
      const renderer = sinon.spy();

      overlay.opened = true;
      overlay.renderer = renderer;

      renderer.resetHistory();
      overlay.model = {};

      expect(renderer.calledOnce).to.be.true;
    });

    it('should call renderer on owner change', () => {
      const renderer = sinon.spy();

      overlay.opened = true;
      overlay.renderer = renderer;

      renderer.resetHistory();
      overlay.owner = document.createElement('div');

      expect(renderer.calledOnce).to.be.true;
    });

    it('should call renderer when requesting content update', () => {
      overlay.renderer = sinon.spy();
      overlay.requestContentUpdate();

      expect(overlay.renderer.calledOnce).to.be.true;
    });

    it('should not call renderer if overlay is not open', () => {
      overlay.renderer = sinon.spy();
      expect(overlay.renderer.called).to.be.false;
    });

    it('should clear the content when removing the renderer', () => {
      overlay.renderer = (root) => {
        root.innerHTML = 'foo';
      };

      overlay.opened = true;
      expect(overlay.textContent.trim()).to.equal('foo');

      overlay.renderer = null;
      expect(overlay.textContent.trim()).to.equal('');
    });

    it('should not clear the root on open when setting renderer', () => {
      const spy = sinon.spy(overlay, 'innerHTML', ['set']);
      overlay.renderer = (root) => {
        if (!root.innerHTML) {
          root.appendChild(content);
        }
      };
      overlay.opened = true;
      expect(spy.set).to.not.be.called;
    });

    it('should not re-render when opened after requesting content update', () => {
      const spy = sinon.spy(overlay, 'appendChild');
      overlay.renderer = (root) => {
        if (!root.innerHTML) {
          root.appendChild(content);
        }
      };
      overlay.requestContentUpdate();
      overlay.opened = true;
      expect(spy).to.be.calledOnce;
    });
  });

  describe('custom root', () => {
    let root;

    customElements.define(
      'custom-root-overlay',
      class extends Overlay {
        get _contentRoot() {
          return this.__customRoot;
        }

        firstUpdated() {
          super.firstUpdated();

          this.__customRoot = document.createElement('div');
          this.appendChild(this.__customRoot);
        }
      },
    );

    beforeEach(async () => {
      overlay = fixtureSync('<custom-root-overlay></custom-root-overlay>');
      await nextRender();
      root = overlay._contentRoot;
      content = document.createElement('p');
      content.textContent = 'renderer-content';
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should render content into the custom content root element', () => {
      overlay.renderer = (root) => root.appendChild(content);
      overlay.opened = true;
      expect(root.textContent.trim()).to.equal('renderer-content');
      expect(content.parentNode).to.equal(root);
    });

    it('should pass reference to the custom content root to renderer', () => {
      const renderer = sinon.spy();

      overlay.renderer = renderer;
      overlay.opened = true;

      expect(renderer.firstCall.args[0]).to.equal(root);
    });

    it('should clear the custom content root on renderer change', () => {
      overlay.renderer = (root) => root.appendChild(content);
      overlay.opened = true;
      expect(root.textContent.trim()).to.equal('renderer-content');

      const renderer = sinon.spy();
      overlay.renderer = renderer;

      expect(overlay.firstChild).to.equal(root);
      expect(root.firstChild).to.be.null;
    });

    it('should clear the custom content root when removing the renderer', () => {
      overlay.renderer = (root) => root.appendChild(content);
      overlay.opened = true;

      overlay.renderer = null;

      expect(overlay.firstChild).to.equal(root);
      expect(root.firstChild).to.be.null;
    });
  });
});
