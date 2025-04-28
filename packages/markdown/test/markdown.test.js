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

  it('should be hidden', () => {
    element.hidden = true;
    expect(getComputedStyle(element).display).to.equal('none');
  });

  it('should be hidden with external display styles in place', () => {
    fixtureSync('<style>vaadin-markdown { display: block; }</style>');

    element.hidden = true;
    expect(getComputedStyle(element).display).to.equal('none');
  });
});
