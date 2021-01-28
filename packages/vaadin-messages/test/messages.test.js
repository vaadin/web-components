import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import '../vaadin-messages.js';

describe('messages', () => {
  let messages, value;

  beforeEach(() => {
    messages = fixtureSync('<vaadin-messages></vaadin-messages>');
    value = messages.shadowRoot.querySelector('[part="value"]');
  });

  it('should have a valid version number', () => {
    expect(messages.constructor.version).to.match(/^(\d+\.)?(\d+\.)?(\d+)(-(alpha|beta)\d+)?$/);
  });

  it('should say initially hello world', () => {
    expect(value.textContent).to.be.equal('hello world');
  });

  it('should say hello tests', () => {
    messages.value = 'hello tests';
    expect(value.textContent).to.be.equal('hello tests');
  });
});
