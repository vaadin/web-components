import { expect } from '@esm-bundle/chai';
import { fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import '../vaadin-dialog.js';
import { html, render } from 'lit';
import { dialogRenderer } from '../vaadin-dialog.js';

function renderDialog(container, content) {
  render(
    html`<vaadin-dialog ${content ? dialogRenderer(() => html`${content}`, content) : null}></vaadin-dialog>`,
    container,
  );
}

describe('lit renderers', () => {
  let container, dialog;

  beforeEach(() => {
    container = fixtureSync('<div></div>');
  });

  describe('dialogRenderer', () => {
    beforeEach(async () => {
      renderDialog(container, 'content');
      dialog = container.querySelector('vaadin-dialog');
      dialog.opened = true;
      await oneEvent(dialog.$.overlay, 'vaadin-overlay-open');
    });

    it('should render the dialog content with the renderer', () => {
      expect(dialog.$.overlay.textContent).to.equal('content');
    });

    it('should re-render the dialog content when a renderer dependency changes', () => {
      renderDialog(container, 'new content');
      expect(dialog.$.overlay.textContent).to.equal('new content');
    });

    it('should clear the dialog content when the directive is detached', () => {
      renderDialog(container);
      expect(dialog.$.overlay.textContent).to.be.empty;
    });
  });
});
