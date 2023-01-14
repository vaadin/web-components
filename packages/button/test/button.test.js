import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../vaadin-button.js';

describe('vaadin-button', () => {
  let button;

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      button = fixtureSync('<vaadin-button></vaadin-button>');
      tagName = button.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('role', () => {
    describe('default', () => {
      beforeEach(async () => {
        button = fixtureSync('<vaadin-button>Press me</vaadin-button>');
        await nextRender();
      });

      it('should set role attribute to button by default', () => {
        expect(button.getAttribute('role')).to.equal('button');
      });
    });

    describe('custom', () => {
      beforeEach(async () => {
        button = fixtureSync('<vaadin-button role="menuitem">Press me</vaadin-button>');
        await nextRender();
      });

      it('should not override custom role attribute', () => {
        expect(button.getAttribute('role')).to.equal('menuitem');
      });
    });
  });

  describe('keyboard', () => {
    beforeEach(async () => {
      button = fixtureSync('<vaadin-button>Press me</vaadin-button>');
      await nextRender();
      button.focus();
    });

    ['Enter', 'Space'].forEach((key) => {
      it(`should fire click event on ${key}`, async () => {
        const spy = sinon.spy();
        button.addEventListener('click', spy);

        await sendKeys({ down: key });

        expect(spy.calledOnce).to.be.true;
      });

      it(`should not fire click event on ${key} when disabled`, async () => {
        const spy = sinon.spy();
        button.addEventListener('click', spy);
        button.disabled = true;

        await sendKeys({ down: key });

        expect(spy.called).to.be.false;
      });

      it(`should prevent default behavior for keydown event on ${key}`, async () => {
        const spy = sinon.spy();
        button.addEventListener('keydown', spy);

        await sendKeys({ down: key });

        const event = spy.firstCall.args[0];
        expect(event).to.be.an.instanceOf(KeyboardEvent);
        expect(event.defaultPrevented).to.be.true;
      });
    });

    it('should not prevent default behavior for keydown event on non-activation key', async () => {
      const spy = sinon.spy();
      button.addEventListener('keydown', spy);

      await sendKeys({ down: 'ArrowDown' });

      const event = spy.firstCall.args[0];
      expect(event).to.be.an.instanceOf(KeyboardEvent);
      expect(event.defaultPrevented).to.be.false;
    });
  });
});
