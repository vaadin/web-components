import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-message.js';

describe('message', () => {
  let message, tagName;

  beforeEach(() => {
    message = fixtureSync('<vaadin-message>Hello</vaadin-message>');
    tagName = message.tagName.toLowerCase();
  });

  it('should be defined in custom element registry', () => {
    expect(customElements.get(tagName)).to.be.ok;
  });

  it('should have a valid static "is" getter', () => {
    expect(customElements.get(tagName).is).to.equal(tagName);
  });
});
