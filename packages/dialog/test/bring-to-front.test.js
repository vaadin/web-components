import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, mousedown, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-dialog.js';

describe('bringToFront and brought-to-front event', () => {
  let wrapper, dialog1, dialog2;

  beforeEach(async () => {
    wrapper = fixtureSync(`
      <div>
        <vaadin-dialog modeless>
          <div>Dialog 1 content</div>
        </vaadin-dialog>
        <vaadin-dialog modeless>
          <div>Dialog 2 content</div>
        </vaadin-dialog>
      </div>
    `);
    [dialog1, dialog2] = wrapper.children;
    dialog1.opened = true;
    await oneEvent(dialog1.$.overlay, 'vaadin-overlay-open');
    dialog2.opened = true;
    await oneEvent(dialog2.$.overlay, 'vaadin-overlay-open');
  });

  afterEach(async () => {
    dialog1.opened = false;
    dialog2.opened = false;
    await nextRender();
  });

  describe('bringToFront method', () => {
    it('should bring the dialog to the front of the overlay stack', () => {
      expect(dialog1.$.overlay._last).to.be.false;

      dialog1.bringToFront();

      expect(dialog1.$.overlay._last).to.be.true;
    });

    it('should fire brought-to-front event when the stacking order is changed', () => {
      const spy = sinon.spy();
      dialog1.addEventListener('brought-to-front', spy);

      dialog1.bringToFront();

      expect(spy).to.be.calledOnce;
    });

    it('should not fire brought-to-front event when the dialog is already frontmost', () => {
      const spy = sinon.spy();
      dialog2.addEventListener('brought-to-front', spy);

      dialog2.bringToFront();

      expect(spy).to.be.not.called;
    });

    it('should not fire brought-to-front event when the dialog is closed', async () => {
      dialog1.opened = false;
      await nextRender();

      const spy = sinon.spy();
      dialog1.addEventListener('brought-to-front', spy);

      dialog1.bringToFront();

      expect(spy).to.be.not.called;
    });
  });

  describe('pointer interaction', () => {
    it('should fire brought-to-front event on mousedown that brings the dialog to front', () => {
      const spy = sinon.spy();
      dialog1.addEventListener('brought-to-front', spy);

      mousedown(dialog1.querySelector('div'));

      expect(dialog1.$.overlay._last).to.be.true;
      expect(spy).to.be.calledOnce;
    });

    it('should not fire brought-to-front event on mousedown on the frontmost dialog', () => {
      const spy = sinon.spy();
      dialog2.addEventListener('brought-to-front', spy);

      mousedown(dialog2.querySelector('div'));

      expect(spy).to.be.not.called;
    });

    it('should not fire brought-to-front event on mousedown on a modal dialog', async () => {
      dialog1.modeless = false;
      await nextRender();

      const spy = sinon.spy();
      dialog1.addEventListener('brought-to-front', spy);

      mousedown(dialog1.querySelector('div'));

      expect(spy).to.be.not.called;
    });
  });

  describe('opening', () => {
    it('should not fire brought-to-front event when opening a dialog', async () => {
      const dialog = document.createElement('vaadin-dialog');
      dialog.modeless = true;
      wrapper.appendChild(dialog);
      await nextRender();

      const spy = sinon.spy();
      dialog.addEventListener('brought-to-front', spy);

      dialog.opened = true;
      await oneEvent(dialog.$.overlay, 'vaadin-overlay-open');

      expect(spy).to.be.not.called;

      dialog.opened = false;
      await nextRender();
    });
  });
});

describe('restoring nested dialog stacking order', () => {
  let parentDialog, childDialog, otherDialog;

  beforeEach(async () => {
    const wrapper = fixtureSync(`
      <div>
        <vaadin-dialog modeless header-title="Parent">
          <div>Parent dialog content</div>
          <vaadin-dialog modeless header-title="Child">
            <div>Child dialog content</div>
          </vaadin-dialog>
        </vaadin-dialog>
        <vaadin-dialog modeless header-title="Other">
          <div>Other dialog content</div>
        </vaadin-dialog>
      </div>
    `);
    [parentDialog, otherDialog] = wrapper.children;
    childDialog = parentDialog.querySelector('vaadin-dialog');

    parentDialog.opened = true;
    await oneEvent(parentDialog.$.overlay, 'vaadin-overlay-open');
    childDialog.opened = true;
    await oneEvent(childDialog.$.overlay, 'vaadin-overlay-open');
    otherDialog.opened = true;
    await oneEvent(otherDialog.$.overlay, 'vaadin-overlay-open');
  });

  afterEach(async () => {
    parentDialog.opened = false;
    otherDialog.opened = false;
    await nextRender();
  });

  it('should allow keeping the nested dialog on top using brought-to-front event', () => {
    // Userland policy: keep the nested dialog on top of its parent.
    parentDialog.addEventListener('brought-to-front', () => {
      childDialog.bringToFront();
    });

    // Interacting with the parent brings it to front, and the listener
    // restores the nested dialog on top of it.
    mousedown(parentDialog.$.overlay.headerTitleElement);

    expect(childDialog.$.overlay._last).to.be.true;
    expect(otherDialog.$.overlay._last).to.be.false;
  });

  it('should fire brought-to-front event for the nested dialog raised by the listener', () => {
    const parentSpy = sinon.spy();
    const childSpy = sinon.spy();
    parentDialog.addEventListener('brought-to-front', parentSpy);
    childDialog.addEventListener('brought-to-front', childSpy);

    parentDialog.addEventListener('brought-to-front', () => {
      childDialog.bringToFront();
    });

    mousedown(parentDialog.$.overlay.headerTitleElement);

    expect(parentSpy).to.be.calledOnce;
    expect(childSpy).to.be.calledOnce;

    // Re-raising the already frontmost child again is a no-op.
    childDialog.bringToFront();
    expect(childSpy).to.be.calledOnce;
  });
});
