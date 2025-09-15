import { expect } from '@vaadin/chai-plugins';
import { enterKeyDown, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-message-input.js';

describe('message-input', () => {
  let messageInput, textArea, button;

  beforeEach(async () => {
    messageInput = fixtureSync('<vaadin-message-input></vaadin-message-input>');
    await nextRender();
    textArea = messageInput.querySelector('vaadin-text-area');
    button = messageInput.querySelector('vaadin-message-input-button');
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = messageInput.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('hidden', () => {
    it('should have display: none when hidden', () => {
      messageInput.setAttribute('hidden', '');
      expect(getComputedStyle(messageInput).display).to.equal('none');
    });
  });

  describe('submit functionality', () => {
    it('should fire a submit event on button click', () => {
      const spy = sinon.spy();
      messageInput.addEventListener('submit', spy);
      messageInput.value = 'foo';
      button.click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire a submit event on Enter keydown', () => {
      const spy = sinon.spy();
      messageInput.addEventListener('submit', spy);
      textArea.value = 'foo';
      enterKeyDown(textArea.inputElement);
      expect(spy.calledOnce).to.be.true;
    });

    it('should not fire a submit event on Shift + Enter keydown', () => {
      const spy = sinon.spy();
      messageInput.addEventListener('submit', spy);
      textArea.value = 'foo';
      enterKeyDown(textArea.inputElement, ['shift']);
      expect(spy.called).to.be.false;
    });

    it('should not fire a submit event if value is empty', () => {
      const spy = sinon.spy();
      messageInput.addEventListener('submit', spy);
      button.click();
      expect(spy.called).to.be.false;
    });

    it('should empty input after submit', () => {
      messageInput.value = 'foo';
      expect(messageInput.value).to.be.equal('foo');
      button.click();
      expect(messageInput.value).to.be.empty;
    });

    it('should contain filled value in submit event', () => {
      const spy = sinon.spy();
      messageInput.addEventListener('submit', spy);
      textArea.value = 'foo';
      button.click();
      const e = spy.firstCall.args[0];
      expect(e.detail.value).to.be.equal('foo');
    });

    it('should focus input after submit', () => {
      const spy = sinon.spy(textArea, 'focus');
      textArea.value = 'foo';
      button.click();
      expect(spy.called).to.be.true;
    });
  });

  describe('i18n', () => {
    it('should translate button text', () => {
      messageInput.i18n = { send: 'Lähetä' };
      expect(button.innerText).to.be.equal('Lähetä');
    });

    it('should translate placeholder', () => {
      messageInput.i18n = { message: 'Viesti' };
      expect(textArea.placeholder).to.be.equal('Viesti');
    });

    it('should translate aria-label', async () => {
      messageInput.i18n = { message: 'Viesti' };
      await nextFrame();
      expect(textArea.inputElement.getAttribute('aria-label')).to.be.equal('Viesti');
    });

    it('should support partial i18n', () => {
      messageInput.i18n = { send: 'Lähetä' };
      expect(button.innerText).to.be.equal('Lähetä');
      expect(textArea.placeholder).to.be.equal('Message');
    });
  });

  describe('disabled property', () => {
    it('should be false by default', () => {
      expect(messageInput.disabled).to.be.false;
    });

    it('should be reflected to the attribute', () => {
      messageInput.disabled = true;
      expect(messageInput.getAttribute('disabled')).to.exist;
    });
  });

  describe('focus', () => {
    it('should focus the text-area when calling focus()', () => {
      const spy = sinon.spy(textArea, 'focus');
      messageInput.focus();
      expect(spy).to.be.calledOnce;
    });

    it('should not throw on focus when not attached to the DOM', () => {
      const element = document.createElement('vaadin-message-input');
      expect(() => element.focus()).not.to.throw(Error);
    });
  });
});
