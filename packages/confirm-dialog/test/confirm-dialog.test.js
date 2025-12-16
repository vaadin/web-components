import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { aTimeout, fixtureSync, listenOnce, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../src/vaadin-confirm-dialog.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';

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

    it('should use display: none when not opened', () => {
      expect(getComputedStyle(confirm).display).to.equal('none');
    });

    ['opened', 'opening', 'closing'].forEach((state) => {
      it(`should use display: block when ${state} attribute is set`, () => {
        confirm.setAttribute(state, '');
        expect(getComputedStyle(confirm).display).to.equal('block');
      });
    });

    it('should use display: none when hidden while opened', async () => {
      confirm.opened = true;
      await oneEvent(confirm.$.overlay, 'vaadin-overlay-open');
      confirm.hidden = true;
      await nextRender();
      expect(getComputedStyle(confirm).display).to.equal('none');
    });
  });

  describe('properties', () => {
    let confirm, overlay;

    beforeEach(async () => {
      confirm = fixtureSync('<vaadin-confirm-dialog>Confirmation message</vaadin-confirm-dialog>');
      await nextRender();
      overlay = confirm.$.overlay;
    });

    it('should set opened to false by default', () => {
      expect(confirm.opened).to.be.false;
    });

    it('should propagate opened to the overlay', async () => {
      confirm.opened = true;
      await nextRender();
      expect(overlay.opened).to.be.true;
    });

    it('should dispatch opened-changed event when opened changes', async () => {
      confirm.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      const spy = sinon.spy();
      confirm.addEventListener('opened-changed', spy);
      const btn = confirm.querySelector('[slot="confirm-button"]');
      btn.click();
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
    });

    it('should set noCloseOnEsc to false by default', () => {
      expect(confirm.noCloseOnEsc).to.be.false;
    });

    it('should set aria-label on the host', () => {
      expect(confirm.ariaLabel).to.equal('confirmation');
    });

    it('should set aria-description on the host', () => {
      expect(confirm.ariaDescription).to.equal('Confirmation message');
    });

    it('should set `aria-describedby` on the host when `accessibleDescriptionRef` is defined', async () => {
      const customId = 'id-0';
      confirm.accessibleDescriptionRef = customId;
      await nextFrame();
      expect(confirm.getAttribute('aria-describedby')).to.equal(customId);
      expect(confirm.hasAttribute('aria-description')).to.be.false;
    });

    it('should restore `aria-description` on the host when `accessibleDescriptionRef` is removed', async () => {
      confirm.accessibleDescriptionRef = 'id-0';
      await nextFrame();
      confirm.accessibleDescriptionRef = null;
      await nextFrame();
      expect(confirm.hasAttribute('aria-describedby')).to.be.false;
      expect(confirm.getAttribute('aria-description')).to.be.equal('Confirmation message');
    });
  });

  describe('header', () => {
    let confirm;

    describe('default', () => {
      beforeEach(async () => {
        confirm = fixtureSync('<vaadin-confirm-dialog></vaadin-confirm-dialog>');
        await nextRender();
      });

      it('should set header to empty string by default', () => {
        expect(confirm.header).to.equal('');
      });

      it('should update aria-label on the host when header changes', async () => {
        confirm.header = 'Warning';
        await nextFrame();
        expect(confirm.ariaLabel).to.equal('Warning');
      });
    });

    describe('property', () => {
      beforeEach(async () => {
        confirm = fixtureSync('<vaadin-confirm-dialog opened header="Property header"></vaadin-confirm-dialog>');
        await nextRender();
      });

      it('should set the header text content using header property', () => {
        const headerNode = confirm.querySelector('[slot="header"]');
        expect(headerNode.textContent.trim()).to.equal('Property header');
      });

      it('should update header text when header property changes', async () => {
        confirm.header = 'Just go away';
        await nextFrame();
        const headerNode = confirm.querySelector('[slot="header"]');
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
        await nextRender();
      });

      it('should keep the element text content as a message', () => {
        const headerNode = confirm.querySelector('[slot="header"]');
        expect(headerNode.textContent.trim()).to.equal('Slotted header');
      });

      it('should not update custom node when message property changes', async () => {
        confirm.header = 'Whatever';
        await nextFrame();
        const headerNode = confirm.querySelector('[slot="header"]');
        expect(headerNode.textContent.trim()).to.equal('Slotted header');
      });

      it('should set pointer-events on the element to auto', () => {
        const headerNode = confirm.querySelector('[slot="header"]');
        expect(getComputedStyle(headerNode).pointerEvents).to.equal('auto');
      });
    });
  });

  describe('message', () => {
    let confirm, messageSlot;

    describe('property', () => {
      beforeEach(async () => {
        confirm = fixtureSync('<vaadin-confirm-dialog opened message="Confirmation message"></vaadin-confirm-dialog>');
        await nextRender();
      });

      it('should set the message text content using message property', () => {
        const messageNode = confirm.querySelector(':not([slot])');
        expect(messageNode.textContent.trim()).to.equal('Confirmation message');
      });

      it('should update message text when message property changes', async () => {
        confirm.message = 'New message';
        await nextFrame();
        const messageNode = confirm.querySelector(':not([slot])');
        expect(messageNode.textContent.trim()).to.equal('New message');
      });

      describe('a11y', () => {
        it('should use message as aria-description', () => {
          const messageNode = confirm.querySelector(':not([slot])');
          expect(confirm.getAttribute('aria-description')).to.equal(messageNode.textContent);
        });
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
        await nextRender();
        messageSlot = confirm.shadowRoot.querySelector('slot:not([name])');
      });

      it('should place all the slotted elements in the message slot', () => {
        const nodes = messageSlot.assignedNodes();
        expect(nodes[0].textContent.trim()).to.equal('Confirmation message');
        expect(nodes[1].textContent.trim()).to.equal('Additional content');
      });

      it('should not update custom node when message property changes', async () => {
        confirm.message = 'New message';
        await nextFrame();
        const messageNode = messageSlot.assignedNodes()[0];
        expect(messageNode.textContent.trim()).to.equal('Confirmation message');
      });
    });

    describe('a11y', () => {
      const firstChild = 'Confirm message';
      const secondChild = '<div>Additional content</div>';

      beforeEach(async () => {
        confirm = fixtureSync(`
          <vaadin-confirm-dialog opened>
            ${firstChild}
            ${secondChild}
          </vaadin-confirm-dialog>
        `);
        await nextRender();
      });

      it('should use combined message text as aria-description on host', () => {
        expect(confirm.getAttribute('aria-description')).to.equal('Confirm message Additional content');
      });
    });
  });

  describe('buttons', () => {
    let confirm;

    beforeEach(async () => {
      confirm = fixtureSync('<vaadin-confirm-dialog opened>Confirmation message</vaadin-confirm-dialog>');
      await nextRender();
    });

    describe('confirm', () => {
      let confirmButton;

      beforeEach(() => {
        confirmButton = confirm.querySelector('[slot="confirm-button"]');
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

      it('should be possible to update confirm button text', async () => {
        confirm.confirmText = 'OK';
        await nextFrame();
        expect(confirmButton.textContent.trim()).to.equal('OK');
      });

      it('should have a default confirm button theme', () => {
        expect(confirmButton.getAttribute('theme')).to.equal('primary');
      });

      it('should be possible to update confirm button theme', async () => {
        confirm.confirmTheme = 'contained';
        await nextFrame();
        expect(confirmButton.getAttribute('theme')).to.equal('contained');
      });
    });

    describe('reject', () => {
      let rejectButton;

      beforeEach(() => {
        rejectButton = confirm.querySelector('[slot="reject-button"]');
      });

      it('should not show reject button by default', () => {
        expect(rejectButton.hasAttribute('hidden')).to.be.true;
      });

      it('should show reject button when reject is true', async () => {
        confirm.rejectButtonVisible = true;
        await nextFrame();
        expect(rejectButton.hasAttribute('hidden')).to.be.false;
      });

      it('should reflect rejectButtonVisible property to attribute', async () => {
        confirm.rejectButtonVisible = true;
        await nextFrame();
        expect(confirm.hasAttribute('reject-button-visible')).to.be.true;
      });

      it('should close dialog on reject button click', async () => {
        confirm.rejectButtonVisible = true;
        await nextFrame();
        rejectButton.click();
        expect(confirm.opened).to.be.false;
      });

      it('should have a default reject button text', () => {
        expect(rejectButton.textContent.trim()).to.equal('Reject');
      });

      it('should be possible to update reject button text', async () => {
        confirm.rejectText = 'No';
        await nextFrame();
        expect(rejectButton.textContent.trim()).to.equal('No');
      });

      it('should have a default reject button theme', () => {
        expect(rejectButton.getAttribute('theme')).to.equal('error tertiary');
      });

      it('should be possible to update reject button theme', async () => {
        confirm.rejectTheme = 'outlined';
        await nextFrame();
        expect(rejectButton.getAttribute('theme')).to.equal('outlined');
      });
    });

    describe('cancel', () => {
      let cancelButton;

      beforeEach(() => {
        cancelButton = confirm.querySelector('[slot="cancel-button"]');
      });

      it('should not show cancel button by default', () => {
        expect(cancelButton.hasAttribute('hidden')).to.be.true;
      });

      it('should show cancel button when cancel is true', async () => {
        confirm.cancelButtonVisible = true;
        await nextFrame();
        expect(cancelButton.hasAttribute('hidden')).to.be.false;
      });

      it('should reflect cancelButtonVisible property to attribute', async () => {
        confirm.cancelButtonVisible = true;
        await nextFrame();
        expect(confirm.hasAttribute('cancel-button-visible')).to.be.true;
      });

      it('should close dialog on cancel button click', async () => {
        confirm.cancelButtonVisible = true;
        await nextFrame();
        cancelButton.click();
        expect(confirm.opened).to.be.false;
      });

      it('should have a default cancel button text', () => {
        expect(cancelButton.textContent.trim()).to.equal('Cancel');
      });

      it('should be possible to update cancel button text', async () => {
        confirm.cancelText = 'Stop';
        await nextFrame();
        expect(cancelButton.textContent.trim()).to.equal('Stop');
      });

      it('should have a default cancel button theme', () => {
        expect(cancelButton.getAttribute('theme')).to.equal('tertiary');
      });

      it('should be possible to update cancel button theme', async () => {
        confirm.cancelTheme = 'contrast';
        await nextFrame();
        expect(cancelButton.getAttribute('theme')).to.equal('contrast');
      });
    });
  });

  describe('custom buttons', () => {
    let confirm, overlay;

    beforeEach(async () => {
      confirm = fixtureSync(`
        <vaadin-confirm-dialog>
          <button slot="confirm-button" theme="custom-confirm-theme">Custom Confirm</button>
          <button slot="cancel-button" theme="custom-cancel-theme">Custom Cancel</button>
          <button slot="reject-button" theme="custom-reject-theme">Custom Reject</button>
        </vaadin-confirm-dialog>
      `);
      await nextRender();
      overlay = confirm.$.overlay;
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
    let confirm;

    beforeEach(async () => {
      confirm = fixtureSync('<vaadin-confirm-dialog opened>Confirmation message</vaadin-confirm-dialog>');
      await nextRender();
    });

    it('should dispatch confirm event on confirm button click', () => {
      const spy = sinon.spy();
      confirm.addEventListener('confirm', spy);
      confirm.querySelector('[slot="confirm-button"]').click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should dispatch cancel event on cancel button click', () => {
      confirm.cancelButtonVisible = true;
      const spy = sinon.spy();
      confirm.addEventListener('cancel', spy);
      confirm.querySelector('[slot="cancel-button"]').click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should dispatch reject event on reject button click', () => {
      confirm.rejectButtonVisible = true;
      const spy = sinon.spy();
      confirm.addEventListener('reject', spy);
      confirm.querySelector('[slot="reject-button"]').click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should dispatch closed event', async () => {
      const spy = sinon.spy();
      confirm.addEventListener('closed', spy);
      confirm.opened = false;
      await nextRender();
      expect(spy.calledOnce).to.be.true;
      confirm.removeEventListener('closed', spy);
    });

    it('closed event should be called after overlay is closed', async () => {
      const closedPromise = new Promise((resolve) => {
        const closedListener = () => {
          expect(confirm.$.overlay.parentElement).to.be.not.ok;
          resolve();
        };
        listenOnce(confirm, 'closed', closedListener);
      });

      confirm.opened = false;
      await nextRender();
      await closedPromise;
    });
  });

  describe('Esc key', () => {
    let confirm, spy;

    beforeEach(async () => {
      confirm = fixtureSync('<vaadin-confirm-dialog opened>Confirmation message</vaadin-confirm-dialog>');
      await nextRender();
      spy = sinon.spy();
      confirm.addEventListener('cancel', spy);
    });

    it('should close but not cancel dialog by default', async () => {
      await sendKeys({ press: 'Escape' });
      expect(spy.called).to.be.true;
      expect(confirm.opened).to.be.false;
    });

    it('should not close and not cancel dialog with no-close-on-esc', async () => {
      confirm.noCloseOnEsc = true;
      await nextFrame();
      await sendKeys({ press: 'Escape' });
      expect(spy.called).to.be.false;
      expect(confirm.opened).to.be.true;
    });
  });

  describe('outside click', () => {
    let confirm, overlay;

    beforeEach(async () => {
      confirm = fixtureSync('<vaadin-confirm-dialog opened>Confirmation message</vaadin-confirm-dialog>');
      await nextRender();
      overlay = confirm.$.overlay;
    });

    it('should not close dialog on outside click', async () => {
      overlay.$.backdrop.click();
      await nextRender();
      expect(confirm.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should call preventDefault on vaadin-overlay-outside-click', async () => {
      const spy = sinon.spy();
      overlay.addEventListener('vaadin-overlay-outside-click', spy);

      overlay.$.backdrop.click();
      await nextRender();
      const event = spy.firstCall.args[0];
      expect(event.defaultPrevented).to.be.true;
    });
  });

  describe('theme attribute', () => {
    let confirm;

    beforeEach(async () => {
      confirm = fixtureSync('<vaadin-confirm-dialog theme="foo">Confirmation message</vaadin-confirm-dialog>');
      await nextRender();
    });

    it('should propagate theme attribute to overlay', () => {
      const themes = confirm.$.overlay.getAttribute('theme').split(' ');
      expect(themes).to.include.members(['foo']);
    });
  });

  describe('set width and height', () => {
    let confirm, overlay;

    describe('default', () => {
      beforeEach(async () => {
        confirm = fixtureSync('<vaadin-confirm-dialog opened>Confirmation message</vaadin-confirm-dialog>');
        fixtureSync(`
          <style>
            vaadin-confirm-dialog::part(overlay) {
              border: none;
            }
          </style>
        `);
        await nextRender();
        overlay = confirm.$.overlay;
      });

      afterEach(() => {
        confirm.opened = false;
      });

      it('should update width after opening the dialog', async () => {
        confirm.width = '300px';
        await nextRender();
        expect(getComputedStyle(overlay.$.overlay).width).to.equal('300px');
      });

      it('should update height after opening the dialog', async () => {
        confirm.height = '500px';
        await nextRender();
        expect(getComputedStyle(overlay.$.overlay).height).to.equal('500px');
      });

      it('should reset style after setting width to null', async () => {
        const originalWidth = getComputedStyle(overlay.$.overlay).width;

        confirm.width = '300px';
        await nextRender();
        expect(getComputedStyle(overlay.$.overlay).width).to.equal('300px');

        confirm.width = null;
        await nextRender();
        expect(getComputedStyle(overlay.$.overlay).width).to.equal(originalWidth);
      });

      it('should reset style after setting height to null', async () => {
        const originalHeight = getComputedStyle(overlay.$.overlay).height;

        confirm.height = '500px';
        await nextRender();
        expect(getComputedStyle(overlay.$.overlay).height).to.equal('500px');

        confirm.height = null;
        await nextRender();
        expect(getComputedStyle(overlay.$.overlay).height).to.equal(originalHeight);
      });

      it('should place footer part at the bottom of the overlay', async () => {
        confirm.height = '500px';
        await nextRender();
        const footer = overlay.$.overlay.querySelector('[part="footer"]');
        const overlayRect = overlay.$.overlay.getBoundingClientRect();
        expect(footer.getBoundingClientRect().bottom).to.be.closeTo(overlayRect.bottom, 0.1);
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
        confirm.width = '300px';
        document.body.appendChild(confirm);
        await nextRender();
        overlay = confirm.$.overlay;
        confirm.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
        expect(getComputedStyle(overlay.$.overlay).width).to.be.equal('300px');
      });

      it('should update height after opening the dialog', async () => {
        confirm.height = '500px';
        document.body.appendChild(confirm);
        await nextRender();
        overlay = confirm.$.overlay;
        confirm.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
        expect(getComputedStyle(overlay.$.overlay).height).to.equal('500px');
      });

      it('should set `aria-describedby` when `accessibleDescriptionRef` is set before attach', async () => {
        confirm.accessibleDescriptionRef = 'id-0';
        confirm.opened = true;
        document.body.appendChild(confirm);
        await nextRender();

        expect(confirm.getAttribute('aria-describedby')).to.equal('id-0');
      });
    });
  });

  describe('focus restoration', () => {
    let confirm, button, overlay;

    beforeEach(async () => {
      const wrapper = fixtureSync(`
        <div>
          <vaadin-confirm-dialog></vaadin-confirm-dialog>
          <button></button>
        </div>
      `);
      await nextRender();
      [confirm, button] = wrapper.children;
      overlay = confirm.$.overlay;
      button.focus();
    });

    it('should move focus to the dialog on open', async () => {
      confirm.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      const confirmButton = confirm.querySelector('[slot=confirm-button]');
      expect(getDeepActiveElement()).to.equal(confirmButton);
    });

    it('should restore focus on dialog close', async () => {
      confirm.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      confirm.opened = false;
      await aTimeout(0);
      expect(getDeepActiveElement()).to.equal(button);
    });

    it('should not scroll the page when opening the dialog', async () => {
      // Create a tall element to make the page scrollable
      const spacer = fixtureSync(`
        <div style="height: 200vh"></div>
      `);
      document.body.insertBefore(spacer, document.body.firstChild);

      // Scroll to the top
      window.scrollTo(0, 0);

      // Open the dialog (which will focus it)
      confirm.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');

      // The page should not have scrolled
      expect(window.scrollY).to.equal(0);
    });
  });

  describe('detach and re-attach', () => {
    let confirm;

    beforeEach(async () => {
      confirm = fixtureSync('<vaadin-confirm-dialog opened>Confirmation message</vaadin-confirm-dialog>');
      await nextRender();
    });

    it('should close the overlay when removed from DOM', async () => {
      confirm.remove();
      await aTimeout(0);

      expect(confirm.opened).to.be.false;
    });

    it('should restore opened state when added to the DOM', async () => {
      const parent = confirm.parentNode;
      confirm.remove();
      await nextRender();
      expect(confirm.opened).to.be.false;

      parent.appendChild(confirm);
      await nextRender();
      expect(confirm.opened).to.be.true;
    });

    it('should not close the overlay when moved within the DOM', async () => {
      const newParent = document.createElement('div');
      document.body.appendChild(newParent);
      newParent.appendChild(confirm);
      await aTimeout(0);

      expect(confirm.opened).to.be.true;
    });

    it('should not dispatch opened changed events when moved within the DOM', async () => {
      const onOpenedChanged = sinon.spy();
      confirm.addEventListener('opened-changed', onOpenedChanged);

      const newParent = document.createElement('div');
      document.body.appendChild(newParent);
      newParent.appendChild(confirm);
      await aTimeout(0);

      expect(onOpenedChanged.called).to.be.false;
    });
  });

  describe('exportparts', () => {
    let confirm, overlay;

    beforeEach(async () => {
      confirm = fixtureSync('<vaadin-confirm-dialog></vaadin-confirm-dialog>');
      await nextRender();
      overlay = confirm.$.overlay;
    });

    it('should export all overlay parts for styling', () => {
      const parts = [...overlay.shadowRoot.querySelectorAll('[part]')].map((el) => el.getAttribute('part'));
      const exportParts = overlay.getAttribute('exportparts').split(', ');

      parts.forEach((part) => {
        expect(exportParts).to.include(part);
      });
    });
  });
});
