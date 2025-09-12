import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, outsideClick } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { FocusRestorationController } from '../src/focus-restoration-controller.js';
import { getDeepActiveElement } from '../src/focus-utils.js';

describe('focus-restoration-controller', () => {
  let controller, button1, button2;

  beforeEach(() => {
    controller = new FocusRestorationController();

    const wrapper = fixtureSync(`
      <div>
        <button>Button 1</button>
        <button>Button 2</button>
      </div>
    `);

    [button1, button2] = wrapper.children;
  });

  it('should restore focus to the previously focused node by default', () => {
    button1.focus();
    controller.saveFocus();
    button2.focus();
    controller.restoreFocus();
    expect(getDeepActiveElement()).to.equal(button1);
  });

  it('should restore focus to a specific node when provided', () => {
    button1.focus();
    controller.saveFocus(button2);
    controller.restoreFocus();
    expect(getDeepActiveElement()).to.equal(button2);
  });

  it('should restore focus asynchronously if an outside click happened in between', async () => {
    button1.focus();
    controller.saveFocus();
    outsideClick();
    controller.restoreFocus();
    expect(getDeepActiveElement()).to.equal(document.body);
    await aTimeout(0);
    expect(getDeepActiveElement()).to.equal(button1);
  });

  it('should not restore focus if no node was saved', () => {
    button1.focus();
    controller.restoreFocus();
    expect(getDeepActiveElement()).to.equal(button1);
  });

  it('should not restore focus again if it was already restored', () => {
    button1.focus();
    controller.saveFocus();
    controller.restoreFocus();
    button2.focus();
    controller.restoreFocus();
    expect(getDeepActiveElement()).to.equal(button2);
  });

  describe('preventScroll', () => {
    it('should not prevent scroll when restoring focus synchronously by default', () => {
      button1.focus();
      const spy = sinon.spy(button2, 'focus');
      controller.saveFocus(button2);
      controller.restoreFocus();
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0]).to.deep.include({ preventScroll: false });
    });

    it('should prevent scroll when restoring focus synchronously with preventScroll', () => {
      button1.focus();
      const spy = sinon.spy(button2, 'focus');
      controller.saveFocus(button2);
      controller.restoreFocus({ preventScroll: true });
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0]).to.deep.include({ preventScroll: true });
    });

    it('should not prevent scroll when restoring focus asynchronously by default', async () => {
      button1.focus();
      const spy = sinon.spy(button2, 'focus');
      controller.saveFocus(button2);
      outsideClick();
      controller.restoreFocus();
      await aTimeout(0);
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0]).to.deep.include({ preventScroll: false });
    });

    it('should prevent scroll when restoring focus asynchronously with preventScroll', async () => {
      button1.focus();
      const spy = sinon.spy(button2, 'focus');
      controller.saveFocus(button2);
      outsideClick();
      controller.restoreFocus({ preventScroll: true });
      await aTimeout(0);
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0]).to.deep.include({ preventScroll: true });
    });
  });

  describe('focusVisible', () => {
    it('should not set focusVisible when restoring focus synchronously by default', () => {
      button1.focus();
      const spy = sinon.spy(button2, 'focus');
      controller.saveFocus(button2);
      controller.restoreFocus();
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0]).to.deep.include({ focusVisible: false });
    });

    it('should set focusVisible when restoring focus synchronously with preventScroll', () => {
      button1.focus();
      const spy = sinon.spy(button2, 'focus');
      controller.saveFocus(button2);
      controller.restoreFocus({ focusVisible: true });
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0]).to.deep.include({ focusVisible: true });
    });

    it('should not set focusVisible when restoring focus asynchronously by default', async () => {
      button1.focus();
      const spy = sinon.spy(button2, 'focus');
      controller.saveFocus(button2);
      outsideClick();
      controller.restoreFocus();
      await aTimeout(0);
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0]).to.deep.include({ focusVisible: false });
    });

    it('should set focusVisible when restoring focus asynchronously with preventScroll', async () => {
      button1.focus();
      const spy = sinon.spy(button2, 'focus');
      controller.saveFocus(button2);
      outsideClick();
      controller.restoreFocus({ focusVisible: true });
      await aTimeout(0);
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0]).to.deep.include({ focusVisible: true });
    });
  });
});
