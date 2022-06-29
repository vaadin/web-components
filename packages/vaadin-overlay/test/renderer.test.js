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

    it('should not call renderer on template change', () => {
      const spy = sinon.spy();
      overlay.opened = true;
      overlay.renderer = () => spy();
      spy.resetHistory();
      overlay.template = null;
      expect(spy.called).to.be.false;
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

    it('should remove template when added after renderer', () => {
      overlay.renderer = () => {};
      const template = document.createElement('template');
      expect(() => {
        overlay.template = template;
      }).to.throw(Error);
      expect(overlay.template).to.be.not.ok;
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

  describe('with template', () => {
    let overlay;

    beforeEach(() => {
      overlay = fixtureSync(`
        <vaadin-overlay>
          <template>
            overlay-content
          </template>
        </vaadin-overlay>
      `);
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should fallback to render content with Templatizer when renderer is not defined', () => {
      expect(overlay.textContent.trim()).to.equal('overlay-content');
    });

    it('should throw an error when setting a renderer if there is already a template', () => {
      expect(() => {
        overlay.renderer = () => {};
      }).to.throw(Error);
    });

    it('should not restamp the template on model change', () => {
      const lastInstance = overlay._instance;
      expect(lastInstance).to.be.ok;
      overlay.model = {};
      expect(overlay._instance).to.equal(lastInstance);
    });

    it('should not restamp the template on owner change', () => {
      const lastInstance = overlay._instance;
      overlay.owner = {};
      expect(overlay._instance).to.equal(lastInstance);
    });

    it('should remove renderer when added after template', () => {
      expect(() => {
        overlay.renderer = () => {};
      }).to.throw(Error);
      expect(overlay.renderer).to.be.not.ok;
    });
  });
});
