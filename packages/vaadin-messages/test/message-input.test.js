import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import '../vaadin-message-input.js';

describe('message-input', () => {
  let messageInput;

  beforeEach(() => {
    messageInput = fixtureSync('<vaadin-message-input></vaadin-message-input>');
  });

  it('should have a valid version number', () => {
    expect(messageInput.constructor.version).to.match(/^(\d+\.)?(\d+\.)?(\d+)(-(alpha|beta)\d+)?$/);
  });

  it('message should be initialized', () => {
    expect(messageInput.shadowRoot.querySelector('vaadin-text-area')).to.be.not.undefined;
    expect(messageInput.shadowRoot.querySelector('vaadin-button')).to.be.not.undefined;
  });

  it('text area placeholder should be set', () => {
    expect(messageInput.shadowRoot.querySelector('vaadin-text-area').placeholder).to.be.equal('Message');
  });
});
