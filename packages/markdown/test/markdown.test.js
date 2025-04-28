import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../src/vaadin-markdown.js';

describe('vaadin-markdown', () => {
  let element;

  beforeEach(async () => {
    element = fixtureSync('<vaadin-markdown></vaadin-markdown>');
    await nextUpdate(element);
  });

  it('should be defined', () => {
    expect(element.localName).to.equal('vaadin-markdown');
    expect(window.customElements.get('vaadin-markdown')).to.be.ok;
  });
});
