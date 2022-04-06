import { expect } from '@esm-bundle/chai';
import { aTimeout, esc, fixtureSync } from '@vaadin/testing-helpers';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '../vaadin-dialog.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

customElements.define(
  'x-dialog',
  class XDialog extends PolymerElement {
    static get template() {
      return html`
        <vaadin-dialog id="dialog">
          <template>
            <span>[[message]]</span>
            <input value="{{text::input}}" />
          </template>
        </vaadin-dialog>
      `;
    }

    static get properties() {
      return {
        message: String,
        text: String
      };
    }
  }
);

describe('vaadin-dialog', () => {
  describe('custom element definition', () => {
    let dialog, tagName;

    beforeEach(() => {
      dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
      tagName = dialog.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('host element', () => {
    let dialog;

    beforeEach(() => {
      dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
    });

    it('should enforce display: none to hide the host element', () => {
      dialog.style.display = 'block';
      expect(getComputedStyle(dialog).display).to.equal('none');
    });
  });

  describe('opened', () => {
    let dialog, backdrop, overlay;

    beforeEach(() => {
      dialog = fixtureSync(`
        <vaadin-dialog opened theme="foo">
          <template>
            <div>Simple dialog</div>
          </template>
        </vaadin-dialog>
      `);
      overlay = dialog.$.overlay;
      backdrop = overlay.$.backdrop;
    });

    describe('attributes', () => {
      it('overlay should have the `dialog` role', () => {
        expect(overlay.getAttribute('role')).to.be.eql('dialog');
      });

      it('overlay should have the `aria-label` attribute (if set)', () => {
        dialog.ariaLabel = 'accessible';
        expect(overlay.getAttribute('aria-label')).to.be.eql('accessible');
      });

      it('overlay should not have the `aria-label` attribute (if not set)', () => {
        expect(overlay.getAttribute('aria-label')).to.be.null;
      });

      it('overlay should not have `aria-label` attribute if set to undefined', () => {
        dialog.ariaLabel = 'accessible';
        dialog.ariaLabel = undefined;
        expect(overlay.getAttribute('aria-label')).to.be.null;
      });

      it('overlay should not have `aria-label` attribute if set to null', () => {
        dialog.ariaLabel = 'accessible';
        dialog.ariaLabel = null;
        expect(overlay.getAttribute('aria-label')).to.be.null;
      });

      it('overlay should not have `aria-label` attribute if set to empty string', () => {
        dialog.ariaLabel = 'accessible';
        dialog.ariaLabel = '';
        expect(overlay.getAttribute('aria-label')).to.be.null;
      });

      it('should propagate theme attribute to the overlay', () => {
        expect(overlay.getAttribute('theme')).to.be.eql(dialog.getAttribute('theme'));
      });
    });

    describe('no-close-on-esc', () => {
      it('should close itself on ESC press by default', () => {
        esc(document.body);
        expect(dialog.opened).to.eql(false);
      });

      it('should not close itself on ESC press when no-close-on-esc is true', () => {
        dialog.noCloseOnEsc = true;
        esc(document.body);
        expect(dialog.opened).to.eql(true);
      });
    });

    describe('no-close-on-outside-click', () => {
      it('should close itself on outside click by default', () => {
        backdrop.dispatchEvent(new CustomEvent('click', { bubbles: true, composed: true }));
        expect(dialog.opened).to.eql(false);
      });

      it('should not close itself on outside click when no-close-on-outside-click is true', () => {
        dialog.noCloseOnOutsideClick = true;
        backdrop.dispatchEvent(new CustomEvent('click', { bubbles: true, composed: true }));
        expect(dialog.opened).to.eql(true);
      });
    });

    describe('detaching', () => {
      it('should close the overlay when detached', async () => {
        dialog.parentNode.removeChild(dialog);
        await aTimeout(0);
        expect(dialog.opened).to.be.false;
      });

      it('should not close the overlay when moved within the DOM', async () => {
        const newParent = document.createElement('div');
        document.body.appendChild(newParent);

        newParent.appendChild(dialog);
        await aTimeout(0);
        expect(dialog.opened).to.be.true;
      });
    });

    describe('modeless', () => {
      it('should be modal by default', () => {
        expect(overlay.modeless).to.be.false;
        expect(backdrop.hidden).to.be.false;
      });

      it('should not be modal when modeless is true', () => {
        dialog.modeless = true;
        expect(overlay.modeless).to.be.true;
        expect(backdrop.hidden).to.be.true;
      });
    });
  });

  describe('without template', () => {
    let dialog;

    beforeEach(() => {
      dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
    });

    it('should not throw an exception if template is not present', () => {
      const openDialog = () => (dialog.opened = true);
      expect(openDialog).to.not.throw();
    });

    it('should have min-width for content', () => {
      dialog.opened = true;
      const contentMinWidth = parseFloat(getComputedStyle(dialog.$.overlay.$.content).minWidth);
      expect(contentMinWidth).to.be.gt(0);
    });
  });

  describe('data binding', () => {
    let container, dialog, overlay;

    beforeEach(() => {
      container = fixtureSync('<x-dialog></x-dialog>');
      dialog = container.$.dialog;
      overlay = dialog.$.overlay;
      dialog.opened = true;
    });

    it('should bind parent property', () => {
      container.message = 'foo';
      expect(overlay.content.querySelector('span').textContent.trim()).to.equal('foo');
    });

    it('should support two-way data binding', () => {
      const input = overlay.content.querySelector('input');
      input.value = 'bar';
      input.dispatchEvent(new CustomEvent('input'));
      expect(container.text).to.equal('bar');
    });
  });
});
