import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-overlay.js';

describe('renderer', () => {
  let rendererContent, renderModel;

  beforeEach(() => {
    rendererContent = document.createElement('p');
    rendererContent.textContent = 'renderer-content';
    renderModel = { selected: true };
  });

  describe('without overlay', () => {
    let overlay;

    beforeEach(() => {
      overlay = fixtureSync('<vaadin-overlay></vaadin-overlay>');
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should use renderer when it is defined', () => {
      overlay.renderer = (root) => root.appendChild(rendererContent);
      overlay.opened = true;
      expect(overlay.textContent.trim()).to.equal('renderer-content');
    });

    it('should receive empty root, model and owner when it is defined', () => {
      const overlayOwner = {};
      overlay.owner = overlayOwner;
      overlay.model = renderModel;
      overlay.renderer = (root, owner, model) => {
        expect(root.firstChild).to.be.null;
        expect(owner).to.eql(overlayOwner);
        expect(model).to.eql(renderModel);
      };
    });

    it('should clean the root on renderer changed', () => {
      overlay.renderer = (root) => root.appendChild(rendererContent);
      overlay.opened = true;
      expect(overlay.textContent.trim()).to.equal('renderer-content');
      overlay.renderer = (root) => expect(root.firstChild).to.be.null;
    });

    it('should not clean the root on model or owner changed', () => {
      overlay.renderer = (root, owner, model) => {
        if (owner !== undefined || model !== undefined) {
          expect(root.firstChild).not.to.be.null;
        }
        root.appendChild(rendererContent);
      };
      const overlayOwner = {};
      overlay.owner = overlayOwner;
      overlay.model = renderModel;
    });

    it('should pass owner as this to the renderer', () => {
      overlay.owner = {};
      overlay.model = renderModel;
      overlay.renderer = function (root, owner) {
        expect(this).to.eql(owner);
      };
    });

    it('should call renderer on model change', () => {
      const spy = sinon.spy();
      overlay.opened = true;
      overlay.renderer = () => spy();
      spy.resetHistory();
      overlay.model = {};
      expect(spy.calledOnce).to.be.true;
    });

    it('should call renderer on owner change', () => {
      const spy = sinon.spy();
      overlay.opened = true;
      overlay.renderer = () => spy();
      spy.resetHistory();
      overlay.owner = {};
      expect(spy.calledOnce).to.be.true;
    });

    it('should run renderers when requesting content update', () => {
      overlay.renderer = sinon.spy();
      overlay.requestContentUpdate();

      expect(overlay.renderer.calledOnce).to.be.true;
    });

    it('should not render if overlay is not open', () => {
      const spy = sinon.spy();
      overlay.renderer = () => spy();
      expect(spy.called).to.be.false;
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
  });
});
