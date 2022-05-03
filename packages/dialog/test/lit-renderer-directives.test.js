import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-dialog.js';
import { html, render } from 'lit';
import { dialogFooterRenderer, dialogHeaderRenderer, dialogRenderer } from '../lit.js';

async function renderOpenedDialog(container, { header, content, footer }) {
  render(
    html`<vaadin-dialog
      opened
      ${content ? dialogRenderer(() => html`${content}`, content) : null}
      ${header ? dialogHeaderRenderer(() => html`${header}`, header) : null}
      ${footer ? dialogFooterRenderer(() => html`${footer}`, footer) : null}
    ></vaadin-dialog>`,
    container,
  );
  await nextFrame();
  return container.querySelector('vaadin-dialog');
}

describe('lit renderer directives', () => {
  let container, dialog, overlay;

  beforeEach(() => {
    container = fixtureSync('<div></div>');
  });

  describe('dialogRenderer', () => {
    describe('basic', () => {
      beforeEach(async () => {
        dialog = await renderOpenedDialog(container, { content: 'Content' });
        overlay = dialog.$.overlay;
      });

      it('should set `renderer` property when the directive is attached', () => {
        expect(dialog.renderer).to.exist;
      });

      it('should unset `renderer` property when the directive is detached', async () => {
        await renderOpenedDialog(container, {});
        expect(dialog.renderer).not.to.exist;
      });

      it('should render the dialog content with the renderer', () => {
        expect(overlay.textContent).to.equal('Content');
      });

      it('should re-render the dialog content when a renderer dependency changes', async () => {
        await renderOpenedDialog(container, { content: 'New Content' });
        expect(overlay.textContent).to.equal('New Content');
      });
    });

    describe('arguments', () => {
      let rendererSpy;

      beforeEach(async () => {
        rendererSpy = sinon.spy();
        render(html`<vaadin-dialog opened ${dialogRenderer(rendererSpy)}></vaadin-dialog>`, container);
        await nextFrame();
        dialog = container.querySelector('vaadin-dialog');
      });

      it('should pass the dialog instance to the renderer', () => {
        expect(rendererSpy.calledOnce).to.be.true;
        expect(rendererSpy.firstCall.args[0]).to.equal(dialog);
      });
    });
  });

  describe('dialogHeaderRenderer', () => {
    describe('basic', () => {
      let header;

      beforeEach(async () => {
        dialog = await renderOpenedDialog(container, { header: 'Header' });
        overlay = dialog.$.overlay;
        header = overlay.querySelector('[slot=header-content]');
      });

      it('should set `headerRenderer` property when the directive is attached', () => {
        expect(dialog.headerRenderer).to.exist;
      });

      it('should unset `headerRenderer` property when the directive is detached', async () => {
        await renderOpenedDialog(container, {});
        expect(dialog.headerRenderer).not.to.exist;
      });

      it('should render the dialog header with the renderer', () => {
        expect(header.textContent).to.equal('Header');
      });

      it('should re-render the dialog header when a renderer dependency changes', async () => {
        await renderOpenedDialog(container, { header: 'New Header' });
        expect(header.textContent).to.equal('New Header');
      });
    });

    describe('arguments', () => {
      let rendererSpy;

      beforeEach(async () => {
        rendererSpy = sinon.spy();
        render(html`<vaadin-dialog opened ${dialogHeaderRenderer(rendererSpy)}></vaadin-dialog>`, container);
        await nextFrame();
        dialog = container.querySelector('vaadin-dialog');
      });

      it('should pass the dialog instance to the renderer', () => {
        expect(rendererSpy.calledOnce).to.be.true;
        expect(rendererSpy.firstCall.args[0]).to.equal(dialog);
      });
    });
  });

  describe('dialogFooterRenderer', () => {
    describe('basic', () => {
      let footer;

      beforeEach(async () => {
        dialog = await renderOpenedDialog(container, { footer: 'Footer' });
        overlay = dialog.$.overlay;
        footer = overlay.querySelector('[slot=footer]');
      });

      it('should set `footerRenderer` property when the directive is attached', () => {
        expect(dialog.footerRenderer).to.exist;
      });

      it('should unset `footerRenderer` property when the directive is detached', async () => {
        await renderOpenedDialog(container, {});
        expect(dialog.footerRenderer).not.to.exist;
      });

      it('should render the dialog footer with the renderer', () => {
        expect(footer.textContent).to.equal('Footer');
      });

      it('should re-render the dialog footer when a renderer dependency changes', async () => {
        await renderOpenedDialog(container, { footer: 'New Footer' });
        expect(footer.textContent).to.equal('New Footer');
      });
    });

    describe('arguments', () => {
      let rendererSpy;

      beforeEach(async () => {
        rendererSpy = sinon.spy();
        render(html`<vaadin-dialog opened ${dialogFooterRenderer(rendererSpy)}></vaadin-dialog>`, container);
        await nextFrame();
        dialog = container.querySelector('vaadin-dialog');
      });

      it('should pass the dialog instance to the renderer', () => {
        expect(rendererSpy.calledOnce).to.be.true;
        expect(rendererSpy.firstCall.args[0]).to.equal(dialog);
      });
    });
  });

  describe('multiple renderers', () => {
    beforeEach(async () => {
      dialog = await renderOpenedDialog(container, {
        header: 'Header',
        footer: 'Footer',
        content: 'Content',
      });
    });

    it('should only request one content update when triggering multiple renderers to update', async () => {
      const spy = sinon.spy(dialog, 'requestContentUpdate');
      await renderOpenedDialog(container, {
        header: 'New Header',
        footer: 'New Footer',
        content: 'New Content',
      });
      expect(spy.callCount).to.equal(1);
    });
  });
});
