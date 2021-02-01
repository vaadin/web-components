import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import '../vaadin-message.js';

describe('message', () => {
  let message, value;

  beforeEach(() => {
    message = fixtureSync('<vaadin-message></vaadin-message>');
    value = message.shadowRoot.querySelector('[part="value"]');
  });

  it('should have a valid version number', () => {
    expect(message.constructor.version).to.match(/^(\d+\.)?(\d+\.)?(\d+)(-(alpha|beta)\d+)?$/);
  });

  it('should say initially hello world', () => {
    expect(value.textContent).to.be.equal('hello world');
  });

  it('should say hello tests', () => {
    message.value = 'hello tests';
    expect(value.textContent).to.be.equal('hello tests');
  });
});
