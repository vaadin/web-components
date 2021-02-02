import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, nextFrame } from '@open-wc/testing-helpers';
import { pressAndReleaseKeyOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import './not-animated-styles.js';
import '../vaadin-confirm-dialog.js';

describe('vaadin-confirm-dialog', () => {
  describe('custom element definition', () => {
    let confirm;

    beforeEach(() => {
      confirm = fixtureSync('<vaadin-confirm-dialog></vaadin-confirm-dialog>');
    });

    it('should be defined with correct tag name', () => {
      expect(customElements.get('vaadin-confirm-dialog')).to.be.ok;
    });

    it('should have a valid version number', () => {
      expect(confirm.constructor.version).to.match(/^(\d+\.)?(\d+\.)?(\d+)(-(alpha|beta)\d+)?$/);
    });
  });

  describe('properties', () => {
    let confirm, dialog;

    beforeEach(() => {
      confirm = fixtureSync('<vaadin-confirm-dialog>Confirmation message</vaadin-confirm-dialog>');
      dialog = confirm.$.dialog;
    });

    it('should set opened to false by default', () => {
      expect(confirm.opened).to.be.false;
    });

    it('should propagate opened to internal dialog', () => {
      confirm.opened = true;
      expect(dialog.opened).to.be.true;
    });

    it('should dispatch opened-changed event when opened changes', () => {
      confirm.opened = true;
      const spy = sinon.spy();
      confirm.addEventListener('opened-changed', spy);
      const btn = dialog.$.overlay.content.querySelector('vaadin-button#confirm');
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

    it('should set header to empty string by default', () => {
      expect(confirm.header).to.equal('');
    });

    it('should update aria-label on the dialog when header changes', () => {
      confirm.header = 'Warning';
      expect(dialog.ariaLabel).to.equal('Warning');
    });
  });

  describe('message', () => {
    let confirm, content;

    beforeEach(() => {
      confirm = fixtureSync('<vaadin-confirm-dialog opened>Confirmation message</vaadin-confirm-dialog>');
      content = confirm.$.dialog.$.overlay.content;
    });

    it('should apply the element content as a message', function () {
      const children = FlattenedNodesObserver.getFlattenedNodes(content.querySelector('div[part="message"]'));
      const messageNode = Array.from(children).find((n) => n.data && n.data.indexOf('Confirmation message') !== -1);
      expect(messageNode).to.be.ok;
    });

    it('should be possible to set message as property', function () {
      confirm.message = 'New message';
      const messageText = content.querySelector('div[part="message"]').textContent;
      expect(messageText).to.contain('New message');
    });
  });

  describe('buttons', () => {
    let confirm, content;

    beforeEach(() => {
      confirm = fixtureSync('<vaadin-confirm-dialog opened>Confirmation message</vaadin-confirm-dialog>');
      content = confirm.$.dialog.$.overlay.content;
    });

    describe('confirm', () => {
      let confirmButton;

      beforeEach(() => {
        confirmButton = content.querySelector('vaadin-button#confirm');
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

      it('should set aria-describedby on the confirm button', () => {
        expect(confirmButton.getAttribute('aria-describedby')).to.equal('message');
      });
    });

    describe('reject', () => {
      let rejectButton;

      beforeEach(() => {
        rejectButton = content.querySelector('vaadin-button#reject');
      });

      it('should not show reject button by default', () => {
        expect(rejectButton.hasAttribute('hidden')).to.be.true;
      });

      it('should show reject button when reject is true', () => {
        confirm.reject = true;
        expect(rejectButton.hasAttribute('hidden')).to.be.false;
      });

      it('should reflect reject property to attribute', () => {
        confirm.reject = true;
        expect(confirm.hasAttribute('reject')).to.be.true;
      });

      it('should close dialog on reject button click', () => {
        confirm.reject = true;
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

      it('should set aria-describedby on the reject button', () => {
        expect(rejectButton.getAttribute('aria-describedby')).to.equal('message');
      });
    });

    describe('cancel', () => {
      let cancelButton;

      beforeEach(() => {
        cancelButton = content.querySelector('vaadin-button#cancel');
      });

      it('should not show cancel button by default', () => {
        expect(cancelButton.hasAttribute('hidden')).to.be.true;
      });

      it('should show cancel button when cancel is true', () => {
        confirm.cancel = true;
        expect(cancelButton.hasAttribute('hidden')).to.be.false;
      });

      it('should reflect cancel property to attribute', () => {
        confirm.cancel = true;
        expect(confirm.hasAttribute('cancel')).to.be.true;
      });

      it('should close dialog on cancel button click', () => {
        confirm.cancel = true;
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

      it('should set aria-describedby on the cancel button', () => {
        expect(cancelButton.getAttribute('aria-describedby')).to.equal('message');
      });
    });
  });

  describe('custom buttons', () => {
    let confirm;

    beforeEach(() => {
      confirm = fixtureSync(`
        <vaadin-confirm-dialog>
          <button slot="confirm-button">Confirm</button>
          <button slot="cancel-button">Cancel</button>
          <button slot="reject-button">Reject</button>
        </vaadin-confirm-dialog>
      `);
    });

    it('should teleport buttons under overlay when opened', () => {
      const buttons = Array.from(confirm.querySelectorAll('button'));
      confirm.opened = true;
      const content = confirm.$.dialog.$.overlay.$.content;
      buttons.forEach((btn) => {
        expect(btn.parentNode).to.equal(content);
      });
    });

    it('should focus custom confirm button when opened', async () => {
      const btn = confirm.querySelector('[slot="confirm-button"]');
      const spy = sinon.spy(btn, 'focus');
      confirm.opened = true;
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('events', () => {
    let confirm, content;

    beforeEach(() => {
      confirm = fixtureSync('<vaadin-confirm-dialog opened>Confirmation message</vaadin-confirm-dialog>');
      content = confirm.$.dialog.$.overlay.content;
    });

    it('should dispatch confirm event on confirm button click', () => {
      const spy = sinon.spy();
      confirm.addEventListener('confirm', spy);
      content.querySelector('vaadin-button#confirm').click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should dispatch cancel event on cancel button click', () => {
      confirm.cancel = true;
      const spy = sinon.spy();
      confirm.addEventListener('cancel', spy);
      content.querySelector('vaadin-button#cancel').click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should dispatch reject event on reject button click', () => {
      confirm.reject = true;
      const spy = sinon.spy();
      confirm.addEventListener('reject', spy);
      content.querySelector('vaadin-button#reject').click();
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('Esc key', () => {
    let confirm, spy;

    beforeEach(() => {
      confirm = fixtureSync('<vaadin-confirm-dialog opened>Confirmation message</vaadin-confirm-dialog>');
      spy = sinon.spy();
      confirm.addEventListener('cancel', spy);
    });

    it('should close but not cancel dialog by default', () => {
      pressAndReleaseKeyOn(document.body, 27, [], 'Escape');
      expect(spy.called).to.be.true;
      expect(confirm.opened).to.be.false;
    });

    it('should not close and not cancel dialog with no-close-on-esc', () => {
      confirm.noCloseOnEsc = true;
      pressAndReleaseKeyOn(document.body, 27, [], 'Escape');
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

  describe('RTL', () => {
    let confirm;

    beforeEach(() => {
      confirm = fixtureSync('<vaadin-confirm-dialog>Confirmation message</vaadin-confirm-dialog>');
    });

    describe('setting dir attribute', () => {
      it('should be forwarded to content and footer after opening', () => {
        confirm.setAttribute('dir', 'rtl');
        confirm.opened = true;
        const content = confirm.$.dialog.$.overlay.content;
        expect(content.querySelector('#content').getAttribute('dir')).to.be.equal('rtl');
        expect(content.querySelector('[part="footer"]').getAttribute('dir')).to.be.equal('rtl');
      });

      it('should be forwarded to content and footer when opened', () => {
        confirm.opened = true;
        confirm.setAttribute('dir', 'rtl');
        const content = confirm.$.dialog.$.overlay.content;
        expect(content.querySelector('#content').getAttribute('dir')).to.be.equal('rtl');
        expect(content.querySelector('[part="footer"]').getAttribute('dir')).to.be.equal('rtl');
      });
    });

    describe('removing dir attribute', () => {
      beforeEach(() => {
        confirm.setAttribute('dir', 'rtl');
        confirm.opened = true;
      });

      it('should be removed from content and footer when opened', () => {
        confirm.opened = false;
        confirm.removeAttribute('dir');
        confirm.opened = true;
        const content = confirm.$.dialog.$.overlay.content;
        expect(content.querySelector('#content').hasAttribute('dir')).to.be.false;
        expect(content.querySelector('[part="footer"]').hasAttribute('dir')).to.be.false;
      });

      it('should be removed from content and footer after re-opening', () => {
        confirm.opened = false;
        confirm.removeAttribute('dir');
        confirm.opened = true;
        const content = confirm.$.dialog.$.overlay.content;
        expect(content.querySelector('#content').hasAttribute('dir')).to.be.false;
        expect(content.querySelector('[part="footer"]').hasAttribute('dir')).to.be.false;
      });
    });
  });

  describe('set width and height', () => {
    let confirm, spy;

    describe('default', () => {
      let overlay;

      beforeEach(() => {
        confirm = fixtureSync('<vaadin-confirm-dialog opened>Confirmation message</vaadin-confirm-dialog>');
        overlay = confirm.$.dialog.$.overlay;
        spy = sinon.spy(confirm, '_setDimension');
      });

      it('should update width after opening the dialog', () => {
        confirm._setWidth('300px');
        expect(spy.calledWith('width', '300px')).to.be.true;
        expect(getComputedStyle(overlay.$.content).width).to.be.equal('300px');
      });

      it('should update height after opening the dialog', async () => {
        confirm._setHeight('500px');
        await nextFrame();
        expect(spy.calledWith('height', '500px')).to.be.true;
        expect(getComputedStyle(overlay.$.content).height).to.be.equal('508px');
      });
    });

    describe('before attach', () => {
      beforeEach(() => {
        confirm = document.createElement('vaadin-confirm-dialog');
        confirm.message = 'Message';
        spy = sinon.spy(confirm, '_setDimension');
      });

      afterEach(() => {
        document.body.removeChild(confirm);
      });

      it('should update width after opening the dialog', () => {
        confirm._setWidth('200px');
        document.body.appendChild(confirm);
        confirm.opened = true;
        expect(spy.calledWith('width', '200px')).to.be.true;
        expect(getComputedStyle(confirm.$.dialog.$.overlay.$.content).width).to.be.equal('200px');
      });

      it('should update height after opening the dialog', async () => {
        confirm._setHeight('500px');
        document.body.appendChild(confirm);
        confirm.opened = true;
        await nextFrame();
        expect(spy.calledWith('height', '500px')).to.be.true;
        expect(getComputedStyle(confirm.$.dialog.$.overlay.$.content).height).to.be.equal('508px');
      });
    });
  });
});
