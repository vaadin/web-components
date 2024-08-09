import { expect } from '@vaadin/chai-plugins';
import { defineCustomElement } from '../src/define.js';

describe('define', () => {
  before(() => {
    defineCustomElement(
      class XElement extends HTMLElement {
        static get is() {
          return 'x-element';
        }
      },
    );
  });

  it('should define a custom element', () => {
    expect(customElements.get('x-element')).to.be.ok;
  });

  it('should have a valid version number', () => {
    expect(customElements.get('x-element').version).to.match(/^(\d+\.)?(\d+\.)?(\d+)(-(alpha|beta|rc)\d+)?$/u);
  });
});
