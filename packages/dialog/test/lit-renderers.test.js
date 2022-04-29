import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-dialog.js';
import { html, render } from 'lit';
import { dialogFooterRenderer, dialogHeaderRenderer, dialogRenderer } from '../vaadin-dialog.js';

async function renderDialog(container, { header, content, footer }) {
  render(
    html`<vaadin-dialog
      ${content ? dialogRenderer(() => html`${content}`, content) : null}
      ${header ? dialogHeaderRenderer(() => html`${header}`, header) : null}
      ${footer ? dialogFooterRenderer(() => html`${footer}`, footer) : null}
    ></vaadin-dialog>`,
    container,
  );
  await nextFrame();
}

describe('lit renderers', () => {
  let container, dialog, overlay, header, footer;

  beforeEach(() => {
    container = fixtureSync('<div></div>');
  });

  describe('dialogRenderer', () => {
    beforeEach(async () => {
      await renderDialog(container, { content: 'Content' });
      dialog = container.querySelector('vaadin-dialog');
      overlay = dialog.$.overlay;
      dialog.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    it('should render the dialog content with the renderer', () => {
      expect(overlay.textContent).to.equal('Content');
    });

    it('should re-render the dialog content when a renderer dependency changes', async () => {
      await renderDialog(container, { content: 'New Content' });
      expect(overlay.textContent).to.equal('New Content');
    });

    it('should clear the dialog content when the directive is detached', async () => {
      await renderDialog(container, {});
      expect(overlay.textContent).to.be.empty;
    });
  });

  describe('dialogHeaderRenderer', () => {
    beforeEach(async () => {
      await renderDialog(container, { header: 'Header' });
      dialog = container.querySelector('vaadin-dialog');
      overlay = dialog.$.overlay;
      dialog.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      header = overlay.querySelector('[slot=header-content]');
    });

    it('should render the dialog header with the renderer', () => {
      expect(header.textContent).to.equal('Header');
    });

    it('should re-render the dialog header when a renderer dependency changes', async () => {
      await renderDialog(container, { header: 'New Header' });
      expect(header.textContent).to.equal('New Header');
    });

    it('should clear the dialog header when the directive is detached', async () => {
      await renderDialog(container, {});
      expect(overlay.querySelector('[slot=header-content]')).to.be.null;
    });
  });

  describe('dialogFooterRenderer', () => {
    beforeEach(async () => {
      await renderDialog(container, { footer: 'Footer' });
      dialog = container.querySelector('vaadin-dialog');
      overlay = dialog.$.overlay;
      dialog.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      footer = overlay.querySelector('[slot=footer]');
    });

    it('should render the dialog footer with the renderer', () => {
      expect(footer.textContent).to.equal('Footer');
    });

    it('should re-render the dialog footer when a renderer dependency changes', async () => {
      await renderDialog(container, { footer: 'New Footer' });
      expect(footer.textContent).to.equal('New Footer');
    });

    it('should clear the dialog footer when the directive is detached', async () => {
      await renderDialog(container, {});
      expect(overlay.querySelector('[slot=footer]')).to.be.null;
    });
  });

  describe('multiple renderers', () => {
    beforeEach(async () => {
      await renderDialog(container, {
        header: 'Header',
        footer: 'Footer',
        content: 'Content',
      });
      dialog = container.querySelector('vaadin-dialog');
      dialog.opened = true;
      await oneEvent(dialog.$.overlay, 'vaadin-overlay-open');
    });

    it('should request a content update only once when triggering directives to update', async () => {
      const spy = sinon.spy(dialog, 'requestContentUpdate');
      await renderDialog(container, {
        header: 'New Header',
        footer: 'New Footer',
        content: 'New Content',
      });
      expect(spy.callCount).to.equal(1);
    });
  });
});
