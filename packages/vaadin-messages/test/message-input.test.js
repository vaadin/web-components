import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { keyDownOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import '../vaadin-message-input.js';

describe('message-input', () => {
  let messageInput, textArea, button;

  beforeEach(() => {
    messageInput = fixtureSync('<vaadin-message-input></vaadin-message-input>');
    textArea = messageInput.shadowRoot.querySelector('vaadin-message-input-text-area');
    button = messageInput.shadowRoot.querySelector('vaadin-message-input-button');
  });

  it('should have a valid version number', () => {
    expect(messageInput.constructor.version).to.match(/^(\d+\.)?(\d+\.)?(\d+)(-(alpha|beta)\d+)?$/);
  });

  it('message should be initialized', () => {
    expect(messageInput.shadowRoot.querySelector('vaadin-text-area')).to.be.not.undefined;
    expect(messageInput.shadowRoot.querySelector('vaadin-button')).to.be.not.undefined;
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
      keyDownOn(textArea.inputElement, 13, [], 'Enter');
      expect(spy.calledOnce).to.be.true;
    });

    it('should not fire a submit event on Shift + Enter keydown', () => {
      const spy = sinon.spy();
      messageInput.addEventListener('submit', spy);
      textArea.value = 'foo';
      keyDownOn(textArea.inputElement, 13, ['shift'], 'Enter');
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
    it('should have default button text', () => {
      expect(button.innerText).to.be.equal('Send');
    });

    it('should have default placeholder', () => {
      expect(textArea.placeholder).to.be.equal('Message');
    });

    it('should have default aria-label', () => {
      expect(textArea.inputElement.getAttribute('aria-label')).to.be.equal('Message');
    });

    it('should translate button text', () => {
      messageInput.i18n = { ...messageInput.i18n, send: 'Lähetä' };
      expect(button.innerText).to.be.equal('Lähetä');
    });

    it('should translate placeholder', () => {
      messageInput.i18n = { ...messageInput.i18n, message: 'Viesti' };
      expect(textArea.placeholder).to.be.equal('Viesti');
    });

    it('should translate aria-label', () => {
      messageInput.i18n = { ...messageInput.i18n, message: 'Viesti' };
      expect(textArea.inputElement.getAttribute('aria-label')).to.be.equal('Viesti');
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

    it('should be propagated to text-area', () => {
      messageInput.disabled = true;
      expect(textArea.disabled).to.be.true;
    });

    it('should be propagated to button', () => {
      messageInput.disabled = true;
      expect(button.disabled).to.be.true;
    });
  });
});
