import { expect } from '@vaadin/chai-plugins';
import { aTimeout, click, esc, fixtureSync, listenOnce, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';

describe('vaadin-dialog', () => {
  describe('custom element definition', () => {
    let dialog, tagName;

    beforeEach(async () => {
      dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
      await nextRender();
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

    beforeEach(async () => {
      dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
      await nextRender();
    });

    it('should enforce display: none to hide the host element', () => {
      dialog.style.display = 'block';
      expect(getComputedStyle(dialog).display).to.equal('none');
    });
  });

  describe('opened', () => {
    let dialog, backdrop, overlay;

    beforeEach(async () => {
      dialog = fixtureSync('<vaadin-dialog opened></vaadin-dialog>');
      await nextRender();

      dialog.renderer = (root) => {
        root.innerHTML = '<div>Simple dialog</div>';
      };
      await nextUpdate(dialog);

      overlay = dialog.$.overlay;
      backdrop = overlay.$.backdrop;
    });

    afterEach(async () => {
      dialog.opened = false;
      await nextRender();
    });

    describe('aria-label', () => {
      beforeEach(async () => {
        dialog.ariaLabel = 'accessible';
        await nextUpdate(dialog);
      });

      it('should set `aria-label` attribute on the overlay when ariaLabel is set', () => {
        expect(overlay.getAttribute('aria-label')).to.be.eql('accessible');
      });

      it('should remove `aria-label` attribute from the overlay when set to undefined', async () => {
        dialog.ariaLabel = undefined;
        await nextUpdate(dialog);
        expect(overlay.getAttribute('aria-label')).to.be.null;
      });

      it('should remove `aria-label` attribute from the overlay when set to null', async () => {
        dialog.ariaLabel = null;
        await nextUpdate(dialog);
        expect(overlay.getAttribute('aria-label')).to.be.null;
      });

      it('should remove `aria-label` attribute from the overlay when set to empty string', async () => {
        dialog.ariaLabel = '';
        await nextUpdate(dialog);
        expect(overlay.getAttribute('aria-label')).to.be.null;
      });
    });

    describe('no-close-on-esc', () => {
      it('should close itself on ESC press by default', async () => {
        esc(document.body);
        await nextUpdate(dialog);
        expect(dialog.opened).to.be.false;
      });

      it('should not close itself on ESC press when no-close-on-esc is true', async () => {
        dialog.noCloseOnEsc = true;
        await nextUpdate(dialog);
        esc(document.body);
        expect(dialog.opened).to.be.true;
      });
    });

    describe('no-close-on-outside-click', () => {
      it('should close itself on outside click by default', async () => {
        click(backdrop);
        await nextUpdate(dialog);
        expect(dialog.opened).to.be.false;
      });

      it('should not close itself on outside click when no-close-on-outside-click is true', async () => {
        dialog.noCloseOnOutsideClick = true;
        await nextUpdate(dialog);
        click(backdrop);
        await nextUpdate(dialog);
        expect(dialog.opened).to.be.true;
      });
    });

    describe('removing and adding to the DOM', () => {
      it('should close the overlay when removed from DOM', async () => {
        dialog.remove();
        await aTimeout(0);

        expect(dialog.opened).to.be.false;
      });

      it('should restore opened state when added to the DOM', async () => {
        const parent = dialog.parentNode;
        dialog.remove();
        await nextRender();
        expect(dialog.opened).to.be.false;

        parent.appendChild(dialog);
        await nextRender();
        expect(dialog.opened).to.be.true;
      });

      it('should not close the overlay when moved within the DOM', async () => {
        const newParent = document.createElement('div');
        document.body.appendChild(newParent);
        newParent.appendChild(dialog);
        await aTimeout(0);

        expect(dialog.opened).to.be.true;
      });

      it('should not dispatch opened changed events when moved within the DOM', async () => {
        const onOpenedChanged = sinon.spy();
        dialog.addEventListener('opened-changed', onOpenedChanged);

        const newParent = document.createElement('div');
        document.body.appendChild(newParent);
        newParent.appendChild(dialog);
        await aTimeout(0);

        expect(onOpenedChanged.called).to.be.false;
      });
    });

    describe('modeless', () => {
      it('should be modal by default', () => {
        expect(overlay.modeless).to.be.false;
        expect(backdrop.hidden).to.be.false;
      });

      it('should not be modal when modeless is true', async () => {
        dialog.modeless = true;
        await nextUpdate(dialog);
        expect(overlay.modeless).to.be.true;
        expect(backdrop.hidden).to.be.true;
      });
    });

    describe('closed event', () => {
      it('should dispatch closed event when closed', async () => {
        const closedSpy = sinon.spy();
        dialog.addEventListener('closed', closedSpy);
        dialog.opened = false;
        await nextRender();
        expect(closedSpy.calledOnce).to.be.true;
        dialog.removeEventListener('closed', closedSpy);
      });

      it('closed event should be called after overlay is closed', async () => {
        const closedPromise = new Promise((resolve) => {
          const closedListener = () => {
            expect(dialog._overlayElement.parentElement).to.be.not.ok;
            resolve();
          };
          listenOnce(dialog, 'closed', closedListener);
        });
        dialog.opened = false;
        await nextRender();
        await closedPromise;
      });
    });
  });

  describe('without renderer', () => {
    let dialog;

    beforeEach(async () => {
      dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
      await nextRender();
    });

    afterEach(async () => {
      dialog.opened = false;
      await nextRender();
    });

    it('should not throw an exception if renderer is not present', async () => {
      try {
        dialog.opened = true;
        await nextRender();
      } catch (e) {
        expect.fail(`Error when opening dialog: ${e}`);
      }
    });

    it('should have min-width for content', async () => {
      dialog.opened = true;
      await nextRender();
      const contentMinWidth = parseFloat(getComputedStyle(dialog.$.overlay.$.content).minWidth);
      expect(contentMinWidth).to.be.gt(0);
    });
  });

  describe('focus restoration', () => {
    let dialog, button, overlay;

    beforeEach(async () => {
      const wrapper = fixtureSync(`
        <div>
          <vaadin-dialog></vaadin-dialog>
          <button></button>
        </div>
      `);
      [dialog, button] = wrapper.children;
      await nextRender();
      overlay = dialog.$.overlay;
      button.focus();
    });

    afterEach(async () => {
      dialog.opened = false;
      await nextRender();
    });

    it('should move focus to the dialog on open', async () => {
      dialog.opened = true;
      await nextRender();
      expect(getDeepActiveElement()).to.equal(overlay.$.overlay);
    });

    it('should restore focus on dialog close', async () => {
      dialog.opened = true;
      await nextRender();
      dialog.opened = false;
      await nextRender();
      expect(getDeepActiveElement()).to.equal(button);
    });
  });

  describe('position/sizing', () => {
    let dialog, overlay;

    beforeEach(async () => {
      dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
      await nextRender();
      overlay = dialog.$.overlay;
    });

    afterEach(async () => {
      dialog.opened = false;
      await nextRender();
    });

    it('should default to px unit when unitless values are provided', async () => {
      dialog.opened = true;
      await nextRender();
      dialog.left = 100;
      dialog.top = 200;
      dialog.width = 300;
      dialog.height = 400;
      await nextRender();
      expect(overlay.$.overlay.style.position).to.equal('absolute');
      expect(overlay.$.overlay.style.top).to.equal('200px');
      expect(overlay.$.overlay.style.left).to.equal('100px');
      expect(overlay.$.overlay.style.width).to.equal('300px');
      expect(overlay.$.overlay.style.height).to.equal('400px');
    });

    it('should allow setting position/size with units', async () => {
      dialog.opened = true;
      await nextRender();
      dialog.left = '100px';
      dialog.top = '10em';
      dialog.width = '200px';
      dialog.height = '20em';
      await nextRender();
      expect(overlay.$.overlay.style.position).to.equal('absolute');
      expect(overlay.$.overlay.style.top).to.equal('10em');
      expect(overlay.$.overlay.style.left).to.equal('100px');
      expect(overlay.$.overlay.style.width).to.equal('200px');
      expect(overlay.$.overlay.style.height).to.equal('20em');
    });

    it('should allow setting position/size through attribute', async () => {
      dialog.opened = true;
      await nextRender();
      dialog.setAttribute('left', 100);
      dialog.setAttribute('top', 200);
      dialog.setAttribute('width', 300);
      dialog.setAttribute('height', 400);
      await nextRender();
      expect(overlay.$.overlay.style.position).to.equal('absolute');
      expect(overlay.$.overlay.style.left).to.equal('100px');
      expect(overlay.$.overlay.style.top).to.equal('200px');
      expect(overlay.$.overlay.style.width).to.equal('300px');
      expect(overlay.$.overlay.style.height).to.equal('400px');
    });

    it('should allow declaring position/size as attributes', async () => {
      dialog = fixtureSync('<vaadin-dialog top="100px" left="200px" width="100px" height="200px"></vaadin-dialog>');
      await nextRender();
      const overlay = dialog.$.overlay.$.overlay;
      expect(overlay.style.top).to.be.equal('100px');
      expect(overlay.style.left).to.be.equal('200px');
      expect(overlay.style.width).to.be.equal('100px');
      expect(overlay.style.height).to.be.equal('200px');
    });
  });
});
