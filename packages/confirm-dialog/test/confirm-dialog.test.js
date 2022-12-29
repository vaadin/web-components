import { expect } from '@esm-bundle/chai';
import { esc, fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-confirm-dialog.js';

describe('vaadin-confirm-dialog', () => {
  describe('custom element definition', () => {
    let confirm, tagName;

    beforeEach(() => {
      confirm = fixtureSync('<vaadin-confirm-dialog></vaadin-confirm-dialog>');
      tagName = confirm.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('host element', () => {
    let confirm;

    beforeEach(() => {
      confirm = fixtureSync('<vaadin-confirm-dialog></vaadin-confirm-dialog>');
    });

    it('should enforce display: none to hide the host element', () => {
      confirm.style.display = 'block';
      expect(getComputedStyle(confirm).display).to.equal('none');
    });
  });

  describe('properties', () => {
    let confirm, dialog, overlay;

    beforeEach(() => {
      confirm = fixtureSync('<vaadin-confirm-dialog>Confirmation message</vaadin-confirm-dialog>');
      dialog = confirm.$.dialog;
      overlay = dialog.$.overlay;
    });

    it('should set opened to false by default', () => {
      expect(confirm.opened).to.be.false;
    });

    it('should propagate opened to internal dialog', () => {
      confirm.opened = true;
      expect(dialog.opened).to.be.true;
    });

    it('should dispatch opened-changed event when opened changes', async () => {
      confirm.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      const spy = sinon.spy();
      confirm.addEventListener('opened-changed', spy);
      const btn = overlay.querySelector('[slot="confirm-button"]');
      btn.click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should set noCloseOnEsc to false by default', () => {
      expect(confirm.noCloseOnEsc).to.be.false;
    });

    it('should propagate noCloseOnEsc to internal dialog', () => {
      confirm.noCloseOnEsc = true;
      expect(dialog.noCloseOnEsc).to.be.true;
    });

    it('should set noCloseOnEsc on the dialog', () => {
      expect(dialog.noCloseOnOutsideClick).to.be.true;
    });

    it('should set aria-label on the dialog', () => {
      expect(dialog.ariaLabel).to.equal('confirmation');
    });
  });

  describe('header', () => {
    let confirm, overlay, headerSlot;

    describe('default', () => {
      beforeEach(() => {
        confirm = fixtureSync('<vaadin-confirm-dialog></vaadin-confirm-dialog>');
      });

      it('should set header to empty string by default', () => {
        expect(confirm.header).to.equal('');
      });

      it('should update aria-label on the dialog when header changes', () => {
        confirm.header = 'Warning';
        expect(confirm.$.dialog.ariaLabel).to.equal('Warning');
      });
    });

    describe('property', () => {
      beforeEach(async () => {
        confirm = fixtureSync('<vaadin-confirm-dialog opened header="Property header"></vaadin-confirm-dialog>');
        overlay = confirm.$.dialog.$.overlay;
        await oneEvent(overlay, 'vaadin-overlay-open');
        headerSlot = overlay.shadowRoot.querySelector('slot[name="header"]');
      });

      it('should set the header text content using header property', () => {
        const headerNode = headerSlot.assignedNodes()[0];
        expect(headerNode.textContent.trim()).to.equal('Property header');
      });

      it('should update header text when header property changes', () => {
        confirm.header = 'Just go away';
        const headerNode = headerSlot.assignedNodes()[0];
        expect(headerNode.textContent.trim()).to.equal('Just go away');
      });
    });

    describe('slot', () => {
      beforeEach(async () => {
        confirm = fixtureSync(`
          <vaadin-confirm-dialog opened header="Property header">
            <h3 slot="header">Slotted header</h3>
          </vaadin-confirm-dialog>
        `);
        overlay = confirm.$.dialog.$.overlay;
        await oneEvent(overlay, 'vaadin-overlay-open');
        headerSlot = overlay.shadowRoot.querySelector('slot[name="header"]');
      });

      it('should keep the element text content as a message', () => {
        const headerNode = headerSlot.assignedNodes()[0];
        expect(headerNode.textContent.trim()).to.equal('Slotted header');
      });

      it('should not update custom node when message property changes', () => {
        confirm.header = 'Whatever';
        const headerNode = headerSlot.assignedNodes()[0];
        expect(headerNode.textContent.trim()).to.equal('Slotted header');
      });
    });
  });

  describe('message', () => {
    let confirm, overlay, messageSlot;

    describe('property', () => {
      beforeEach(async () => {
        confirm = fixtureSync('<vaadin-confirm-dialog opened message="Confirmation message"></vaadin-confirm-dialog>');
        overlay = confirm.$.dialog.$.overlay;
        await oneEvent(overlay, 'vaadin-overlay-open');
        messageSlot = overlay.shadowRoot.querySelector('[part="message"] > slot');
      });

      it('should set the message text content using message property', () => {
        const messageNode = messageSlot.assignedNodes()[0];
        expect(messageNode.textContent.trim()).to.equal('Confirmation message');
      });

      it('should update message text when message property changes', () => {
        confirm.message = 'New message';
        const messageNode = messageSlot.assignedNodes()[0];
        expect(messageNode.textContent.trim()).to.equal('New message');
      });
    });

    describe('slot', () => {
      beforeEach(async () => {
        confirm = fixtureSync(`
          <vaadin-confirm-dialog opened>
            Confirmation message
            <div>Additional content</dib>
          </vaadin-confirm-dialog>
        `);
        overlay = confirm.$.dialog.$.overlay;
        await oneEvent(overlay, 'vaadin-overlay-open');
        messageSlot = overlay.shadowRoot.querySelector('[part="message"] > slot');
      });

      it('should place all the slotted elements in the message slot', () => {
        const nodes = messageSlot.assignedNodes();
        expect(nodes[0].textContent.trim()).to.equal('Confirmation message');
        expect(nodes[1].textContent.trim()).to.equal('Additional content');
      });

      it('should not update custom node when message property changes', () => {
        confirm.message = 'New message';
        const messageNode = messageSlot.assignedNodes()[0];
        expect(messageNode.textContent.trim()).to.equal('Confirmation message');
      });
    });
  });

  describe('buttons', () => {
    let confirm, overlay;

    beforeEach(async () => {
      confirm = fixtureSync('<vaadin-confirm-dialog opened>Confirmation message</vaadin-confirm-dialog>');
      overlay = confirm.$.dialog.$.overlay;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    describe('confirm', () => {
      let confirmButton;

      beforeEach(() => {
        confirmButton = overlay.querySelector('[slot="confirm-button"]');
      });

      it('should show confirm button by default', () => {
        expect(confirmButton.hasAttribute('hidden')).to.be.false;
      });

      it('should close dialog on confirm button click', () => {
        confirmButton.click();
        expect(confirm.opened).to.be.false;
      });

      it('should have a default confirm button text', () => {
        expect(confirmButton.textContent.trim()).to.equal('Confirm');
      });

      it('should be possible to update confirm button text', () => {
        confirm.confirmText = 'OK';
        expect(confirmButton.textContent.trim()).to.equal('OK');
      });

      it('should have a default confirm button theme', () => {
        expect(confirmButton.getAttribute('theme')).to.equal('primary');
      });

      it('should be possible to update confirm button theme', () => {
        confirm.confirmTheme = 'contained';
        expect(confirmButton.getAttribute('theme')).to.equal('contained');
      });
    });

    describe('reject', () => {
      let rejectButton;

      beforeEach(() => {
        rejectButton = overlay.querySelector('[slot="reject-button"]');
      });

      it('should not show reject button by default', () => {
        expect(rejectButton.hasAttribute('hidden')).to.be.true;
      });

      it('should show reject button when reject is true', () => {
        confirm.rejectButtonVisible = true;
        expect(rejectButton.hasAttribute('hidden')).to.be.false;
      });

      it('should reflect rejectButtonVisible property to attribute', () => {
        confirm.rejectButtonVisible = true;
        expect(confirm.hasAttribute('reject-button-visible')).to.be.true;
      });

      it('should close dialog on reject button click', () => {
        confirm.rejectButtonVisible = true;
        rejectButton.click();
        expect(confirm.opened).to.be.false;
      });

      it('should have a default reject button text', () => {
        expect(rejectButton.textContent.trim()).to.equal('Reject');
      });

      it('should be possible to update reject button text', () => {
        confirm.rejectText = 'No';
        expect(rejectButton.textContent.trim()).to.equal('No');
      });

      it('should have a default reject button theme', () => {
        expect(rejectButton.getAttribute('theme')).to.equal('error tertiary');
      });

      it('should be possible to update reject button theme', () => {
        confirm.rejectTheme = 'outlined';
        expect(rejectButton.getAttribute('theme')).to.equal('outlined');
      });
    });

    describe('cancel', () => {
      let cancelButton;

      beforeEach(() => {
        cancelButton = overlay.querySelector('[slot="cancel-button"]');
      });

      it('should not show cancel button by default', () => {
        expect(cancelButton.hasAttribute('hidden')).to.be.true;
      });

      it('should show cancel button when cancel is true', () => {
        confirm.cancelButtonVisible = true;
        expect(cancelButton.hasAttribute('hidden')).to.be.false;
      });

      it('should reflect cancelButtonVisible property to attribute', () => {
        confirm.cancelButtonVisible = true;
        expect(confirm.hasAttribute('cancel-button-visible')).to.be.true;
      });

      it('should close dialog on cancel button click', () => {
        confirm.cancelButtonVisible = true;
        cancelButton.click();
        expect(confirm.opened).to.be.false;
      });

      it('should have a default cancel button text', () => {
        expect(cancelButton.textContent.trim()).to.equal('Cancel');
      });

      it('should be possible to update cancel button text', () => {
        confirm.cancelText = 'Stop';
        expect(cancelButton.textContent.trim()).to.equal('Stop');
      });

      it('should have a default cancel button theme', () => {
        expect(cancelButton.getAttribute('theme')).to.equal('tertiary');
      });

      it('should be possible to update cancel button theme', () => {
        confirm.cancelTheme = 'contrast';
        expect(cancelButton.getAttribute('theme')).to.equal('contrast');
      });
    });
  });

  describe('custom buttons', () => {
    let confirm, overlay;

    beforeEach(() => {
      confirm = fixtureSync(`
        <vaadin-confirm-dialog>
          <button slot="confirm-button" theme="custom-confirm-theme">Custom Confirm</button>
          <button slot="cancel-button" theme="custom-cancel-theme">Custom Cancel</button>
          <button slot="reject-button" theme="custom-reject-theme">Custom Reject</button>
        </vaadin-confirm-dialog>
      `);
      overlay = confirm.$.dialog.$.overlay;
    });

    it('should teleport buttons under overlay when opened', async () => {
      const buttons = Array.from(confirm.querySelectorAll('button'));
      confirm.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      buttons.forEach((btn) => {
        expect(btn.parentNode).to.equal(overlay);
      });
    });

    it('should focus custom confirm button when opened', async () => {
      const btn = confirm.querySelector('[slot="confirm-button"]');
      const spy = sinon.spy(btn, 'focus');
      confirm.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(spy.calledOnce).to.be.true;
    });

    it('should not override custom button content and theme', async () => {
      const confirmButton = confirm.querySelector('[slot="confirm-button"]');
      const cancelButton = confirm.querySelector('[slot="cancel-button"]');
      const rejectButton = confirm.querySelector('[slot="reject-button"]');
      confirm.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');

      function verifyButtonsAreNotModified() {
        expect(confirmButton.textContent).to.equal('Custom Confirm');
        expect(confirmButton.getAttribute('theme')).to.equal('custom-confirm-theme');
        expect(cancelButton.textContent).to.equal('Custom Cancel');
        expect(cancelButton.getAttribute('theme')).to.equal('custom-cancel-theme');
        expect(rejectButton.textContent).to.equal('Custom Reject');
        expect(rejectButton.getAttribute('theme')).to.equal('custom-reject-theme');
      }

      // Using default text and theme values, buttons should not be modified
      verifyButtonsAreNotModified();
      // Using custom text and theme values, buttons should not be modified
      confirm.confirmText = 'Override Confirm Text';
      confirm.confirmTheme = 'override-confirm-theme';
      confirm.cancelText = 'Override Cancel Text';
      confirm.cancelTheme = 'override-cancel-theme';
      confirm.rejectText = 'Override Reject Text';
      confirm.rejectTheme = 'override-reject-theme';
      verifyButtonsAreNotModified();
    });
  });

  describe('events', () => {
    let confirm, overlay;

    beforeEach(async () => {
      confirm = fixtureSync('<vaadin-confirm-dialog opened>Confirmation message</vaadin-confirm-dialog>');
      overlay = confirm.$.dialog.$.overlay;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    it('should dispatch confirm event on confirm button click', () => {
      const spy = sinon.spy();
      confirm.addEventListener('confirm', spy);
      overlay.querySelector('[slot="confirm-button"]').click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should dispatch cancel event on cancel button click', () => {
      confirm.cancelButtonVisible = true;
      const spy = sinon.spy();
      confirm.addEventListener('cancel', spy);
      overlay.querySelector('[slot="cancel-button"]').click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should dispatch reject event on reject button click', () => {
      confirm.rejectButtonVisible = true;
      const spy = sinon.spy();
      confirm.addEventListener('reject', spy);
      overlay.querySelector('[slot="reject-button"]').click();
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('Esc key', () => {
    let confirm, spy;

    beforeEach(async () => {
      confirm = fixtureSync('<vaadin-confirm-dialog opened>Confirmation message</vaadin-confirm-dialog>');
      await oneEvent(confirm.$.dialog.$.overlay, 'vaadin-overlay-open');
      spy = sinon.spy();
      confirm.addEventListener('cancel', spy);
    });

    it('should close but not cancel dialog by default', () => {
      esc(document.body);
      expect(spy.called).to.be.true;
      expect(confirm.opened).to.be.false;
    });

    it('should not close and not cancel dialog with no-close-on-esc', () => {
      confirm.noCloseOnEsc = true;
      esc(document.body);
      expect(spy.called).to.be.false;
      expect(confirm.opened).to.be.true;
    });
  });

  describe('theme attribute', () => {
    let confirm;

    beforeEach(() => {
      confirm = fixtureSync('<vaadin-confirm-dialog theme="foo">Confirmation message</vaadin-confirm-dialog>');
    });

    it('should propagate theme attribute to vaadin-dialog', () => {
      const themes = confirm.$.dialog.getAttribute('theme').split(' ');
      expect(themes).to.include.members(['foo']);
    });

    it('should propagate theme attribute to overlay', () => {
      const themes = confirm.$.dialog.$.overlay.getAttribute('theme').split(' ');
      expect(themes).to.include.members(['foo']);
    });
  });

  describe('set width and height', () => {
    let confirm, overlay;

    function getStyleValue(element) {
      return element
        .getAttribute('style')
        .split(':')
        .map((str) => str.trim().replace(';', ''));
    }

    describe('default', () => {
      beforeEach(async () => {
        confirm = fixtureSync('<vaadin-confirm-dialog opened>Confirmation message</vaadin-confirm-dialog>');
        overlay = confirm.$.dialog.$.overlay;
        await oneEvent(overlay, 'vaadin-overlay-open');
      });

      it('should update width after opening the dialog', () => {
        confirm._contentWidth = '300px';
        expect(getComputedStyle(overlay.$.overlay).width).to.be.equal('300px');
      });

      it('should update height after opening the dialog', () => {
        confirm._contentHeight = '500px';
        expect(getComputedStyle(overlay.$.overlay).height).to.equal('500px');
      });

      it('should reset style after setting width to null', () => {
        const prop = '--_vaadin-confirm-dialog-content-width';

        confirm._contentWidth = '500px';
        expect(getStyleValue(overlay)).to.eql([prop, '500px']);

        confirm._contentWidth = null;
        expect(overlay.getAttribute('style')).to.be.not.ok;
      });

      it('should reset style after setting height to null', () => {
        const prop = '--_vaadin-confirm-dialog-content-height';

        confirm._contentHeight = '500px';
        expect(getStyleValue(overlay)).to.eql([prop, '500px']);

        confirm._contentHeight = null;
        expect(overlay.getAttribute('style')).to.be.not.ok;
      });
    });

    describe('before attach', () => {
      beforeEach(() => {
        confirm = document.createElement('vaadin-confirm-dialog');
        confirm.message = 'Message';
      });

      afterEach(() => {
        document.body.removeChild(confirm);
      });

      it('should update width after opening the dialog', async () => {
        confirm._contentWidth = '200px';
        document.body.appendChild(confirm);
        overlay = confirm.$.dialog.$.overlay;
        confirm.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
        expect(getComputedStyle(overlay.$.overlay).width).to.be.equal('200px');
      });

      it('should update height after opening the dialog', async () => {
        confirm._contentHeight = '500px';
        document.body.appendChild(confirm);
        overlay = confirm.$.dialog.$.overlay;
        confirm.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
        expect(getComputedStyle(overlay.$.overlay).height).to.equal('500px');
      });
    });
  });
});
